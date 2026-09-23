import { apiFetch } from './api';

export const analyticsService = {
  getOverview: async () => apiFetch<any>('/analytics/overview'),
  getBatchAnalytics: async (period = '7days') => apiFetch<any>(`/analytics/batches?period=${period}`),
  getIoTAnalytics: async (period = '7days') => apiFetch<any>(`/analytics/iot?period=${period}`),
  getAlertAnalytics: async (period = '7days') => apiFetch<any>(`/analytics/alerts?period=${period}`),
};
