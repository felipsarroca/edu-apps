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

const modeFromScope = {
  free: 'lliure',
  practice: 'practica',
  problem: 'problemes',
};

const SUPER = {
  0: '\u2070', 1: '\u00B9', 2: '\u00B2', 3: '\u00B3', 4: '\u2074',
  5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079',
  '-': '\u207B',
};

const toSuperscript = (value) => String(value).split('').map((digit) => SUPER[digit] ?? '').join('');
const formatExponent = (prime, power) => (power > 1 ? `${prime}${toSuperscript(power)}` : String(prime));

const formatProduct = (map) => {
  const entries = Object.entries(map)
    .map(([prime, power]) => ({ prime: Number(prime), power }))
    .filter(({ power }) => power > 0)
    .sort((a, b) => a.prime - b.prime);
  if (!entries.length) return '1';
  return entries.map(({ prime, power }) => formatExponent(prime, power)).join(' \u00B7 ');
};

const aggregateFactors = (list) => {
  const collected = {};
  list.forEach(({ prime, power }) => {
    const p = Number(prime);
    const e = Number(power) || 1;
    collected[p] = (collected[p] || 0) + e;
  });
  return collected;
};

const primeColor = (prime) => {
  if (!primeColor.cache) {
    primeColor.cache = new Map();
    primeColor.palette = [
      '#6ec3ff', '#ffd66e', '#ff9fe6', '#90f2ae',
      '#ffadad', '#a5d8ff', '#ffe066', '#c4f0c2',
      '#ffcabd', '#b5c7ff'
    ];
  }
  if (primeColor.cache.has(prime)) return primeColor.cache.get(prime);
  const palette = primeColor.palette;
  const color = palette[primeColor.cache.size % palette.length];
  primeColor.cache.set(prime, color);
  return color;
};

const parseFactorData = (event) => {
  const raw = event.dataTransfer?.getData('application/x-factor');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.prime) {
        return {
          prime: Number(parsed.prime),
          power: Number(parsed.power) || 1,
        };
      }
    } catch {
      // Ignore malformed payloads
    }
  }
  const text = event.dataTransfer?.getData('text/plain');
  const prime = Number(text);
  if (!Number.isFinite(prime) || prime < 2) return null;
  return { prime, power: 1 };
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
  results: {
    mcd: [],
    mcm: [],
  },
  data: {
    easy: null,
    medium: null,
    hard: null,
    problems: null,
  },
  currentProblem: null,
};

const resetResults = () => {
  state.results.mcd = [];
  state.results.mcm = [];
};

const resetWorkspace = () => {
  state.residues = state.numbers.slice();
  state.exponents = state.numbers.map(() => ({}));
  state.primes = [];
  resetResults();
};

const syncModeButtons = () => {
  $$('.mode').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === state.mode);
  });
};

const syncPanels = () => {
  $$('.panel').forEach((panel) => panel.classList.remove('visible'));
  const active = $(`#panel-${state.mode}`);
  if (active) active.classList.add('visible');
};

const syncGoalButtons = () => {
  $$('.goal').forEach((button) => {
    button.classList.toggle('selected', button.dataset.goal === state.goal);
  });
};

const setMode = (mode) => {
  state.mode = mode;
  syncModeButtons();
  syncPanels();
  highlightDrops(scopeFromMode(mode));
};

const setGoal = (goal) => {
  state.goal = goal;
  syncGoalButtons();
  highlightDrops(scopeFromMode(state.mode));
};

const recomputePrimeSet = () => {
  const set = new Set();
  state.exponents.forEach((row) => {
    Object.keys(row).forEach((prime) => set.add(Number(prime)));
  });
  state.primes = Array.from(set).sort((a, b) => a - b);
};

const exponentRanges = () => {
  const ranges = {};
  state.primes.forEach((prime) => {
    let min = Infinity;
    let max = 0;
    state.exponents.forEach((row) => {
      const e = row[prime] ?? 0;
      if (e < min) min = e;
      if (e > max) max = e;
    });
    ranges[prime] = { min, max };
  });
  return ranges;
};

