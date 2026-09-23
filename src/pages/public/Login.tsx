import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/ui/Logo';
import {
  Sprout, Building2, Factory, Warehouse as WarehouseIcon, Truck,
  Store, Users, ShieldCheck, Settings, Mail, Lock, AlertCircle, Loader2
} from 'lucide-react';

const DEMO_ROLES = [
  { role: 'FARMER', label: 'Farmer', icon: Sprout, color: 'border-green-500 bg-green-50' },
  { role: 'COLLECTION_CENTER', label: 'Collection Centre', icon: Building2, color: 'border-emerald-500 bg-emerald-50' },
  { role: 'PROCESSOR', label: 'Food Processor', icon: Factory, color: 'border-blue-500 bg-blue-50' },
  { role: 'WAREHOUSE', label: 'Warehouse', icon: WarehouseIcon, color: 'border-amber-500 bg-amber-50' },
  { role: 'LOGISTICS', label: 'Logistics', icon: Truck, color: 'border-orange-500 bg-orange-50' },
  { role: 'RETAILER', label: 'Retailer', icon: Store, color: 'border-purple-500 bg-purple-50' },
  { role: 'CONSUMER', label: 'Consumer', icon: Users, color: 'border-pink-500 bg-pink-50' },
  { role: 'REGULATOR', label: 'Regulator', icon: ShieldCheck, color: 'border-red-500 bg-red-50' },
  { role: 'ADMIN', label: 'Admin', icon: Settings, color: 'border-gray-500 bg-gray-50' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: string) => {
    setError('');
    setDemoLoading(role);
    try {
      await loginAsRole(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed. Is the server running?');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 text-white flex-col justify-center px-16">
        <Logo size="lg" variant="dark" />
        <h1 className="text-4xl font-bold mt-8">Farm-to-Fork Traceability</h1>
        <p className="text-primary-200 mt-4 text-lg">Making Every Food Journey Visible, Verifiable & Affordable</p>
        <div className="mt-12 space-y-4 text-primary-200">
          <p>✓ IoT-powered condition monitoring</p>
          <p>✓ Blockchain-anchored supply chain events</p>
          <p>✓ QR-based consumer verification</p>
          <p>✓ Role-based access for every stakeholder</p>
        </div>
      </div>
      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo size="md" /></div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to INOVIX</h2>
          <p className="text-gray-500 mt-2">Enter your credentials or use a demo account</p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="input-field pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-gray-50 text-gray-500">Or continue with a demo account</span></div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {DEMO_ROLES.map(({ role, label, icon: Icon, color }) => (
                <button key={role} onClick={() => handleDemoLogin(role)} disabled={!!demoLoading}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 ${color} hover:shadow-md transition-all text-xs font-medium text-gray-700 disabled:opacity-50`}>
                  {demoLoading === role ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
