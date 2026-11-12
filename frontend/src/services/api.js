/**
 * CommerceChain 360 - Frontend API Service Client
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Builds URLSearchParams from filter objects handling arrays and dates.
 */
export function buildFilterParams(filters = {}) {
  const params = new URLSearchParams();

  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);

  if (Array.isArray(filters.orderStatus) && filters.orderStatus.length > 0) {
    filters.orderStatus.forEach(s => params.append('order_status', s));
  }

  if (Array.isArray(filters.customerState) && filters.customerState.length > 0) {
    filters.customerState.forEach(s => params.append('customer_state', s));
  }

  if (Array.isArray(filters.sellerState) && filters.sellerState.length > 0) {
    filters.sellerState.forEach(s => params.append('seller_state', s));
  }

  if (Array.isArray(filters.category) && filters.category.length > 0) {
    filters.category.forEach(c => params.append('category', c));
  }

  if (Array.isArray(filters.paymentType) && filters.paymentType.length > 0) {
    filters.paymentType.forEach(p => params.append('payment_type', p));
  }

  if (Array.isArray(filters.reviewScore) && filters.reviewScore.length > 0) {
    filters.reviewScore.forEach(r => params.append('review_score', r.toString()));
  }

  return params;
}

export const api = {
  // System & Metadata
  getHealth: () => apiClient.get('/health').then(r => r.data),
  getMetadata: () => apiClient.get('/metadata').then(r => r.data),

  // Executive Overview
  getExecutiveKPIs: (filters) => apiClient.get('/overview/kpis', { params: buildFilterParams(filters) }).then(r => r.data),
  getOverviewTrends: (filters) => apiClient.get('/overview/trends', { params: buildFilterParams(filters) }).then(r => r.data),
  getExecutiveInsights: (filters) => apiClient.get('/overview/insights', { params: buildFilterParams(filters) }).then(r => r.data),

  // Sales Intelligence
  getSalesSummary: (filters) => apiClient.get('/sales/summary', { params: buildFilterParams(filters) }).then(r => r.data),
  getSalesMonthly: (filters) => apiClient.get('/sales/monthly', { params: buildFilterParams(filters) }).then(r => r.data),
  getSalesCategories: (filters) => apiClient.get('/sales/categories', { params: buildFilterParams(filters) }).then(r => r.data),
  getSalesRegions: (filters) => apiClient.get('/sales/regions', { params: buildFilterParams(filters) }).then(r => r.data),

  // Customer Intelligence
  getCustomersSummary: (filters) => apiClient.get('/customers/summary', { params: buildFilterParams(filters) }).then(r => r.data),
  getCustomersSegments: (filters) => apiClient.get('/customers/segments', { params: buildFilterParams(filters) }).then(r => r.data),

  // Product Intelligence
  getProductsSummary: (filters) => apiClient.get('/products/summary', { params: buildFilterParams(filters) }).then(r => r.data),
  getProductsCategories: (filters) => apiClient.get('/products/categories', { params: buildFilterParams(filters) }).then(r => r.data),

  // Logistics & Supply Chain
  getLogisticsSummary: (filters) => apiClient.get('/logistics/summary', { params: buildFilterParams(filters) }).then(r => r.data),
  getLogisticsDelays: (filters) => apiClient.get('/logistics/delays', { params: buildFilterParams(filters) }).then(r => r.data),
  getOrderStatusDist: (filters) => apiClient.get('/logistics/order-status', { params: buildFilterParams(filters) }).then(r => r.data),
  getSLAStatusDist: (filters) => apiClient.get('/logistics/sla-status', { params: buildFilterParams(filters) }).then(r => r.data),

  // Payments & Reviews
  getPaymentsSummary: (filters) => apiClient.get('/payments/summary', { params: buildFilterParams(filters) }).then(r => r.data),
  getPaymentMethods: (filters) => apiClient.get('/payments/methods', { params: buildFilterParams(filters) }).then(r => r.data),
  getReviewsSummary: (filters) => apiClient.get('/reviews/summary', { params: buildFilterParams(filters) }).then(r => r.data),

  // Reports & Data Explorer
  getOrdersTable: ({ page = 1, pageSize = 20, search = '', sortBy = 'order_purchase_timestamp', sortDesc = true, filters = {} }) => {
    const params = buildFilterParams(filters);
    params.append('page', page);
    params.append('page_size', pageSize);
    if (search) params.append('search', search);
    params.append('sort_by', sortBy);
    params.append('sort_desc', sortDesc);
    return apiClient.get('/reports/orders', { params }).then(r => r.data);
  },

  getExportUrl: ({ format = 'csv', search = '', sortBy = 'order_purchase_timestamp', sortDesc = true, filters = {}, limit = 10000 }) => {
    const params = buildFilterParams(filters);
    params.append('format', format);
    if (search) params.append('search', search);
    params.append('sort_by', sortBy);
    params.append('sort_desc', sortDesc);
    params.append('limit', limit);
    return `${API_BASE_URL}/reports/export?${params.toString()}`;
  }
};

export default apiClient;

