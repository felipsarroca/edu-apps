// App: Taula periòdica dinàmica
// Dades: data/elements.json (Bowserinator - PeriodicTableJSON)

const state = {
  elements: [],
  mode: 'blank',
};

// Noms en català (accepta tant objecte {"H":"Hidrogen"} com array [{Key:"H", Value:"Hidrogen"}])
let PT_NAMES_CA = null;
function getNameCA(symbol, fallback) {
  if (typeof window !== 'undefined' && window.PT_NOMS_CA) {
    if (!PT_NAMES_CA) {
      if (Array.isArray(window.PT_NOMS_CA)) {
        PT_NAMES_CA = {};
        for (const row of window.PT_NOMS_CA) {
          const k = row.Key || row.symbol || row.sym;
          const v = row.Value || row.name_ca || row.NameCA || row.name || row.ValueCA;
          if (k && v) PT_NAMES_CA[k] = v;
        }
      } else if (typeof window.PT_NOMS_CA === 'object') {
        PT_NAMES_CA = window.PT_NOMS_CA;
      } else {
        PT_NAMES_CA = {};
      }
    }
    if (PT_NAMES_CA[symbol]) return PT_NAMES_CA[symbol];
  }
  return fallback;
}

const modeMeta = {
  blank: { label: 'en blanc', icon: '—' },
  families: { label: 'famílies / grups', icon: 'F' },
  blocks: { label: 'blocs electrònics', icon: 'b' },
  valence: { label: 'valència', icon: 'v' },
  electronegativity: { label: 'electronegativitat', icon: 'e⁻' },
  ionization: { label: 'energia d’ionització', icon: 'I' },
  state: { label: 'estat físic (TA)', icon: '·' },
  reactivity: { label: 'reactivitat (aprox.)', icon: 'R' },
  condElectric: { label: 'conductivitat elèctrica (aprox.)', icon: '⚡' },
  condThermal: { label: 'conductivitat tèrmica (aprox.)', icon: '♨' },
  ferromagnetism: { label: 'ferromagnetisme', icon: '🧲' },
  bioessential: { label: 'essencials per a la vida', icon: '❤' },
  toxic: { label: 'tòxics/contaminants (selecció)', icon: '☠' },
  radioactive: { label: 'radioactivitat', icon: '☢' },
  body: { label: 'cos humà (%)', icon: '👨' },
  earth: { label: 'presència a la Terra (%)', icon: '🌍' },
  universe: { label: 'abundància a l’Univers (%)', icon: '✨' },
  density: { label: 'densitat', icon: 'ρ' },
  atomicRadius: { label: 'radi atòmic', icon: '📏' },
  metallic: { label: 'metàl·lics', icon: 'M' },
};

// Corregeix etiquetes i icones mal codificades (accents i símbols)
(function normalizeUITexts(){
  try{
    if (typeof modeMeta !== 'undefined'){
      Object.assign(modeMeta.blank||{}, { icon: '-' });
      if (modeMeta.families) modeMeta.families.label = 'famílies / grups';
      if (modeMeta.blocks) modeMeta.blocks.label = 'blocs electrònics';
      if (modeMeta.valence) modeMeta.valence.label = 'valència';
      if (modeMeta.electronegativity) { modeMeta.electronegativity.label = 'electronegativitat'; modeMeta.electronegativity.icon = 'EN'; }
      if (modeMeta.ionization) modeMeta.ionization.label = 'energia d’ionització';
      if (modeMeta.state) { modeMeta.state.label = 'estat físic (TA)'; modeMeta.state.icon = 'S'; }
      if (modeMeta.condElectric) { modeMeta.condElectric.label = 'conductivitat elèctrica (aprox.)'; modeMeta.condElectric.icon = 'CE'; }
      if (modeMeta.condThermal) { modeMeta.condThermal.label = 'conductivitat tèrmica (aprox.)'; modeMeta.condThermal.icon = 'CT'; }
      if (modeMeta.bioessential) modeMeta.bioessential.label = 'essencials per a la vida';
      if (modeMeta.toxic) modeMeta.toxic.label = 'tòxics/contaminants (selecció)';
      if (modeMeta.body) { modeMeta.body.label = 'cos humà (%)'; modeMeta.body.icon = 'H'; }
      if (modeMeta.earth) { modeMeta.earth.label = 'presència a la Terra (%)'; modeMeta.earth.icon = 'E'; }
      if (modeMeta.universe) { modeMeta.universe.label = 'abundància a l’Univers (%)'; modeMeta.universe.icon = 'U'; }
      if (modeMeta.atomicRadius) modeMeta.atomicRadius.label = 'radi atòmic';
      if (modeMeta.metallic) modeMeta.metallic.label = 'metàl·lics';
    }
    if (typeof familiesLabelCa !== 'undefined'){
      familiesLabelCa['transition metal'] = 'metalls de transició';
      familiesLabelCa['lanthanide'] = 'lantànids';
      familiesLabelCa['actinide'] = 'actínids';
    }
  }catch(e){ /* no-op */ }
})();

const familiesPalette = {
  // Mapa de categories (en anglès al dataset) -> colors
  'alkali metal': '#fca5a5',
  'alkaline earth metal': '#fdba74',
  'transition metal': '#fde047',
  'post-transition metal': '#60a5fa',
  'metalloid': '#34d399',
  'polyatomic nonmetal': '#a78bfa',
  'diatomic nonmetal': '#c084fc',
  'noble gas': '#f472b6',
  'lanthanide': '#5eead4',
  'actinide': '#67e8f9',
  'unknown': '#94a3b8',
};

// Ordre explícit per a la llegenda de famílies
const familiesOrder = [
  'alkali metal',
  'alkaline earth metal',
  'transition metal',
  'post-transition metal',
  'metalloid',
  'polyatomic nonmetal',
  'diatomic nonmetal',
  'noble gas',
  'lanthanide',
  'actinide',
  'unknown',
];

const familiesLabelCa = {
  'alkali metal': 'metalls alcalins',
  'alkaline earth metal': 'metalls alcalinoterris',
  'transition metal': 'metalls de transició',
  'post-transition metal': 'altres metalls',
  'metalloid': 'semimetalls',
  'polyatomic nonmetal': 'altres no-metalls',
  'diatomic nonmetal': 'altres no-metalls',
  'noble gas': 'gasos nobles',
  'lanthanide': 'lantànids',
  'actinide': 'actínids',
  'unknown': 'desconegut',
};

const blocksPalette = {
  s: '#38bdf8', // blau cel
  p: '#f472b6', // rosa
  d: '#22c55e', // verd
  f: '#f59e0b', // taronja
};

const statePalette = {
  Solid: '#22c55e',   // verd
  Liquid: '#2563eb',  // blau
  Gas: '#eab308',     // groc
  Unknown: '#94a3b8', // gris
};

const qualitativePalette = {
  high: '#ef4444',            // molt reactiu (vermell)
  fairly: '#f97316',          // bastant reactiu (taronja)
  medium: '#eab308',          // reactiu (groc)
  low: '#16a34a',             // poc reactiu (verd)
  none: '#94a3b8',            // inert (gris)
};

