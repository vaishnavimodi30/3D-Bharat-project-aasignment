export function formatINR(value) {
  if (value == null || Number.isNaN(value)) return "-";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatPercent(value, decimals = 1) {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return value.toLocaleString("en-IN");
}
