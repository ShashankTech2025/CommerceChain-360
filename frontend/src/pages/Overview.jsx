/**
 * CommerceChain 360 - Executive Overview Dashboard
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  DollarSign,
  ShoppingCart,
  CheckCircle2,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import ChartCard from '../components/cards/ChartCard';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import {
  useExecutiveKPIs,
  useOverviewTrends,
  useExecutiveInsights,
  useOrderStatusDist,
  useSLAStatusDist
} from '../hooks/useAnalytics';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { getChartTheme, colors } from '../utils/echartsTheme';

export default function Overview() {
  const { filters } = useFilters();
  const { isDark } = useTheme();

  // Queries
  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useExecutiveKPIs(filters);
  const { data: trendsData, isLoading: trendsLoading } = useOverviewTrends(filters);
  const { data: insightsData, isLoading: insightsLoading } = useExecutiveInsights(filters);
  const { data: orderStatusDist, isLoading: statusLoading } = useOrderStatusDist(filters);
  const { data: slaStatusDist, isLoading: slaLoading } = useSLAStatusDist(filters);

  const themeConfig = useMemo(() => getChartTheme(isDark), [isDark]);

  // Monthly Revenue & Order Volume Chart Option
  const revenueVolumeOption = useMemo(() => {
    const trends = trendsData?.trends || [];
    if (!trends.length) return {};

    const months = trends.map(t => t.month);
    const sales = trends.map(t => t.gross_item_sales);
    const orders = trends.map(t => t.total_orders);

    return {
      ...themeConfig,
      tooltip: {
        ...themeConfig.tooltip,
        formatter: (params) => {
          if (!params || !params.length) return '';
          const month = params[0].axisValue;
          const trendItem = trends.find(t => t.month === month);
          let html = `<div class="font-semibold text-xs mb-1.5">${month}</div>`;
          params.forEach(p => {
            const val = p.seriesName.includes('Sales')
              ? formatCurrency(p.value)
              : formatNumber(p.value);
            html += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span class="flex items-center gap-1.5"><span style="background:${p.color};width:8px;height:8px;border-radius:2px;display:inline-block"></span>${p.seriesName}</span>
              <span class="font-bold">${val}</span>
            </div>`;
          });
          if (trendItem && trendItem.mom_sales_growth_pct !== undefined) {
            const momColor = trendItem.mom_sales_growth_pct >= 0 ? '#10B981' : '#EF4444';
            html += `<div class="mt-1 pt-1 border-t border-slate-200 dark:border-slate-700 text-[11px] flex justify-between">
              <span>MoM Sales Growth:</span>
              <span style="color:${momColor}" class="font-bold">${trendItem.mom_sales_growth_pct > 0 ? '+' : ''}${trendItem.mom_sales_growth_pct}%</span>
            </div>`;
          }
          return html;
        }
      },
      legend: {
        ...themeConfig.legend,
        data: ['Gross Sales (BRL)', 'Total Orders'],
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: months,
      },
      yAxis: [
        {
          ...themeConfig.yAxis,
          type: 'value',
          name: 'Gross Sales (R$)',
          axisLabel: {
            formatter: (v) => formatCurrency(v, true),
            color: isDark ? '#94A3B8' : '#64748B',
          },
        },
        {
          ...themeConfig.yAxis,
          type: 'value',
          name: 'Orders',
          position: 'right',
          splitLine: { show: false },
          axisLabel: {
            formatter: (v) => formatNumber(v, true),
            color: isDark ? '#94A3B8' : '#64748B',
          },
        },
      ],
      series: [
        {
          name: 'Gross Sales (BRL)',
          type: 'bar',
          data: sales,
          itemStyle: {
            color: colors.teal,
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 28,
        },
        {
          name: 'Total Orders',
          type: 'line',
          yAxisIndex: 1,
          data: orders,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: colors.blue },
          lineStyle: { width: 3, color: colors.blue },
        },
      ],
    };
  }, [trendsData, themeConfig, isDark]);

  // SLA Compliance Ring Chart Option
  const slaChartOption = useMemo(() => {
    const data = slaStatusDist || [];
    if (!data.length) return {};

    const colorMap = {
      'On Time / Early': colors.emerald,
      'Late': colors.rose,
      'In Transit': colors.amber,
      'Pending': colors.blue,
    };

    const formattedData = data.map(d => ({
      name: d.status,
      value: d.count,
      itemStyle: { color: colorMap[d.status] || colors.teal }
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `<div class="text-xs">
            <span class="font-bold">${params.name}</span>: ${formatNumber(params.value)} orders (${params.percent}%)
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
          name: 'SLA Compliance',
          type: 'pie',
          radius: ['55%', '80%'],
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
          data: formattedData,
        },
      ],
    };
  }, [slaStatusDist, isDark]);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-brand-navy to-slate-900 rounded-2xl p-6 text-white shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal text-xs font-bold tracking-wide uppercase">
              Production BI Architecture
            </span>
            <span className="text-slate-400 text-xs">Brazilian E-Commerce (Olist)</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Executive Performance & Delivery Health
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Multi-grain analytical dashboard isolated at FactOrders and FactOrderItems grain with zero Cartesian inflation. Real-time metrics powered by in-memory vectorized aggregations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Dataset Orders</div>
            <div className="text-base font-extrabold text-white">99,441</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Gross GMV</div>
            <div className="text-base font-extrabold text-brand-teal">R$ 13.59M</div>
          </div>
        </div>
      </div>

      {/* 6 Core Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Gross Item Sales"
          value={formatCurrency(kpis?.gross_item_sales, true)}
          secondaryValue={`AOV: ${formatCurrency(kpis?.average_order_value)}`}
          icon={DollarSign}
          accentColor="teal"
          tooltip="Total commercial price of products sold across order items (excluding freight)."
          loading={kpisLoading}
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(kpis?.total_orders, true)}
          secondaryValue={`${formatNumber(kpis?.delivered_orders, true)} delivered`}
          icon={ShoppingCart}
          accentColor="blue"
          tooltip="Total distinct order count in the selected period."
          loading={kpisLoading}
        />
        <KPICard
          title="Fulfillment Rate"
          value={formatPercent(kpis?.fulfillment_rate_pct)}
          secondaryValue={`${formatNumber(kpis?.delivered_orders)} orders`}
          trend={kpis?.fulfillment_rate_pct >= 95 ? 'up' : 'down'}
          trendText={kpis?.fulfillment_rate_pct >= 95 ? 'Strong SLA' : 'Review dropouts'}
          icon={CheckCircle2}
          accentColor="emerald"
          tooltip="Delivered orders as a percentage of total created orders."
          loading={kpisLoading}
        />
        <KPICard
          title="Average Order Value"
          value={formatCurrency(kpis?.average_order_value)}
          secondaryValue="Per purchase order"
          icon={TrendingUp}
          accentColor="indigo"
          tooltip="Gross item sales divided by total order count."
          loading={kpisLoading}
        />
        <KPICard
          title="Unique Customers"
          value={formatNumber(kpis?.unique_customers, true)}
          secondaryValue="Distinct buyer IDs"
          icon={Users}
          accentColor="amber"
          tooltip="Count of unique customer identifiers associated with these orders."
          loading={kpisLoading}
        />
        <KPICard
          title="On-Time Delivery Rate"
          value={formatPercent(kpis?.on_time_delivery_rate_pct)}
          secondaryValue={`${formatNumber(kpis?.ontime_orders)} on-time`}
          trend={kpis?.on_time_delivery_rate_pct >= 90 ? 'up' : 'down'}
          trendText={kpis?.on_time_delivery_rate_pct >= 90 ? 'Target >=90%' : 'Under Target'}
          icon={Clock}
          accentColor={kpis?.on_time_delivery_rate_pct >= 90 ? 'emerald' : 'rose'}
          tooltip="Delivered orders completed on or before the promised estimated delivery date."
          loading={kpisLoading}
        />
      </div>

      {/* Main Analytical Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue & Order Trend (2 cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Monthly Gross Sales & Order Volume"
            subtitle="Dual-axis commercial revenue (BRL) and monthly order throughput"
            tooltip="Calculates monthly sales aggregated from order items price and order counts from FactOrders."
            loading={trendsLoading}
            height="h-96"
          >
            <ReactECharts
              option={revenueVolumeOption}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </ChartCard>
        </div>

        {/* SLA Compliance Donut (1 col) */}
        <div>
          <ChartCard
            title="Delivery SLA Adherence"
            subtitle="Actual delivery date vs estimated SLA promise"
            tooltip="On-Time orders delivered on or before carrier estimate; Late orders exceeded promise."
            loading={slaLoading}
            height="h-96"
          >
            <ReactECharts
              option={slaChartOption}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </ChartCard>
        </div>
      </div>

      {/* Strategic Analytical Insights & Commentary */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-brand-teal" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Executive Commentary & Strategic Drivers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(insightsData?.insights || []).map((insight, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-brand-teal dark:hover:border-brand-teal transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">
                    {insight.type.replace('_', ' ')}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {insight.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