// Paleta discreta i molt diferenciada (5 colors)
const paletteDistinct = ['#2563eb', '#16a34a', '#eab308', '#f97316', '#ef4444'];
// Paleta específica per a conductivitat tèrmica: baixa -> alta (blau -> vermell)
const paletteThermal = ['#2563eb', '#60a5fa', '#fbbf24', '#fb923c', '#ef4444'];
// Paletes específiques per a abundàncies
const paletteBody = ['#e5e7eb', '#bbf7d0', '#86efac', '#34d399', '#059669'];
const paletteEarth = ['#e5e7eb', '#c7d2fe', '#93c5fd', '#3b82f6', '#1d4ed8'];
// Paleta específica per a cos humà: baixa -> alta (gris clar -> verd)
// conjunts per a modes aprox.
const ferromagneticSet = new Set(['Fe','Co','Ni']);
const essentialMajor = new Set(['H','C','N','O','P','S','Na','K','Mg','Ca','Cl']);
const essentialTrace = new Set(['Fe','Cu','Zn','Mn','Se','I','Mo','Co','Cr']); // selecció bàsica
const toxicSet = new Set(['Hg','Pb','Cd','Tl','Po','As','Sb','Be']);

async function loadData() {
  // Fallback offline: si ja tenim window.PT_ELEMENTS (carregat via <script>), usem això
  if (typeof window !== 'undefined' && window.PT_ELEMENTS && Array.isArray(window.PT_ELEMENTS.elements)) {
    state.elements = window.PT_ELEMENTS.elements;
    applyCustomValues();
    return;
  }
  // Si no, prova via fetch (requereix http/https)
  if (typeof location !== 'undefined' && location.protocol === 'file:') {
    throw new Error('Entorn file:// sense dades. Usa data/elements.js o un servidor local.');
  }
  const res = await fetch('data/elements.json');
  const json = await res.json();
  state.elements = json.elements;
  applyCustomValues();
}

function normalizeDiscoveryData() {
  const nameCorrections = {
    'Jöns Jacob Berzelius': 'Jöns Jacob Berzelius',
    'Louis Nicolas Vauquelin': 'Louis-Nicolas Vauquelin',
    'André-Marie Ampère': 'André-Marie Ampère',
    'Andrés Manuel del Río': 'Andrés Manuel del Río',
    'Carl Wilhelm Scheele': 'Carl Wilhelm Scheele',
    'Antoine Jérôme Balard': 'Antoine-Jérôme Balard',
    'Lecoq de Boisbaudran': 'Paul-Émile Lecoq de Boisbaudran',
    'Jean-Antoine Chaptal': 'Jean-Antoine Chaptal',
    'Johan August Arfwedson': 'Johan August Arfwedson',
    'Lars Fredrik Nilson': 'Lars Fredrik Nilson',
    'Torbern Olof Bergman': 'Torbern Olof Bergman',
    'Clemens Winkler': 'Clemens Winkler',
    'Ferdinand Reich': 'Ferdinand Reich',
    'Carl Gustaf Mosander': 'Carl Gustaf Mosander',
    'Eugène-Anatole Demarçay': 'Eugène-Anatole Demarçay',
    'Georges Urbain': 'Georges Urbain',
    'Charles James': 'Charles James',
    'Nils Gabriel Sefström': 'Nils Gabriel Sefström',
    'Karl Ernst Claus': 'Karl Ernst Claus',
    'Smithson Tennant': 'Smithson Tennant',
    'William Hyde Wollaston': 'William Hyde Wollaston',
    'Marie Curie': 'Marie Curie',
    'Pierre Curie': 'Pierre Curie',
    'Marguerite Perey': 'Marguerite Perey',
    'Joint Institute for Nuclear Research': 'Joint Institute for Nuclear Research (Dubna, Rússia)',
    'GSI Helmholtz Centre for Heavy Ion Research': 'GSI (Darmstadt, Alemanya)'
  };

  const termTranslations = {
    'Ancient China': 'Antiga Xina',
    'Ancient Egypt': 'Antic Egipte',
    'Middle East': 'Orient Mitjà',
    'Bronze Age': 'Edat del Bronze',
    '5000 BC': 'ca. 5000 aC'
  };

  for (const el of state.elements) {
    let discoverer = el.discovered_by;
    const year = el.year_discovered;
    let final_string = '';

    if (discoverer) {
      // Aplica correccions i traduccions
      if (nameCorrections[discoverer]) {
        discoverer = nameCorrections[discoverer];
      } else if (termTranslations[discoverer]) {
        discoverer = termTranslations[discoverer];
      }
      final_string = `Descobert per: ${discoverer}`;
      if (typeof year === 'number') {
        final_string += ` (${year})`;
      }
    } else if (typeof year === 'number') {
      final_string = `Descobert l'any: ${year}`;
    } else {
      final_string = 'Descobridor: Desconegut';
    }
    el.discovery_string_ca = final_string;
  }
}

// Versió ampliada: corregeix accents, tradueix 'unknown/before', i intenta afegir l'any
function normalizeDiscoveryData2() {
  const nameCorrections = {
    'Louis Nicolas Vauquelin': 'Louis‑Nicolas Vauquelin',
    'André-Marie Ampère': 'André‑Marie Ampère',
    'Andrés Manuel del Río': 'Andrés Manuel del Río',
    'Antoine Jérôme Balard': 'Antoine‑Jérôme Balard',
    'Lecoq de Boisbaudran': 'Paul‑Émile Lecoq de Boisbaudran',
    'Jöns Jakob Berzelius': 'Jöns Jakob Berzelius',
    'Jöns Jacob Berzelius': 'Jöns Jacob Berzelius',
    'Nils Gabriel Sefström': 'Nils Gabriel Sefström',
    'Franz-Joseph Müller von Reichenstein': 'Franz‑Joseph Müller von Reichenstein',
    'Emilio Segrè': 'Emilio Segrè',
    'Georges Urbain': 'Georges Urbain',
    'Charles James': 'Charles James',
    'Karl Ernst Claus': 'Karl Ernst Claus',
    'Smithson Tennant': 'Smithson Tennant',
    'William Hyde Wollaston': 'William Hyde Wollaston',
    'Marie Curie': 'Marie Curie',
    'Pierre Curie': 'Pierre Curie',
    'Marguerite Perey': 'Marguerite Perey',
    'Joint Institute for Nuclear Research': 'Joint Institute for Nuclear Research (Dubna, Rússia)',
    'GSI Helmholtz Centre for Heavy Ion Research': 'GSI (Darmstadt, Alemanya)'
  };

  const termTranslations = {
    'Ancient China': 'Antiga Xina',
    'Ancient china': 'Antiga Xina',
    'Ancient Egypt': 'Antic Egipte',
    'Middle East': 'Orient Mitjà',
    'Bronze Age': 'Edat del Bronze',
    'India': 'Índia',
    '5000 BC': 'ca. 5000 aC'
  };

  const yearFromSummary = (summary) => {
    try {
      if (!summary || typeof summary !== 'string') return null;
      const sentences = summary.split(/(?<=[.!?])\s+/);
      for (const s of sentences) {
        if (/discover/i.test(s)) {
          const m = s.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
          if (m) return parseInt(m[1], 10);
        }
      }
      return null;
    } catch { return null; }
  };

  const normEra = (txt) => {
    return txt
      .replace(/before\s+/i, 'abans del ')
      .replace(/\bunknown\b/gi, 'desconegut')
      .replace(/\bBCE\b|\bBC\b/g, 'aC')
      .replace(/\bCE\b|\bAD\b/g, 'dC');
  };

  for (const el of state.elements) {
    let discoverer = el.discovered_by;
    let finalString = '';

    if (discoverer && typeof discoverer === 'string') {
      if (nameCorrections[discoverer]) discoverer = nameCorrections[discoverer];
      else if (termTranslations[discoverer]) discoverer = termTranslations[discoverer];
      discoverer = normEra(discoverer);

      const yr = yearFromSummary(el.summary);
      finalString = `Descobert per: ${discoverer}` + (yr ? ` (${yr})` : '');
    } else {
      const yr = yearFromSummary(el.summary);
      if (yr) finalString = `Descobert l'any: ${yr}`;
      else finalString = 'Descobridor: desconegut';
    }

    el.discovery_string_ca = finalString;
  }
}

