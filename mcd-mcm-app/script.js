// MCD · mcm — Guia Visual (HTML/CSS/JS pur)
// Segueix l'estructura i modes descrits a MCD-mcm/Instruccions.md

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

const toast = (msg) => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._id);
  toast._id = setTimeout(() => t.classList.remove('show'), 2300);
};

const isPrime = (n) => {
  n = Number(n);
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
  return true;
};

function deepClone(obj){ return JSON.parse(JSON.stringify(obj)); }

// State central
const state = {
  mode: 'lliure',
  goal: 'mcd',
  numbers: [],
  residues: [],
  exponents: [], // [{p->e}]
  primes: [],
  selection: {}, // p->e
  data: {
    easy: null, medium: null, hard: null, problems: null
  },
  currentProblem: null,
};

function resetWorkspace() {
  state.residues = state.numbers.slice();
  state.exponents = state.numbers.map(() => ({}));
  state.primes = [];
  state.selection = {};
}

function setMode(m){
  state.mode = m;
  $$('.mode').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  $$('.panel').forEach(p => p.classList.remove('visible'));
  $(`#panel-${m}`).classList.add('visible');
}

function setGoal(g){
  state.goal = g;
  $$('.goal').forEach(b => b.classList.toggle('selected', b.dataset.goal === g));
  renderSelectionPanel();
}

function addPrimeToSet(p){
  if (!state.primes.includes(p)){
    state.primes.push(p);
    state.primes.sort((a,b)=>a-b);
  }
}

function applyPrime(prime){
  const p = Number(prime);
  if (!isPrime(p)) { toast('Introdueix un nombre primer vàlid.'); return; }
  // divisible per almenys un residu
  const anyDiv = state.residues.some(r => r % p === 0);
  if (!anyDiv) { toast('Cap nombre és divisible per aquest factor ara.'); return; }

  addPrimeToSet(p);
  state.residues = state.residues.map((r, idx) => {
    let e = 0;
    while (r % p === 0) { r = r / p; e++; }
    if (e > 0) {
      state.exponents[idx][p] = (state.exponents[idx][p] || 0) + e;
    }
    return r;
  });

  renderNumbersTable();
  renderSelectionPanel();
}

function expRanges(){
  // retorna { p: {min, max} }
  const ranges = {};
  for (const p of state.primes){
    let min = Infinity, max = 0;
    for (const row of state.exponents){
      const e = row[p] || 0;
      if (e < min) min = e;
      if (e > max) max = e;
    }
    ranges[p] = { min, max };
  }
  return ranges;
}

function requiredPrimes(){
  const ranges = expRanges();
  if (state.goal === 'mcd'){
    return Object.entries(ranges)
      .filter(([p, r]) => r.min > 0)
      .map(([p]) => Number(p));
  } else {
    return Object.entries(ranges)
      .filter(([p, r]) => r.max > 0)
      .map(([p]) => Number(p));
  }
}

function selectionComplete(){
  const req = requiredPrimes();
  return req.every(p => state.selection[p] != null);
}

function validateAndCompute(){
  if (!selectionComplete()){
    toast('Falta completar la selecció de factors.');
    return;
  }
  const ranges = expRanges();
  let ok = true;
  let result = 1;
  for (const [sp, sel] of Object.entries(state.selection)){
    const p = Number(sp);
    if (state.goal === 'mcd'){
      if (sel !== ranges[p].min) ok = false;
    } else {
      if (sel !== ranges[p].max) ok = false;
    }
    result *= Math.pow(p, sel);
  }
  return { ok, result };
}

function primeColorClass(p){
  const idx = state.primes.indexOf(Number(p));
  return ['p1','p2','p3','p4'][idx % 4];
}

