import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, PlusCircle, Activity, QrCode, Bell, 
  ArrowLeftRight, FileText, Truck, MapPin, Search, ShieldCheck, 
  Settings, Users, BarChart3, Database, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { useDemo } from '../../contexts/DemoContext';

type Role = 'farmer' | 'collection_centre' | 'food_processor' | 'warehouse' | 'logistics' | 'retailer' | 'consumer' | 'regulator' | 'admin';

const getNavItems = (role: Role) => {
  const items = {
    farmer: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/batches', label: 'My Batches', icon: Package },
      { path: '/dashboard/create-batch', label: 'Create Batch', icon: PlusCircle },
      { path: '/dashboard/iot', label: 'IoT Status', icon: Activity },
      { path: '/dashboard/qr', label: 'Generate QR', icon: QrCode },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ],
    collection_centre: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/incoming', label: 'Incoming Batches', icon: ArrowLeftRight },
      { path: '/dashboard/collections', label: 'Collections', icon: Package },
      { path: '/dashboard/iot', label: 'IoT Monitoring', icon: Activity },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ],
    food_processor: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/incoming', label: 'Incoming Batches', icon: ArrowLeftRight },
      { path: '/dashboard/processing', label: 'Processing Events', icon: Activity },
      { path: '/dashboard/transform', label: 'Batch Transformation', icon: Package },
      { path: '/dashboard/blockchain', label: 'Blockchain Records', icon: Database },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ],
    warehouse: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/stored', label: 'Stored Batches', icon: Package },
      { path: '/dashboard/inventory', label: 'Inventory', icon: FileText },
      { path: '/dashboard/iot', label: 'IoT Monitoring', icon: Activity },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ],
    logistics: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/shipments', label: 'Active Shipments', icon: Truck },
      { path: '/dashboard/env', label: 'Temperature/Humidity', icon: Activity },
      { path: '/dashboard/location', label: 'Location', icon: MapPin },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ],
    retailer: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/received', label: 'Received Batches', icon: Package },
      { path: '/dashboard/history', label: 'Product History', icon: FileText },
      { path: '/dashboard/qr', label: 'QR Verification', icon: QrCode },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    ],
    consumer: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/scan', label: 'Scan QR', icon: QrCode },
      { path: '/dashboard/journey', label: 'Product Journey', icon: MapPin },
      { path: '/dashboard/verification', label: 'Verification Status', icon: ShieldCheck },
    ],
    regulator: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/batches', label: 'All Batches', icon: Package },
      { path: '/dashboard/records', label: 'Traceability Records', icon: FileText },
      { path: '/dashboard/audit', label: 'Blockchain Audit', icon: Database },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
      { path: '/dashboard/compliance', label: 'Compliance', icon: ShieldCheck },
    ],
    admin: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/dashboard/batches', label: 'Batches', icon: Package },
      { path: '/dashboard/iot', label: 'IoT Monitoring', icon: Activity },
      { path: '/dashboard/blockchain', label: 'Blockchain', icon: Database },
      { path: '/dashboard/qr', label: 'QR Codes', icon: QrCode },
      { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
      { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
      { path: '/dashboard/users', label: 'Users', icon: Users },
      { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    ]
  };

  return items[role] || items.farmer;
};

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDemoMode, toggleDemo: toggleDemoMode } = useDemo();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const normalizedRole = (user?.role?.toLowerCase() || 'farmer') as Role;
  const navItems = getNavItems(normalizedRole);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col h-screen bg-white border-r border-gray-100 sticky top-0 z-20"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, display: 'none' }}>
              <Logo size="sm" variant="light" />
            </motion.div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-lg mx-auto">
              <span className="font-bold text-white text-xs">IX</span>
            </div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 absolute right-[-14px] top-5 bg-white border border-gray-200 shadow-sm z-10"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className={isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            {!collapsed && <span className="text-sm font-medium text-gray-600">Demo Mode</span>}
            <button
              onClick={toggleDemoMode}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDemoMode ? 'bg-primary-500' : 'bg-gray-300'}`}
              title="Toggle Demo Mode"
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDemoMode ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            {!collapsed && <span className="text-sm font-medium text-gray-600">Network</span>}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
              title="Toggle Online Status"
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isOnline ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} pt-2`}>
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
            {user?.name?.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
