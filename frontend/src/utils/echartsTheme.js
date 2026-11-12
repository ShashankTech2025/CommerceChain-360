/**
 * CommerceChain 360 - Enterprise ECharts Theme & Options Generator
 */

export const colors = {
  navy: '#0F2042',
  teal: '#0D9488',
  tealLight: '#14B8A6',
  blue: '#2563EB',
  cyan: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#EF4444',
  purple: '#8B5CF6',
  indigo: '#6366F1',
};

export const chartPalette = [
  '#0D9488', // Teal
  '#2563EB', // Blue
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Rose
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Light Teal
];

/**
 * Returns theme configuration object for ECharts based on isDark.
 */
export function getChartTheme(isDark = false) {
  const textColor = isDark ? '#94A3B8' : '#64748B';
  const headingColor = isDark ? '#F8FAFC' : '#0F172A';
  const splitLineColor = isDark ? '#334155' : '#F1F5F9';
  const axisLineColor = isDark ? '#475569' : '#CBD5E1';
  const tooltipBg = isDark ? '#0F172A' : '#FFFFFF';
  const tooltipBorder = isDark ? '#334155' : '#E2E8F0';
  const tooltipText = isDark ? '#F8FAFC' : '#0F172A';

  return {
    color: chartPalette,
    textStyle: {
      fontFamily: 'Inter, Segoe UI, sans-serif',
      color: textColor,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: {
        color: tooltipText,
        fontSize: 12,
        fontFamily: 'Inter, Segoe UI, sans-serif',
      },
      padding: [8, 12],
      extraCssText: 'box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.15); border-radius: 8px;',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '12%',
      containLabel: true,
    },
    legend: {
      textStyle: {
        color: textColor,
        fontSize: 12,
      },
      top: 0,
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
    },
    xAxis: {
      axisLine: { lineStyle: { color: axisLineColor } },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 11 },
      splitLine: { show: false },
    },
    yAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: textColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
    },
  };
}