function renderNumbersTable(){
  const targetId = state.mode === 'lliure' ? 'free' : (state.mode === 'practica' ? 'practice' : 'problem');
  const container = $(`#numbers-table-${targetId}`);
  if (!container) return;

  const primes = state.primes;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.innerHTML = `<th>#</th><th>Residu</th>${primes.map(p=>`<th><span class="chip ${primeColorClass(p)}">${p}</span></th>`).join('')}`;
  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  state.numbers.forEach((n, i) => {
    const tr = document.createElement('tr');
    const exps = state.exponents[i];
    tr.innerHTML = `
      <td><strong>${n}</strong></td>
      <td>${state.residues[i]}</td>
      ${primes.map(p => `<td>${exps[p] || 0}</td>`).join('')}
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  container.innerHTML = '';
  container.appendChild(table);
}

function renderSelectionPanel(){
  const targetId = state.mode === 'lliure' ? 'free' : (state.mode === 'practica' ? 'practice' : 'problem');
  const container = $(`#selection-panel-${targetId}`);
  if (!container) return;
  container.innerHTML = '';

  const ranges = expRanges();
  const req = requiredPrimes();
  if (req.length === 0){
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = 'Descompon els nombres en factors primers per poder triar els factors del resultat.';
    container.appendChild(p);
    return;
  }

  req.forEach(p => {
    const row = document.createElement('div');
    row.className = 'factor-row';
    const label = document.createElement('div');
    label.className = 'name';
    label.innerHTML = `<span class="chip ${primeColorClass(p)}">${p}</span>`;
    const rangeArea = document.createElement('div');
    rangeArea.className = 'range';
    const min = ranges[p].min;
    const max = ranges[p].max;
    const goalRange = state.goal === 'mcd' ? {min: 0, max: min} : {min: 0, max: max};
    const input = document.createElement('input');
    input.type = 'number'; input.min = String(goalRange.min); input.max = String(goalRange.max);
    input.value = state.selection[p] ?? '';
    input.placeholder = `0..${goalRange.max}`;
    input.addEventListener('input', () => {
      const v = Number(input.value);
      if (Number.isNaN(v)) { delete state.selection[p]; return; }
      if (v < goalRange.min || v > goalRange.max){ input.classList.add('wiggle'); setTimeout(()=>input.classList.remove('wiggle'), 250); return; }
      state.selection[p] = v;
    });

    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = state.goal === 'mcd' ? 'Comú (mínim exponent)' : 'Comú i no comú (màxim exponent)';

    rangeArea.appendChild(input);
    rangeArea.appendChild(hint);
    row.appendChild(label);
    row.appendChild(rangeArea);
    container.appendChild(row);
  });
}

function wireCommon(goalScope){
  const scope = goalScope; // 'free' | 'practice' | 'problem'
  $(`#apply-prime-${scope}`).addEventListener('click', () => {
    const inp = $(`#prime-input-${scope}`);
    applyPrime(inp.value);
    inp.value = '';
    inp.focus();
  });
  $$(".goal").forEach(b => b.addEventListener('click', () => setGoal(b.dataset.goal)));
  $(`#compute-${scope}`).addEventListener('click', () => {
    const res = validateAndCompute();
    if (!res) return;
    const out = $(`#result-${scope}`);
    out.textContent = `${state.goal.toUpperCase()} = ${res.result}`;
    toast(res.ok ? 'Correcte! 👏' : 'Revisa la selecció de factors.');
  });
  $(`#reset-${scope}`).addEventListener('click', () => {
    resetWorkspace();
    renderNumbersTable();
    renderSelectionPanel();
    $(`#result-${scope}`).textContent = '';
  });
}

async function loadJSON(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error carregant ' + url);
  return res.json();
}

async function ensureData(){
  if (!state.data.easy) state.data.easy = await loadJSON('data/easy.json');
  if (!state.data.medium) state.data.medium = await loadJSON('data/medium.json');
  if (!state.data.hard) state.data.hard = await loadJSON('data/hard.json');
  if (!state.data.problems) state.data.problems = await loadJSON('data/problems.json');
}

function startFree(numbers){
  state.numbers = numbers;
  resetWorkspace();
  $('#free-workspace').hidden = false;
  renderNumbersTable();
  renderSelectionPanel();
}

function pickRandom(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function startPractice(set){
  state.numbers = set.numbers ? set.numbers : set; // support both formats
  resetWorkspace();
  $('#practice-workspace').hidden = false;
  $('#practice-set').textContent = `[ ${state.numbers.join(', ')} ]`;
  renderNumbersTable();
  renderSelectionPanel();
}

function startProblem(problem){
  state.currentProblem = problem;
  state.numbers = problem.numbers.slice();
  resetWorkspace();
  $('#problem-workspace').hidden = false;
  $('#problem-text').textContent = problem.text;
  $('#problem-numbers').textContent = `[ ${problem.numbers.join(', ')} ]`;
  // Fix goal to the problem type
  state.goal = problem.type === 'mcd' ? 'mcd' : 'mcm';
  const goalToggle = $('#problem-goal-toggle');
  goalToggle.innerHTML = '';
  const b = document.createElement('button');
  b.className = 'toggle goal selected';
  b.dataset.goal = state.goal;
  b.textContent = state.goal.toUpperCase();
  goalToggle.appendChild(b);
  renderNumbersTable();
  renderSelectionPanel();
}

function setupFreeMode(){
  const list = $('#free-number-list');
  const addField = (value='') => {
    const input = document.createElement('input');
    input.type = 'number'; input.min = '1'; input.placeholder = 'nombre';
    input.value = value;
    list.appendChild(input);
  };
  list.innerHTML = '';
  addField(); addField();
  $('#add-number').addEventListener('click', () => {
    if (list.children.length >= 4){ toast('Màxim 4 nombres.'); return; }
    addField();
  });
  $('#start-free').addEventListener('click', () => {
    const vals = $$('#free-number-list input').map(el => Number(el.value)).filter(v => Number.isInteger(v) && v > 0);
    if (vals.length < 2 || vals.length > 4){ toast('Calen 2, 3 o 4 nombres vàlids.'); return; }
    startFree(vals);
  });
}

function setupPracticeMode(){
  $('#next-set').addEventListener('click', async () => {
    try{
      await ensureData();
      const d = $('#difficulty').value;
      const set = pickRandom(state.data[d]);
      startPractice(set);
    }catch(e){ toast('No s’ha pogut carregar el conjunt.'); }
  });
}

function setupProblemsMode(){
  $('#next-problem').addEventListener('click', async () => {
    try{
      await ensureData();
      const p = pickRandom(state.data.problems);
      $('#problem-type').textContent = p.type.toUpperCase();
      startProblem(p);
    }catch(e){ toast('No s’ha pogut carregar el problema.'); }
  });
}

function setupModeNav(){
  $$('.mode').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
}

function init(){
  setupModeNav();
  setupFreeMode();
  setupPracticeMode();
  setupProblemsMode();
  wireCommon('free');
  wireCommon('practice');
  wireCommon('problem');
}

init();

