import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  glass?: boolean;
  className?: string;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon: Icon,
  action,
  glass,
  className = '',
  children
}) => {
  const baseClass = glass
    ? 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl'
    : 'bg-white shadow-card border border-gray-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl ${baseClass} ${className} overflow-hidden`}
    >
      {(title || subtitle || Icon || action) && (
        <div className="p-5 border-b border-gray-100/50 flex justify-between items-start">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                <Icon size={20} />
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  );
};
