const EXPEDITION_CONFIG = [
  {
    id: 'cortes',
    label: 'Hernán Cortés',
    short: 'Conquesta de Mèxic',
    color: '#c95f3d',
    file: '1cortes.json',
    portrait: 'img/cortes.jpg'
  },
  {
    id: 'pizarro',
    label: 'Francisco Pizarro',
    short: 'Imperi inca en setge',
    color: '#0f7b6c',
    file: '2pizarro.json',
    portrait: 'img/pizarro.jpg'
  },
  {
    id: 'cabeza',
    label: 'Álvar Núñez Cabeza de Vaca',
    short: 'Supervivència a la frontera',
    color: '#f1a208',
    file: '3cabeza.json',
    portrait: 'img/cabeza.jpg'
  },
  {
    id: 'desoto',
    label: 'Hernando de Soto',
    short: 'Mississipí i resistències',
    color: '#405f9e',
    file: '4desoto.json',
    portrait: 'img/desoto.jpg'
  },
  {
    id: 'valdivia',
    label: 'Pedro de Valdivia',
    short: 'Fundacions a Xile',
    color: '#7b3b8c',
    file: '5valdivia.json',
    portrait: 'img/valdivia.jpg'
  }
];

const SECTION_ICONS = {
  overview: '&#x1F3AF;',
  forces: '&#x2694;&#xFE0F;',
  challenges: '&#x26A0;&#xFE0F;',
  outcome: '&#x1F3DB;&#xFE0F;'
};

const EXTRA_ICONS = {
  allies: '&#x1F91D;',
  strategies: '&#x1F9ED;',
  timeline: '&#x23F2;&#xFE0F;'
};

function formatListItems(items, icon) {
  if (!items || !items.length) {
    return '';
  }
  return items.map((text) => `<li><span class="info-icon">${icon}</span><span>${text}</span></li>`).join('');
}

function formatIconList(items) {
  if (!items || !items.length) {
    return '';
  }
  return items
    .map((item) => {
      if (!item || !item.text) {
        return '';
      }
      const icon = item.icon || '';
      return '<li><span class="info-icon">' + icon + '</span><span>' + item.text + '</span></li>';
    })
    .filter(Boolean)
    .join('');
}

function orderVoyagesByConfig(voyages) {
  const lookup = new Map(voyages.map((voyage) => [voyage.id, voyage]));
  return EXPEDITION_CONFIG.map((config) => lookup.get(config.id)).filter(Boolean);
}

function pickFirstText(candidates = []) {
  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined) {
      continue;
    }
    const text = typeof candidate === 'string' ? candidate : String(candidate);
    const trimmed = text.trim();
    if (trimmed) {
      return trimmed;
    }
  }
  return '';
}

function renderSummaryLine(icon, label, text) {
  if (!text) {
    return '';
  }
  const parts = [
    '<li>',
    icon ? '  <span class="info-summary__icon" aria-hidden="true">' + icon + '</span>' : '',
    '  <div class="info-summary__text">',
    label ? '    <p class="info-summary__label">' + label + '</p>' : '',
    '    <p class="info-summary__value">' + text + '</p>',
    '  </div>',
    '</li>'
  ];
  return parts.filter(Boolean).join('\n');
}

function getPrimaryForceText(voyage) {
  if (!Array.isArray(voyage.forces)) {
    return '';
  }
  for (const force of voyage.forces) {
    const text = formatForceText(force);
    if (text) {
      return text;
    }
  }
  return '';
}

function getPrimaryOutcomeText(voyage) {
  if (!Array.isArray(voyage.resultats)) {
    return '';
  }
  return pickFirstText(voyage.resultats);
}

function getPrimaryChallengeText(voyage) {
  if (!Array.isArray(voyage.problemes_generals)) {
    return '';
  }
  return pickFirstText(voyage.problemes_generals);
}

function getPrimaryObjectiveText(voyage) {
  return pickFirstText([voyage.finalitat, voyage.resum, voyage.short]);
}

function getPrimaryAllyText(voyage) {
  return pickFirstText(voyage.aliats || []);
}

function getPrimaryStrategyText(voyage) {
  return pickFirstText(voyage.estrategies || []);
}

function getVoyageYears(voyage) {
  return pickFirstText([voyage.anys]);
}

const SECTION_SUMMARY_HEADING = {
  overview: 'Objectius principals dels cinc viatges',
  forces: 'Forces i suports destacats',
  challenges: 'Dificultats principals identificades',
  outcome: 'Resultats i conseqüències clau'
};

const SECTION_EMPTY_MESSAGES = {
  overview: 'Sense objectiu registrat.',
  forces: 'Sense dades logístiques disponibles.',
  challenges: 'Sense incidències registrades.',
  outcome: 'Sense resultats registrats.'
};

