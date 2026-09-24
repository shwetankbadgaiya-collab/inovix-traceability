import { apiFetch } from './api';
import { demoStore, isDemoModeActive } from '../data/demoStore';

export const batchService = {
  getAll: async (filters?: { stage?: string; status?: string; search?: string }) => {
    if (isDemoModeActive()) {
      return demoStore.getBatches(filters);
    }
    try {
      const params = new URLSearchParams();
      if (filters?.stage) params.set('stage', filters.stage);
      if (filters?.status) params.set('status', filters.status);
      if (filters?.search) params.set('search', filters.search);
      const query = params.toString();
      const res = await apiFetch<any[]>(`/batches${query ? '?' + query : ''}`);
      return res.length > 0 ? res : demoStore.getBatches(filters);
    } catch (e) {
      console.warn('Using demo batches fallback:', e);
      return demoStore.getBatches(filters);
    }
  },

  getById: async (id: string) => {
    if (isDemoModeActive()) {
      const b = demoStore.getBatchById(id);
      if (!b) throw new Error(`Batch ${id} not found`);
      return b;
    }
    try {
      return await apiFetch<any>(`/batches/${id}`);
    } catch (e) {
      const b = demoStore.getBatchById(id);
      if (b) return b;
      throw e;
    }
  },

  create: async (data: any) => {
    if (isDemoModeActive()) {
      return demoStore.createBatch(data);
    }
    try {
      return await apiFetch<any>('/batches', { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      console.warn('Backend batch creation failed, storing locally:', e);
      return demoStore.createBatch(data);
    }
  },

  update: async (id: string, data: any) => {
    if (isDemoModeActive()) {
      return { id, ...data };
    }
    try {
      return await apiFetch<any>(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch (e) {
      return { id, ...data };
    }
  },

  advanceStage: async (id: string, data: { location: string; notes?: string }) => {
    if (isDemoModeActive()) {
      return demoStore.advanceStage(id, data);
    }
    try {
      return await apiFetch<any>(`/batches/${id}/advance`, { method: 'POST', body: JSON.stringify(data) });
    } catch (e) {
      return demoStore.advanceStage(id, data);
    }
  },

  getTimeline: async (id: string) => {
    if (isDemoModeActive()) {
      return demoStore.getTimeline(id);
    }
    try {
      const res = await apiFetch<any[]>(`/batches/${id}/timeline`);
      return res.length > 0 ? res : demoStore.getTimeline(id);
    } catch (e) {
      return demoStore.getTimeline(id);
    }
  },
};
