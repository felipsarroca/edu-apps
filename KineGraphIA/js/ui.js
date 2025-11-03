import { normalitzaMobil, calculaPosicio, calculaVelocitat, calculaAcceleracio } from './physics.js';
import { seriesColor, createCardStyles } from './theme.js';

const elements = {
  textarea: null,
  analitzaBtn: null,
  restableixBtn: null,
  status: null,
  sampleSelector: null,
  sessiónsList: null,
  sessiónsPlaceholder: null,
  resultatsContainer: null,
  exportChartBtn: null
};

const restableixCallbacks = [];
const sessióCallbacks = [];
const STORAGE_KEY = 'kinegraphia:sessións';
const MAX_SESSIONS = 10;
const MAGNITUDS_VECTORIALS = new Set(['v0', 'vf', 'a']);

const ETIQUETES = {
  v0: creaEtiquetaVector('v', '0'),
  vf: creaEtiquetaVector('v', 'f'),
  a: creaEtiquetaVector('a'),
  x0: creaEtiquetaEscalar('x', '0'),
  xf: creaEtiquetaEscalar('x', 'f'),
  t: creaEtiquetaEscalar('t'),
  angle: creaEtiquetaEscalar('\u03B8')
};

export function inicialitzaUI() {
  elements.textarea = document.querySelector('#input-enunciat');
  elements.analitzaBtn = document.querySelector('#btn-analitza');
  elements.restableixBtn = document.querySelector('#btn-restableix');
  elements.status = document.querySelector('#status-missatge');
  elements.sampleSelector = document.querySelector('#sample-selector');
  elements.sessiónsList = document.querySelector('#sessións-llista');
  elements.sessiónsPlaceholder = document.querySelector('#sessións-buit');
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
  renderitzaSessions();
}

export function ompleSelectorExemples(exemples, onSeleccio) {
  if (!elements.sampleSelector) return;
  elements.sampleSelector.innerHTML = '<option value="">Tria un exemple</option>';

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

  const targetes = mobils
    .map((mobil, index) => creaTargetaMobil(mobil, index))
    .join('');

  elements.resultatsContainer.innerHTML = `<div class="resultats-grid">${targetes}</div>`;
}

export function netejaResultats() {
  if (elements.resultatsContainer) {
    elements.resultatsContainer.innerHTML =
      '<p class="placeholder">Aqu\u00ED veur\u00E0s les dades dels m\u00F2bils un cop la IA analitzi l\'enunciat.</p>';
  }
}

export function obtenirBotonsExport() {
  return elements.exportChartBtn;
}

export function guardaSessio(enunciat, resposta) {
  try {
    const actuals = llegeixSessions();
    const nova = {
      id: Date.now(),
      enunciat,
      resposta,
      timestamp: new Date().toISOString()
    };
    const actualitzades = [nova, ...actuals].slice(0, MAX_SESSIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualitzades));
    renderitzaSessions();
  } catch (error) {
    console.warn("[ui.js] No s'ha pogut guardar la sessió", error);
  }
}

export function onSessioCarregada(callback) {
  if (typeof callback === 'function') {
    sessióCallbacks.push(callback);
  }
}

function llegeixSessions() {
  try {
    const cru = localStorage.getItem(STORAGE_KEY);
    if (!cru) return [];
    const sessións = JSON.parse(cru);
    return Array.isArray(sessións) ? sessións : [];
  } catch (error) {
    console.warn("[ui.js] Error llegint sessións guardades", error);
    return [];
  }
}

function renderitzaSessions() {
  if (!elements.sessiónsList || !elements.sessiónsPlaceholder) return;
  const sessións = llegeixSessions();

  if (!sessións.length) {
    elements.sessiónsPlaceholder.hidden = false;
    elements.sessiónsList.innerHTML = '';
    return;
  }

  elements.sessiónsPlaceholder.hidden = true;
  elements.sessiónsList.innerHTML = sessións
    .map((sessió) => creaElementSessio(sessió))
    .join('');

  const enllaços = elements.sessiónsList.querySelectorAll('[data-carrega-sessió]');
  enllaços.forEach((enllaç) => {
    enllaç.addEventListener('click', (event) => {
      event.preventDefault();
      const id = Number(enllaç.dataset.id);
      const sessió = sessións.find((item) => item.id === id);
      if (sessió) {
        if (elements.textarea) {
          elements.textarea.value = sessió.enunciat;
        }
        sessióCallbacks.forEach((fn) => fn?.(sessió));
      }
    });
  });

  const esborra = elements.sessiónsList.querySelectorAll('[data-esborra-sessió]');
  esborra.forEach((botó) => {
    botó.addEventListener('click', (event) => {
      event.preventDefault();
      const id = Number(botó.dataset.id);
      eliminaSessio(id);
    });
  });
}

