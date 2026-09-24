import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../../components/ui/Logo';
import {
  Sprout, Building2, Factory, Warehouse as WarehouseIcon, Truck,
  Store, Users, ShieldCheck, Settings, Mail, Lock, AlertCircle, Loader2, UserCheck, ArrowRight
} from 'lucide-react';

const STAKEHOLDER_ROLES = [
  { role: 'FARMER', label: 'Farmer', icon: Sprout, color: 'border-green-500 bg-green-50 hover:bg-green-100' },
  { role: 'COLLECTION_CENTER', label: 'Collection Hub', icon: Building2, color: 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100' },
  { role: 'PROCESSOR', label: 'Food Processor', icon: Factory, color: 'border-blue-500 bg-blue-50 hover:bg-blue-100' },
  { role: 'WAREHOUSE', label: 'Warehouse', icon: WarehouseIcon, color: 'border-amber-500 bg-amber-50 hover:bg-amber-100' },
  { role: 'LOGISTICS', label: 'Logistics', icon: Truck, color: 'border-orange-500 bg-orange-50 hover:bg-orange-100' },
  { role: 'RETAILER', label: 'Retailer', icon: Store, color: 'border-purple-500 bg-purple-50 hover:bg-purple-100' },
  { role: 'CONSUMER', label: 'Consumer', icon: Users, color: 'border-pink-500 bg-pink-50 hover:bg-pink-100' },
  { role: 'REGULATOR', label: 'Regulator', icon: ShieldCheck, color: 'border-red-500 bg-red-50 hover:bg-red-100' },
  { role: 'ADMIN', label: 'Admin', icon: Settings, color: 'border-gray-500 bg-gray-50 hover:bg-gray-100' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('rajesh.kumar@greenvalley.in');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticatingRole, setAuthenticatingRole] = useState<string | null>(null);

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

  const handleQuickRoleLogin = async (role: string) => {
    setError('');
    setAuthenticatingRole(role);
    try {
      await loginAsRole(role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setAuthenticatingRole(null);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-800 to-primary-950 text-white flex-col justify-center px-16">
        <Logo size="lg" variant="dark" />
        <h1 className="text-4xl font-extrabold mt-8 tracking-tight">Farm-to-Fork Traceability</h1>
        <p className="text-primary-200 mt-4 text-lg">Making Every Food Journey Visible, Verifiable & Affordable</p>
        <div className="mt-12 space-y-4 text-primary-200 text-sm">
          <p className="flex items-center gap-2">✓ Low-cost ESP32 IoT condition monitoring</p>
          <p className="flex items-center gap-2">✓ Tamper-evident blockchain custodial handovers</p>
          <p className="flex items-center gap-2">✓ QR-based consumer verification without apps</p>
          <p className="flex items-center gap-2">✓ Role-based access for farmers, logistics, and buyers</p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden mb-6"><Logo size="md" /></div>
          <h2 className="text-2xl font-extrabold text-gray-900">Sign in to INOVIX</h2>
          <p className="text-gray-500 text-sm mt-1">Farm-to-Fork Traceability Platform</p>

          {/* Quick Access as Farmer (Rajesh Kumar) */}
          <div className="mt-5">
            <button
              onClick={() => handleQuickRoleLogin('FARMER')}
              disabled={!!authenticatingRole}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-xl font-bold shadow-md hover:from-primary-700 hover:to-primary-800 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-white" />
                <span className="text-sm">Sign in as Rajesh Kumar (Farmer)</span>
              </div>
              {authenticatingRole === 'FARMER' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Stakeholder Personas Grid */}
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-3 bg-gray-50 text-gray-400 font-semibold">Or Select Stakeholder Role</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {STAKEHOLDER_ROLES.map(({ role, label, icon: Icon, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleQuickRoleLogin(role)}
                  disabled={!!authenticatingRole}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 ${color} transition-all text-[11px] font-semibold text-gray-700 disabled:opacity-50`}
                >
                  {authenticatingRole === role ? <Loader2 className="w-4 h-4 animate-spin text-primary-600" /> : <Icon className="w-4 h-4" />}
                  <span className="truncate w-full text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Standard Credentials Form */}
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="px-3 bg-gray-50 text-gray-400 font-semibold">Or Sign in with Email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh.kumar@greenvalley.in"
                    className="input-field pl-9 text-xs sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-9 text-xs sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : 'Sign In'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
