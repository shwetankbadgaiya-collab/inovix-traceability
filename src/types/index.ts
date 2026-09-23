export type Role = 'farmer' | 'collection_centre' | 'food_processor' | 'warehouse' | 'logistics' | 'retailer' | 'consumer' | 'regulator' | 'admin';

export type SupplyChainStage = 'farm' | 'collection' | 'processing' | 'warehouse' | 'transport' | 'retail' | 'consumer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
  location: string;
  avatar?: string;
  phone?: string;
}

export interface Batch {
  id: string;
  product: string;
  crop: string;
  farm: string;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: string;
  creationDate: string;
  currentStage: SupplyChainStage;
  currentLocation: string;
  status: 'active' | 'in_transit' | 'completed' | 'alert';
  iotNodeId: string;
  qrGenerated: boolean;
  blockchainAnchored: boolean;
  temperature?: number;
  humidity?: number;
  description?: string;
}

export interface IoTNode {
  id: string;
  batchId: string;
  status: 'online' | 'offline' | 'warning';
  battery: number;
  connectivity: 'wifi' | 'cellular' | 'lora' | 'bluetooth';
  lastSync: string;
  temperature: number;
  humidity: number;
  location: { lat: number; lng: number; label: string };
  firmwareVersion: string;
  bufferedReadings: number;
}

export interface SensorReading {
  id: string;
  nodeId: string;
  batchId: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  location: { lat: number; lng: number };
  battery: number;
  synced: boolean;
}

export interface SupplyChainEvent {
  id: string;
  batchId: string;
  stage: SupplyChainStage;
  eventType: string;
  timestamp: string;
  location: string;
  coordinates: { lat: number; lng: number };
  actor: string;
  actorRole: Role;
  temperature?: number;
  humidity?: number;
  notes?: string;
  blockchainVerified: boolean;
  blockchainTxHash?: string;
}

export interface BlockchainEvent {
  eventId: string;
  batchId: string;
  eventType: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  txHash: string;
  blockNumber: number;
  status: 'verified' | 'pending' | 'failed';
  data?: string;
}

export interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'battery' | 'connectivity' | 'tamper';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  batchId?: string;
  nodeId?: string;
  timestamp: string;
  acknowledged: boolean;
  value?: number;
  threshold?: number;
}

export interface QRCodeData {
  batchId: string;
  product: string;
  verificationUrl: string;
  generatedAt: string;
  generatedBy: string;
}

export interface AnalyticsData {
  batchesByStage: { stage: string; count: number }[];
  temperatureTrends: { time: string; value: number; min: number; max: number }[];
  humidityTrends: { time: string; value: number }[];
  alertsByType: { type: string; count: number }[];
  iotNodeHealth: { status: string; count: number }[];
  traceabilityCompletion: { month: string; completed: number; total: number }[];
  batchMovement: { date: string; created: number; completed: number }[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}
