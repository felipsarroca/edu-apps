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
const historyRows = [];
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

const legacyRows = [rows[0], [old, 'Carla', 10, 'Normal', '0:25'], ...rows.slice(1)];
context.SpreadsheetApp.openById = (id) => ({
  getSheetByName: () => id === 'backup' ? { getDataRange: () => ({ getValues: () => legacyRows }) } : id === 'private-history' ? historySheet : sheet,
});
context.LockService = { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) };
context.Logger = { log: () => {} };
props.set('HISTORIC_BACKUP_ID', 'backup');
context.migraHistoricAnterior();
assert.equal(historyRows.length, 6);
assert.equal(historyRows[5][4], 'Carla');
assert.ok(historyRows[5][2] instanceof Date);
assert.equal(props.has('HISTORIC_BACKUP_ID'), false);
console.log('Neteja i reintents: correcte');
