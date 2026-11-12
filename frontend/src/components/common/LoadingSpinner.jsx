/**
 * CommerceChain 360 - Loading Spinner & Shimmer Components
 */

import React from 'react';

export function LoadingSpinner({ size = 'md', className = '', text = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-3',
    lg: 'w-10 h-10 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-brand-teal/20 border-t-brand-teal animate-spin`}
      />
      {text && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {text}
        </span>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700/60 rounded ${className}`}
    />
  );
}

export default LoadingSpinner;

