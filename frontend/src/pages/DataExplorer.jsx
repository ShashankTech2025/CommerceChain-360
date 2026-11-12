/**
 * CommerceChain 360 - Interactive Order & Data Explorer Grid
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Eye,
  X,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { useOrdersTable } from '../hooks/useAnalytics';
import { api } from '../services/api';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  formatCurrency,
  formatNumber,
  getSLAStatusColor,
  getOrderStatusColor
} from '../utils/formatters';

export default function DataExplorer() {
  const { filters } = useFilters();

  // Local table state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('order_purchase_timestamp');
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isLoading, isFetching, error } = useOrdersTable({
    page,
    pageSize,
    search,
    sortBy,
    sortDesc,
    filters,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDesc(prev => !prev);
    } else {
      setSortBy(column);
      setSortDesc(true);
    }
    setPage(1);
  };

  const handleExport = (format) => {
    const url = api.getExportUrl({ format, search, sortBy, sortDesc, filters, limit: 10000 });
    window.open(url, '_blank');
  };

  const records = data?.records || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Order ID, city, or state..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Export and Page Size Options */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Export Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              title="Download CSV export"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
              title="Download JSON export"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden relative">
        {isFetching && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-teal animate-pulse" />
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <tr>
                <th
                  onClick={() => handleSort('order_id')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('order_purchase_timestamp')}
                  className="px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Purchase Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th
                  onClick={() => handleSort('gross_sales')}
                  className="px-4 py-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Gross GMV</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Freight</th>
                <th className="px-4 py-3">SLA Status</th>
                <th className="px-4 py-3 text-center">Review</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <LoadingSpinner size="md" text="Loading order records..." />
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    No orders match your filter and search criteria.
                  </td>
                </tr>
              ) : (
                records.map((order) => (
                  <tr
                    key={order.order_id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-900 dark:text-white font-semibold">
                      {order.order_id.slice(0, 10)}...
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {order.purchase_date}
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-[140px] font-medium text-slate-800 dark:text-slate-200">
                        {order.customer_city || '—'}, <span className="font-bold">{order.customer_state}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getOrderStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {order.items_count}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatCurrency(order.gross_sales)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {formatCurrency(order.freight)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getSLAStatusColor(order.delivery_sla_status)}`}>
                        {order.delivery_sla_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">
                      {order.review_score !== null ? (
                        <span className="text-amber-500">★ {order.review_score}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1 rounded-md text-slate-400 hover:text-brand-teal hover:bg-brand-teal/10 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-bold text-slate-900 dark:text-white">{records.length}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{formatNumber(total)}</span> orders
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Order Details
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedOrder.order_id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Status</span>
                <div className="mt-1 font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {selectedOrder.order_status}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Purchase Date</span>
                <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                  {selectedOrder.purchase_date}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Customer City & State</span>
                <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                  {selectedOrder.customer_city}, {selectedOrder.customer_state}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">SLA Adherence</span>
                <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                  {selectedOrder.delivery_sla_status}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Gross Sales</span>
                <div className="mt-1 text-sm font-extrabold text-brand-teal">
                  {formatCurrency(selectedOrder.gross_sales)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Freight Value</span>
                <div className="mt-1 text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  {formatCurrency(selectedOrder.freight)}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
