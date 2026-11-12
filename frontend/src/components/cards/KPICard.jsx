/**
 * CommerceChain 360 - Enterprise KPI Metric Card
 */

import React from 'react';
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Skeleton } from '../common/LoadingSpinner';

export default function KPICard({
  title,
  value,
  secondaryValue,
  trend, // 'up' | 'down' | 'neutral'
  trendText,
  icon: Icon,
  tooltip,
  loading = false,
  accentColor = 'teal', // 'teal' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose'
  className = '',
}) {
  const accentClasses = {
    teal: 'border-t-brand-teal text-brand-teal bg-teal-50 dark:bg-teal-950/30',
    blue: 'border-t-blue-600 text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    indigo: 'border-t-indigo-600 text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30',
    emerald: 'border-t-emerald-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
    amber: 'border-t-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    rose: 'border-t-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/30',
  };

  const accentBorder = {
    teal: 'border-t-brand-teal',
    blue: 'border-t-blue-600',
    indigo: 'border-t-indigo-600',
    emerald: 'border-t-emerald-600',
    amber: 'border-t-amber-500',
    rose: 'border-t-rose-500',
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-36 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700/70 border-t-4 ${
        accentBorder[accentColor] || 'border-t-brand-teal'
      } shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <span>{title}</span>
            {tooltip && (
              <div className="relative group/tooltip">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block z-30 w-52 p-2 bg-slate-900 text-white text-[11px] leading-tight rounded-lg shadow-lg">
                  {tooltip}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              accentClasses[accentColor] || accentClasses.teal
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(secondaryValue || trendText) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          {trendText && (
            <div className="flex items-center gap-1 font-medium">
              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
              <span
                className={
                  trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : trend === 'down'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
                }
              >
                {trendText}
              </span>
            </div>
          )}
          {secondaryValue && (
            <span className="text-slate-500 dark:text-slate-400 ml-auto">
              {secondaryValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

