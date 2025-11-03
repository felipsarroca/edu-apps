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

const FALLBACK_PROBLEMS = [
  {
    titol: "Cotxes en MRU i MRUA",
    enunciat: "Dos cotxes parteixen alhora. El primer surt del repòs i accelera 2 m/s². El segon manté una velocitat constant de 10 m/s.",
    resposta: {
      mobils: [
        { nom: "Cotxe A", tipus: "MRUA", v0: 0, a: 2, s0: 0, t: 14 },
        { nom: "Cotxe B", tipus: "MRU", v0: 10, a: 0, s0: 0, t: 14 }
      ]
    }
  },
  {
    titol: "Trens que coincideixen",
    enunciat: "Un tren surt del repòs amb acceleració 1.5 m/s² durant 8 segons. Un altre tren circula a 12 m/s constants i es vol comparar el moviment durant 12 segons.",
    resposta: {
      mobils: [
        { nom: "Tren A", tipus: "MRUA", v0: 0, a: 1.5, s0: 0, t: 12 },
        { nom: "Tren B", tipus: "MRU", v0: 12, a: 0, s0: 0, t: 12 }
      ]
    }
  },
  {
    titol: "Caiguda lliure de dues boles",
    enunciat: "Llancem dues boles des d’una torre de 20 metres. La primera la deixem caure des del repòs. La segona la llencem cap avall amb velocitat inicial de 5 m/s. Compara-les durant 3 segons.",
    resposta: {
      mobils: [
        { nom: "Bola 1", tipus: "CAIGUDA", v0: 0, s0: 20, g: 9.81, t: 3 },
        { nom: "Bola 2", tipus: "CAIGUDA", v0: -5, s0: 20, g: 9.81, t: 3 }
      ]
    }
  },
  {
    titol: "Pilota en tir vertical",
    enunciat: "Llancem una pilota cap amunt amb velocitat inicial de 18 m/s des d’una alçada de 1.5 m. Analitzem els primers 6 segons.",
    resposta: {
      mobils: [
        { nom: "Pilota", tipus: "TIR_VERTICAL", v0: 18, s0: 1.5, g: 9.81, t: 6 }
      ]
    }
  },
  {
    titol: "Triple duel de corredors",
    enunciat: "Tres atletes surten de la mateixa línia. El primer fa un MRU a 6 m/s, el segon accelera 0.8 m/s² des del repòs, i el tercer surt amb 3 m/s i accelera 0.4 m/s². Observa’ls durant 18 segons.",
    resposta: {
      mobils: [
        { nom: "Corredor A", tipus: "MRU", v0: 6, a: 0, s0: 0, t: 18 },
        { nom: "Corredor B", tipus: "MRUA", v0: 0, a: 0.8, s0: 0, t: 18 },
        { nom: "Corredor C", tipus: "MRUA", v0: 3, a: 0.4, s0: 0, t: 18 }
      ]
    }
  },
  {
    titol: "Tir parabòlic de pilota",
    enunciat: "Una pilota es dispara amb velocitat inicial de 22 m/s amb un angle de 40° respecte l’horitzontal. Analitza el moviment vertical durant 4.5 segons.",
    resposta: {
      mobils: [
        { nom: "Pilota parabòlica", tipus: "TIR_PARABOLIC", v0: 22, angle: 40, s0: 0, g: 9.81, t: 4.5 }
      ]
    }
  }
];

const PROBLEMES_DISPONIBLES =
  Array.isArray(SAMPLE_PROBLEMS) && SAMPLE_PROBLEMS.length ? SAMPLE_PROBLEMS : FALLBACK_PROBLEMS;
if (PROBLEMES_DISPONIBLES === FALLBACK_PROBLEMS) {
  console.warn("[app.js] No s'ha pogut carregar data/sampleProblems.js; s'utilitzen exemples per defecte.");
}
console.log('[app.js] Exemples disponibles:', PROBLEMES_DISPONIBLES);

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

  ompleSelectorExemples(PROBLEMES_DISPONIBLES, (exemple) => {
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

  const coincidencia = PROBLEMES_DISPONIBLES.find(
    (exemple) => exemple.enunciat.trim().toLowerCase() === net
  );
  return coincidencia?.resposta ?? null;
}

document.addEventListener('DOMContentLoaded', arrencaAplicacio);
