import { TARIFF_DEFAULTS } from '../constants/hardwareConfig';

export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}

export function formatCurrency(value: number): string {
  return `${TARIFF_DEFAULTS.currency}${value.toFixed(0)}`;
}

export function formatCurrencyDecimal(value: number): string {
  return `${TARIFF_DEFAULTS.currency}${value.toFixed(2)}`;
}

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatEventTime(ts: { toDate?: () => Date } | Date): string {
  try {
    const d = ts && typeof ts === 'object' && 'toDate' in ts && ts.toDate ? ts.toDate() : ts as Date;
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return '';
  }
}
