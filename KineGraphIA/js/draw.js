let chartPosicio = null;
let chartVelocitat = null;

const COLORS = ['#2563eb', '#f97316', '#14b8a6', '#9333ea', '#dc2626', '#0ea5e9'];
const ZOOM_FACTOR = 1.4;

const chartStates = {
  posicio: { start: 0, end: 100 },
  velocitat: { start: 0, end: 100 }
};

function obtenirECharts() {
  if (typeof window === 'undefined' || !window.echarts) {
    console.warn('[draw.js] ECharts no esta disponible en aquest entorn');
    return null;
  }
  return window.echarts;
}

function actualitzaEstatDesChart(chart, key) {
  if (!chart || !chartStates[key]) return;
  const opcio = chart.getOption();
  const zoom = Array.isArray(opcio.dataZoom) ? opcio.dataZoom[0] : null;
  const start = typeof zoom?.start === 'number' ? zoom.start : 0;
  const end = typeof zoom?.end === 'number' ? zoom.end : 100;
  chartStates[key].start = start;
  chartStates[key].end = end;
}

function creaOpcioBase(titolY, start, end) {
  return {
    color: COLORS,
    backgroundColor: 'transparent',
    animation: false,
    grid: { left: 48, right: 24, top: 58, bottom: 76 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0f172a',
      borderWidth: 0,
      padding: [10, 12],
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      axisPointer: { lineStyle: { color: '#1e3a8a', width: 1.5 } }
    },
    legend: {
      top: 8,
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
      nameGap: 32,
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
      nameGap: 42,
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
        start,
        end
      },
      {
        type: 'slider',
        show: true,
        height: 14,
        bottom: 12,
        start,
        end,
        handleSize: 14,
        handleStyle: { color: '#2563eb', borderColor: '#1d4ed8' },
        brushSelect: false
      }
    ],
    series: []
  };
}

function construeixSeries(mobils, tipus) {
  const clau = tipus === 'posicio' ? 'posicions' : 'velocitats';
  const unitat = tipus === 'posicio' ? 'm' : 'm/s';
  return mobils.map((mobil) => {
    const valors = Array.isArray(mobil[clau]) ? mobil[clau] : [];
    const simbol = valors.length > 80 ? 'none' : 'circle';
    return {
      name: mobil.nom,
      type: 'line',
      smooth: true,
      symbol: simbol,
      symbolSize: 6,
      lineStyle: { width: 4 },
      areaStyle: { opacity: 0.08 },
      emphasis: { focus: 'series' },
      tooltip: {
        valueFormatter: (value) => {
          const numeric = Number(value);
          return Number.isFinite(numeric) ? `${numeric.toFixed(3)} ${unitat}` : `${value}`;
        }
      },
      data: valors
    };
  });
}

function assignaZoom(chart, key, start, end) {
  if (!chart || !chartStates[key]) return;
  chartStates[key].start = start;
  chartStates[key].end = end;
  chart.dispatchAction({ type: 'dataZoom', dataZoomIndex: 0, start, end });
  chart.dispatchAction({ type: 'dataZoom', dataZoomIndex: 1, start, end });
}

function ajustaZoom(chart, key, accio) {
  const estat = chartStates[key];
  if (!estat || !chart) return;
  if (accio === 'reset') {
    assignaZoom(chart, key, 0, 100);
    return;
  }
  const interval = estat.end - estat.start;
  const centre = (estat.start + estat.end) / 2;
  let nouRang = accio === 'in' ? interval / ZOOM_FACTOR : interval * ZOOM_FACTOR;
  nouRang = Math.min(100, Math.max(5, nouRang));
  let nouStart = centre - nouRang / 2;
  let nouEnd = centre + nouRang / 2;
  if (nouStart < 0) {
    nouEnd -= nouStart;
    nouStart = 0;
  }
  if (nouEnd > 100) {
    const exc = nouEnd - 100;
    nouStart -= exc;
    nouEnd = 100;
  }
  nouStart = Math.max(0, nouStart);
  nouEnd = Math.min(100, nouEnd);
  assignaZoom(chart, key, nouStart, nouEnd);
}

