import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Keeps the screen awake using the Screen Wake Lock API.
 *
 * Handles the main quirk of the API: the OS silently releases the lock when the
 * page is hidden (tab switch, lock screen), so we re-acquire it on
 * `visibilitychange` while the lock is meant to be active.
 */
export function useWakeLock() {
  const [isSupported, setIsSupported] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      sentinelRef.current = sentinel;
      sentinel.addEventListener('release', () => {
        // Fires on both explicit release and OS-initiated release (e.g. tab hidden).
        if (sentinelRef.current === sentinel) {
          sentinelRef.current = null;
          setIsLocked(false);
        }
      });
      setIsLocked(true);
    } catch {
      // Rejected (e.g. tab not visible, low battery) — leave the lock off.
      setIsLocked(false);
    }
  }, []);

  const release = useCallback(async () => {
    const sentinel = sentinelRef.current;
    sentinelRef.current = null;
    setIsLocked(false);
    await sentinel?.release().catch(() => {});
  }, []);

  // Re-acquire when the page becomes visible again, if the lock should be on.
  useEffect(() => {
    if (!isLocked) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !sentinelRef.current) {
        void request();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLocked, request]);

  // Release on unmount.
  useEffect(() => {
    return () => {
      void sentinelRef.current?.release().catch(() => {});
      sentinelRef.current = null;
    };
  }, []);

  return { isSupported, isLocked, request, release };
}
