import {
  inicialitzaUI,
  ompleSelectorExemples,
  onAnalitza,
  actualitzaMissatge,
  obtenirEnunciat,
  setAnalitzaDeshabilitat,
  mostraResultats,
  netejaResultats,
  onRestableix
} from './ui.js';
import { calculaCronologia } from './physics.js';
import {
  inicialitzaCharts,
  actualitzaCharts,
  configuraControlsZoom,
  reiniciaZoom
} from './draw.js';
import { configuraExportacions, estableixDisponibilitatExport } from './export.js';
import './storage.js';
import './api.js';
import { SAMPLE_PROBLEMS } from '../data/sampleProblems.js';

const estat = {
  exempleSeleccionat: null
};

function arrencaAplicacio() {
  inicialitzaUI();
  inicialitzaCharts();
  configuraControlsZoom();
  configuraExportacions();
  estableixDisponibilitatExport(false);
  netejaResultats();

  ompleSelectorExemples(SAMPLE_PROBLEMS, (exemple) => {
    estat.exempleSeleccionat = exemple;
  });

  onAnalitza(gestionaAnalisi);
  onRestableix(() => {
    estat.exempleSeleccionat = null;
    actualitzaCharts({ temps: [], series: [] });
    reiniciaZoom();
    estableixDisponibilitatExport(false);
  });

  console.log('[app.js] aplicacio inicialitzada');
}

async function gestionaAnalisi() {
  const enunciat = obtenirEnunciat();
  if (!enunciat) {
    actualitzaMissatge('Cal introduir un enunciat o carregar un exemple abans d\'analitzar.', 'error');
    return;
  }

  setAnalitzaDeshabilitat(true);
  actualitzaMissatge('Processant l\'enunciat. Preparant resultats...', 'info');

  try {
    const resposta = await obtenirResultatTemporal(enunciat);
    if (!resposta) {
      actualitzaMissatge('Encara no hi ha IA activa. Selecciona un dels exemples per veure el funcionament.', 'error');
      netejaResultats();
      reiniciaZoom();
      estableixDisponibilitatExport(false);
      return;
    }

    mostraResultats(resposta.mobils);
    const cronologia = calculaCronologia(resposta.mobils);
    reiniciaZoom();
    actualitzaCharts(cronologia);
    estableixDisponibilitatExport(true);

    const titol = estat.exempleSeleccionat?.titol ?? 'exemple proporcionat';
    actualitzaMissatge(`Resultats generats a partir de "${titol}".`, 'info');
  } catch (error) {
    console.error('[app.js] Error durant l\'analisi', error);
    actualitzaMissatge('Hi ha hagut un problema inesperat en processar l\'enunciat.', 'error');
  } finally {
    setAnalitzaDeshabilitat(false);
  }
}

async function obtenirResultatTemporal(enunciat) {
  const net = enunciat.trim().toLowerCase();

  if (
    estat.exempleSeleccionat &&
    estat.exempleSeleccionat.enunciat.trim().toLowerCase() === net
  ) {
    return estat.exempleSeleccionat.resposta;
  }

  const coincidencia = SAMPLE_PROBLEMS.find(
    (exemple) => exemple.enunciat.trim().toLowerCase() === net
  );
  return coincidencia?.resposta ?? null;
}

document.addEventListener('DOMContentLoaded', arrencaAplicacio);
