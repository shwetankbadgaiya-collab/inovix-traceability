import { apiFetch, API_BASE } from './api';

export const qrService = {
  generate: async (batchId: string) => apiFetch<any>(`/qr/generate/${batchId}`, { method: 'POST' }),
  getQR: async (batchId: string) => apiFetch<any>(`/qr/${batchId}`),
  verify: async (token: string) => {
    // Public endpoint, no auth required
    const res = await fetch(`${API_BASE}/verify/${token}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Verification failed' }));
      throw new Error(err.error || 'Batch verification failed');
    }
    return res.json();
  },
};
