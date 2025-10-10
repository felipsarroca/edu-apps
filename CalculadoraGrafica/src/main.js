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
const OPERATOR_SYMBOL = {
  '>=': '≥',
  '<=': '≤',
  '>': '>',
  '<': '<',
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return String(value);
  }
  if (Number.isInteger(value)) {
    return value.toString();
  }
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.001 || abs >= 1000)) {
    return value.toExponential(2);
  }
  return value.toFixed(4).replace(/\.?0+$/, '');
};

const safeEvaluate = (compiled, x) => {
  try {
    const value = compiled.evaluate({ x });
    if (!Number.isFinite(value)) {
      return null;
    }
    return Number(value);
  } catch (error) {
    return null;
  }
};

const ROOT_SEARCH_SAMPLES = 200;
const ROOT_MAX_ITER = 40;
const ROOT_TOLERANCE = 1e-4;
const ROOT_MERGE_TOLERANCE = 1e-3;

const addRootIfNew = (roots, candidate) => {
  if (!Number.isFinite(candidate)) {
    return;
  }
  if (
    roots.some((root) => Math.abs(root - candidate) < ROOT_MERGE_TOLERANCE)
  ) {
    return;
  }
  roots.push(candidate);
};

const bisectRoot = (compiled, left, right, fLeft, fRight) => {
  let a = left;
  let b = right;
  let fa = fLeft;
  let fb = fRight;

  if (!Number.isFinite(fa) || !Number.isFinite(fb) || fa === fb) {
    return null;
  }

  for (let i = 0; i < ROOT_MAX_ITER; i += 1) {
    const mid = (a + b) / 2;
    const fm = safeEvaluate(compiled, mid);
    if (fm === null) {
      return null;
    }
    if (Math.abs(fm) < ROOT_TOLERANCE || (b - a) / 2 < ROOT_TOLERANCE) {
      return mid;
    }
    if (Math.sign(fm) === Math.sign(fa)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
      fb = fm;
    }
  }
  return (a + b) / 2;
};

const findRoots = (compiled, range = DEFAULT_RANGE) => {
  const roots = [];
  const min = Number.isFinite(range.min) ? range.min : DEFAULT_RANGE.min;
  const max = Number.isFinite(range.max) ? range.max : DEFAULT_RANGE.max;

  if (!(max > min)) {
    return roots;
  }

  const step = (max - min) / ROOT_SEARCH_SAMPLES;
  let prevX = min;
  let prevY = safeEvaluate(compiled, prevX);

  if (prevY !== null && Math.abs(prevY) < ROOT_TOLERANCE) {
    addRootIfNew(roots, prevX);
  }

  for (let i = 1; i <= ROOT_SEARCH_SAMPLES; i += 1) {
    const x = min + i * step;
    const y = safeEvaluate(compiled, x);

    if (y !== null && Math.abs(y) < ROOT_TOLERANCE) {
      addRootIfNew(roots, x);
    }

    if (
      prevY !== null &&
      y !== null &&
      Math.sign(prevY) !== Math.sign(y) &&
      prevY !== 0 &&
      y !== 0
    ) {
      const root = bisectRoot(compiled, prevX, x, prevY, y);
      if (root !== null) {
        addRootIfNew(roots, root);
      }
    }

    prevX = x;
    prevY = y;
  }

  return roots.sort((a, b) => a - b);
};

const collectFunctionInsights = (compiled) => {
  const insights = [];

  const yAtZero = safeEvaluate(compiled, 0);
  if (yAtZero !== null) {
    insights.push({
      label: "Tall amb l'eix Y",
      description: `(0, ${formatNumber(yAtZero)})`,
    });
  }

  const roots = findRoots(compiled);
  if (roots.length > 0) {
    const description =
      roots.length === 1
        ? `x ≈ ${formatNumber(roots[0])}`
        : roots
            .map((root, index) => `x${index + 1} ≈ ${formatNumber(root)}`)
            .join(', ');
    insights.push({
      label: roots.length === 1 ? 'Arrel aproximada' : 'Arrels aproximades',
      description,
    });
  }

  return insights;
};

const resetSystemEntries = () => {
  systemEntries = ['', ''];
};

