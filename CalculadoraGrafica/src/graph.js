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

const createGradientPointsY = (inequality, bounds) => {
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

const createHorizontalBandPoints = (lowerValue, upperValue, bounds) => {
  const xRange = ensureRange(bounds.x);
  const yRange = ensureRange(bounds.y);
  const minY = Math.max(lowerValue, yRange.min);
  const maxY = Math.min(upperValue, yRange.max);

  if (!Number.isFinite(minY) || !Number.isFinite(maxY) || maxY <= minY) {
    return [];
  }

  const xSpan = xRange.max - xRange.min;
  const ySpan = maxY - minY;
  if (!Number.isFinite(xSpan) || xSpan <= 0 || !Number.isFinite(ySpan) || ySpan <= 0) {
    return [];
  }

  const xStep = xSpan / SHADE_X_STEPS;
  const yStep = ySpan / SHADE_Y_STEPS;
  if (!Number.isFinite(xStep) || xStep <= 0 || !Number.isFinite(yStep) || yStep <= 0) {
    return [];
  }

  const points = [];
  for (let i = 0; i <= SHADE_X_STEPS; i += 1) {
    const x = xRange.min + i * xStep;
    for (let j = 0; j <= SHADE_Y_STEPS; j += 1) {
      const y = minY + j * yStep;
      points.push({ x, y });
    }
  }
  return points;
};

const createVerticalHalfPlanePoints = (value, orientation, bounds) => {
  const xRange = ensureRange(bounds.x);
  const yRange = ensureRange(bounds.y);
  const ySpan = yRange.max - yRange.min;
  if (!Number.isFinite(ySpan) || ySpan <= 0) {
    return [];
  }

  const yStep = ySpan / SHADE_X_STEPS;
  if (!Number.isFinite(yStep) || yStep <= 0) {
    return [];
  }

  let startX;
  let endX;

  if (orientation === 'right') {
    startX = Math.max(value, xRange.min);
    endX = xRange.max;
  } else {
    startX = xRange.min;
    endX = Math.min(value, xRange.max);
  }

  if (!Number.isFinite(startX) || !Number.isFinite(endX) || endX <= startX) {
    return [];
  }

  const xSpan = endX - startX;
  const xStep = xSpan / SHADE_Y_STEPS;
  if (!Number.isFinite(xStep) || xStep <= 0) {
    return [];
  }

  const points = [];
  for (let i = 0; i <= SHADE_X_STEPS; i += 1) {
    const y = yRange.min + i * yStep;
    for (let j = 0; j <= SHADE_Y_STEPS; j += 1) {
      const x = startX + j * xStep;
      points.push({ x, y });
    }
  }
  return points;
};

const createVerticalBandPoints = (lowerValue, upperValue, bounds) => {
  const xRange = ensureRange(bounds.x);
  const yRange = ensureRange(bounds.y);

  const minX = Math.max(lowerValue, xRange.min);
  const maxX = Math.min(upperValue, xRange.max);

  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || maxX <= minX) {
    return [];
  }

  const xSpan = maxX - minX;
  const ySpan = yRange.max - yRange.min;
  if (!Number.isFinite(xSpan) || xSpan <= 0 || !Number.isFinite(ySpan) || ySpan <= 0) {
    return [];
  }

  const xStep = xSpan / SHADE_Y_STEPS;
  const yStep = ySpan / SHADE_X_STEPS;
  if (!Number.isFinite(xStep) || xStep <= 0 || !Number.isFinite(yStep) || yStep <= 0) {
    return [];
  }

  const points = [];
  for (let i = 0; i <= SHADE_X_STEPS; i += 1) {
    const y = yRange.min + i * yStep;
    for (let j = 0; j <= SHADE_Y_STEPS; j += 1) {
      const x = minX + j * xStep;
      points.push({ x, y });
    }
  }
  return points;
};

