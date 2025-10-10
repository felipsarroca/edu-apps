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

let chart;
let elements;
let interactionTimeoutId;

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
  store.removeFunction(index);

  if (store.isEmpty()) {
    clearChart(chart);
  } else {
    const range = getVisibleRange(chart, DEFAULT_RANGE);
    refreshDatasets(chart, store.items, range);
  }

  updateList();
};

const handleAdd = () => {
  const expression = elements.functionInput.value.trim();

  if (!expression) {
    window.alert('Si us plau, introdueix una funció!');
    return;
  }

  try {
    window.math.compile(expression).evaluate({ x: 1 });
  } catch (error) {
    window.alert(
      "Error en la funció! Comprova la sintaxi.\n\nExemples vàlids:\n- x^2\n- sin(x)\n- 2*x + 3",
    );
    return;
  }

  const wasEmpty = store.isEmpty();
  const entry = store.addFunction(expression);
  const range = wasEmpty
    ? getCleanRange(DEFAULT_RANGE)
    : getVisibleRange(chart, DEFAULT_RANGE);

  appendDataset(chart, entry, range, wasEmpty);

  elements.functionInput.value = '';
  updateList();
};

const handleClear = () => {
  if (store.isEmpty()) {
    return;
  }

  const confirmation = window.confirm(
    'Segur que vols eliminar totes les funcions?',
  );
  if (!confirmation) {
    return;
  }

  store.clear();
  clearChart(chart);
  updateList();
};

const initElements = () => {
  elements = {
    canvas: document.getElementById('graphCanvas'),
    functionInput: document.getElementById('functionInput'),
    functionsList: document.getElementById('functionsList'),
    drawButton: document.getElementById('drawButton'),
    clearButton: document.getElementById('clearButton'),
    exampleButtons: Array.from(
      document.querySelectorAll('[data-expression]'),
    ),
  };
};

const bindEvents = () => {
  elements.drawButton.addEventListener('click', handleAdd);
  elements.clearButton.addEventListener('click', handleClear);
  elements.functionInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  });

  elements.exampleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { expression } = button.dataset;
      elements.functionInput.value = expression ?? '';
      elements.functionInput.focus();
    });
  });
};

const initChart = () => {
  chart = createChart(elements.canvas, scheduleRegeneration);
};

const init = () => {
  initElements();
  initChart();
  bindEvents();
  updateList();
};

document.addEventListener('DOMContentLoaded', init);
