import { apiFetch } from './api';

export const alertService = {
  getAll: async (filters?: { type?: string; severity?: string; acknowledged?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.type) params.set('type', filters.type);
    if (filters?.severity) params.set('severity', filters.severity);
    if (filters?.acknowledged !== undefined) params.set('acknowledged', String(filters.acknowledged));
    return apiFetch<any[]>(`/alerts?${params.toString()}`);
  },
  getStats: async () => apiFetch<any>('/alerts/stats'),
  acknowledge: async (id: string) => apiFetch<any>(`/alerts/${id}/acknowledge`, { method: 'PUT' }),
  resolve: async (id: string) => apiFetch<any>(`/alerts/${id}/resolve`, { method: 'PUT' }),
};