const renderSystemInputs = (focusLast = false) => {
  if (!elements?.systemInputsList) {
    return;
  }

  if (!Array.isArray(systemEntries) || systemEntries.length === 0) {
    resetSystemEntries();
  }

  elements.systemInputsList.innerHTML = '';

  systemEntries.forEach((value, index) => {
    const row = document.createElement('div');
    row.className = 'system-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.placeholder = `Expressió ${index + 1}`;
    input.addEventListener('input', (event) => {
      systemEntries[index] = event.target.value;
    });
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleAdd();
      }
    });

    row.append(input);

    if (systemEntries.length > 1) {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'system-remove';
      removeButton.textContent = '✕';
      removeButton.addEventListener('click', () => {
        systemEntries.splice(index, 1);
        if (systemEntries.length === 0) {
          resetSystemEntries();
        }
        renderSystemInputs(true);
      });
      row.append(removeButton);
    }

    elements.systemInputsList.append(row);
  });

  if (focusLast) {
    const lastInput = elements.systemInputsList.querySelector(
      '.system-row:last-child input[type="text"]',
    );
    lastInput?.focus();
  }
};

const toggleInputInterface = (modeId) => {
  const isSystem = modeId === MODE_IDS.SYSTEM;
  if (elements.singleInputWrapper) {
    elements.singleInputWrapper.hidden = isSystem;
  }
  if (elements.systemInputsWrapper) {
    elements.systemInputsWrapper.hidden = !isSystem;
  }

  if (isSystem) {
    renderSystemInputs();
    keyboardController?.hide?.();
  }

  if (elements.keyboardToggle) {
    elements.keyboardToggle.disabled = isSystem;
    elements.keyboardToggle.classList.toggle('is-disabled', isSystem);
    elements.keyboardToggle.setAttribute('aria-disabled', String(isSystem));
    if (isSystem) {
      elements.keyboardToggle.setAttribute('aria-pressed', 'false');
      elements.keyboardToggle.textContent = '🎹 Mostra el teclat';
    }
  }
};

