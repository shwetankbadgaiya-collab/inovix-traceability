import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { StatusDot } from '../ui/StatusDot';
import { useAuth } from '../../contexts/AuthContext';
import { useDemo } from '../../contexts/DemoContext';

export const Navbar: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isOnline, bufferedReadings: bufferedCount } = useDemo();
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathSegments.length > 1 
    ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1).replace('-', ' ') 
    : 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-800 capitalize hidden sm:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Network & Node Connectivity Status */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <StatusDot status={isOnline ? 'online' : 'offline'} />
          <span className="text-xs font-semibold text-gray-700">
            {isOnline ? 'Network: Synchronized' : `Offline Buffering (${bufferedCount})`}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Identity Display */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold overflow-hidden flex items-center justify-center text-xs">
            {user?.name?.charAt(0) || 'R'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'Rajesh Kumar'}</p>
            <p className="text-[10px] text-gray-500 font-medium">{user?.role || 'Farmer'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
