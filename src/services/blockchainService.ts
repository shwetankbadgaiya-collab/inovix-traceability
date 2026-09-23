import { apiFetch } from './api';

export const blockchainService = {
  getAllEvents: async (filters?: { batchId?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.batchId) params.set('batchId', filters.batchId);
    if (filters?.status) params.set('status', filters.status);
    const query = params.toString();
    return apiFetch<any[]>(`/blockchain/events${query ? '?' + query : ''}`);
  },
  getEvent: async (id: string) => apiFetch<any>(`/blockchain/events/${id}`),
  getStats: async () => apiFetch<any>('/blockchain/stats'),
};
