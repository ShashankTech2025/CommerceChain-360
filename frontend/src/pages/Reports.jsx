/**
 * CommerceChain 360 - Executive Intelligence & Audit Report
 */

import React from 'react';
import {
  Printer,
  Download,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Package,
  Truck,
  Users
} from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import {
  useExecutiveKPIs,
  useSalesCategories,
  useLogisticsSummary,
  usePaymentsSummary,
  useMetadata
} from '../hooks/useAnalytics';
import { api } from '../services/api';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export default function Reports() {
  const { filters } = useFilters();
  const { data: kpis } = useExecutiveKPIs(filters);
  const { data: cats } = useSalesCategories(filters);
  const { data: logistics } = useLogisticsSummary(filters);
  const { data: payments } = usePaymentsSummary(filters);
  const { data: metadata } = useMetadata();

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const url = api.getExportUrl({ format: 'csv', filters, limit: 10000 });
    window.open(url, '_blank');
  };

  const topCategories = (cats?.top_10 || []).slice(0, 8);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Report Controls (Hidden during print) */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs print:hidden">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Formal Executive Analytics Briefing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export or print this comprehensive business performance assessment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-brand-teal text-white hover:bg-brand-teal/90 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Document Body */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-lg bg-brand-teal text-white font-black text-sm flex items-center justify-center">
                CC
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-brand-teal">
                COMMERCECHAIN 360
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise Performance & Delivery Intelligence Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Brazilian E-Commerce Benchmark Analysis • Currency: Brazilian Real (BRL)
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <div><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            <div><strong>Baseline Orders:</strong> 99,441</div>
            <div><strong>Active Status:</strong> Validated</div>
          </div>
        </div>

        {/* Executive Scorecard */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Core Performance Scorecard
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Gross Sales</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {formatCurrency(kpis?.gross_item_sales, true)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Orders</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {formatNumber(kpis?.total_orders)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Delivered Orders</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                {formatNumber(kpis?.delivered_orders)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">On-Time SLA</div>
              <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatPercent(kpis?.on_time_delivery_rate_pct)}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Average CSAT</div>
              <div className="text-base font-extrabold text-amber-500 mt-1">
                {payments?.average_review_score || 4.09} ★
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">Repeat Rate</div>
              <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                3.12%
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Business Findings */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Critical Strategic Business Findings
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1. Delivery Delay Drives a 1.93-Star Sentiment Penalty
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Analysis confirms that deliveries arriving on or before the estimated delivery date achieve a stellar <strong>4.25 / 5.00 average review score</strong>. In contrast, orders experiencing carrier delay collapse to <strong>2.32 stars (-1.93 star penalty)</strong>. Over 55% of delayed shipments receive a 1-star review. Keeping delivery delays below 5% is the platform's primary lever for preserving brand reputation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                2. Massive Retention Upside: 96.88% One-Time Buyer Funnel
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Out of 96,096 unique buyers, only 2,997 have made a repeat purchase (<strong>3.12% repeat customer rate</strong>). Moving this metric by just +2.0 percentage points through automated replenishment reminders and loyalty incentives would generate an estimated <strong>R$ 270,000+ in high-margin repeat GMV</strong> with near-zero acquisition cost.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                3. Geographic Fulfillment Disparity
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                São Paulo (SP) represents <strong>41.8% of total order volume</strong>, benefiting from an average delivery time of <strong>8.3 days</strong>. Peripheral regions in the North and Northeast average <strong>25 to 28 days</strong>, where freight costs frequently exceed 25% of product price, dampening conversion.
              </p>
            </div>
          </div>
        </div>

        {/* Top Product Categories Summary Table */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Top Performing Product Categories
          </h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5 text-right">Units Sold</th>
                  <th className="px-4 py-2.5 text-right">Gross Sales (BRL)</th>
                  <th className="px-4 py-2.5 text-right">Revenue Share</th>
                  <th className="px-4 py-2.5 text-right">Freight Burden</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {topCategories.map((c) => (
                  <tr key={c.category}>
                    <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">
                      {c.category}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {formatNumber(c.units_sold)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-brand-teal">
                      {formatCurrency(c.gross_item_sales)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {c.sales_share_pct}%
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">
                      {c.freight_to_price_ratio_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actionable Roadmap */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
            Management Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-emerald-600">Immediate Priority</span>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Institute real-time courier alerts when shipments risk exceeding promised SLA to trigger proactive customer notification before delivery failure.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-blue-600">Short-Term (30-60d)</span>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Deploy post-delivery automated re-engagement workflows at Day 14 and Day 30 offering tailored replenishment vouchers for single-purchase customers.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-purple-600">Medium-Term (90d)</span>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Establish micro-fulfillment and 3PL warehousing partnerships in the Northeast (Bahia, Ceará) to lower transit times from 25 days down to sub-10 days.
              </p>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-[11px] text-slate-400">
          <div>CommerceChain 360 • Enterprise Business Intelligence Architecture</div>
          <div>Confidential • For Internal Decision-Making Only</div>
        </div>
      </div>
    </div>
  );
}