let chart;
let elements;
let interactionTimeoutId;
let modeButtons = new Map();
let unsubscribeModeChange = null;
let keyboardController;
let systemEntries = ['', ''];

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
  let compiled;
  try {
    compiled = math.compile(expression);
    compiled.evaluate({ x: 1 });
  } catch (error) {
    window.alert(
      "Error en l'expressió! Comprova la sintaxi.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3",
    );
    return;
  }

  const wasEmpty = store.isEmpty();
  const metadata = {
    summary: 'Representació gràfica activa.',
    results: collectFunctionInsights(compiled),
  };

  store.addEntry(expression, MODE_IDS.FUNCTION, {
    metadata,
  });

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

  const wasEmpty = store.isEmpty();

  const inequalityMeta = { ...parsed };
  const metadata = {
    inequality: inequalityMeta,
    summary: '',
    results: [],
  };

  let expressionForStore = '0';

  if (parsed.type === 'single' && parsed.variable === 'y') {
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

    inequalityMeta.compiled = compiled;

    metadata.summary =
      parsed.orientation === 'above'
        ? 'Zona ressaltada per sobre de la corba.'
        : 'Zona ressaltada per sota de la corba.';

    metadata.results.push({
      label: 'Zona',
      description:
        parsed.orientation === 'above'
          ? 'Inclou tots els punts per sobre de la corba frontera.'
          : 'Inclou tots els punts per sota de la corba frontera.',
    });
    metadata.results.push({
      label: 'Límit',
      description: `y ${OPERATOR_SYMBOL[parsed.operator] ?? parsed.operator} ${
        parsed.expression
      } (${parsed.inclusive ? 'inclòs' : 'no inclòs'})`,
    });

    metadata.results.push(
      ...collectFunctionInsights(compiled).map((insight) => ({
        label: `${insight.label} (frontera)`,
        description: insight.description,
      })),
    );

    expressionForStore = parsed.expression;
  } else if (parsed.type === 'single' && parsed.variable === 'x') {
    metadata.summary =
      parsed.orientation === 'right'
        ? 'Zona ressaltada a la dreta del límit vertical.'
        : 'Zona ressaltada a l’esquerra del límit vertical.';

    metadata.results.push({
      label: 'Zona',
      description:
        parsed.orientation === 'right'
          ? `Inclou tots els punts amb x ${parsed.inclusive ? '≥' : '>'} ${formatNumber(parsed.value)}.`
          : `Inclou tots els punts amb x ${parsed.inclusive ? '≤' : '<'} ${formatNumber(parsed.value)}.`,
    });
    metadata.results.push({
      label: 'Límit',
      description: `x ${OPERATOR_SYMBOL[parsed.operator] ?? parsed.operator} ${formatNumber(parsed.value)} (${parsed.inclusive ? 'inclòs' : 'no inclòs'})`,
    });
  } else if (parsed.type === 'double') {
    const lower = parsed.range?.lower;
    const upper = parsed.range?.upper;
    if (!lower || !upper) {
      window.alert('No s’ha pogut interpretar el rang de la desigualtat.');
      return;
    }

    const lowerSymbol = lower.inclusive ? '≥' : '>';
    const upperSymbol = upper.inclusive ? '≤' : '<';

    const lowerText =
      parsed.variable === 'y'
        ? `y ${lowerSymbol} ${formatNumber(lower.value)}`
        : `x ${lowerSymbol} ${formatNumber(lower.value)}`;
    const upperText =
      parsed.variable === 'y'
        ? `y ${upperSymbol} ${formatNumber(upper.value)}`
        : `x ${upperSymbol} ${formatNumber(upper.value)}`;

    metadata.summary =
      parsed.variable === 'y'
        ? 'Franja horitzontal entre els límits indicats.'
        : 'Franja vertical entre els límits indicats.';

    metadata.results.push({
      label: 'Franja',
      description: `${lowerText} i ${upperText}.`,
    });
    metadata.results.push({
      label: 'Límit inferior',
      description: `${lowerText} (${lower.inclusive ? 'inclòs' : 'no inclòs'})`,
    });
    metadata.results.push({
      label: 'Límit superior',
      description: `${upperText} (${upper.inclusive ? 'inclòs' : 'no inclòs'})`,
    });
  } else {
    metadata.summary = 'Format de desigualtat no suportat completament.';
  }

  const entry = store.addEntry(expressionForStore, MODE_IDS.INEQUALITY, {
    label: parsed.display,
    metadata,
    recentValue: parsed.display,
  });

  if (entry?.metadata?.inequality) {
    entry.metadata.inequality = inequalityMeta;
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
  if (getCurrentMode().id === MODE_IDS.SYSTEM) {
    resetSystemEntries();
    renderSystemInputs();
  }
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
    singleInputWrapper: document.getElementById('singleInputWrapper'),
    systemInputsWrapper: document.getElementById('systemInputs'),
    systemInputsList: document.getElementById('systemInputsList'),
    addSystemRowButton: document.getElementById('addSystemRow'),
  };

  renderSystemInputs();
};

const bindEvents = () => {
  elements.drawButton.addEventListener('click', handleAdd);
  elements.clearButton.addEventListener('click', handleClear);
  elements.expressionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  });

  if (elements.addSystemRowButton) {
    elements.addSystemRowButton.addEventListener('click', () => {
      systemEntries.push('');
      renderSystemInputs(true);
    });
  }
};

const attachExampleButtonHandlers = () => {
  const buttons = elements.examplesList.querySelectorAll('[data-expression]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const { expression } = button.dataset;
      const currentMode = getCurrentMode();
      if (currentMode.id === MODE_IDS.SYSTEM) {
        if (expression) {
          const cleaned = expression.replace(/[{}]/g, '');
          const parts = cleaned
            .split(';')
            .map((part) => part.trim())
            .filter((part) => part.length > 0);
          systemEntries = parts.length > 0 ? parts : [''];
          if (systemEntries.length === 1) {
            systemEntries.push('');
          }
        } else {
          resetSystemEntries();
        }
        renderSystemInputs();
        const firstInput = elements.systemInputsList?.querySelector(
          '.system-row input[type="text"]',
        );
        firstInput?.focus();
      } else {
        elements.expressionInput.value = expression ?? '';
        elements.expressionInput.focus();
      }
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
  toggleInputInterface(mode.id);

  if (mode.id !== MODE_IDS.SYSTEM) {
    elements.expressionInput.placeholder = mode.placeholder;
    elements.expressionInput.setAttribute(
      'aria-label',
      `Introdueix una expressió per al mode ${mode.label}`,
    );
  } else {
    elements.expressionInput.value = '';
  }

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