function createGrid() {
  const grid = document.getElementById('periodic-grid');
  grid.innerHTML = '';

  // Add labels for groups (columns)
  for (let i = 1; i <= 18; i++) {
    const label = document.createElement('div');
    label.className = 'grid-label-group';
    label.textContent = i;
    label.style.gridColumn = i + 1;
    label.style.gridRow = 1;
    grid.appendChild(label);
  }

  // Add labels for periods (rows)
  for (let i = 1; i <= 7; i++) {
    const label = document.createElement('div');
    label.className = 'grid-label-period';
    label.textContent = i;
    label.style.gridColumn = 1;
    label.style.gridRow = i + 1;
    grid.appendChild(label);
  }

  for (const el of state.elements) {
    const card = document.createElement('button');
    card.className = 'cell blank';
    // Offset by 1 to account for labels
    card.style.gridColumn = el.xpos + 1;
    card.style.gridRow = el.ypos + 1;
    card.setAttribute('data-atomic', el.number);
    const caName = getNameCA(el.symbol, el.name);
    card.setAttribute('title', `${caName} (${el.symbol})`);

    card.addEventListener('click', () => showElementDetails(el.number));

    const num = document.createElement('div');
    num.className = 'num';
    num.textContent = el.number;
    const sym = document.createElement('div');
    sym.className = 'sym';
    sym.textContent = el.symbol;
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = caName;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = '';

    card.append(num, sym, name, meta);
    grid.appendChild(card);
  }

  // Add markers for Lanthanides and Actinides
  const lanthanideMarker = document.createElement('div');
  lanthanideMarker.className = 'grid-label-group';
  lanthanideMarker.textContent = '*';
  lanthanideMarker.style.gridColumn = 4;
  lanthanideMarker.style.gridRow = 7;
  grid.appendChild(lanthanideMarker);

  const actinideMarker = document.createElement('div');
  actinideMarker.className = 'grid-label-group';
  actinideMarker.textContent = '**';
  actinideMarker.style.gridColumn = 4;
  actinideMarker.style.gridRow = 8;
  grid.appendChild(actinideMarker);


  // Ajusta escala perquÃ¨ la taula completa cÃ piga al viewport
  fitGridScale();
}

function setMode(mode) {
  state.mode = mode;
  const subtitle = document.getElementById('subtitle');
  const indicator = document.getElementById('mode-indicator');
  const sel = document.getElementById('mode-select');
  const opt = sel ? sel.querySelector(`option[value="${mode}"]`) : null;
  const modeLabel = opt?.textContent || modeMeta[mode].label;
  subtitle.textContent = `Mode: ${modeLabel}`;
  indicator.textContent = '-';

  colorize();
	renderLegend_clean();
  // Reajustar escala (el contingut pot canviar alÃ§ada)
  fitGridScale();
}

