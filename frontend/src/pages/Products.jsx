/**
 * CommerceChain 360 - Product & Merchandise Intelligence
 */

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Package,
  Layers,
  Tag,
  DollarSign,
  Truck,
  Percent,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import KPICard from '../components/cards/KPICard';
import ChartCard from '../components/cards/ChartCard';
import { useFilters } from '../context/FilterContext';
import { useTheme } from '../context/ThemeContext';
import {
  useProductsSummary,
  useProductsCategories
} from '../hooks/useAnalytics';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';
import { getChartTheme, colors } from '../utils/echartsTheme';

export default function Products() {
  const { filters } = useFilters();
  const { isDark } = useTheme();

  const { data: summary, isLoading: summaryLoading } = useProductsSummary(filters);
  const { data: categoriesData, isLoading: categoriesLoading } = useProductsCategories(filters);

  const themeConfig = useMemo(() => getChartTheme(isDark), [isDark]);

  // Top 10 Categories Option
  const topCategoriesOption = useMemo(() => {
    const top10 = categoriesData?.top_10 || [];
    if (!top10.length) return {};

    const cats = top10.map(c => c.category).reverse();
    const sales = top10.map(c => c.gross_item_sales).reverse();

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const name = params[0].name;
          const item = top10.find(c => c.category === name);
          return `<div class="text-xs">
            <div class="font-bold mb-1">${name}</div>
            <div>Gross Sales: <span class="font-bold">${formatCurrency(item?.gross_item_sales)}</span></div>
            <div>Units Sold: <span class="font-bold">${formatNumber(item?.units_sold)}</span></div>
            <div>Avg Unit Price: <span class="font-bold">${formatCurrency(item?.average_item_price)}</span></div>
            <div>Freight Ratio: <span class="font-bold">${item?.freight_to_price_ratio_pct}%</span></div>
          </div>`;
        }
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
          width: 140,
          overflow: 'truncate',
        },
      },
      series: [
        {
          name: 'Gross Sales',
          type: 'bar',
          data: sales,
          itemStyle: { color: colors.teal, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 18,
        },
      ],
    };
  }, [categoriesData, themeConfig, isDark]);

  // Bottom 10 Categories Option
  const bottomCategoriesOption = useMemo(() => {
    const bottom10 = categoriesData?.bottom_10 || [];
    if (!bottom10.length) return {};

    const cats = bottom10.map(c => c.category).reverse();
    const sales = bottom10.map(c => c.gross_item_sales).reverse();

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const name = params[0].name;
          const item = bottom10.find(c => c.category === name);
          return `<div class="text-xs">
            <div class="font-bold mb-1">${name}</div>
            <div>Gross Sales: <span class="font-bold">${formatCurrency(item?.gross_item_sales)}</span></div>
            <div>Units Sold: <span class="font-bold">${formatNumber(item?.units_sold)}</span></div>
            <div>Avg Unit Price: <span class="font-bold">${formatCurrency(item?.average_item_price)}</span></div>
          </div>`;
        }
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'value',
        axisLabel: {
          formatter: (v) => `R$ ${v}`,
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
          width: 140,
          overflow: 'truncate',
        },
      },
      series: [
        {
          name: 'Gross Sales',
          type: 'bar',
          data: sales,
          itemStyle: { color: colors.rose, borderRadius: [0, 4, 4, 0] },
          barMaxWidth: 18,
        },
      ],
    };
  }, [categoriesData, themeConfig, isDark]);

  // Freight Burden Across Top Categories
  const freightBurdenOption = useMemo(() => {
    const all = (categoriesData?.top_10 || []);
    if (!all.length) return {};

    const cats = all.map(c => c.category);
    const ratios = all.map(c => c.freight_to_price_ratio_pct);

    return {
      ...themeConfig,
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          if (!params || !params.length) return '';
          const name = params[0].name;
          const item = all.find(c => c.category === name);
          return `<div class="text-xs">
            <div class="font-bold mb-1">${name}</div>
            <div>Freight Burden: <span class="font-bold">${item?.freight_to_price_ratio_pct}%</span></div>
            <div>Avg Item Price: <span class="font-bold">${formatCurrency(item?.average_item_price)}</span></div>
            <div>Total Freight: <span class="font-bold">${formatCurrency(item?.total_freight)}</span></div>
          </div>`;
        }
      },
      xAxis: {
        ...themeConfig.xAxis,
        type: 'category',
        data: cats,
        axisLabel: {
          color: isDark ? '#E2E8F0' : '#1E293B',
          fontSize: 10,
          interval: 0,
          rotate: 20,
        },
      },
      yAxis: {
        ...themeConfig.yAxis,
        type: 'value',
        name: 'Freight % of Price',
        axisLabel: {
          formatter: '{value}%',
          color: isDark ? '#94A3B8' : '#64748B',
        },
      },
      series: [
        {
          name: 'Freight to Price %',
          type: 'bar',
          data: ratios,
          itemStyle: {
            color: (params) => (params.value > 20 ? colors.rose : colors.teal),
            borderRadius: [4, 4, 0, 0],
          },
          barMaxWidth: 24,
        },
      ],
    };
  }, [categoriesData, themeConfig, isDark]);

  return (
    <div className="space-y-6">
      {/* Product Intelligence KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Catalog Breadth"
          value={formatNumber(summary?.total_products_catalog, true)}
          secondaryValue="Distinct SKUs"
          icon={Package}
          accentColor="teal"
          tooltip="Total distinct product entries cataloged in the system."
          loading={summaryLoading}
        />
        <KPICard
          title="Active Products Sold"
          value={formatNumber(summary?.active_products_sold, true)}
          secondaryValue="100% catalog conversion"
          icon={CheckCircle}
          accentColor="blue"
          tooltip="Number of distinct product SKUs that recorded at least one customer sale."
          loading={summaryLoading}
        />
        <KPICard
          title="Product Categories"
          value={summary?.total_categories || 73}
          secondaryValue="Named categories"
          icon={Layers}
          accentColor="indigo"
          tooltip="Total distinct product categories with English translations."
          loading={summaryLoading}
        />
        <KPICard
          title="Units Sold"
          value={formatNumber(summary?.units_sold, true)}
          secondaryValue="Physical shipments"
          icon={Tag}
          accentColor="emerald"
          tooltip="Total individual merchandise units sold across order items."
          loading={summaryLoading}
        />
        <KPICard
          title="Average Item Price"
          value={formatCurrency(summary?.average_item_price)}
          secondaryValue="Per SKU unit"
          icon={DollarSign}
          accentColor="amber"
          tooltip="Gross sales divided by total units sold."
          loading={summaryLoading}
        />
        <KPICard
          title="Freight to Price Ratio"
          value={formatPercent(summary?.freight_to_price_ratio_pct)}
          secondaryValue="Logistics friction"
          trend="neutral"
          trendText="16.6% freight load"
          icon={Truck}
          accentColor="rose"
          tooltip="Total freight costs as a percentage of gross merchandise price."
          loading={summaryLoading}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Product Categories */}
        <ChartCard
          title="Top 10 High-Revenue Merchandise Categories"
          subtitle="Core revenue generators driving platform GMV"
          tooltip="Aggregated from FactOrderItems price grouped by category."
          loading={categoriesLoading}
          height="h-96"
        >
          <ReactECharts
            option={topCategoriesOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>

        {/* Bottom 10 Underperforming Categories */}
        <ChartCard
          title="Bottom 10 Underperforming Product Categories"
          subtitle="Low turnover long-tail merchandise lines"
          tooltip="Categories contributing minimal sales volume that may indicate catalog bloat."
          loading={categoriesLoading}
          height="h-96"
        >
          <ReactECharts
            option={bottomCategoriesOption}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        </ChartCard>
      </div>

      {/* Freight-to-Price Friction Analysis */}
      <ChartCard
        title="Freight Friction Index: Top Categories Freight-to-Price Ratio (%)"
        subtitle="Identifies categories where shipping costs burden customer purchase decisions (red indicates >20%)"
        tooltip="Categories with high ratios (e.g. bulky furniture, home appliances) often suffer lower conversion."
        loading={categoriesLoading}
        height="h-88"
      >
        <ReactECharts
          option={freightBurdenOption}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </ChartCard>
    </div>
  );
}
