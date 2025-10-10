import { DEFAULT_RANGE, ZOOM_DEBOUNCE_MS } from './config.js';
import { store } from './store.js';
import {
  appendDataset,
  clearChart,
  createChart,
  getVisibleRange,
  refreshDatasets,
} from './graph.js';
import { renderFunctionsList } from './ui.js';
import { initKeyboard } from './keyboard.js';
import {
  MODE_IDS,
  getCurrentMode,
  getModes,
  setMode,
  subscribeToModeChange,
} from './modes.js';

let chart;
let elements;
let interactionTimeoutId;
let modeButtons = new Map();
let unsubscribeModeChange = null;
let keyboardController;

const getCleanRange = (fallback) => ({ min: fallback.min, max: fallback.max });

const scheduleRegeneration = () => {
  if (store.isEmpty()) {
    return;
  }

  clearTimeout(interactionTimeoutId);
  interactionTimeoutId = setTimeout(() => {
    const visibleRange = getVisibleRange(chart, DEFAULT_RANGE);
    refreshDatasets(chart, store.items, visibleRange);
  }, ZOOM_DEBOUNCE_MS);
};

const updateList = () =>
  renderFunctionsList(elements.functionsList, store.items, handleDelete);

const handleDelete = (index) => {
  store.removeEntry(index);

  if (store.isEmpty()) {
    clearChart(chart);
  } else {
    const range = getVisibleRange(chart, DEFAULT_RANGE);
    refreshDatasets(chart, store.items, range);
  }

  updateList();
};

const ensureModeImplemented = (modeId) => modeId === MODE_IDS.FUNCTION;

const handleAdd = () => {
  const expression = elements.expressionInput.value.trim();
  const currentMode = getCurrentMode();

  if (!expression) {
    window.alert('Si us plau, introdueix una expressió!');
    return;
  }

  if (!ensureModeImplemented(currentMode.id)) {
    window.alert(
      'Aquest mode encara està en desenvolupament. Aviat podràs representar inequacions i sistemes.',
    );
    return;
  }

  try {
    window.math.compile(expression).evaluate({ x: 1 });
  } catch (error) {
    window.alert(
      "Error en l'expressió! Comprova la sintaxi.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3",
    );
    return;
  }

  const wasEmpty = store.isEmpty();
  const entry = store.addEntry(expression, currentMode.id);
  const range = wasEmpty
    ? getCleanRange(DEFAULT_RANGE)
    : getVisibleRange(chart, DEFAULT_RANGE);

  appendDataset(chart, entry, range, wasEmpty);

  elements.expressionInput.value = '';
  elements.expressionInput.focus();
  updateList();
  renderExamples(currentMode);
};

const handleClear = () => {
  if (store.isEmpty()) {
    return;
  }

  const confirmation = window.confirm(
    'Segur que vols eliminar totes les entrades?',
  );
  if (!confirmation) {
    return;
  }

  store.clear();
  clearChart(chart);
  updateList();
  renderExamples(getCurrentMode());
};

const initElements = () => {
  elements = {
    canvas: document.getElementById('graphCanvas'),
    expressionInput: document.getElementById('expressionInput'),
    functionsList: document.getElementById('functionsList'),
    drawButton: document.getElementById('drawButton'),
    clearButton: document.getElementById('clearButton'),
    modeSelector: document.getElementById('modeSelector'),
    modeDescription: document.getElementById('modeDescription'),
    examplesList: document.getElementById('examplesList'),
    keyboardToggle: document.getElementById('toggleKeyboard'),
    keyboardContainer: document.getElementById('keyboardContainer'),
  };
};

const bindEvents = () => {
  elements.drawButton.addEventListener('click', handleAdd);
  elements.clearButton.addEventListener('click', handleClear);
  elements.expressionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  });
};

const attachExampleButtonHandlers = () => {
  const buttons = elements.examplesList.querySelectorAll('[data-expression]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const { expression } = button.dataset;
      elements.expressionInput.value = expression ?? '';
      elements.expressionInput.focus();
    });
  });
};

const renderExamples = (mode) => {
  const fragment = document.createDocumentFragment();

  mode.examples.forEach((example) => {
    fragment.append(createExampleButton(example.label, example.expression));
  });

  const recents = store.getRecentExpressions(mode.id);
  if (recents.length > 0) {
    const separator = document.createElement('div');
    separator.className = 'examples-separator';
    separator.textContent = 'Recents';
    fragment.append(separator);

    recents.forEach((expression) => {
      fragment.append(createExampleButton('Recent', expression, true));
    });
  }

  elements.examplesList.innerHTML = '';
  elements.examplesList.append(fragment);
  attachExampleButtonHandlers();
};

const createExampleButton = (label, expression, isRecent = false) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'example-btn';
  button.dataset.expression = expression;
  button.textContent = isRecent ? `${expression}` : `${label} · ${expression}`;
  return button;
};

const renderModeSelector = () => {
  const modes = getModes();
  elements.modeSelector.innerHTML = '';
  modeButtons = new Map();

  modes.forEach((mode) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mode-button';
    button.dataset.mode = mode.id;
    button.innerHTML = `<span class="mode-label">${mode.label}</span><span class="mode-help">${mode.description}</span>`;

    button.addEventListener('click', () => {
      if (mode.id === getCurrentMode().id) {
        return;
      }

      if (
        elements.expressionInput.value.trim().length > 0 &&
        !window.confirm(
          'Canviar de mode esborrarà l’expressió actual. Vols continuar?',
        )
      ) {
        return;
      }

      elements.expressionInput.value = '';
      setMode(mode.id);
    });

    elements.modeSelector.append(button);
    modeButtons.set(mode.id, button);
  });
};

const highlightActiveMode = (activeModeId) => {
  modeButtons.forEach((button, modeId) => {
    if (modeId === activeModeId) {
      button.classList.add('is-active');
    } else {
      button.classList.remove('is-active');
    }
  });
};

const applyModeToUI = (mode) => {
  highlightActiveMode(mode.id);
  elements.expressionInput.placeholder = mode.placeholder;
  elements.expressionInput.setAttribute(
    'aria-label',
    `Introdueix una expressió per al mode ${mode.label}`,
  );
  elements.modeDescription.textContent = mode.description;
  renderExamples(mode);
};

const initChart = () => {
  chart = createChart(elements.canvas, scheduleRegeneration);
};

const initKeyboardModule = () => {
  keyboardController = initKeyboard({
    container: elements.keyboardContainer,
    inputElement: elements.expressionInput,
    toggleButton: elements.keyboardToggle,
    onEnter: handleAdd,
    onVisibilityChange: (visible) => {
      if (!elements.keyboardToggle) {
        return;
      }
      elements.keyboardToggle.classList.toggle('is-active', visible);
      elements.keyboardToggle.setAttribute('aria-pressed', String(visible));
      elements.keyboardToggle.textContent = visible
        ? '🎹 Amaga el teclat'
        : '🎹 Mostra el teclat';
    },
  });
};

const initModeSubscription = () => {
  if (typeof unsubscribeModeChange === 'function') {
    unsubscribeModeChange();
  }
  unsubscribeModeChange = subscribeToModeChange((mode) => {
    applyModeToUI(mode);
  });
};

const init = () => {
  initElements();
  initChart();
  bindEvents();
  initKeyboardModule();
  renderModeSelector();
  initModeSubscription();
  updateList();
};

document.addEventListener('DOMContentLoaded', init);
