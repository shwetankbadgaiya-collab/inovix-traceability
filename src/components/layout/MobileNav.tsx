import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Activity, QrCode, Bell } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/batches', label: 'Batches', icon: Package },
    { path: '/dashboard/iot', label: 'IoT', icon: Activity },
    { path: '/dashboard/qr', label: 'QR', icon: QrCode },
    { path: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.exact}
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-full h-full gap-1 transition-colors
            ${isActive ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}
          `}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
