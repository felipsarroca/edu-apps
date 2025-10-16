const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

const scopeFromMode = (mode) => {
  switch (mode) {
    case 'lliure': return 'free';
    case 'practica': return 'practice';
    case 'problemes': return 'problem';
    default: return 'free';
  }
};

const toast = (message) => {
  const node = $('#toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toast._id);
  toast._id = setTimeout(() => node.classList.remove('show'), 2400);
};

const state = {
  mode: 'lliure',
  goal: 'mcd',
  numbers: [],
  residues: [],
  exponents: [],
  primes: [],
  selection: {},
  data: {
    easy: null,
    medium: null,
    hard: null,
    problems: null,
  },
  currentProblem: null,
};

const resetWorkspace = () => {
  state.residues = state.numbers.slice();
  state.exponents = state.numbers.map(() => ({}));
  state.primes = [];
  state.selection = {};
};

const recomputePrimeSet = () => {
  const set = new Set();
  state.exponents.forEach((row) => {
    Object.keys(row).forEach((p) => set.add(Number(p)));
  });
  state.primes = Array.from(set).sort((a, b) => a - b);
  // If some selection exceeds the new range, reset it.
  const ranges = exponentRanges();
  Object.keys(state.selection).forEach((key) => {
    const p = Number(key);
    const range = ranges[p];
    if (!range) {
      delete state.selection[p];
      return;
    }
    const allowed = state.goal === 'mcd' ? range.min : range.max;
    if (state.selection[p] > allowed) delete state.selection[p];
  });
};

const smallestPrimeDivisor = (n) => {
  if (n < 2) return null;
  if (n % 2 === 0) return 2;
  let p = 3;
  while (p * p <= n) {
    if (n % p === 0) return p;
    p += 2;
  }
  return n;
};

const exponentRanges = () => {
  const ranges = {};
  state.primes.forEach((p) => {
    let min = Infinity;
    let max = 0;
    state.exponents.forEach((row) => {
      const value = row[p] ?? 0;
      if (value < min) min = value;
      if (value > max) max = value;
    });
    ranges[p] = { min, max };
  });
  return ranges;
};

const requiredPrimes = () => {
  const ranges = exponentRanges();
  const list = [];
  Object.keys(ranges).forEach((key) => {
    const p = Number(key);
    if (state.goal === 'mcd' && ranges[p].min > 0) list.push(p);
    if (state.goal === 'mcm' && ranges[p].max > 0) list.push(p);
  });
  return list;
};

const selectionComplete = () => {
  const needed = requiredPrimes();
  return needed.every((p) => state.selection[p] != null);
};

const validateSelection = () => {
  if (!selectionComplete()) {
    toast('Falta completar la selecció de factors.');
    return null;
  }
  const ranges = exponentRanges();
  let correct = true;
  let result = 1;
  Object.entries(state.selection).forEach(([primeStr, exponent]) => {
    const prime = Number(primeStr);
    const target = state.goal === 'mcd' ? ranges[prime].min : ranges[prime].max;
    if (exponent !== target) correct = false;
    result *= Math.pow(prime, exponent);
  });
  return { correct, result };
};

const primePalette = () => {
  if (!primePalette.cache) primePalette.cache = new Map();
  return primePalette.cache;
};

const primeColor = (p) => {
  const cache = primePalette();
  if (cache.has(p)) return cache.get(p);
  const hue = (cache.size * 37) % 360;
  const color = `hsl(${hue}deg 80% 65%)`;
  cache.set(p, color);
  return color;
};

const primesUpTo = (limitValue) => {
  const limit = Math.max(2, Math.floor(limitValue));
  const sieve = new Uint8Array(limit + 1);
  const out = [];
  for (let i = 2; i <= limit; i += 1) {
    if (!sieve[i]) {
      out.push(i);
      for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
    }
  }
  return out;
};

const currentScope = () => scopeFromMode(state.mode);

const syncPanels = () => {
  const panels = $$('.panel');
  panels.forEach((panel) => panel.classList.remove('visible'));
  const activePanel = $(`#panel-${state.mode}`);
  if (activePanel) activePanel.classList.add('visible');
};

const syncModeButtons = () => {
  $$('.mode').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === state.mode);
  });
};

