const elements = {
  textarea: null,
  analitzaBtn: null,
  restableixBtn: null,
  status: null,
  sampleSelector: null,
  sessionsList: null,
  sessionsPlaceholder: null,
  resultatsContainer: null,
  exportChartBtn: null
};

const restableixCallbacks = [];

const ETIQUETES = {
  v0: creaEtiquetaVector('v', '0'),
  vf: creaEtiquetaVector('v', 'f'),
  a: creaEtiquetaVector('a'),
  s0: creaEtiquetaEscalar('s', '0'),
  t: creaEtiquetaEscalar('t'),
  angle: creaEtiquetaEscalar('θ')
};

export function inicialitzaUI() {
  elements.textarea = document.querySelector('#input-enunciat');
  elements.analitzaBtn = document.querySelector('#btn-analitza');
  elements.restableixBtn = document.querySelector('#btn-restableix');
  elements.status = document.querySelector('#status-missatge');
  elements.sampleSelector = document.querySelector('#sample-selector');
  elements.sessionsList = document.querySelector('#sessions-llista');
  elements.sessionsPlaceholder = document.querySelector('#sessions-buit');
  elements.resultatsContainer = document.querySelector('#resultats-container');
  elements.exportChartBtn = document.querySelector('#btn-exporta-chart');

  elements.restableixBtn?.addEventListener('click', () => {
    elements.textarea.value = '';
    if (elements.sampleSelector) {
      elements.sampleSelector.value = '';
    }
    netejaResultats();
    actualitzaMissatge('Enunciat restablert. Escriu-ne un de nou o tria un exemple.', 'info');
    restableixCallbacks.forEach((fn) => fn?.());
  });

  actualitzaMissatge('Cap enunciat carregat.', 'info');
}

export function ompleSelectorExemples(exemples, onSeleccio) {
  if (!elements.sampleSelector) return;
  elements.sampleSelector.innerHTML = '<option value="">Tria un exemple</option>';

  console.log('[ui.js] Carregant exemples al selector:', exemples);

  exemples.forEach((exemple, index) => {
    const opcio = document.createElement('option');
    opcio.value = String(index);
    opcio.textContent = exemple.titol;
    elements.sampleSelector.appendChild(opcio);
  });

  elements.sampleSelector.addEventListener('change', (event) => {
    const valor = event.target.value;
    if (valor === '') return;
    const seleccionat = Number(valor);
    if (Number.isNaN(seleccionat)) return;

    const exemple = exemples[seleccionat];
    if (exemple) {
      elements.textarea.value = exemple.enunciat;
      actualitzaMissatge(`Exemple "${exemple.titol}" carregat. Prem "Analitza amb IA".`, 'info');
      onSeleccio?.(exemple, seleccionat);
    }
  });
}

export function onAnalitza(callback) {
  elements.analitzaBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    callback?.();
  });
}

export function onRestableix(callback) {
  if (typeof callback === 'function') {
    restableixCallbacks.push(callback);
  }
}

export function actualitzaMissatge(text, tipus = 'info') {
  if (!elements.status) return;
  elements.status.textContent = text;
  elements.status.classList.toggle('status--error', tipus === 'error');
  elements.status.classList.toggle('status--info', tipus !== 'error');
}

export function obtenirEnunciat() {
  return elements.textarea?.value.trim() ?? '';
}

export function setAnalitzaDeshabilitat(deshabilitat) {
  if (elements.analitzaBtn) {
    elements.analitzaBtn.disabled = deshabilitat;
    elements.analitzaBtn.textContent = deshabilitat ? 'Analitzant...' : 'Analitza amb IA';
  }
}

export function mostraResultats(mobils) {
  if (!elements.resultatsContainer) return;
  if (!Array.isArray(mobils) || mobils.length === 0) {
    elements.resultatsContainer.innerHTML = '<p class="placeholder">No hi ha dades disponibles encara.</p>';
    return;
  }

  const targetes = mobils.map((mobil) => creaTargetaMobil(mobil)).join('');
  elements.resultatsContainer.innerHTML = `<div class="resultats-grid">${targetes}</div>`;
}

export function netejaResultats() {
  if (elements.resultatsContainer) {
    elements.resultatsContainer.innerHTML =
      '<p class="placeholder">Aquí veuràs les dades dels mòbils un cop la IA analitzi l\'enunciat.</p>';
  }
}

export function obtenirBotonsExport() {
  return elements.exportChartBtn;
}

