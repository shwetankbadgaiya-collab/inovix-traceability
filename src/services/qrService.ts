import { apiFetch, getApiBase } from './api';
import { demoStore, isDemoModeActive } from '../data/demoStore';

export const qrService = {
  generate: async (batchId: string) => {
    if (isDemoModeActive()) {
      return demoStore.generateQR(batchId);
    }
    try {
      return await apiFetch<any>(`/qr/generate/${batchId}`, { method: 'POST' });
    } catch {
      return demoStore.generateQR(batchId);
    }
  },

  getQR: async (batchId: string) => {
    if (isDemoModeActive()) {
      return demoStore.generateQR(batchId);
    }
    try {
      return await apiFetch<any>(`/qr/${batchId}`);
    } catch {
      return demoStore.generateQR(batchId);
    }
  },

  verify: async (token: string) => {
    if (isDemoModeActive()) {
      return demoStore.verifyToken(token);
    }
    try {
      const baseUrl = getApiBase();
      const res = await fetch(`${baseUrl}/verify/${token}`);
      if (!res.ok) {
        return demoStore.verifyToken(token);
      }
      return await res.json();
    } catch {
      return demoStore.verifyToken(token);
    }
  },
};
