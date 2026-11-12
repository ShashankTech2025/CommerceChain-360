/**
 * CommerceChain 360 - Status & Metric Badge Component
 */

import React from 'react';

const variants = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  brand: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const dotColors = {
  success: 'bg-emerald-500',
  danger: 'bg-rose-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  brand: 'bg-cyan-500',
  neutral: 'bg-slate-400',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
}) {
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs font-medium' 
    : 'px-2.5 py-1 text-xs font-semibold';

  const variantClass = variants[variant] || variants.neutral;
  const dotColor = dotColors[variant] || dotColors.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${sizeClasses} ${variantClass} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      )}
      {children}
    </span>
  );
}

