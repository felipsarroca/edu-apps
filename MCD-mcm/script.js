const $ = (selector, parent = document) => parent.querySelector(selector);

const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));



const createNumberSlot = (value = '') => {

  const slot = document.createElement('label');

  slot.className = 'number-slot';

  const input = document.createElement('input');

  input.type = 'number';

  input.min = '1';

  input.placeholder = '0';

  input.value = value;

  input.className = 'number-input';

  slot.appendChild(input);

  return slot;

};



const problemUI = {

  form: null,

  list: null,

  status: null,

  feedback: null,

  addButton: null,

  beginButton: null,

  goalOptions: [],

  workspace: null,

  resetForm: () => {},

  lockForm: () => {},

  syncGoalClasses: () => {},

};



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

const formatExponent = (prime, power) => (power > 1 ? `${prime}<sup>${power}</sup>` : String(prime));



const formatProduct = (map) => {

  const entries = Object.entries(map)

    .map(([prime, power]) => ({ prime: Number(prime), power }))

    .filter(({ power }) => power > 0)

    .sort((a, b) => a.prime - b.prime);

  if (!entries.length) return '1';

  return entries.map(({ prime, power }) => formatExponent(prime, power)).join(' × ');

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



const factorPlan = (number) => {

  const factors = [];

  let value = Number(number);

  if (!Number.isInteger(value) || value < 2) return factors;

  let divisor = 2;

  while (value > 1) {

    while (value % divisor === 0) {

      factors.push(divisor);

      value /= divisor;

    }

    if (divisor === 2) {

      divisor = 3;

    } else {

      divisor += 2;

    }

    if (divisor * divisor > value && value > 1) {

      factors.push(value);

      break;

    }

  }

  return factors;

};



const assignedSteps = (rowIndex) => Object.values(state.exponents[rowIndex] || {}).reduce((acc, value) => acc + value, 0);



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

  plans: [],

  quotientNodes: [],

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

  state.plans = state.numbers.map(factorPlan);

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

    drop.classList.remove('focused');

    if (scope === 'problem') {

      const shouldShow = drop.dataset.kind === state.goal;

      drop.hidden = !shouldShow;

    } else {

      drop.hidden = false;

    }

  });

  const target = panel.querySelector(`.result-drop[data-kind="${state.goal}"]`);

  if (target) target.classList.add('focused');

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



