const STORAGE_KEY = 'missio-eclipsi-2026-v1';
const TOTALITY_START = new Date('2026-08-12T20:29:30+02:00');
const TOTALITY_END = new Date('2026-08-12T20:30:47+02:00');

const checklistGroups = [
  {
    title: 'Observació i documents', icon: '◐', items: [
      ['ulleres', '4 ulleres d’eclipsi verificades (3 + 1 recanvi)'],
      ['funda', 'Funda rígida per a les ulleres'],
      ['dossiers', 'Dossier i quaderns impresos'],
      ['llapis', 'Llapis, bolígrafs i carpeta rígida'],
      ['documents', 'DNI, permís, vehicle i targetes sanitàries'],
      ['mapes', 'Mòbil amb mapes offline i pins desats'],
      ['bateries', '2 bateries externes i cables']
    ]
  },
  {
    title: 'Calor i comoditat', icon: '☀', items: [
      ['cadira', 'Cadira de platja i 2 tatamis'],
      ['taula', 'Taula plegable'],
      ['para-sol', 'Para-sol estable i para-sols del cotxe'],
      ['gorres', 'Gorres, crema solar i ulleres de sol'],
      ['manta-base', 'Manta vella sota els tatamis'],
      ['draps', 'Tovalloles o draps humits']
    ]
  },
  {
    title: 'Menjar i aigua', icon: '●', items: [
      ['nevera', 'Nevera i acumuladors congelats'],
      ['aigua', '8–9 L d’aigua + beguda isotònica'],
      ['menjar', 'Dinar, berenar, sopar fred i snacks'],
      ['cafe', 'Termo amb cafè per després del descans'],
      ['higiene', 'Paper, tovalloletes, gel i bosses']
    ]
  },
  {
    title: 'Nit i descans', icon: '✦', items: [
      ['llum-vermella', 'Fanalet i llanterna amb llum vermella'],
      ['mantes', '3 mantes lleugeres'],
      ['abric', 'Dessuadores o màniga llarga'],
      ['repellent', 'Repel·lent de mosquits'],
      ['coixi', 'Coixí petit per al conductor'],
      ['farmaciola', 'Farmaciola i medicació habitual']
    ]
  },
  {
    title: 'Cotxe i emergència', icon: '◆', items: [
      ['diposit', 'Dipòsit ple'],
      ['revisio-cotxe', 'Pneumàtics, llums i líquids revisats'],
      ['armilla', 'Armilla accessible des de l’habitacle'],
      ['v16', 'Balisa V16 connectada i certificada'],
      ['carregador', 'Carregador de cotxe'],
      ['claus', 'Còpia de claus separada, si n’hi ha'],
      ['jocs', 'Jocs, còmics i bossa per a peces petites']
    ]
  }
];

const schedule = [
  ['09.00', 'Sortida del Prat', 'Trajecte directe amb dipòsit ple.'],
  ['10.45–11.15', 'Parada curta', 'Lavabo, estirar les cames i continuar.'],
  ['12.30–13.30', 'Arribada', 'Aparcar on indiquin i guardar la ubicació del cotxe.'],
  ['13.00–14.00', 'Dinar', 'Menjar portat, ombra i hidratació.'],
  ['14.00–17.30', 'Espera protegida', 'Activitat tranquil·la i descans conjunt.'],
  ['17.30–18.15', 'Berenar i lavabo', 'Preparar la motxilla lleugera.'],
  ['18.15', 'Recollir la base', 'Taula, nevera gran i para-sol, al cotxe.'],
  ['18.45', 'Anar a la zona', 'Aigua, cadires, ulleres i quaderns.'],
  ['19.15', 'Posicions finals', 'Tots tres junts i horitzó oest-nord-oest lliure.'],
  ['19.35.34', 'Comença la parcialitat', 'Ulleres segures sempre.', true],
  ['20.25', 'S’acaben les mesures', 'Mòbil fix o guardat. Només observar.', true],
  ['20.29.30', 'Comença la totalitat', 'Ulleres fora només quan la cobertura és total.', true],
  ['20.30.47', 'Torna la llum', 'Ulleres posades abans del primer punt de Sol.', true],
  ['Cap a 21.00', 'Posta, sopar i descans', 'Deixar passar la primera onada de vehicles.'],
  ['22.00–23.30', 'Decisió de tornada', 'El conductor i les condicions decideixen, no el rellotge.']
];

const scheduleMoments = [
  '2026-08-12T09:00:00+02:00', '2026-08-12T10:45:00+02:00', '2026-08-12T12:30:00+02:00',
  '2026-08-12T13:00:00+02:00', '2026-08-12T14:00:00+02:00', '2026-08-12T17:30:00+02:00',
  '2026-08-12T18:15:00+02:00', '2026-08-12T18:45:00+02:00', '2026-08-12T19:15:00+02:00',
  '2026-08-12T19:35:34+02:00', '2026-08-12T20:25:00+02:00', '2026-08-12T20:29:30+02:00',
  '2026-08-12T20:30:47+02:00', '2026-08-12T21:00:00+02:00', '2026-08-12T22:00:00+02:00'
];

const duringExperiences = [
  ['mossegada', '🌘', 'La Lluna “mossega” el Sol'],
  ['mitges-llunes', '◔', 'Projeccions en forma de mitja lluna'],
  ['llum-estranya', '◑', 'Llum i colors estranys'],
  ['ombres-fortes', '◩', 'Ombres més nítides'],
  ['fresca', '❄', 'Sensació de fresca'],
  ['vent', '≈', 'Canvi de vent'],
  ['sons', '♪', 'Canvi de sons o animals'],
  ['ombres-volants', '≋', 'Ombres volants al llençol']
];

const totalityExperiences = [
  ['baily', '•••', 'Perles de Baily'],
  ['diamant', '◆', 'Anell de diamant'],
  ['corona', '☼', 'Corona solar'],
  ['rosa', '●', 'Vora o punts rosats'],
  ['horitzo', '◯', 'Claror a l’horitzó'],
  ['venus', '✦', 'Venus'],
  ['estrelles', '⋆', 'Altres estrelles'],
  ['no-se', '?', 'No n’estic segur/a']
];

const memoryWords = ['INCREÏBLE', 'FOSC', 'RÀPID', 'BONIC', 'ESTRANY', 'DAURAT', 'EMOCIONANT', 'SILENCIÓS'];

const understandingItems = [
  ['alineacio', '◐', 'La Lluna es posa entre el Sol i la Terra'],
  ['totalitat', '●', 'El 100% de totalitat és molt diferent del 99,9%'],
  ['seguretat', '◉', 'A la fase parcial calen ulleres d’eclipsi'],
  ['temperatura', '❄', 'L’ombra i la temperatura poden canviar'],
  ['perseides', '☄', 'Les Perseides són pols del cometa Swift-Tuttle']
];

let fiveYearQuestions = [];
let questionBankError = '';

const defaultYoungState = {
  profileName: 'Perfil 1',
  reportDate: '2026-08-12',
  reportLocation: 'Móra la Nova',
  predictedDrop: 3,
  predictedDark: 'de-cop',
  predictedHighlight: 'corona',
  beforeTemp: 34,
  lowestTemp: 30,
  lightLevel: 3,
  windLevel: 1,
  experiences: {},
  totality: {},
  understanding: {},
  memories: [],
  meteorCount: 0,
  meteorBrightness: 3,
  skyCondition: 'serè',
  sectionComplete: {},
  touched: {}
};

const defaultState = {
  checklist: {},
  adult: { perseidGate: {}, lastExternalCheck: '' },
  activeYoungProfile: 'perfil-1',
  youngProfiles: {},
  young: structuredClone(defaultYoungState),
  kidsHistory: { roundsPlayed: 0, bestScore: 0 },
  settings: { kidsEffects: true },
  kids5: {
    phase: 'intro',
    roundIds: [],
    currentIndex: 0,
    firstAnswers: {},
    optionOrders: {},
    retryIds: [],
    retryIndex: 0,
    currentChoice: null,
    corrected: [],
    roundNumber: 0
  }
};

function normaliseObservationMap(values = {}) {
  return Object.fromEntries(Object.entries(values).flatMap(([id, value]) => {
    if (value === true) return [[id, 'seen']];
    if (['seen', 'not-seen', 'unchecked'].includes(value)) return [[id, value]];
    return [];
  }));
}

