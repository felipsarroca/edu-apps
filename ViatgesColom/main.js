const VOYAGE_META = [
  { id: 'viatge1', file: 'assets/1viatge.json', color: '#0ea5e9' },
  { id: 'viatge2', file: 'assets/2viatge.json', color: '#f97316' },
  { id: 'viatge3', file: 'assets/3viatge.json', color: '#8b5cf6' },
  { id: 'viatge4', file: 'assets/4viatge.json', color: '#22c55e' },
]

const ALL_CARD = {
  id: 'all',
  label: 'Tots els viatges',
  anys: '1492-1504',
  finalitat: 'Superposa les quatre expedicions de Colom per comparar-ne rutes i conflictes.',
  color: '#facc15',
}

const state = {
  selectedId: 'viatge1',
  showAll: false,
  activeEpisodeIndex: 0,
}

const statusEl = document.querySelector('[data-status]')
const selectorGridEl = document.querySelector('[data-selector-grid]')
const timelineTitleEl = document.querySelector('[data-timeline-title]')
const timelineListEl = document.querySelector('[data-timeline-list]')
const infoSummaryEl = document.querySelector('[data-info-summary]')
const infoEpisodeEl = document.querySelector('[data-info-episode]')
const mapHintEl = document.querySelector('[data-map-hint]')

const panelElements = new Map(
  Array.from(document.querySelectorAll('[data-panel]')).map((panel) => [panel.dataset.panel, panel]),
)
const panelToggleButtons = Array.from(document.querySelectorAll('[data-toggle-panel]'))
const panelCloseButtons = Array.from(document.querySelectorAll('[data-close-panel]'))

let activePanelId = null

const openPanels = new Set()
panelToggleButtons.forEach((button) => {
  button.setAttribute('aria-pressed', 'false')
})

function refreshToggleButtons() {
  panelToggleButtons.forEach((button) => {
    const panelId = button.dataset.togglePanel
    const isActive = openPanels.has(panelId)
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false')
    button.classList.toggle('is-active', isActive)
  })
}

function showPanel(panelId) {
  const panel = panelElements.get(panelId)
  if (!panel) {
    return
  }
  panel.hidden = false
  panel.setAttribute('data-panel-open', 'true')
  openPanels.add(panelId)
  activePanelId = panelId
  refreshToggleButtons()
}

function hidePanel(panelId) {
  const panel = panelElements.get(panelId)
  if (!panel) {
    return
  }
  panel.hidden = true
  panel.removeAttribute('data-panel-open')
  openPanels.delete(panelId)
  if (activePanelId === panelId) {
    activePanelId = Array.from(openPanels).pop() ?? null
  }
  refreshToggleButtons()
}

function togglePanel(panelId) {
  if (openPanels.has(panelId)) {
    hidePanel(panelId)
  } else {
    showPanel(panelId)
  }
}

function ensurePanel(panelId) {
  if (!openPanels.has(panelId)) {
    showPanel(panelId)
  }
}

panelToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    togglePanel(button.dataset.togglePanel)
  })
})

panelCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    hidePanel(button.dataset.closePanel)
  })
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activePanelId) {
    hidePanel(activePanelId)
  }
})

const map = L.map('map', {
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: true,
})
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
}).addTo(map)

let voyages = []
let mapLayers = []
let mapReady = false

function withAlpha(hex, alpha = '33') {
  return /^#([0-9a-fA-F]{6})$/.test(hex) ? `${hex}${alpha}` : hex
}

function getVoyage(id) {
  return voyages.find((voyage) => voyage.id === id) ?? voyages[0]
}

function clampActiveEpisode() {
  const voyage = getVoyage(state.selectedId)
  if (!voyage) {
    state.activeEpisodeIndex = 0
    return
  }
  if (state.activeEpisodeIndex >= voyage.episodis.length) {
    state.activeEpisodeIndex = voyage.episodis.length - 1
  }
  if (state.activeEpisodeIndex < 0) {
    state.activeEpisodeIndex = 0
  }
}

function setState(partial) {
  Object.assign(state, partial)
  clampActiveEpisode()
  renderAll()
}

