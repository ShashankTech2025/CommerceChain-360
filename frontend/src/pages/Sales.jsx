/**
 * CommerceChain 360 - Commercial Sales & Revenue Intelligence
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Tag,
  Truck,
  MapPin,
  Layers
} from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import ChartCard from '../components/cards/ChartCard';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import {
  useSalesSummary,
  useSalesMonthly,
  useSalesCategories,
  useSalesRegions
} from '../hooks/useAnalytics';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { getChartTheme, colors } from '../utils/echartsTheme';

export default function Sales() {
  const { filters } = useFilters();
  const { isDark } = useTheme();

  const { data: summary, isLoading: summaryLoading } = useSalesSummary(filters);
  const { data: monthlyData, isLoading: monthlyLoading } = useSalesMonthly(filters);
  const { data: categoriesData, isLoading: categoriesLoading } = useSalesCategories(filters);
  const { data: regionsData, isLoading: regionsLoading } = useSalesRegions(filters);

  const themeConfig = useMemo(() => getChartTheme(isDark), [isDark]);

  // Top 10 Categories Bar Chart + Cumulative Pareto Option
  const categoryParetoOption = useMemo(() => {
    const top10 = categoriesData?.top_10 || [];
    if (!top10.length) return {};

    const cats = top10.map(c => c.category).reverse();
    const sales = top10.map(c => c.gross_item_sales).reverse();
    const shares = top10.map(c => c.sales_share_pct).reverse();

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          if (!params || !params.length) return '';
          const catName = params[0].name;
          const item = top10.find(c => c.category === catName);
          return `<div class="text-xs">
            <div class="font-bold mb-1">${catName}</div>
            <div>Gross Sales: <span class="font-bold">${formatCurrency(item?.gross_item_sales)}</span></div>
            <div>Units Sold: <span class="font-bold">${formatNumber(item?.units_sold)}</span></div>
            <div>Revenue Share: <span class="font-bold">${item?.sales_share_pct}%</span></div>
            <div>Avg Unit Price: <span class="font-bold">${formatCurrency(item?.average_item_price)}</span></div>
          </div>`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '4%',
        top: '6%',
        containLabel: true,
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'value',
        axisLabel: {
          formatter: (v) => formatCurrency(v, true),
          color: isDark ? '#94A3B8' : '#64748B',
        },
      },
      yAxis: {
        ...themeConfig.yAxis,
        type: 'category',
        data: cats,
        axisLabel: {
          color: isDark ? '#E2E8F0' : '#1E293B',
          fontSize: 11,
          width: 130,
          overflow: 'truncate',
        },
      },
      series: [
        {
          name: 'Gross Sales',
          type: 'bar',
          data: sales,
          itemStyle: {
            color: colors.teal,
            borderRadius: [0, 4, 4, 0],
          },
          barMaxWidth: 20,
        },
      ],
    };
  }, [categoriesData, themeConfig, isDark]);

  // Regional Sales by State Chart Option
  const regionalSalesOption = useMemo(() => {
    const regions = (regionsData?.regions || []).slice(0, 12);
    if (!regions.length) return {};

    const states = regions.map(r => r.state);
    const sales = regions.map(r => r.gross_item_sales);

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const stateCode = params[0].name;
          const reg = regions.find(r => r.state === stateCode);
          return `<div class="text-xs">
            <div class="font-bold mb-1">State: ${stateCode}</div>
            <div>Gross Sales: <span class="font-bold">${formatCurrency(reg?.gross_item_sales)}</span></div>
            <div>Orders: <span class="font-bold">${formatNumber(reg?.total_orders)}</span></div>
            <div>AOV: <span class="font-bold">${formatCurrency(reg?.average_order_value)}</span></div>
            <div>National Share: <span class="font-bold">${reg?.sales_share_pct}%</span></div>
          </div>`;
        }
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: states,
      },
      yAxis: {
        ...themeConfig.yAxis,
        type: 'value',
        axisLabel: {
          formatter: (v) => formatCurrency(v, true),
          color: isDark ? '#94A3B8' : '#64748B',
        },
      },
      series: [
        {
          name: 'Gross Sales',
          type: 'bar',
          data: sales,
          itemStyle: {
            color: (params) => (params.dataIndex === 0 ? colors.blue : colors.teal),
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 24,
        },
      ],
    };
  }, [regionsData, themeConfig, isDark]);

  // Monthly Sales & AOV Option
  const monthlyAOVOption = useMemo(() => {
    const monthly = monthlyData || [];
    if (!monthly.length) return {};

    const months = monthly.map(m => m.month);
    const sales = monthly.map(m => m.gross_item_sales);
    const aov = monthly.map(m => m.average_order_value);

    return {
      ...themeConfig,
      legend: {
        ...themeConfig.legend,
        data: ['Gross Sales', 'Average Order Value (AOV)'],
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
          name: 'AOV (R$)',
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
          name: 'Gross Sales',
          type: 'bar',
          data: sales,
          itemStyle: { color: colors.teal, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 26,
        },
        {
          name: 'Average Order Value (AOV)',
          type: 'line',
          yAxisIndex: 1,
          data: aov,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: colors.amber },
          lineStyle: { width: 3, color: colors.amber },
        },
      ],
    };
  }, [monthlyData, themeConfig, isDark]);

  return (
    <div className="space-y-6">
      {/* Sales KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Gross Item Sales"
          value={formatCurrency(summary?.gross_item_sales, true)}
          secondaryValue={`Delivered: ${formatCurrency(summary?.delivered_order_aov)} AOV`}
          icon={DollarSign}
          accentColor="teal"
          tooltip="Gross revenue generated from items sold."
          loading={summaryLoading}
        />
        <KPICard
          title="Units Sold"
          value={formatNumber(summary?.units_sold, true)}
          secondaryValue={`${summary?.average_items_per_order || 1.1} items/order`}
          icon={Package}
          accentColor="blue"
          tooltip="Total distinct items sold across all orders."
          loading={summaryLoading}
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(summary?.total_orders, true)}
          secondaryValue="Distinct purchases"
          icon={ShoppingCart}
          accentColor="indigo"
          tooltip="Distinct order count."
          loading={summaryLoading}
        />
        <KPICard
          title="Average Order Value"
          value={formatCurrency(summary?.average_order_value)}
          secondaryValue="GMV / Orders"
          icon={TrendingUp}
          accentColor="emerald"
          tooltip="Gross sales divided by total order volume."
          loading={summaryLoading}
        />
        <KPICard
          title="Average Item Price"
          value={formatCurrency(summary?.average_item_price)}
          secondaryValue="Per SKU unit"
          icon={Tag}
          accentColor="amber"
          tooltip="Average price of an individual item unit sold."
          loading={summaryLoading}
        />
        <KPICard
          title="Total Freight Collected"
          value={formatCurrency(summary?.total_freight, true)}
          secondaryValue="Logistics revenue"
          icon={Truck}
          accentColor="rose"
          tooltip="Total carrier freight paid by buyers across all order items."
          loading={summaryLoading}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Product Categories */}
        <ChartCard
          title="Top 10 Product Categories by Revenue"
          subtitle="Ranked revenue performance and contribution across product lines"
          tooltip="Calculated from FactOrderItems price grouped by category."
          loading={categoriesLoading}
          height="h-96"
        >
          <ReactECharts
            option={categoryParetoOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>

        {/* Regional Sales by State */}
        <ChartCard
          title="Top 12 States by Gross Sales (BRL)"
          subtitle="Customer geographic demand concentration (SP highlighted in blue)"
          tooltip="Customer location based on Brazilian Federative Unit codes."
          loading={regionsLoading}
          height="h-96"
        >
          <ReactECharts
            option={regionalSalesOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>
      </div>

      {/* Monthly Commercial Sales & AOV Evolution */}
      <ChartCard
        title="Monthly Commercial Sales & AOV Dynamic"
        subtitle="Historical revenue scale and basket size trajectory"
        tooltip="Tracks monthly Gross Item Sales vs Average Order Value."
        loading={monthlyLoading}
        height="h-88"
      >
        <ReactECharts
          option={monthlyAOVOption}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </ChartCard>
    </div>
  );
}