function colorize() {
  const grid = document.getElementById('periodic-grid');
  const cards = grid.querySelectorAll('.cell');
  cards.forEach(c => { c.className = 'cell blank'; c.style.background = ''; c.style.removeProperty('--cell-fg'); });

  switch (state.mode) {
    case 'blank':
      // Res: deixa la base
      break;
    case 'families':
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const cat = el.category?.toLowerCase() ?? 'unknown';
        const key = Object.keys(familiesPalette).find(k => cat.includes(k)) || 'unknown';
        setCardBG(card, familiesPalette[key]);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break;
    case 'blocks':
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        let b = (el.block || '').toLowerCase();
        // Ajust: pinta Lu/Lr com a f per coherÃ¨ncia visual amb la fila f
        if (el.symbol === 'Lu' || el.symbol === 'Lr') b = 'f';
        const color = blocksPalette[b] || '#94a3b8';
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break;
    case 'state':
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const ph = el.phase || 'Unknown';
        const color = statePalette[ph] || statePalette.Unknown;
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break;
    case 'electronegativity': {
      const vals = state.elements.map(e => e.electronegativity_pauling).filter(v => typeof v === 'number');
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const bins = makeBins(min, max, paletteDistinct.length);
      const colors = paletteDistinct;
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = el.electronegativity_pauling;
        if (typeof v !== 'number') { setCardBG(card, '#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const idx = binIndex(v, bins);
        const color = colors[idx];
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, v.toFixed(2));
      }
      break; }
    case 'ionization': {
      const vals = state.elements.map(e => e.ionization_energies?.[0]).filter(v => typeof v === 'number');
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const bins = makeBins(min, max, paletteDistinct.length);
      const colors = paletteDistinct;
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = el.ionization_energies?.[0]; // kJ/mol al dataset
        if (typeof v !== 'number') { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const idx = binIndex(v, bins);
        const color = colors[idx];
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, `${v.toFixed(0)} kJ/mol`);
      }
      break; }
    case 'density': {
      // g/cmÂ³
      const vals = state.elements.map(e => (typeof e.density === 'number' && e.density>0 ? e.density : undefined)).filter(v => typeof v === 'number');
      const min = Math.min(...vals), max = Math.max(...vals);
      const bins = makeBins(min, max, paletteDistinct.length);
      for (const el of state.elements){
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = (typeof el.density === 'number' && el.density>0) ? el.density : undefined;
        if (typeof v !== 'number') { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const idx = binIndex(v, bins); setCardBG(card, paletteDistinct[idx]); card.classList.add('colored'); setMeta(card, `${v} g/cm³`);
      }
      break; }
    case 'atomicRadius': {
      // pm (provinent de custom_values)
      const vals = state.elements.map(e => e.atomic_radius_pm).filter(v => typeof v === 'number' && v>0);
      const min = Math.min(...vals), max = Math.max(...vals);
      const bins = makeBins(min, max, paletteDistinct.length);
      for (const el of state.elements){
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = el.atomic_radius_pm;
        if (!(typeof v === 'number' && v>0)) { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const idx = binIndex(v, bins); setCardBG(card, paletteDistinct[idx]); card.classList.add('colored'); setMeta(card, `${v} pm`);
      }
      break; }
    case 'meltPoint': {
      // K (del dataset elements)
      const vals = state.elements.map(e => (typeof e.melt === 'number' && e.melt>0 ? e.melt : undefined)).filter(v => typeof v === 'number');
      const min = Math.min(...vals), max = Math.max(...vals);
      const bins = makeBins(min, max, paletteDistinct.length);
      for (const el of state.elements){
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = (typeof el.melt === 'number' && el.melt>0) ? el.melt : undefined;
        if (typeof v !== 'number') { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const idx = binIndex(v, bins); setCardBG(card, paletteDistinct[idx]); card.classList.add('colored'); setMeta(card, `${v.toFixed(0)} K`);
      }
      break; }
    case 'boilPoint': {
      // K (del dataset elements)
      const vals = state.elements.map(e => (typeof e.boil === 'number' && e.boil>0 ? e.boil : undefined)).filter(v => typeof v === 'number');
      const min = Math.min(...vals), max = Math.max(...vals);
      const bins = makeBins(min, max, paletteDistinct.length);
      for (const el of state.elements){
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = (typeof el.boil === 'number' && el.boil>0) ? el.boil : undefined;
        if (typeof v !== 'number') { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const idx = binIndex(v, bins); setCardBG(card, paletteDistinct[idx]); card.classList.add('colored'); setMeta(card, `${v.toFixed(0)} K`);
      }
      break; }
    case 'metallic': {
      const metalCats = ['alkali metal','alkaline earth metal','transition metal','post-transition metal','lanthanide','actinide'];
      for (const el of state.elements){
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const cat = (el.category||'').toLowerCase();
        const isMetal = metalCats.some(k=>cat.includes(k));
        const color = isMetal ? '#0ea5e9' : '#9ca3af';
        setCardBG(card,color); card.classList.add('colored'); setMeta(card,'');
      }
      break; }
    case 'valence': {
      // Estats d'oxidació (substitueix l'antiga valència d'electrons)
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        let arr = null;
        if (Array.isArray(el.oxidation_states_array)) arr = el.oxidation_states_array;
        else if (typeof el.oxidation_states === 'string') {
          arr = el.oxidation_states.split(/[ ,]+/).map(s => parseInt(s.replace(/\u2212|−/g,'-'),10)).filter(n => !isNaN(n));
        }
        if (!arr && typeof window !== 'undefined' && window.PT_OX && Array.isArray(window.PT_OX[el.symbol])) {
          arr = window.PT_OX[el.symbol].slice();
        }
        if (!Array.isArray(arr) || arr.length===0){ setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); continue; }
        const hasPos = arr.some(n=> n>0), hasNeg = arr.some(n=> n<0), hasZero = arr.some(n=> n===0);
        let color = '#9ca3af';
        if (hasPos && hasNeg) color = '#a855f7';
        else if (hasPos) color = '#ef4444';
        else if (hasNeg) color = '#2563eb';
        else if (hasZero) color = '#9ca3af';
        setCardBG(card, color);
        card.classList.add('colored');
        const label = arr.sort((a,b)=>a-b).map(n=> (n>0? '+'+n : n===0? '0' : n)).join(', ');
        setMeta(card, label);
      }
      break; } 
    case 'reactivity': {
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const cat = (el.category || '').toLowerCase();
        let level = 'low'; // per defecte
        if (cat.includes('noble gas')) level = 'none';
        else if (cat.includes('alkali metal') || cat.includes('halogen')) level = 'high';
        else if (cat.includes('alkaline earth')) level = 'fairly';
        else if (cat.includes('transition metal') || cat.includes('other nonmetal') || cat.includes('polyatomic nonmetal') || cat.includes('diatomic nonmetal')) level = 'medium';
        else level = 'low';
        const color = qualitativePalette[level] || '#9ca3af';
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break; }
    case 'condElectric': {
      // NomÃ©s dades numÃ¨riques; sense dades -> gris clar
      const map = (window.PT_COND) || {};
      const vals = state.elements.map(e => map[e.symbol]?.e).filter(v => typeof v === 'number' && v>0);
      const useNumeric = vals.length >= 2;
      let bins = [], colors = [];
      // Escala especÃ­fica: baixa -> alta (blau -> vermell)
      if (useNumeric) { const lmin=Math.log10(Math.min(...vals)), lmax=Math.log10(Math.max(...vals)); bins = makeBins(lmin,lmax,paletteThermal.length); colors = paletteThermal; }
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = map[el.symbol]?.e;
        if (useNumeric && typeof v === 'number' && v>0) { const idx = binIndex(Math.log10(v),bins); const color = colors[idx]; setCardBG(card,color); card.classList.add('colored'); setMeta(card, `${formatSI(v)} S/m`);
        } else { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); }
      }
      break; }
    case 'condThermal': {
      const map = (window.PT_COND) || {};
      const vals = state.elements.map(e => map[e.symbol]?.t).filter(v => typeof v === 'number' && v>0);
      const useNumeric = vals.length >= 2;
      let bins = [], colors = [];
      if (useNumeric) { const lmin=Math.log10(Math.min(...vals)), lmax=Math.log10(Math.max(...vals)); bins = makeBins(lmin,lmax,paletteThermal.length); colors = paletteThermal; }
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const v = map[el.symbol]?.t;
        if (useNumeric && typeof v === 'number' && v>0) { const idx = binIndex(Math.log10(v),bins); const color = colors[idx]; setCardBG(card,color); card.classList.add('colored'); setMeta(card, `${formatSI(v)} W/m·K`);
        } else { setCardBG(card,'#e5e7eb'); card.classList.add('colored'); setMeta(card,''); }
      }
      break; }
    case 'ferromagnetism': {
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const yes = ferromagneticSet.has(el.symbol);
        const color = yes ? '#0ea5e9' : '#475569';
        setCardBG(card, color); card.classList.add('colored');
        setMeta(card, '');
      }
      break; }
    case 'bioessential': {
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        let tag = 'no'; let color = '#9ca3af';
        if (essentialMajor.has(el.symbol)) { tag = 'essencial'; color = '#34d399'; }
        else if (essentialTrace.has(el.symbol)) { tag = 'traça'; color = '#a3e635'; }
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break; }
    case 'toxic': {
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const tx = toxicSet.has(el.symbol);
        // Colors: SÃ­ (tÃ²xic) destacat en vermell; No (no tÃ²xic) en gris suau
        const color = tx ? '#ef4444' : '#9ca3af';
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break; }
    case 'radioactive': {
      for (const el of state.elements) {
        const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
        const n = el.number;
        const radio = (n > 83) || n === 43 || n === 61; // regla bÃ sica
        const color = radio ? '#f97316' : '#22c55e';
        setCardBG(card, color);
        card.classList.add('colored');
        setMeta(card, '');
      }
      break; }
    case 'body': {
      const map = (window.PT_ABUND && window.PT_ABUND.human) || {};
      paintAbundance(map, false);
      break; }
    case 'earth': {
      const map = (window.PT_ABUND && window.PT_ABUND.earth) || {};
      paintAbundance(map, false);
      break; }
    case 'universe': {
      const map = (window.PT_ABUND && window.PT_ABUND.universe) || {};
      paintAbundance(map, true);
      break; }
  }
}

