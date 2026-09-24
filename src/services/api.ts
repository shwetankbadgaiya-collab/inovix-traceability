// Dynamically configure backend API base URL from environment variables for production (Netlify)
export function getApiBase(): string {
  // 1. Runtime override via window.__INOVIX_API_URL__ (for emergency configuration in console/scripts)
  if (typeof window !== 'undefined' && (window as any).__INOVIX_API_URL__) {
    const custom = String((window as any).__INOVIX_API_URL__).trim().replace(/\/+$/, '');
    return custom.endsWith('/api') ? custom : `${custom}/api`;
  }

  // 2. Build-time Vite / Netlify environment variable
  const envUrl = (
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL ||
    ''
  ).trim().replace(/\/+$/, '');

  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  // 3. Production Fallback:
  // If running in browser on Netlify or any public domain, route to deployed Render backend
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '0.0.0.0') {
      return 'https://inovix-traceability.onrender.com/api';
    }
  }

  // 4. Default for local development
  return 'http://localhost:5000/api';
}

export const API_BASE = getApiBase();
export const API_HOST = API_BASE.replace(/\/api\/?$/, '');

function getToken(): string | null {
  return localStorage.getItem('inovix_token');
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const baseUrl = getApiBase();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${baseUrl}${cleanPath}`, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
  return res.json();
}
