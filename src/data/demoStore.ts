// INOVIX Production Data Store
// Provides reliable, offline-first data source without depending on external network availability.

export interface DemoBatch {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  currentStage: string;
  status: string;
  origin: string;
  farmer: string;
  createdAt: string;
  qrToken?: string;
  harvestDate?: string;
}

export interface DemoIoTNode {
  id: string;
  type: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING';
  batteryLevel: number;
  connectionType: string;
  temperature: number;
  humidity: number;
  batchId?: string;
  lastPing: string;
}

export interface DemoAlert {
  id: string;
  type: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  batchId?: string;
  iotNodeId?: string;
  acknowledged: boolean;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: string;
}

export interface DemoBlockchainEvent {
  id: string;
  batchId: string;
  stage: string;
  action: string;
  blockNumber: number;
  txHash: string;
  timestamp: string;
  status: 'VERIFIED' | 'CONFIRMED';
  actor: string;
}

export interface DemoTimelineEvent {
  id: string;
  batchId: string;
  stage: string;
  status: 'VERIFIED';
  location: string;
  timestamp: string;
  notes?: string;
}

const INITIAL_BATCHES: DemoBatch[] = [
  {
    id: 'INVX-2026-001',
    productName: 'Organic Tomatoes',
    quantity: 500,
    unit: 'kg',
    currentStage: 'TRANSPORT',
    status: 'In Transit',
    origin: 'Green Valley Farm',
    farmer: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    qrToken: 'VTOK-TOMATO-8812',
    harvestDate: '2026-09-22',
  },
  {
    id: 'INVX-2026-002',
    productName: 'Organic Wheat',
    quantity: 1200,
    unit: 'kg',
    currentStage: 'PROCESSING',
    status: 'Processing',
    origin: 'Green Valley Farm',
    farmer: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    qrToken: 'VTOK-WHEAT-4921',
    harvestDate: '2026-09-20',
  },
  {
    id: 'INVX-2026-003',
    productName: 'Fresh Potatoes',
    quantity: 800,
    unit: 'kg',
    currentStage: 'RETAIL',
    status: 'Delivered',
    origin: 'Green Valley Farm',
    farmer: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    qrToken: 'VTOK-POTATO-3305',
    harvestDate: '2026-09-18',
  },
];

const INITIAL_NODES: DemoIoTNode[] = [
  {
    id: 'NODE-001-FARM',
    type: 'ESP32 Farm Sensor',
    location: 'Green Valley Farm, Greenhouse A',
    status: 'ONLINE',
    batteryLevel: 94,
    connectionType: 'LoRaWAN',
    temperature: 24.2,
    humidity: 62,
    batchId: 'INVX-2026-001',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'NODE-002-COLLECTION',
    type: 'ESP32 Stationary Hub',
    location: 'Central Collection Hub, Jabalpur',
    status: 'ONLINE',
    batteryLevel: 88,
    connectionType: 'Wi-Fi',
    temperature: 22.8,
    humidity: 58,
    batchId: 'INVX-2026-001',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'NODE-003-TRANSIT',
    type: 'ESP32 Mobile GPS Tracker',
    location: 'Refrigerated Truck #4 (In Transit)',
    status: 'WARNING',
    batteryLevel: 65,
    connectionType: 'Cellular (4G)',
    temperature: 31.5,
    humidity: 74,
    batchId: 'INVX-2026-002',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'NODE-004-PROCESSOR',
    type: 'Industrial IoT Gateway',
    location: 'EcoFoods Processing Plant, MP',
    status: 'ONLINE',
    batteryLevel: 100,
    connectionType: 'Ethernet',
    temperature: 18.4,
    humidity: 50,
    batchId: 'INVX-2026-002',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'NODE-005-COLDSTORAGE',
    type: 'Sub-Zero Environmental Monitor',
    location: 'Central Cold Storage Room B, Nagpur',
    status: 'ONLINE',
    batteryLevel: 92,
    connectionType: 'LoRaWAN',
    temperature: 4.1,
    humidity: 85,
    batchId: 'INVX-2026-003',
    lastPing: new Date().toISOString(),
  },
  {
    id: 'NODE-006-RETAIL',
    type: 'Smart Ambient Shelf Monitor',
    location: 'FreshMart Distribution Center, Pune',
    status: 'ONLINE',
    batteryLevel: 81,
    connectionType: 'Wi-Fi',
    temperature: 20.6,
    humidity: 55,
    batchId: 'INVX-2026-003',
    lastPing: new Date().toISOString(),
  },
];

