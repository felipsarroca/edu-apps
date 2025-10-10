import { COLORS } from './config.js';
import { MODE_IDS } from './modes.js';

const MAX_RECENT = 10;
const cryptoApi = globalThis.crypto ?? (globalThis.window && window.crypto);

const formatLabel = (mode, expression) => {
  if (mode === MODE_IDS.FUNCTION) {
    return expression.includes('=') ? expression : `y = ${expression}`;
  }
  return expression;
};

const createId = () => {
  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }
  if (cryptoApi?.getRandomValues) {
    const buffer = new Uint32Array(4);
    cryptoApi.getRandomValues(buffer);
    return Array.from(buffer, (value) => value.toString(16).padStart(8, '0')).join('');
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const recordRecent = (registry, mode, expression) => {
  if (!registry[mode]) {
    registry[mode] = [];
  }
  const list = registry[mode];
  const existingIndex = list.findIndex((item) => item === expression);
  if (existingIndex !== -1) {
    list.splice(existingIndex, 1);
  }
  list.unshift(expression);
  if (list.length > MAX_RECENT) {
    list.length = MAX_RECENT;
  }
};

export const store = {
  items: [],
  colorIndex: 0,
  recentExpressions: {
    [MODE_IDS.FUNCTION]: [],
    [MODE_IDS.INEQUALITY]: [],
    [MODE_IDS.SYSTEM]: [],
  },

  addEntry(expression, mode) {
    const color = COLORS[this.colorIndex % COLORS.length];
    this.colorIndex += 1;
    const entry = {
      id: createId(),
      expression,
      expressions: [expression],
      color,
      mode,
      label: formatLabel(mode, expression),
      metadata: {
        summary:
          mode === MODE_IDS.FUNCTION
            ? 'Representació gràfica activa.'
            : null,
      },
    };
    this.items.push(entry);
    recordRecent(this.recentExpressions, mode, expression);
    return entry;
  },

  removeEntry(index) {
    this.items.splice(index, 1);
  },

  clear() {
    this.items = [];
    this.colorIndex = 0;
  },

  isEmpty() {
    return this.items.length === 0;
  },

  getRecentExpressions(mode) {
    return this.recentExpressions[mode] ?? [];
  },
};
