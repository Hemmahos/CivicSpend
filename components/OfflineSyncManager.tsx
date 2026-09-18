'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { WifiOff, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export default function OfflineSyncManager() {
  const [isOffline, setIsOffline] = useState(false);
  const { flushOfflineQueue, offlineQueue } = useAppStore();

  useEffect(() => {
    // Initial check
    setIsOffline(!navigator.onLine);

    const handleOnline = async () => {
      setIsOffline(false);
      const queueLength = useAppStore.getState().offlineQueue.length;
      if (queueLength > 0) {
        toast.info(`Back online! Syncing ${queueLength} pending action(s)...`, { icon: <Wifi className="w-4 h-4 text-blue-500" /> });
        await flushOfflineQueue();
        toast.success("All offline changes synced to the server.");
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("You are offline. Changes will be saved locally and synced later.", { 
        icon: <WifiOff className="w-4 h-4 text-amber-500" />,
        duration: 5000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushOfflineQueue]);

  if (!isOffline && offlineQueue.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 pointer-events-none">
      {isOffline && (
        <div className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium backdrop-blur-md">
          <WifiOff size={16} /> Offline Mode Active
        </div>
      )}
      {!isOffline && offlineQueue.length > 0 && (
        <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium backdrop-blur-md">
          <Wifi size={16} className="animate-pulse" /> Syncing...
        </div>
      )}
    </div>
  );
}