const attachLaneDrop = (zone, scope, rowIndex, stepIndex) => {

  zone.dataset.idx = String(rowIndex);

  zone.dataset.step = String(stepIndex);

  zone.addEventListener('dragover', (event) => {

    if (zone.dataset.filled === 'true') return;

    event.preventDefault();

    zone.classList.add('over');

  });

  zone.addEventListener('dragleave', () => zone.classList.remove('over'));

  zone.addEventListener('drop', (event) => {

    event.preventDefault();

    zone.classList.remove('over');

    if (zone.dataset.filled === 'true') return;

    const factor = parseFactorData(event);

    if (!factor) return;

    const { prime } = factor;

    const current = state.residues[rowIndex];

    if (!current || current <= 1) {

      toast('Aquest nombre ja està completat.');

      return;

    }

    const expectedStep = assignedSteps(rowIndex);

    if (stepIndex !== expectedStep) {

      toast('Completa els factors en ordre.');

      zone.classList.add('wiggle');

      setTimeout(() => zone.classList.remove('wiggle'), 250);

      return;

    }

    const required = smallestPrimeDivisor(current);

    if (prime !== required) {

      toast('Has d\'arrossegar el factor primer més petit disponible.');

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

    if (cleared) toast('S\'han buidat les seleccions de factors per mantenir la coherència.');

    zone.replaceChildren(makeUsedPrimeChip(prime));

    zone.dataset.filled = 'true';

    zone.classList.add('filled');

    zone.setAttribute('aria-disabled', 'true');

    const nodes = state.quotientNodes[rowIndex] || [];

    const currentNode = nodes[stepIndex];

    const nextNode = nodes[stepIndex + 1];

    if (currentNode) currentNode.classList.add('filled');

    if (nextNode) {

      nextNode.textContent = String(state.residues[rowIndex]);

      nextNode.classList.add('filled');

    }

    renderFactorColumns(scopeName);

    renderResultDrop(scopeName, 'mcd');

    renderResultDrop(scopeName, 'mcm');

  });

};





const renderLanes = (scope) => {

  const container = $(`#lanes-${scope}`);

  if (!container) return;

  container.innerHTML = '';

  state.quotientNodes = state.numbers.map(() => []);

  state.numbers.forEach((number, index) => {

    const lane = document.createElement('div');

    lane.className = 'lane';



    const title = document.createElement('div');

    title.className = 'lane-title';

    title.textContent = String(number);

    lane.appendChild(title);



    const row = document.createElement('div');

    row.className = 'lane-row';



    const columns = document.createElement('div');

    columns.className = 'lane-columns';



    const quotientColumn = document.createElement('div');

    quotientColumn.className = 'lane-quotients';



    const nodes = [];

    const first = document.createElement('div');

    first.className = 'lane-quotient filled';

    first.textContent = String(number);

    quotientColumn.appendChild(first);

    nodes.push(first);



    const divider = document.createElement('div');

    divider.className = 'divider';



    const track = document.createElement('div');

    track.className = 'lane-track';



    const plan = state.plans[index] || [];

    const slots = Math.max(plan.length, 1);

    for (let step = 0; step < slots; step += 1) {

      const nextNode = document.createElement('div');

      nextNode.className = 'lane-quotient';

      quotientColumn.appendChild(nextNode);

      nodes.push(nextNode);



      const dropzone = document.createElement('div');

      dropzone.className = 'dropzone';

      dropzone.textContent = '···';

      dropzone.setAttribute('aria-label', 'Arrossega el factor primer');

      attachLaneDrop(dropzone, scope, index, step);

      track.appendChild(dropzone);

    }



    state.quotientNodes[index] = nodes;

    columns.appendChild(quotientColumn);

    columns.appendChild(divider);

    columns.appendChild(track);

    row.appendChild(columns);

    lane.appendChild(row);

    container.appendChild(lane);

  });

};



function renderFactorColumns(scope) {



  const container = document.getElementById(`factor-columns-${scope}`);



  if (!container) return;







  recomputePrimeSet();



  const allPrimes = state.primes.slice().sort((a, b) => a - b);



  container.style.gridTemplateColumns = `auto repeat(${allPrimes.length || 1}, minmax(4rem, auto))`;



  container.innerHTML = '';







  state.numbers.forEach((number, rowIndex) => {



    const summary = document.createElement('div');



    summary.className = 'factor-summary';



    container.appendChild(summary); 







    const rowExponents = state.exponents[rowIndex];



    const plan = state.plans[rowIndex] || [];



    const assigned = assignedSteps(rowIndex);



    const complete = plan.length > 0 ? assigned >= plan.length : assigned > 0;



    const baseProduct = formatProduct(rowExponents);







    let rhs;



    if (!assigned) {



      rhs = '…';



    } else if (!complete) {



      rhs = baseProduct === '1' ? '…' : `${baseProduct} × …`;



    } else {



      rhs = baseProduct;



    }







    const label = document.createElement('span');



    label.className = 'factor-summary-label';



    label.innerHTML = `${number} = ${rhs}`;



    summary.appendChild(label);







    if (allPrimes.length === 0) {



        const placeholder = document.createElement('div');



        placeholder.className = 'factor-placeholder';



        summary.appendChild(placeholder);



        return;



    }







    allPrimes.forEach((prime) => {



      const count = rowExponents[prime];



      if (count > 0) {



        const chip = document.createElement('button');



        chip.type = 'button';



        chip.className = 'summary-chip';



        chip.innerHTML = formatExponent(prime, count);



        chip.style.backgroundColor = primeColor(prime);



        chip.draggable = true;



        chip.addEventListener('dragstart', (event) => {



          event.dataTransfer?.setData('text/plain', String(prime));



          event.dataTransfer?.setData(



            'application/x-factor',



            createFactorPayload(prime, count)



          );



        });



        summary.appendChild(chip);



      } else {



        const placeholder = document.createElement('div');



        placeholder.className = 'factor-placeholder';



        summary.appendChild(placeholder);



      }



    });



  });



}



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

    placeholder.textContent = 'Arrossega factors aquí';

    strip.appendChild(placeholder);

    expressionNode.textContent = '';

    return;

  }

  list.forEach((item, index) => {

    const chip = document.createElement('span');

    chip.className = 'result-chip';

    chip.innerHTML = formatExponent(item.prime, item.power);

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

    if (index < list.length - 1) {
      const multiplier = document.createElement('span');
      multiplier.className = 'multiplier';
      multiplier.textContent = '×';
      strip.appendChild(multiplier);
    }
  });

    const aggregated = aggregateFactors(list);

    const product = Object.entries(aggregated)

      .reduce((acc, [prime, power]) => acc * Math.pow(prime, power), 1);

  

    const provisionalResultNode = strip.parentElement.querySelector('.provisional-result');

    if (provisionalResultNode) {

      provisionalResultNode.textContent = list.length > 0 ? `= ${product}` : '';

    }

  

    const feedbackIconNode = strip.parentElement.querySelector('.feedback-icon');

    if (feedbackIconNode) {

      feedbackIconNode.textContent = '';

    }

  

    expressionNode.innerHTML = `Factors triats: ${formatProduct(aggregated)}`;

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

    toast('Primer cal completar la descomposició en factors primers.');

    return;

  }

  const ranges = exponentRanges();

  const evaluations = {

    mcd: evaluateResult('mcd', ranges),

    mcm: evaluateResult('mcm', ranges),

  };

  const targets = scope === 'problem' ? [state.goal] : ['mcd', 'mcm'];

  const output = document.getElementById(`result-${scope}`);

  const parts = [];

  let anySelection = false;

    ['mcd', 'mcm'].forEach((type) => {

      const dropCard = modePanel(scope)?.querySelector(`.result-drop[data-kind="${type}"]`);

      const evaluation = evaluations[type];

      const hasSelection = state.results[type].length > 0;

      const feedbackIconNode = dropCard?.querySelector('.feedback-icon');

  

      if (dropCard) {

        dropCard.classList.remove('ok', 'error');

        if (feedbackIconNode) feedbackIconNode.textContent = '';

  

        if (hasSelection) {

          dropCard.classList.add(evaluation.ok ? 'ok' : 'error');

          if (feedbackIconNode) {

            feedbackIconNode.textContent = evaluation.ok ? '✅' : '❌';

          }

        } else if (evaluation.expectedHasContent && targets.includes(type)) {

          dropCard.classList.add('error');

          if (feedbackIconNode) {

            feedbackIconNode.textContent = '❌';

          }

        }

      }

  

      if (targets.includes(type)) {

        const label = type === 'mcd' ? 'MCD' : 'mcm';

        const suffix = scope === 'problem' && targets.length === 1 ? '' : (evaluation.ok ? ' ✅' : ' ❌');

        parts.push(`${label} = ${evaluation.value}${suffix}`);

        if (hasSelection) anySelection = true;

      }

    });

  if (output && !(scope === 'problem' && targets.length === 1)) {

    output.textContent = parts.join('   ');

  }

  if (!anySelection) {

    toast('Arrossega factors a la zona del MCD o del mcm abans de calcular.');

    return;

  }

  const allCorrect = targets.every((type) => evaluations[type].ok);

  toast(allCorrect ? 'Càlcul correcte!' : 'Revisa les seleccions marcades.');

  if (scope === 'problem') {

    const outputNode = document.getElementById('result-problem');

    if (allCorrect && state.currentProblem?.answer) {

      if (outputNode) outputNode.textContent = state.currentProblem.answer;

      if (problemUI.status) problemUI.status.textContent = 'Problema resolt!';

      if (problemUI.feedback) problemUI.feedback.textContent = '';

    } else if (outputNode) {

      outputNode.textContent = parts.join('   ');

    }

  }

};