function buildSummaryEntries(voyage, section) {
  const entries = [];
  if (section === 'overview') {
    const objective = getPrimaryObjectiveText(voyage);
    const years = getVoyageYears(voyage);
    if (objective) {
      entries.push({ icon: SECTION_ICONS.overview, label: 'Objectiu', text: objective });
    }
    if (years) {
      entries.push({ icon: EXTRA_ICONS.timeline, label: 'Període', text: years });
    }
    return entries;
  }

  if (section === 'forces') {
    const primaryForce = getPrimaryForceText(voyage);
    const allies = getPrimaryAllyText(voyage);
    const strategy = getPrimaryStrategyText(voyage);
    if (primaryForce) {
      entries.push({ icon: SECTION_ICONS.forces, label: 'Força destacada', text: primaryForce });
    }
    if (allies) {
      entries.push({ icon: EXTRA_ICONS.allies, label: 'Aliances', text: allies });
    }
    if (strategy) {
      entries.push({ icon: EXTRA_ICONS.strategies, label: 'Estratègia', text: strategy });
    }
    return entries;
  }

  if (section === 'challenges') {
    const challenge = getPrimaryChallengeText(voyage);
    if (challenge) {
      entries.push({ icon: SECTION_ICONS.challenges, label: '', text: challenge });
    }
    return entries;
  }

  if (section === 'outcome') {
    const outcome = getPrimaryOutcomeText(voyage);
    if (outcome) {
      entries.push({ icon: SECTION_ICONS.outcome, label: '', text: outcome });
    }
    return entries;
  }

  return entries;
}

function renderAllVoyagesSection(voyages, section) {
  const cards = voyages.map((voyage) => {
    const subjectTag = typeof renderSubjectTag === 'function' ? renderSubjectTag(voyage) : '';
    const subjectName = pickFirstText([voyage.personatge?.nom, voyage.label]);
    const summaryEntries = buildSummaryEntries(voyage, section).map((entry) => renderSummaryLine(entry.icon, entry.label, entry.text)).filter(Boolean);
    const emptyMessage = SECTION_EMPTY_MESSAGES[section] || 'Sense dades disponibles.';
    const content = summaryEntries.length
      ? '<ul class="info-summary">' + summaryEntries.join('\n') + '</ul>'
      : '<p class="info-empty">' + emptyMessage + '</p>';

    const block = [
      '<article class="info-block info-block--summary">',
      subjectTag ? '  ' + subjectTag : '',
      subjectName ? '  <p class="info-meta info-meta--subject">' + subjectName + '</p>' : '',
      '  ' + content,
      '</article>'
    ];
    return block.filter(Boolean).join('\n');
  });

  const heading = SECTION_SUMMARY_HEADING[section] || 'Comparativa dels cinc viatges';

  return [
    '<div class="info-overview info-overview--all info-overview--' + section + '">',
    '  <p class="info-meta info-meta--lead">' + heading + '</p>',
    cards.join('\n'),
    '</div>'
  ].join('\n');
}

function renderInfoGroup(title, listHtml, emptyMessage) {
  const content = listHtml
    ? '<ul class="info-list">' + listHtml + '</ul>'
    : '<p class="info-empty">' + emptyMessage + '</p>';
  const lines = [
    '<section class="info-subsection">',
    title ? '  <h4>' + title + '</h4>' : '',
    '  ' + content,
    '</section>'
  ];
  return lines.filter(Boolean).join('\n').trim();
}

function formatForceText(force) {
  if (!force) {
    return '';
  }
  const amount = typeof force.quantitat === "number" ? force.quantitat : Number.parseFloat(force.quantitat);
  const amountText = Number.isFinite(amount) ? amount.toLocaleString("ca-ES") : "";
  const typeText = force.tipus ? String(force.tipus).trim() : "";
  const segments = [];
  if (amountText) {
    segments.push(amountText);
  }
  if (typeText) {
    segments.push(typeText);
  }
  let base = segments.join(' ');
  const description = force.descripcio ? String(force.descripcio).trim() : "";
  if (!base) {
    base = description;
  } else if (description) {
    base += ' — ' + description;
  }
  return base;
}

