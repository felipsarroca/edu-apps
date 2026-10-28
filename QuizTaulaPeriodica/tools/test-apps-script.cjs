const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '../apps-script/Código.js'), 'utf8');
const context = vm.createContext({ Date, Map, Set, Number, isFinite, isNaN, parseFloat });
vm.runInContext(code, context);

const now = new Date();
const old = new Date(now);
old.setFullYear(old.getFullYear() - 1);
const recent = new Date(now);
recent.setDate(recent.getDate() - 1);
const rows = [
  ['Data', 'Nom', 'Puntuació', 'Nivell', 'Temps'],
  [old, 'Anna', 10, 'Normal', '0:10'],
  [recent, 'Anna', 10, 'Normal', '0:30'],
  [recent, 'Anna', 10, 'Normal', '0:40'],
  [recent, 'Biel', 10, 'Difícil', '0:20'],
];
const sheet = {
  getDataRange: () => ({ getValues: () => rows }),
  deleteRow: (n) => rows.splice(n - 1, 1),
};
context.netejaResultats(sheet);
assert.deepEqual(rows.map((row) => row[1]).slice(1), ['Anna', 'Biel']);
assert.equal(rows[1][4], '0:30');

let attempts = 0;
context.SpreadsheetApp = { openById: () => {
  attempts++;
  if (attempts < 3) throw new Error('temporary');
  return sheet;
} };
context.Utilities = { sleep: () => {} };
assert.equal(context.obreFullAmbReintents(), sheet);
assert.equal(attempts, 3);
console.log('Neteja i reintents: correcte');