const syncGoalButtons = () => {
  $$('.toggle.goal').forEach((button) => {
    button.classList.toggle('selected', button.dataset.goal === state.goal);
  });
};

const setMode = (mode) => {
  state.mode = mode;
  syncModeButtons();
  syncPanels();
};

const setGoal = (goal) => {
  state.goal = goal;
  syncGoalButtons();
  state.selection = {};
  const scope = currentScope();
  renderSelectionPanel(scope);
  const resultNode = $(`#result-${scope}`);
  if (resultNode) resultNode.textContent = '';
};

const makeUsedPrimeChip = (prime) => {
  const chip = document.createElement('span');
  chip.className = 'used-prime';
  chip.textContent = String(prime);
  chip.style.background = primeColor(prime);
  return chip;
};

const renderPrimePalette = (scope) => {
  const container = $(`#prime-palette-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  if (state.numbers.length === 0) return;
  const maxNumber = Math.max(...state.numbers);
  const primes = primesUpTo(maxNumber);
  primes.forEach((prime) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'prime-chip';
    button.textContent = String(prime);
    button.style.background = primeColor(prime);
    button.draggable = true;
    button.addEventListener('dragstart', (event) => {
      event.dataTransfer?.setData('text/plain', String(prime));
    });
    container.appendChild(button);
  });
};

const attachDropzone = (zone, scope, rowIndex) => {
  zone.addEventListener('dragover', (event) => {
    event.preventDefault();
    zone.classList.add('over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove('over');
    const data = event.dataTransfer?.getData('text/plain');
    if (!data) return;
    const prime = Number(data);
    const current = state.residues[rowIndex];
    if (current <= 1) {
      toast('Aquest nombre ja està completat.');
      return;
    }
    const required = smallestPrimeDivisor(current);
    if (prime !== required) {
      toast('Has d’arrossegar el menor factor primer.');
      zone.classList.add('wiggle');
      setTimeout(() => zone.classList.remove('wiggle'), 280);
      return;
    }
    if (current % prime !== 0) {
      toast('Aquest factor no divideix el nombre actual.');
      return;
    }
    state.residues[rowIndex] = current / prime;
    state.exponents[rowIndex][prime] = (state.exponents[rowIndex][prime] ?? 0) + 1;
    recomputePrimeSet();
    zone.replaceChildren(makeUsedPrimeChip(prime));
    const stepsContainer = zone.closest('.steps');
    if (stepsContainer) {
      stepsContainer.appendChild(makeStepRow(scope, rowIndex, state.residues[rowIndex]));
    }
    renderSelectionPanel(scope);
    renderFactorColumns(scope);
  });
};

const makeStepRow = (scope, rowIndex, value) => {
  const row = document.createElement('div');
  row.className = 'step-row';

  const valueNode = document.createElement('div');
  valueNode.className = 'value';
  valueNode.textContent = String(value);

  const divider = document.createElement('div');
  divider.className = 'divider';

  const slot = document.createElement('div');
  slot.className = 'slot';

  if (value > 1) {
    const dropzone = document.createElement('div');
    dropzone.className = 'dropzone';
    dropzone.textContent = 'Arrossega el mínim primer';
    attachDropzone(dropzone, scope, rowIndex);
    slot.appendChild(dropzone);
  } else {
    const done = document.createElement('span');
    done.className = 'chip-mini done-chip';
    done.textContent = '1';
    done.style.background = 'rgba(123, 255, 202, 0.35)';
    slot.appendChild(done);
  }

  row.appendChild(valueNode);
  row.appendChild(divider);
  row.appendChild(slot);
  return row;
};

const renderLanes = (scope) => {
  const container = $(`#lanes-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  state.numbers.forEach((number, index) => {
    const lane = document.createElement('div');
    lane.className = 'lane';
    const title = document.createElement('div');
    title.className = 'lane-title';
    title.textContent = String(number);
    const steps = document.createElement('div');
    steps.className = 'steps';
    steps.appendChild(makeStepRow(scope, index, number));
    lane.appendChild(title);
    lane.appendChild(steps);
    container.appendChild(lane);
  });
};

