import React from 'react';

export const SkeletonLine: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-card border border-gray-100 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
      <div className="space-y-2 flex-1">
        <SkeletonLine className="h-4 w-1/3" />
        <SkeletonLine className="h-3 w-1/4" />
      </div>
    </div>
    <div className="space-y-3">
      <SkeletonLine />
      <SkeletonLine />
      <SkeletonLine className="w-2/3" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex gap-4">
      <SkeletonLine className="h-4 w-1/4" />
      <SkeletonLine className="h-4 w-1/4" />
      <SkeletonLine className="h-4 w-1/4" />
      <SkeletonLine className="h-4 w-1/4" />
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex gap-4">
          <SkeletonLine className="h-4 w-1/4" />
          <SkeletonLine className="h-4 w-1/4" />
          <SkeletonLine className="h-4 w-1/4" />
          <SkeletonLine className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = 'h-64' }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-card border border-gray-100 flex flex-col ${className}`}>
    <SkeletonLine className="h-6 w-1/4 mb-6" />
    <div className="flex-1 flex items-end gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="bg-gray-200 animate-pulse rounded-t-sm flex-1" 
          style={{ height: `${Math.random() * 60 + 20}%`, animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  </div>
);

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-24 w-full' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);

