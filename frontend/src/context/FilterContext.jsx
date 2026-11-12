/**
 * CommerceChain 360 - Global Analytical Filter Context
 */

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const FilterContext = createContext();

const initialFilters = {
  startDate: null,
  endDate: null,
  orderStatus: [],
  customerState: [],
  sellerState: [],
  category: [],
  paymentType: [],
  reviewScore: [],
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const toggleFilterItem = useCallback((key, item) => {
    setFilters(prev => {
      const currentList = prev[key] || [];
      const exists = currentList.includes(item);
      const updatedList = exists
        ? currentList.filter(x => x !== item)
        : [...currentList, item];
      return {
        ...prev,
        [key]: updatedList
      };
    });
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: Array.isArray(initialFilters[key]) ? [] : null
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const toggleFilterDrawer = useCallback(() => {
    setIsFilterDrawerOpen(prev => !prev);
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.orderStatus?.length) count++;
    if (filters.customerState?.length) count++;
    if (filters.sellerState?.length) count++;
    if (filters.category?.length) count++;
    if (filters.paymentType?.length) count++;
    if (filters.reviewScore?.length) count++;
    return count;
  }, [filters]);

  const isFiltered = activeFiltersCount > 0;

  const value = useMemo(() => ({
    filters,
    setFilter,
    toggleFilterItem,
    clearFilter,
    resetFilters,
    activeFiltersCount,
    isFiltered,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    toggleFilterDrawer
  }), [
    filters,
    setFilter,
    toggleFilterItem,
    clearFilter,
    resetFilters,
    activeFiltersCount,
    isFiltered,
    isFilterDrawerOpen,
    toggleFilterDrawer
  ]);

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}

