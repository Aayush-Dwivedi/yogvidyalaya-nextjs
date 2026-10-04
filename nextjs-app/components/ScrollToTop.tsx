'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Resets window scroll to top when navigating between routes
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}