function creaElementSessio(sessió) {
  const dataFormatejada = formatData(sessió.timestamp);
  const resum = resumSessio(sessió.resposta.mobils);

  return `
    <li class="sessión-item">
      <div class="sessión-item__content">
        <strong>${dataFormatejada}</strong>
        <p>${resum}</p>
      </div>
      <div class="sessión-item__actions">
        <button class="btn btn--ghost" data-carrega-sessió data-id="${sessió.id}">Carrega</button>
        <button class="btn btn--icon" data-esborra-sessió data-id="${sessió.id}" aria-label="Esborra">×</button>
      </div>
    </li>
  `;
}

function formatData(timestamp) {
  try {
    const data = new Date(timestamp);
    return data.toLocaleString('ca-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Sessió';
  }
}

function eliminaSessio(id) {
  const actuals = llegeixSessions();
  const filtrades = actuals.filter((sessió) => sessió.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrades));
  renderitzaSessions();
  actualitzaMissatge('Sessió eliminada.', 'info');
}

function resumSessio(mobils = []) {
  if (!Array.isArray(mobils) || mobils.length === 0) return 'Sense dades guardades';
  const llista = mobils.map((mobil) => mobil.nom ?? 'Mòbil').join(', ');
  return `Mòbils: ${llista}`;
}

function creaTargetaMobil(mobil, index) {
  const dades = normalitzaMobil(mobil);
  const colorBase = seriesColor(index);
  const estils = creaEstilInline(createCardStyles(colorBase));
  const magnituds = preparaMagnituds(dades);

  const files = magnituds
    .map(({ clau, valor }) => creaFilaMagnitud(clau, valor))
    .filter(Boolean)
    .join('');

  return `
    <article class="mobil-card" style="${estils}">
      <header class="mobil-card__capcalera">
        <h3>${dades.nom}</h3>
        <span class="mobil-card__etiqueta">${dades.tipus}</span>
      </header>
      <dl class="mobil-card__dades">
        ${files}
      </dl>
    </article>
  `;
}

function creaFilaMagnitud(clau, valor) {
  if (!valor && valor !== 0 && valor !== '0') return '';
  const etiqueta = ETIQUETES[clau] ?? clau;
  const vectorial = MAGNITUDS_VECTORIALS.has(clau);
  return `
    <div class="mobil-card__fila" data-vector="${vectorial}">
      <dt>${etiqueta}</dt>
      <dd class="${vectorial ? 'is-vector' : 'is-scalar'}">${valor}</dd>
    </div>
  `;
}

function preparaMagnituds(dades) {
  const tempsFinal = dades.t;
  const posicioFinal = calculaPosicio(dades, tempsFinal);
  const velocitatFinal = calculaVelocitat(dades, tempsFinal);
  const acceleracio = calculaAcceleracio(dades, tempsFinal);

  const llista = [
    { clau: 'v0', valor: formatUnitat(dades.v0, 'm/s') },
    { clau: 'vf', valor: formatUnitat(velocitatFinal, 'm/s') },
    { clau: 'a', valor: formatUnitat(acceleracio, 'm/s\u00B2') },
    { clau: 'x0', valor: formatUnitat(dades.s0, 'm') },
    { clau: 'xf', valor: formatUnitat(posicioFinal, 'm') },
    { clau: 't', valor: formatUnitat(dades.t, 's') }
  ];

  if (dades.tipus === 'TIR_PARABOLIC' && Number.isFinite(dades.angle)) {
    llista.push({ clau: 'angle', valor: formatUnitat(dades.angle, '\u00c2\u00b0') });
  }

  return llista;
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

function creaEstilInline(estils) {
  return `--card-accent:${estils.accent};--card-border:${estils.border};--card-glow:${estils.glow};--card-soft:${estils.soft};--card-shadow:${estils.shadow};`;
}

console.log('[ui.js] carregat');

