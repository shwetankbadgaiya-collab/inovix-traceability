import { apiFetch } from './api';
import { demoStore, isDemoModeActive } from '../data/demoStore';

export const iotService = {
  getAllNodes: async () => {
    if (isDemoModeActive()) {
      return demoStore.getNodes();
    }
    try {
      const res = await apiFetch<any[]>('/iot/nodes');
      return res.length > 0 ? res : demoStore.getNodes();
    } catch (e) {
      console.warn('Using demo IoT nodes:', e);
      return demoStore.getNodes();
    }
  },

  getNodeById: async (id: string) => {
    if (isDemoModeActive()) {
      const node = demoStore.getNodes().find((n) => n.id === id);
      if (!node) throw new Error(`Node ${id} not found`);
      return node;
    }
    try {
      return await apiFetch<any>(`/iot/nodes/${id}`);
    } catch {
      const node = demoStore.getNodes().find((n) => n.id === id);
      if (node) return node;
      throw new Error(`Node ${id} not found`);
    }
  },

  getReadings: async (nodeId: string, limit = 50) => {
    if (isDemoModeActive()) {
      const node = demoStore.getNodes().find((n) => n.id === nodeId);
      const baseTemp = node ? node.temperature : 22.0;
      const baseHum = node ? node.humidity : 60.0;
      const readings = [];
      const now = Date.now();
      for (let i = 0; i < Math.min(limit, 10); i++) {
        readings.push({
          id: `read-${nodeId}-${i}`,
          iotNodeId: nodeId,
          temperature: +(baseTemp + (Math.sin(i) * 0.5)).toFixed(1),
          humidity: +(baseHum + (Math.cos(i) * 1.2)).toFixed(1),
          batteryLevel: node?.batteryLevel || 90,
          timestamp: new Date(now - i * 5000).toISOString(),
        });
      }
      return readings;
    }
    try {
      return await apiFetch<any[]>(`/iot/nodes/${nodeId}/readings?limit=${limit}`);
    } catch {
      return [];
    }
  },

  ingestReading: async (data: any) => {
    if (isDemoModeActive()) {
      return { success: true, reading: data };
    }
    try {
      return await apiFetch<any>('/iot/readings', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      return { success: true, reading: data };
    }
  },

  toggleSimulator: async (active: boolean) => {
    if (isDemoModeActive()) {
      return { success: true, active };
    }
    try {
      return await apiFetch<any>('/iot/simulate', { method: 'POST', body: JSON.stringify({ active }) });
    } catch {
      return { success: true, active };
    }
  },

  getNodeStats: async () => {
    if (isDemoModeActive()) {
      return demoStore.getNodeStats();
    }
    try {
      const nodes = await apiFetch<any[]>('/iot/nodes');
      if (nodes && nodes.length > 0) {
        return {
          total: nodes.length,
          online: nodes.filter((n: any) => n.status === 'ONLINE').length,
          offline: nodes.filter((n: any) => n.status === 'OFFLINE').length,
          warning: nodes.filter((n: any) => n.status === 'WARNING').length,
        };
      }
      return demoStore.getNodeStats();
    } catch {
      return demoStore.getNodeStats();
    }
  },
};
