'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export class TimeoutError extends Error {
  constructor(message = 'The request took longer than expected and timed out.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export interface UseEmblemLoaderOptions<T> {
  /**
   * Minimum duration in seconds that the loader must be shown (at least X seconds).
   * Default: 2.0 seconds.
   */
  minDurationSeconds?: number;

  /**
   * Maximum duration in seconds before timing out if the API has not resolved.
   * Default: 15.0 seconds.
   */
  timeoutSeconds?: number;

  /**
   * Async function representing the API call or data fetch.
   */
  fetcher?: (signal?: AbortSignal) => Promise<T>;

  /**
   * If true and fetcher is provided, executes automatically on mount.
   * Default: false.
   */
  autoStart?: boolean;

  /**
   * Optional callback when data is successfully resolved and min duration has passed.
   */
  onSuccess?: (data: T) => void;

  /**
   * Optional callback when an error occurs during fetch.
   */
  onError?: (error: Error) => void;

  /**
   * Optional callback when the request exceeds timeoutSeconds.
   */
  onTimeout?: () => void;
}

export interface UseEmblemLoaderReturn<T> {
  isLoading: boolean;
  isTimeout: boolean;
  isSuccess: boolean;
  error: Error | null;
  data: T | null;
  elapsedSeconds: number;
  execute: (customFetcher?: (signal?: AbortSignal) => Promise<T>) => Promise<T | undefined>;
  retry: () => Promise<T | undefined>;
  reset: () => void;
}

export function useEmblemLoader<T = any>({
  minDurationSeconds = 2.0,
  timeoutSeconds = 15.0,
  fetcher,
  autoStart = false,
  onSuccess,
  onError,
  onTimeout,
}: UseEmblemLoaderOptions<T> = {}): UseEmblemLoaderReturn<T> {
  const [isLoading, setIsLoading] = useState<boolean>(autoStart && !!fetcher);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const minDurationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);

  // Store latest callbacks in refs to avoid re-triggering effects
  const callbacksRef = useRef({ onSuccess, onError, onTimeout, fetcher });
  useEffect(() => {
    callbacksRef.current = { onSuccess, onError, onTimeout, fetcher };
  });

  const clearAllTimers = useCallback(() => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (minDurationTimerRef.current) clearTimeout(minDurationTimerRef.current);
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current);
    timeoutTimerRef.current = null;
    minDurationTimerRef.current = null;
    elapsedIntervalRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearAllTimers();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setIsTimeout(false);
    setIsSuccess(false);
    setError(null);
    setData(null);
    setElapsedSeconds(0);
  }, [clearAllTimers]);

  const execute = useCallback(
    async (customFetcher?: (signal?: AbortSignal) => Promise<T>): Promise<T | undefined> => {
      const activeFetcher = customFetcher || callbacksRef.current.fetcher;
      if (!activeFetcher) {
        console.warn('useEmblemLoader: No fetcher function provided to execute.');
        return undefined;
      }

      // 1. Reset state for new run
      clearAllTimers();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setIsTimeout(false);
      setIsSuccess(false);
      setError(null);
      setData(null);
      setElapsedSeconds(0);

      const startTime = Date.now();
      startTimeRef.current = startTime;

      // Elapsed ticker every 100ms
      elapsedIntervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        const now = Date.now();
        setElapsedSeconds(Number(((now - startTime) / 1000).toFixed(1)));
      }, 100);

      const minDurationMs = Math.max(0, minDurationSeconds * 1000);
      const timeoutMs = Math.max(minDurationMs, timeoutSeconds * 1000);

      // 2. Setup minimum duration promise
      const minDurationPromise = new Promise<void>((resolve) => {
        minDurationTimerRef.current = setTimeout(() => {
          resolve();
        }, minDurationMs);
      });

      // 3. Setup timeout promise
      let timedOut = false;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutTimerRef.current = setTimeout(() => {
          timedOut = true;
          abortController.abort();
          reject(new TimeoutError(`Request timed out after ${timeoutSeconds}s`));
        }, timeoutMs);
      });

      try {
        // Race API fetch against hard timeout
        const fetchPromise = activeFetcher(abortController.signal);
        const result = await Promise.race([fetchPromise, timeoutPromise]);

        // Once fetch succeeds, wait for minimum duration to elapse (at least X seconds)
        await minDurationPromise;

        if (!isMountedRef.current) return undefined;

        clearAllTimers();
        setIsLoading(false);
        setIsSuccess(true);
        setData(result);
        setError(null);

        if (callbacksRef.current.onSuccess) {
          callbacksRef.current.onSuccess(result);
        }
        return result;
      } catch (err: any) {
        if (!isMountedRef.current) return undefined;

        // Even on error, honor the minimum animation duration so UI doesn't violently flash
        await minDurationPromise;

        clearAllTimers();
        setIsLoading(false);

        if (timedOut || err?.name === 'TimeoutError' || err?.name === 'AbortError') {
          setIsTimeout(true);
          const timeoutErr = new TimeoutError(
            `Connection timed out after ${timeoutSeconds}s. Please check your network and try again.`
          );
          setError(timeoutErr);
          if (callbacksRef.current.onTimeout) {
            callbacksRef.current.onTimeout();
          }
        } else {
          setError(err);
          if (callbacksRef.current.onError) {
            callbacksRef.current.onError(err);
          }
        }
        return undefined;
      }
    },
    [clearAllTimers, minDurationSeconds, timeoutSeconds]
  );

  const retry = useCallback(async () => {
    return execute();
  }, [execute]);

  // Handle auto-start on mount
  useEffect(() => {
    isMountedRef.current = true;
    if (autoStart && callbacksRef.current.fetcher) {
      execute();
    }
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoStart, clearAllTimers, execute]);

  return {
    isLoading,
    isTimeout,
    isSuccess,
    error,
    data,
    elapsedSeconds,
    execute,
    retry,
    reset,
  };
}
