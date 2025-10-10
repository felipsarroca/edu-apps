import { SAMPLE_POINTS } from './config.js';

const { Chart, math } = window;

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

export const generateData = (expression, range) => {
  const compiled = math.compile(expression);
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

const buildDataset = (entry, range) => ({
  label: `y = ${entry.expression}`,
  data: generateData(entry.expression, range),
  borderColor: entry.color,
  borderWidth: 2.5,
  tension: 0.1,
});

export const appendDataset = (chart, entry, range, isFirst) => {
  const dataset = buildDataset(entry, range);
  chart.data.datasets.push(dataset);
  chart.update(isFirst ? undefined : 'none');
};

export const refreshDatasets = (chart, entries, range) => {
  chart.data.datasets = entries.map((entry) => buildDataset(entry, range));
  chart.update('none');
};

export const clearChart = (chart) => {
  chart.data.datasets = [];
  chart.update('none');
};

export const getVisibleRange = (chart, fallbackRange) => {
  const scale = chart.scales?.x;
  if (!scale || Number.isNaN(scale.min) || Number.isNaN(scale.max)) {
    return { ...fallbackRange };
  }
  return { min: scale.min, max: scale.max };
};
