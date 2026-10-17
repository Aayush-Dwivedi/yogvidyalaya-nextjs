'use client';

import React, { useState } from 'react';
import { KalptaruLoader } from './KalptaruLoader';
import { useEmblemLoader } from '../../hooks/useEmblemLoader';
import { Play, RotateCcw, Clock, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export const LoaderDemo: React.FC = () => {
  const [minDurationSec, setMinDurationSec] = useState<number>(2.5);
  const [timeoutSec, setTimeoutSec] = useState<number>(8.0);
  const [fullScreenOpen, setFullScreenOpen] = useState<boolean>(false);
  const [lastApiStatus, setLastApiStatus] = useState<string>('Ready to test');

  // Simulated API fetcher with variable response times
  const createMockApiFetcher = (delayMs: number, shouldFail = false) => {
    return async (signal?: AbortSignal) => {
      setLastApiStatus(`API fetch running (duration: ${(delayMs / 1000).toFixed(1)}s)...`);

      return new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => {
          if (shouldFail) {
            reject(new Error('Internal server error occurred'));
          } else {
            resolve(`Authentic sadhana data successfully loaded in ${(delayMs / 1000).toFixed(1)}s!`);
          }
        }, delayMs);

        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timer);
            reject(new Error('Request was aborted'));
          });
        }
      });
    };
  };

  const {
    isLoading,
    isTimeout,
    isSuccess,
    error,
    data,
    elapsedSeconds,
    execute,
    retry,
    reset,
  } = useEmblemLoader({
    minDurationSeconds: minDurationSec,
    timeoutSeconds: timeoutSec,
    onSuccess: (res) => {
      setLastApiStatus(`Success: ${res}`);
    },
    onTimeout: () => {
      setLastApiStatus(`Timed out! Exceeded ${timeoutSec}s`);
    },
    onError: (err) => {
      setLastApiStatus(`Error: ${err.message}`);
    },
  });

  const handleTestFastApi = () => {
    // API returns very fast in 400ms, but loader will hold for at least X seconds!
    execute(createMockApiFetcher(400));
  };

  const handleTestSlowApi = () => {
    // API takes 4.5 seconds (slower than minDuration, but within timeout)
    execute(createMockApiFetcher(4500));
  };

  const handleTestTimeoutApi = () => {
    // API takes 20 seconds, exceeding timeoutSec
    execute(createMockApiFetcher(20000));
  };

  return (
    <div className="w-full bg-[#180718] text-ivory rounded-3xl border border-gold-500/30 p-6 sm:p-10 shadow-modal relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-plum-900/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gold-500/20 pb-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Animated Brand Loader</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Configurable Minimum Duration &amp; Timeout Loader
            </h3>
            <p className="text-xs sm:text-sm text-ivory/80 font-sans leading-relaxed">
              Guarantees the loader animates for <strong>at least X seconds</strong> to prevent jarring UI flashes, keeps loading until the API finishes, or triggers a graceful timeout state with retry options.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFullScreenOpen(true);
              execute(createMockApiFetcher(2500));
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/20 hover:bg-gold-500/30 text-gold-200 border border-gold-400/40 text-xs font-sans font-medium transition-all cursor-pointer self-start md:self-auto"
          >
            <span>Preview Full-Screen Modal</span>
          </button>
        </div>

        {/* Interactive Controls & Live Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-plum-950/80 p-6 rounded-2xl border border-gold-500/20 shadow-soft">
            <h4 className="text-xs uppercase font-mono tracking-wider text-gold-400 font-semibold border-b border-gold-500/20 pb-2">
              Configuration Parameters
            </h4>

            {/* Configurable X (Min Duration) Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <label className="text-ivory font-medium">
                  At Least X Seconds (Min Duration):
                </label>
                <span className="font-mono text-gold-300 font-bold bg-plum-900 px-2 py-0.5 rounded border border-gold-400/30">
                  {minDurationSec.toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.5"
                value={minDurationSec}
                onChange={(e) => setMinDurationSec(parseFloat(e.target.value))}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ivory/50">
                <span>0.5s</span>
                <span>2.5s (Recommended)</span>
                <span>6.0s</span>
              </div>
              <p className="text-[11px] text-ivory/70 leading-relaxed pt-1">
                Even if the API finishes in 200ms, the loader stays smooth for at least this long.
              </p>
            </div>

            {/* Timeout Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <label className="text-ivory font-medium">
                  Timeout Threshold:
                </label>
                <span className="font-mono text-gold-300 font-bold bg-plum-900 px-2 py-0.5 rounded border border-gold-400/30">
                  {timeoutSec.toFixed(1)}s
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="20.0"
                step="1.0"
                value={timeoutSec}
                onChange={(e) => setTimeoutSec(parseFloat(e.target.value))}
                className="w-full accent-gold-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ivory/50">
                <span>3.0s</span>
                <span>8.0s</span>
                <span>20.0s</span>
              </div>
              <p className="text-[11px] text-ivory/70 leading-relaxed pt-1">
                If the server or network exceeds this duration, the loader declares a timeout.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] uppercase font-mono tracking-wider text-ivory/60 block">
                Simulate Scenarios:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleTestFastApi}
                  className="px-3 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-plum-950 font-sans font-semibold text-xs transition-all shadow-sm"
                >
                  Fast API (0.4s)
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleTestSlowApi}
                  className="px-3 py-2.5 rounded-xl bg-plum-900 hover:bg-plum-800 disabled:opacity-50 text-gold-200 border border-gold-400/30 font-sans font-medium text-xs transition-all"
                >
                  Slow API (4.5s)
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleTestTimeoutApi}
                  className="px-3 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 disabled:opacity-50 text-red-200 border border-red-500/40 font-sans font-medium text-xs transition-all"
                >
                  Trigger Timeout
                </button>
              </div>
            </div>

            {/* Live Status Bar */}
            <div className="pt-3 border-t border-gold-500/20 text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-ivory/70">
                <span>Status:</span>
                <span className={isLoading ? 'text-gold-300 animate-pulse' : isTimeout ? 'text-red-400' : isSuccess ? 'text-emerald-400' : 'text-ivory/60'}>
                  {isLoading ? `Loading (${elapsedSeconds.toFixed(1)}s)` : isTimeout ? 'Timed Out' : isSuccess ? 'Loaded' : 'Idle'}
                </span>
              </div>
              <p className="text-[11px] text-ivory/60 truncate">
                {lastApiStatus}
              </p>
            </div>
          </div>

          {/* Live Stage Column (7 cols) */}
          <div className="lg:col-span-7 bg-plum-950/90 rounded-2xl border border-gold-500/30 p-8 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
            {isLoading || isTimeout ? (
              <KalptaruLoader
                message="Harmonizing breath & consciousness..."
                subMessage="Kalptaruu Yoga Vidhyalaya"
                size={140}
                isTimeout={isTimeout}
                timeoutMessage={`Connection took longer than ${timeoutSec}s and timed out.`}
                onRetry={retry}
                showElapsed={true}
                elapsedSeconds={elapsedSeconds}
                minDurationSeconds={minDurationSec}
              />
            ) : isSuccess ? (
              <div className="text-center space-y-4 max-w-md mx-auto animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 mx-auto flex items-center justify-center shadow-soft">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xl font-editorial font-bold text-white">
                    Data Loaded Successfully
                  </h4>
                  <p className="text-xs text-ivory/80 font-sans leading-relaxed">
                    {data}
                  </p>
                  <p className="text-[11px] font-mono text-gold-400/80 pt-1">
                    Total animation time: {elapsedSeconds.toFixed(1)}s (enforced min {minDurationSec}s)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="px-5 py-2 rounded-full bg-plum-900 hover:bg-plum-800 text-gold-300 border border-gold-400/40 text-xs font-medium transition-all"
                >
                  Reset Demo
                </button>
              </div>
            ) : (
              <div className="text-center space-y-3 max-w-sm mx-auto">
                <div className="w-20 h-20 rounded-full border border-gold-400/30 p-1 mx-auto flex items-center justify-center bg-plum-900/60 shadow-soft">
                  <img
                    src="/kalptaru-logo.webp"
                    alt="Logo preview"
                    className="w-full h-full rounded-full object-cover opacity-80"
                  />
                </div>
                <h4 className="text-lg font-editorial text-gold-200">
                  Ready to Preview
                </h4>
                <p className="text-xs text-ivory/70 leading-relaxed font-sans">
                  Click any simulation button on the left to see the emblem animate with the sweeping golden arc and floating particles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Modal Preview */}
      {fullScreenOpen && (
        <div className="relative z-50">
          <KalptaruLoader
            fullScreen={true}
            message="Harmonizing breath & consciousness..."
            subMessage="Kalptaruu Yoga Vidhyalaya"
            size={160}
            isTimeout={isTimeout}
            onRetry={retry}
            showElapsed={true}
            elapsedSeconds={elapsedSeconds}
            minDurationSeconds={minDurationSec}
          />

          {/* Close button for preview */}
          <button
            type="button"
            onClick={() => {
              setFullScreenOpen(false);
              reset();
            }}
            className="fixed top-6 right-6 z-[60] px-4 py-2 rounded-full bg-plum-900/90 text-gold-300 border border-gold-400/50 text-xs font-mono font-medium hover:bg-plum-800 transition-all cursor-pointer shadow-modal"
          >
            Close Full-Screen [Esc]
          </button>
        </div>
      )}
    </div>
  );
};

export default LoaderDemo;
