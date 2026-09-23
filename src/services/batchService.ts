import { apiFetch } from './api';

export const batchService = {
  getAll: async (filters?: { stage?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.stage) params.set('stage', filters.stage);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);
    const query = params.toString();
    return apiFetch<any[]>(`/batches${query ? '?' + query : ''}`);
  },
  getById: async (id: string) => apiFetch<any>(`/batches/${id}`),
  create: async (data: any) => apiFetch<any>('/batches', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: any) => apiFetch<any>(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  advanceStage: async (id: string, data: { location: string; notes?: string }) => 
    apiFetch<any>(`/batches/${id}/advance`, { method: 'POST', body: JSON.stringify(data) }),
  getTimeline: async (id: string) => apiFetch<any[]>(`/batches/${id}/timeline`),
};
