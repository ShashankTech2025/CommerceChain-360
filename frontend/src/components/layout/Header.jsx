/**
 * CommerceChain 360 - Top Navigation Header
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, Download, Layers, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFilters } from '../../context/FilterContext';
import { api } from '../../services/api';

const routeTitles = {
  '/': { title: 'Executive Overview', category: 'Executive Suite' },
  '/sales': { title: 'Sales & Revenue Intelligence', category: 'Commercial Analytics' },
  '/customers': { title: 'Customer & RFM Segmentation', category: 'Customer Analytics' },
  '/products': { title: 'Product & Merchandise Intelligence', category: 'Catalog Management' },
  '/logistics': { title: 'Supply Chain & Delivery SLA', category: 'Logistics Analytics' },
  '/payments': { title: 'Payments, Financing & CSAT', category: 'Finance & Experience' },
  '/explorer': { title: 'Order & Data Explorer', category: 'Operational Data' },
  '/reports': { title: 'Executive Intelligence Reports', category: 'Reports & Exports' },
};

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const { filters } = useFilters();

  const currentRoute = routeTitles[location.pathname] || {
    title: 'Analytics Dashboard',
    category: 'CommerceChain 360'
  };

  const handleExportData = () => {
    const exportUrl = api.getExportUrl({ format: 'csv', filters, limit: 10000 });
    window.open(exportUrl, '_blank');
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 transition-colors">
      {/* Page Title & Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <Layers className="w-3.5 h-3.5" />
          <span>{currentRoute.category}</span>
          <span>/</span>
          <span className="text-brand-teal font-semibold">{currentRoute.title}</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {currentRoute.title}
        </h1>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Quick CSV Export Button */}
        <button
          onClick={handleExportData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          title="Export filtered orders to CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Security / Verification Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Cartesian Inflation</span>
        </div>
      </div>
    </header>
  );
}

