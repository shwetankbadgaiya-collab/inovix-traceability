import { apiFetch } from './api';
import { isDemoModeActive } from '../data/demoStore';

interface AuthResponse {
  user: any;
  token: string;
}

const DEMO_USERS: Record<string, any> = {
  FARMER: {
    id: 'farmer-001',
    name: 'Demo Farmer',
    email: 'farmer@demo.inovix.com',
    role: 'FARMER',
    organization: 'Jabalpur Farm',
    location: 'Jabalpur, Madhya Pradesh',
  },
  COLLECTION_CENTER: {
    id: 'coll-001',
    name: 'Central Collection Centre',
    email: 'collection@demo.inovix.com',
    role: 'COLLECTION_CENTER',
    organization: 'Central Aggregation Depot',
    location: 'Jabalpur, MP',
  },
  PROCESSOR: {
    id: 'proc-001',
    name: 'EcoFoods Processing Unit',
    email: 'processor@demo.inovix.com',
    role: 'PROCESSOR',
    organization: 'EcoFoods Processing Ltd',
    location: 'Nagpur, MH',
  },
  WAREHOUSE: {
    id: 'ware-001',
    name: 'Central Warehouse Hub',
    email: 'warehouse@demo.inovix.com',
    role: 'WAREHOUSE',
    organization: 'Apex Cold Storage',
    location: 'Nagpur, MH',
  },
  LOGISTICS: {
    id: 'log-001',
    name: 'ColdChain Logistics Fleet',
    email: 'logistics@demo.inovix.com',
    role: 'LOGISTICS',
    organization: 'Transit Express Cargo',
    location: 'Interstate Transit',
  },
  RETAILER: {
    id: 'ret-001',
    name: 'FreshMart Supermarket',
    email: 'retailer@demo.inovix.com',
    role: 'RETAILER',
    organization: 'FreshMart Retail Network',
    location: 'Pune, MH',
  },
  CONSUMER: {
    id: 'con-001',
    name: 'Verified Consumer',
    email: 'consumer@demo.inovix.com',
    role: 'CONSUMER',
    organization: 'Public Consumer Access',
    location: 'Pune, MH',
  },
  REGULATOR: {
    id: 'reg-001',
    name: 'Food Safety Officer',
    email: 'regulator@demo.inovix.com',
    role: 'REGULATOR',
    organization: 'National Food Safety Authority',
    location: 'Regional Bureau',
  },
  ADMIN: {
    id: 'adm-001',
    name: 'System Administrator',
    email: 'admin@demo.inovix.com',
    role: 'ADMIN',
    organization: 'INOVIX Network Operations',
    location: 'Operations Center',
  },
};

export const authService = {
  register: async (data: { email: string; password: string; name: string; role: string; organization: string; location: string }) => {
    if (isDemoModeActive()) {
      const demoUser = {
        id: `user-${Date.now()}`,
        name: data.name || 'Demo User',
        email: data.email,
        role: data.role || 'FARMER',
        organization: data.organization || 'Demo Org',
        location: data.location || 'Demo Location',
      };
      const token = `demo-token-${Date.now()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(demoUser));
      return demoUser;
    }
    try {
      const res = await apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
      localStorage.setItem('inovix_token', res.token);
      localStorage.setItem('inovix_user', JSON.stringify(res.user));
      return res.user;
    } catch (e) {
      // Graceful fallback to demo registration if backend is unreachable
      console.warn('Backend unavailable, falling back to local registration:', e);
      const demoUser = {
        id: `user-${Date.now()}`,
        name: data.name || 'Demo User',
        email: data.email,
        role: data.role || 'FARMER',
        organization: data.organization || 'Demo Org',
        location: data.location || 'Demo Location',
      };
      const token = `demo-token-${Date.now()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  login: async (email: string, password: string) => {
    if (isDemoModeActive()) {
      const roleKey = Object.keys(DEMO_USERS).find((k) => email.toLowerCase().includes(k.toLowerCase())) || 'FARMER';
      const demoUser = DEMO_USERS[roleKey] || DEMO_USERS.FARMER;
      const token = `demo-token-${roleKey.toLowerCase()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(demoUser));
      return demoUser;
    }
    try {
      const res = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('inovix_token', res.token);
      localStorage.setItem('inovix_user', JSON.stringify(res.user));
      return res.user;
    } catch (e) {
      console.warn('Backend login unavailable, fallback to demo user:', e);
      const demoUser = DEMO_USERS.FARMER;
      const token = 'demo-token-farmer';
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  loginAsRole: async (role: string) => {
    const normalizedRole = role.toUpperCase();
    const demoUser = DEMO_USERS[normalizedRole] || DEMO_USERS.FARMER;

    if (isDemoModeActive()) {
      const token = `demo-token-${normalizedRole.toLowerCase()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(demoUser));
      return demoUser;
    }

    try {
      const res = await apiFetch<AuthResponse>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role: normalizedRole }) });
      localStorage.setItem('inovix_token', res.token);
      localStorage.setItem('inovix_user', JSON.stringify(res.user));
      return res.user;
    } catch (e) {
      console.warn('Backend demo-login failed, using instant local role:', e);
      const token = `demo-token-${normalizedRole.toLowerCase()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(demoUser));
      return demoUser;
    }
  },

  logout: async () => {
    localStorage.removeItem('inovix_token');
    localStorage.removeItem('inovix_user');
  },

  getCurrentUser: () => {
    const json = localStorage.getItem('inovix_user');
    return json ? JSON.parse(json) : null;
  },

  getMe: async () => {
    if (isDemoModeActive()) {
      return authService.getCurrentUser() || DEMO_USERS.FARMER;
    }
    try {
      return await apiFetch<any>('/auth/me');
    } catch {
      return authService.getCurrentUser() || DEMO_USERS.FARMER;
    }
  },
};