function creaTargetaMobil(mobil) {
  const dades = normalitzaMobil(mobil);
  const magnituds = preparaMagnituds(dades);
  const camps = [
    creaFilaMagnitud('v0', magnituds.v0),
    creaFilaMagnitud('vf', magnituds.vf),
    creaFilaMagnitud('a', magnituds.a),
    creaFilaMagnitud('s0', magnituds.s0),
    creaFilaMagnitud('t', magnituds.t),
    dades.tipus === 'TIR_PARABOLIC' ? creaFilaMagnitud('angle', magnituds.angle) : ''
  ]
    .filter(Boolean)
    .join('');

  return `
    <article class="mobil-card">
      <header class="mobil-card__capcalera">
        <h3>${dades.nom}</h3>
        <span class="mobil-card__etiqueta">${dades.tipus}</span>
      </header>
      <dl class="mobil-card__dades">
        ${camps}
      </dl>
    </article>
  `;
}

function creaFilaMagnitud(clau, valor) {
  if (!valor && valor !== 0 && valor !== '0') return '';
  const etiqueta = ETIQUETES[clau] ?? clau;
  return `
    <div class="mobil-card__fila">
      <dt>${etiqueta}</dt>
      <dd>${valor}</dd>
    </div>
  `;
}

function preparaMagnituds(dades) {
  return {
    v0: formatUnitat(dades.v0, 'm/s'),
    vf: formatUnitat(calculaVelocitatFinal(dades), 'm/s'),
    a: formatUnitat(calculaAcceleracio(dades), 'm/s²'),
    s0: formatUnitat(dades.s0, 'm'),
    t: formatUnitat(dades.t, 's'),
    angle: formatUnitat(dades.angle, '°')
  };
}

function normalitzaMobil(raw = {}) {
  const tipus = (raw.tipus || 'MRU').toUpperCase();
  return {
    nom: raw.nom ?? 'Mòbil',
    tipus,
    v0: toNumber(raw.v0, 0),
    a: toNumber(raw.a, 0),
    s0: toNumber(raw.s0, 0),
    t: Math.max(0, toNumber(raw.t, 0)),
    angle: raw.angle !== undefined ? toNumber(raw.angle, 0) : undefined,
    g: toNumber(raw.g, 9.81)
  };
}

function toNumber(valor, perDefecte) {
  if (valor === undefined || valor === null || valor === '') return perDefecte;
  const num = Number(valor);
  return Number.isFinite(num) ? num : perDefecte;
}

function calculaAcceleracio(dades) {
  switch (dades.tipus) {
    case 'MRU':
      return 0;
    case 'MRUA':
      return dades.a;
    case 'CAIGUDA':
    case 'TIR_VERTICAL':
    case 'TIR_PARABOLIC':
      return -dades.g;
    default:
      return dades.a;
  }
}

function calculaVelocitatFinal(dades) {
  const t = dades.t;
  switch (dades.tipus) {
    case 'MRU':
      return dades.v0;
    case 'MRUA':
      return dades.v0 + dades.a * t;
    case 'CAIGUDA':
    case 'TIR_VERTICAL':
      return dades.v0 - dades.g * t;
    case 'TIR_PARABOLIC': {
      const angleRad = (toNumber(dades.angle, 0) * Math.PI) / 180;
      const vx = dades.v0 * Math.cos(angleRad);
      const vy = dades.v0 * Math.sin(angleRad) - dades.g * t;
      const velocitat = Math.sqrt(vx ** 2 + vy ** 2);
      return Number.isFinite(velocitat) ? velocitat : dades.v0;
    }
    default:
      return dades.v0;
  }
}

function formatUnitat(valor, unitat) {
  if (valor === undefined || valor === null || valor === '') return '';
  if (!Number.isFinite(Number(valor))) return `${valor} ${unitat}`;
  const numeric = Number(valor);
  const decimals = Math.abs(numeric) < 10 ? 2 : 1;
  const net = treuZerosFinals(numeric.toFixed(decimals));
  return `${net} ${unitat}`;
}

function treuZerosFinals(text) {
  return text.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
}

function creaEtiquetaVector(base, sub = '') {
  const subscript = sub ? `<sub>${sub}</sub>` : '';
  return `<span class="symbol symbol--vector">${base}${subscript}</span>`;
}

function creaEtiquetaEscalar(base, sub = '') {
  const subscript = sub ? `<sub>${sub}</sub>` : '';
  return `<span class="symbol symbol--scalar">${base}${subscript}</span>`;
}

console.log('[ui.js] carregat');