const renderPrimePalette = (scope) => {

  const container = $(`#prime-palette-${scope}`);

  if (!container) return;

  container.innerHTML = '';

  if (!state.numbers.length) return;

  const maxNumber = Math.max(...state.numbers);

  const primes = (() => {

    const limit = Math.max(53, Math.floor(Math.sqrt(maxNumber)));

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

  state.numbers = [];

  state.goal = 'mcd';

  state.residues = [];

  state.exponents = [];

  state.primes = [];

  state.plans = [];

  state.quotientNodes = [];

  resetResults();

  const textNode = $('#problem-text');

  if (textNode) textNode.textContent = problem.text;

  $('#prime-palette-problem')?.replaceChildren();

  $('#lanes-problem')?.replaceChildren();

  $('#factor-columns-problem')?.replaceChildren();

  $('#mcd-drop-problem')?.replaceChildren();

  $('#mcm-drop-problem')?.replaceChildren();

  $('#mcd-expression-problem')?.replaceChildren();

  $('#mcm-expression-problem')?.replaceChildren();

  const output = $('#result-problem');

  if (output) output.textContent = '';

  const workspace = $('#problem-workspace');

  if (workspace) workspace.hidden = true;

  if (typeof problemUI.resetForm === 'function') problemUI.resetForm();

  syncGoalButtons();

  highlightDrops('problem');

};



const resetProblemFlow = () => {

  if (!state.currentProblem) {

    if (typeof problemUI.resetForm === 'function') problemUI.resetForm();

    return;

  }

  state.numbers = [];

  state.goal = 'mcd';

  state.residues = [];

  state.exponents = [];

  state.primes = [];

  state.plans = [];

  state.quotientNodes = [];

  resetResults();

  $('#prime-palette-problem')?.replaceChildren();

  $('#lanes-problem')?.replaceChildren();

  $('#factor-columns-problem')?.replaceChildren();

  $('#mcd-drop-problem')?.replaceChildren();

  $('#mcm-drop-problem')?.replaceChildren();

  $('#mcd-expression-problem')?.replaceChildren();

  $('#mcm-expression-problem')?.replaceChildren();

  const workspace = $('#problem-workspace');

  if (workspace) workspace.hidden = true;

  const output = $('#result-problem');

  if (output) output.textContent = '';

  if (typeof problemUI.resetForm === 'function') problemUI.resetForm();

  syncGoalButtons();

  highlightDrops('problem');

};




const setupFreeMode = () => {

  const list = $('#free-number-list');

  if (!list) return;

  const addField = (value = '') => {

    list.appendChild(createNumberSlot(value));

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

    const values = Array.from(
      list.querySelectorAll('.number-input'),
      (input) => Number(input.value),
    ).filter((value) => Number.isInteger(value) && value > 0);

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

      console.error(error);

      toast('No s\'ha pogut carregar el conjunt.');

    }

  });

};



