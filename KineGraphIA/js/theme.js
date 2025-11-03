const BASE_COLORS = ['#1d4ed8', '#dc2626', '#16a34a', '#312e81', '#991b1b', '#166534'];

export const SERIES_COLORS = BASE_COLORS;

export function seriesColor(index = 0) {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

export function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function tint(hex, amount = 0.2) {
  const { r, g, b } = hexToRgb(hex);
  const tintR = Math.round(r + (255 - r) * amount);
  const tintG = Math.round(g + (255 - g) * amount);
  const tintB = Math.round(b + (255 - b) * amount);
  return `rgb(${tintR}, ${tintG}, ${tintB})`;
}

export function shade(hex, amount = 0.15) {
  const { r, g, b } = hexToRgb(hex);
  const shadeR = Math.round(r * (1 - amount));
  const shadeG = Math.round(g * (1 - amount));
  const shadeB = Math.round(b * (1 - amount));
  return `rgb(${shadeR}, ${shadeG}, ${shadeB})`;
}

export function createCardStyles(hex) {
  return {
    border: withAlpha(hex, 0.45),
    glow: withAlpha(hex, 0.12),
    accent: hex,
    soft: tint(hex, 0.7),
    shadow: withAlpha(hex, 0.25)
  };
}

function hexToRgb(hex) {
  let value = hex.replace('#', '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const bigint = parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

console.log('[theme.js] Paleta carregada');
