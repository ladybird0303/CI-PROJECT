export function formatPercent(value: number): string {
  return `${value.toFixed(0)}%`;
}

export function formatKwh(value: number): string {
  return `${value.toFixed(1)} kWh`;
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(0)}`;
}
