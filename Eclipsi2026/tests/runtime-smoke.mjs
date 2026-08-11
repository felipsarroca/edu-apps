import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const bank = JSON.parse(fs.readFileSync(path.join(root, 'data/preguntes-infantils.json'), 'utf8'));

class FakeElement {
  constructor() {
    this.innerHTML = '';
    this.textContent = '';
    this.dataset = {};
    this.events = {};
    this.classList = { add() {}, remove() {}, toggle() {} };
    this.disabled = false;
    this.attributes = {};
    this.opened = false;
    this.clicked = false;
  }
  addEventListener(type, listener) { this.events[type] = listener; }
  querySelector() { return new FakeElement(); }
  querySelectorAll() { return []; }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  showModal() { this.opened = true; }
  close() { this.opened = false; }
  focus() {}
  click() { this.clicked = true; }
}

const app = new FakeElement();
const installButton = new FakeElement();
const installDialog = new FakeElement();
const imageDialog = new FakeElement();
const toast = new FakeElement();
const connectionStatus = new FakeElement();
const storage = new Map();
const createdElements = [];
let printCalls = 0;
const document = {
  title: '',
  events: {},
  querySelector(selector) {
    if (selector === '#app') return app;
    if (selector === '#install-button') return installButton;
    if (selector === '#install-dialog') return installDialog;
    if (selector === '#image-dialog') return imageDialog;
    if (selector === '#toast') return toast;
    if (selector === '#connection-status') return connectionStatus;
    return null;
  },
  querySelectorAll() { return []; },
  addEventListener(type, listener) { this.events[type] = listener; },
  createElement() { const element = new FakeElement(); createdElements.push(element); return element; }
};

const context = vm.createContext({
  console,
  confirm: () => true,
  document,
  fetch: async () => ({ ok: true, json: async () => bank }),
  history: { replaceState() {} },
  localStorage: {
    getItem(key) { return storage.get(key) ?? null; },
    setItem(key, value) { storage.set(key, value); }
  },
  location: { hash: '#inici', reload() {} },
  navigator: { onLine: true },
  Blob,
  URL,
  requestAnimationFrame: callback => callback(),
  setInterval: () => 0,
  setTimeout,
  clearTimeout,
  structuredClone,
  window: { addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false }), print() { printCalls += 1; } }
});

vm.runInContext(source, context);
await new Promise(resolve => setImmediate(resolve));
assert.equal(vm.runInContext('fiveYearQuestions.length', context), 90, 'El banc no s’ha carregat completament.');

for (let round = 0; round < 100; round++) {
  vm.runInContext('startKidsRound()', context);
  const ids = vm.runInContext('[...state.kids5.roundIds]', context);
  assert.equal(ids.length, 5, 'Una ronda no conté cinc preguntes.');
  assert.equal(new Set(ids).size, 5, 'Una ronda repeteix preguntes.');
  for (const id of ids) {
    const order = JSON.parse(vm.runInContext(`JSON.stringify(state.kids5.optionOrders[${JSON.stringify(id)}])`, context));
    const expected = JSON.parse(vm.runInContext(`JSON.stringify(kidsQuestionById(${JSON.stringify(id)}).options.map((_, index) => index))`, context));
    assert.deepEqual([...order].sort(), expected, 'L’ordre d’opcions no és una permutació vàlida.');
  }
}

function click(matchSelector, element = {}) {
  app.events.click({
    target: {
      closest(selector) { return selector === matchSelector ? element : null; }
    }
  });
}

function change(matchSelector, element = {}) {
  app.events.change({ target: { ...element, matches(selector) { return selector === matchSelector; } } });
}

click('[data-kids-start]');
for (let index = 0; index < 5; index++) {
  const correct = vm.runInContext(`kidsQuestionById(state.kids5.roundIds[${index}]).correct`, context);
  const optionCount = vm.runInContext(`kidsQuestionById(state.kids5.roundIds[${index}]).options.length`, context);
  const choice = index < 2 ? correct : (correct + 1) % optionCount;
  click('[data-kids-answer]', { dataset: { kidsAnswer: String(choice) } });
  click('[data-kids-next]');
}

