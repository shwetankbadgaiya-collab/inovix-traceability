import React from 'react';
import { motion } from 'framer-motion';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'light', className = '' }) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', letter: 'text-sm' },
    md: { icon: 'w-10 h-10', text: 'text-xl', letter: 'text-base' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', letter: 'text-lg' }
  };

  const textColor = variant === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg ${sizeClasses[size].icon}`}
      >
        <span className={`font-bold text-white tracking-tighter ${sizeClasses[size].letter}`}>
          IX
        </span>
      </motion.div>
      <span className={`font-extrabold tracking-tight ${textColor} ${sizeClasses[size].text}`}>
        INOVIX
      </span>
    </div>
  );
};
