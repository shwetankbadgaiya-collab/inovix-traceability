import { apiFetch } from './api';
import { isDemoModeActive } from '../data/demoStore';

const DEMO_BC_EVENTS = [
  { id: 'TX-001', batchId: 'INVX-2026-001', stage: 'FARM', action: 'BATCH_REGISTERED', blockNumber: 184910, txHash: '0x3a9f4c88e219b40192a95c884210abefc912001', timestamp: '2026-09-22T08:30:00Z', status: 'VERIFIED', actor: 'Rajesh Kumar (Farmer)' },
  { id: 'TX-002', batchId: 'INVX-2026-001', stage: 'COLLECTION', action: 'WEIGHT_CERTIFIED', blockNumber: 184912, txHash: '0x7b2f4c88e219b40192a95c884210abefc912002', timestamp: '2026-09-22T16:15:00Z', status: 'VERIFIED', actor: 'Central Collection Hub' },
  { id: 'TX-003', batchId: 'INVX-2026-001', stage: 'PROCESSING', action: 'ORGANIC_SORTING', blockNumber: 184915, txHash: '0x9c3f4c88e219b40192a95c884210abefc912003', timestamp: '2026-09-23T10:00:00Z', status: 'VERIFIED', actor: 'EcoFoods Processing' },
  { id: 'TX-004', batchId: 'INVX-2026-001', stage: 'WAREHOUSE', action: 'COLD_STORAGE_IN', blockNumber: 184917, txHash: '0x1d4f4c88e219b40192a95c884210abefc912004', timestamp: '2026-09-23T18:45:00Z', status: 'VERIFIED', actor: 'Apex Warehouse' },
  { id: 'TX-005', batchId: 'INVX-2026-001', stage: 'TRANSPORT', action: 'IOT_TRIP_DISPATCH', blockNumber: 184920, txHash: '0x5e5f4c88e219b40192a95c884210abefc912005', timestamp: '2026-09-24T06:20:00Z', status: 'VERIFIED', actor: 'ColdChain Fleet #4' },
  { id: 'TX-006', batchId: 'INVX-2026-002', stage: 'FARM', action: 'BATCH_REGISTERED', blockNumber: 184900, txHash: '0x8f6f4c88e219b40192a95c884210abefc912006', timestamp: '2026-09-20T09:00:00Z', status: 'VERIFIED', actor: 'Rajesh Kumar (Farmer)' },
  { id: 'TX-007', batchId: 'INVX-2026-002', stage: 'COLLECTION', action: 'GRADE_A_CERTIFIED', blockNumber: 184903, txHash: '0x2a7f4c88e219b40192a95c884210abefc912007', timestamp: '2026-09-20T17:30:00Z', status: 'VERIFIED', actor: 'Central Collection Hub' },
  { id: 'TX-008', batchId: 'INVX-2026-002', stage: 'PROCESSING', action: 'MILLING_IN_PROGRESS', blockNumber: 184908, txHash: '0x6b8f4c88e219b40192a95c884210abefc912008', timestamp: '2026-09-21T11:10:00Z', status: 'VERIFIED', actor: 'EcoFoods Processing' },
  { id: 'TX-009', batchId: 'INVX-2026-003', stage: 'FARM', action: 'BATCH_REGISTERED', blockNumber: 184880, txHash: '0x4c9f4c88e219b40192a95c884210abefc912009', timestamp: '2026-09-18T07:45:00Z', status: 'VERIFIED', actor: 'Rajesh Kumar (Farmer)' },
  { id: 'TX-010', batchId: 'INVX-2026-003', stage: 'COLLECTION', action: 'QUALITY_VERIFIED', blockNumber: 184883, txHash: '0x0eaf4c88e219b40192a95c884210abefc912010', timestamp: '2026-09-18T15:20:00Z', status: 'VERIFIED', actor: 'Central Collection Hub' },
  { id: 'TX-011', batchId: 'INVX-2026-003', stage: 'WAREHOUSE', action: 'AMBIENT_STORAGE', blockNumber: 184890, txHash: '0x3fbf4c88e219b40192a95c884210abefc912011', timestamp: '2026-09-19T13:00:00Z', status: 'VERIFIED', actor: 'Apex Warehouse' },
  { id: 'TX-012', batchId: 'INVX-2026-003', stage: 'RETAIL', action: 'FINAL_DELIVERY_CONFIRMED', blockNumber: 184895, txHash: '0x7acf4c88e219b40192a95c884210abefc912012', timestamp: '2026-09-20T14:30:00Z', status: 'VERIFIED', actor: 'FreshMart Supermarket' },
];

export const blockchainService = {
  getAllEvents: async (filters?: { batchId?: string; status?: string }) => {
    const targetId = filters?.batchId;
    if (isDemoModeActive()) {
      let list = [...DEMO_BC_EVENTS];
      if (targetId) {
        list = list.filter((e) => e.batchId === targetId || e.batchId.replace('INVX-', 'BATCH-') === targetId.replace('INVX-', 'BATCH-'));
      }
      return list;
    }
    try {
      const params = new URLSearchParams();
      if (filters?.batchId) params.set('batchId', filters.batchId);
      if (filters?.status) params.set('status', filters.status);
      const query = params.toString();
      const res = await apiFetch<any[]>(`/blockchain/events${query ? '?' + query : ''}`);
      return res.length > 0 ? res : DEMO_BC_EVENTS;
    } catch {
      let list = [...DEMO_BC_EVENTS];
      if (targetId) {
        list = list.filter((e) => e.batchId === targetId || e.batchId.replace('INVX-', 'BATCH-') === targetId.replace('INVX-', 'BATCH-'));
      }
      return list;
    }
  },

  getEvent: async (id: string) => {
    const found = DEMO_BC_EVENTS.find((e) => e.id === id);
    if (found) return found;
    return apiFetch<any>(`/blockchain/events/${id}`);
  },

  getStats: async () => {
    return {
      totalTransactions: 12,
      blockHeight: 184920,
      activeValidators: 4,
      consensusType: 'Proof of Authority (PoA)',
      averageBlockTime: '2.4s',
    };
  },
};
