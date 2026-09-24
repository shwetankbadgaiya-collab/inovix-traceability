import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { isDemoModeActive, setDemoModeActive, demoStore } from '../data/demoStore';
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
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => isDemoModeActive());
  const [isOnline, setIsOnline] = useState(true);
  const [bufferedReadings, setBufferedReadings] = useState(0);

  useEffect(() => {
    const handleModeChange = () => {
      setIsDemoMode(isDemoModeActive());
    };
    window.addEventListener('inovix-demo-mode-changed', handleModeChange);
    return () => window.removeEventListener('inovix-demo-mode-changed', handleModeChange);
  }, []);

  const toggleDemo = useCallback(async () => {
    const next = !isDemoMode;
    setIsDemoMode(next);
    setDemoModeActive(next);
    if (!next) {
      try {
        await iotService.toggleSimulator(false);
      } catch (e) {
        console.warn('Simulator toggle ignored:', e);
      }
    }
  }, [isDemoMode]);

  const toggleOnline = useCallback(() => {
    setIsOnline((prev) => {
      if (!prev && bufferedReadings > 0) {
        setBufferedReadings(0); // Simulate sync
      }
      if (prev) {
        setBufferedReadings(Math.floor(Math.random() * 5) + 3); // Generate buffered
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
