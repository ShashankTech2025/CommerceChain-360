/**
 * CommerceChain 360 - React Query Custom Hooks
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

// Metadata & System Info
export function useMetadata() {
  return useQuery({
    queryKey: ['metadata'],
    queryFn: api.getMetadata,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 2,
  });
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 30000,
  });
}

// Executive Overview
export function useExecutiveKPIs(filters) {
  return useQuery({
    queryKey: ['overview-kpis', filters],
    queryFn: () => api.getExecutiveKPIs(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useOverviewTrends(filters) {
  return useQuery({
    queryKey: ['overview-trends', filters],
    queryFn: () => api.getOverviewTrends(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useExecutiveInsights(filters) {
  return useQuery({
    queryKey: ['overview-insights', filters],
    queryFn: () => api.getExecutiveInsights(filters),
    staleTime: 1000 * 60 * 5,
  });
}

// Sales Intelligence
export function useSalesSummary(filters) {
  return useQuery({
    queryKey: ['sales-summary', filters],
    queryFn: () => api.getSalesSummary(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSalesMonthly(filters) {
  return useQuery({
    queryKey: ['sales-monthly', filters],
    queryFn: () => api.getSalesMonthly(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSalesCategories(filters) {
  return useQuery({
    queryKey: ['sales-categories', filters],
    queryFn: () => api.getSalesCategories(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSalesRegions(filters) {
  return useQuery({
    queryKey: ['sales-regions', filters],
    queryFn: () => api.getSalesRegions(filters),
    staleTime: 1000 * 60 * 5,
  });
}

// Customer Intelligence
export function useCustomersSummary(filters) {
  return useQuery({
    queryKey: ['customers-summary', filters],
    queryFn: () => api.getCustomersSummary(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCustomersSegments(filters) {
  return useQuery({
    queryKey: ['customers-segments', filters],
    queryFn: () => api.getCustomersSegments(filters),
    staleTime: 1000 * 60 * 5,
  });
}

// Product Intelligence
export function useProductsSummary(filters) {
  return useQuery({
    queryKey: ['products-summary', filters],
    queryFn: () => api.getProductsSummary(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductsCategories(filters) {
  return useQuery({
    queryKey: ['products-categories', filters],
    queryFn: () => api.getProductsCategories(filters),
    staleTime: 1000 * 60 * 5,
  });
}

// Logistics & Supply Chain
export function useLogisticsSummary(filters) {
  return useQuery({
    queryKey: ['logistics-summary', filters],
    queryFn: () => api.getLogisticsSummary(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogisticsDelays(filters) {
  return useQuery({
    queryKey: ['logistics-delays', filters],
    queryFn: () => api.getLogisticsDelays(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrderStatusDist(filters) {
  return useQuery({
    queryKey: ['order-status-dist', filters],
    queryFn: () => api.getOrderStatusDist(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSLAStatusDist(filters) {
  return useQuery({
    queryKey: ['sla-status-dist', filters],
    queryFn: () => api.getSLAStatusDist(filters),
    staleTime: 1000 * 60 * 5,
  });
}

// Payments & Customer Experience
export function usePaymentsSummary(filters) {
  return useQuery({
    queryKey: ['payments-summary', filters],
    queryFn: () => api.getPaymentsSummary(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePaymentMethods(filters) {
  return useQuery({
    queryKey: ['payments-methods', filters],
    queryFn: () => api.getPaymentMethods(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useReviewsSummary(filters) {
  return useQuery({
    queryKey: ['reviews-summary', filters],
    queryFn: () => api.getReviewsSummary(filters),
    staleTime: 1000 * 60 * 5,
  });
}

// Reports & Data Explorer
export function useOrdersTable({ page, pageSize, search, sortBy, sortDesc, filters }) {
  return useQuery({
    queryKey: ['orders-table', { page, pageSize, search, sortBy, sortDesc, filters }],
    queryFn: () => api.getOrdersTable({ page, pageSize, search, sortBy, sortDesc, filters }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
}

