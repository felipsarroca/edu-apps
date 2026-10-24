import { ETAPES } from './dades/etapes.js';
import { FONTS_PRIMARIES, FONTS_SECUNDARIES, NOTES } from './dades/fonts.js';
import { creaMapa } from './mapa.js';
import { creaMarcador, diaDe } from './marcador.js';
import { creaTargeta } from './targeta.js';
import { creaCronologia } from './cronologia.js';
import { escapa, espera } from './util.js';

const LECTURA_AUTO = 9000;
const ULTIMA = ETAPES.length - 1;

const $ = (s) => document.querySelector(s);
const app = $('.app');
const elTargeta = $('#targeta');
const elIntro = $('#intro');

const estat = { index: 0, ocupat: false, auto: false, temporitzador: null };
const ampla = window.matchMedia('(min-width: 900px)');

/** Espai que ocupen els panells sobre el mapa (i el vaixell, que sobresurt per dalt), perquè l'enquadrament quedi a la part visible. */
function padding() {
  const marcador = $('#marcador').getBoundingClientRect();
  const crono = $('#cronologia').getBoundingClientRect();
  const targeta = elTargeta.getBoundingClientRect();
  if (ampla.matches) {
    return {
      topLeft: [40, marcador.bottom + 60],
      bottomRight: [window.innerWidth - targeta.left + 40, window.innerHeight - crono.top + 30],
    };
  }
  return {
    topLeft: [24, marcador.bottom + 56],
    bottomRight: [24, window.innerHeight - targeta.top + 20],
  };
}

const mapa = creaMapa($('#mapa'), { padding, onEtapa: (i) => vesA(i) });
const marcador = creaMarcador($('#marcador'));
const targeta = creaTargeta(elTargeta, {
  onAnterior: () => vesA(estat.index - 1),
  onSeguent: () => { aturaAuto(); seguent(); },
});
const cronologia = creaCronologia($('#cronologia'), {
  onEtapa: (i) => vesA(i),
  onPlay: () => (estat.auto ? aturaAuto() : iniciaAuto()),
});

function pinta(index, { focus = false } = {}) {
  estat.index = index;
  marcador.actualitza(index);
  targeta.mostra(index);
  cronologia.actualitza(index);
  history.replaceState(null, '', `#${ETAPES[index].id}`);
  if (focus) targeta.focus();
}

/** Salta directament a una etapa, sense animar el viatge. */
async function vesA(index, { aturar = true } = {}) {
  if (estat.ocupat || index < 0 || index > ULTIMA) return;
  if (aturar) aturaAuto();
  pinta(index);
  await mapa.mostra(index);
}

/** Navega fins a l'etapa següent amb l'animació del vaixell. */
async function seguent() {
  if (estat.ocupat) return;
  if (estat.index === ULTIMA) return vesA(0);
  const desti = estat.index + 1;
  if (ETAPES[desti].epileg) return vesA(desti, { aturar: false });

  estat.ocupat = true;
  app.classList.add('navegant');
  elTargeta.dataset.desti = `Navegant cap a ${ETAPES[desti].lloc}…`;
  const diaInici = marcador.dia;
  const diaFi = diaDe(ETAPES[desti]);
  try {
    await mapa.viatja(desti, (t) => marcador.avanca(diaInici, diaFi, t));
  } finally {
    estat.ocupat = false;
    app.classList.remove('navegant');
  }
  pinta(desti, { focus: true });
}

function aturaAuto() {
  estat.auto = false;
  clearTimeout(estat.temporitzador);
  cronologia.enReproduccio(false);
}

async function cicleAuto() {
  if (!estat.auto) return;
  if (estat.index === ULTIMA) return aturaAuto();
  await seguent();
  // A les etapes amb decisió el viatge s'atura: és el moment de debatre.
  if (!estat.auto || ETAPES[estat.index].decisio || estat.index === ULTIMA) return aturaAuto();
  estat.temporitzador = setTimeout(cicleAuto, LECTURA_AUTO);
}

function iniciaAuto() {
  estat.auto = true;
  cronologia.enReproduccio(true);
  cicleAuto();
}

// --- Introducció i fonts ---

function tancaIntro() {
  elIntro.classList.add('tancant');
  app.inert = false;
  espera(450).then(() => { elIntro.hidden = true; elIntro.classList.remove('tancant'); });
  mapa.mostra(estat.index);
  targeta.focus();
}

function obreIntro() {
  aturaAuto();
  document.documentElement.classList.remove('sense-intro');
  elIntro.hidden = false;
  app.inert = true;
  $('#salpa').focus();
}

$('#salpa').addEventListener('click', tancaIntro);
$('#boto-inici').addEventListener('click', obreIntro);

const dialegFonts = $('#fonts');
const llista = (items) => `<ul>${items.map((t) => `<li>${escapa(t)}</li>`).join('')}</ul>`;
dialegFonts.querySelector('.f-contingut').innerHTML = `
  <h3>Fonts primàries</h3>${llista(FONTS_PRIMARIES)}
  <h3>Fonts secundàries</h3>${llista(FONTS_SECUNDARIES)}
  <h3>Com llegir aquesta app</h3>${llista(NOTES)}`;
document.querySelectorAll('[data-obre-fonts]').forEach((b) => b.addEventListener('click', () => dialegFonts.showModal()));
dialegFonts.querySelector('.f-tanca').addEventListener('click', () => dialegFonts.close());
dialegFonts.addEventListener('click', (ev) => { if (ev.target === dialegFonts) dialegFonts.close(); });

// --- Teclat ---

document.addEventListener('keydown', (ev) => {
  if (!elIntro.hidden || dialegFonts.open || ev.altKey || ev.ctrlKey || ev.metaKey) return;
  const enControl = ev.target.closest('button, a, input, textarea, select');
  if (ev.key === 'ArrowRight') { ev.preventDefault(); aturaAuto(); seguent(); }
  else if (ev.key === 'ArrowLeft') { ev.preventDefault(); vesA(estat.index - 1); }
  else if (ev.key === ' ' && !enControl) { ev.preventDefault(); estat.auto ? aturaAuto() : iniciaAuto(); }
});

let redimensio;
window.addEventListener('resize', () => {
  clearTimeout(redimensio);
  redimensio = setTimeout(() => mapa.enquadra(estat.index, false), 200);
});

// --- Inici ---

const desdeEnllac = ETAPES.findIndex((e) => `#${e.id}` === location.hash);
pinta(Math.max(0, desdeEnllac));
mapa.mostra(estat.index, false);
if (desdeEnllac > 0) {
  elIntro.hidden = true;
} else {
  app.inert = true;
}
