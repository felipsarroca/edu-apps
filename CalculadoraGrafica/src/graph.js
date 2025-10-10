import { DEFAULT_RANGE, SAMPLE_POINTS } from './config.js';
import { MODE_IDS } from './modes.js';

const { Chart, math } = window;

const SHADE_X_STEPS = 60;
const SHADE_Y_STEPS = 20;

const ensureRange = (range) => {
  if (!range || !Number.isFinite(range.min) || !Number.isFinite(range.max)) {
    return { min: DEFAULT_RANGE.min, max: DEFAULT_RANGE.max };
  }
  if (range.min === range.max) {
    return {
      min: range.min - 5,
      max: range.max + 5,
    };
  }
  return range;
};

const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') {
    return `rgba(102, 126, 234, ${alpha})`;
  }
  let normalized = hex.replace('#', '');
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (normalized.length !== 6) {
    return `rgba(102, 126, 234, ${alpha})`;
  }
  const value = parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const createChart = (canvas, onInteraction) => {
  const context = canvas.getContext('2d');

  const config = {
    type: 'line',
    data: {
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          grid: {
            color: '#f0f0f0',
            borderColor: '#666',
            borderWidth: 2,
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          suggestedMin: DEFAULT_RANGE.min,
          suggestedMax: DEFAULT_RANGE.max,
          grid: {
            color: '#f0f0f0',
            borderColor: '#666',
            borderWidth: 2,
          },
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'xy',
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  };

  if (onInteraction) {
    config.options.plugins.zoom.zoom.onZoomComplete = onInteraction;
    config.options.plugins.zoom.pan.onPanComplete = onInteraction;
  }

  return new Chart(context, config);
};

export const generateData = (expression, range, compiledExpression) => {
  const compiled = compiledExpression ?? math.compile(expression);
  const data = [];
  const { min, max } = range;
  const step = (max - min) / SAMPLE_POINTS;

  for (let x = min; x <= max; x += step) {
    let yValue = null;
    try {
      const y = compiled.evaluate({ x });
      if (Number.isFinite(y)) {
        yValue = y;
      }
    } catch (error) {
      yValue = null;
    }
    data.push({ x, y: yValue });
  }

  return data;
};

const buildFunctionDatasets = (entry, bounds) => {
  const data = generateData(entry.expression, bounds.x);
  return [
    {
      type: 'line',
      label: entry.label ?? entry.expression,
      data,
      borderColor: entry.color,
      borderWidth: 2.5,
      tension: 0.1,
      pointRadius: 0,
      fill: false,
      order: 1,
    },
  ];
};

const evaluateBoundary = (compiled, x) => {
  try {
    const result = compiled.evaluate({ x });
    return Number.isFinite(result) ? result : null;
  } catch (error) {
    return null;
  }
};

const createShadingPoints = (inequality, bounds) => {
  if (!inequality?.compiled) {
    return [];
  }

  const xRange = ensureRange(bounds.x);
  const yRange = ensureRange(bounds.y);

  const xSpan = xRange.max - xRange.min;
  const ySpan = yRange.max - yRange.min;
  if (!Number.isFinite(xSpan) || xSpan <= 0 || !Number.isFinite(ySpan) || ySpan <= 0) {
    return [];
  }

  const xStep = xSpan / SHADE_X_STEPS;
  const shading = [];

  for (let i = 0; i <= SHADE_X_STEPS; i += 1) {
    const x = xRange.min + i * xStep;
    const boundary = evaluateBoundary(inequality.compiled, x);
    if (!Number.isFinite(boundary)) {
      continue;
    }

    let startY;
    let endY;

    if (inequality.orientation === 'above') {
      startY = Math.max(boundary, yRange.min);
      endY = yRange.max;
      if (endY <= startY) {
        continue;
      }
    } else {
      startY = yRange.min;
      endY = Math.min(boundary, yRange.max);
      if (endY <= startY) {
        continue;
      }
    }

    const yStep = (endY - startY) / SHADE_Y_STEPS;
    if (!Number.isFinite(yStep) || yStep <= 0) {
      continue;
    }

    for (let j = 0; j <= SHADE_Y_STEPS; j += 1) {
      const y = startY + j * yStep;
      shading.push({ x, y });
    }
  }

  return shading;
};

const buildInequalityDatasets = (entry, bounds) => {
  const inequality = entry.metadata?.inequality;
  if (!inequality || inequality.variable !== 'y') {
    return buildFunctionDatasets(entry, bounds);
  }

  const boundaryData = generateData(
    inequality.expression,
    bounds.x,
    inequality.compiled,
  );
  const shadingPoints = createShadingPoints(inequality, bounds);
  const shadingColor = hexToRgba(entry.color, 0.2);

  const datasets = [];

  if (shadingPoints.length > 0) {
    datasets.push({
      type: 'scatter',
      label: `${entry.label} — zona`,
      data: shadingPoints,
      pointRadius: 1.4,
      pointBackgroundColor: shadingColor,
      pointBorderColor: shadingColor,
      pointHoverRadius: 0,
      pointHitRadius: 0,
      showLine: false,
      order: 0,
    });
  }

  datasets.push({
    type: 'line',
    label: entry.label,
    data: boundaryData,
    borderColor: entry.color,
    borderWidth: 2.5,
    tension: 0.1,
    pointRadius: 0,
    fill: false,
    order: 1,
    borderDash: inequality.inclusive ? [] : [6, 6],
  });

  return datasets;
};

export const buildDatasets = (entries, bounds) => {
  const safeBounds = {
    x: ensureRange(bounds?.x),
    y: ensureRange(bounds?.y),
  };

  return entries.flatMap((entry) => {
    if (entry.mode === MODE_IDS.INEQUALITY) {
      return buildInequalityDatasets(entry, safeBounds);
    }
    return buildFunctionDatasets(entry, safeBounds);
  });
};

export const getVisibleBounds = (chart, fallbackRange = DEFAULT_RANGE) => {
  const xScale = chart.scales?.x;
  const yScale = chart.scales?.y;

  const xBounds =
    xScale && Number.isFinite(xScale.min) && Number.isFinite(xScale.max)
      ? { min: xScale.min, max: xScale.max }
      : { ...fallbackRange };

  const yBounds =
    yScale && Number.isFinite(yScale.min) && Number.isFinite(yScale.max)
      ? { min: yScale.min, max: yScale.max }
      : { ...fallbackRange };

  return { x: xBounds, y: yBounds };
};

export const clearChart = (chart) => {
  chart.data.datasets = [];
  chart.update('none');
};