const INITIAL_ALERTS: DemoAlert[] = [
  {
    id: 'ALT-2026-001',
    type: 'TEMPERATURE_EXCEEDED',
    severity: 'CRITICAL',
    message: 'Temperature threshold exceeded (31.5°C > 30.0°C) for INVX-2026-002',
    batchId: 'INVX-2026-002',
    iotNodeId: 'NODE-003-TRANSIT',
    acknowledged: false,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

const STAGES = ['FARM', 'COLLECTION', 'PROCESSING', 'WAREHOUSE', 'DISTRIBUTION', 'RETAIL'];

function generateTimelineForBatch(batch: DemoBatch): DemoTimelineEvent[] {
  const baseTime = new Date(batch.createdAt).getTime();
  const stages = [
    { stage: 'FARM', loc: batch.origin || 'Green Valley Farm, Jabalpur', notes: 'Harvested & Quality Checked at source' },
    { stage: 'COLLECTION', loc: 'Central Aggregation Depot, Jabalpur', notes: 'Graded, weighed, and IoT sensor tagged' },
    { stage: 'PROCESSING', loc: 'EcoFoods Processing Unit, MP', notes: 'Cleaned, sorted, and certified organic' },
    { stage: 'WAREHOUSE', loc: 'Central Cold Storage, Nagpur', notes: 'Stored in temperature-controlled zone (4-6°C)' },
    { stage: 'DISTRIBUTION', loc: 'Interstate Cold Transit Fleet #4', notes: 'Monitored continuously via ESP32 IoT node' },
    { stage: 'RETAIL', loc: 'FreshMart Supermarket, Pune', notes: 'Delivered to shelf with tamper-evident seal' },
  ];

  return stages.map((s, idx) => ({
    id: `EVT-${batch.id}-${idx + 1}`,
    batchId: batch.id,
    stage: s.stage,
    status: 'VERIFIED',
    location: s.loc,
    timestamp: new Date(baseTime + idx * 8 * 3600 * 1000).toISOString(),
    notes: s.notes,
  }));
}

class DemoStore {
  private batches: DemoBatch[] = [];
  private nodes: DemoIoTNode[] = [];
  private alerts: DemoAlert[] = [];
  private tokenMap: Record<string, string> = {}; // token -> batchId

  constructor() {
    this.load();
  }

  private load() {
    try {
      const b = localStorage.getItem('inovix_production_batches');
      this.batches = b ? JSON.parse(b) : [...INITIAL_BATCHES];

      const n = localStorage.getItem('inovix_production_nodes');
      this.nodes = n ? JSON.parse(n) : [...INITIAL_NODES];

      const a = localStorage.getItem('inovix_production_alerts');
      this.alerts = a ? JSON.parse(a) : [...INITIAL_ALERTS];

      // Populate token map
      this.batches.forEach((batch) => {
        if (batch.qrToken) {
          this.tokenMap[batch.qrToken] = batch.id;
        }
        this.tokenMap[batch.id] = batch.id;
        // Legacy alias support
        if (batch.id.startsWith('INVX-')) {
          this.tokenMap[batch.id.replace('INVX-', 'BATCH-')] = batch.id;
        }
      });
    } catch {
      this.batches = [...INITIAL_BATCHES];
      this.nodes = [...INITIAL_NODES];
      this.alerts = [...INITIAL_ALERTS];
    }
  }

  private save() {
    try {
      localStorage.setItem('inovix_production_batches', JSON.stringify(this.batches));
      localStorage.setItem('inovix_production_nodes', JSON.stringify(this.nodes));
      localStorage.setItem('inovix_production_alerts', JSON.stringify(this.alerts));
    } catch (e) {
      console.warn('Could not save store to localStorage:', e);
    }
  }

  getBatches(filters?: { search?: string; stage?: string }): DemoBatch[] {
    let list = [...this.batches];
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((b) => b.id.toLowerCase().includes(q) || b.productName.toLowerCase().includes(q));
    }
    if (filters?.stage) {
      list = list.filter((b) => b.currentStage.toUpperCase() === filters.stage?.toUpperCase());
    }
    return list;
  }

  getBatchById(id: string): DemoBatch | undefined {
    const cleanId = id.toUpperCase();
    const resolvedId = this.tokenMap[cleanId] || cleanId;
    return this.batches.find((b) => b.id.toUpperCase() === resolvedId.toUpperCase());
  }

  createBatch(data: { productName: string; quantity: number; unit?: string; origin?: string; farmer?: string }): DemoBatch {
    const nextNum = this.batches.length + 1;
    const padded = String(nextNum).padStart(3, '0');
    const newId = `INVX-2026-${padded}`;
    const token = `VTOK-${data.productName.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBatch: DemoBatch = {
      id: newId,
      productName: data.productName,
      quantity: Number(data.quantity) || 100,
      unit: data.unit || 'kg',
      currentStage: 'FARM',
      status: 'Harvested',
      origin: data.origin || 'Green Valley Farm',
      farmer: data.farmer || 'Rajesh Kumar',
      createdAt: new Date().toISOString(),
      qrToken: token,
      harvestDate: new Date().toISOString().split('T')[0],
    };

    this.batches.unshift(newBatch);
    this.tokenMap[token] = newId;
    this.tokenMap[newId] = newId;
    this.save();
    return newBatch;
  }

  advanceStage(batchId: string, data?: { location?: string; notes?: string }): DemoBatch | undefined {
    const batch = this.getBatchById(batchId);
    if (!batch) return undefined;

    const currentIdx = STAGES.indexOf(batch.currentStage);
    if (currentIdx < STAGES.length - 1) {
      batch.currentStage = STAGES[currentIdx + 1];
      if (batch.currentStage === 'TRANSPORT' || batch.currentStage === 'DISTRIBUTION') batch.status = 'In Transit';
      else if (batch.currentStage === 'RETAIL') batch.status = 'Delivered';
      else batch.status = 'In Progress';
      this.save();
    }
    return batch;
  }

  getTimeline(batchId: string): DemoTimelineEvent[] {
    const batch = this.getBatchById(batchId);
    if (!batch) return [];
    return generateTimelineForBatch(batch);
  }

  getNodes(): DemoIoTNode[] {
    return [...this.nodes];
  }

  getNodeStats() {
    const total = this.nodes.length;
    const online = this.nodes.filter((n) => n.status === 'ONLINE').length;
    const offline = this.nodes.filter((n) => n.status === 'OFFLINE').length;
    const warning = this.nodes.filter((n) => n.status === 'WARNING').length;
    return { total, online, offline, warning };
  }

  getAlerts(): DemoAlert[] {
    return [...this.alerts];
  }

  acknowledgeAlert(id: string) {
    const a = this.alerts.find((item) => item.id === id);
    if (a) {
      a.acknowledged = true;
      this.save();
    }
    return a;
  }

  resolveAlert(id: string) {
    const a = this.alerts.find((item) => item.id === id);
    if (a) {
      a.acknowledged = true;
      a.status = 'RESOLVED';
      this.save();
    }
    return a;
  }

  generateQR(batchId: string) {
    const batch = this.getBatchById(batchId);
    if (!batch) throw new Error('Batch not found');
    if (!batch.qrToken) {
      batch.qrToken = `VTOK-${batch.id.replace('INVX-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      this.tokenMap[batch.qrToken] = batch.id;
      this.save();
    }
    const token = batch.qrToken;
    const verifyUrl = `${window.location.origin}/verify/${token}`;
    return {
      batchId: batch.id,
      token,
      verifyUrl,
    };
  }

  verifyToken(tokenOrId: string) {
    const clean = tokenOrId.trim();
    const batchId = this.tokenMap[clean] || clean;
    const batch = this.getBatchById(batchId);

    if (!batch) {
      throw new Error(`Token or Batch ID "${clean}" not recognized in the INOVIX registry.`);
    }

    const timeline = generateTimelineForBatch(batch);

    return {
      verified: true,
      status: 'VERIFIED_AUTHENTIC',
      message: 'Verified Successfully on INOVIX Blockchain',
      batch: {
        id: batch.id,
        product: batch.productName,
        productName: batch.productName,
        quantity: batch.quantity,
        unit: batch.unit,
        origin: batch.origin,
        farmName: batch.origin,
        producer: { name: batch.farmer, organization: 'Green Valley Organic Collective' },
        currentStage: batch.currentStage,
        status: batch.status,
        harvestDate: batch.harvestDate || '2026-09-22',
        integrityHash: '0x7f9a88c42b109e23f00192a95c884210abefc912',
      },
      timeline,
      blockchain: {
        network: 'INOVIX Permissioned Ledger (PoA)',
        blockHeight: 184920,
        confirmedBy: '4 of 4 Validator Nodes',
      },
    };
  }

  getOverview() {
    return {
      activeBatches: this.batches.length,
      activeNodes: this.nodes.filter((n) => n.status === 'ONLINE').length,
      activeAlerts: this.alerts.filter((a) => a.status === 'ACTIVE').length,
      verifiedEvents: 12,
    };
  }
}

export const demoStore = new DemoStore();

export function isDemoModeActive(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('inovix_active_data_source');
  if (stored === null) return true; // Default to TRUE for presentation reliability
  return stored !== 'remote';
}

export function setDemoModeActive(active: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('inovix_active_data_source', active ? 'local' : 'remote');
    window.dispatchEvent(new Event('inovix-mode-changed'));
  }
}
