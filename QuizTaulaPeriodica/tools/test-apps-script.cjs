const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const code = fs.readFileSync(path.join(__dirname, '../apps-script/Código.js'), 'utf8');
const context = vm.createContext({ Date, Map, Set, Number, isFinite, isNaN, parseFloat });
vm.runInContext(code, context);
assert.equal(context.secsFromCell(new Date(1899, 11, 30, 0, 26)), 26);
assert.equal(context.textTempsHistoric(new Date(1899, 11, 30, 2, 15)), '2:15');

const props = new Map();
context.PropertiesService = { getScriptProperties: () => ({
  getProperty: (key) => props.get(key),
  setProperty: (key, value) => props.set(key, value),
  deleteProperty: (key) => props.delete(key),
}) };
const historyRows = [['ID', 'Data entrada', 'Data sortida', 'Durada (dies)', 'Nom', 'Puntuació', 'Nivell', 'Temps', 'Motiu sortida', 'Origen']];
const historySheet = {
  setName: () => {},
  setFrozenRows: () => {},
  hideColumns: () => {},
  setColumnWidth: () => {},
  appendRow: (row) => historyRows.push(row),
  getLastRow: () => historyRows.length,
  getDataRange: () => ({ getValues: () => historyRows.map((row) => [...row]) }),
  getRange: (r, c, count) => ({
    setFontWeight() { return this; },
    setBackground() { return this; },
    setNumberFormat() { return this; },
    setValues: (values) => {
      values.forEach((value, index) => {
        historyRows[r - 1 + index] ??= [];
        value.forEach((cell, offset) => { historyRows[r - 1 + index][c - 1 + offset] = cell; });
      });
    },
    setValue: (value) => { historyRows[r - 1][c - 1] = value; },
  }),
};
const historyBook = { getSheets: () => [historySheet], getId: () => 'private-history' };
context.SpreadsheetApp = { create: () => historyBook, openById: () => ({ getSheetByName: () => historySheet }) };

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
  deleteRows: (n, count) => rows.splice(n - 1, count),
};
context.netejaResultats(sheet);
assert.deepEqual(rows.map((row) => row[1]).slice(1), ['Anna', 'Biel']);
assert.equal(rows[1][4], '0:30');
assert.equal(historyRows.length, 5);
assert.equal(historyRows.filter((row) => row[2] instanceof Date).length, 2);
assert.equal(historyRows.filter((row) => row[2] === '').length, 2);

let attempts = 0;
context.SpreadsheetApp = { openById: () => {
  attempts++;
  if (attempts < 3) throw new Error('temporary');
  return sheet;
} };
context.Utilities = { sleep: () => {} };
assert.equal(context.obreFullAmbReintents(), sheet);
assert.equal(attempts, 3);

context.LockService = { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) };
context.console = { warn: () => {} };
let cleanAttempts = 0;
context.SpreadsheetApp = { openById: () => {
  cleanAttempts++;
  throw new Error("We're sorry, a server error occurred. Please wait a bit and try again.");
} };
context.netejaDuplicatsMillorTemps();
assert.ok(cleanAttempts >= 3);
context.SpreadsheetApp = { openById: () => { throw new Error('Permís denegat'); } };
assert.throws(() => context.netejaDuplicatsMillorTemps(), /Permís denegat/);
console.log('Neteja i reintents: correcte');