function renderPersonInfo(person) {
  if (!person || (!person.nom && !person.origen && !person.rol)) {
    return '';
  }
  const lines = ['<section class="info-subsection">', '  <h4>Figura clau</h4>'];
  if (person.nom) {
    lines.push('  <p class="info-meta">' + person.nom + '</p>');
  }
  const detailLines = [];
  if (person.origen) {
    detailLines.push('<div><dt>Origen</dt><dd>' + person.origen + '</dd></div>');
  }
  if (person.rol) {
    detailLines.push('<div><dt>Rol</dt><dd>' + person.rol + '</dd></div>');
  }
  if (detailLines.length) {
    lines.push('  <dl class="info-meta-grid">' + detailLines.join('') + '</dl>');
  }
  lines.push('</section>');
  return lines.join('\n').trim();
}

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  const normalized = hex.replace('#', '').trim();
  if (normalized.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


const MONTH_KEYWORDS = [
  'gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'
];

function extractOrderValue(voyage, episode, index) {
  const lowerData = (episode.data || '').toLowerCase();
  const yearMatch = lowerData.match(/(1[45]\d{2})/);
  let year;
  if (yearMatch) {
    year = Number(yearMatch[1]);
  } else {
    const fallback = (voyage.anys || '').toLowerCase().match(/(1[45]\d{2})/);
    year = fallback ? Number(fallback[1]) : 1400 + index;
  }
  let month = 6;
  for (let i = 0; i < MONTH_KEYWORDS.length; i++) {
    if (lowerData.includes(MONTH_KEYWORDS[i])) {
      month = i + 1;
      break;
    }
  }
  const dayMatch = lowerData.match(/(?:^|\D)(\d{1,2})(?!\d)/);
  let day = 15;
  if (dayMatch) {
    const value = Number(dayMatch[1]);
    if (value > 0 && value <= 31) {
      day = value;
    }
  }
  return year * 10000 + month * 100 + day + index / 100;
}

function getEpisodeOrderValue(voyage, episode) {
  if (episode && episode.ordre !== undefined && episode.ordre !== null) {
    const numericOrder = Number.parseFloat(episode.ordre);
    if (Number.isFinite(numericOrder)) {
      return numericOrder;
    }
  }
  const tieBreaker = episode?.originalIndex ?? 0;
  return extractOrderValue(voyage, episode, tieBreaker);
}

function sortEpisodesByOrder(episodes, voyage) {
  const context = voyage || { anys: undefined };
  return [...episodes].sort((a, b) => {
    const valueA = getEpisodeOrderValue(context, a);
    const valueB = getEpisodeOrderValue(context, b);
    if (valueA !== valueB) {
      return valueA - valueB;
    }
    const idxA = a?.originalIndex ?? 0;
    const idxB = b?.originalIndex ?? 0;
    return idxA - idxB;
  });
}

const state = {
  map: null,
  voyages: new Map(),
  layers: new Map(),
  routeBounds: new Map(),
  activeVoyages: new Set(),
  infoSection: 'overview',
  timelineData: [],
  timelineIndex: 0,
  autoPlayTimer: null
};

const dom = {
  homeScreen: document.getElementById('home-screen'),
  homeContent: document.querySelector('.home-content'),
  homeGrid: document.getElementById('home-grid'),
  homeAlert: document.getElementById('home-alert'),
  experienceScreen: document.getElementById('experience-screen'),
  selectorGrid: document.getElementById('selector-grid'),
  infoTabs: document.querySelectorAll('.info-tabs button'),
  infoPanel: document.querySelector('.panel.info'),
  infoContent: document.getElementById('info-content'),

  timelineSlider: document.getElementById('timeline-slider'),
  timelineLabel: document.getElementById('timeline-label'),
  timelineLegend: document.getElementById('timeline-legend'),
  autoPlayToggle: document.getElementById('auto-play'),
  resetViewBtn: document.getElementById('reset-view'),
  backHomeBtn: document.getElementById('back-home')
};

if (location.protocol === 'file:') {
  showFileWarning();
}

init();

function setHomeAlert(message = '', tone = 'info') {
  if (!dom.homeAlert) return;
  dom.homeAlert.classList.remove('visible', 'info', 'warning', 'error');
  if (!message) {
    dom.homeAlert.innerHTML = '';
    return;
  }
  dom.homeAlert.innerHTML = message;
  dom.homeAlert.classList.add('visible', tone);
}

function showFileWarning() {
  const instructions = [
    '<strong>Obre l\'app des d\'un servidor local</strong> per carregar mapes i dades.',
    "En una terminal, executa <code>npx serve</code> o <code>python -m http.server</code> dins la carpeta <code>ConquestaAmerica</code>.",
    "Accedeix a l'adreça que aparegui (per exemple <code>http://localhost:3000</code>)."
  ].join('<br>');
  setHomeAlert(instructions, 'warning');
  dom.homeScreen?.classList.add('blocked');
}

async function init() {
  try {
    await loadVoyages();
    initMap();
    buildSelectorGrid();
    renderHomeCards();
    setupHomeInteractions();
    setupPanelEvents();
    if (location.protocol !== 'file:') {
      dom.homeScreen?.classList.remove('blocked');
      setHomeAlert("", 'info');
    }
  } catch (error) {
    console.error('No s’ha pogut iniciar l’aplicació', error);
    setHomeAlert('Hi ha hagut un problema carregant les dades. Revisa la connexió i torna-ho a provar.', 'error');
    dom.homeScreen?.classList.add('blocked');
  }
}

async function loadVoyages() {
  await Promise.all(
    EXPEDITION_CONFIG.map(async (config) => {
      const response = await fetch(`./${config.file}`);
      if (!response.ok) {
        throw new Error(`Error carregant ${config.file}`);
      }
      const json = await response.json();
      const expedicio = json.expedicio || json.viatge;
      if (!expedicio) {
        throw new Error(`El fitxer ${config.file} no conté la clau "expedicio".`);
      }
      const episodis = sortEpisodesByOrder(
        enrichEpisodes(Array.isArray(expedicio.episodis) ? expedicio.episodis : []),
        expedicio
      );
      const label = config.label ?? expedicio.personatge?.nom ?? expedicio.titol ?? config.id;
      const short = config.short ?? expedicio.resum ?? expedicio.finalitat ?? '';
      const portrait = config.portrait ?? expedicio.personatge?.imatge ?? null;

      state.voyages.set(config.id, {
        id: config.id,
        label,
        short,
        color: config.color,
        portrait,
        ...expedicio,
        episodis,
        resum: expedicio.resum ?? short
      });
    })
  );
}

function enrichEpisodes(list) {
  const enriched = list.map((episode, index) => {
    const coords = Array.isArray(episode.lloc?.coordenades) && episode.lloc.coordenades.length === 2
      ? { lat: episode.lloc.coordenades[0], lng: episode.lloc.coordenades[1] }
      : null;
    return {
      ...episode,
      ordre: episode.ordre ?? index + 1,
      coords,
      originalIndex: index
    };
  });

  for (let i = 0; i < enriched.length; i++) {
    if (!enriched[i].coords) {
      const previous = findNeighbourWithCoords(enriched, i, -1);
      const next = findNeighbourWithCoords(enriched, i, 1);
      if (previous && next) {
        enriched[i].coords = {
          lat: (previous.coords.lat + next.coords.lat) / 2,
          lng: (previous.coords.lng + next.coords.lng) / 2
        };
      } else if (previous) {
        enriched[i].coords = { ...previous.coords };
      } else if (next) {
        enriched[i].coords = { ...next.coords };
      } else {
        enriched[i].coords = { lat: 0, lng: 0 };
      }
    }
  }

  return enriched;
}

function findNeighbourWithCoords(list, startIndex, step) {
  let pointer = startIndex + step;
  while (pointer >= 0 && pointer < list.length) {
    if (list[pointer].coords) {
      return list[pointer];
    }
    pointer += step;
  }
  return null;
}

function initMap() {
  state.map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    minZoom: 2,
    maxZoom: 12
  }).setView([20, -45], 3);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: ''
  }).addTo(state.map);
}

