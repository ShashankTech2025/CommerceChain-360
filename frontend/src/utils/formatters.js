/**
 * CommerceChain 360 - Enterprise Data Formatters & Helpers
 */

/**
 * Formats a number as Brazilian Real (BRL).
 * @param {number|null|undefined} value 
 * @param {boolean} compact - If true, formats as R$ 13.59M or R$ 120.5K
 * @returns {string}
 */
export function formatCurrency(value, compact = false) {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';

  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `R$ ${(value / 1_000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats an integer or float with thousands separators.
 * @param {number|null|undefined} value 
 * @param {boolean} compact 
 * @returns {string}
 */
export function formatNumber(value, compact = false) {
  if (value === null || value === undefined || isNaN(value)) return '0';

  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Formats a percentage value.
 * @param {number|null|undefined} value - e.g. 91.89 for 91.89%
 * @param {number} decimals 
 * @returns {string}
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Formats a date string to a clean readable representation.
 * @param {string|null|undefined} dateStr 
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Returns color classes for delivery SLA status.
 * @param {string} status 
 * @returns {string}
 */
export function getSLAStatusColor(status) {
  switch (status) {
    case 'On Time / Early':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'Late':
      return 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'In Transit':
      return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

/**
 * Returns color classes for order fulfillment status.
 * @param {string} status 
 * @returns {string}
 */
export function getOrderStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    case 'shipped':
      return 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    case 'canceled':
    case 'unavailable':
      return 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
    case 'invoiced':
    case 'processing':
      return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

