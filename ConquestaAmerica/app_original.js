const VOYAGE_CONFIG = [
  { id: '1', label: '1r viatge', short: 'Descobriment', color: '#ff8a3d', file: '1viatge.json' },
  { id: '2', label: '2n viatge', short: 'Colonització', color: '#00c2c7', file: '2viatge.json' },
  { id: '3', label: '3r viatge', short: 'Sud-amèrica', color: '#7c5cff', file: '3viatge.json' },
  { id: '4', label: '4t viatge', short: 'Declivi', color: '#5bd85b', file: '4viatge.json' }
];

const SECTION_ICONS = {
  overview: '📜',
  ships: '⛵',
  issues: '⚠️',
  outcome: '🏁'
};

function formatListItems(items, icon) {
  if (!items || !items.length) {
    return '';
  }
  return items.map((text) => `<li><span class="info-icon">${icon}</span><span>${text}</span></li>`).join('');
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
    "En una terminal, executa <code>npx serve</code> o <code>python -m http.server</code> dins la carpeta <code>ViatgesColom</code>.",
    "Accedeix a l\'adreça que aparegui (per exemple <code>http://localhost:3000</code>)."
  ].join('<br>');
  setHomeAlert(instructions, 'warning');
  dom.homeScreen?.classList.add('blocked');
}