function buildSelectorGrid() {
  dom.selectorGrid.innerHTML = '';
  EXPEDITION_CONFIG.forEach((config) => {
    const data = state.voyages.get(config.id);
    if (!data) {
      return;
    }
    const button = document.createElement('button');
    button.dataset.voyage = config.id;
    button.innerHTML = [
      '<span class="label">',
      '  <strong>' + data.label + '</strong>',
      '  <span>' + (data.anys || '') + '</span>',
      '</span>',
      '<span class="dot" style="background:' + config.color + ';"></span>'
    ].join('\n');
    button.addEventListener('click', () => setActiveVoyages([config.id]));
    dom.selectorGrid.appendChild(button);
  });

  const allButton = document.createElement('button');
  allButton.dataset.voyage = 'all';
  allButton.innerHTML = [
    '<span class="label">',
    '  <strong>Totes les expedicions</strong>',
    '  <span>Comparativa global</span>',
    '</span>',
    '<span class="dot" style="background:linear-gradient(135deg,#c95f3d,#0f7b6c,#f1a208,#405f9e,#7b3b8c);"></span>'
  ].join('\n');
  allButton.addEventListener('click', () => setActiveVoyages(EXPEDITION_CONFIG.map((v) => v.id)));
  dom.selectorGrid.appendChild(allButton);
}

function renderHomeCards() {
  if (!dom.homeGrid) {
    return;
  }
  dom.homeGrid.innerHTML = '';
  EXPEDITION_CONFIG.forEach((config) => {
    const data = state.voyages.get(config.id);
    if (!data) {
      return;
    }
    const card = document.createElement('button');
    card.className = 'voyage-card';
    card.dataset.voyage = config.id;
    card.style.setProperty('--card-accent', config.color);
    const portrait = data.portrait || config.portrait;
    const displayName = data.personatge?.nom || data.label;
    const summary = data.resum || data.short || data.finalitat || '';
    const fallback = (displayName || config.id).charAt(0).toUpperCase();
    card.innerHTML = [
      '<span class="card-photo">',
      portrait
        ? '  <img src="' + portrait + '" alt="' + displayName + '">'
        : '  <span class="card-photo__fallback" style="background:var(--card-accent);">' + fallback + '</span>',
      '</span>',
      '<span class="card-body">',
      '  <strong>' + displayName + '</strong>',
      '  <span>' + summary + '</span>',
      data.anys ? '  <em>' + data.anys + '</em>' : '',
      '</span>'
    ].join('\n');
    dom.homeGrid.appendChild(card);
  });
}

function setupHomeInteractions() {
  dom.homeGrid?.addEventListener('click', (event) => {
    const card = event.target.closest('.voyage-card');
    if (!card) {
      return;
    }
    const id = card.dataset.voyage;
    if (!id) { return; }
    enterExperience([id]);
  });

  dom.backHomeBtn.addEventListener('click', exitExperience);
}

function setupPanelEvents() {
  dom.infoTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      dom.infoTabs.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');
      state.infoSection = tab.dataset.section;
      updateInfoPanel();
    });
  });

  dom.timelineSlider.addEventListener('input', (event) => {
    const index = Number(event.target.value);
    updateTimeline(index, { focusMap: true });
  });

  dom.autoPlayToggle.addEventListener('change', () => {
    if (dom.autoPlayToggle.checked) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });

  dom.resetViewBtn?.addEventListener('click', () => centerMapOnSelection());

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.audio-btn');
    if (!button) {
      return;
    }
    const voyageId = button.dataset.voyage;
    const episodeIndex = Number(button.dataset.episode);
    playEpisodeAudio(voyageId, episodeIndex);
  });
}

function refreshAll() {
  renderRoutes();
  updateInfoPanel();
  updateTimelineLegend();
}

function enterExperience(ids) {
  if (dom.homeScreen?.classList.contains('blocked')) {
    setHomeAlert("Per activar l'experiència cal obrir l'app des d'un servidor local.", 'warning');
    return;
  }
  if (state.voyages.size === 0) {
    setHomeAlert("Encara no s'han carregat les dades. Torna-ho a provar.", 'error');
    return;
  }
  setActiveVoyages(ids);
  dom.homeScreen.classList.remove('active');
  dom.experienceScreen.classList.add('active');
  setTimeout(() => state.map?.invalidateSize(), 250);
}

