/**
 * CommerceChain 360 - Searchable Multi-Select Filter Dropdown
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export default function MultiSelectDropdown({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search options...',
  maxDisplay = 2,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(opt => {
      const val = typeof opt === 'string' ? opt : (opt.label || opt.value);
      return val.toString().toLowerCase().includes(q);
    });
  }, [options, search]);

  const toggleOption = (val) => {
    const exists = selected.includes(val);
    const updated = exists ? selected.filter(x => x !== val) : [...selected, val];
    onChange(updated);
  };

  const handleSelectAll = () => {
    const allVals = options.map(opt => typeof opt === 'string' ? opt : opt.value);
    onChange(allVals);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  // Button label summary
  const summaryText = useMemo(() => {
    if (selected.length === 0) return placeholder;
    if (selected.length <= maxDisplay) {
      return selected.join(', ');
    }
    return `${selected.length} selected`;
  }, [selected, placeholder, maxDisplay]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
          selected.length > 0
            ? 'bg-brand-navy/5 dark:bg-brand-teal/10 border-brand-teal text-slate-900 dark:text-teal-200'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
        }`}
      >
        <span className="truncate">{summaryText}</span>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {selected.length > 0 && (
            <span
              onClick={handleClear}
              className="p-0.5 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-64 max-h-72 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full text-xs bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
            <button
              type="button"
              onClick={handleSelectAll}
              className="hover:text-brand-teal font-medium"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => onChange([])}
              className="hover:text-rose-500 font-medium"
            >
              Clear
            </button>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto p-1 max-h-48 divide-y divide-slate-50 dark:divide-slate-800">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const val = typeof opt === 'string' ? opt : opt.value;
                const labelText = typeof opt === 'string' ? opt : opt.label;
                const isChecked = selected.includes(val);

                return (
                  <div
                    key={val}
                    onClick={() => toggleOption(val)}
                    className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <span className="truncate text-slate-700 dark:text-slate-200">
                      {labelText}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                        isChecked
                          ? 'bg-brand-teal border-brand-teal text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