function renderLegend_clean() {
  const box = document.getElementById('legend');
  box.innerHTML = '';

  const title = document.createElement('h3');
  title.textContent = 'Llegenda';
  box.appendChild(title);

  const addItemsLocal = (items) => {
    const wrap = document.createElement('div');
    wrap.className = 'items';
    if (box.querySelector('.items')) { wrap.style.marginTop = '8px'; }
    for (const [label, color] of items) {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<span class="swatch" style="background:${color}"></span><span>${label}</span>`;
      wrap.appendChild(item);
    }
    box.appendChild(wrap);
  };

  if (state.mode === 'blank') {
    const p = document.createElement('div');
    p.className = 'items';
    p.innerHTML = '<span class="item">Sense colors: només símbol i número atòmic.</span>';
    box.appendChild(p);
    return;
  }

  if (state.mode === 'families') {
    const wrap = document.createElement('div');
    wrap.className = 'items';
    for (const [key, color] of Object.entries(familiesPalette)) {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<span class="swatch" style="background:${color}"></span><span>${familiesLabelCa[key] || key}</span>`;
      wrap.appendChild(item);
    }
    box.appendChild(wrap);
    return;
  }

  if (state.mode === 'blocks') {
    const wrap = document.createElement('div');
    wrap.className = 'items';
    for (const [b, color] of Object.entries(blocksPalette)) {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<span class="swatch" style="background:${color}"></span><span>Bloc ${b}</span>`;
      wrap.appendChild(item);
    }
    const note = document.createElement('div');
    note.style.cssText = 'margin-top:8px; font-size:12px; color:#a8acb3';
    note.textContent = 'Nota: Lu i Lr es mostren com a f per coherència visual amb la fila.';
    box.appendChild(wrap);
    box.appendChild(note);
    return;
  }

  if (state.mode === 'state') {
    const wrap = document.createElement('div');
    wrap.className = 'items';
    const map = { Solid: 'Sòlid', Liquid: 'Líquid', Gas: 'Gas', Unknown: 'Desconegut' };
    for (const [k, color] of Object.entries(statePalette)) {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<span class="swatch" style="background:${color}"></span><span>${map[k]}</span>`;
      wrap.appendChild(item);
    }
    box.appendChild(wrap);
    return;
  }

  if (state.mode === 'reactivity') {
    addItemsLocal([
      ['molt reactiu', qualitativePalette.high],
      ['bastant reactiu', qualitativePalette.fairly],
      ['reactiu', qualitativePalette.medium],
      ['poc reactiu', qualitativePalette.low],
      ['inert', qualitativePalette.none],
    ]);
    const note = document.createElement('div');
    note.style.cssText = 'margin-top:8px; font-size:12px; color:#6b7280';
    note.textContent = 'Criteri: alcalins/halògens=molt, alcalinoterris=bastant, transició/no-metalls=reactiu, altres=baix, nobles=inert.';
    box.appendChild(note);
    return;
  }

  if (state.mode === 'ferromagnetism') {
    addItemsLocal([
      ['Sí', '#0ea5e9'],
      ['No', '#475569']
    ]);
    return;
  }

  if (state.mode === 'bioessential') {
    addItemsLocal([
      ['Essencial', '#34d399'],
      ['Traça', '#a3e635'],
      ['No essencial', '#9ca3af']
    ]);
    return;
  }

  if (state.mode === 'electronegativity') {
    const vals = state.elements.map(e => e.electronegativity_pauling).filter(v => typeof v === 'number');
    if (vals.length) addBinsLegend(vals, v => v.toFixed(2));
    return;
  }

  if (state.mode === 'ionization') {
    const vals = state.elements.map(e => e.ionization_energies?.[0]).filter(v => typeof v === 'number');
    if (vals.length) addBinsLegend(vals, v => `${v.toFixed(0)} kJ/mol`);
    return;
  }

  if (state.mode === 'condElectric' || state.mode === 'condThermal') {
    const map = (window.PT_COND)||{}; const key = state.mode==='condElectric'?'e':'t'; const unit = state.mode==='condElectric'?'S/m':'W/m·K';
    const vals = state.elements.map(e=>map[e.symbol]?.[key]).filter(v=>typeof v==='number' && v>0);
    if (vals.length){
      if (state.mode==='condThermal'|| state.mode==='condElectric'){
        const lmin = Math.log10(Math.min(...vals)), lmax = Math.log10(Math.max(...vals));
        const bins = makeBins(lmin, lmax, paletteThermal.length);
        const wrap = document.createElement('div'); wrap.className='items';
        for (let i=0;i<bins.length;i++){
          const a = i===0 ? lmin : bins[i-1]; const b = bins[i];
          const item = document.createElement('div'); item.className='item';
          item.innerHTML = `<span class="swatch" style="background:${paletteThermal[i]}"></span><span>${formatSI(Math.pow(10,a))} - ${formatSI(Math.pow(10,b))} ${unit}</span>`;
          wrap.appendChild(item);
        }
        box.appendChild(wrap);
      } 
    }
    if (state.elements.some(e=> typeof (map[e.symbol]?.[key]) !== 'number')) addItemsLocal([["Sense dades", '#e5e7eb']]);
    const note = document.createElement('div'); note.style.cssText='margin-top:8px;font-size:12px;color:#6b7280'; note.textContent='Valors aproximats a 300 K. Escala logarítmica per a tèrmica.'; box.appendChild(note); return;
  }

  if (state.mode === 'density') {
    const vals = state.elements.map(e=> (typeof e.density === 'number' && e.density>0 ? e.density : undefined)).filter(v=> typeof v === 'number');
    if (vals.length){ addBinsLegend(vals, v=>`${v.toFixed(2)} g/cm³`); }
    if (state.elements.some(e=> !(typeof e.density === 'number' && e.density>0))) addItemsLocal([["Sense dades", '#e5e7eb']]);
    return;
  }

  if (state.mode === 'atomicRadius') {
    const vals = state.elements.map(e=> e.atomic_radius_pm).filter(v=> typeof v === 'number' && v>0);
    if (vals.length){ addBinsLegend(vals, v=>`${v.toFixed(0)} pm`); }
    if (state.elements.some(e=> !(typeof e.atomic_radius_pm === 'number' && e.atomic_radius_pm>0))) addItemsLocal([["Sense dades", '#e5e7eb']]);
    return;
  }

  if (state.mode === 'meltPoint') {
    const vals = state.elements.map(e=> (typeof e.melt === 'number' && e.melt>0 ? e.melt : undefined)).filter(v=> typeof v === 'number');
    if (vals.length){ addBinsLegend(vals, v=>`${v.toFixed(0)} K`); }
    if (state.elements.some(e=> !(typeof e.melt === 'number' && e.melt>0))) addItemsLocal([["Sense dades", '#e5e7eb']]);
    return;
  }

  if (state.mode === 'boilPoint') {
    const vals = state.elements.map(e=> (typeof e.boil === 'number' && e.boil>0 ? e.boil : undefined)).filter(v=> typeof v === 'number');
    if (vals.length){ addBinsLegend(vals, v=>`${v.toFixed(0)} K`); }
    if (state.elements.some(e=> !(typeof e.boil === 'number' && e.boil>0))) addItemsLocal([["Sense dades", '#e5e7eb']]);
    return;
  }

  if (state.mode === 'metallic') {
    addItemsLocal([
      ['Metàl·lics', '#0ea5e9'],
      ['No metàl·lics', '#9ca3af']
    ]);
    return;
  }

  if (state.mode === 'body' || state.mode === 'earth' || state.mode === 'universe') {
    const map = (window.PT_ABUND && (state.mode==='body'?window.PT_ABUND.human: state.mode==='earth'?window.PT_ABUND.earth: window.PT_ABUND.universe))||{};
    const raw = state.elements.map(e=>map[e.symbol]??0).filter(v=>typeof v==='number' && v>0);
    if (!raw.length){ const p=document.createElement('div'); p.className='items'; p.innerHTML='<span class="item">Sense dades.</span>'; box.appendChild(p); return; }
    if (state.mode==='body'){
      const vals = raw.map(v=>Math.log10(v)); addBinsLegend(vals, v=>formatPct(Math.pow(10,v))); addItemsLocal([["Sense presència (0%)", '#374151']]); return;
    }
    if (state.mode==='earth'){
      const vals = raw.map(v=>Math.log10(v)); addBinsLegend(vals, v=>formatPct(Math.pow(10,v))); addItemsLocal([["Sense presència (0%)", '#374151']]); return;
    }
    if (state.mode==='universe'){
      const vals = raw.map(v=>Math.log10(v)); addBinsLegend(vals, v=>formatPct(Math.pow(10,v))); addItemsLocal([["Sense presència (0%)", '#374151']]); return;
    }
  }

  if (state.mode === 'valence') {
    addItemsLocal([
      ['Només positives', '#ef4444'],
      ['Només negatives', '#2563eb'],
      ['Positives i negatives', '#a855f7'],
      ['Només 0', '#9ca3af'],
      ['Sense dades', '#e5e7eb']
    ]);
    const note = document.createElement('div'); note.style.cssText='margin-top:8px;font-size:12px;color:#6b7280'; note.textContent='Mostra els estats d’oxidació possibles per element. Etiqueta: llista de valències.'; box.appendChild(note);
    return;
  }

  if (state.mode === 'toxic') {
    addItemsLocal([
      ['Tòxic', '#ef4444'],
      ['No tòxic', '#9ca3af']
    ]);
    return;
  }

  if (state.mode === 'radioactive') {
    addItemsLocal([
      ['Radioactiu', '#f97316'],
      ['No radioactiu', '#22c55e']
    ]);
    return;
  }
}