function exitExperience() {
  stopAutoPlay();
  dom.experienceScreen.classList.remove('active');
  dom.homeScreen.classList.add('active');
  state.activeVoyages.clear();
}

function setActiveVoyages(ids) {
  stopAutoPlay();
  state.activeVoyages = new Set(ids);
  updateSelectorHighlight();
  refreshAll();
}

function updateSelectorHighlight() {
  const buttons = dom.selectorGrid.querySelectorAll('button');
  const allSelected = state.activeVoyages.size === EXPEDITION_CONFIG.length;
  buttons.forEach((btn) => {
    const id = btn.dataset.voyage;
    if (id === 'all') {
      btn.classList.toggle('active', allSelected);
    } else {
      btn.classList.toggle('active', state.activeVoyages.has(id));
    }
  });
}

function renderRoutes() {
  state.layers.forEach(({ group }) => group.remove());
  state.layers.clear();
  state.routeBounds.clear();
  state.timelineData = [];

  state.activeVoyages.forEach((id) => {
    const voyage = state.voyages.get(id);
    if (!voyage) {
      return;
    }

    const group = L.layerGroup().addTo(state.map);
    const latLngPoints = voyage.episodis.map((ep) => L.latLng(ep.coords.lat, ep.coords.lng));
    const coords = latLngPoints.map((point) => [point.lat, point.lng]);

    const routeBounds = latLngPoints.length ? L.latLngBounds(latLngPoints) : null;
    const partialBounds = latLngPoints.map((_, idx) => L.latLngBounds(latLngPoints.slice(0, idx + 1)));
    state.routeBounds.set(id, {
      full: routeBounds ? L.latLngBounds(routeBounds.getSouthWest(), routeBounds.getNorthEast()) : null,
      partial: partialBounds.map((bounds) => bounds.pad(0))
    });

    const segments = [];
    for (let i = 0; i < coords.length - 1; i++) {
      const segment = L.polyline([coords[i], coords[i + 1]], {
        color: voyage.color,
        weight: 5,
        opacity: 0.1
      }).addTo(group);
      segments.push(segment);
    }

    const markers = voyage.episodis.map((episode, idx) => {
      const marker = L.marker([episode.coords.lat, episode.coords.lng], {
        icon: createMarkerIcon(voyage.color, idx + 1)
      }).addTo(group);
      marker.setZIndexOffset(1000 - idx * 10);
      marker.bindPopup(createPopupContent(voyage, episode, idx));

      // MODIFICACIÓ: Centrar el mapa amb desplaçament quan s'obre un pop-up
      marker.on('popupopen', () => {
        const targetLatLng = marker.getLatLng();
        const currentZoom = state.map.getZoom();
        
        // Calculem l'offset. Volem el punt al 25% des de baix. El centre és el 50%.
        // L'offset des del centre és 25% de l'alçada del mapa.
        // Per moure el punt d'interès cap avall a la pantalla, hem de moure el centre del mapa cap amunt.
        // Això correspon a un offset de píxels negatiu.
        const mapHeight = state.map.getSize().y;
        const yOffset = mapHeight * -0.25;

        // Convertim el LatLng del marcador a coordenades de píxels
        const targetPoint = state.map.project(targetLatLng, currentZoom);
        // Afegim l'offset per trobar el nou punt central en píxels
        const newCenterPoint = targetPoint.add([0, yOffset]);
        // Convertim el nou punt central de nou a LatLng
        const newCenterLatLng = state.map.unproject(newCenterPoint, currentZoom);

        // Fem servir flyTo per a una animació suau cap al nou centre
        state.map.flyTo(newCenterLatLng, currentZoom, {
            animate: true,
            duration: 0.8 // Durada de l'animació en segons
        });
      });

      marker.on('click', () => {
        const timelineIndex = state.timelineData.findIndex((entry) => entry.voyageId === id && entry.episodeIndex === idx);
        if (timelineIndex >= 0) {
          dom.timelineSlider.value = String(timelineIndex);
          updateTimeline(timelineIndex, { focusMap: false }); // Canviat a false per evitar el centrat automàtic de la línia de temps
        }
      });
      return marker;
    });

    state.layers.set(id, { group, markers, segments });
    animateSegments(segments, voyage.color);

    const configIndex = EXPEDITION_CONFIG.findIndex((cfg) => cfg.id === id);
    const baseOrder = configIndex >= 0 ? configIndex * 1000 : state.timelineData.length * 1000;

    voyage.episodis.forEach((episode, idx) => {
      const boundsData = state.routeBounds.get(id);
      const partial = boundsData?.partial?.[idx];
      state.timelineData.push({
        voyageId: id,
        episodeIndex: idx,
        ordre: episode.ordre,
        title: episode.titol,
        date: episode.data,
        coords: episode.coords,
        color: voyage.color,
        marker: markers[idx],
        bounds: partial ? partial.pad(0.08) : boundsData?.full,
        label: `${voyage.label} · ${episode.titol}`,
        orderValue: baseOrder + idx
      });
    });
  });

  state.timelineData.sort((a, b) => a.orderValue - b.orderValue);

  const max = Math.max(state.timelineData.length - 1, 0);
  dom.timelineSlider.max = String(max);
  state.timelineIndex = 0;
  dom.timelineSlider.value = '0';
  dom.timelineSlider.disabled = state.timelineData.length === 0;
  updateTimeline(0, { focusMap: true, forceFullView: true });
}