assert.equal(vm.runInContext('state.kids5.phase', context), 'summary');
assert.equal(vm.runInContext('state.kidsHistory.roundsPlayed', context), 1, 'No s’ha registrat la ronda completada.');
assert.equal(vm.runInContext('state.kidsHistory.bestScore', context), 40, 'No s’ha registrat el millor resultat.');
assert.deepEqual(JSON.parse(JSON.stringify(vm.runInContext('kidsRoundStats()', context))), {
  total: 5,
  correct: 2,
  errors: 3,
  correctIds: JSON.parse(JSON.stringify(vm.runInContext('state.kids5.roundIds.slice(0, 2)', context))),
  errorIds: JSON.parse(JSON.stringify(vm.runInContext('state.kids5.roundIds.slice(2)', context))),
  correctPercent: 40,
  errorPercent: 60
});

click('[data-kids-review]');
assert.equal(vm.runInContext('state.kids5.phase', context), 'retry');
assert.equal(vm.runInContext('state.kids5.retryIds.length', context), 3);

for (let index = 0; index < 3; index++) {
  const correct = vm.runInContext('kidsQuestionById(state.kids5.retryIds[state.kids5.retryIndex]).correct', context);
  const optionCount = vm.runInContext('kidsQuestionById(state.kids5.retryIds[state.kids5.retryIndex]).options.length', context);
  click('[data-kids-answer]', { dataset: { kidsAnswer: String((correct + 1) % optionCount) } });
  assert.equal(vm.runInContext('state.kids5.currentChoice', context), (correct + 1) % optionCount);
  click('[data-kids-try-again]');
  assert.equal(vm.runInContext('state.kids5.currentChoice', context), null);
  click('[data-kids-answer]', { dataset: { kidsAnswer: String(correct) } });
  click('[data-kids-next]');
}

assert.equal(vm.runInContext('state.kids5.phase', context), 'final');
assert.equal(vm.runInContext('state.kids5.corrected.length', context), 3);

click('[data-young-profile]', { dataset: { youngProfile: 'perfil-2' } });
assert.equal(vm.runInContext('state.activeYoungProfile', context), 'perfil-2');
click('[data-observation]', { dataset: { observation: 'experiences', id: 'mossegada', value: 'not-seen' } });
assert.equal(vm.runInContext("state.young.experiences.mossegada", context), 'not-seen');
click('[data-young-complete]', { dataset: { youngComplete: 'abans', nextStage: 'durant' } });
assert.equal(vm.runInContext('youngStageProgress().percent', context), 25);

change('[data-young-meta]', { dataset: { youngMeta: 'profileName' }, value: 'Laia', trim() { return this.value; } });
assert.equal(vm.runInContext('state.young.profileName', context), 'Laia');
click('[data-adult-checked]');
assert.ok(vm.runInContext('state.adult.lastExternalCheck.length', context) > 10);
click('[data-timeline-toggle]');
assert.equal(vm.runInContext('adultTimelineExpanded', context), true);
click('[data-pending-filter]');
assert.equal(vm.runInContext('checklistPendingOnly', context), true);
click('[data-print-report]');
assert.equal(printCalls, 1);
click('[data-export-young]');
assert.equal(createdElements.at(-1).clicked, true, 'L’exportació JSON no ha activat la descàrrega.');

const zoomTrigger = {
  querySelector() { return { currentSrc: '', src: 'imatge.webp', alt: 'Imatge de prova' }; },
  closest() { return null; }
};
click('[data-lightbox]', zoomTrigger);
assert.equal(imageDialog.opened, true, 'El visor d’imatges no s’ha obert.');

console.log('PROVA FUNCIONAL CORRECTA · 100 rondes úniques · joc, perfils, crònica, exportació i visor verificats');
