import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { iotService } from '../services/iotService';

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemo: () => void;
  isOnline: boolean;
  toggleOnline: () => void;
  bufferedReadings: number;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [bufferedReadings, setBufferedReadings] = useState(0);

  const toggleDemo = useCallback(async () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    try {
      await iotService.toggleSimulator(next);
    } catch (e) {
      console.error('Failed to toggle simulator:', e);
    }
  }, [isDemoMode]);

  const toggleOnline = useCallback(() => {
    setIsOnline(prev => {
      if (!prev && bufferedReadings > 0) {
        setBufferedReadings(0); // Simulate sync
      }
      if (prev) {
        setBufferedReadings(Math.floor(Math.random() * 5) + 3); // Generate some buffered
      }
      return !prev;
    });
  }, [bufferedReadings]);

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemo, isOnline, toggleOnline, bufferedReadings }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
};