async function init() {
  try {
    await loadVoyages();
    initMap();
    buildSelectorGrid();
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
    VOYAGE_CONFIG.map(async (config) => {
      const response = await fetch(`./${config.file}`);
      if (!response.ok) {
        throw new Error(`Error carregant ${config.file}`);
      }
      const json = await response.json();
      const viatge = json.viatge;
      state.voyages.set(config.id, {
        id: config.id,
        label: config.label,
        short: config.short,
        color: config.color,
        ...viatge,
        episodis: enrichEpisodes(viatge.episodis)
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
      coords
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
  VOYAGE_CONFIG.forEach((config) => {
    const data = state.voyages.get(config.id);
    const button = document.createElement('button');
    button.dataset.voyage = config.id;
    button.innerHTML = `
      <span class="label">
        <strong>${data.label}</strong>
        <span>${data.anys}</span>
      </span>
      <span class="dot" style="background:${config.color};"></span>
    `;
    button.addEventListener('click', () => setActiveVoyages([config.id]));
    dom.selectorGrid.appendChild(button);
  });

  const allButton = document.createElement('button');
  allButton.dataset.voyage = 'all';
  allButton.innerHTML = `
    <span class="label">
      <strong>Tots els viatges</strong>
      <span>Comparativa global</span>
    </span>
    <span class="dot" style="background:linear-gradient(135deg,#ff8a3d,#00c2c7,#7c5cff,#5bd85b);"></span>
  `;
  allButton.addEventListener('click', () => setActiveVoyages(VOYAGE_CONFIG.map((v) => v.id)));
  dom.selectorGrid.appendChild(allButton);
}

function setupHomeInteractions() {
  document.querySelectorAll('#home-screen .voyage-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.dataset.viatge;
      if (!id) return;
      const selection = id === 'all' ? VOYAGE_CONFIG.map((v) => v.id) : [id];
      enterExperience(selection);
    });
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

  dom.resetViewBtn.addEventListener('click', () => centerMapOnSelection());

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.audio-btn');
    if (!button) return;
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
    setHomeAlert("Encara no s'han carregat les dades dels viatges. Torna-ho a provar.", 'error');
    return;
  }
  setActiveVoyages(ids);
  dom.homeScreen.classList.remove('active');
  dom.experienceScreen.classList.add('active');
  setTimeout(() => {
    state.map.invalidateSize();
  }, 250);
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
  const allSelected = state.activeVoyages.size === VOYAGE_CONFIG.length;
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
        orderValue: extractOrderValue(voyage, episode, idx)
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
  dom.infoContent.innerHTML = voyages.length === 1
    ? renderSingleInfo(voyages[0], state.infoSection)
    : renderComparativeInfo(voyages, state.infoSection);
}


function renderSingleInfo(voyage, section) {
  switch (section) {
    case 'overview':
      return `
        <article class="info-block">
          <div class="info-block__header">
            <span class="info-icon info-icon--large">${SECTION_ICONS.overview}</span>
            <div>
              <h3>${voyage.titol}</h3>
              <p class="info-meta">${voyage.anys}</p>
            </div>
          </div>
          <p>${voyage.finalitat}</p>
        </article>
      `;
    case 'ships': {
      const items = (voyage.vaixells || []).map((ship) => `<strong>${ship.nom}</strong> · ${ship.tipus} · ${getShipDestination(ship)}`);
      const list = formatListItems(items, SECTION_ICONS.ships);
      return `${list ? `<ul class="info-list">${list}</ul>` : '<p class="info-empty">No hi ha dades de vaixells.</p>'}`;
    }
    case 'issues': {
      const list = formatListItems(voyage.problemes_generals || [], SECTION_ICONS.issues);
      return `${list ? `<ul class="info-list">${list}</ul>` : '<p class="info-empty">No s&amp;#39;han registrat problemes.</p>'}`;
    }
    case 'outcome': {
      const list = formatListItems(voyage.resultats || [], SECTION_ICONS.outcome);
      return `${list ? `<ul class="info-list">${list}</ul>` : '<p class="info-empty">Encara no hi ha conclusions.</p>'}`;
    }
    default:
      return '';
  }
}

function renderComparativeInfo(voyages, section) {
  return voyages.map((voyage) => {
    const colorStyle = `style="color:${voyage.color}"`;
    if (section === 'overview') {
      return `
        <article class="info-block">
          <div class="info-block__header">
            <span class="info-icon info-icon--large">${SECTION_ICONS.overview}</span>
            <div>
              <h3 ${colorStyle}>${voyage.label}</h3>
              <p class="info-meta">${voyage.anys}</p>
            </div>
          </div>
          <p>${voyage.finalitat}</p>
        </article>
      `;
    }

    if (section === 'ships') {
      const items = (voyage.vaixells || []).slice(0, 1).map((ship) => `<strong>${ship.nom}</strong> · ${ship.tipus} · ${getShipDestination(ship)}`);
      const list = formatListItems(items, SECTION_ICONS.ships);
      return `
        <article class="info-block">
          <div class="info-block__header">
            <h3 ${colorStyle}>${voyage.label}</h3>
          </div>
          ${list ? `<ul class="info-list">${list}</ul>` : '<p class="info-empty">Sense vaixells registrats.</p>'}
        </article>
      `;
    }

    if (section === 'issues') {
      const list = formatListItems((voyage.problemes_generals || []).slice(0, 1), SECTION_ICONS.issues);
      return `
        <article class="info-block">
          <div class="info-block__header">
            <h3 ${colorStyle}>${voyage.label}</h3>
          </div>
          ${list ? `<ul class="info-list">${list}</ul>` : '<p class="info-empty">No s&amp;#39;han detectat incidències.</p>'}
        </article>
      `;
    }

    if (section === 'outcome') {
      const list = formatListItems((voyage.resultats || []).slice(0, 1), SECTION_ICONS.outcome);
      return `
        <article class="info-block">
          <div class="info-block__header">
            <h3 ${colorStyle}>${voyage.label}</h3>
          </div>
          ${list ? `<ul class="info-list">${list}</ul>` : '<p class="info-empty">Resultats pendents.</p>'}
        </article>
      `;
    }

    return '';
  }).join('');
}

function applyInfoTone(voyages) {
  const tone = voyages.length === 1 ? voyages[0].id : voyages.length > 1 ? 'multi' : 'none';
  dom.infoContent.dataset.tone = tone;
  if (dom.infoPanel) {
    dom.infoPanel.dataset.tone = tone;
  }

  if (voyages.length === 1) {
    const color = voyages[0].color;
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
    dom.infoPanel?.style.removeProperty('--panel-accent');
    dom.infoPanel?.style.removeProperty('--panel-accent-soft');

    dom.infoContent.style.removeProperty('--tone-color');
    dom.infoContent.style.removeProperty('--tone-soft');
    dom.infoContent.style.removeProperty('--tone-softer');
  }
}

function getShipDestination(ship) {
  return ship.desti || 'Destí no especificat';
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
