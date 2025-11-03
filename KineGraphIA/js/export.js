import { obtenirBotonsExport, actualitzaMissatge } from './ui.js';
import { obtenirCharts } from './draw.js';

let botons = null;

export function configuraExportacions() {
  botons = obtenirBotonsExport();

  botons.posicio?.addEventListener('click', () => exportar('posicio'));
  botons.velocitat?.addEventListener('click', () => exportar('velocitat'));
}

export function estableixDisponibilitatExport(disponible) {
  botons ??= obtenirBotonsExport();
  Object.values(botons).forEach((boto) => {
    if (!boto) return;
    boto.disabled = !disponible;
  });
}

function exportar(tipus) {
  const charts = obtenirCharts();
  const chart = tipus === 'posicio' ? charts.posicio : charts.velocitat;

  if (!chart) {
    actualitzaMissatge('Encara no hi ha dades per exportar.', 'error');
    return;
  }

  const imatge = chart.toBase64Image('image/png', 1);
  const enllac = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  enllac.href = imatge;
  enllac.download = `kinegraphia-${tipus}-${timestamp}.png`;
  enllac.click();
  actualitzaMissatge('Grafica descarregada correctament.', 'info');
}

console.log('[export.js] carregat');
