import { apiFetch } from './api';

interface AuthResponse {
  user: any;
  token: string;
}

export const authService = {
  register: async (data: { email: string; password: string; name: string; role: string; organization: string; location: string }) => {
    const res = await apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    localStorage.setItem('inovix_token', res.token);
    localStorage.setItem('inovix_user', JSON.stringify(res.user));
    return res.user;
  },
  login: async (email: string, password: string) => {
    const res = await apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('inovix_token', res.token);
    localStorage.setItem('inovix_user', JSON.stringify(res.user));
    return res.user;
  },
  loginAsRole: async (role: string) => {
    const res = await apiFetch<AuthResponse>('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) });
    localStorage.setItem('inovix_token', res.token);
    localStorage.setItem('inovix_user', JSON.stringify(res.user));
    return res.user;
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
    return apiFetch<any>('/auth/me');
  },
};