// Helpers de llegenda
function addItems(items){
  const box = document.getElementById('legend');
  if (!box) return;
  const wrap = document.createElement('div');
  wrap.className = 'items';
  for (const [label, color] of items){
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `<span class="swatch" style="background:${color}"></span><span>${label}</span>`;
    wrap.appendChild(item);
  }
  box.appendChild(wrap);
}

function addBinsLegend(vals, format){
  if (!Array.isArray(vals) || !vals.length) return;
  const box = document.getElementById('legend');
  if (!box) return;
  const min = Math.min(...vals), max = Math.max(...vals);
  const bins = makeBins(min, max, paletteDistinct.length);
  const wrap = document.createElement('div');
  wrap.className = 'items';
  for (let i=0;i<bins.length;i++){
    const a = i===0 ? min : bins[i-1];
    const b = bins[i];
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `<span class="swatch" style="background:${paletteDistinct[i]}"></span><span>${format(a)} - ${format(b)}</span>`;
    wrap.appendChild(item);
  }
  box.appendChild(wrap);
}

function addBinsLegendCustom(vals, format, palette){
  if (!Array.isArray(vals) || !vals.length) return;
  const box = document.getElementById('legend');
  if (!box) return;
  const pal = Array.isArray(palette) && palette.length ? palette : paletteDistinct;
  const min = Math.min(...vals), max = Math.max(...vals);
  const bins = makeBins(min, max, pal.length);
  const wrap = document.createElement('div');
  wrap.className = 'items';
  for (let i=0;i<bins.length;i++){
    const a = i===0 ? min : bins[i-1];
    const b = bins[i];
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `<span class=\"swatch\" style=\"background:${pal[i]}\"></span><span>${format(a)} - ${format(b)}</span>`;
    wrap.appendChild(item);
  }
  box.appendChild(wrap);
}

function normalizeLegendText(){
  try{
    const repl = new Map([
      ['nomǸs', 'només'],
      ['símbol', 'símbol'],
      ['número', 'número'],
      ['atòmic', 'atòmic'],
      ['coherència', 'coherència'],
      ['Sòlid', 'Sòlid'],
      ['Líquid', 'Líquid'],
      ['logarítmica', 'logarítmica'],
      ['tèrmica', 'tèrmica'],
      ['W/m·K', 'W/m·K'],
      ['W/m·K', 'W/m·K'],
      ['g/cm³', 'g/cm³']
    ]);
    const box = document.getElementById('legend');
    if (box){
      let html = box.innerHTML;
      for (const [a,b] of repl) html = html.split(a).join(b);
      box.innerHTML = html;
    }
    document.querySelectorAll('.cell .meta').forEach(meta => {
      let t = meta.textContent || '';
      for (const [a,b] of repl) t = t.split(a).join(b);
      meta.textContent = t;
    });
  }catch(e){ /* no-op */ }
}

function normalizeStaticUI(){
  try{
    document.title = 'Taula periòdica dinàmica';
    const h1 = document.querySelector('h1.app-title'); if (h1) h1.textContent = 'Taula periòdica dinàmica';
    const ind = document.getElementById('mode-indicator'); if (ind){ ind.textContent='-'; ind.title = 'Mode de visualització'; }
    const lab = document.querySelector('label[for="mode-select"]'); if (lab) lab.textContent = 'Tria la visualització';
    const sel = document.getElementById('mode-select');
    if (sel){
      const texts = new Map([
        ['blank','En blanc'],
        ['families','Famílies / grups'],
        ['blocks','Blocs electrònics (s, p, d, f)'],
        ['valence','València (electrons de valència)'],
        ['electronegativity','Electronegativitat (Pauling)'],
        ['ionization','Energia d\'ionització'],
        ['state','Estat físic a T ambient'],
        ['density','Densitat'],
        ['meltPoint','Punt de fusió (K)'],
        ['boilPoint','Punt d\'ebullició (K)'],
        ['atomicRadius','Radi atòmic'],
        ['metallic','Metàl·lics'],
        ['reactivity','Reactivitat (aprox.)'],
        ['condElectric','Conductivitat elèctrica (aprox.)'],
        ['condThermal','Conductivitat tèrmica (aprox.)'],
        ['ferromagnetism','Ferromagnetisme'],
        ['bioessential','Essencials per a la vida'],
        ['toxic','Tòxics/contaminants (selecció)'],
        ['radioactive','Radioactivitat'],
        ['body','Cos humà (%)'],
        ['earth','Presència a la Terra (%)'],
        ['universe','Abundància a l’Univers (%)'],
      ]);
      for (const opt of sel.querySelectorAll('option')){
        const t = texts.get(opt.value); if (t) opt.textContent = t;
      }
      const og = sel.querySelector('optgroup'); if (og) og.label = 'Abundància (percentatge)';
    }
    const grid = document.getElementById('periodic-grid'); if (grid) grid.setAttribute('aria-label','Taula periòdica');
    const credit = document.querySelector('.legend-footer .credit'); if (credit) credit.textContent = 'Aplicació realitzada per Felip Sarroca amb l\'assistència de la IA';
  }catch(e){ /* no-op */ }
}

