// Estat global senzill
let currentNumbers = [];
let euclidSequence = [];
let euclidIndex = 0;

const modeSelector = document.getElementById('mode');
const levelSelectorWrap = document.querySelector('.level-selector');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const problemContainer = document.querySelector('.problem-container');
const problemText = document.getElementById('problem-text');
const numbersContainer = document.querySelector('.numbers-container');
const freeModeContainer = document.querySelector('.free-mode-container');
const viewTabs = document.querySelector('.view-tabs');

const euclidStepsEl = document.getElementById('euclid-steps');
const euclidStepBtn = document.getElementById('euclid-step');
const euclidPlayBtn = document.getElementById('euclid-play');
const euclidResetBtn = document.getElementById('euclid-reset');

const calculateBtn = document.getElementById('calculate-btn');
const mcdValue = document.getElementById('mcd-input');
const mcmValue = document.getElementById('mcm-input');
const factorSummary = document.getElementById('factor-summary');

function setHidden(el, hidden) {
  el.classList[hidden ? 'add' : 'remove']('hidden');
}

modeSelector.addEventListener('change', () => {
  numbersContainer.innerHTML = '';
  setHidden(levelSelectorWrap, modeSelector.value !== 'practice');
  setHidden(problemContainer, modeSelector.value !== 'problems');
  setHidden(freeModeContainer, modeSelector.value !== 'free');
});

startBtn.addEventListener('click', () => {
  const mode = modeSelector.value;
  if (mode === 'free') startFreeMode();
  else if (mode === 'practice') startPracticeMode();
  else if (mode === 'problems') startProblemsMode();
});

resetBtn.addEventListener('click', resetAll);

function resetAll() {
  currentNumbers = [];
  euclidSequence = [];
  euclidIndex = 0;
  numbersContainer.innerHTML = '';
  mcdValue.textContent = '—';
  mcmValue.textContent = '—';
  factorSummary.textContent = '';
  problemText.textContent = '';
  setHidden(viewTabs, true);
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  document.getElementById('factor-view').classList.remove('hidden');
}

function startFreeMode() {
  const inputs = document.querySelectorAll('.number-input');
  const nums = [];
  inputs.forEach(input => {
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val > 0) nums.push(val);
  });
  if (nums.length < 2) {
    alert('Introdueix almenys 2 nombres positius.');
    return;
  }
  currentNumbers = nums;
  postNumbersSelected();
}

function startPracticeMode() {
  const level = document.getElementById('level').value;
  fetch(`./data/${level}.json`).then(r => r.json()).then(data => {
    const pick = data[Math.floor(Math.random() * data.length)];
    currentNumbers = pick;
    postNumbersSelected();
  });
}

function startProblemsMode() {
  fetch('./data/problems.json').then(r => r.json()).then(data => {
    const p = data[Math.floor(Math.random() * data.length)];
    problemText.textContent = p.text;
    currentNumbers = p.numbers;
    postNumbersSelected();
  });
}

function postNumbersSelected() {
  generateNumberTables(currentNumbers);
  setHidden(viewTabs, false);
  // reset views to factorization
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', i === 0);
    t.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
  });
  document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('hidden', i !== 0));
  prepareEuclid();
  drawVenn();
}

// Genera taules de descomposició
function generateNumberTables(numbers) {
  numbersContainer.innerHTML = '';
  numbers.forEach(number => {
    const table = document.createElement('table');
    table.classList.add('number-table');
    table.innerHTML = `
      <thead><tr><th colspan="2">${number}</th></tr></thead>
      <tbody>
        <tr>
          <td><input type="number" class="factor-input" placeholder="factor"></td>
          <td>${number}</td>
        </tr>
      </tbody>`;
    numbersContainer.appendChild(table);
  });
}

// Afegeix factor amb Enter
numbersContainer.addEventListener('keydown', (event) => {
  if (event.target.classList.contains('factor-input') && event.key === 'Enter') {
    addFactor(event.target);
  }
});

// Permet recalcular immediatament quan es seleccionen factors
numbersContainer.addEventListener('change', (event) => {
  if (event.target.classList.contains('factor-checkbox')) {
    calculateResults();
  }
});

