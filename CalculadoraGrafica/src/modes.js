const STORAGE_KEY = 'calcGraph.currentMode';
const FALLBACK_MODE = 'function';

export const MODE_IDS = {
  FUNCTION: 'function',
  INEQUALITY: 'inequality',
  SYSTEM: 'system',
};

const MODE_CONFIG_LIST = [
  {
    id: MODE_IDS.FUNCTION,
    label: 'Funció',
    description: 'Representa funcions del tipus y = f(x)',
    placeholder: 'Exemple: y = 2*x + 3',
    examples: [
      { label: 'Paràbola', expression: 'x^2 - 4*x + 3' },
      { label: 'Sinusoïdal', expression: 'sin(x)' },
      { label: 'Recta', expression: '2*x + 3' },
      { label: 'Exponencial', expression: 'exp(x)' },
    ],
  },
  {
    id: MODE_IDS.INEQUALITY,
    label: 'Inequació',
    description: 'Visualitza desigualtats i regions de solucions',
    placeholder: 'Exemple: y ≥ x^2',
    examples: [
      { label: 'Major o igual', expression: 'y ≥ x^2' },
      { label: 'Interval en x', expression: '-2 < x ≤ 3' },
      { label: 'Valor absolut', expression: '|x| < 4' },
    ],
  },
  {
    id: MODE_IDS.SYSTEM,
    label: 'Sistema',
    description: 'Resol i representa sistemes d’equacions o inequacions',
    placeholder: 'Exemple: { y = x + 1 ; y = -x + 3 }',
    examples: [
      {
        label: 'Sistema lineal',
        expression: '{ y = 2*x - 1 ; y = -x + 5 }',
      },
      {
        label: 'Sistema amb inequacions',
        expression: '{ y ≥ x ; y ≤ 4 }',
      },
    ],
  },
];

const MODE_CONFIG_MAP = new Map(MODE_CONFIG_LIST.map((mode) => [mode.id, mode]));
const subscribers = new Set();

const readStoredMode = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && MODE_CONFIG_MAP.has(stored)) {
      return stored;
    }
  } catch (error) {
    // Ignore storage errors (p. ex. privadesa estricta)
  }
  return FALLBACK_MODE;
};

let currentModeId = readStoredMode();

const persistMode = (modeId) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, modeId);
  } catch (error) {
    // Silenciar si storage no disponible
  }
};

const notifySubscribers = () => {
  const config = MODE_CONFIG_MAP.get(currentModeId);
  subscribers.forEach((callback) => {
    callback(config);
  });
};

export const getModes = () => MODE_CONFIG_LIST.slice();

export const getCurrentMode = () => MODE_CONFIG_MAP.get(currentModeId);

export const setMode = (modeId) => {
  if (!MODE_CONFIG_MAP.has(modeId) || modeId === currentModeId) {
    return;
  }
  currentModeId = modeId;
  persistMode(modeId);
  notifySubscribers();
};

export const subscribeToModeChange = (callback) => {
  if (typeof callback !== 'function') {
    return () => {};
  }
  subscribers.add(callback);
  callback(MODE_CONFIG_MAP.get(currentModeId));
  return () => subscribers.delete(callback);
};