function mergeYoungState(source = {}, profileNumber = 1) {
  return {
    ...structuredClone(defaultYoungState),
    ...source,
    profileName: source.profileName || `Perfil ${profileNumber}`,
    experiences: normaliseObservationMap(source.experiences),
    totality: normaliseObservationMap(source.totality),
    understanding: { ...defaultYoungState.understanding, ...(source.understanding || {}) },
    sectionComplete: { ...defaultYoungState.sectionComplete, ...(source.sectionComplete || {}) },
    touched: { ...defaultYoungState.touched, ...(source.touched || {}) },
    memories: Array.isArray(source.memories) ? source.memories : []
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const activeYoungProfile = saved.activeYoungProfile || 'perfil-1';
    const profileNumber = Number(activeYoungProfile.split('-').at(-1)) || 1;
    const savedProfiles = saved.youngProfiles && typeof saved.youngProfiles === 'object' ? saved.youngProfiles : {};
    const young = mergeYoungState(savedProfiles[activeYoungProfile] || saved.young || {}, profileNumber);
    return {
      ...defaultState,
      ...saved,
      checklist: { ...defaultState.checklist, ...(saved.checklist || {}) },
      adult: {
        ...defaultState.adult,
        ...(saved.adult || {}),
        perseidGate: { ...defaultState.adult.perseidGate, ...(saved.adult?.perseidGate || {}) }
      },
      activeYoungProfile,
      youngProfiles: { ...savedProfiles, [activeYoungProfile]: young },
      young,
      kidsHistory: { ...defaultState.kidsHistory, ...(saved.kidsHistory || {}) },
      settings: { ...defaultState.settings, ...(saved.settings || {}) },
      kids5: ['intro', 'question', 'summary', 'retry', 'final'].includes(saved.kids5?.phase)
        ? {
            ...defaultState.kids5,
            ...saved.kids5,
            firstAnswers: { ...defaultState.kids5.firstAnswers, ...(saved.kids5.firstAnswers || {}) },
            optionOrders: { ...defaultState.kids5.optionOrders, ...(saved.kids5.optionOrders || {}) },
            roundIds: Array.isArray(saved.kids5.roundIds) ? saved.kids5.roundIds : [],
            retryIds: Array.isArray(saved.kids5.retryIds) ? saved.kids5.retryIds : [],
            corrected: Array.isArray(saved.kids5.corrected) ? saved.kids5.corrected : []
          }
        : structuredClone(defaultState.kids5)
    };
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadState();
let adultTab = 'avui';
let youngTab = 'abans';
let adultTimelineExpanded = false;
let checklistPendingOnly = false;
const openChecklistGroups = new Set([checklistGroups[0].title]);
let deferredInstallPrompt = null;
let toastTimer = null;
let offlineReady = false;

const app = document.querySelector('#app');
const installButton = document.querySelector('#install-button');
const installDialog = document.querySelector('#install-dialog');
const imageDialog = document.querySelector('#image-dialog');
const imageDialogImage = imageDialog.querySelector('img');
const imageDialogCaption = imageDialog.querySelector('p');
const toast = document.querySelector('#toast');

function saveState() {
  state.youngProfiles[state.activeYoungProfile] = structuredClone(state.young);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function switchYoungProfile(profileId) {
  saveState();
  const profileNumber = Number(profileId.split('-').at(-1)) || 1;
  state.activeYoungProfile = profileId;
  state.young = mergeYoungState(state.youngProfiles[profileId] || {}, profileNumber);
  saveState();
}

async function loadQuestionBank() {
  const response = await fetch('./data/preguntes-infantils.json');
  if (!response.ok) throw new Error(`No s’ha pogut carregar el banc (${response.status}).`);
  const bank = await response.json();
  const valid = Array.isArray(bank)
    && bank.length === 90
    && new Set(bank.map(question => question.id)).size === bank.length
    && bank.every(question =>
      typeof question.id === 'string'
      && typeof question.question === 'string'
      && Array.isArray(question.options)
      && question.options.length >= 2
      && question.options.length <= 3
      && question.options.every(option => typeof option.icon === 'string' && typeof option.label === 'string')
      && Number.isInteger(question.correct)
      && question.correct >= 0
      && question.correct < question.options.length
    );
  if (!valid) throw new Error('El banc infantil no té l’estructura esperada.');
  fiveYearQuestions = bank;
  const validIds = new Set(bank.map(question => question.id));
  if (state.kids5.roundIds.some(id => !validIds.has(id)) || state.kids5.roundIds.length > 5) {
    state.kids5 = structuredClone(defaultState.kids5);
    saveState();
  }
}

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swapWith = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }
  return copy;
}

function startKidsRound() {
  const roundIds = shuffled(fiveYearQuestions.map(question => question.id)).slice(0, 5);
  const optionOrders = Object.fromEntries(roundIds.map(id => {
    const question = kidsQuestionById(id);
    return [id, shuffled(question.options.map((_, optionIndex) => optionIndex))];
  }));
  state.kids5 = {
    ...structuredClone(defaultState.kids5),
    phase: 'question',
    roundIds,
    optionOrders,
    roundNumber: (state.kids5.roundNumber || 0) + 1
  };
  saveState();
}

function kidsQuestionById(id) {
  return fiveYearQuestions.find(question => question.id === id);
}

function kidsRoundStats() {
  const total = state.kids5.roundIds.length || 5;
  const correctIds = state.kids5.roundIds.filter(id => {
    const question = kidsQuestionById(id);
    return question && state.kids5.firstAnswers[id] === question.correct;
  });
  const errorIds = state.kids5.roundIds.filter(id => !correctIds.includes(id));
  const correct = correctIds.length;
  const errors = errorIds.length;
  return {
    total,
    correct,
    errors,
    correctIds,
    errorIds,
    correctPercent: Math.round(correct / total * 100),
    errorPercent: Math.round(errors / total * 100)
  };
}

function playKidFeedback(correct) {
  if (!state.settings.kidsEffects) return;
  if (navigator.vibrate) navigator.vibrate(correct ? 45 : [70, 45, 70]);
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = correct ? 660 : 220;
    gain.gain.setValueAtTime(.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .14);
    oscillator.connect(gain).connect(context.destination);
    oscillator.addEventListener('ended', () => context.close());
    oscillator.start();
    oscillator.stop(context.currentTime + .15);
  } catch { /* El joc continua encara que el dispositiu bloquegi l’àudio. */ }
}

function route() {
  const value = location.hash.replace('#', '') || 'inici';
  return ['inici', 'adults', 'joves', 'infants'].includes(value) ? value : 'inici';
}

function setRoute(next) {
  if (route() === next) render();
  else location.hash = next;
}

