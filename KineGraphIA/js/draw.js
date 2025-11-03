const COLORS = ['#2563eb', '#f97316', '#14b8a6', '#9333ea', '#dc2626', '#0ea5e9'];
const ZOOM_FACTOR = 1.4;

let chartPrincipal = null;
let currentMode = 'position';
let cronologiaActual = { temps: [], series: [] };
const chartState = { start: 0, end: 100 };

function obtenirECharts() {
  if (typeof window === 'undefined' || !window.echarts) {
    console.warn('[draw.js] ECharts no està disponible en aquest entorn');
    return null;
  }
  return window.echarts;
}

function creaOpcioBase(titolY) {
  return {
    color: COLORS,
    backgroundColor: '#ffffff',
    animation: false,
    grid: { left: 55, right: 28, top: 60, bottom: 80 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderWidth: 0,
      padding: [10, 12],
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      axisPointer: { lineStyle: { color: '#1e3a8a', width: 1.5 } }
    },
    legend: {
      top: 10,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#1f2937', fontSize: 12 }
    },
    toolbox: { show: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: 'Temps (s)',
      nameLocation: 'middle',
      nameGap: 30,
      axisLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#475569' },
      axisTick: { show: false },
      splitLine: { show: false },
      data: []
    },
    yAxis: {
      type: 'value',
      name: titolY,
      nameLocation: 'middle',
      nameGap: 48,
      minInterval: 0,
      axisLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#475569' },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.35)' } }
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
        minSpan: 5,
        start: chartState.start,
        end: chartState.end
      },
      {
        type: 'slider',
        show: true,
        height: 14,
        bottom: 16,
        start: chartState.start,
        end: chartState.end,
        handleSize: 16,
        handleStyle: { color: '#2563eb', borderColor: '#1d4ed8' },
        brushSelect: false
      }
    ],
    series: []
  };
}

function construeixSeries(series, mode) {
  const clau =
    mode === 'position' ? 'posicions' : mode === 'velocity' ? 'velocitats' : 'acceleracions';
  const unitat = mode === 'position' ? 'm' : mode === 'velocity' ? 'm/s' : 'm/sà';

  return series.map((serie) => {
    const valors = Array.isArray(serie[clau]) ? serie[clau] : [];
    const senseMarcador = valors.length > 120;
    return {
      name: serie.nom,
      type: 'line',
      smooth: true,
      symbol: senseMarcador ? 'none' : 'circle',
      symbolSize: 6,
      lineStyle: { width: 4 },
      areaStyle: { opacity: 0.1 },
      emphasis: { focus: 'series' },
      tooltip: {
        valueFormatter: (value) => {
          const numeric = Number(value);
          if (Number.isFinite(numeric)) {
            const decimals = Math.abs(numeric) < 10 ? 3 : 2;
            const text = numeric.toFixed(decimals).replace(/\.?0+$/, '');
            return `${text} ${unitat}`;
          }
          return `${value} ${unitat}`;
        }
      },
      data: valors
    };
  });
}

function actualitzaEstatZoom(chart) {
  if (!chart) return;
  const opcio = chart.getOption();
  const zoom = Array.isArray(opcio.dataZoom) ? opcio.dataZoom[0] : null;
  chartState.start = typeof zoom?.start === 'number' ? zoom.start : 0;
  chartState.end = typeof zoom?.end === 'number' ? zoom.end : 100;
}

function assignaZoom(start, end) {
  chartState.start = start;
  chartState.end = end;
  chartPrincipal?.dispatchAction({ type: 'dataZoom', dataZoomIndex: 0, start, end });
  chartPrincipal?.dispatchAction({ type: 'dataZoom', dataZoomIndex: 1, start, end });
}

