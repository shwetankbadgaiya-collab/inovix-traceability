import { apiFetch } from './api';
import { demoStore, isDemoModeActive } from '../data/demoStore';

export const alertService = {
  getAll: async (filters?: { type?: string; severity?: string; acknowledged?: boolean }) => {
    if (isDemoModeActive()) {
      let alerts = demoStore.getAlerts();
      if (filters?.acknowledged !== undefined) {
        alerts = alerts.filter((a) => a.acknowledged === filters.acknowledged);
      }
      return alerts;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.set('type', filters.type);
      if (filters?.severity) params.set('severity', filters.severity);
      if (filters?.acknowledged !== undefined) params.set('acknowledged', String(filters.acknowledged));
      const res = await apiFetch<any[]>(`/alerts?${params.toString()}`);
      return res.length > 0 ? res : demoStore.getAlerts();
    } catch {
      return demoStore.getAlerts();
    }
  },

  getStats: async () => {
    if (isDemoModeActive()) {
      const alerts = demoStore.getAlerts();
      return {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
        active: alerts.filter((a) => a.status === 'ACTIVE').length,
        resolved: alerts.filter((a) => a.status === 'RESOLVED').length,
      };
    }
    try {
      return await apiFetch<any>('/alerts/stats');
    } catch {
      const alerts = demoStore.getAlerts();
      return {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === 'CRITICAL').length,
        active: alerts.filter((a) => a.status === 'ACTIVE').length,
        resolved: alerts.filter((a) => a.status === 'RESOLVED').length,
      };
    }
  },

  acknowledge: async (id: string) => {
    if (isDemoModeActive()) {
      return demoStore.acknowledgeAlert(id);
    }
    try {
      return await apiFetch<any>(`/alerts/${id}/acknowledge`, { method: 'PUT' });
    } catch {
      return demoStore.acknowledgeAlert(id);
    }
  },

  resolve: async (id: string) => {
    if (isDemoModeActive()) {
      return demoStore.resolveAlert(id);
    }
    try {
      return await apiFetch<any>(`/alerts/${id}/resolve`, { method: 'PUT' });
    } catch {
      return demoStore.resolveAlert(id);
    }
  },
};