async function loadVoyages() {
  statusEl.textContent = 'Carregant dades dels viatges...'
  const loaded = []
  for (const meta of VOYAGE_META) {
    const response = await fetch(meta.file)
    if (!response.ok) {
      throw new Error(`No s'ha pogut carregar ${meta.file}`)
    }
    const data = await response.json()
    const viatge = data.viatge
    loaded.push({
      id: meta.id,
      color: meta.color,
      titol: viatge.titol,
      anys: viatge.anys,
      finalitat: viatge.finalitat,
      vaixells: viatge.vaixells ?? [],
      episodis: [...(viatge.episodis ?? [])].sort((a, b) => a.ordre - b.ordre),
      problemes_generals: viatge.problemes_generals ?? [],
      resultats: viatge.resultats ?? [],
    })
  }
  voyages = loaded
  statusEl.textContent = ''
  clampActiveEpisode()
  renderAll()
  mapReady = true
  setTimeout(() => {
    map.invalidateSize()
    updateMap()
  }, 120)
}

function renderSelector() {
  selectorGridEl.innerHTML = ''
  const cards = voyages.map((voyage) => ({
    id: voyage.id,
    label: voyage.titol,
    anys: voyage.anys,
    finalitat: voyage.finalitat,
    color: voyage.color,
  }))
  cards.push(ALL_CARD)

  cards.forEach((card) => {
    const button = document.createElement('button')
    button.className = 'selector__card'
    button.style.setProperty('--card-color', card.color)

    const isAll = card.id === 'all'
    const isSelected = isAll ? state.showAll : state.selectedId === card.id

    if (isSelected) {
      button.classList.add('selector__card--active')
      button.style.borderColor = card.color
      button.style.boxShadow = `0 20px 45px -30px ${card.color}`
      button.style.background = `linear-gradient(135deg, ${withAlpha(card.color, '2a')}, rgba(15, 23, 42, 0.62))`
    }

    button.addEventListener('click', () => {
      if (isAll) {
        setState({ showAll: true, activeEpisodeIndex: 0 })
      } else {
        setState({ selectedId: card.id, showAll: false, activeEpisodeIndex: 0 })
      }
      ensurePanel('info')
    })

    const badge = document.createElement('div')
    badge.className = 'selector__badge'
    badge.style.background = withAlpha(card.color, '28')

    const body = document.createElement('div')
    body.className = 'selector__card-body'

    const title = document.createElement('h3')
    title.textContent = card.label

    const years = document.createElement('p')
    years.className = 'selector__years'
    years.textContent = card.anys

    const summary = document.createElement('p')
    summary.className = 'selector__summary'
    summary.textContent = card.finalitat

    body.append(title, years, summary)
    button.append(badge, body)
    selectorGridEl.append(button)
  })
}

function renderTimeline() {
  const voyage = getVoyage(state.selectedId)
  if (!voyage) {
    timelineTitleEl.textContent = 'Sense dades disponibles'
    timelineListEl.innerHTML = ''
    return
  }

  timelineTitleEl.textContent = `${voyage.titol} · ${voyage.anys}`
  timelineListEl.innerHTML = ''

  voyage.episodis.forEach((episode, index) => {
    const item = document.createElement('button')
    item.className = 'timeline__item'

    if (index === state.activeEpisodeIndex) {
      item.classList.add('timeline__item--active')
      item.style.borderColor = voyage.color
      item.style.boxShadow = `0 18px 45px -32px ${withAlpha(voyage.color, '66')}`
    }

    const title = document.createElement('h3')
    title.textContent = `${episode.ordre}. ${episode.titol}`

    const meta = document.createElement('div')
    meta.className = 'timeline__meta'

    const dateTag = document.createElement('span')
    dateTag.textContent = episode.data

    const placeTag = document.createElement('span')
    placeTag.textContent = episode.lloc?.nom_modern ?? 'Ubicació desconeguda'

    meta.append(dateTag, placeTag)

    const description = document.createElement('p')
    description.textContent = episode.descripcio

    item.append(title, meta, description)
    item.addEventListener('click', () => {
      ensurePanel('info')
      if (state.activeEpisodeIndex !== index) {
        setState({ activeEpisodeIndex: index })
      } else {
        renderInfo()
      }
    })

    timelineListEl.append(item)
  })
}

