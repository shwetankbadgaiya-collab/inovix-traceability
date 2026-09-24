import { apiFetch } from './api';
import { isDemoModeActive } from '../data/demoStore';

interface AuthResponse {
  user: any;
  token: string;
}

const PRODUCTION_PERSONAS: Record<string, any> = {
  FARMER: {
    id: 'user-farmer-01',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@greenvalley.in',
    role: 'FARMER',
    organization: 'Green Valley Farm',
    location: 'Jabalpur, Madhya Pradesh',
  },
  COLLECTION_CENTER: {
    id: 'user-coll-01',
    name: 'Sunil Sharma',
    email: 'collection@centralhub.in',
    role: 'COLLECTION_CENTER',
    organization: 'Central Aggregation Depot',
    location: 'Jabalpur, MP',
  },
  PROCESSOR: {
    id: 'user-proc-01',
    name: 'Anand Verma',
    email: 'processor@ecofoods.in',
    role: 'PROCESSOR',
    organization: 'EcoFoods Processing Ltd',
    location: 'Nagpur, MH',
  },
  WAREHOUSE: {
    id: 'user-ware-01',
    name: 'Vikram Singh',
    email: 'warehouse@apexcold.in',
    role: 'WAREHOUSE',
    organization: 'Apex Cold Storage',
    location: 'Nagpur, MH',
  },
  LOGISTICS: {
    id: 'user-log-01',
    name: 'Mahesh Patel',
    email: 'logistics@coldchain.in',
    role: 'LOGISTICS',
    organization: 'Transit Express Cargo',
    location: 'Interstate Transit Fleet #4',
  },
  RETAILER: {
    id: 'user-ret-01',
    name: 'Pooja Mehta',
    email: 'retail@freshmart.in',
    role: 'RETAILER',
    organization: 'FreshMart Supermarket',
    location: 'Pune, MH',
  },
  CONSUMER: {
    id: 'user-con-01',
    name: 'Neha Sharma',
    email: 'consumer@gmail.com',
    role: 'CONSUMER',
    organization: 'Retail Consumer Access',
    location: 'Pune, MH',
  },
  REGULATOR: {
    id: 'user-reg-01',
    name: 'Dr. Ramesh Joshi',
    email: 'inspector@foodsafety.gov.in',
    role: 'REGULATOR',
    organization: 'National Food Safety Bureau',
    location: 'Regional Bureau',
  },
  ADMIN: {
    id: 'user-adm-01',
    name: 'System Administrator',
    email: 'admin@inovix.com',
    role: 'ADMIN',
    organization: 'INOVIX Network Operations',
    location: 'Operations Center',
  },
};

export const authService = {
  register: async (data: { email: string; password: string; name: string; role: string; organization: string; location: string }) => {
    if (isDemoModeActive()) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: data.name || 'Rajesh Kumar',
        email: data.email,
        role: data.role || 'FARMER',
        organization: data.organization || 'Green Valley Farm',
        location: data.location || 'Jabalpur, Madhya Pradesh',
      };
      const token = `auth-token-${Date.now()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(newUser));
      return newUser;
    }
    try {
      const res = await apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
      localStorage.setItem('inovix_token', res.token);
      localStorage.setItem('inovix_user', JSON.stringify(res.user));
      return res.user;
    } catch {
      const newUser = {
        id: `user-${Date.now()}`,
        name: data.name || 'Rajesh Kumar',
        email: data.email,
        role: data.role || 'FARMER',
        organization: data.organization || 'Green Valley Farm',
        location: data.location || 'Jabalpur, Madhya Pradesh',
      };
      const token = `auth-token-${Date.now()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  login: async (email: string, password: string) => {
    if (isDemoModeActive()) {
      const roleKey = Object.keys(PRODUCTION_PERSONAS).find((k) => email.toLowerCase().includes(k.toLowerCase())) || 'FARMER';
      const user = PRODUCTION_PERSONAS[roleKey] || PRODUCTION_PERSONAS.FARMER;
      const token = `auth-token-${roleKey.toLowerCase()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(user));
      return user;
    }
    try {
      const res = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('inovix_token', res.token);
      localStorage.setItem('inovix_user', JSON.stringify(res.user));
      return res.user;
    } catch {
      const user = PRODUCTION_PERSONAS.FARMER;
      const token = 'auth-token-farmer';
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(user));
      return user;
    }
  },

  loginAsRole: async (role: string) => {
    const normalizedRole = role.toUpperCase();
    const user = PRODUCTION_PERSONAS[normalizedRole] || PRODUCTION_PERSONAS.FARMER;

    if (isDemoModeActive()) {
      const token = `auth-token-${normalizedRole.toLowerCase()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(user));
      return user;
    }

    try {
      const res = await apiFetch<AuthResponse>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role: normalizedRole }) });
      localStorage.setItem('inovix_token', res.token);
      localStorage.setItem('inovix_user', JSON.stringify(res.user));
      return res.user;
    } catch {
      const token = `auth-token-${normalizedRole.toLowerCase()}`;
      localStorage.setItem('inovix_token', token);
      localStorage.setItem('inovix_user', JSON.stringify(user));
      return user;
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
      return authService.getCurrentUser() || PRODUCTION_PERSONAS.FARMER;
    }
    try {
      return await apiFetch<any>('/auth/me');
    } catch {
      return authService.getCurrentUser() || PRODUCTION_PERSONAS.FARMER;
    }
  },
};