const buildSingleYDatasets = (entry, bounds, inequality) => {
  const boundaryData = generateData(
    inequality.expression,
    bounds.x,
    inequality.compiled,
  );
  const shadingPoints = createGradientPointsY(inequality, bounds);
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

const buildDoubleYDatasets = (entry, bounds, inequality) => {
  const lower = inequality.range?.lower;
  const upper = inequality.range?.upper;
  if (!lower || !upper) {
    return [];
  }

  const shadingPoints = createHorizontalBandPoints(
    lower.value,
    upper.value,
    bounds,
  );
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

  const xRange = ensureRange(bounds.x);

  datasets.push({
    type: 'line',
    label: `${entry.label} — límit superior`,
    data: [
      { x: xRange.min, y: upper.value },
      { x: xRange.max, y: upper.value },
    ],
    borderColor: entry.color,
    borderWidth: 2,
    tension: 0,
    pointRadius: 0,
    borderDash: upper.inclusive ? [] : [6, 6],
    order: 1,
  });

  datasets.push({
    type: 'line',
    label: `${entry.label} — límit inferior`,
    data: [
      { x: xRange.min, y: lower.value },
      { x: xRange.max, y: lower.value },
    ],
    borderColor: entry.color,
    borderWidth: 2,
    tension: 0,
    pointRadius: 0,
    borderDash: lower.inclusive ? [] : [6, 6],
    order: 1,
  });

  return datasets;
};

const buildSingleXDatasets = (entry, bounds, inequality) => {
  const shadingPoints = createVerticalHalfPlanePoints(
    inequality.value,
    inequality.orientation,
    bounds,
  );
  const shadingColor = hexToRgba(entry.color, 0.2);
  const yRange = ensureRange(bounds.y);

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
    data: [
      { x: inequality.value, y: yRange.min },
      { x: inequality.value, y: yRange.max },
    ],
    borderColor: entry.color,
    borderWidth: 2.5,
    tension: 0,
    pointRadius: 0,
    borderDash: inequality.inclusive ? [] : [6, 6],
    order: 1,
  });

  return datasets;
};

const buildDoubleXDatasets = (entry, bounds, inequality) => {
  const lower = inequality.range?.lower;
  const upper = inequality.range?.upper;
  if (!lower || !upper) {
    return [];
  }

  const shadingPoints = createVerticalBandPoints(
    lower.value,
    upper.value,
    bounds,
  );
  const shadingColor = hexToRgba(entry.color, 0.2);
  const yRange = ensureRange(bounds.y);

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
    label: `${entry.label} — límit dret`,
    data: [
      { x: upper.value, y: yRange.min },
      { x: upper.value, y: yRange.max },
    ],
    borderColor: entry.color,
    borderWidth: 2,
    tension: 0,
    pointRadius: 0,
    borderDash: upper.inclusive ? [] : [6, 6],
    order: 1,
  });

  datasets.push({
    type: 'line',
    label: `${entry.label} — límit esquerre`,
    data: [
      { x: lower.value, y: yRange.min },
      { x: lower.value, y: yRange.max },
    ],
    borderColor: entry.color,
    borderWidth: 2,
    tension: 0,
    pointRadius: 0,
    borderDash: lower.inclusive ? [] : [6, 6],
    order: 1,
  });

  return datasets;
};

const buildInequalityDatasets = (entry, bounds) => {
  const inequality = entry.metadata?.inequality;
  if (!inequality) {
    return buildFunctionDatasets(entry, bounds);
  }

  if (inequality.variable === 'y') {
    if (inequality.type === 'double') {
      return buildDoubleYDatasets(entry, bounds, inequality);
    }
    return buildSingleYDatasets(entry, bounds, inequality);
  }

  if (inequality.variable === 'x') {
    if (inequality.type === 'double') {
      return buildDoubleXDatasets(entry, bounds, inequality);
    }
    return buildSingleXDatasets(entry, bounds, inequality);
  }

  return buildFunctionDatasets(entry, bounds);
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
