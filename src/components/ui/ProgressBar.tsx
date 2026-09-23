import React from 'react';

export interface ProgressBarProps {
  value: number;
  color?: 'green' | 'blue' | 'orange' | 'red';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'green',
  size = 'md',
  showLabel = false,
  animated = true
}) => {
  const safeValue = Math.min(Math.max(value, 0), 100);

  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">{safeValue}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} h-full rounded-full ${animated ? 'transition-all duration-500 ease-out relative' : ''}`}
          style={{ width: `${safeValue}%` }}
        >
          {animated && (
            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
          )}
        </div>
      </div>
    </div>
  );
};
