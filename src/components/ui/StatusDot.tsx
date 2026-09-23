import React from 'react';

export interface StatusDotProps {
  status: 'online' | 'offline' | 'warning' | 'error';
}

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const isAnimated = status !== 'offline';

  return (
    <span className="flex h-3 w-3 relative">
      {isAnimated && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status]}`}></span>
      )}
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colors[status]}`}></span>
    </span>
  );
};
