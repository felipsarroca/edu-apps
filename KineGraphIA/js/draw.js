let chartPosicio = null;
let chartVelocitat = null;

const COLORS = ['#2563eb', '#f97316', '#14b8a6', '#9333ea', '#dc2626', '#0ea5e9'];
const ZOOM_FACTOR = 1.25;

export function inicialitzaCharts() {
  const posCanvas = document.getElementById('chart-position');
  const velCanvas = document.getElementById('chart-velocity');

  if (typeof Chart === 'undefined' || !posCanvas || !velCanvas) {
    console.warn('[draw.js] Chart.js no esta disponible o falta algun canvas');
    return;
  }

  const zoomPlugin =
    window.ChartZoom ||
    window.chartjsPluginZoom ||
    window['chartjs-plugin-zoom'] ||
    window['chartjs-plugin-zoom.min'];
  if (zoomPlugin) {
    Chart.register(zoomPlugin);
  } else {
    console.warn('[draw.js] No s\'ha trobat el plugin de zoom de Chart.js');
  }

  Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#0f172a';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest', intersect: false },
    animation: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 14,
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const valor = Number(context.parsed.y.toFixed(3));
            const unitat = context.dataset.yUnit || '';
            return `${context.dataset.label}: ${valor} ${unitat}`.trim();
          }
        }
      },
      zoom: {
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          drag: { enabled: true },
          mode: 'xy'
        },
        pan: {
          enabled: true,
          mode: 'xy'
        },
        limits: {
          x: { minRange: 0.01 },
          y: { minRange: 0.01 }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Temps (s)' },
        ticks: { maxTicksLimit: 10 }
      },
      y: {
        title: { display: true, text: '' },
        ticks: { maxTicksLimit: 7 }
      }
    }
  };

  chartPosicio = new Chart(posCanvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        y: { ...baseOptions.scales.y, title: { display: true, text: 'Posicio (m)' } }
      }
    }
  });

  chartVelocitat = new Chart(velCanvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        y: { ...baseOptions.scales.y, title: { display: true, text: 'Velocitat (m/s)' } }
      }
    }
  });

  console.log('[draw.js] charts inicialitzats');
}

export function actualitzaCharts(cronologia) {
  if (!chartPosicio || !chartVelocitat || !cronologia) return;

  const temps = Array.isArray(cronologia.temps) ? cronologia.temps : [];
  const series = Array.isArray(cronologia.series) ? cronologia.series : [];

  const datasetsPos = series.map((serie, index) => ({
    label: serie.nom,
    data: serie.posicions,
    borderColor: COLORS[index % COLORS.length],
    backgroundColor: `${COLORS[index % COLORS.length]}45`,
    borderWidth: 4,
    pointRadius: serie.posicions.length > 80 ? 0 : 2,
    tension: 0.28,
    fill: false,
    yUnit: 'm'
  }));

  const datasetsVel = series.map((serie, index) => ({
    label: serie.nom,
    data: serie.velocitats,
    borderColor: COLORS[index % COLORS.length],
    backgroundColor: `${COLORS[index % COLORS.length]}45`,
    borderDash: index % 2 === 1 ? [5, 4] : undefined,
    borderWidth: 4,
    pointRadius: serie.velocitats.length > 80 ? 0 : 2,
    tension: 0.18,
    fill: false,
    yUnit: 'm/s'
  }));

  chartPosicio.data.labels = temps;
  chartPosicio.data.datasets = datasetsPos;
  chartVelocitat.data.labels = temps;
  chartVelocitat.data.datasets = datasetsVel;

  ajustaEscales(chartPosicio, temps, datasetsPos);
  ajustaEscales(chartVelocitat, temps, datasetsVel);

  chartPosicio.update('none');
  chartVelocitat.update('none');
}

export function obtenirCharts() {
  return {
    posicio: chartPosicio,
    velocitat: chartVelocitat
  };
}

export function configuraControlsZoom() {
  const controls = [
    {
      zoomIn: document.getElementById('zoom-in-position'),
      zoomOut: document.getElementById('zoom-out-position'),
      reset: document.getElementById('zoom-reset-position'),
      getChart: () => chartPosicio
    },
    {
      zoomIn: document.getElementById('zoom-in-velocity'),
      zoomOut: document.getElementById('zoom-out-velocity'),
      reset: document.getElementById('zoom-reset-velocity'),
      getChart: () => chartVelocitat
    }
  ];

  controls.forEach(({ zoomIn, zoomOut, reset, getChart }) => {
    assignaControl(zoomIn, () => {
      const chart = getChart();
      if (chart?.zoom) {
        chart.zoom({ x: ZOOM_FACTOR, y: ZOOM_FACTOR });
      }
    });
    assignaControl(zoomOut, () => {
      const chart = getChart();
      if (chart?.zoom) {
        chart.zoom({ x: 1 / ZOOM_FACTOR, y: 1 / ZOOM_FACTOR });
      }
    });
    assignaControl(reset, () => {
      const chart = getChart();
      if (chart?.resetZoom) {
        chart.resetZoom();
      }
    });
  });
}

export function reiniciaZoom() {
  chartPosicio?.resetZoom?.();
  chartVelocitat?.resetZoom?.();
}

function assignaControl(boto, accio) {
  if (!boto || typeof accio !== 'function') return;
  const handler = (event) => {
    event.preventDefault();
    accio();
  };
  boto.addEventListener('click', handler);
  boto.addEventListener('touchstart', handler, { passive: false });
}

function ajustaEscales(chart, temps, datasets) {
  if (!chart) return;
  const valors = datasets.flatMap((ds) => ds.data.filter((v) => Number.isFinite(v)));
  if (valors.length === 0) {
    chart.options.scales.y.suggestedMin = undefined;
    chart.options.scales.y.suggestedMax = undefined;
  } else {
    const min = Math.min(...valors);
    const max = Math.max(...valors);
    const marge = max - min || 1;
    const buffer = marge * 0.12;
    chart.options.scales.y.suggestedMin = min - buffer;
    chart.options.scales.y.suggestedMax = max + buffer;
  }

  if (Array.isArray(temps) && temps.length > 1) {
    chart.options.scales.x.suggestedMin = 0;
    chart.options.scales.x.suggestedMax = temps[temps.length - 1];
    chart.options.scales.x.ticks.maxTicksLimit = Math.min(10, temps.length);
  }
}

console.log('[draw.js] carregat');
