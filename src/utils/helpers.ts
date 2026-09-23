import { SupplyChainStage, Role } from '../types';

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (dateStr: string): string => {
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`;
};

export const timeAgo = (dateStr: string): string => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export const truncateHash = (hash: string): string => {
  if (!hash || hash.length < 10) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

export const generateBatchId = (): string => {
  return `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
};

export const generateTxHash = (): string => {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
};

export const generateEventId = (): string => {
  return `EVT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
};

const ORDERED_STAGES: SupplyChainStage[] = [
  'farm',
  'collection',
  'processing',
  'warehouse',
  'transport',
  'retail',
  'consumer'
];

export const getStageIndex = (stage: SupplyChainStage | string): number => {
  const normalized = (stage || '').toLowerCase() as SupplyChainStage;
  return ORDERED_STAGES.indexOf(normalized);
};

export const getStageLabel = (stage: SupplyChainStage | string): string => {
  const s = String(stage || '').toUpperCase();
  return s;
};

export const getStageColor = (stage: SupplyChainStage | string): string => {
  const s = (stage || '').toLowerCase();
  switch (s) {
    case 'farm': return 'bg-emerald-500 text-white';
    case 'collection': return 'bg-teal-500 text-white';
    case 'processing': return 'bg-blue-500 text-white';
    case 'warehouse': return 'bg-amber-500 text-white';
    case 'transport': return 'bg-orange-500 text-white';
    case 'retail': return 'bg-purple-500 text-white';
    case 'consumer': return 'bg-pink-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export const getSeverityColor = (severity: string): string => {
  switch ((severity || '').toLowerCase()) {
    case 'critical': return 'text-red-600 bg-red-100';
    case 'warning': return 'text-amber-600 bg-amber-100';
    case 'info': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusColor = (status: string): string => {
  switch ((status || '').toLowerCase()) {
    case 'verified': return 'text-emerald-600 bg-emerald-100';
    case 'pending': return 'text-amber-600 bg-amber-100';
    case 'failed': return 'text-red-600 bg-red-100';
    case 'online': return 'text-emerald-600 bg-emerald-100';
    case 'offline': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getRoleLabel = (role: Role | string): string => {
  const r = (role || '').toLowerCase();
  switch (r) {
    case 'admin': return 'Administrator';
    case 'farmer': return 'Farmer';
    case 'collection_centre': return 'Collection Centre';
    case 'food_processor': return 'Food Processor';
    case 'warehouse': return 'Warehouse Manager';
    case 'logistics': return 'Logistics Provider';
    case 'retailer': return 'Retailer';
    case 'consumer': return 'Consumer';
    case 'regulator': return 'Regulator / Auditor';
    default: return role || 'Unknown';
  }
};

export const getRoleIcon = (role: Role | string): string => {
  const r = (role || '').toLowerCase();
  switch (r) {
    case 'admin': return 'Shield';
    case 'farmer': return 'Tractor';
    case 'collection_centre': return 'Building';
    case 'food_processor': return 'Factory';
    case 'warehouse': return 'Warehouse';
    case 'logistics': return 'Truck';
    case 'retailer': return 'Store';
    case 'consumer': return 'User';
    case 'regulator': return 'FileCheck';
    default: return 'User';
  }
};

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