function renderInfo() {
  const voyage = getVoyage(state.selectedId)
  if (!voyage) {
    infoSummaryEl.textContent = ''
    infoEpisodeEl.textContent = ''
    return
  }

  infoSummaryEl.innerHTML = ''

  const title = document.createElement('h2')
  title.textContent = voyage.titol

  const years = document.createElement('p')
  years.className = 'info__years'
  years.textContent = voyage.anys

  const goalSection = document.createElement('div')
  goalSection.className = 'info__summary-section'
  const goalTitle = document.createElement('h3')
  goalTitle.textContent = 'Objectiu principal'
  const goalText = document.createElement('p')
  goalText.textContent = voyage.finalitat
  goalSection.append(goalTitle, goalText)

  const shipSection = document.createElement('div')
  shipSection.className = 'info__summary-section'
  const shipTitle = document.createElement('h3')
  shipTitle.textContent = 'Vaixells i destí'
  const shipList = document.createElement('ul')
  shipList.className = 'info__list'
  if (voyage.vaixells.length) {
    voyage.vaixells.forEach((ship) => {
      const item = document.createElement('li')
      item.textContent = `${ship.nom} · ${ship.tipus} · ${ship.desti}`
      shipList.append(item)
    })
  } else {
    const empty = document.createElement('li')
    empty.textContent = 'Sense informació disponible'
    shipList.append(empty)
  }
  shipSection.append(shipTitle, shipList)

  const resultsSection = document.createElement('div')
  resultsSection.className = 'info__summary-section'
  const resultsTitle = document.createElement('h3')
  resultsTitle.textContent = 'Resultats clau'
  const resultsList = document.createElement('ul')
  resultsList.className = 'info__list'
  if (voyage.resultats.length) {
    voyage.resultats.forEach((result) => {
      const item = document.createElement('li')
      item.textContent = result
      resultsList.append(item)
    })
  }
  resultsSection.append(resultsTitle, resultsList)

  const issuesSection = document.createElement('div')
  issuesSection.className = 'info__summary-section'
  const issuesTitle = document.createElement('h3')
  issuesTitle.textContent = 'Problemes generals'
  const issuesList = document.createElement('ul')
  issuesList.className = 'info__list'
  if (voyage.problemes_generals.length) {
    voyage.problemes_generals.forEach((issue) => {
      const item = document.createElement('li')
      item.textContent = issue
      issuesList.append(item)
    })
  } else {
    const item = document.createElement('li')
    item.textContent = 'No s\'han registrat incidències globals.'
    issuesList.append(item)
  }
  issuesSection.append(issuesTitle, issuesList)

  infoSummaryEl.append(title, years, goalSection, shipSection, resultsSection, issuesSection)

  const episode = voyage.episodis[state.activeEpisodeIndex]
  infoEpisodeEl.innerHTML = ''

  if (!episode) {
    const empty = document.createElement('p')
    empty.textContent = 'Selecciona un episodi per veure\'n el detall.'
    infoEpisodeEl.append(empty)
    return
  }

  const epTitle = document.createElement('h3')
  epTitle.textContent = `${episode.ordre}. ${episode.titol}`

  const epMeta = document.createElement('p')
  epMeta.className = 'info__episode-meta'
  const lloc = episode.lloc?.nom_modern ?? 'Ubicació desconeguda'
  epMeta.textContent = `${episode.data} · ${lloc}`

  const epDescription = document.createElement('p')
  epDescription.textContent = episode.descripcio

  infoEpisodeEl.append(epTitle, epMeta, epDescription)

  if (episode.curiositats?.length) {
    const curiositatsWrap = document.createElement('div')
    curiositatsWrap.className = 'info__chips'
    episode.curiositats.forEach((item) => {
      const chip = document.createElement('span')
      chip.className = 'info__chip'
      chip.textContent = item
      curiositatsWrap.append(chip)
    })
    infoEpisodeEl.append(curiositatsWrap)
  }

  if (episode.problemes?.length) {
    const alertes = document.createElement('div')
    alertes.className = 'info__alertes'
    const titleAlertes = document.createElement('h4')
    titleAlertes.textContent = 'Alertes i dificultats'
    const list = document.createElement('ul')
    episode.problemes.forEach((problema) => {
      const li = document.createElement('li')
      li.textContent = problema
      list.append(li)
    })
    alertes.append(titleAlertes, list)
    infoEpisodeEl.append(alertes)
  }

  if (episode.resolucio) {
    const resolucio = document.createElement('div')
    resolucio.className = 'info__resolucio'
    const strong = document.createElement('strong')
    strong.textContent = 'Resolució:'
    const text = document.createElement('p')
    text.textContent = episode.resolucio
    resolucio.append(strong, text)
    infoEpisodeEl.append(resolucio)
  }
}