const renderSelectionPanel = (scope) => {
  const container = $(`#selection-panel-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  const primesNeeded = requiredPrimes();
  if (primesNeeded.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Descompon els nombres per poder escollir els factors finals.';
    container.appendChild(hint);
    return;
  }
  const ranges = exponentRanges();
  primesNeeded.forEach((prime) => {
    const row = document.createElement('div');
    row.className = 'factor-row';
    const label = document.createElement('div');
    label.className = 'name';
    const chip = document.createElement('span');
    chip.className = 'chip-mini';
    chip.textContent = String(prime);
    chip.style.background = primeColor(prime);
    label.appendChild(chip);
    const rangeArea = document.createElement('div');
    rangeArea.className = 'range';
    const input = document.createElement('input');
    const minAllowed = 0;
    const maxAllowed = state.goal === 'mcd' ? ranges[prime].min : ranges[prime].max;
    input.type = 'number';
    input.min = String(minAllowed);
    input.max = String(maxAllowed);
    input.value = state.selection[prime] ?? '';
    input.placeholder = `0..${maxAllowed}`;
    input.addEventListener('input', () => {
      const value = Number(input.value);
      if (Number.isNaN(value)) {
        delete state.selection[prime];
        return;
      }
      if (value < minAllowed || value > maxAllowed) {
        toast('Valor fora de l’interval permès.');
        input.classList.add('wiggle');
        setTimeout(() => input.classList.remove('wiggle'), 280);
        delete state.selection[prime];
        return;
      }
      state.selection[prime] = value;
    });
    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = state.goal === 'mcd'
      ? 'Escull l’exponent mínim dels factors comuns.'
      : 'Escull l’exponent màxim dels factors comuns i no comuns.';
    rangeArea.appendChild(input);
    rangeArea.appendChild(hint);
    row.appendChild(label);
    row.appendChild(rangeArea);
    container.appendChild(row);
  });
};

const renderFactorColumns = (scope) => {
  const container = $(`#factor-columns-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  if (state.primes.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Quan vagis descomponent, veuràs aquí els factors alineats per columnes.';
    container.appendChild(hint);
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'factor-grid';
  const templateColumns = ['minmax(4.5rem, auto)', ...state.primes.map(() => 'minmax(3.2rem, 1fr)')].join(' ');
  grid.style.gridTemplateColumns = templateColumns;

  const blankHeader = document.createElement('div');
  blankHeader.className = 'header';
  blankHeader.textContent = '';
  grid.appendChild(blankHeader);
  state.primes.forEach((prime) => {
    const header = document.createElement('div');
    header.className = 'header';
    header.textContent = String(prime);
    grid.appendChild(header);
  });

  state.numbers.forEach((number, rowIndex) => {
    const numCell = document.createElement('div');
    numCell.className = 'numcell';
    numCell.textContent = String(number);
    grid.appendChild(numCell);
    state.primes.forEach((prime) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const exponent = state.exponents[rowIndex][prime] ?? 0;
      for (let i = 0; i < exponent; i += 1) {
        const chip = document.createElement('span');
        chip.className = 'chip-mini';
        chip.textContent = String(prime);
        chip.style.background = primeColor(prime);
        cell.appendChild(chip);
      }
      grid.appendChild(cell);
    });
  });
  container.appendChild(grid);
};

const renderWorkspace = (scope) => {
  renderPrimePalette(scope);
  renderLanes(scope);
  renderSelectionPanel(scope);
  renderFactorColumns(scope);
  const resultNode = $(`#result-${scope}`);
  if (resultNode) resultNode.textContent = '';
};