const setupProblemsMode = () => {

  const form = $('#problem-form');

  const list = $('#problem-number-list');

  const addButton = $('#problem-add-number');

  const beginButton = $('#problem-begin');

  const status = $('#problem-status');

  const feedback = $('#problem-feedback');

  const workspace = $('#problem-workspace');

  const goalContainer = $('#problem-goal-options');

  const goalOptions = Array.from(goalContainer ? goalContainer.querySelectorAll('.goal-option') : []);

  const goalInputs = () => Array.from(document.querySelectorAll('input[name="problem-goal"]'));

  const syncGoalOptionClasses = () => {

    goalOptions.forEach((option) => {

      const input = option.querySelector('input');

      if (!input) return;

      option.classList.toggle('selected', input.checked);

    });

  };

  goalInputs().forEach((input) => {

    if (input.dataset.bound) return;

    input.dataset.bound = 'true';

    input.addEventListener('change', syncGoalOptionClasses);

  });

  if (status) status.textContent = 'Prem "Nou problema" per començar';

  problemUI.form = form;

  problemUI.list = list;

  problemUI.status = status;

  problemUI.feedback = feedback;

  problemUI.addButton = addButton;

  problemUI.beginButton = beginButton;

  problemUI.goalOptions = goalOptions;

  problemUI.workspace = workspace;

  problemUI.syncGoalClasses = syncGoalOptionClasses;

  problemUI.resetForm = () => {

    if (!form || !list) return;

    form.classList.remove('locked');

    if (!state.currentProblem) {

      if (status) status.textContent = 'Prem "Nou problema" per començar';

    } else if (status) {

      status.textContent = 'Introdueix les respostes';

    }

    if (feedback) feedback.textContent = state.currentProblem ? 'Introdueix els nombres i decideix si cal MCD o mcm.' : '';

    if (workspace) workspace.hidden = true;

    list.innerHTML = '';

    const initialFields = 2;

    for (let i = 0; i < initialFields; i += 1) {

      list.appendChild(createNumberSlot());

    }

    goalInputs().forEach((input) => {

      input.checked = false;

      input.disabled = false;

    });

    syncGoalOptionClasses();

    list.querySelectorAll('input').forEach((input) => {

      input.value = '';

      input.disabled = false;

    });

    if (addButton) addButton.disabled = false;

    if (beginButton) beginButton.disabled = false;

    const output = $('#result-problem');

    if (output) output.textContent = '';

    highlightDrops('problem');

  };

  problemUI.lockForm = () => {

    if (!form || !list) return;

    form.classList.add('locked');

    list.querySelectorAll('input').forEach((input) => { input.disabled = true; });

    goalInputs().forEach((input) => { input.disabled = true; });

    if (addButton) addButton.disabled = true;

    if (beginButton) beginButton.disabled = true;

    syncGoalOptionClasses();

  };

  const gatherNumbers = () => {

    if (!list) return [];

    return Array.from(list.querySelectorAll('.number-input'), (input) => Number(input.value))

      .filter((value) => Number.isInteger(value) && value > 0);

  };

  const ensureGoalChoice = () => {

    const input = goalInputs().find((node) => node.checked);

    return input ? input.value : null;

  };

  addButton?.addEventListener('click', () => {

    if (!list) return;

    const fields = list.querySelectorAll('.number-slot').length;

    if (fields >= 4) {

      toast('Òptim: màxim quatre nombres.');

      return;

    }

    list.appendChild(createNumberSlot());

  });

  const handleProblemBegin = () => {

    if (!state.currentProblem) {

      toast('Primer demana un problema.');

      return;

    }

    const numbers = gatherNumbers();

    if (numbers.length < 2 || numbers.length > 4) {

      if (feedback) feedback.textContent = 'Cal indicar entre dos i quatre nombres positius.';

      toast('Cal indicar entre dos i quatre nombres.');

      return;

    }

    const expected = state.currentProblem.numbers.slice().sort((a, b) => a - b);

    const provided = numbers.slice().sort((a, b) => a - b);

    if (expected.length !== provided.length || expected.some((value, index) => value !== provided[index])) {

      if (feedback) feedback.textContent = 'Revisa els nombres: no coincideixen amb l\'enunciat.';

      toast('Els nombres no coincideixen amb el problema.');

      return;

    }

    const selectedGoal = ensureGoalChoice();

    if (!selectedGoal) {

      if (feedback) feedback.textContent = 'Tria si cal calcular el MCD o el mcm.';

      toast('Cal decidir si vols el MCD o el mcm.');

      return;

    }

    if (selectedGoal !== state.currentProblem.type) {

      if (feedback) feedback.textContent = 'Pensa bé si el problema demana el MCD o el mcm.';

      toast('Revisa si cal MCD o mcm.');

      return;

    }

    state.numbers = numbers;

    state.goal = selectedGoal;

    resetWorkspace();

    syncGoalButtons();

    problemUI.lockForm();

    if (status) status.textContent = 'Resol el problema';

    if (feedback) feedback.textContent = 'Descompon els nombres i arrossega els factors per obtenir el resultat.';

    if (workspace) workspace.hidden = false;

    renderWorkspace('problem');

    highlightDrops('problem');

    renderFactorColumns('problem');

    renderResultDrop('problem', 'mcd');

    renderResultDrop('problem', 'mcm');

    const output = $('#result-problem');

    if (output) output.textContent = '';

    toast('Ara descompon els nombres i calcula.');

  };

  beginButton?.addEventListener('click', handleProblemBegin);

  $('#next-problem')?.addEventListener('click', async () => {

    try {

      await ensureData();

      const problem = pickRandom(state.data.problems);

      setMode('problemes');

      startProblem(problem);

    } catch (error) {

      console.error(error);

      toast('No s\'ha pogut carregar el problema.');

    }

  });

  if (typeof problemUI.resetForm === 'function') problemUI.resetForm();

};




const wireCommon = (scope) => {

  $(`#compute-${scope}`)?.addEventListener('click', () => computeResults(scope));

  $(`#reset-${scope}`)?.addEventListener('click', () => {

    if (scope === 'problem') {

      resetProblemFlow();

      return;

    }

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







































































