function mixColor(hex1, hex2, t) {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}
function hexToRgb(hex){
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1],16), g: parseInt(m[2],16), b: parseInt(m[3],16) } : {r:0,g:0,b:0};
}

function getFgForBg(bg){
  // bg pot ser rgb(...) o #hex; tornem negre o blanc segons luminància
  let r=17,g=19,b=24;
  if (bg.startsWith('#')) { const c = hexToRgb(bg); r=c.r; g=c.g; b=c.b; } 
  else {
    const m = /rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/.exec(bg);
    if (m) { r=parseInt(m[1]); g=parseInt(m[2]); b=parseInt(m[3]); }
  }
  const sr = r/255, sg=g/255, sb=b/255;
  const lin = (x)=> (x<=0.03928? x/12.92 : Math.pow((x+0.055)/1.055,2.4));
  const L = 0.2126*lin(sr) + 0.7152*lin(sg) + 0.0722*lin(sb);
  return L > 0.53 ? '#111318' : '#f8fafc'; // si clar, negre; si fosc, blanc
}

function setCardBG(card,color){
  card.style.background = color;
  const fg = getFgForBg(color);
  card.style.setProperty('--cell-fg', fg);
}

function setMeta(card, text){
  const meta = card.querySelector('.meta');
  if (!meta) return;
  meta.textContent = text || '';
}

// Helpers per a franges discretes
function makeBins(min, max, n){
  const bins = [];
  const step = (max - min) / n;
  for (let i=1;i<=n;i++) bins.push(min + step * i);
  return bins;
}
function binIndex(v, bins){
  for (let i=0;i<bins.length;i++) if (v <= bins[i]) return i;
  return bins.length - 1;
}
function stepColors(hex1, hex2, n){
  const colors = [];
  for (let i=0;i<n;i++){
    const t = n===1 ? 0.5 : i/(n-1);
    colors.push(mixColor(hex1, hex2, t));
  }
  return colors;
}

function formatSI(v){
  // Format curt amb prefixos SI: S/m i W/m·K
  const abs = Math.abs(v);
  const units = [
    {k:1e9, s:'G'}, {k:1e6, s:'M'}, {k:1e3, s:'k'}, {k:1, s:''}, {k:1e-3, s:'m'}, {k:1e-6, s:'µ'}, {k:1e-9, s:'n'}
  ];
  for (const u of units){ if (abs >= u.k){ return (v/u.k).toFixed(2).replace(/\.00$/,'') + ' ' + u.s; } }
  return v.toExponential(2);
}

function formatPct(v){
  if (v === 0) return '0%';
  if (v >= 10) return v.toFixed(1).replace(/\.0$/,'') + '%';
  if (v >= 1) return v.toFixed(2).replace(/0$/,'').replace(/\.$/,'') + '%';
  if (v >= 0.1) return v.toFixed(2) + '%';
  if (v >= 0.01) return v.toFixed(3) + '%';
  if (v >= 0.001) return v.toFixed(4) + '%';
  return v.toExponential(1).replace('e','×10^') + '%';
}

