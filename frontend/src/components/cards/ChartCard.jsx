/**
 * CommerceChain 360 - Reusable ECharts Card Container
 */

import React, { useState } from 'react';
import { HelpCircle, Maximize2, Minimize2, Download, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ChartCard({
  title,
  subtitle,
  tooltip,
  children,
  loading = false,
  error = null,
  isEmpty = false,
  emptyMessage = 'No records match the active filter criteria.',
  onExport,
  className = '',
  height = 'h-80',
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col transition-all duration-200 ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl p-6 bg-white dark:bg-slate-900'
          : `p-5 ${className}`
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            {tooltip && (
              <div className="relative group/tooltip">
                <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block z-30 w-64 p-2.5 bg-slate-900 text-white text-xs leading-relaxed rounded-lg shadow-lg">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {onExport && (
            <button
              onClick={onExport}
              title="Export Data"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body / Chart Area */}
      <div className={`relative flex-1 ${isFullscreen ? 'h-[calc(100%-4rem)]' : height}`}>
        {loading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xs flex items-center justify-center z-10 rounded-lg">
            <LoadingSpinner size="lg" text="Aggregating metrics..." />
          </div>
        )}

        {error && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-rose-500">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Failed to load chart metrics</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">{error?.message || 'Server error'}</p>
          </div>
        )}

        {isEmpty && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center mb-2">
              <HelpCircle className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No Data Available</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">{emptyMessage}</p>
          </div>
        )}

        {!error && !isEmpty && children}
      </div>
    </div>
  );
}

