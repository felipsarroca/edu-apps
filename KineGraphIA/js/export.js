import { obtenirBotonsExport, actualitzaMissatge } from './ui.js';
import { obtenirCharts } from './draw.js';

let botoExport = null;

export function configuraExportacions() {
  botoExport = obtenirBotonsExport();
  botoExport?.addEventListener('click', exportar);
}

export function estableixDisponibilitatExport(disponible) {
  botoExport ??= obtenirBotonsExport();
  if (!botoExport) return;
  botoExport.disabled = !disponible;
}

function exportar() {
  const info = obtenirCharts();
  const chart = info?.chart;
  const mode = info?.mode ?? 'position';

  if (!chart) {
    actualitzaMissatge('Encara no hi ha dades per exportar.', 'error');
    return;
  }

  let imatge;
  try {
    imatge = chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });
  } catch (error) {
    console.error('[export.js] Error generant la imatge', error);
    actualitzaMissatge('No s\'ha pogut generar la imatge de la gr\u00E0fica.', 'error');
    return;
  }

  if (!imatge) {
    actualitzaMissatge('No s\'ha pogut generar la imatge de la gr\u00E0fica.', 'error');
    return;
  }

  const enllac = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  enllac.href = imatge;
  enllac.download = `kinegraphia-${mode}-${timestamp}.png`;
  enllac.click();
  actualitzaMissatge('Gr\u00E0fica descarregada correctament.', 'info');
}

console.log('[export.js] carregat');