function createPopupContent(episode, voyage) {
  const curiositats = episode.curiositats?.length
    ? `<ul class="map-popup__list">${episode.curiositats.map((item) => `<li>${item}</li>`).join('')}</ul>`
    : ''
  const problemes = episode.problemes?.length
    ? `<div class="map-popup__alertes"><p>Alertes:</p><ul>${episode.problemes
        .map((item) => `<li>${item}</li>`)
        .join('')}</ul></div>`
    : ''
  const resolucio = episode.resolucio
    ? `<p class="map-popup__resolucio"><strong>Resolució:</strong> ${episode.resolucio}</p>`
    : ''

  return `
    <div class="map-popup">
      <p class="map-popup__tag" style="color: ${voyage.color}">${voyage.titol}</p>
      <h3>${episode.titol}</h3>
      <p class="map-popup__meta">${episode.data} · ${episode.lloc?.nom_modern ?? 'Ubicació desconeguda'}</p>
      <p>${episode.descripcio}</p>
      ${curiositats}
      ${problemes}
      ${resolucio}
    </div>
  `
}

function updateMap() {
  if (!mapReady) {
    return
  }
  mapLayers.forEach((layer) => {
    map.removeLayer(layer)
  })
  mapLayers = []

  const focusVoyage = getVoyage(state.selectedId)
  if (!focusVoyage) {
    return
  }
  const voyagesToDraw = state.showAll ? voyages : [focusVoyage]
  const allCoords = []

  voyagesToDraw.forEach((voyage) => {
    const coords = voyage.episodis
      .map((episode) => episode.lloc?.coordenades)
      .filter((value) => Array.isArray(value))

    if (coords.length) {
      allCoords.push(...coords)
      const opacity = state.showAll && voyage.id !== focusVoyage.id ? 0.4 : 0.78
      const weight = voyage.id === focusVoyage.id ? 4.5 : 3

      const polyline = L.polyline(coords, {
        color: voyage.color,
        weight,
        opacity,
        dashArray: state.showAll && voyage.id !== focusVoyage.id ? '6 10' : undefined,
      }).addTo(map)
      mapLayers.push(polyline)

      if (voyage.id === focusVoyage.id) {
        const upto = Math.min(state.activeEpisodeIndex + 1, coords.length)
        if (upto >= 2) {
          const highlight = L.polyline(coords.slice(0, upto), {
            color: voyage.color,
            weight: 6,
            opacity: 0.95,
          }).addTo(map)
          mapLayers.push(highlight)
        }
      }
    }

    voyage.episodis.forEach((episode, index) => {
      const point = episode.lloc?.coordenades
      if (!Array.isArray(point)) {
        return
      }
      const isFocus = voyage.id === focusVoyage.id
      const isActive = isFocus && index === state.activeEpisodeIndex
      const isVisited = isFocus && index <= state.activeEpisodeIndex

      const marker = L.circleMarker(point, {
        radius: isActive ? 10 : isVisited ? 7 : 5,
        color: voyage.color,
        weight: isActive ? 4 : 2,
        fillColor: voyage.color,
        fillOpacity: isFocus ? (isVisited ? 0.9 : 0.6) : 0.45,
      }).addTo(map)

      marker.bindPopup(createPopupContent(episode, voyage), {
        maxWidth: 320,
      })

      if (isFocus) {
        marker.bindTooltip(episode.titol, {
          permanent: isActive,
          direction: 'top',
          offset: [0, -12],
          opacity: 0.92,
        })
      }

      marker.on('click', () => {
        if (isFocus) {
          ensurePanel('info')
          if (state.activeEpisodeIndex !== index) {
            setState({ activeEpisodeIndex: index })
          } else {
            renderInfo()
          }
        }
      })

      mapLayers.push(marker)
    })
  })

  if (allCoords.length) {
    const bounds = L.latLngBounds(allCoords)
    map.fitBounds(bounds, { padding: [48, 48] })
  } else {
    map.setView([20, -40], 3)
  }

  if (mapHintEl) {
    mapHintEl.textContent = state.showAll
      ? 'Comparativa de rutes (1492-1504). Obre la cronologia per veure els episodis sincronitzats.'
      : `${focusVoyage.titol} · ${focusVoyage.anys}. Obre els panells per aprofundir en la narració.`
  }
}

function renderAll() {
  renderSelector()
  renderTimeline()
  renderInfo()
  updateMap()
}

window.addEventListener('resize', () => {
  if (mapReady) {
    map.invalidateSize()
  }
})

loadVoyages().catch((error) => {
  console.error(error)
  statusEl.textContent = 'No s\'han pogut carregar les dades. Recarrega la pàgina o revisa la ruta dels fitxers.'
})

