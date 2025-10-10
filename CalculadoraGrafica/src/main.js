import { DEFAULT_RANGE, ZOOM_DEBOUNCE_MS } from './config.js';
import { store } from './store.js';
import {
  buildDatasets,
  createChart,
  getVisibleBounds,
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
import { parseInequality } from './parser.js';

const { math } = window;

let chart;
let elements;
let interactionTimeoutId;
let modeButtons = new Map();
let unsubscribeModeChange = null;
let keyboardController;

const SUPPORTED_MODES = new Set([MODE_IDS.FUNCTION, MODE_IDS.INEQUALITY]);

const updateList = () =>
  renderFunctionsList(elements.functionsList, store.items, handleDelete);

const rebuildChartDatasets = (animate = true) => {
  if (!chart) {
    return;
  }

  const bounds = getVisibleBounds(chart, DEFAULT_RANGE);

  if (store.isEmpty()) {
    chart.data.datasets = [];
    chart.update(animate ? undefined : 'none');
    return;
  }

  const datasets = buildDatasets(store.items, bounds);
  chart.data.datasets = datasets;
  chart.update(animate ? undefined : 'none');
};

const scheduleRegeneration = () => {
  clearTimeout(interactionTimeoutId);
  interactionTimeoutId = setTimeout(() => {
    rebuildChartDatasets(false);
  }, ZOOM_DEBOUNCE_MS);
};

const finalizeAddition = (wasEmpty, modeConfig) => {
  elements.expressionInput.value = '';
  elements.expressionInput.focus();
  updateList();
  renderExamples(modeConfig);
  rebuildChartDatasets(wasEmpty);
};

const addFunctionEntry = (expression, modeConfig) => {
  try {
    math.compile(expression).evaluate({ x: 1 });
  } catch (error) {
    window.alert(
      "Error en l'expressió! Comprova la sintaxi.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3",
    );
    return;
  }

  const wasEmpty = store.isEmpty();
  store.addEntry(expression, MODE_IDS.FUNCTION);
  finalizeAddition(wasEmpty, modeConfig);
};

const addInequalityEntry = (rawExpression, modeConfig) => {
  let parsed;
  try {
    parsed = parseInequality(rawExpression);
  } catch (error) {
    window.alert(error.message ?? 'Inequació no vàlida.');
    return;
  }

  let compiled;
  try {
    compiled = math.compile(parsed.expression);
    compiled.evaluate({ x: 0 });
  } catch (error) {
    window.alert(
      'La inequació conté una expressió que no es pot interpretar. Revisa la sintaxi.',
    );
    return;
  }

  const wasEmpty = store.isEmpty();
  const summary =
    parsed.orientation === 'above'
      ? 'Zona ressaltada per sobre de la corba.'
      : 'Zona ressaltada per sota de la corba.';

  const metadata = {
    inequality: {
      ...parsed,
      compiled,
    },
    summary,
    results: [
      {
        label: 'Zona',
        description:
          parsed.orientation === 'above'
            ? 'Inclou tots els punts per sobre de la corba frontera.'
            : 'Inclou tots els punts per sota de la corba frontera.',
      },
    ],
  };

  const entry = store.addEntry(parsed.expression, MODE_IDS.INEQUALITY, {
    label: parsed.display,
    metadata,
    recentValue: parsed.display,
  });

  // Assegurar que la còpia retornada manté la referència al compiled
  if (entry?.metadata?.inequality) {
    entry.metadata.inequality.compiled = compiled;
  }

  finalizeAddition(wasEmpty, modeConfig);
};

const handleDelete = (index) => {
  store.removeEntry(index);
  rebuildChartDatasets(false);
  updateList();
};

const handleAdd = () => {
  const expression = elements.expressionInput.value.trim();
  const currentMode = getCurrentMode();

  if (!expression) {
    window.alert('Si us plau, introdueix una expressió!');
    return;
  }

  if (!SUPPORTED_MODES.has(currentMode.id)) {
    window.alert(
      'Aquest mode encara està en desenvolupament. Aviat podràs representar sistemes.',
    );
    return;
  }

  if (currentMode.id === MODE_IDS.FUNCTION) {
    addFunctionEntry(expression, currentMode);
    return;
  }

  if (currentMode.id === MODE_IDS.INEQUALITY) {
    addInequalityEntry(expression, currentMode);
  }
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
  rebuildChartDatasets(false);
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

const createExampleButton = (label, expression, isRecent = false) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'example-btn';
  button.dataset.expression = expression;
  button.textContent = isRecent ? `${expression}` : `${label} · ${expression}`;
  return button;
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
