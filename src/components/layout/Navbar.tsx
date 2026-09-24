import React from 'react';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { StatusDot } from '../ui/StatusDot';
import { useAuth } from '../../contexts/AuthContext';
import { useDemo } from '../../contexts/DemoContext';

export const Navbar: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isDemoMode, toggleDemo: toggleDemoMode, isOnline, bufferedReadings: bufferedCount } = useDemo();
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pageTitle = pathSegments.length > 1 
    ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1).replace('-', ' ') 
    : 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 capitalize hidden sm:block">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Demo Mode Toggle Button */}
        <button
          onClick={toggleDemoMode}
          title={isDemoMode ? "Demo Mode Active (Using local reliable state). Click to toggle Live API." : "Live Backend Mode. Click to switch to Demo Mode."}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            isDemoMode 
              ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)] hover:bg-emerald-700' 
              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isDemoMode ? 'text-yellow-300' : 'text-gray-400'}`} />
          <span>{isDemoMode ? 'Demo Mode: ON' : 'Live API'}</span>
        </button>

        {/* Network Status */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <StatusDot status={isOnline ? 'online' : 'offline'} />
          <span className="text-xs font-medium text-gray-600">
            {isOnline ? 'Online' : `Offline (${bufferedCount})`}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Mobile Avatar */}
        <div className="md:hidden w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-bold overflow-hidden flex items-center justify-center text-xs">
          {user?.name?.charAt(0) || 'D'}
        </div>
      </div>
    </header>
  );
};
