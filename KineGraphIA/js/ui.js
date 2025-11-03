const elements = {
  textarea: null,
  analitzaBtn: null,
  restableixBtn: null,
  status: null,
  sampleSelector: null,
  sessionsList: null,
  sessionsPlaceholder: null,
  resultatsContainer: null,
  exportPosicioBtn: null,
  exportVelocitatBtn: null
};

const restableixCallbacks = [];

export function inicialitzaUI() {
  elements.textarea = document.querySelector('#input-enunciat');
  elements.analitzaBtn = document.querySelector('#btn-analitza');
  elements.restableixBtn = document.querySelector('#btn-restableix');
  elements.status = document.querySelector('#status-missatge');
  elements.sampleSelector = document.querySelector('#sample-selector');
  elements.sessionsList = document.querySelector('#sessions-llista');
  elements.sessionsPlaceholder = document.querySelector('#sessions-buit');
  elements.resultatsContainer = document.querySelector('#resultats-container');
  elements.exportPosicioBtn = document.querySelector('#btn-exporta-position');
  elements.exportVelocitatBtn = document.querySelector('#btn-exporta-velocity');

  elements.restableixBtn?.addEventListener('click', () => {
    elements.textarea.value = '';
    if (elements.sampleSelector) {
      elements.sampleSelector.value = '';
    }
    netejaResultats();
    actualitzaMissatge('Enunciat restablert. Escriu un text o tria un exemple.', 'info');
    restableixCallbacks.forEach((fn) => fn?.());
  });

  actualitzaMissatge('Escriu un enunciat per comen\u00E7ar.', 'info');
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
      '<p class="placeholder">Aqu\u00ED veur\u00E0s les dades dels mobils un cop la IA analitzi l\'enunciat.</p>';
  }
}

export function obtenirBotonsExport() {
  return {
    posicio: elements.exportPosicioBtn,
    velocitat: elements.exportVelocitatBtn
  };
}

function creaTargetaMobil(mobil) {
  const camps = [
    formatCamp('Tipus', mobil.tipus),
    formatCamp('v0', formatUnitat(mobil.v0, 'm/s')),
    formatCamp('a', formatUnitat(mobil.a, 'm/s^2')),
    formatCamp('s0', formatUnitat(mobil.s0, 'm')),
    formatCamp('t', formatUnitat(mobil.t, 's')),
    mobil.angle !== undefined ? formatCamp('Angle', formatUnitat(mobil.angle, 'graus')) : ''
  ]
    .filter(Boolean)
    .join('');

  return `
    <article class="mobil-card">
      <header class="mobil-card__capcalera">
        <h3>${mobil.nom ?? 'Mobil'}</h3>
        <span class="mobil-card__etiqueta">${mobil.tipus ?? '-'}</span>
      </header>
      <dl class="mobil-card__dades">
        ${camps}
      </dl>
    </article>
  `;
}

function formatCamp(titol, valor) {
  if (!valor && valor !== 0) return '';
  return `
    <div class="mobil-card__fila">
      <dt>${titol}</dt>
      <dd>${valor}</dd>
    </div>
  `;
}

function formatUnitat(valor, unitat) {
  if (valor === undefined || valor === null || valor === '') return '';
  if (!Number.isFinite(Number(valor))) return `${valor} ${unitat}`;
  const numerico = Number(valor).toFixed(Math.abs(Number(valor)) < 10 ? 2 : 1);
  return `${treuZerosFinals(numerico)} ${unitat}`;
}

function treuZerosFinals(text) {
  return text.replace(/\.?0+$/, '');
}

console.log('[ui.js] carregat');
