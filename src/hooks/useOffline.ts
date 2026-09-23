import { useState, useCallback } from 'react';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const toggleOnline = useCallback(() => {
    setIsOnline(prev => !prev);
  }, []);

  const addBuffered = useCallback((amount = 1) => {
    setBufferedCount(prev => prev + amount);
  }, []);

  const syncAll = useCallback(async () => {
    if (!isOnline || bufferedCount === 0) return;
    
    setIsSyncing(true);
    
    let count = bufferedCount;
    return new Promise<void>(resolve => {
      const interval = setInterval(() => {
        count -= Math.ceil(count / 3);
        if (count <= 0) {
          count = 0;
          clearInterval(interval);
          setBufferedCount(0);
          setIsSyncing(false);
          resolve();
        } else {
          setBufferedCount(count);
        }
      }, 400);
    });
  }, [isOnline, bufferedCount]);
  
  return { isOnline, bufferedCount, isSyncing, toggleOnline, addBuffered, syncAll };
}
