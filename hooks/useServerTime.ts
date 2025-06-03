import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Synchronizes local time with server time.
 * @param serverTimeFetcher Function that fetches the current server time in milliseconds
 */
export default function useServerTime(serverTimeFetcher?: () => Promise<number>) {
  const [offset, setOffset] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const updateOffset = useCallback((serverMs: number) => {
    setOffset(serverMs - Date.now());
  }, []);

  const sync = useCallback(async () => {
    if (!serverTimeFetcher) return;
    try {
      const serverMs = await serverTimeFetcher();
      updateOffset(serverMs);
    } catch (e) {
      console.warn('Failed to sync server time', e);
    }
  }, [serverTimeFetcher, updateOffset]);

  useEffect(() => {
    if (!serverTimeFetcher) return;
    sync();
    intervalRef.current = setInterval(sync, 60000); // resync every minute
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sync, serverTimeFetcher]);

  const getServerTime = useCallback(() => Date.now() + offset, [offset]);

  return { getServerTime, offset, sync, updateOffset };
}