const loadJSON = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error carregant ${url}`);
  return response.json();
};

const ensureData = async () => {
  if (!state.data.easy) state.data.easy = await loadJSON('data/easy.json');
  if (!state.data.medium) state.data.medium = await loadJSON('data/medium.json');
  if (!state.data.hard) state.data.hard = await loadJSON('data/hard.json');
  if (!state.data.problems) state.data.problems = await loadJSON('data/problems.json');
};

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

const startFree = (numbers) => {
  state.numbers = numbers.slice();
  resetWorkspace();
  $('#free-workspace').hidden = false;
  renderWorkspace('free');
};

const startPractice = (set) => {
  const numbers = Array.isArray(set) ? set : set.numbers;
  if (!numbers) return;
  state.numbers = numbers.slice();
  resetWorkspace();
  $('#practice-workspace').hidden = false;
  $('#practice-set').textContent = `[ ${state.numbers.join(', ')} ]`;
  renderWorkspace('practice');
};

const startProblem = (problem) => {
  state.currentProblem = problem;
  state.numbers = problem.numbers.slice();
  state.goal = problem.type === 'mcm' ? 'mcm' : 'mcd';
  syncGoalButtons();
  resetWorkspace();
  $('#problem-workspace').hidden = false;
  $('#problem-text').textContent = problem.text;
  $('#problem-numbers').textContent = `[ ${problem.numbers.join(', ')} ]`;
  const toggle = $('#problem-goal-toggle');
  if (toggle) {
    toggle.innerHTML = '';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'toggle goal selected';
    button.dataset.goal = state.goal;
    button.textContent = state.goal.toUpperCase();
    toggle.appendChild(button);
  }
  renderWorkspace('problem');
};

const setupFreeMode = () => {
  const list = $('#free-number-list');
  if (!list) return;
  const addField = (value = '') => {
    const slot = document.createElement('label');
    slot.className = 'number-slot';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.placeholder = '0';
    input.value = value;
    input.className = 'number-input';
    slot.appendChild(input);
    list.appendChild(slot);
  };
  list.innerHTML = '';
  addField();
  addField();
  $('#add-number')?.addEventListener('click', () => {
    if (list.children.length >= 4) {
      toast('Òptim: màxim quatre nombres.');
      return;
    }
    addField();
  });
  $('#start-free')?.addEventListener('click', () => {
    const values = $$('.number-input', list)
      .map((input) => Number(input.value))
      .filter((value) => Number.isInteger(value) && value > 0);
    if (values.length < 2 || values.length > 4) {
      toast('Calen 2, 3 o 4 nombres vàlids.');
      return;
    }
    setMode('lliure');
    startFree(values);
  });
};

const setupPracticeMode = () => {
  $('#next-set')?.addEventListener('click', async () => {
    try {
      await ensureData();
      const difficulty = $('#difficulty')?.value ?? 'easy';
      const set = pickRandom(state.data[difficulty]);
      setMode('practica');
      startPractice(set);
    } catch (error) {
      toast('No s’ha pogut carregar el conjunt.');
      console.error(error);
    }
  });
};

const setupProblemsMode = () => {
  $('#next-problem')?.addEventListener('click', async () => {
    try {
      await ensureData();
      const problem = pickRandom(state.data.problems);
      $('#problem-type').textContent = problem.type.toUpperCase();
      setMode('problemes');
      startProblem(problem);
    } catch (error) {
      toast('No s’ha pogut carregar el problema.');
      console.error(error);
    }
  });
};

const wireCommon = (scope) => {
  $(`#compute-${scope}`)?.addEventListener('click', () => {
    const result = validateSelection();
    if (!result) return;
    const output = $(`#result-${scope}`);
    if (!output) return;
    output.textContent = `${state.goal.toUpperCase()} = ${result.result}`;
    toast(result.correct ? 'Correcte! Bona feina.' : 'Revisa la selecció de factors.');
  });
  $(`#reset-${scope}`)?.addEventListener('click', () => {
    resetWorkspace();
    renderWorkspace(scope);
  });
};

const setupGoalToggles = () => {
  $$('.goal').forEach((button) => {
    if (button.closest('#problem-goal-toggle')) return;
    button.addEventListener('click', () => {
      setGoal(button.dataset.goal);
    });
  });
};

const setupModeNav = () => {
  $$('.mode').forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode);
    });
  });
};

const init = () => {
  setupModeNav();
  setupFreeMode();
  setupPracticeMode();
  setupProblemsMode();
  setupGoalToggles();
  wireCommon('free');
  wireCommon('practice');
  wireCommon('problem');
  syncModeButtons();
  syncPanels();
  syncGoalButtons();
};

document.addEventListener('DOMContentLoaded', init);