function updateNavigation() {
  document.querySelectorAll('[data-route]').forEach(button => {
    if (button.closest('.bottom-nav')) {
      if (button.dataset.route === route()) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function focusSoon(selector) {
  requestAnimationFrame(() => document.querySelector(selector)?.focus({ preventScroll: true }));
}

function openLightbox(trigger) {
  const source = trigger.querySelector('img');
  if (!source) return;
  imageDialogImage.src = source.currentSrc || source.src;
  imageDialogImage.alt = source.alt;
  imageDialogCaption.textContent = trigger.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
  imageDialog.showModal();
  imageDialog.querySelector('.image-dialog-close').focus();
}

function exportYoungData() {
  const data = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    profileId: state.activeYoungProfile,
    profile: state.young
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = state.young.profileName.toLocaleLowerCase('ca').replace(/[^a-z0-9à-ÿ]+/gi, '-').replace(/^-|-$/g, '') || 'perfil';
  link.href = url;
  link.download = `cronica-eclipsi-${safeName}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  showToast('Dades de la crònica exportades.');
}

function formatCountdown(now = new Date()) {
  const diff = TOTALITY_START - now;
  if (now >= TOTALITY_START && now <= TOTALITY_END) return 'ARA · 77 SEGONS DE TOTALITAT';
  if (diff <= 0) return 'TOTALITAT VISCUTA · DESA’N EL RECORD';
  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${days ? `${days} d · ` : ''}${String(hours).padStart(2, '0')} h · ${String(minutes).padStart(2, '0')} min · ${String(secs).padStart(2, '0')} s`;
}

function updateCountdown() {
  const element = document.querySelector('#live-countdown');
  if (element) element.textContent = formatCountdown();
  const label = document.querySelector('#countdown-label');
  if (label) label.textContent = new Date() > TOTALITY_END ? 'Record de la totalitat' : 'Fins a la totalitat';
}

function currentOperationalStep() {
  const now = new Date();
  const points = [
    ['2026-08-12T08:45:00+02:00', 'Comprovació final', 'Meteocat, trànsit, avisos de Móra i Pla Alfa.'],
    ['2026-08-12T09:00:00+02:00', 'Sortida del Prat', 'Trajecte directe. No afegiu visites.'],
    ['2026-08-12T12:30:00+02:00', 'Arribada objectiu', 'Seguiu l’aparcament i les indicacions oficials.'],
    ['2026-08-12T17:30:00+02:00', 'Berenar i lavabo', 'Prepareu la motxilla lleugera.'],
    ['2026-08-12T18:15:00+02:00', 'Recolliu la base', 'Guardeu taula, nevera gran, para-sol i peces soltes.'],
    ['2026-08-12T19:15:00+02:00', 'Posicions finals', 'Tots tres junts i horitzó comprovat.'],
    ['2026-08-12T20:25:00+02:00', 'Deixeu d’escriure', 'Ulleres preparades. Mòbil fix o guardat.'],
    ['2026-08-12T20:29:30+02:00', 'Totalitat', 'Només mirar. Ulleres fora quan el Sol estigui completament cobert.'],
    ['2026-08-12T20:30:47+02:00', 'Ulleres posades', 'Primer punt de Sol: protecció immediata.'],
    ['2026-08-12T21:00:00+02:00', 'Sopar i descans', 'No sortiu amb la primera onada de vehicles.'],
    ['2026-08-12T22:00:00+02:00', 'Decisió de retorn', 'Perseides només amb les cinc condicions verdes.'],
    ['2026-08-12T23:30:00+02:00', 'Retorn segur', 'Atureu-vos davant del primer senyal de son.']
  ];
  if (now < new Date(points[0][0])) return ['Abans de sortir', 'Reviseu ulleres, carregueu bateries, refredeu aigua i descarregueu els mapes.'];
  let selected = points[0];
  for (const point of points) if (now >= new Date(point[0])) selected = point;
  return [selected[1], selected[2]];
}

const imageDimensions = {
  'diagrama-eclipsi.webp': [1100, 604],
  'orbita-inclinada.webp': [1100, 733],
  'seguretat-observacio.webp': [1100, 1100],
  'totalitat-100.webp': [1100, 733],
  'horitzo-47.webp': [1100, 604],
  'fenomens-totalitat.webp': [1100, 664],
  'experiment-colador.webp': [1100, 1100],
  'ombres-volants.webp': [1100, 1100],
  'laboratori-camp.webp': [1100, 733],
  'orbita-swift-tuttle.webp': [1100, 733],
  'meteor-atmosfera.webp': [1100, 733],
  'guia-perseides.webp': [1100, 733]
};

function zoomableVisual(filename, alt, caption, classes = '') {
  const [width, height] = imageDimensions[filename] || [1100, 733];
  return `<figure class="visual-card ${classes}">
    <button class="image-zoom" type="button" data-lightbox aria-label="Amplia: ${alt}">
      <img src="assets/images/${filename}" alt="${alt}" width="${width}" height="${height}" loading="lazy" decoding="async">
      <span class="zoom-hint" aria-hidden="true">⛶ Amplia</span>
    </button>
    <figcaption>${caption}</figcaption>
  </figure>`;
}

function observationGrid(items, group) {
  return `<div class="observation-grid">${items.map(([id, icon, label]) => {
    const value = state.young[group][id] || 'unchecked';
    return `<article class="observation-card"><div class="observation-label"><span class="mini-icon" aria-hidden="true">${icon}</span><strong>${label}</strong></div><div class="tri-state" aria-label="Estat de ${label}">
      <button type="button" class="${value === 'seen' ? 'active seen' : ''}" data-observation="${group}" data-id="${id}" data-value="seen" aria-pressed="${value === 'seen'}">✓ Vist</button>
      <button type="button" class="${value === 'not-seen' ? 'active not-seen' : ''}" data-observation="${group}" data-id="${id}" data-value="not-seen" aria-pressed="${value === 'not-seen'}">× No vist</button>
      <button type="button" class="${value === 'unchecked' ? 'active unchecked' : ''}" data-observation="${group}" data-id="${id}" data-value="unchecked" aria-pressed="${value === 'unchecked'}">? No comprovat</button>
    </div></article>`;
  }).join('')}</div>`;
}

function youngStageProgress() {
  const stages = ['abans', 'durant', 'record', 'perseides'];
  const completed = stages.filter(stage => state.young.sectionComplete[stage]).length;
  return { completed, total: stages.length, percent: completed * 25 };
}

function stageCompletionButton(stage, nextStage, nextLabel) {
  const complete = !!state.young.sectionComplete[stage];
  return `<div class="stage-actions"><button class="primary-button stage-complete ${complete ? 'completed' : ''}" type="button" data-young-complete="${stage}" data-next-stage="${nextStage}">${complete ? '✓ Etapa completada' : 'He acabat aquesta etapa'} · ${nextLabel} →</button></div>`;
}

function youngProfileBar() {
  return `<section class="profile-bar" aria-label="Perfil de la crònica"><div><small>Crònica de</small><strong>${escapeHtml(state.young.profileName)}</strong></div><div class="profile-buttons">${[1, 2, 3].map(number => {
    const id = `perfil-${number}`;
    return `<button type="button" data-young-profile="${id}" aria-pressed="${state.activeYoungProfile === id}">${number}</button>`;
  }).join('')}</div></section>`;
}

function observationMode(now = new Date()) {
  const stopMeasures = new Date('2026-08-12T20:25:00+02:00');
  const endFocus = new Date('2026-08-12T20:31:30+02:00');
  if (now >= stopMeasures && now <= endFocus) return 'focus';
  return 'record';
}

function homePage() {
  return `
    <div class="page home-page">
      <section class="hero" aria-labelledby="home-title">
        <img src="assets/images/eclipsi-ribera-v2.webp" alt="Eclipsi total molt baix sobre el paisatge de la Ribera d’Ebre" width="1280" height="852" fetchpriority="high">
        <div class="hero-content">
          <span class="hero-kicker">12 d’agost de 2026 · Móra la Nova</span>
          <h1 id="home-title">El dia que el Sol s’apagarà</h1>
          <p>Una guia familiar, tres maneres de viure l’eclipsi i una nit curta de Perseides.</p>
          <div class="hero-facts" aria-label="Dades clau">
            <span>Parcial · 19.35.34</span><span>Totalitat · 20.29.30</span><span>Durada · 77 s</span>
          </div>
        </div>
      </section>

      <div class="countdown-card">
        <span class="countdown-orb" aria-hidden="true"></span>
        <div><small id="countdown-label">${new Date() > TOTALITY_END ? 'Record de la totalitat' : 'Fins a la totalitat'}</small><strong id="live-countdown" role="timer" aria-live="off">${formatCountdown()}</strong></div>
      </div>

      <div class="alert-card">
        <div class="alert-icon" aria-hidden="true">!</div>
        <div><h3>Regla d’or</h3><p>Durant tota la fase parcial, ulleres d’eclipsi segures. Només es retiren quan el Sol està completament cobert i es tornen a posar abans del primer punt de llum.</p></div>
      </div>

      <div class="section-heading"><div><p class="eyebrow">Tria la teva vista</p><h2>Tres nivells, una mateixa missió</h2></div></div>
      <section class="mode-grid" aria-label="Nivells de l’aplicació">
        <button class="mode-card" type="button" data-route="adults">
          <img src="assets/images/perseides-sant-jeroni.webp" alt="Família observant les Perseides en un indret rural" width="1280" height="853" loading="lazy">
          <span class="mode-card-content"><span class="mode-number">ADULTS</span><h3>Pla, equip i ubicacions</h3><p>Horari executable, checklist, mapes, seguretat i decisió de Perseides.</p></span>
        </button>
        <button class="mode-card" type="button" data-route="joves">
          <img src="assets/images/laboratori-eclipsi.webp" alt="Materials preparats per al laboratori de camp" width="1280" height="853" loading="lazy">
          <span class="mode-card-content"><span class="mode-number">10–12</span><h3>Missió científica tàctil</h3><p>Predir, marcar fenòmens, mesurar amb selectors i comptar meteors.</p></span>
        </button>
        <button class="mode-card" type="button" data-route="infants">
          <img src="assets/images/infantil-eclipsi-nena.webp" alt="Nena i adulta amb ulleres d’eclipsi sota l’alineació del Sol, la Lluna i la Terra" width="1023" height="1537" loading="lazy">
          <span class="mode-card-content"><span class="mode-number">5 ANYS</span><h3>Joc curt i visual</h3><p>Pantalles grans, paraules fàcils i una felicitació final.</p></span>
        </button>
      </section>

      <div class="section-heading"><div><p class="eyebrow">Per si falla la cobertura</p><h2>Documents originals</h2></div></div>
      <div class="quick-docs">
        <a class="quick-link" href="./2b. Dossier logístic - Eclipsi Solar Total 2026 (versió actualitzada).pdf" target="_blank">Dossier logístic</a>
        <a class="quick-link" href="./1f. Diari de Camp - Eclipsi Solar Total 2026 (versió per imprimir).pdf" target="_blank">Quadern imprimible</a>
        <a class="quick-link" href="https://interior.gencat.cat/ca/arees_dactuacio/agents-rurals/pla-alfa/" target="_blank" rel="noopener noreferrer">Pla Alfa</a>
      </div>
    </div>`;
}

function adultPage() {
  const tabs = [
    ['avui', 'Avui'], ['equip', 'Què portem'], ['llocs', 'On anem'], ['seguretat', 'Seguretat']
  ];
  return `
    <div class="page">
      <div class="page-head">
        <div><p class="eyebrow">Pla per a adults</p><h1 class="page-title">Tot a mà, sense improvisar</h1><p class="page-intro">La informació útil del dossier, ordenada per consultar-la amb una sola mà.</p></div>
      </div>
      <div class="tab-bar" aria-label="Apartats per a adults">
        ${tabs.map(([id, label]) => `<button id="adult-tab-${id}" class="tab-button ${adultTab === id ? 'active' : ''}" type="button" aria-pressed="${adultTab === id}" data-adult-tab="${id}">${label}</button>`).join('')}
      </div>
      ${adultTab === 'avui' ? adultToday() : adultTab === 'equip' ? adultEquipment() : adultTab === 'llocs' ? adultLocations() : adultSafety()}
    </div>`;
}

function adultToday() {
  const [title, description] = currentOperationalStep();
  const now = new Date();
  const nextIndex = scheduleMoments.findIndex(moment => now < new Date(moment));
  const currentIndex = nextIndex === -1 ? schedule.length - 1 : Math.max(0, nextIndex - 1);
  const windowStart = Math.max(0, Math.min(currentIndex - 1, schedule.length - 3));
  const visibleSchedule = adultTimelineExpanded
    ? schedule.map((item, index) => ({ item, index }))
    : schedule.slice(windowStart, windowStart + 3).map((item, offset) => ({ item, index: windowStart + offset }));
  const lastCheck = state.adult.lastExternalCheck
    ? new Intl.DateTimeFormat('ca', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(state.adult.lastExternalCheck))
    : 'Encara no registrada';
  return `
    <section class="next-card" aria-label="Pas operatiu actual">
      <small>Pas operatiu</small><h2>${title}</h2><p>${description}</p>
    </section>
    <div class="metric-grid">
      <article class="metric-card"><small>Arribada objectiu</small><strong>12.30–13.30</strong><p>Sense reserva: la millor defensa és arribar d’hora.</p></article>
      <article class="metric-card"><small>Totalitat</small><strong>76,7 s</strong><p>20.29.30–20.30.47.</p></article>
      <article class="metric-card"><small>Horitzó</small><strong>4,7°</strong><p>Sol molt baix a l’oest-nord-oest.</p></article>
    </div>
    <section class="panel live-checks">
      <div class="section-row"><div><p class="eyebrow">Informació variable</p><h2>Comprova-ho avui</h2></div><span class="last-check">Última comprovació: ${lastCheck}</span></div>
      <div class="live-link-grid">
        <a href="https://meteo.cat/prediccio/municipal/430944" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">☁</span>Meteocat</a>
        <a href="https://cit.transit.gencat.cat/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↔</span>Trànsit</a>
        <a href="https://interior.gencat.cat/ca/arees_dactuacio/agents-rurals/pla-alfa/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▲</span>Pla Alfa</a>
      </div>
      <button class="secondary-button" type="button" data-adult-checked>Ja ho he comprovat ara</button>
    </section>
    <section class="panel">
      <div class="section-row"><div><p class="eyebrow">Cronograma</p><h2>${adultTimelineExpanded ? 'El dia complet' : 'Ara i després'}</h2></div><button class="text-button" type="button" data-timeline-toggle>${adultTimelineExpanded ? 'Mostra menys' : 'Veure tot el dia'}</button></div>
      <div class="timeline">
        ${visibleSchedule.map(({ item: [time, title, copy, key], index }) => `
          <div class="timeline-item ${key ? 'key' : ''} ${index === currentIndex ? 'current' : ''}">
            <span class="timeline-time">${time}</span><span class="timeline-dot" aria-hidden="true"></span>
            <div class="timeline-copy"><strong>${title}</strong><span>${copy}</span></div>
          </div>`).join('')}
      </div>
    </section>
    <div class="alert-card">
      <div class="alert-icon" aria-hidden="true">☾</div>
      <div><h3>La tornada no té una hora rígida</h3><p>El moment correcte és el primer en què coincideixen conductor descansat, trànsit assumible i sortida segura. El cafè no substitueix el descans.</p></div>
    </div>`;
}

function adultEquipment() {
  const allItems = checklistGroups.flatMap(group => group.items);
  const done = allItems.filter(([id]) => state.checklist[id]).length;
  const percent = Math.round(done / allItems.length * 100);
  return `
    <section class="panel">
      <p class="eyebrow">Checklist interactiva</p><h2>Què cal portar</h2>
      <p>Marca-ho mentre carregues. El progrés queda desat en aquest telèfon.</p>
      <div class="progress-wrap">
        <div class="progress-label"><span>${done} de ${allItems.length} preparats</span><strong>${percent}%</strong></div>
        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="progress-bar" style="width:${percent}%"></div></div>
      </div>
      <div class="checklist-tools"><button class="filter-button ${checklistPendingOnly ? 'active' : ''}" type="button" data-pending-filter aria-pressed="${checklistPendingOnly}">${checklistPendingOnly ? '✓ Només pendents' : 'Mostra només pendents'}</button><span>${allItems.length - done} elements pendents</span></div>
      ${checklistGroups.map(group => {
        const isOpen = openChecklistGroups.has(group.title);
        const visibleItems = checklistPendingOnly ? group.items.filter(([id]) => !state.checklist[id]) : group.items;
        const pending = group.items.filter(([id]) => !state.checklist[id]).length;
        return `
        <section class="check-category">
          <button class="check-category-toggle" type="button" data-check-group="${group.title}" aria-expanded="${isOpen}"><span aria-hidden="true">${group.icon}</span><strong>${group.title}</strong><small>${pending} pendents</small><i aria-hidden="true">⌄</i></button>
          ${isOpen ? `<div class="check-list">${visibleItems.length ? visibleItems.map(([id, label]) => `<label class="check-row"><input type="checkbox" data-checklist="${id}" ${state.checklist[id] ? 'checked' : ''}><span>${label}</span></label>`).join('') : '<p class="empty-checklist">Tot preparat en aquesta categoria.</p>'}</div>` : ''}
        </section>`;
      }).join('')}
      <button class="reset-button" type="button" data-reset="checklist">Desmarca tota la checklist</button>
    </section>
    <div class="alert-card">
      <div class="alert-icon" aria-hidden="true">↔</div>
      <div><h3>Base gran ≠ motxilla</h3><p>Al cotxe: nevera, taula, para-sol i reserves. Amb vosaltres: ulleres, 3–4 L d’aigua, gorres, crema, quaderns, bateria i seients lleugers.</p></div>
    </div>`;
}

function adultLocations() {
  const gates = [
    ['access', 'El personal o l’autoritat local confirma que l’accés i l’estada són permesos.'],
    ['fire', 'Pla Alfa i avisos forestals permeten accedir-hi; cap barrera ni tancament.'],
    ['driver', 'El conductor està plenament despert i no sacrifica el descans de tornada.'],
    ['family', 'Els infants estan bé i tothom accepta una observació curta amb hora límit.'],
    ['route', 'El trànsit permet sortir i, en arribar, el lloc continua fosc, tranquil i segur.']
  ];
  const ready = gates.every(([id]) => state.adult.perseidGate[id]);
  return `
    <section class="panel location-card">
      <button class="location-image" type="button" data-lightbox aria-label="Amplia la vista de l’horitzó de l’eclipsi"><img src="assets/images/horitzo-47.webp" alt="Eclipsi total a 4,7 graus sobre l’horitzó oest, amb fletxes que indiquen un horitzó lliure" width="1100" height="604" loading="lazy"><span class="zoom-hint" aria-hidden="true">⛶ Amplia</span></button>
      <div class="location-content">
        <span class="location-badge">Punt oficial</span><h2>Eclipsi · Móra la Nova</h2>
        <p class="coordinates">Carrer Tortosa · 41.09764, 0.65294</p>
        <p>Punt publicat per a 3.800 persones i 1.500 vehicles. El pin orienta; la senyalització del dispositiu decideix l’accés final.</p>
        <a class="map-button" href="https://www.google.com/maps/dir/?api=1&destination=41.09764,0.65294" target="_blank" rel="noopener noreferrer">Obre la ruta a Móra la Nova ↗</a>
        <ul class="facts-list"><li>Arriba entre les 12.30 i les 13.30.</li><li>Segueix agents, panells i aparcaments habilitats.</li><li>Comprova un horitzó oest-nord-oest completament lliure.</li></ul>
      </div>
    </section>

    <section class="panel location-card">
      <button class="location-image" type="button" data-lightbox aria-label="Amplia la proposta visual del lloc per a les Perseides"><img src="assets/images/perseides-sant-jeroni.webp" alt="Família estirada observant Perseides en una àrea rural amb llum vermella" width="1280" height="853" loading="lazy"><span class="zoom-hint" aria-hidden="true">⛶ Amplia</span></button>
      <div class="location-content">
        <span class="location-badge proposal">Proposta condicionada</span><h2>Perseides · Sant Jeroni i Santa Madrona</h2>
        <p class="coordinates">Móra d’Ebre · 41.115968, 0.574147</p>
        <p>Àrea rural d’esbarjo a uns 7 km en línia recta del punt de l’eclipsi. Turisme de la Ribera d’Ebre indica accés per pista asfaltada i espai per deixar el vehicle.</p>
        <a class="map-button" href="https://www.google.com/maps/dir/?api=1&destination=41.115968,0.574147" target="_blank" rel="noopener noreferrer">Obre la ruta a Sant Jeroni ↗</a>
        <ul class="facts-list"><li>És una proposta, no un recinte nocturn oficial ni una reserva.</li><li>No surtis del ferm ni entris en pistes secundàries.</li><li>Cap foc, espelma ni fogonet; només llum vermella tènue.</li></ul>
      </div>
    </section>

    <section class="panel decision-panel ${ready ? 'ready' : ''}">
      <p class="eyebrow">Abans de moure el cotxe</p><h2>Les cinc llums verdes</h2>
      <p>El recinte de Móra anuncia música abans i després de l’eclipsi. El trasllat només es valora si totes cinc condicions són reals en aquell moment.</p>
      <div class="check-list">
        ${gates.map(([id, label]) => `<label class="check-row"><input type="checkbox" data-perseid-gate="${id}" ${state.adult.perseidGate[id] ? 'checked' : ''}><span>${label}</span></label>`).join('')}
      </div>
      <div class="decision-result"><span aria-hidden="true">${ready ? '✓' : '○'}</span>${ready ? 'Es pot valorar el trasllat. Si una condició canvia, abandoneu el pla.' : 'Encara no. Sense cinc llums verdes, les Perseides s’ajornen.'}</div>
    </section>

    <section class="panel">
      <p class="eyebrow">Comprova abans de sortir</p><h2>Enllaços oficials i de context</h2>
      <div class="link-grid">
        <a class="source-link" href="https://eclipsicatalunya.cat/punts-d-observacio/" target="_blank" rel="noopener noreferrer">Punts oficials · Eclipsi Catalunya</a>
        <a class="source-link" href="https://meteo.cat/prediccio/municipal/430944" target="_blank" rel="noopener noreferrer">Meteocat · Móra la Nova</a>
        <a class="source-link" href="https://cit.transit.gencat.cat/" target="_blank" rel="noopener noreferrer">Trànsit en temps real</a>
        <a class="source-link" href="https://interior.gencat.cat/ca/arees_dactuacio/agents-rurals/pla-alfa/" target="_blank" rel="noopener noreferrer">Pla Alfa</a>
        <a class="source-link" href="https://www.turismeriberaebre.org/ruta/la-picossa/" target="_blank" rel="noopener noreferrer">Accés oficial a Sant Jeroni</a>
        <a class="source-link" href="https://eclipse-inclusivo.ice.csic.es/eventos-sonificacion-eclipse-lightsound/" target="_blank" rel="noopener noreferrer">Programa i música del recinte</a>
      </div>
    </section>`;
}

function adultSafety() {
  return `
    ${zoomableVisual('seguretat-observacio.webp', 'Comparació: són segures les ulleres d’eclipsi i els instruments amb filtre solar frontal; són perillosos les ulleres de sol, vidres fumats, radiografies, l’ull nu i instruments sense filtre', 'Seguretat visual: ulleres homologades o projecció indirecta; mai ull nu ni instruments sense filtre.', 'visual-square')}
    <div class="safety-grid">
      <article class="panel safety-card warning"><h3>Ulleres d’eclipsi</h3><p><strong>Fase parcial:</strong> sempre posades. Rebutja qualsevol unitat ratllada, foradada, plegada o retirada del mercat.</p></article>
      <article class="panel safety-card sun"><h3>Només totalitat</h3><p>Retira-les només quan el Sol estigui completament cobert. Al primer punt intens, ulleres posades immediatament.</p></article>
      <article class="panel safety-card"><h3>Cap òptica sense filtre</h3><p>Les ulleres personals no protegeixen mirant per càmera, prismàtics o telescopi. Cal filtre solar frontal específic.</p></article>
      <article class="panel safety-card sun"><h3>Calor intensa</h3><p>Ombra, roba clara i aigua abans de tenir set. Mareig, nàusees, confusió o mal de cap intens: punt sanitari.</p></article>
      <article class="panel safety-card warning"><h3>Conductor únic</h3><p>Badalls, ulls pesants, errors o no recordar quilòmetres: no arrencar o aturar-se a la primera àrea segura.</p></article>
      <article class="panel safety-card"><h3>Si algú se separa</h3><p>L’altre infant es queda amb la persona adulta. Trucada, punt de trobada i avís immediat al personal.</p></article>
    </div>
    <section class="panel">
      <p class="eyebrow">Alertes recollides al dossier · 10.08.2026</p><h2>Models que no s’han d’utilitzar</h2>
      <p>Lionstar LSP1, ECP Eye Care Professional, Pelispan, Homanaje QW-50Z1, Orro O37-R lot 2603-01 i Opticalia GP0247. El marcatge ISO o CE, tot sol, no demostra l’origen ni anul·la una alerta concreta.</p>
      <a class="source-link" href="https://eclipse.aas.org/eye-safety/how-to-tell-if-viewers-are-safe" target="_blank" rel="noopener noreferrer">Com comprovar les ulleres · AAS</a>
    </section>
    <a class="emergency-link" href="tel:112">Truca al 112</a>`;
}

function youngPage() {
  const tabs = [['abans', 'Abans'], ['durant', 'Durant'], ['record', 'Record'], ['perseides', 'Perseides'], ['resum', 'Resum']];
  const stageProgress = youngStageProgress();
  return `
    <div class="page">
      <div class="page-head"><div><p class="eyebrow">Missió 10–12 anys</p><h1 class="page-title">Observa. Toca. Descobreix.</h1><p class="page-intro">Cap resposta escrita: selectors, botons i comptadors que queden desats.</p></div></div>
      ${youngProfileBar()}
      <div class="mission-progress" aria-label="${stageProgress.completed} de ${stageProgress.total} etapes completades"><span><i style="width:${stageProgress.percent}%"></i></span><strong>${stageProgress.percent}%</strong></div>
      <div class="tab-bar step-tabs" aria-label="Etapes de la missió jove">
        ${tabs.map(([id, label], index) => `<button id="young-tab-${id}" class="tab-button ${youngTab === id ? 'active' : ''}" type="button" aria-pressed="${youngTab === id}" data-young-tab="${id}"><span>${index + 1}</span>${label}</button>`).join('')}
      </div>
      <div id="young-panel" class="stage-panel" tabindex="-1" aria-labelledby="young-tab-${youngTab}">${youngTab === 'abans' ? youngBefore() : youngTab === 'durant' ? youngDuring() : youngTab === 'record' ? youngMemory() : youngTab === 'perseides' ? youngPerseids() : youngSummary()}</div>
    </div>`;
}

function choiceButtons(key, choices) {
  return `<div class="choice-grid">${choices.map(([value, label]) => `<button class="choice-button ${state.young[key] === value ? 'selected' : ''}" type="button" data-young-choice="${key}" data-value="${value}" aria-pressed="${state.young[key] === value}">${label}</button>`).join('')}</div>`;
}

function youngBefore() {
  return `
    <section class="panel">
      <p class="eyebrow">Fes una predicció</p><h2>Què creus que passarà?</h2><p>No has d’encertar. Una bona hipòtesi es compara després amb allò que has vist.</p>
      <div class="range-block">
        <div class="range-head"><label for="predictedDrop">Quant baixarà la temperatura?</label><span class="range-value" data-live="predictedDrop">${state.young.predictedDrop} °C</span></div>
        <input id="predictedDrop" type="range" min="0" max="8" step="1" value="${state.young.predictedDrop}" data-young-range="predictedDrop" aria-valuetext="${state.young.predictedDrop} graus">
        <div class="scale-labels"><span>0 °C</span><span>8 °C</span></div>
      </div>
      <h3>La foscor arribarà…</h3>
      ${choiceButtons('predictedDark', [['lentament', 'A poc a poc'], ['de-cop', 'Molt de cop']])}
      <h3 style="margin-top:18px">Què destacarà més?</h3>
      ${choiceButtons('predictedHighlight', [['corona', '☼ La corona'], ['venus', '✦ Venus'], ['horitzo', '◯ L’horitzó']])}
    </section>
    <details class="science-details"><summary>Vols saber per què passa?</summary>
      <div class="alert-card"><div class="alert-icon" aria-hidden="true">400×</div><div><h3>Una coincidència còsmica</h3><p>El Sol és unes 400 vegades més gran que la Lluna, però també és unes 400 vegades més lluny. Per això semblen tenir una mida semblant.</p></div></div>
      <p class="gallery-hint">↔ Llisca les imatges i toca-les per ampliar-les</p>
      <div class="visual-gallery" aria-label="Com funciona un eclipsi">
        ${zoomableVisual('diagrama-eclipsi.webp', 'El Sol, la Lluna i la Terra alineats; l’ombra estreta de la Lluna arriba a una part de la Terra', 'La Lluna projecta la seva ombra damunt la Terra.')}
        ${zoomableVisual('orbita-inclinada.webp', 'L’òrbita de la Lluna està inclinada cinc graus i només en alguns punts s’alinea amb el Sol i la Terra', 'No hi ha eclipsi cada mes perquè l’òrbita lunar està inclinada.')}
        ${zoomableVisual('totalitat-100.webp', 'Comparació visual entre un eclipsi parcial del 99,9 per cent i la totalitat del 100 per cent', 'El salt del 99,9% al 100% transforma completament el que veiem.')}
      </div>
    </details>
    ${stageCompletionButton('abans', 'durant', 'Continua')}`;
}

function youngDuring() {
  const drop = Math.max(0, state.young.beforeTemp - state.young.lowestTemp).toFixed(1).replace('.0', '');
  if (observationMode() === 'focus') return `
    <section class="focus-mode" aria-live="assertive"><span aria-hidden="true">◉</span><p class="eyebrow">Mode jornada</p><h2>Ara només mira</h2><p>Les mesures s’han acabat. Guarda el mòbil, posa’t les ulleres quan calgui i viu la totalitat.</p><strong>20.25–20.31</strong></section>`;
  return `
    <div class="alert-card live-mode-alert"><div class="alert-icon" aria-hidden="true">20.25</div><div><h3>Primer mesures; després, només mirar</h3><p>Termòmetre a l’ombra, ventilat i lluny del cotxe. A les 20.25 guarda el mòbil.</p></div></div>
    <div class="card-grid two">
      <section class="panel">
        <h3>Temperatura abans</h3>
        <div class="range-block"><div class="range-head"><span>Lectura</span><span class="range-value" data-live="beforeTemp">${state.young.beforeTemp} °C</span></div><input type="range" min="20" max="42" step="0.5" value="${state.young.beforeTemp}" data-young-range="beforeTemp" aria-label="Temperatura abans de l’eclipsi" aria-valuetext="${state.young.beforeTemp} graus"></div>
        <h3>Temperatura més baixa</h3>
        <div class="range-block"><div class="range-head"><span>Lectura</span><span class="range-value" data-live="lowestTemp">${state.young.lowestTemp} °C</span></div><input type="range" min="15" max="42" step="0.5" value="${state.young.lowestTemp}" data-young-range="lowestTemp" aria-label="Temperatura més baixa" aria-valuetext="${state.young.lowestTemp} graus"></div>
        <div class="metric-card"><small>Baixada observada</small><strong data-live="observedDrop">${drop} °C</strong><p>L’app calcula la diferència.</p></div>
      </section>
      <section class="panel">
        <h3>Quanta llum quedava?</h3>
        <div class="range-block"><div class="range-head"><span>Fosca → normal</span><span class="range-value" data-live="lightLevel">${state.young.lightLevel} / 5</span></div><input type="range" min="1" max="5" step="1" value="${state.young.lightLevel}" data-young-range="lightLevel" aria-label="Nivell de llum ambiental" aria-valuetext="${state.young.lightLevel} de 5"><div class="scale-labels"><span>1 · fosca</span><span>5 · normal</span></div></div>
        <h3>Com era el vent?</h3>
        <div class="range-block"><div class="range-head"><span>Gens → fort</span><span class="range-value" data-live="windLevel">${state.young.windLevel} / 3</span></div><input type="range" min="0" max="3" step="1" value="${state.young.windLevel}" data-young-range="windLevel" aria-label="Nivell de vent" aria-valuetext="${state.young.windLevel} de 3"><div class="scale-labels"><span>0 · gens</span><span>3 · fort</span></div></div>
      </section>
    </div>
    <section class="panel">
      <p class="eyebrow">Registre clar</p><h2>Què ha passat durant la fase parcial?</h2><p>Marca cada fenomen com a vist, no vist o no comprovat.</p>
      ${observationGrid(duringExperiences, 'experiences')}
    </section>
    <details class="science-details"><summary>Consulta els experiments</summary>
      ${zoomableVisual('laboratori-camp.webp', 'Laboratori de camp amb termòmetre a l’ombra, rellotge, colador i full de registre', 'Material mínim per mesurar sense perdre el moment.', 'visual-wide')}
      <p class="gallery-hint">↔ Llisca les imatges i toca-les per ampliar-les</p>
      <div class="visual-gallery" aria-label="Experiments durant l’eclipsi">
        ${zoomableVisual('experiment-colador.webp', 'Un colador projecta moltes imatges petites del Sol parcial sobre una superfície clara', 'Un colador converteix cada forat en una petita càmera.')}
        ${zoomableVisual('ombres-volants.webp', 'Una família observa possibles bandes d’ombra que es mouen sobre un llençol blanc', 'Just abans i després de la totalitat, busca bandes suaus sobre una superfície clara.')}
      </div>
    </details>
    ${stageCompletionButton('durant', 'record', 'Continua')}`;
}

function youngMemory() {
  return `
    <section class="summary-hero"><p class="eyebrow" style="color:var(--sun-300)">20.29.30–20.30.47</p><h2>Durant 77 segons, no escriguis</h2><p>Mira la corona, l’horitzó, el color del cel i les teves sensacions. Després, reconstrueix el record.</p></section>
    <section class="panel">
      <p class="eyebrow">Després de la totalitat</p><h2>Què has vist?</h2>
      ${observationGrid(totalityExperiences.filter(([id]) => id !== 'no-se'), 'totality')}
    </section>
    <details class="science-details"><summary>Recorda els fenòmens de la totalitat</summary>${zoomableVisual('fenomens-totalitat.webp', 'Eclipsi total amb la corona solar, la cromosfera, Venus, l’horitzó il·luminat i l’anell de diamant', 'Fenòmens que només es poden buscar durant la totalitat.', 'visual-wide')}</details>
    <section class="panel">
      <h2>Tria tres paraules</h2><p>Quines expliquen millor el teu primer record?</p>
      <div class="choice-grid">${memoryWords.map(word => `<button class="memory-button ${state.young.memories.includes(word) ? 'selected' : ''}" type="button" data-memory="${word}" aria-pressed="${state.young.memories.includes(word)}">${word}</button>`).join('')}</div>
      <p class="muted small" style="margin-top:10px">${state.young.memories.length}/3 paraules triades</p>
    </section>
    <section class="panel">
      <p class="eyebrow">Comprensions</p><h2>Què entenc ara?</h2><p>Marca les idees que ara podries explicar amb les teves paraules.</p>
      <div class="experience-grid">${understandingItems.map(([id, icon, label]) => `<button class="experience-button ${state.young.understanding[id] ? 'selected' : ''}" type="button" data-understanding="${id}" aria-pressed="${!!state.young.understanding[id]}"><span class="mini-icon" aria-hidden="true">${icon}</span><span>${label}</span></button>`).join('')}</div>
    </section>
    ${stageCompletionButton('record', 'perseides', 'Continua')}`;
}

function youngPerseids() {
  const hourly = state.young.meteorCount * 2;
  return `
    <section class="panel location-card">
      <button class="location-image" type="button" data-lightbox aria-label="Amplia la imatge de l’observació de les Perseides"><img src="assets/images/perseides-sant-jeroni.webp" alt="Família estirada en una manta, amb llum vermella, observant meteors en un cel fosc" width="1280" height="853" loading="lazy"><span class="zoom-hint" aria-hidden="true">⛶ Amplia</span></button>
      <div class="location-content"><p class="eyebrow">Observació nocturna</p><h2>Compta els meteors</h2><p>Estira’t, mira una zona ampla del cel i evita la llum blanca. No cal telescopi.</p><ul class="facts-list"><li>Els grans entren a uns 59 km/s.</li><li>Un avió o satèl·lit dura més i no compta.</li><li>La vista necessita uns 20 minuts per adaptar-se.</li></ul></div>
    </section>
    <section class="panel">
      <h2>Recompte de 30 minuts</h2>
      <div class="counter">
        <div class="counter-display"><strong>${state.young.meteorCount}</strong><span>meteors vistos</span></div>
        <button class="counter-button" type="button" data-meteor="-1" aria-label="Resta un meteor">−1</button>
        <button class="counter-button add" type="button" data-meteor="1" aria-label="Afegeix un meteor">+1</button>
        <button class="counter-button add" type="button" data-meteor="5" aria-label="Afegeix cinc meteors">+5</button>
      </div>
      <div class="metric-grid">
        <article class="metric-card"><small>Ritme equivalent</small><strong>${hourly}/h</strong><p>Total de 30 min × 2.</p></article>
        <article class="metric-card"><small>Velocitat</small><strong>59 km/s</strong><p>Partícules de Swift-Tuttle.</p></article>
      </div>
      <div class="range-block"><div class="range-head"><span>El més brillant</span><span class="range-value" data-live="meteorBrightness">${state.young.meteorBrightness} / 5</span></div><input type="range" min="1" max="5" step="1" value="${state.young.meteorBrightness}" data-young-range="meteorBrightness" aria-label="Brillantor del meteor més brillant" aria-valuetext="${state.young.meteorBrightness} de 5"></div>
      <h3>Com estava el cel?</h3>
      ${choiceButtons('skyCondition', [['serè', '★ Serè'], ['nuvols', '☁ Alguns núvols'], ['llum', '◉ Massa llum']])}
    </section>
    <details class="science-details"><summary>Com s’observen i d’on venen?</summary>
      <p class="gallery-hint">↔ Llisca les imatges i toca-les per ampliar-les</p>
      <div class="visual-gallery" aria-label="Ciència de les Perseides">
        ${zoomableVisual('guia-perseides.webp', 'Guia d’observació: estirar-se, mirar una zona ampla, evitar vies amb trànsit, llum blanca i obstacles', 'Una guia visual per preparar una observació còmoda i fosca.')}
        ${zoomableVisual('orbita-swift-tuttle.webp', 'Òrbita del cometa Swift-Tuttle, el seu corrent de pols i el punt on la Terra el travessa cada agost', 'La Terra travessa cada agost el rastre deixat pel cometa.')}
        ${zoomableVisual('meteor-atmosfera.webp', 'Un meteoroide entra a uns 59 quilòmetres per segon i deixa un meteor lluminós a l’atmosfera', 'Un gra diminut pot crear un traç molt brillant a l’atmosfera.')}
      </div>
    </details>
    ${stageCompletionButton('perseides', 'resum', 'Crea la crònica')}`;
}

function youngProgress() {
  return youngStageProgress().percent;
}

function youngSummary() {
  const observedDrop = Math.max(0, state.young.beforeTemp - state.young.lowestTemp).toFixed(1).replace('.0', '');
  const progress = youngProgress();
  const totalityItems = totalityExperiences.filter(([id]) => id !== 'no-se');
  const partialSeen = duringExperiences.filter(([id]) => state.young.experiences[id] === 'seen');
  const partialNotSeen = duringExperiences.filter(([id]) => state.young.experiences[id] === 'not-seen');
  const partialUnchecked = duringExperiences.filter(([id]) => !state.young.experiences[id] || state.young.experiences[id] === 'unchecked');
  const totalitySeen = totalityItems.filter(([id]) => state.young.totality[id] === 'seen');
  const totalityNotSeen = totalityItems.filter(([id]) => state.young.totality[id] === 'not-seen');
  const totalityUnchecked = totalityItems.filter(([id]) => !state.young.totality[id] || state.young.totality[id] === 'unchecked');
  const understood = understandingItems.filter(([id]) => state.young.understanding[id]);
  const pendingUnderstanding = understandingItems.filter(([id]) => !state.young.understanding[id]);
  const measurementResults = [
    state.young.touched.beforeTemp && state.young.touched.lowestTemp ? `La temperatura ha passat de ${state.young.beforeTemp} °C a ${state.young.lowestTemp} °C: una baixada de ${observedDrop} °C.` : null,
    state.young.touched.lightLevel ? `La llum ambiental s’ha valorat amb ${state.young.lightLevel} punts sobre 5.` : null,
    state.young.touched.windLevel ? `El vent s’ha valorat amb ${state.young.windLevel} punts sobre 3.` : null,
    state.young.touched.meteorCount || state.young.meteorCount > 0 ? `En 30 minuts s’han comptat ${state.young.meteorCount} meteors, equivalents a un ritme de ${state.young.meteorCount * 2} per hora.` : null,
    state.young.touched.meteorBrightness ? `El meteor més brillant s’ha valorat amb ${state.young.meteorBrightness} punts sobre 5.` : null,
    state.young.touched.skyCondition ? `El cel de les Perseides s’ha registrat com a “${state.young.skyCondition === 'serè' ? 'serè' : state.young.skyCondition === 'nuvols' ? 'amb alguns núvols' : 'amb massa llum'}”.` : null
  ].filter(Boolean);
  const missingChecks = [
    !(state.young.touched.beforeTemp && state.young.touched.lowestTemp) ? 'No s’ha comprovat la baixada de temperatura.' : null,
    !state.young.touched.lightLevel ? 'No s’ha valorat el nivell de llum.' : null,
    !state.young.touched.windLevel ? 'No s’ha comprovat el canvi de vent.' : null,
    !(state.young.touched.meteorCount || state.young.meteorCount > 0) ? 'No s’ha fet el recompte de Perseides.' : null,
    !state.young.touched.meteorBrightness ? 'No s’ha valorat la brillantor dels meteors.' : null,
    !state.young.touched.skyCondition ? 'No s’ha registrat l’estat del cel nocturn.' : null
  ].filter(Boolean);
  const comparison = Number(observedDrop) === state.young.predictedDrop
    ? 'La predicció de temperatura ha coincidit amb la mesura.'
    : `La predicció era de ${state.young.predictedDrop} °C i la baixada registrada ha estat de ${observedDrop} °C.`;
  return `
    <section class="report-sheet" aria-labelledby="report-title">
      <header class="report-head"><p class="eyebrow">Crònica de la jornada</p><h2 id="report-title">${progress === 100 ? 'Missió científica completada' : 'Una crònica que encara pot créixer'}</h2><p>Resum automàtic de prediccions, mesures, observacions i comprensions.</p><div class="report-meta"><label><span>Nom o perfil</span><input type="text" maxlength="40" value="${escapeHtml(state.young.profileName)}" data-young-meta="profileName"></label><label><span>Data</span><input type="date" value="${escapeHtml(state.young.reportDate)}" data-young-meta="reportDate"></label><label><span>Lloc</span><input type="text" maxlength="60" value="${escapeHtml(state.young.reportLocation)}" data-young-meta="reportLocation"></label></div></header>
      <div class="progress-wrap"><div class="progress-label"><span>Etapes completades</span><strong>${progress}%</strong></div><div class="progress-track" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${progress}%"></div></div></div>
      <div class="metric-grid">
        <article class="metric-card"><small>Predicció</small><strong>${state.young.predictedDrop} °C</strong><p>Baixada esperada.</p></article>
        <article class="metric-card"><small>Mesura</small><strong>${state.young.touched.beforeTemp && state.young.touched.lowestTemp ? `${observedDrop} °C` : '—'}</strong><p>Baixada registrada.</p></article>
        <article class="metric-card"><small>Perseides</small><strong>${state.young.touched.meteorCount || state.young.meteorCount > 0 ? state.young.meteorCount : '—'}</strong><p>Meteors comptats.</p></article>
      </div>

      <section class="report-actions"><button class="primary-button" type="button" data-print-report>Imprimeix o desa PDF</button><button class="secondary-button" type="button" data-export-young>Exporta les dades</button></section>
      <details class="report-details"><summary>Veure la crònica detallada</summary><div class="report-grid">
        <article class="report-section"><p class="eyebrow">1 · Resultats</p><h3>Mesures i comparacions</h3><p>${state.young.touched.beforeTemp && state.young.touched.lowestTemp ? comparison : 'Hi ha una predicció, però falta la mesura per poder-la comparar.'}</p>${measurementResults.length ? `<ul class="report-list">${measurementResults.map(item => `<li>${item}</li>`).join('')}</ul>` : '<p class="report-empty">Encara no s’ha introduït cap mesura.</p>'}</article>
        <article class="report-section"><p class="eyebrow">2 · Observacions</p><h3>Allò que sí que s’ha vist</h3>${partialSeen.length || totalitySeen.length ? `<div class="report-chips">${[...partialSeen, ...totalitySeen].map(([, icon, label]) => `<span><b aria-hidden="true">${icon}</b>${label}</span>`).join('')}</div>` : '<p class="report-empty">No s’ha marcat cap fenomen observat.</p>'}</article>
        <article class="report-section"><p class="eyebrow">3 · Comprensions</p><h3>Allò que ara es pot explicar</h3>${understood.length ? `<ul class="report-list checks">${understood.map(([, , label]) => `<li>${label}.</li>`).join('')}</ul>` : '<p class="report-empty">Encara no s’ha confirmat cap comprensió.</p>'}</article>
        <article class="report-section"><p class="eyebrow">4 · Record</p><h3>La jornada en tres paraules</h3>${state.young.memories.length ? `<div class="report-words">${state.young.memories.map(word => `<span>${word}</span>`).join('')}</div>` : '<p class="report-empty">Encara no s’han triat les tres paraules del record.</p>'}</article>
      </div>

      <section class="report-section report-pending"><p class="eyebrow">El que ha faltat</p><h3>No vist, no percebut o no comprovat</h3>
        <h4>Fenòmens marcats com a no vistos</h4><div class="report-chips missing">${[...partialNotSeen, ...totalityNotSeen].map(([, icon, label]) => `<span><b aria-hidden="true">${icon}</b>${label}</span>`).join('') || '<span>Cap fenomen s’ha marcat com a no vist.</span>'}</div>
        <h4>Fenòmens no comprovats</h4><div class="report-chips unchecked">${[...partialUnchecked, ...totalityUnchecked].map(([, icon, label]) => `<span><b aria-hidden="true">${icon}</b>${label}</span>`).join('') || '<span>Tots els fenòmens tenen un resultat.</span>'}</div>
        <h4>Mesures o comprovacions pendents</h4>${missingChecks.length ? `<ul class="report-list missing">${missingChecks.map(item => `<li>${item}</li>`).join('')}</ul>` : '<p>Totes les mesures proposades han quedat registrades.</p>'}
        <h4>Idees que encara cal consolidar</h4>${pendingUnderstanding.length ? `<ul class="report-list missing">${pendingUnderstanding.map(([, , label]) => `<li>${label}.</li>`).join('')}</ul>` : '<p>S’han confirmat totes les comprensions proposades.</p>'}
      </section></details>
      <footer class="report-footer"><strong>Conclusió</strong><p>Aquesta crònica es construeix només amb els tocs fets durant la jornada. Es conserva al dispositiu i està estructurada per poder convertir-la més endavant en un informe PDF ben presentat.</p></footer>
    </section>
    <button class="reset-button" type="button" data-reset="young">Reinicia la missió tàctil</button>`;
}

function kidsPage() {
  if (questionBankError) return `
    <div class="page infant-mode"><section class="infant-card"><div class="question-picture" aria-hidden="true">⚠️</div><h1>NO PUC CARREGAR LES PREGUNTES</h1><p>${questionBankError}</p><button class="primary-button" type="button" data-kids-reload>TORNA-HO A PROVAR ↻</button></section></div>`;
  if (!fiveYearQuestions.length) return `
    <div class="page infant-mode"><section class="infant-card"><div class="question-picture loading-orb" aria-hidden="true">☀️</div><h1>PREPAREM LA RONDA…</h1><p>UN MOMENT, JOVE ASTRÒNOM/A!</p></section></div>`;
  if (state.kids5.phase === 'intro') return `
    <div class="page infant-mode">
      <section class="infant-card welcome">
        <img class="infant-illustration" src="assets/images/infantil-eclipsi.webp" alt="UN INFANT I UNA PERSONA ADULTA AMB ULLERES D’ECLIPSI" width="900" height="1350">
        <h1>HOLA, JOVE ASTRÒNOM/A!</h1><p>TOCA, MIRA I DESCOBREIX L’ECLIPSI.</p>
        <div class="round-rules"><span><strong>90</strong>PREGUNTES AL BANC</span><span><strong>5</strong>A CADA RONDA</span><span><strong>↻</strong>ERRORS AMB UNA NOVA OPORTUNITAT</span></div>
        ${state.kidsHistory.roundsPlayed ? `<div class="kid-history"><span><strong>${state.kidsHistory.roundsPlayed}</strong> RONDES</span><span><strong>${state.kidsHistory.bestScore}%</strong> MILLOR RESULTAT</span></div>` : ''}
        <button class="effects-toggle" type="button" data-kids-effects aria-pressed="${state.settings.kidsEffects}">${state.settings.kidsEffects ? '🔊 SO I VIBRACIÓ' : '🔇 SENSE SO NI VIBRACIÓ'}</button>
        <button class="primary-button" type="button" data-kids-start>COMENÇA UNA RONDA →</button>
      </section>
    </div>`;
  if (state.kids5.phase === 'summary') return kidsRoundSummary();
  if (state.kids5.phase === 'final') return kidsFinished();
  return kidsQuestionPage();
}

function kidsQuestionPage() {
  const retry = state.kids5.phase === 'retry';
  const ids = retry ? state.kids5.retryIds : state.kids5.roundIds;
  const index = retry ? state.kids5.retryIndex : state.kids5.currentIndex;
  const question = kidsQuestionById(ids[index]);
  if (!question) {
    state.kids5 = structuredClone(defaultState.kids5);
    saveState();
    return kidsPage();
  }
  const choice = state.kids5.currentChoice;
  const answered = choice !== null;
  const correct = answered && choice === question.correct;
  const optionOrder = state.kids5.optionOrders[question.id] || question.options.map((_, optionIndex) => optionIndex);
  const feedback = !answered ? '' : retry
    ? correct
      ? `<div class="quiz-feedback" data-kids-feedback tabindex="-1" role="status" aria-live="polite">ARA SÍ! ⭐<small>${question.explanation}</small></div><button class="primary-button" type="button" data-kids-next>${index === ids.length - 1 ? 'VEURE EL RESULTAT →' : 'SEGÜENT ERROR →'}</button>`
      : `<div class="quiz-feedback try" data-kids-feedback tabindex="-1" role="status" aria-live="polite">PROVA-HO UN ALTRE COP.</div><button class="primary-button" type="button" data-kids-try-again>TORNA-HI ↻</button>`
    : correct
      ? `<div class="quiz-feedback" data-kids-feedback tabindex="-1" role="status" aria-live="polite">MOLT BÉ! ⭐<small>${question.explanation}</small></div><button class="primary-button" type="button" data-kids-next>${index === 4 ? 'VEURE EL RESULTAT →' : 'SEGÜENT →'}</button>`
      : `<div class="quiz-feedback try" data-kids-feedback tabindex="-1" role="status" aria-live="polite">GAIREBÉ! LA PODRÀS TORNAR A FER AL FINAL.</div><button class="primary-button" type="button" data-kids-next>${index === 4 ? 'VEURE EL RESULTAT →' : 'SEGÜENT →'}</button>`;
  return `
    <div class="page infant-mode">
      <section class="infant-card">
        <div class="quiz-progress" aria-label="${retry ? 'ERROR' : 'PREGUNTA'} ${index + 1} DE ${ids.length}">${ids.map((id, itemIndex) => {
          const pastQuestion = kidsQuestionById(id);
          const pastCorrect = retry ? state.kids5.corrected.includes(id) : pastQuestion && state.kids5.firstAnswers[id] === pastQuestion.correct;
          return `<span class="quiz-dot ${itemIndex < index ? `done ${pastCorrect ? 'correct' : 'error'}` : itemIndex === index ? 'current' : ''}"></span>`;
        }).join('')}</div>
        <span class="question-category">${retry ? 'SEGONA OPORTUNITAT' : question.category}</span>
        <div class="question-picture" aria-hidden="true">${question.picture}</div>
        <h2>${question.question}</h2>
        <div class="quiz-options ${question.options.length === 2 ? 'two-options' : ''}">${optionOrder.map(optionIndex => {
          const option = question.options[optionIndex];
          const classes = answered && optionIndex === choice ? (optionIndex === question.correct ? 'correct' : 'wrong') : '';
          return `<button class="quiz-option ${classes}" type="button" data-kids-answer="${optionIndex}" ${answered ? 'disabled' : ''}><span class="option-icon" aria-hidden="true">${option.icon}</span><span>${option.label}</span></button>`;
        }).join('')}</div>
        ${feedback}
      </section>
    </div>`;
}

function kidsRoundSummary() {
  const stats = kidsRoundStats();
  return `
    <div class="page infant-mode">
      <section class="infant-card results-card ${stats.errors === 0 ? 'perfect' : ''}">
        ${stats.errors === 0 ? `<div class="confetti" aria-hidden="true">${'<i></i>'.repeat(8)}</div>` : ''}
        <p class="result-kicker">RESULTAT DE LA RONDA</p>
        <h1>${stats.errors === 0 ? 'PERFECTE!' : 'MOLT BONA FEINA!'}</h1>
        <div class="score-ring" style="--score:${stats.correctPercent * 3.6}deg" role="img" aria-label="${stats.correctPercent}% d’encerts i ${stats.errorPercent}% d’errors"><span><strong>${stats.correctPercent}%</strong>ENCERTS</span></div>
        <div class="result-legend"><span class="correct"><i></i><strong>${stats.correct}</strong> ENCERTS</span><span class="errors"><i></i><strong>${stats.errors}</strong> ERRORS</span></div>
        <p class="history-line">RONDES JUGADES: ${state.kidsHistory.roundsPlayed} · MILLOR RESULTAT: ${state.kidsHistory.bestScore}%</p>
        <div class="answer-strip" aria-label="RESULTAT DE LES CINC PREGUNTES">${state.kids5.roundIds.map(id => `<span class="${stats.correctIds.includes(id) ? 'correct' : 'error'}" title="${stats.correctIds.includes(id) ? 'ENCERT' : 'ERROR'}">${stats.correctIds.includes(id) ? '✓' : '×'}</span>`).join('')}</div>
        ${stats.errors
          ? `<p>ARA POTS RECTIFICAR ${stats.errors === 1 ? 'L’ERROR' : 'ELS ERRORS'}.</p><button class="primary-button review-button" type="button" data-kids-review>TORNA A FER ${stats.errors === 1 ? 'LA PREGUNTA' : 'LES PREGUNTES'} ↻</button>`
          : `<p>HAS ENCERTAT LES CINC PREGUNTES A LA PRIMERA!</p><button class="primary-button" type="button" data-kids-new-round>NOVA RONDA →</button>`}
        <small class="bank-note">5 PREGUNTES TRIADES A L’ATZAR D’UN BANC DE 90</small>
      </section>
    </div>`;
}

function kidsFinished() {
  const stats = kidsRoundStats();
  return `
    <div class="page infant-mode">
      <section class="infant-card finished">
        <div class="confetti" aria-hidden="true">${'<i></i>'.repeat(8)}</div>
        <img class="infant-illustration" src="assets/images/infantil-eclipsi-nena.webp" alt="NENA AMB ULLERES D’ECLIPSI" width="1023" height="1537">
        <h1>ERRORS RECTIFICATS!</h1>
        <div class="stars" aria-label="TRES ESTRELLES">★ ★ ★</div>
        <div class="score-comparison">
          <div><strong>${stats.correctPercent}%</strong><span>PRIMERA VOLTA</span></div>
          <span class="comparison-arrow" aria-hidden="true">→</span>
          <div class="corrected"><strong>100%</strong><span>DESPRÉS DE RECTIFICAR</span></div>
        </div>
        <p>ARA SÍ: LES CINC RESPOSTES SÓN CORRECTES!</p>
        <p class="history-line dark">RONDES JUGADES: ${state.kidsHistory.roundsPlayed} · MILLOR RESULTAT: ${state.kidsHistory.bestScore}%</p>
        <button class="primary-button" type="button" data-kids-new-round>NOVA RONDA →</button>
      </section>
    </div>`;
}

function render() {
  const page = route();
  app.innerHTML = page === 'inici' ? homePage() : page === 'adults' ? adultPage() : page === 'joves' ? youngPage() : kidsPage();
  updateNavigation();
  updateCountdown();
  document.title = `${page === 'inici' ? 'Missió eclipsi 2026' : page === 'adults' ? 'Adults · Missió eclipsi' : page === 'joves' ? '10–12 · Missió eclipsi' : '5 anys · Missió eclipsi'}`;
}

document.addEventListener('click', event => {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton) {
    event.preventDefault();
    setRoute(routeButton.dataset.route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    focusSoon('#app');
    return;
  }
});

app.addEventListener('click', event => {
  const imageZoom = event.target.closest('[data-lightbox]');
  if (imageZoom) { openLightbox(imageZoom); return; }

  const adultTabButton = event.target.closest('[data-adult-tab]');
  if (adultTabButton) { adultTab = adultTabButton.dataset.adultTab; render(); focusSoon(`#adult-tab-${adultTab}`); return; }

  if (event.target.closest('[data-adult-checked]')) {
    state.adult.lastExternalCheck = new Date().toISOString();
    saveState(); render(); showToast('Comprovacions externes registrades.'); return;
  }

  if (event.target.closest('[data-timeline-toggle]')) {
    adultTimelineExpanded = !adultTimelineExpanded;
    render(); return;
  }

  if (event.target.closest('[data-pending-filter]')) {
    checklistPendingOnly = !checklistPendingOnly;
    if (checklistPendingOnly) checklistGroups.forEach(group => openChecklistGroups.add(group.title));
    render(); return;
  }

  const checklistGroup = event.target.closest('[data-check-group]');
  if (checklistGroup) {
    const title = checklistGroup.dataset.checkGroup;
    if (openChecklistGroups.has(title)) openChecklistGroups.delete(title);
    else openChecklistGroups.add(title);
    render(); return;
  }

  const youngTabButton = event.target.closest('[data-young-tab]');
  if (youngTabButton) { youngTab = youngTabButton.dataset.youngTab; render(); focusSoon(`#young-tab-${youngTab}`); return; }

  const youngProfile = event.target.closest('[data-young-profile]');
  if (youngProfile) {
    switchYoungProfile(youngProfile.dataset.youngProfile);
    render(); showToast(`Has obert ${state.young.profileName}.`); return;
  }

  const youngGo = event.target.closest('[data-young-go]');
  if (youngGo) { youngTab = youngGo.dataset.youngGo; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

  const choice = event.target.closest('[data-young-choice]');
  if (choice) {
    state.young[choice.dataset.youngChoice] = choice.dataset.value;
    state.young.touched[choice.dataset.youngChoice] = true;
    saveState(); render(); return;
  }

  const observation = event.target.closest('[data-observation]');
  if (observation) {
    state.young[observation.dataset.observation][observation.dataset.id] = observation.dataset.value;
    const selector = `[data-observation="${observation.dataset.observation}"][data-id="${observation.dataset.id}"][data-value="${observation.dataset.value}"]`;
    saveState(); render(); focusSoon(selector); return;
  }

  const stageComplete = event.target.closest('[data-young-complete]');
  if (stageComplete) {
    state.young.sectionComplete[stageComplete.dataset.youngComplete] = true;
    youngTab = stageComplete.dataset.nextStage;
    saveState(); render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    focusSoon(`#young-tab-${youngTab}`);
    return;
  }

  if (event.target.closest('[data-print-report]')) {
    document.querySelector('.report-details')?.setAttribute('open', '');
    window.print(); return;
  }

  if (event.target.closest('[data-export-young]')) { exportYoungData(); return; }

  const understanding = event.target.closest('[data-understanding]');
  if (understanding) {
    const id = understanding.dataset.understanding;
    state.young.understanding[id] = !state.young.understanding[id];
    saveState(); render(); return;
  }

  const memory = event.target.closest('[data-memory]');
  if (memory) {
    const word = memory.dataset.memory;
    if (state.young.memories.includes(word)) state.young.memories = state.young.memories.filter(item => item !== word);
    else if (state.young.memories.length < 3) state.young.memories.push(word);
    else { showToast('Ja has triat tres paraules. Desmarca’n una per canviar-la.'); return; }
    saveState(); render(); return;
  }

  const meteor = event.target.closest('[data-meteor]');
  if (meteor) {
    state.young.meteorCount = Math.max(0, state.young.meteorCount + Number(meteor.dataset.meteor));
    state.young.touched.meteorCount = true;
    saveState(); render(); return;
  }

  if (event.target.closest('[data-kids-start]')) {
    startKidsRound(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }

  const kidsAnswer = event.target.closest('[data-kids-answer]');
  if (kidsAnswer) {
    const retry = state.kids5.phase === 'retry';
    const ids = retry ? state.kids5.retryIds : state.kids5.roundIds;
    const index = retry ? state.kids5.retryIndex : state.kids5.currentIndex;
    const question = kidsQuestionById(ids[index]);
    if (!question) return;
    const choice = Number(kidsAnswer.dataset.kidsAnswer);
    state.kids5.currentChoice = choice;
    if (retry) {
      if (choice === question.correct && !state.kids5.corrected.includes(question.id)) state.kids5.corrected.push(question.id);
    } else {
      state.kids5.firstAnswers[question.id] = choice;
    }
    playKidFeedback(choice === question.correct);
    saveState(); render(); focusSoon('[data-kids-feedback]'); return;
  }

  if (event.target.closest('[data-kids-next]')) {
    if (state.kids5.phase === 'question') {
      state.kids5.currentIndex += 1;
      state.kids5.currentChoice = null;
      if (state.kids5.currentIndex >= state.kids5.roundIds.length) {
        const stats = kidsRoundStats();
        state.kids5.phase = 'summary';
        state.kidsHistory.roundsPlayed += 1;
        state.kidsHistory.bestScore = Math.max(state.kidsHistory.bestScore, stats.correctPercent);
      }
    } else if (state.kids5.phase === 'retry') {
      const question = kidsQuestionById(state.kids5.retryIds[state.kids5.retryIndex]);
      if (!question || state.kids5.currentChoice !== question.correct) return;
      state.kids5.retryIndex += 1;
      state.kids5.currentChoice = null;
      if (state.kids5.retryIndex >= state.kids5.retryIds.length) state.kids5.phase = 'final';
    }
    saveState(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }

  if (event.target.closest('[data-kids-try-again]')) {
    state.kids5.currentChoice = null;
    saveState(); render(); return;
  }

  if (event.target.closest('[data-kids-review]')) {
    state.kids5.retryIds = kidsRoundStats().errorIds;
    state.kids5.retryIndex = 0;
    state.kids5.currentChoice = null;
    state.kids5.corrected = [];
    state.kids5.phase = state.kids5.retryIds.length ? 'retry' : 'final';
    saveState(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }

  if (event.target.closest('[data-kids-new-round]')) {
    startKidsRound(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }

  if (event.target.closest('[data-kids-reload]')) {
    location.reload(); return;
  }

  if (event.target.closest('[data-kids-effects]')) {
    state.settings.kidsEffects = !state.settings.kidsEffects;
    saveState(); render(); return;
  }

  const reset = event.target.closest('[data-reset]');
  if (reset?.dataset.reset === 'checklist' && confirm('Vols desmarcar tota la checklist?')) {
    state.checklist = {}; saveState(); render(); return;
  }
  if (reset?.dataset.reset === 'young' && confirm('Vols esborrar les dades de la missió tàctil d’aquest perfil?')) {
    const profileNumber = Number(state.activeYoungProfile.split('-').at(-1)) || 1;
    state.young = mergeYoungState({}, profileNumber); saveState(); render();
  }
});

app.addEventListener('change', event => {
  if (event.target.matches('[data-checklist]')) {
    state.checklist[event.target.dataset.checklist] = event.target.checked;
    saveState(); render();
  }
  if (event.target.matches('[data-perseid-gate]')) {
    state.adult.perseidGate[event.target.dataset.perseidGate] = event.target.checked;
    saveState(); render();
  }
  if (event.target.matches('[data-young-range]')) render();
  if (event.target.matches('[data-young-meta]')) {
    const key = event.target.dataset.youngMeta;
    state.young[key] = event.target.value.trim() || defaultYoungState[key];
    saveState(); render();
  }
});

app.addEventListener('input', event => {
  if (!event.target.matches('[data-young-range]')) return;
  const key = event.target.dataset.youngRange;
  const value = Number(event.target.value);
  state.young[key] = value;
  state.young.touched[key] = true;
  saveState();
  const suffix = key === 'predictedDrop' || key === 'beforeTemp' || key === 'lowestTemp' ? ' °C' : ' / ' + (key === 'windLevel' ? '3' : '5');
  event.target.setAttribute('aria-valuetext', `${value}${suffix}`);
  document.querySelectorAll(`[data-live="${key}"]`).forEach(node => { node.textContent = `${value}${suffix}`; });
  if (key === 'beforeTemp' || key === 'lowestTemp') {
    const drop = Math.max(0, state.young.beforeTemp - state.young.lowestTemp).toFixed(1).replace('.0', '');
    document.querySelectorAll('[data-live="observedDrop"]').forEach(node => { node.textContent = `${drop} °C`; });
  }
});

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.classList.add('ready');
  updateInstallState();
});

installButton.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  } else {
    installDialog.showModal();
  }
});

installDialog.querySelector('.dialog-close').addEventListener('click', () => installDialog.close());
installDialog.querySelector('.dialog-ok').addEventListener('click', () => installDialog.close());
installDialog.addEventListener('click', event => {
  if (event.target === installDialog) installDialog.close();
});

imageDialog.querySelector('.image-dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target === imageDialog) imageDialog.close();
});

function isInstalled() {
  return window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true;
}

function updateInstallState() {
  const installed = isInstalled();
  installButton.disabled = installed;
  installButton.classList.toggle('installed', installed);
  installButton.querySelector('span').textContent = installed ? 'Instal·lada' : 'Instal·la';
  installButton.setAttribute('aria-label', installed ? 'Aplicació instal·lada' : 'Instal·lar l’aplicació');
}

function updateConnectionStatus() {
  const status = document.querySelector('#connection-status');
  status.classList.toggle('offline', !navigator.onLine);
  status.classList.toggle('ready', navigator.onLine && offlineReady);
  status.querySelector('span').textContent = navigator.onLine ? (offlineReady ? 'Offline preparat' : 'En línia') : 'Sense connexió';
}

window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  updateInstallState();
  showToast('Aplicació instal·lada. Ja la tens a la pantalla d’inici.');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js');
      await navigator.serviceWorker.ready;
      offlineReady = true;
      updateConnectionStatus();
    } catch {
      showToast('No s’ha pogut activar el mode sense connexió.');
    }
  });
}

if (!location.hash) history.replaceState(null, '', '#inici');
updateConnectionStatus();
updateInstallState();
render();
loadQuestionBank()
  .catch(error => { questionBankError = error instanceof Error ? error.message : 'No s’ha pogut carregar el banc infantil.'; })
  .finally(render);
setInterval(updateCountdown, 1000);
