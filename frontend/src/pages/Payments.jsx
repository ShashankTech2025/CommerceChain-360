/**
 * CommerceChain 360 - Payments, Financing & Customer Satisfaction Intelligence
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Star,
  ThumbsUp,
  AlertCircle,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import ChartCard from '../components/cards/ChartCard';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import {
  usePaymentsSummary,
  usePaymentMethods,
  useReviewsSummary
} from '../hooks/useAnalytics';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { getChartTheme, colors } from '../utils/echartsTheme';

export default function Payments() {
  const { filters } = useFilters();
  const { isDark } = useTheme();

  const { data: summary, isLoading: summaryLoading } = usePaymentsSummary(filters);
  const { data: methodsData, isLoading: methodsLoading } = usePaymentMethods(filters);
  const { data: reviewsData, isLoading: reviewsLoading } = useReviewsSummary(filters);

  const themeConfig = useMemo(() => getChartTheme(isDark), [isDark]);

  // Payment Methods Market Share Donut Option
  const methodsOption = useMemo(() => {
    const methods = methodsData?.payment_methods || [];
    if (!methods.length) return {};

    const colorPalette = [colors.blue, colors.teal, colors.amber, colors.purple, colors.rose];

    const data = methods.map((m, idx) => ({
      name: m.payment_type,
      value: m.total_value,
      transactions: m.transactions,
      share: m.value_share_pct,
      itemStyle: { color: colorPalette[idx % colorPalette.length] },
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const item = data[params.dataIndex];
          return `<div class="text-xs">
            <div class="font-bold mb-1">${params.name}</div>
            <div>Tender GMV: <span class="font-bold">${formatCurrency(params.value)}</span></div>
            <div>Transactions: <span class="font-bold">${formatNumber(item?.transactions)}</span></div>
            <div>Value Share: <span class="font-bold">${item?.share}%</span></div>
          </div>`;
        }
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'middle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: isDark ? '#94A3B8' : '#64748B', fontSize: 11 },
      },
      series: [
        {
          name: 'Payment Methods',
          type: 'pie',
          radius: ['50%', '75%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
          },
          data,
        },
      ],
    };
  }, [methodsData, isDark]);

  // Installment Distribution Chart Option
  const installmentsOption = useMemo(() => {
    const inst = (methodsData?.installments || []).slice(0, 10);
    if (!inst.length) return {};

    const labels = inst.map(i => `${i.installments}x`);
    const tx = inst.map(i => i.transactions);
    const avgVal = inst.map(i => i.avg_value);

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const idx = params[0].dataIndex;
          const item = inst[idx];
          return `<div class="text-xs">
            <div class="font-bold mb-1">${item?.installments} Installments (${item?.installments}x)</div>
            <div>Transactions: <span class="font-bold">${formatNumber(item?.transactions)}</span></div>
            <div>Avg Ticket: <span class="font-bold">${formatCurrency(item?.avg_value)}</span></div>
            <div>Total Volume: <span class="font-bold">${formatCurrency(item?.total_value)}</span></div>
          </div>`;
        }
      },
      legend: {
        ...themeConfig.legend,
        data: ['Transactions', 'Avg Ticket Value (R$)'],
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: labels,
      },
      yAxis: [
        {
          ...themeConfig.yAxis,
          type: 'value',
          name: 'Transactions',
          axisLabel: {
            formatter: (v) => formatNumber(v, true),
            color: isDark ? '#94A3B8' : '#64748B',
          },
        },
        {
          ...themeConfig.yAxis,
          type: 'value',
          name: 'Avg Ticket (R$)',
          position: 'right',
          splitLine: { show: false },
          axisLabel: {
            formatter: (v) => `R$ ${v}`,
            color: isDark ? '#94A3B8' : '#64748B',
          },
        },
      ],
      series: [
        {
          name: 'Transactions',
          type: 'bar',
          data: tx,
          itemStyle: { color: colors.teal, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 24,
        },
        {
          name: 'Avg Ticket Value (R$)',
          type: 'line',
          yAxisIndex: 1,
          data: avgVal,
          smooth: true,
          itemStyle: { color: colors.amber },
          lineStyle: { width: 2.5, color: colors.amber },
        },
      ],
    };
  }, [methodsData, themeConfig, isDark]);

  // Review Rating Distribution Bar Option
  const ratingDistOption = useMemo(() => {
    const dist = reviewsData?.rating_distribution || [];
    if (!dist.length) return {};

    const stars = dist.map(d => `${d.stars} Stars`);
    const counts = dist.map(d => d.count);
    const starColors = [colors.rose, colors.amber, colors.cyan, colors.blue, colors.emerald];

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const idx = params[0].dataIndex;
          const item = dist[idx];
          return `<div class="text-xs">
            <div class="font-bold mb-1">${item?.stars} Stars</div>
            <div>Reviews: <span class="font-bold">${formatNumber(item?.count)}</span></div>
            <div>Share: <span class="font-bold">${item?.percentage}%</span></div>
          </div>`;
        }
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: stars,
      },
      yAxis: {
        ...themeConfig.yAxis,
        type: 'value',
        axisLabel: {
          formatter: (v) => formatNumber(v, true),
          color: isDark ? '#94A3B8' : '#64748B',
        },
      },
      series: [
        {
          name: 'Reviews',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: (params) => starColors[params.dataIndex % starColors.length],
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 32,
        },
      ],
    };
  }, [reviewsData, themeConfig, isDark]);

  // Delivery SLA vs CSAT Correlation Option
  const slaCsatOption = useMemo(() => {
    const corr = reviewsData?.delivery_csat_correlation || {};
    const categories = Object.keys(corr);
    if (!categories.length) return {};

    const scores = categories.map(k => corr[k]?.avg_score || 0);

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const name = params[0].name;
          const item = corr[name];
          return `<div class="text-xs">
            <div class="font-bold mb-1">Status: ${name}</div>
            <div>Average Score: <span class="font-bold">${item?.avg_score} / 5.00 Stars</span></div>
            <div>Total Reviews: <span class="font-bold">${formatNumber(item?.reviews)}</span></div>
          </div>`;
        }
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: categories,
      },
      yAxis: {
        ...themeConfig.yAxis,
        type: 'value',
        min: 1,
        max: 5,
        name: 'Avg Review Score (Stars)',
        axisLabel: {
          formatter: '{value} ★',
          color: isDark ? '#94A3B8' : '#64748B',
        },
      },
      series: [
        {
          name: 'Average CSAT Score',
          type: 'bar',
          data: scores,
          itemStyle: {
            color: (params) => (categories[params.dataIndex].includes('On Time') ? colors.emerald : colors.rose),
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 48,
          label: {
            show: true,
            position: 'top',
            formatter: '{c} ★',
            fontWeight: 'bold',
            color: isDark ? '#FFFFFF' : '#0F172A',
          },
        },
      ],
    };
  }, [reviewsData, themeConfig, isDark]);

  return (
    <div className="space-y-6">
      {/* Payments & CSAT KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Recorded Payments"
          value={formatCurrency(summary?.total_recorded_payments, true)}
          secondaryValue={`${formatNumber(summary?.total_payment_transactions, true)} txns`}
          icon={CreditCard}
          accentColor="teal"
          tooltip="Total payment value recorded across all payment tenders."
          loading={summaryLoading}
        />
        <KPICard
          title="Avg Payment Value"
          value={formatCurrency(summary?.average_payment_value)}
          secondaryValue="Per transaction"
          icon={DollarSign}
          accentColor="blue"
          tooltip="Average tender transaction value."
          loading={summaryLoading}
        />
        <KPICard
          title="Avg Installments"
          value={`${summary?.average_installments || 2.9}x`}
          secondaryValue="Credit financing"
          icon={Calendar}
          accentColor="indigo"
          tooltip="Average payment installments chosen by credit card buyers."
          loading={summaryLoading}
        />
        <KPICard
          title="Average Review Score"
          value={`${summary?.average_review_score || 4.09} ★`}
          secondaryValue="Out of 5.00 stars"
          trend="up"
          trendText="Positive CSAT"
          icon={Star}
          accentColor="emerald"
          tooltip="Average customer review rating recorded in reviews dataset."
          loading={summaryLoading}
        />
        <KPICard
          title="Five-Star Reviews"
          value={formatPercent(summary?.five_star_review_share_pct)}
          secondaryValue={`${formatNumber(summary?.five_star_reviews)} reviews`}
          icon={ThumbsUp}
          accentColor="amber"
          tooltip="Percentage of customer reviews awarded full 5 stars."
          loading={summaryLoading}
        />
        <KPICard
          title="Low Rating Share"
          value={formatPercent(summary?.low_rating_review_share_pct)}
          secondaryValue={`${formatNumber(summary?.low_rating_reviews)} (1-2★)`}
          trend="neutral"
          trendText="14.7% dissatisfied"
          icon={AlertCircle}
          accentColor="rose"
          tooltip="Percentage of customer reviews rating 1 or 2 stars."
          loading={summaryLoading}
        />
      </div>

      {/* Main Charts Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Tender Share */}
        <ChartCard
          title="Payment Tender Market Share (GMV)"
          subtitle="Tender distribution across Credit Card, Boleto, Voucher, and Debit"
          tooltip="Aggregated from FactPayments payment_type grouped values."
          loading={methodsLoading}
          height="h-96"
        >
          <ReactECharts
            option={methodsOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>

        {/* Installment Profiles */}
        <ChartCard
          title="Credit Card Installment Distribution & Basket Size"
          subtitle="Volume of transactions vs average purchase value per installment tier"
          tooltip="Higher installments (6x-10x) enable larger basket sizes."
          loading={methodsLoading}
          height="h-96"
        >
          <ReactECharts
            option={installmentsOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>
      </div>

      {/* Main Charts Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review Rating Distribution */}
        <ChartCard
          title="Customer Satisfaction (CSAT) Rating Distribution"
          subtitle="Breakdown of customer feedback ratings from 1 to 5 stars"
          tooltip="Aggregated from FactReviews review_score."
          loading={reviewsLoading}
          height="h-96"
        >
          <ReactECharts
            option={ratingDistOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>

        {/* The Key Finding: Delivery SLA vs CSAT Correlation */}
        <ChartCard
          title="Delivery SLA Impact on Customer Satisfaction"
          subtitle="On-time vs Late delivery review rating disparity"
          tooltip="On-Time orders average 4.25 stars; late deliveries drop to 2.32 stars (-1.93 star penalty)."
          loading={reviewsLoading}
          height="h-96"
        >
          <ReactECharts
            option={slaCsatOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>
      </div>

      {/* Impact Callout Card */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-blue-950/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Operational Finding: The Delivery Delay CSAT Penalty
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              Cross-fact analysis reveals that on-time orders attain an outstanding <strong>4.25 / 5.00 average CSAT score</strong> with over 70% five-star ratings. When a delivery breaches the promised SLA date, the average score plummets to <strong>2.32 stars (a -1.93 star decline)</strong>, with 1-star reviews surging past 55%. Consequently, supply chain lead time adherence is the single highest predictor of customer goodwill and platform trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
