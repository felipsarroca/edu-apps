const elements = {
  textarea: null,
  analitzaBtn: null,
  restableixBtn: null,
  status: null,
  sampleSelector: null,
  sessionsList: null,
  sessionsPlaceholder: null
};

export function inicialitzaUI() {
  elements.textarea = document.querySelector('#input-enunciat');
  elements.analitzaBtn = document.querySelector('#btn-analitza');
  elements.restableixBtn = document.querySelector('#btn-restableix');
  elements.status = document.querySelector('#status-missatge');
  elements.sampleSelector = document.querySelector('#sample-selector');
  elements.sessionsList = document.querySelector('#sessions-llista');
  elements.sessionsPlaceholder = document.querySelector('#sessions-buit');

  elements.restableixBtn?.addEventListener('click', () => {
    if (!elements.textarea) return;
    elements.textarea.value = '';
    actualitzaMissatge('Escriu un enunciat per començar.', 'info');
  });

  actualitzaMissatge('Escriu un enunciat per començar.', 'info');
}

export function ompleSelectorExemples(exemples) {
  if (!elements.sampleSelector) return;
  // Esborra opcions actuals
  elements.sampleSelector.innerHTML = '<option value="">Tria un exemple</option>';

  exemples.forEach((exemple, index) => {
    const opcio = document.createElement('option');
    opcio.value = String(index);
    opcio.textContent = exemple.titol;
    elements.sampleSelector?.appendChild(opcio);
  });

  elements.sampleSelector.addEventListener('change', (event) => {
    const valor = event.target.value;
    if (valor === '') return;
    const seleccionat = Number(valor);
    if (Number.isNaN(seleccionat)) return;
    const exemple = exemples[seleccionat];
    if (exemple && elements.textarea) {
      elements.textarea.value = exemple.enunciat;
      actualitzaMissatge('Exemple carregat. Prem “Analitza amb IA” per veure els resultats.', 'info');
    }
  });
}

export function actualitzaMissatge(text, tipus = 'info') {
  if (!elements.status) return;
  elements.status.textContent = text;
  elements.status.classList.toggle('status--error', tipus === 'error');
  elements.status.classList.toggle('status--info', tipus !== 'error');
}

export function obtenirElementsUI() {
  return { ...elements };
}

console.log('[ui.js] carregat');