export function inicialitzaCharts() {
  const echarts = obtenirECharts();
  const posContainer = document.getElementById('chart-position');
  const velContainer = document.getElementById('chart-velocity');

  if (!echarts || !posContainer || !velContainer) {
    console.warn('[draw.js] No s'han pogut inicialitzar les grafiques (ECharts o contenidors no disponibles)');
    return;
  }

  chartPosicio = echarts.init(posContainer, undefined, { renderer: 'svg' });
  chartVelocitat = echarts.init(velContainer, undefined, { renderer: 'svg' });

  window.addEventListener('resize', () => {
    chartPosicio?.resize();
    chartVelocitat?.resize();
  });

  chartPosicio.on('datazoom', () => actualitzaEstatDesChart(chartPosicio, 'posicio'));
  chartVelocitat.on('datazoom', () => actualitzaEstatDesChart(chartVelocitat, 'velocitat'));

  chartPosicio.setOption(creaOpcioBase('Posicio (m)', chartStates.posicio.start, chartStates.posicio.end));
  chartVelocitat.setOption(creaOpcioBase('Velocitat (m/s)', chartStates.velocitat.start, chartStates.velocitat.end));

  console.log('[draw.js] ECharts inicialitzat');
}

export function actualitzaCharts(cronologia) {
  if (!chartPosicio || !chartVelocitat) return;

  const temps = Array.isArray(cronologia?.temps) ? cronologia.temps : [];
  const series = Array.isArray(cronologia?.series) ? cronologia.series : [];

  chartStates.posicio = { start: 0, end: 100 };
  chartStates.velocitat = { start: 0, end: 100 };

  const opcioPos = creaOpcioBase('Posicio (m)', chartStates.posicio.start, chartStates.posicio.end);
  opcioPos.xAxis.data = temps;
  opcioPos.legend.data = series.map((s) => s.nom);
  opcioPos.series = construeixSeries(series, 'posicio');

  const opcioVel = creaOpcioBase('Velocitat (m/s)', chartStates.velocitat.start, chartStates.velocitat.end);
  opcioVel.xAxis.data = temps;
  opcioVel.legend.data = series.map((s) => s.nom);
  opcioVel.series = construeixSeries(series, 'velocitat');

  chartPosicio.setOption(opcioPos, true);
  chartVelocitat.setOption(opcioVel, true);

  assignaZoom(chartPosicio, 'posicio', 0, 100);
  assignaZoom(chartVelocitat, 'velocitat', 0, 100);

  chartPosicio.resize();
  chartVelocitat.resize();
}

export function obtenirCharts() {
  return {
    posicio: chartPosicio,
    velocitat: chartVelocitat
  };
}

export function configuraControlsZoom() {
  const configuracions = [
    { botoIn: 'zoom-in-position', botoOut: 'zoom-out-position', botoResetId: 'zoom-reset-position', clau: 'posicio' },
    { botoIn: 'zoom-in-velocity', botoOut: 'zoom-out-velocity', botoResetId: 'zoom-reset-velocity', clau: 'velocitat' }
  ];

  configuracions.forEach(({ botoIn, botoOut, botoResetId, clau }) => {
    const botoMes = document.getElementById(botoIn);
    const botoMenys = document.getElementById(botoOut);
    const botoReset = document.getElementById(botoResetId);

    assignaControl(botoMes, () => ajustaZoom(obtenirChartPerClau(clau), clau, 'in'));
    assignaControl(botoMenys, () => ajustaZoom(obtenirChartPerClau(clau), clau, 'out'));
    assignaControl(botoReset, () => ajustaZoom(obtenirChartPerClau(clau), clau, 'reset'));
  });
}

export function reiniciaZoom() {
  assignaZoom(chartPosicio, 'posicio', 0, 100);
  assignaZoom(chartVelocitat, 'velocitat', 0, 100);
}

function obtenirChartPerClau(clau) {
  return clau === 'posicio' ? chartPosicio : chartVelocitat;
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

console.log('[draw.js] carregat');