function createMarkerIcon(color, number) {
  const html = `<span class="episode-marker" style="background:${color};">${number}</span>`;
  return L.divIcon({
    className: '',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function createPopupContent(voyage, episode, index) {
  const curios = (episode.curiositats || []).map((item) => `<li>${item}</li>`).join('');
  const curiosBlock = curios
    ? `<div class="marker-curios">
        <div class="marker-curios__header">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M10 1.5a4.75 4.75 0 0 0-4.75 4.75c0 1.9 0.97 3.45 2.6 4.5l.15.1V12.9a1.1 1.1 0 0 0 1.1 1.1h1.8a1.1 1.1 0 0 0 1.1-1.1v-2.05l.15-.1c1.63-1.05 2.6-2.6 2.6-4.5A4.75 4.75 0 0 0 10 1.5zm-1.4 13.4a1.4 1.4 0 0 0 2.8 0h-2.8z"/>
          </svg>
          <span>Sabies que...?</span>
        </div>
        <ul class="marker-curios__list">${curios}</ul>
      </div>`
    : '';
  const lloc = episode.lloc?.nom_modern || episode.lloc?.nom_antic || 'Ubicació desconeguda';
  const data = episode.data || voyage.anys;
  return `
    <div class="marker-popup">
      <h3>${episode.titol}</h3>
      <div class="marker-meta">
        <span class="marker-meta__icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" focusable="false"><path fill="currentColor" d="M10 1.5C6.83 1.5 4.3 4 4.3 7.17c0 3.27 2.9 6.7 4.85 8.46a1.3 1.3 0 0 0 1.7 0c1.95-1.76 4.85-5.19 4.85-8.46C15.7 4 13.17 1.5 10 1.5zm0 9a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2z"/></svg>
        </span>
        <span>${lloc} &middot; ${data}</span>
      </div>
      <div class="marker-desc">${episode.descripcio}</div>
      ${curiosBlock}
      <button class="audio-btn" data-voyage="${voyage.id}" data-episode="${index}">
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3 7v6h3l4 4V3L6 7H3zm10 3a2 2 0 0 0-1-1.73v3.46A2 2 0 0 0 13 10zm-1-6.46v1.71a6 6 0 0 1 0 9.5v1.71a7.5 7.5 0 0 0 0-12.92z"/></svg>
        Escolta el relat
      </button>
    </div>
  `;
}

function updateTimeline(index, { focusMap = true, forceFullView = false } = {}) {
  if (state.timelineData.length === 0) {
    dom.timelineLabel.textContent = 'Selecciona un viatge per activar la línia de temps.';
    return;
  }

  state.timelineIndex = index;
  const entry = state.timelineData[index];
  dom.timelineLabel.textContent = entry ? `${entry.title} (${entry.date || ''})` : '';

  state.timelineData.forEach((item, idx) => {
    const markerEl = item.marker.getElement();
    if (!markerEl) {
      return;
    }
    if (idx <= index) {
      markerEl.firstElementChild?.classList.add('active');
      markerEl.firstElementChild?.classList.remove('inactive');
    } else {
      markerEl.firstElementChild?.classList.remove('active');
      markerEl.firstElementChild?.classList.add('inactive');
    }
  });

  state.layers.forEach((layer, voyageId) => {
    const progress = state.timelineData.reduce((acc, item, idx) => {
      if (item.voyageId === voyageId && idx <= index) {
        return Math.max(acc, item.episodeIndex);
      }
      return acc;
    }, -1);

    layer.segments.forEach((segment, segIndex) => {
      segment.setStyle({ opacity: segIndex <= progress - 1 ? 0.9 : 0.15, weight: segIndex <= progress - 1 ? 5 : 4 });
    });
  });

  if (focusMap && entry) {
    adjustMapForEntry(entry, { forceFullView });
    entry.marker.openPopup();
  }
}

function adjustMapForEntry(entry, { forceFullView = false } = {}) {
  const activeIds = Array.from(state.activeVoyages);
  if (activeIds.length === 0) {
    return;
  }

  if (activeIds.length > 1) {
    const combined = getCombinedBounds(activeIds.map((id) => state.routeBounds.get(id)?.full));
    if (combined) {
      focusBounds(combined.pad(0.1), { padding: [96, 96], maxZoom: 5 });
    }
    return;
  }

  const voyageId = entry.voyageId;
  const boundsData = state.routeBounds.get(voyageId);
  if (!boundsData) {
    state.map.panTo([entry.coords.lat, entry.coords.lng], { animate: true, duration: 0.8 });
    return;
  }

  let targetBounds = null;
  if (forceFullView || entry.episodeIndex === 0) {
    targetBounds = boundsData.full ? boundsData.full.pad(0.18) : null;
  } else {
    targetBounds = entry.bounds || boundsData.full;
  }

  if (targetBounds) {
    focusBounds(targetBounds, { padding: [86, 86], maxZoom: 7 });
  } else {
    state.map.panTo([entry.coords.lat, entry.coords.lng], { animate: true, duration: 0.8 });
  }
}

function getCombinedBounds(boundsList = []) {
  const validBounds = boundsList.filter(Boolean);
  if (!validBounds.length) {
    return null;
  }
  const base = validBounds[0];
  const combined = L.latLngBounds(base.getSouthWest(), base.getNorthEast());
  for (let i = 1; i < validBounds.length; i++) {
    combined.extend(validBounds[i]);
  }
  return combined;
}

function focusBounds(bounds, { padding = [80, 80], maxZoom = 7, duration = 0.9, animate = true } = {}) {
  if (!bounds) {
    return;
  }
  const effectiveBounds = bounds.pad(0);
  if (animate) {
    state.map.flyToBounds(effectiveBounds, { padding, maxZoom, duration, easeLinearity: 0.25 });
  } else {
    state.map.fitBounds(effectiveBounds, { padding, maxZoom });
  }
}

function animateSegments(segments, color) {
  if (!segments.length) {
    return;
  }
  const baseOpacity = 0.82;
  segments.forEach((segment, index) => {
    segment.setStyle({ opacity: 0.05, dashArray: '6 18', lineCap: 'round' });
    const delay = index * 220;
    setTimeout(() => {
      segment.setStyle({ opacity: baseOpacity, dashArray: null });
    }, delay + 200);
  });
}

function startAutoPlay() {
  stopAutoPlay(false); // Atura el temporitzador anterior sense desmarcar la casella
  if (state.timelineData.length === 0) {
    dom.autoPlayToggle.checked = false;
    return;
  }
  state.autoPlayTimer = setInterval(() => {
    let next = state.timelineIndex + 1;
    if (next >= state.timelineData.length) {
      stopAutoPlay(); // Atura i desmarca la casella al final
      return;
    }
    dom.timelineSlider.value = String(next);
    updateTimeline(next, { focusMap: true });
  }, 2800);
}

function stopAutoPlay(updateToggle = true) {
  if (state.autoPlayTimer) {
    clearInterval(state.autoPlayTimer);
    state.autoPlayTimer = null;
  }
  if (updateToggle) {
    dom.autoPlayToggle.checked = false;
  }
}

function updateInfoPanel() {
  const voyages = Array.from(state.activeVoyages)
    .map((id) => state.voyages.get(id))
    .filter(Boolean);
  if (voyages.length === 0) {
    applyInfoTone([]);
    dom.infoContent.innerHTML = '<p>Tria un viatge per veure la informació essencial.</p>';
    return;
  }

  applyInfoTone(voyages);
  if (voyages.length === 1) {
    const voyage = voyages[0];
    dom.infoContent.innerHTML = renderSingleInfo(voyage, state.infoSection);
    return;
  }

  dom.infoContent.innerHTML = renderComparativeInfo(voyages, state.infoSection);
}


function renderSingleInfo(voyage, section) {
  if (section === 'overview') {
    const objective = voyage.finalitat ? String(voyage.finalitat).trim() : '';
    if (!objective) {
      return '<p class="info-empty">Sense objectiu registrat.</p>';
    }
    const shortLabel = voyage.short ? String(voyage.short).trim() : '';
    const lines = [
      '<article class="info-block info-block--objective">',
      '  <header class="info-block__header">',
      '    <span class="info-icon info-icon--large" aria-hidden="true">' + SECTION_ICONS.overview + '</span>',
      '    <div class="info-block__title">',
      '      <p class="info-meta">Objectiu principal</p>',
      shortLabel ? '      <strong>' + shortLabel + '</strong>' : '',
      '    </div>',
      '  </header>',
      '  <p class="info-objective">' + objective + '</p>',
      '</article>'
    ];
    return lines.filter(Boolean).join('\n');
  }

  if (section === 'forces') {
    const forcesList = formatIconList((voyage.forces || []).map((force) => ({ icon: SECTION_ICONS.forces, text: formatForceText(force) })));
    const alliesList = formatListItems(voyage.aliats || [], EXTRA_ICONS.allies);
    const strategiesList = formatListItems(voyage.estrategies || [], EXTRA_ICONS.strategies);
    const groups = [
      renderInfoGroup('Forces militars', forcesList, 'Sense dades logístiques disponibles.'),
      renderInfoGroup('Aliances principals', alliesList, 'Sense aliances registrades.'),
      renderInfoGroup('Estratègies aplicades', strategiesList, 'Sense estratègies documentades.')
    ];
    return '<div class="info-forces">' + groups.join('\n') + '</div>';
  }

  if (section === 'challenges') {
    const issues = formatListItems(voyage.problemes_generals || [], SECTION_ICONS.challenges);
    return issues
      ? '<ul class="info-list">' + issues + '</ul>'
      : '<p class="info-empty">Sense incidències registrades.</p>';
  }

  if (section === 'outcome') {
    const results = formatListItems(voyage.resultats || [], SECTION_ICONS.outcome);
    return results
      ? '<ul class="info-list">' + results + '</ul>'
      : '<p class="info-empty">Sense resultats registrats.</p>';
  }

  return '';
}

function renderComparativeInfo(voyages, section) {
  const ordered = orderVoyagesByConfig(voyages);
  if (!ordered.length) {
    return '';
  }

  const summarySections = ['overview', 'forces', 'challenges', 'outcome'];
  if (ordered.length === EXPEDITION_CONFIG.length && summarySections.includes(section)) {
    return renderAllVoyagesSection(ordered, section);
  }

  return ordered.map((voyage) => {
    const subjectTag = renderSubjectTag(voyage);
    if (section === 'overview') {
      const summary = voyage.resum || voyage.short || voyage.finalitat || 'Sense resum disponible.';
      const blocks = [
        '<article class="info-block info-block--compact">',
        subjectTag ? '  ' + subjectTag : '',
        voyage.anys ? '  <p class="info-meta">' + voyage.anys + '</p>' : '',
        '  <p>' + summary + '</p>',
        '</article>'
      ].filter(Boolean);
      return blocks.join('\n');
    }

    if (section === 'forces') {
      const entries = [];
      (voyage.forces || []).slice(0, 2).forEach((force) => {
        const text = formatForceText(force);
        if (text) { entries.push({ icon: SECTION_ICONS.forces, text }); }
      });
      (voyage.aliats || []).slice(0, 1).forEach((ally) => {
        if (ally) { entries.push({ icon: EXTRA_ICONS.allies, text: ally }); }
      });
      const list = formatIconList(entries);
      const content = list
        ? '<ul class="info-list">' + list + '</ul>'
        : '<p class="info-empty">Sense dades disponibles.</p>';
      const blocks = [
        '<article class="info-block info-block--compact">',
        subjectTag ? '  ' + subjectTag : '',
        '  ' + content,
        '</article>'
      ].filter(Boolean);
      return blocks.join('\n');
    }

    if (section === 'challenges') {
      const list = formatListItems((voyage.problemes_generals || []).slice(0, 2), SECTION_ICONS.challenges);
      const content = list
        ? '<ul class="info-list">' + list + '</ul>'
        : '<p class="info-empty">Sense incidències registrades.</p>';
      const blocks = [
        '<article class="info-block info-block--compact">',
        subjectTag ? '  ' + subjectTag : '',
        '  ' + content,
        '</article>'
      ].filter(Boolean);
      return blocks.join('\n');
    }
    if (section === 'outcome') {
      const list = formatListItems((voyage.resultats || []).slice(0, 2), SECTION_ICONS.outcome);
      const content = list
        ? '<ul class="info-list">' + list + '</ul>'
        : '<p class="info-empty">Sense resultats registrats.</p>';
      const blocks = [
        '<article class="info-block info-block--compact">',
        subjectTag ? '  ' + subjectTag : '',
        '  ' + content,
        '</article>'
      ].filter(Boolean);
      return blocks.join('\n');
    }
    return '';
  }).join('');
}


function applyInfoTone(voyages) {
  const tone = voyages.length === 1 ? 'single' : voyages.length > 1 ? 'multi' : 'none';
  dom.infoContent.dataset.tone = tone;
  if (dom.infoPanel) {
    dom.infoPanel.dataset.tone = tone;
  }

  if (voyages.length === 1) {
    const active = voyages[0];
    dom.infoContent.dataset.subject = active.id;
    dom.infoPanel?.setAttribute('data-subject', active.id);

    const color = active.color;
    const soft = hexToRgba(color, 0.26);
    const softer = hexToRgba(color, 0.12);
    dom.infoPanel?.style.setProperty('--panel-accent', color);
    dom.infoPanel?.style.setProperty('--panel-accent-soft', soft);
    dom.infoPanel?.style.setProperty('--tone-color', color);
    dom.infoPanel?.style.setProperty('--tone-soft', soft);
    dom.infoPanel?.style.setProperty('--tone-softer', softer);

    dom.infoContent.style.setProperty('--tone-color', color);
    dom.infoContent.style.setProperty('--tone-soft', soft);
    dom.infoContent.style.setProperty('--tone-softer', softer);
  } else {
    dom.infoContent.removeAttribute('data-subject');
    dom.infoPanel?.removeAttribute('data-subject');

    dom.infoPanel?.style.removeProperty('--panel-accent');
    dom.infoPanel?.style.removeProperty('--panel-accent-soft');

    dom.infoContent.style.removeProperty('--tone-color');
    dom.infoContent.style.removeProperty('--tone-soft');
    dom.infoContent.style.removeProperty('--tone-softer');
  }
}

function playEpisodeAudio(voyageId, episodeIndex) {
  const voyage = state.voyages.get(voyageId);
  if (!voyage) return;
  const episode = voyage.episodis[episodeIndex];
  if (!episode) return;
  const curios = (episode.curiositats || []).slice(0, 1).join('. ');
  const text = `${episode.titol}. ${episode.descripcio}. ${curios}`;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ca-ES';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }
}

function centerMapOnSelection({ animate = true } = {}) {
  const activeIds = Array.from(state.activeVoyages);
  if (activeIds.length === 0) {
    return;
  }
  const combined = getCombinedBounds(activeIds.map((id) => state.routeBounds.get(id)?.full));
  if (!combined) {
    return;
  }
  focusBounds(combined.pad(0.1), {
    padding: [96, 96],
    maxZoom: activeIds.length > 1 ? 5 : 7,
    duration: animate ? 0.9 : 0.0,
    animate
  });
}

function updateTimelineLegend() {
  dom.timelineLegend.innerHTML = '';
  state.activeVoyages.forEach((id) => {
    const voyage = state.voyages.get(id);
    const item = document.createElement('span');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-swatch" style="background:${voyage.color}"></span>${voyage.label}`;
    dom.timelineLegend.appendChild(item);
  });
}




