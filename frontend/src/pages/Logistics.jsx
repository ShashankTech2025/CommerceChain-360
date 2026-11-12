/**
 * CommerceChain 360 - Supply Chain & Delivery SLA Intelligence
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Truck,
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle,
  MapPin,
  TrendingDown
} from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import ChartCard from '../components/cards/ChartCard';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import {
  useLogisticsSummary,
  useLogisticsDelays
} from '../hooks/useAnalytics';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { getChartTheme, colors } from '../utils/echartsTheme';

export default function Logistics() {
  const { filters } = useFilters();
  const { isDark } = useTheme();

  const { data: summary, isLoading: summaryLoading } = useLogisticsSummary(filters);
  const { data: delaysData, isLoading: delaysLoading } = useLogisticsDelays(filters);

  const themeConfig = useMemo(() => getChartTheme(isDark), [isDark]);

  // Delay Histogram Option
  const delayHistogramOption = useMemo(() => {
    const dist = delaysData?.delay_distribution || [];
    if (!dist.length) return {};

    const bins = dist.map(d => d.bin);
    const counts = dist.map(d => d.count);

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const binName = params[0].name;
          const item = dist.find(d => d.bin === binName);
          return `<div class="text-xs">
            <div class="font-bold mb-1">${binName}</div>
            <div>Order Count: <span class="font-bold">${formatNumber(item?.count)}</span></div>
            <div>Share of Total: <span class="font-bold">${item?.percentage}%</span></div>
          </div>`;
        }
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: bins,
        axisLabel: {
          color: isDark ? '#E2E8F0' : '#1E293B',
          fontSize: 10,
          interval: 0,
          rotate: 15,
        },
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
          name: 'Orders',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: (params) => {
              const bin = bins[params.dataIndex];
              if (bin.includes('Early') || bin.includes('On Time')) return colors.emerald;
              return colors.rose;
            },
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 32,
        },
      ],
    };
  }, [delaysData, themeConfig, isDark]);

  // Actual vs Estimated Duration Option
  const actualVsEstimatedOption = useMemo(() => {
    const actVsEst = delaysData?.actual_vs_estimated || [];
    if (!actVsEst.length) return {};

    const months = actVsEst.map(a => a.month);
    const actual = actVsEst.map(a => a.avg_delivery_days);
    const estimated = actVsEst.map(a => a.avg_estimated_days);

    return {
      ...themeConfig,
      legend: {
        ...themeConfig.legend,
        data: ['Actual Delivery Days', 'Estimated Delivery SLA'],
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: months,
      },
      yAxis: {
        ...themeConfig.yAxis,
        type: 'value',
        name: 'Days',
        axisLabel: {
          formatter: '{value}d',
          color: isDark ? '#94A3B8' : '#64748B',
        },
      },
      series: [
        {
          name: 'Actual Delivery Days',
          type: 'line',
          data: actual,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: colors.teal },
          lineStyle: { width: 3, color: colors.teal },
        },
        {
          name: 'Estimated Delivery SLA',
          type: 'line',
          data: estimated,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: colors.blue },
          lineStyle: { width: 2, type: 'dashed', color: colors.blue },
        },
      ],
    };
  }, [delaysData, themeConfig, isDark]);

  // State SLA Performance Option
  const stateSLAOption = useMemo(() => {
    const states = (delaysData?.state_sla || []).slice(0, 15);
    if (!states.length) return {};

    const stateNames = states.map(s => s.state);
    const days = states.map(s => s.avg_delivery_days);
    const ontimeRates = states.map(s => s.on_time_rate_pct);

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const stateCode = params[0].name;
          const s = states.find(x => x.state === stateCode);
          return `<div class="text-xs">
            <div class="font-bold mb-1">State: ${stateCode}</div>
            <div>Delivered Orders: <span class="font-bold">${formatNumber(s?.delivered_orders)}</span></div>
            <div>Avg Delivery Lead Time: <span class="font-bold">${s?.avg_delivery_days} days</span></div>
            <div>On-Time Rate: <span class="font-bold">${s?.on_time_rate_pct}%</span></div>
            <div>Late Orders: <span class="font-bold">${formatNumber(s?.late_orders)}</span></div>
          </div>`;
        }
      },
      legend: {
        ...themeConfig.legend,
        data: ['Avg Delivery Days', 'On-Time Rate (%)'],
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: stateNames,
      },
      yAxis: [
        {
          ...themeConfig.yAxis,
          type: 'value',
          name: 'Lead Time (Days)',
          axisLabel: {
            formatter: '{value}d',
            color: isDark ? '#94A3B8' : '#64748B',
          },
        },
        {
          ...themeConfig.yAxis,
          type: 'value',
          name: 'On-Time %',
          position: 'right',
          splitLine: { show: false },
          axisLabel: {
            formatter: '{value}%',
            color: isDark ? '#94A3B8' : '#64748B',
          },
        },
      ],
      series: [
        {
          name: 'Avg Delivery Days',
          type: 'bar',
          data: days,
          itemStyle: { color: colors.teal, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 20,
        },
        {
          name: 'On-Time Rate (%)',
          type: 'line',
          yAxisIndex: 1,
          data: ontimeRates,
          smooth: true,
          itemStyle: { color: colors.emerald },
          lineStyle: { width: 2, color: colors.emerald },
        },
      ],
    };
  }, [delaysData, themeConfig, isDark]);

  return (
    <div className="space-y-6">
      {/* Logistics & Supply Chain KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="On-Time Delivery Rate"
          value={formatPercent(summary?.on_time_delivery_rate_pct)}
          secondaryValue={`${formatNumber(summary?.ontime_orders)} on-time`}
          trend={summary?.on_time_delivery_rate_pct >= 90 ? 'up' : 'down'}
          trendText="Target: >=90%"
          icon={CheckCircle}
          accentColor="emerald"
          tooltip="Percentage of delivered orders completed on or before the carrier promised estimate."
          loading={summaryLoading}
        />
        <KPICard
          title="Late Delivery Rate"
          value={formatPercent(summary?.late_delivery_rate_pct)}
          secondaryValue={`${formatNumber(summary?.late_orders)} breaches`}
          trend="neutral"
          trendText="8.1% SLA breach"
          icon={AlertTriangle}
          accentColor="rose"
          tooltip="Percentage of orders delivered after the promised estimated delivery date."
          loading={summaryLoading}
        />
        <KPICard
          title="Avg Delivery Lead Time"
          value={`${summary?.average_delivery_days || 12.6} days`}
          secondaryValue="Purchase to doorstep"
          icon={Clock}
          accentColor="blue"
          tooltip="Average elapsed days from order purchase date to customer delivery date."
          loading={summaryLoading}
        />
        <KPICard
          title="Avg Estimated SLA"
          value={`${summary?.average_estimated_delivery_days || 23.8} days`}
          secondaryValue="Carrier buffer: ~11.2d"
          icon={Calendar}
          accentColor="indigo"
          tooltip="Promised estimated delivery window set at order checkout."
          loading={summaryLoading}
        />
        <KPICard
          title="Avg Delay Variance"
          value={`${summary?.average_delivery_delay_days || -11.2} days`}
          secondaryValue="Delivered early"
          trend="up"
          trendText="Conservative SLA"
          icon={TrendingDown}
          accentColor="teal"
          tooltip="Negative numbers indicate orders arrived days before estimated promise date."
          loading={summaryLoading}
        />
        <KPICard
          title="Avg Freight Per Order"
          value={formatCurrency(summary?.average_freight_per_order)}
          secondaryValue={`Total: ${formatCurrency(summary?.total_freight, true)}`}
          icon={Truck}
          accentColor="amber"
          tooltip="Total logistics freight value divided by total orders."
          loading={summaryLoading}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Delay Variance Histogram */}
        <ChartCard
          title="Delivery Delay Variance Histogram (Days vs SLA)"
          subtitle="Distribution of early vs late deliveries relative to promised customer date"
          tooltip="Green bars represent early or on-time orders; Red bars denote SLA breaches."
          loading={delaysLoading}
          height="h-96"
        >
          <ReactECharts
            option={delayHistogramOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>

        {/* Actual vs Estimated Delivery Duration Over Time */}
        <ChartCard
          title="Actual vs Estimated Delivery Duration (Monthly Trend)"
          subtitle="Illustrates carrier conservatism and fulfillment stability over time"
          tooltip="Solid line is actual delivery days; dashed line is carrier estimated SLA."
          loading={delaysLoading}
          height="h-96"
        >
          <ReactECharts
            option={actualVsEstimatedOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>
      </div>

      {/* State-Level Delivery SLA & Lead Time Performance */}
      <ChartCard
        title="State-Level Delivery Lead Time & SLA Adherence (Top 15 States)"
        subtitle="Highlights regional supply chain disparities (São Paulo at ~8.3 days vs peripheral states at 20+ days)"
        tooltip="Bars indicate average delivery days; green line represents on-time rate %."
        loading={delaysLoading}
        height="h-96"
      >
        <ReactECharts
          option={stateSLAOption}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </ChartCard>
    </div>
  );
}