function addFactor(input) {
  const factor = parseInt(input.value, 10);
  const table = input.closest('.number-table');
  const tbody = table.querySelector('tbody');
  const lastRow = tbody.lastElementChild;
  const currentNumber = parseInt(lastRow.lastElementChild.textContent, 10);

  input.classList.remove('error');
  if (!factor || currentNumber % factor !== 0 || !isPrime(factor)) {
    input.classList.add('error');
    return;
  }

  const newNumber = currentNumber / factor;
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><input type="number" class="factor-input" placeholder="factor"></td>
    <td>${newNumber}</td>`;
  tbody.appendChild(newRow);

  // Converteix la cel·la actual en un checkbox de factor
  input.parentElement.innerHTML = `<label><input type="checkbox" class="factor-checkbox" value="${factor}"> <span class="chip">${factor}</span></label>`;

  if (newNumber !== 1) {
    newRow.querySelector('.factor-input').focus();
  } else {
    // neteja l'última fila d'input si s'ha arribat a 1
    newRow.querySelector('td:first-child').innerHTML = '';
  }
}

calculateBtn.addEventListener('click', calculateResults);

function collectFactorMaps() {
  const tables = document.querySelectorAll('.number-table');
  const factorMaps = [];
  tables.forEach((table) => {
    const numberFactors = {};
    const checkboxes = table.querySelectorAll('.factor-checkbox:checked');
    checkboxes.forEach(checkbox => {
      const f = parseInt(checkbox.value, 10);
      numberFactors[f] = (numberFactors[f] || 0) + 1;
    });
    factorMaps.push(numberFactors);
  });
  return factorMaps;
}

function calculateResults() {
  const maps = collectFactorMaps();
  if (!maps.length) return;
  const allFactors = new Set();
  maps.forEach(m => Object.keys(m).forEach(k => allFactors.add(parseInt(k, 10))));

  // MCD: factors comuns amb exponent mínim
  let mcd = 1;
  allFactors.forEach(f => {
    let minExp = Infinity;
    let common = true;
    for (let i = 0; i < maps.length; i++) {
      const e = maps[i][f] || 0;
      if (e === 0) common = false;
      minExp = Math.min(minExp, e);
    }
    if (common && minExp > 0) mcd *= Math.pow(f, minExp);
  });

  // mcm: factors amb exponent màxim
  let mcm = 1;
  allFactors.forEach(f => {
    let maxExp = 0;
    for (let i = 0; i < maps.length; i++) {
      const e = maps[i][f] || 0;
      maxExp = Math.max(maxExp, e);
    }
    if (maxExp > 0) mcm *= Math.pow(f, maxExp);
  });

  mcdValue.textContent = isFinite(mcd) && mcd > 1 ? String(mcd) : '1';
  mcmValue.textContent = isFinite(mcm) ? String(mcm) : '—';

  // Resum de factors
  const parts = [];
  const sorted = [...allFactors].sort((a,b) => a-b);
  sorted.forEach(f => {
    const exps = maps.map(m => m[f] || 0);
    const maxExp = Math.max(...exps);
    const minExp = Math.min(...exps.filter(e => e>0));
    const mcmPart = maxExp ? `${f}<sup>${maxExp}</sup>` : '';
    const mcdPart = exps.every(e => e>0) && minExp ? `${f}<sup>${minExp}</sup>` : '';
    if (mcmPart) parts.push(`mcm inclou ${mcmPart}`);
    if (mcdPart) parts.push(`MCD inclou ${mcdPart}`);
  });
  factorSummary.innerHTML = parts.length ? parts.join(' · ') : '';

  // refresca vistes
  prepareEuclid();
  drawVenn();
}

// Euclides
function gcd(a, b) {
  while (b !== 0) { const t = b; b = a % b; a = t; }
  return Math.abs(a);
}

function euclidSteps(a, b) {
  const steps = [];
  let x = a, y = b, i = 1;
  while (y !== 0) {
    steps.push({ i, a: x, b: y, q: Math.floor(x/y), r: x % y });
    const t = y; y = x % y; x = t; i++;
  }
  steps.push({ i, a: x, b: 0, q: 0, r: 0, done: true });
  return steps;
}

function prepareEuclid() {
  euclidSequence = [];
  euclidIndex = 0;
  if (!currentNumbers || currentNumbers.length < 2) { euclidStepsEl.innerHTML = ''; return; }
  // Redueix per parelles sense modificar currentNumbers
  let seqAll = [];
  let accum = currentNumbers[0];
  for (let i = 1; i < currentNumbers.length; i++) {
    const a = accum;
    const b = currentNumbers[i];
    const s = euclidSteps(a, b);
    seqAll = seqAll.concat([{ split: true, a, b }], s);
    accum = gcd(a, b);
  }
  euclidSequence = seqAll;
  renderEuclidSteps();
}

function renderEuclidSteps() {
  euclidStepsEl.innerHTML = '';
  let counter = 0;
  euclidSequence.forEach(step => {
    if (step.split) {
      const sep = document.createElement('div');
      sep.className = 'euclid-step';
      sep.innerHTML = `<strong>Parella:</strong> (${step.a}, ${step.b})`;
      euclidStepsEl.appendChild(sep);
      return;
    }
    const el = document.createElement('div');
    el.className = 'euclid-step' + (counter === euclidIndex ? ' active' : '');
    el.innerHTML = step.done
      ? `Pas ${step.i}: b = 0 ⇒ MCD = ${step.a}`
      : `Pas ${step.i}: ${step.a} = ${step.b} · ${step.q} + ${step.r}`;
    euclidStepsEl.appendChild(el);
    counter++;
  });
}

euclidStepBtn?.addEventListener('click', () => {
  euclidIndex = Math.min(euclidIndex + 1, Math.max(0, document.querySelectorAll('.euclid-step').length - 1));
  renderEuclidSteps();
});

euclidPlayBtn?.addEventListener('click', async () => {
  for (let i = euclidIndex; i < Math.max(0, document.querySelectorAll('.euclid-step').length - 1); i++) {
    euclidIndex = i;
    renderEuclidSteps();
    await new Promise(r => setTimeout(r, 600));
  }
});

euclidResetBtn?.addEventListener('click', () => { euclidIndex = 0; renderEuclidSteps(); });

// Venn (2–3 nombres)
function primeFactorization(n) {
  const res = {};
  let d = 2; let x = n;
  while (x > 1) {
    while (x % d === 0) { res[d] = (res[d]||0) + 1; x /= d; }
    d++;
    if (d*d > x && x > 1) { res[x] = (res[x]||0)+1; break; }
  }
  return res;
}

function isPrime(k) {
  if (k < 2) return false;
  if (k % 2 === 0) return k === 2;
  for (let i = 3; i*i <= k; i += 2) {
    if (k % i === 0) return false;
  }
  return true;
}

function drawVenn() {
  const svg = document.getElementById('venn-svg');
  if (!svg) return;
  svg.innerHTML = '';
  if (!currentNumbers || currentNumbers.length < 2 || currentNumbers.length > 3) {
    // Oculta vista si no aplicable
    document.getElementById('venn-view').classList.toggle('hidden', true);
    return;
  }
  document.getElementById('venn-view').classList.remove('hidden');

  const W = 600, H = 300; svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.appendChild(defs);

  const circles = [];
  const colors = ['#60a5fa55', '#f472b655', '#34d39955'];
  const cx = currentNumbers.length === 2 ? [230, 370] : [200, 300, 250];
  const cy = currentNumbers.length === 2 ? [150, 150] : [150, 150, 210];
  const r = currentNumbers.length === 2 ? 120 : 120;

  for (let i = 0; i < currentNumbers.length; i++) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx[i]);
    c.setAttribute('cy', cy[i]);
    c.setAttribute('r', r);
    c.setAttribute('fill', colors[i]);
    c.setAttribute('stroke', '#64748b');
    c.setAttribute('stroke-width', '2');
    svg.appendChild(c);
    circles.push(c);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', cx[i]);
    label.setAttribute('y', cy[i]-r-10);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#334155');
    label.setAttribute('font-weight', '700');
    label.textContent = String(currentNumbers[i]);
    svg.appendChild(label);
  }

  // Factors
  const maps = currentNumbers.map(primeFactorization);
  const all = new Set();
  maps.forEach(m => Object.keys(m).forEach(k => all.add(parseInt(k,10))));

  function placeText(x, y, t) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    s.setAttribute('x', x); s.setAttribute('y', y); s.setAttribute('text-anchor','middle');
    s.setAttribute('fill', '#111827'); s.setAttribute('font-size','14'); s.textContent = t;
    svg.appendChild(s);
  }

  // For 2 sets: left-only, right-only, intersect
  if (currentNumbers.length === 2) {
    const [A, B] = maps;
    const primes = [...all].sort((a,b)=>a-b);
    let ly = 145, ry = 145, my = 145;
    primes.forEach(p => {
      const a = A[p]||0, b = B[p]||0;
      const min = Math.min(a,b); const ra = a-min; const rb = b-min;
      if (min>0) { placeText(300, my, `${p}^${min}`); my += 18; }
      if (ra>0) { placeText(220, ly, `${p}^${ra}`); ly += 18; }
      if (rb>0) { placeText(380, ry, `${p}^${rb}`); ry += 18; }
    });
  } else if (currentNumbers.length === 3) {
    // approximate regions using pairwise mins
    const [A,B,C] = maps;
    const primes = [...all].sort((a,b)=>a-b);
    let centerY = 170;
    primes.forEach(p => {
      const a=A[p]||0,b=B[p]||0,c=C[p]||0;
      const ab=Math.min(a,b), bc=Math.min(b,c), ac=Math.min(a,c);
      const abc=Math.min(ab, Math.min(bc, ac));
      const ra=a-abc, rb=b-abc, rc=c-abc;
      if (abc>0) { placeText(250, 180, `${p}^${abc}`); }
      if (ra>0) { placeText(180, 140, `${p}^${ra}`); }
      if (rb>0) { placeText(320, 140, `${p}^${rb}`); }
      if (rc>0) { placeText(250, 230, `${p}^${rc}`); }
      centerY += 2;
    });
  }
}

// Inicialització bàsica
document.addEventListener('DOMContentLoaded', () => {
  // res
});
