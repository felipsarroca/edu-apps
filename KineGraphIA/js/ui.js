import { normalitzaMobil, calculaPosicio, calculaVelocitat, calculaAcceleracio } from './physics.js';
import { seriesColor, createCardStyles } from './theme.js';

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
const MAGNITUDS_VECTORIALS = new Set(['v0', 'vf', 'a']);

const ETIQUETES = {
  v0: creaEtiquetaVector('v', '0'),
  vf: creaEtiquetaVector('v', 'f'),
  a: creaEtiquetaVector('a'),
  x0: creaEtiquetaEscalar('x', '0'),
  xf: creaEtiquetaEscalar('x', 'f'),
  t: creaEtiquetaEscalar('t'),
  angle: creaEtiquetaEscalar('?')
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
      '<p class="placeholder">Aquí veuràs les dades dels mòbils un cop la IA analitzi l\'enunciat.</p>';
  }
}

export function obtenirBotonsExport() {
  return elements.exportChartBtn;
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
    <div class="mobil-card">[...]
