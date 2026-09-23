import { apiFetch } from './api';

export const iotService = {
  getAllNodes: async () => apiFetch<any[]>('/iot/nodes'),
  getNodeById: async (id: string) => apiFetch<any>(`/iot/nodes/${id}`),
  getReadings: async (nodeId: string, limit = 50) => apiFetch<any[]>(`/iot/nodes/${nodeId}/readings?limit=${limit}`),
  ingestReading: async (data: any) => apiFetch<any>('/iot/readings', { method: 'POST', body: JSON.stringify(data) }),
  toggleSimulator: async (active: boolean) => apiFetch<any>('/iot/simulate', { method: 'POST', body: JSON.stringify({ active }) }),
  getNodeStats: async () => {
    const nodes = await apiFetch<any[]>('/iot/nodes');
    return {
      total: nodes.length,
      online: nodes.filter((n: any) => n.status === 'ONLINE').length,
      offline: nodes.filter((n: any) => n.status === 'OFFLINE').length,
      warning: nodes.filter((n: any) => n.status === 'WARNING').length,
    };
  },
};