function ajustaZoom(accio) {
  if (!chartPrincipal) return;
  if (accio === 'reset') {
    assignaZoom(0, 100);
    return;
  }
  const interval = chartState.end - chartState.start;
  const centre = (chartState.start + chartState.end) / 2;
  let nouRang = accio === 'in' ? interval / ZOOM_FACTOR : interval * ZOOM_FACTOR;
  nouRang = Math.min(100, Math.max(5, nouRang));
  let nouStart = centre - nouRang / 2;
  let nouEnd = centre + nouRang / 2;
  if (nouStart < 0) {
    nouEnd -= nouStart;
    nouStart = 0;
  }
  if (nouEnd > 100) {
    const exces = nouEnd - 100;
    nouStart -= exces;
    nouEnd = 100;
  }
  nouStart = Math.max(0, nouStart);
  nouEnd = Math.min(100, nouEnd);
  assignaZoom(nouStart, nouEnd);
}

function renderitzaChart(mode = currentMode) {
  if (!chartPrincipal) return;
  currentMode = mode;

  const titol =
    mode === 'position'
      ? 'Posicià (m)'
      : mode === 'velocity'
      ? 'Velocitat (m/s)'
      : 'Acceleracià (m/sà)';

  const opcions = creaOpcioBase(titol);
  opcions.xAxis.data = cronologiaActual.temps;
  opcions.legend.data = cronologiaActual.series.map((s) => s.nom);
  opcions.series = construeixSeries(cronologiaActual.series, mode);

  chartPrincipal.setOption(opcions, true);
  document
    .querySelectorAll('.btn--toggle')
    .forEach((boto) => boto.classList.toggle('is-active', boto.dataset.chart === currentMode));
  assignaZoom(chartState.start, chartState.end);
  chartPrincipal.resize();
}

export function inicialitzaCharts() {
  const echarts = obtenirECharts();
  const contenidor = document.getElementById('chart-main');

  if (!echarts || !contenidor) {
    console.warn("[draw.js] No s'han pogut inicialitzar les gràfiques (ECharts o contenidor no disponible)");
    return;
  }

  chartPrincipal = echarts.init(contenidor, undefined, { renderer: 'canvas' });
  window.addEventListener('resize', () => chartPrincipal?.resize());
  chartPrincipal.on('datazoom', () => actualitzaEstatZoom(chartPrincipal));

  renderitzaChart('position');
  console.log('[draw.js] ECharts inicialitzat');
}

export function actualitzaCharts(cronologia) {
  cronologiaActual = {
    temps: Array.isArray(cronologia?.temps) ? cronologia.temps : [],
    series: Array.isArray(cronologia?.series) ? cronologia.series : []
  };
  chartState.start = 0;
  chartState.end = 100;
  renderitzaChart(currentMode);
}

export function obtenirCharts() {
  return { chart: chartPrincipal, mode: currentMode };
}

export function configuraControlsZoom() {
  const botoIn = document.querySelector('#zoom-in-chart');
  const botoOut = document.querySelector('#zoom-out-chart');
  const botoReset = document.querySelector('#zoom-reset-chart');

  const creaHandler = (accio) => (event) => {
    event.preventDefault();
    ajustaZoom(accio);
  };

  botoIn?.addEventListener('click', creaHandler('in'));
  botoIn?.addEventListener('touchstart', creaHandler('in'), { passive: false });
  botoOut?.addEventListener('click', creaHandler('out'));
  botoOut?.addEventListener('touchstart', creaHandler('out'), { passive: false });
  botoReset?.addEventListener('click', creaHandler('reset'));
  botoReset?.addEventListener('touchstart', creaHandler('reset'), { passive: false });
}

export function configuraSelectorGrafiques() {
  const botons = document.querySelectorAll('.btn--toggle');
  botons.forEach((boto) => {
    const handler = (event) => {
      event.preventDefault();
      const mode = boto.dataset.chart;
      if (!mode || mode === currentMode) return;
      renderitzaChart(mode);
    };

    boto.addEventListener('click', handler);
    boto.addEventListener(
      'touchstart',
      (event) => {
        event.preventDefault();
        handler(event);
      },
      { passive: false }
    );
  });
}

export function reiniciaZoom() {
  assignaZoom(0, 100);
}

console.log('[draw.js] carregat');


