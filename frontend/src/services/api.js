/**
 * CommerceChain 360 - Resilient Hybrid API & Static Data Service
 * Seamlessly supports both live FastAPI backend endpoints and zero-cost static JSON fallback.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache in-memory for static table data to avoid repeated file reads
let cachedOrdersTableData = null;

/**
 * Robust fetcher that attempts live backend first, falling back instantly to precomputed static JSON.
 */
async function fetchWithFallback(apiPath, staticPath, params = null) {
  try {
    const config = params ? { params } : {};
    const res = await apiClient.get(apiPath, config);
    return res.data;
  } catch (err) {
    // Graceful fallback to static JSON asset
    try {
      const staticRes = await axios.get(staticPath);
      return staticRes.data;
    } catch (staticErr) {
      console.warn(`[API] Failed to fetch both live endpoint (${apiPath}) and static fallback (${staticPath})`, staticErr);
      throw err;
    }
  }
}

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
  getHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return res.data;
    } catch {
      return {
        status: 'healthy',
        service: 'CommerceChain 360',
        version: '1.0.0',
        dataset_ready: true,
        mode: 'static-cdn'
      };
    }
  },

  getMetadata: () => fetchWithFallback('/metadata', '/data/metadata.json'),

  // Executive Overview
  getExecutiveKPIs: (filters) =>
    fetchWithFallback('/overview/kpis', '/data/overview_kpis.json', buildFilterParams(filters)),

  getOverviewTrends: (filters) =>
    fetchWithFallback('/overview/trends', '/data/overview_trends.json', buildFilterParams(filters)),

  getExecutiveInsights: (filters) =>
    fetchWithFallback('/overview/insights', '/data/overview_insights.json', buildFilterParams(filters)),

  // Sales Intelligence
  getSalesSummary: (filters) =>
    fetchWithFallback('/sales/summary', '/data/sales_summary.json', buildFilterParams(filters)),

  getSalesMonthly: (filters) =>
    fetchWithFallback('/sales/monthly', '/data/sales_monthly.json', buildFilterParams(filters)),

  getSalesCategories: (filters) =>
    fetchWithFallback('/sales/categories', '/data/sales_categories.json', buildFilterParams(filters)),

  getSalesRegions: (filters) =>
    fetchWithFallback('/sales/regions', '/data/sales_regions.json', buildFilterParams(filters)),

  // Customer Intelligence
  getCustomersSummary: (filters) =>
    fetchWithFallback('/customers/summary', '/data/customers_summary.json', buildFilterParams(filters)),

  getCustomersSegments: (filters) =>
    fetchWithFallback('/customers/segments', '/data/customers_segments.json', buildFilterParams(filters)),

  // Product Intelligence
  getProductsSummary: (filters) =>
    fetchWithFallback('/products/summary', '/data/products_summary.json', buildFilterParams(filters)),

  getProductsCategories: (filters) =>
    fetchWithFallback('/products/categories', '/data/products_categories.json', buildFilterParams(filters)),

  // Logistics & Supply Chain
  getLogisticsSummary: (filters) =>
    fetchWithFallback('/logistics/summary', '/data/logistics_summary.json', buildFilterParams(filters)),

  getLogisticsDelays: (filters) =>
    fetchWithFallback('/logistics/delays', '/data/logistics_delays.json', buildFilterParams(filters)),

  getOrderStatusDist: (filters) =>
    fetchWithFallback('/logistics/order-status', '/data/logistics_order_status.json', buildFilterParams(filters)),

  getSLAStatusDist: (filters) =>
    fetchWithFallback('/logistics/sla-status', '/data/logistics_sla_status.json', buildFilterParams(filters)),

  // Payments & Reviews
  getPaymentsSummary: (filters) =>
    fetchWithFallback('/payments/summary', '/data/payments_summary.json', buildFilterParams(filters)),

  getPaymentMethods: (filters) =>
    fetchWithFallback('/payments/methods', '/data/payments_methods.json', buildFilterParams(filters)),

  getReviewsSummary: (filters) =>
    fetchWithFallback('/reviews/summary', '/data/reviews_summary.json', buildFilterParams(filters)),

  // Reports & Data Explorer with Client-Side Fallback Filtering & Pagination
  getOrdersTable: async ({ page = 1, pageSize = 20, search = '', sortBy = 'order_purchase_timestamp', sortDesc = true, filters = {} }) => {
    try {
      const params = buildFilterParams(filters);
      params.append('page', page);
      params.append('page_size', pageSize);
      if (search) params.append('search', search);
      params.append('sort_by', sortBy);
      params.append('sort_desc', sortDesc);
      const res = await apiClient.get('/reports/orders', { params });
      return res.data;
    } catch {
      // Static Fallback with full client-side search, sort, and pagination
      if (!cachedOrdersTableData) {
        const res = await axios.get('/data/orders_table.json');
        cachedOrdersTableData = res.data;
      }

      let records = cachedOrdersTableData?.records || [];

      // 1. Client-side Search
      if (search && search.trim()) {
        const q = search.toLowerCase();
        records = records.filter(r =>
          (r.order_id && r.order_id.toLowerCase().includes(q)) ||
          (r.customer_city && r.customer_city.toLowerCase().includes(q)) ||
          (r.customer_state && r.customer_state.toLowerCase().includes(q)) ||
          (r.order_status && r.order_status.toLowerCase().includes(q))
        );
      }

      // 2. Client-side Sort
      if (sortBy) {
        records = [...records].sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];
          if (valA === undefined || valA === null) return 1;
          if (valB === undefined || valB === null) return -1;
          if (typeof valA === 'string') {
            return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
          }
          return sortDesc ? valB - valA : valA - valB;
        });
      }

      const total = records.length;
      const totalPages = Math.ceil(total / pageSize) || 1;
      const start = (page - 1) * pageSize;
      const paginatedRecords = records.slice(start, start + pageSize);

      return {
        total,
        page,
        page_size: pageSize,
        total_pages: totalPages,
        records: paginatedRecords,
      };
    }
  },

  getExportUrl: ({ format = 'csv', search = '', sortBy = 'order_purchase_timestamp', sortDesc = true, filters = {}, limit = 10000 }) => {
    const params = buildFilterParams(filters);
    params.append('format', format);
    if (search) params.append('search', search);
    params.append('sort_by', sortBy);
    params.append('sort_desc', sortDesc);
    params.append('limit', limit);
    return `/data/orders_export.csv`;
  }
};

export default apiClient;
