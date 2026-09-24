import { apiFetch } from './api';
import { demoStore, isDemoModeActive } from '../data/demoStore';

export const analyticsService = {
  getOverview: async () => {
    if (isDemoModeActive()) {
      return demoStore.getOverview();
    }
    try {
      const res = await apiFetch<any>('/analytics/overview');
      return res || demoStore.getOverview();
    } catch {
      return demoStore.getOverview();
    }
  },

  getBatchAnalytics: async (period = '7days') => {
    if (isDemoModeActive()) {
      return {
        period,
        batchesCreated: 14,
        batchesCompleted: 11,
        averageCycleDays: 4.2,
      };
    }
    try {
      return await apiFetch<any>(`/analytics/batches?period=${period}`);
    } catch {
      return {
        period,
        batchesCreated: 14,
        batchesCompleted: 11,
        averageCycleDays: 4.2,
      };
    }
  },

  getIoTAnalytics: async (period = '7days') => {
    if (isDemoModeActive()) {
      return {
        period,
        totalReadings: 4280,
        uptimePercentage: 99.4,
        temperatureBreaches: 2,
      };
    }
    try {
      return await apiFetch<any>(`/analytics/iot?period=${period}`);
    } catch {
      return {
        period,
        totalReadings: 4280,
        uptimePercentage: 99.4,
        temperatureBreaches: 2,
      };
    }
  },

  getAlertAnalytics: async (period = '7days') => {
    if (isDemoModeActive()) {
      return {
        period,
        totalAlerts: 3,
        resolvedAlerts: 2,
        criticalAlerts: 1,
      };
    }
    try {
      return await apiFetch<any>(`/analytics/alerts?period=${period}`);
    } catch {
      return {
        period,
        totalAlerts: 3,
        resolvedAlerts: 2,
        criticalAlerts: 1,
      };
    }
  },
};