function paintAbundance(map, useLog, palette){
  const grid = document.getElementById('periodic-grid');
  const vals = [];
  for (const el of state.elements){ const v = map[el.symbol] ?? 0; if (typeof v === 'number' && v>0) vals.push(v); }
  if (!vals.length){ for (const el of state.elements){ const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`); setCardBG(card,'#374151'); card.classList.add('colored'); setMeta(card,'0%'); } return; }
  if (useLog){
    const lmin = Math.log10(Math.min(...vals)), lmax = Math.log10(Math.max(...vals));
    const pal = Array.isArray(palette) && palette.length ? palette : paletteDistinct;
    const bins = makeBins(lmin, lmax, pal.length);
    const colors = pal;
    for (const el of state.elements){
      const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
      const vv = map[el.symbol] ?? 0;
      if (vv>0){ const idx = binIndex(Math.log10(vv), bins); setCardBG(card, colors[idx]); card.classList.add('colored'); setMeta(card, formatPct(vv)); }
      else { setCardBG(card, '#374151'); card.classList.add('colored'); setMeta(card, '0%'); }
    }
  } else {
    const min = Math.min(...vals), max = Math.max(...vals);
    const pal = Array.isArray(palette) && palette.length ? palette : paletteDistinct;
    const bins = makeBins(min, max, pal.length);
    const colors = pal;
    for (const el of state.elements){
      const card = grid.querySelector(`.cell[data-atomic="${el.number}"]`);
      const vv = map[el.symbol] ?? 0;
      if (vv>0){ const idx = binIndex(vv, bins); setCardBG(card, colors[idx]); card.classList.add('colored'); setMeta(card, formatPct(vv)); }
      else { setCardBG(card, '#374151'); card.classList.add('colored'); setMeta(card, '0%'); }
    }
  }
}

function applyCustomValues(){
  if (typeof window === 'undefined' || !window.PT_VALUES) return;
  const V = window.PT_VALUES;
  for (const el of state.elements){
    const sym = el.symbol;
    if (V.electronegativity_pauling && sym in V.electronegativity_pauling){
      const val = V.electronegativity_pauling[sym];
      if (val === null || typeof val === 'number') el.electronegativity_pauling = val;
    }
    if (V.ionization_kjmol && sym in V.ionization_kjmol){
      const val = V.ionization_kjmol[sym];
      if (typeof val === 'number') {
        if (!Array.isArray(el.ionization_energies)) el.ionization_energies = [];
        el.ionization_energies[0] = val;
      }
    }
    if (V.conductivity){
      // Completa PT_COND amb valors personalitzats, sense sobreescriure valors existents
      if (!window.PT_COND) window.PT_COND = {};
      if (!window.PT_COND[sym]) window.PT_COND[sym] = {};
      if (V.conductivity.e && (sym in V.conductivity.e) && typeof window.PT_COND[sym].e !== 'number') {
        window.PT_COND[sym].e = V.conductivity.e[sym];
      }
      if (V.conductivity.t && (sym in V.conductivity.t) && typeof window.PT_COND[sym].t !== 'number') {
        // Evita possibles unitats errònies en gasos (dades sobredimensionades)
        const proposed = V.conductivity.t[sym];
        if (!(el.phase === 'Gas' && proposed > 5)) {
          window.PT_COND[sym].t = proposed;
        }
      }
    }
    if (V.density_gcm3 && sym in V.density_gcm3){
      const val = V.density_gcm3[sym];
      if (typeof val === 'number') el.density = val;
    }
    if (V.melt_K && sym in V.melt_K){
      const val = V.melt_K[sym];
      if (typeof val === 'number' && !(typeof el.melt === 'number')) el.melt = val;
    }
    if (V.boil_K && sym in V.boil_K){
      const val = V.boil_K[sym];
      if (typeof val === 'number' && !(typeof el.boil === 'number')) el.boil = val;
    }
    if (V.atomic_radius_pm && sym in V.atomic_radius_pm){
      const val = V.atomic_radius_pm[sym];
      if (typeof val === 'number') el.atomic_radius_pm = val;
    }
  }
}

function initUI() {
  const select = document.getElementById('mode-select');
  select.addEventListener('change', e => setMode(e.target.value));
  normalizeStaticUI();
  initModal();
  initTheme();
}

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeLabel = document.getElementById('theme-label');
  if (!toggleBtn || !themeLabel) {
    console.error('Theme UI elements not found');
    return;
  }
  const body = document.body;

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      toggleBtn.innerHTML = '🌙'; // Moon icon
      themeLabel.textContent = 'Tema: Fosc';
    } else {
      body.classList.remove('dark-mode');
      toggleBtn.innerHTML = '☀️'; // Sun icon
      themeLabel.textContent = 'Tema: Clar';
    }
  };

  toggleBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!overlay || !closeBtn) {
    console.error('Modal elements not found');
    return;
  }

  function hideModal() {
    overlay.classList.add('hidden');
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideModal();
    }
  });

  closeBtn.addEventListener('click', hideModal);
}

function formatElectronConfiguration(config) {
  if (!config) return 'N/A';
  return config.replace(/([spdfg])(\d+)/g, '$1<sup>$2</sup>');
}

function showElementDetails(atomicNumber) {
  const element = state.elements.find(el => el.number === atomicNumber);
  if (!element) return;

  const overlay = document.getElementById('modal-overlay');
  const contentDiv = document.getElementById('modal-content');
  const caName = getNameCA(element.symbol, element.name);

  const phase_ca = {
    'Solid': 'Sòlid',
    'Liquid': 'Líquid',
    'Gas': 'Gas',
    'Unknown': 'Desconegut'
  };

  // Check for a Catalan summary, otherwise fall back to the English one
  const summary = (window.SUMMARIES_CA && window.SUMMARIES_CA[element.symbol]) || element.summary;

  let detailsHtml = `
    <h2 style="margin-top:0;">${caName} (${element.symbol})</h2>
    <p><strong>El seu DNI atòmic:</strong> ${element.number}</p>
    <p><strong>Pesa aproximadament:</strong> ${element.atomic_mass} u</p>
    <p><strong>Pertany a la família de:</strong> ${familiesLabelCa[element.category.toLowerCase().replace("unknown, but predicted to be an ","")] || element.category}</p>
    <p><strong>Fase a temperatura ambient:</strong> ${phase_ca[element.phase] || element.phase}</p>
    <p><strong>Distribució d'electrons:</strong> ${formatElectronConfiguration(element.electron_configuration)}</p>
    <hr>
    <p style="font-size: 0.9em; text-align: justify;"><strong>Una mica sobre aquest element:</strong><br>${summary}</p>
  `;

  if (element.discovery_string_ca) {
    detailsHtml += `<p><small>${element.discovery_string_ca}</small></p>`;
  }

  contentDiv.innerHTML = detailsHtml;
  overlay.classList.remove('hidden');
}


async function main() {
  await loadData();
  // Nova normalització amb any, accents i termes en català
  normalizeDiscoveryData2();
  createGrid();
  initUI();
  setMode('blank');
}

window.addEventListener('DOMContentLoaded', () => {
  main().catch(err => {
    console.error(err);
    const grid = document.getElementById('periodic-grid');
    grid.innerHTML = '<div style="grid-column:1 / span 18;color:#f87171">Error carregant dades: ' + (err?.message || err) + '<br>Solució: obre amb un servidor (http://localhost) o assegura que es carrega <code>data/elements.js</code>.</div>';
  });
});

// Responsivitat: ajust d'escala perquÃ¨ la taula sencera es vegi
function fitGridScale(){
  const viewport = document.getElementById('grid-viewport');
  const scaler = document.getElementById('grid-scale');
  const grid = document.getElementById('periodic-grid');
  if (!viewport || !scaler || !grid) return;
  // Mesura mides naturals
  // Assegurem que no hi ha escala abans de mesurar
  scaler.style.transform = 'scale(1)';
  const gw = grid.scrollWidth;
  const gh = grid.scrollHeight;
  const vw = viewport.clientWidth - 16; // marge interior
  const vh = viewport.clientHeight - 16;
  if (gw === 0 || gh === 0 || vw <= 0 || vh <= 0) return;
  const s = Math.min(vw / gw, vh / gh);
  scaler.style.transform = `scale(${s})`;
}

window.addEventListener('resize', () => {
  fitGridScale();
});


// Complement: llegenda específica per a conductivitat tèrmica (log) si cal
(function setupThermalLegendOverride(){
  function drawThermalLegendIfNeeded(){
    try{
      if (!document) return;
      if (state.mode !== 'condThermal') return;
      const box = document.getElementById('legend');
      if (!box) return;
      // Neteja i capçalera
      box.innerHTML = '';
      const title = document.createElement('h3'); title.textContent = 'Llegenda'; box.appendChild(title);
      const map = (window.PT_COND)||{}; const unit = 'W/m·K';
      const vals = (state.elements||[]).map(e=>map[e.symbol]?.t).filter(v=>typeof v==='number' && v>0);
      if (vals.length){
        const lmin = Math.log10(Math.min(...vals)), lmax = Math.log10(Math.max(...vals));
        const bins = makeBins(lmin, lmax, paletteThermal.length);
        const wrap = document.createElement('div'); wrap.className='items';
        for (let i=0;i<bins.length;i++){
          const a = i===0 ? lmin : bins[i-1]; const b = bins[i];
          const item = document.createElement('div'); item.className='item';
          item.innerHTML = `<span class="swatch" style="background:${paletteThermal[i]}"></span><span>${formatSI(Math.pow(10,a))} – ${formatSI(Math.pow(10,b))} ${unit}</span>`;
          wrap.appendChild(item);
        }
        box.appendChild(wrap);
        const note = document.createElement('div'); note.style.cssText='margin-top:8px;font-size:12px;color:#6b7280'; note.textContent='Escala logarítmica per visualitzar millor el rang dels valors (≈300 K).'; box.appendChild(note);
      } else {
        const p = document.createElement('div'); p.className='items'; p.innerHTML = '<span class="item">Sense dades</span>'; box.appendChild(p);
      }
    }catch(e){ /* no-op */ }
  }
  // Redibuixa quan canviï el selector
  const sel = document.getElementById('mode-select');
  if (sel) sel.addEventListener('change', ()=> setTimeout(drawThermalLegendIfNeeded));
  // També quan carregui inicialment
  if (typeof window!== 'undefined') window.addEventListener('load', ()=> setTimeout(drawThermalLegendIfNeeded));
})();
