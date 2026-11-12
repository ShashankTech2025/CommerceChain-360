/**
 * CommerceChain 360 - Interactive Analytical Filter Bar
 */

import React from 'react';
import { RotateCcw, Filter, Calendar, X } from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { useMetadata } from '../../hooks/useAnalytics';
import MultiSelectDropdown from './MultiSelectDropdown';

export default function FilterBar() {
  const {
    filters,
    setFilter,
    resetFilters,
    clearFilter,
    isFiltered,
    activeFiltersCount
  } = useFilters();

  const { data: metadata } = useMetadata();

  const states = metadata?.customer_states || [];
  const categories = metadata?.categories || [];
  const orderStatuses = metadata?.order_statuses || [];
  const paymentTypes = (metadata?.payment_types || []).map(p => ({
    value: p,
    label: p.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));
  const reviewScores = [
    { value: 5, label: '5 Stars (Excellent)' },
    { value: 4, label: '4 Stars (Good)' },
    { value: 3, label: '3 Stars (Average)' },
    { value: 2, label: '2 Stars (Poor)' },
    { value: 1, label: '1 Star (Critical)' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-brand-teal" />
            <span>Filters:</span>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="date"
              value={filters.startDate || ''}
              min={metadata?.date_range?.min_date}
              max={metadata?.date_range?.max_date}
              onChange={(e) => setFilter('startDate', e.target.value || null)}
              className="bg-transparent border-none outline-none text-xs w-28 text-slate-800 dark:text-slate-200"
              title="Start Date"
            />
            <span className="text-slate-400 font-medium">to</span>
            <input
              type="date"
              value={filters.endDate || ''}
              min={metadata?.date_range?.min_date}
              max={metadata?.date_range?.max_date}
              onChange={(e) => setFilter('endDate', e.target.value || null)}
              className="bg-transparent border-none outline-none text-xs w-28 text-slate-800 dark:text-slate-200"
              title="End Date"
            />
          </div>

          {/* Customer State Filter */}
          <MultiSelectDropdown
            options={states}
            selected={filters.customerState}
            onChange={(val) => setFilter('customerState', val)}
            placeholder="Customer State"
            searchPlaceholder="Filter state code..."
            className="w-36"
          />

          {/* Product Category Filter */}
          <MultiSelectDropdown
            options={categories}
            selected={filters.category}
            onChange={(val) => setFilter('category', val)}
            placeholder="Category"
            searchPlaceholder="Filter category..."
            className="w-44"
          />

          {/* Order Status Filter */}
          <MultiSelectDropdown
            options={orderStatuses}
            selected={filters.orderStatus}
            onChange={(val) => setFilter('orderStatus', val)}
            placeholder="Order Status"
            searchPlaceholder="Filter status..."
            className="w-36"
          />

          {/* Payment Type Filter */}
          <MultiSelectDropdown
            options={paymentTypes}
            selected={filters.paymentType}
            onChange={(val) => setFilter('paymentType', val)}
            placeholder="Payment Method"
            searchPlaceholder="Filter tender..."
            className="w-38"
          />

          {/* Review Score Filter */}
          <MultiSelectDropdown
            options={reviewScores}
            selected={filters.reviewScore}
            onChange={(val) => setFilter('reviewScore', val)}
            placeholder="CSAT Rating"
            searchPlaceholder="Filter stars..."
            className="w-36"
          />
        </div>

        {/* Right Side: Reset Button */}
        {isFiltered && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-brand-teal font-medium">
              {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
            </span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-[11px] font-medium text-slate-400">Active criteria:</span>

          {filters.startDate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px]">
              From: {filters.startDate}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => clearFilter('startDate')} />
            </span>
          )}

          {filters.endDate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[11px]">
              To: {filters.endDate}
              <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => clearFilter('endDate')} />
            </span>
          )}

          {filters.customerState.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px]">
              State: {s}
              <X
                className="w-3 h-3 cursor-pointer hover:text-rose-500"
                onClick={() => setFilter('customerState', filters.customerState.filter(x => x !== s))}
              />
            </span>
          ))}

          {filters.category.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px]">
              {c}
              <X
                className="w-3 h-3 cursor-pointer hover:text-rose-500"
                onClick={() => setFilter('category', filters.category.filter(x => x !== c))}
              />
            </span>
          ))}

          {filters.orderStatus.map(st => (
            <span key={st} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px]">
              Status: {st}
              <X
                className="w-3 h-3 cursor-pointer hover:text-rose-500"
                onClick={() => setFilter('orderStatus', filters.orderStatus.filter(x => x !== st))}
              />
            </span>
          ))}

          {filters.paymentType.map(pt => (
            <span key={pt} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px]">
              {pt.replace('_', ' ')}
              <X
                className="w-3 h-3 cursor-pointer hover:text-rose-500"
                onClick={() => setFilter('paymentType', filters.paymentType.filter(x => x !== pt))}
              />
            </span>
          ))}

          {filters.reviewScore.map(sc => (
            <span key={sc} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px]">
              ★ {sc}
              <X
                className="w-3 h-3 cursor-pointer hover:text-rose-500"
                onClick={() => setFilter('reviewScore', filters.reviewScore.filter(x => x !== sc))}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