const smallestPrimeDivisor = (value) => {
  if (value < 2) return null;
  if (value % 2 === 0) return 2;
  let candidate = 3;
  while (candidate * candidate <= value) {
    if (value % candidate === 0) return candidate;
    candidate += 2;
  }
  return value;
};

const modePanel = (scope) => $(`#panel-${modeFromScope[scope]}`);

const highlightDrops = (scope) => {
  const panel = modePanel(scope);
  if (!panel) return;
  panel.querySelectorAll('.result-drop').forEach((drop) => {
    drop.classList.toggle('focused', drop.dataset.kind === state.goal);
  });
};

const createFactorPayload = (prime, power = 1) => JSON.stringify({ prime, power });

const makeUsedPrimeChip = (prime) => {
  const chip = document.createElement('span');
  chip.className = 'used-prime';
  chip.textContent = String(prime);
        chip.style.backgroundColor = primeColor(prime);
        chip.style.color = '#102143';
        chip.draggable = true;
  chip.addEventListener('dragstart', (event) => {
    event.dataTransfer?.setData('text/plain', String(prime));
    event.dataTransfer?.setData('application/x-factor', createFactorPayload(prime, 1));
  });
  return chip;
};

const attachLaneDrop = (zone, scope, rowIndex) => {
  zone.addEventListener('dragover', (event) => {
    event.preventDefault();
    zone.classList.add('over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('over'));
  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove('over');
    const factor = parseFactorData(event);
    if (!factor) return;
    const { prime } = factor;
    const current = state.residues[rowIndex];
    if (!current || current <= 1) {
      toast('Aquest nombre ja est\u00e0 completat.');
      return;
    }
    const required = smallestPrimeDivisor(current);
    if (prime !== required) {
      toast('Has d\'arrossegar el factor primer m\u00e9s petit disponible.');
      zone.classList.add('wiggle');
      setTimeout(() => zone.classList.remove('wiggle'), 250);
      return;
    }
    if (current % prime !== 0) {
      toast('Aquest factor no divideix el nombre actual.');
      return;
    }
    state.residues[rowIndex] = current / prime;
    state.exponents[rowIndex][prime] = (state.exponents[rowIndex][prime] || 0) + 1;
    recomputePrimeSet();
    const scopeName = scope;
    const cleared = clearResultSelections(scopeName);
    if (cleared) toast('S\'han buidat les seleccions de factors per mantenir la coher\u00e8ncia.');
    zone.replaceChildren(makeUsedPrimeChip(prime));
    const steps = zone.closest('.steps');
    if (steps) {
      steps.appendChild(makeStepRow(scopeName, rowIndex, state.residues[rowIndex]));
    }
    renderFactorColumns(scopeName);
    renderBreakdown(scopeName);
    renderResultDrop(scopeName, 'mcd');
    renderResultDrop(scopeName, 'mcm');
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
    dropzone.textContent = 'Arrossega el m\u00ednim primer';
    attachLaneDrop(dropzone, scope, rowIndex);
    slot.appendChild(dropzone);
  } else {
    const done = document.createElement('span');
    done.className = 'chip-mini done-chip';
    done.textContent = '1';
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

const makeFactorChip = (prime, power) => {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'factor-chip';
  chip.textContent = formatExponent(prime, power);
  chip.style.backgroundColor = primeColor(prime);
  chip.style.color = '#102143';
  chip.title = power > 1 ? `${prime} elevat a ${power}` : `Factor ${prime}`;
  chip.draggable = true;
  chip.addEventListener('dragstart', (event) => {
    event.dataTransfer?.setData('text/plain', String(prime));
    event.dataTransfer?.setData('application/x-factor', createFactorPayload(prime, power));
  });
  return chip;
};

const renderBreakdown = (scope) => {
  const container = $(`#breakdown-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  if (!state.numbers.length) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Introdueix o carrega nombres per mostrar-ne la descomposici\u00f3.';
    container.appendChild(hint);
    return;
  }

  state.numbers.forEach((original, index) => {
    const card = document.createElement('article');
    card.className = 'breakdown-card';

    const eq = document.createElement('div');
    eq.className = 'breakdown-eq';

    const numberNode = document.createElement('span');
    numberNode.className = 'breakdown-number';
    numberNode.textContent = String(original);

    const equal = document.createElement('span');
    equal.textContent = '=';

    const factors = document.createElement('span');
    factors.className = 'breakdown-factors';

    const row = state.exponents[index];
    const remainder = state.residues[index];
    let expression = formatProduct(row);
    if (expression === '1') {
      expression = remainder > 1 ? '\u2026' : '1';
    } else if (remainder > 1) {
      expression = `${expression} \u00B7 \u2026`;
    }
    factors.textContent = expression;

    eq.appendChild(numberNode);
    eq.appendChild(equal);
    eq.appendChild(factors);
    card.appendChild(eq);

    if (remainder > 1) {
      const pending = document.createElement('p');
      pending.className = 'hint';
      pending.textContent = `Encara falta descompondre: ${remainder}`;
      card.appendChild(pending);
    }

    const primes = Object.keys(row).map(Number).sort((a, b) => a - b);

    const columns = document.createElement('div');
    columns.className = 'breakdown-columns';
    if (primes.length) {
      primes.forEach((prime) => {
        const column = document.createElement('div');
        column.className = 'factor-column';
        const color = primeColor(prime);
        column.style.backgroundColor = `${color}33`;
        column.style.border = `1px solid ${color}66`;

        const primeSpan = document.createElement('span');
        primeSpan.className = 'prime';
        primeSpan.textContent = formatExponent(prime, row[prime]);

        const powerSpan = document.createElement('span');
        powerSpan.className = 'power';
        powerSpan.textContent = row[prime] > 1 ? `exponent ${row[prime]}` : 'exponent 1';

        column.appendChild(primeSpan);
        column.appendChild(powerSpan);
        columns.appendChild(column);
      });
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'drop-placeholder';
      placeholder.textContent = 'Encara no hi ha factors.';
      columns.appendChild(placeholder);
    }
    card.appendChild(columns);

    const chips = document.createElement('div');
    chips.className = 'breakdown-chips';
    if (primes.length) {
      primes.forEach((prime) => {
        chips.appendChild(makeFactorChip(prime, row[prime]));
      });
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'drop-placeholder';
      placeholder.textContent = 'Pendents de trobar factors.';
      chips.appendChild(placeholder);
    }
    card.appendChild(chips);

    container.appendChild(card);
  });
};

const renderFactorColumns = (scope) => {
  const container = document.getElementById(`factor-columns-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  if (!state.primes.length) {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = 'Quan descomponguis, aqu\u00ed veureu els factors ordenats per columnes.';
    container.appendChild(hint);
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'factor-grid';
  const template = ['minmax(4.5rem, auto)', ...state.primes.map(() => 'minmax(3.2rem, 1fr)')].join(' ');
  grid.style.gridTemplateColumns = template;
  const empty = document.createElement('div');
  empty.className = 'header';
  grid.appendChild(empty);
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
    const row = state.exponents[rowIndex];
    state.primes.forEach((prime) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      const exponent = row[prime] ?? 0;
      for (let i = 0; i < exponent; i += 1) {
        const chip = document.createElement('span');
        chip.className = 'chip-mini';
        chip.textContent = String(prime);
        chip.style.backgroundColor = primeColor(prime);
        chip.style.color = '#102143';
        chip.draggable = true;
        chip.addEventListener('dragstart', (event) => {
          event.dataTransfer?.setData('text/plain', String(prime));
          event.dataTransfer?.setData('application/x-factor', createFactorPayload(prime, 1));
        });
        cell.appendChild(chip);
      }
      grid.appendChild(cell);
    });
  });
  container.appendChild(grid);
};

const clearResultSelections = (scope) => {
  let cleared = false;
  ['mcd', 'mcm'].forEach((type) => {
    if (state.results[type].length) {
      state.results[type] = [];
      renderResultDrop(scope, type);
      cleared = true;
    }
  });
  const output = document.getElementById(`result-${scope}`);
  if (output) output.textContent = '';
  return cleared;
};

const ensureResultDrop = (scope, type) => {
  const strip = document.getElementById(`${type}-drop-${scope}`);
  if (!strip || strip.dataset.wired) return;
  strip.dataset.wired = 'true';
  strip.addEventListener('dragover', (event) => {
    event.preventDefault();
    strip.classList.add('over');
  });
  strip.addEventListener('dragleave', () => strip.classList.remove('over'));
  strip.addEventListener('drop', (event) => {
    event.preventDefault();
    strip.classList.remove('over');
    const factor = parseFactorData(event);
    if (!factor) return;
    state.results[type].push(factor);
    renderResultDrop(scope, type);
  });
};

const ensureClearButton = (scope, type) => {
  const panel = modePanel(scope);
  if (!panel) return;
  const button = panel.querySelector(`.clear-drop[data-target="${type}"]`);
  if (!button || button.dataset.bound) return;
  button.dataset.bound = 'true';
  button.addEventListener('click', () => {
    state.results[type] = [];
    renderResultDrop(scope, type);
    const output = document.getElementById(`result-${scope}`);
    if (output) output.textContent = '';
  });
};

const renderResultDrop = (scope, type) => {
  ensureResultDrop(scope, type);
  ensureClearButton(scope, type);
  const strip = document.getElementById(`${type}-drop-${scope}`);
  const expressionNode = document.getElementById(`${type}-expression-${scope}`);
  const dropCard = modePanel(scope)?.querySelector(`.result-drop[data-kind="${type}"]`);
  if (!strip || !expressionNode) return;
  strip.innerHTML = '';
  if (dropCard) dropCard.classList.remove('ok', 'error');
  const list = state.results[type];
  if (!list.length) {
    const placeholder = document.createElement('span');
    placeholder.className = 'drop-placeholder';
    placeholder.textContent = 'Arrossega factors aqu\u00ed';
    strip.appendChild(placeholder);
    expressionNode.textContent = '';
    return;
  }
  list.forEach((item, index) => {
    const chip = document.createElement('span');
    chip.className = 'result-chip';
    chip.textContent = formatExponent(item.prime, item.power);
    chip.style.backgroundColor = primeColor(item.prime);
    chip.style.color = '#102143';
    chip.dataset.type = type;
    chip.dataset.index = String(index);
    chip.title = 'Clica per retirar aquest factor';
    chip.addEventListener('click', () => {
      state.results[type].splice(index, 1);
      renderResultDrop(scope, type);
    });
    strip.appendChild(chip);
  });
  const aggregated = aggregateFactors(list);
  expressionNode.textContent = `Factors triats: ${formatProduct(aggregated)}`;
};

const evaluateResult = (type, ranges) => {
  const aggregated = aggregateFactors(state.results[type]);
  let ok = true;
  let expectedHasContent = false;
  Object.entries(ranges).forEach(([primeStr, range]) => {
    const prime = Number(primeStr);
    const expected = type === 'mcd' ? range.min : range.max;
    const provided = aggregated[prime] ?? 0;
    if (expected > 0) expectedHasContent = true;
    if (expected !== provided) ok = false;
  });
  Object.keys(aggregated).forEach((primeStr) => {
    const prime = Number(primeStr);
    if (!ranges[prime]) ok = false;
  });
  const value = Object.entries(aggregated)
    .reduce((acc, [primeStr, power]) => acc * Math.pow(Number(primeStr), power), 1);
  return {
    ok: ok && (expectedHasContent ? true : true),
    value: value || 1,
    expression: formatProduct(aggregated),
    expectedHasContent,
  };
};

const computeResults = (scope) => {
  if (!state.primes.length) {
    toast('Primer cal completar la descomposici\u00f3 en factors primers.');
    return;
  }
  const ranges = exponentRanges();
  const evaluations = {
    mcd: evaluateResult('mcd', ranges),
    mcm: evaluateResult('mcm', ranges),
  };
  const output = document.getElementById(`result-${scope}`);
  const parts = [];

  ['mcd', 'mcm'].forEach((type) => {
    const dropCard = modePanel(scope)?.querySelector(`.result-drop[data-kind="${type}"]`);
    const evaluation = evaluations[type];
    const hasSelection = state.results[type].length > 0;
    if (dropCard) {
      dropCard.classList.remove('ok', 'error');
      if (hasSelection) {
        dropCard.classList.add(evaluation.ok ? 'ok' : 'error');
      } else if (evaluation.expectedHasContent) {
        dropCard.classList.add('error');
      }
    }
    const label = type === 'mcd' ? 'MCD' : 'mcm';
    parts.push(`${label} = ${evaluation.value}${evaluation.ok ? ' \u2714' : ' \u2731'}`);
  });

  if (output) output.textContent = parts.join('   ');

  const anySelection = state.results.mcd.length || state.results.mcm.length;
  if (!anySelection) {
    toast('Arrossega factors a la zona del MCD o del mcm abans de calcular.');
    return;
  }

  const allCorrect = evaluations.mcd.ok && evaluations.mcm.ok;
  toast(allCorrect ? 'C\u00e0lcul correcte!' : 'Revisa les seleccions marcades.');
};

const renderPrimePalette = (scope) => {
  const container = $(`#prime-palette-${scope}`);
  if (!container) return;
  container.innerHTML = '';
  if (!state.numbers.length) return;
  const maxNumber = Math.max(...state.numbers);
  const primes = (() => {
    const limit = Math.max(2, Math.floor(maxNumber));
    const sieve = new Uint8Array(limit + 1);
    const out = [];
    for (let i = 2; i <= limit; i += 1) {
      if (!sieve[i]) {
        out.push(i);
        for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
      }
    }
    return out;
  })();
  primes.forEach((prime) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'prime-chip';
    button.textContent = String(prime);
    button.style.backgroundColor = primeColor(prime);
    button.style.color = '#102143';
    button.draggable = true;
    button.addEventListener('dragstart', (event) => {
      event.dataTransfer?.setData('text/plain', String(prime));
      event.dataTransfer?.setData('application/x-factor', createFactorPayload(prime, 1));
    });
    container.appendChild(button);
  });
};

const renderWorkspace = (scope) => {
  renderPrimePalette(scope);
  renderLanes(scope);
  renderFactorColumns(scope);
  renderBreakdown(scope);
  renderResultDrop(scope, 'mcd');
  renderResultDrop(scope, 'mcm');
  highlightDrops(scope);
  const output = document.getElementById(`result-${scope}`);
  if (output) output.textContent = '';
};

const loadJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error carregant ${url}`);
  return res.json();
};

const ensureData = async () => {
  if (!state.data.easy) state.data.easy = await loadJSON('data/easy.json');
  if (!state.data.medium) state.data.medium = await loadJSON('data/medium.json');
  if (!state.data.hard) state.data.hard = await loadJSON('data/hard.json');
  if (!state.data.problems) state.data.problems = await loadJSON('data/problems.json');
};

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

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
  resetWorkspace();
  syncGoalButtons();
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
  setupGoalToggles();
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
      toast('\u00d2ptim: m\u00e0xim quatre nombres.');
      return;
    }
    addField();
  });
  $('#start-free')?.addEventListener('click', () => {
    const values = $('.number-input', list)
      .map((input) => Number(input.value))
      .filter((value) => Number.isInteger(value) && value > 0);
    if (values.length < 2 || values.length > 4) {
      toast('Calen 2, 3 o 4 nombres v\u00e0lids.');
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
      console.error(error);
      toast('No s\'ha pogut carregar el conjunt.');
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
      console.error(error);
      toast('No s\'ha pogut carregar el problema.');
    }
  });
};

const wireCommon = (scope) => {
  $(`#compute-${scope}`)?.addEventListener('click', () => computeResults(scope));
  $(`#reset-${scope}`)?.addEventListener('click', () => {
    resetWorkspace();
    const mode = modeFromScope[scope];
    state.mode = mode;
    syncModeButtons();
    syncPanels();
    syncGoalButtons();
    renderWorkspace(scope);
  });
};

const setupGoalToggles = () => {
  $$('.goal').forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => setGoal(button.dataset.goal));
  });
};

const setupModeNav = () => {
  $$('.mode').forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => setMode(button.dataset.mode));
  });
};

const init = () => {
  setupModeNav();
  setupGoalToggles();
  setupFreeMode();
  setupPracticeMode();
  setupProblemsMode();
  wireCommon('free');
  wireCommon('practice');
  wireCommon('problem');
  syncModeButtons();
  syncPanels();
  syncGoalButtons();
  highlightDrops('free');
};

document.addEventListener('DOMContentLoaded', init);
































