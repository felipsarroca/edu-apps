/******************** CONFIG ********************/
const SS_ID = '1-W01-KZ1v7PVAQc72pHth9h-CkAAcDBJrBqqsfUd8ZU';  // ID del full de càlcul
const SHEET_NAME = 'Resultats';  // Nom de la pestanya on s'escriuen els resultats
const HISTORIC_PROPERTY = 'HISTORIC_SS_ID';
const HISTORIC_HEADERS = ['ID', 'Data entrada', 'Data sortida', 'Durada (dies)', 'Nom', 'Puntuació', 'Nivell', 'Temps', 'Motiu sortida', 'Origen'];

/** Publica únicament les marques vigents; el full pot continuar sent privat. */
function doGet(e) {
  const callback = String(e?.parameter?.callback || '');
  if (!/^[$A-Z_a-z][$\w]*$/.test(callback)) return json({ status: 'error', missatge: 'Callback invàlid.' });
  try {
    const sheet = obreFullAmbReintents().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`No s'ha trobat la pestanya '${SHEET_NAME}'.`);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idx = Object.fromEntries(['Data', 'Nom', 'Puntuació', 'Nivell', 'Temps'].map(k => [k, headers.indexOf(k)]));
    if (Object.values(idx).some(i => i < 0)) throw new Error('Falten columnes al full de resultats.');
    const entries = data.slice(1).filter(row => norm(row[idx.Nom])).map(row => ({
      dataISO: row[idx.Data] instanceof Date ? row[idx.Data].toISOString() : String(row[idx.Data]),
      nom: String(row[idx.Nom]),
      puntuacio: Number(row[idx['Puntuació']]) || 0,
      nivell: String(row[idx.Nivell]),
      temps: textTempsHistoric(row[idx.Temps]),
    }));
    return ContentService.createTextOutput(`${callback}(${JSON.stringify({ entries })});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch (err) {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify({ error: String(err) })});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
}

/******************** REGISTRE DE RESULTATS ********************/
/**
 * Endpoint per registrar resultats:
 *  - nom, nivell, temps (mm:ss o ss)
 *  - rebutja temps pitjors/iguals per la mateixa parella nom+nivell
 *  - si és millor, elimina l’antic i afegeix el nou
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return json({ status: 'error', missatge: 'El servei està ocupat. Torna-ho a provar.' });
  try {
    if (!e || !e.parameter) throw new Error("Petició buida.");
    const dades = e.parameter;

    const ss = obreFullAmbReintents();
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`No s'ha trobat la pestanya '${SHEET_NAME}'.`);
    netejaResultats(sheet);

    // Validació bàsica
    const nomRaw = (dades.nom ?? '').toString();
    const nivellRaw = (dades.nivell ?? '').toString();
    const tempsStr = (dades.temps ?? '').toString();
    if (!nomRaw.trim() || !nivellRaw.trim() || !tempsStr.trim()) {
      throw new Error("Falten dades essencials (nom, nivell o temps).");
    }

    // Normalitza claus i obté nou temps en segons
    const nomKey = norm(nomRaw);
    const nivellKey = norm(nivellRaw);
    const nouTemps = parseTempsFlexible(tempsStr);

    // Llegeix dades existents
    const data = sheet.getDataRange().getValues();
    if (data.length < 1) throw new Error("Full sense capçalera.");
    const header = data[0];

    const idxNom = header.indexOf('Nom');
    const idxNivell = header.indexOf('Nivell');
    const idxTemps = header.indexOf('Temps');

    if (idxNom === -1 || idxNivell === -1 || idxTemps === -1) {
      throw new Error("Les columnes 'Nom', 'Nivell' o 'Temps' no existeixen.");
    }

    // Cerca millor temps existent per a la parella nom+nivell
    let millorFila = null;
    let millorTemps = Infinity;

    for (let i = 1; i < data.length; i++) {
      const fila = data[i];
      const nomCell = norm(fila[idxNom]);
      const nivellCell = norm(fila[idxNivell]);
      if (nomCell === nomKey && nivellCell === nivellKey) {
        const tempsExist = secsFromCell(fila[idxTemps]);
        if (tempsExist < millorTemps) {
          millorTemps = tempsExist;
          millorFila = i + 1; // fila real
        }
      }
    }

    // Si ja hi ha un temps millor o igual → rebutja
    if (isFinite(millorTemps) && millorTemps <= nouTemps) {
      return json({ status: 'ok', missatge: `Ja existeix un resultat millor o igual (${formatMMSS(millorTemps)} ≤ ${formatMMSS(nouTemps)}).` });
    }

    // Si el nou temps és millor, elimina l’antic (si n’hi havia)
    const motius = new Map();
    if (isFinite(millorTemps) && nouTemps < millorTemps && millorFila) {
      motius.set(idResultat(data[millorFila - 1], header), 'Marca millorada');
      sheet.deleteRow(millorFila);
    }

    // Afegeix el nou resultat
    sheet.appendRow([
      new Date(),               // Data/Hora
      nomRaw.trim(),            // Nom
      dades.puntuacio || '',    // Puntuació (si s'envia)
      nivellRaw.trim(),         // Nivell
      formatMMSS(nouTemps),     // Temps en format mm:ss (text)
    ]);
    sincronitzaHistoric(sheet, motius);

    // Neteja immediata opcional (descomenta si vols netejar cada vegada)
    // netejaDuplicatsMillorTemps();

    return json({ status: 'ok', missatge: 'Resultat registrat (nou millor temps).' });

  } catch (err) {
    return json({ status: 'error', missatge: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/******************** NETEJA PERIÒDICA ********************/
/**
 * Deixa només la millor marca per a cada (Nom,Nivell).
 * Programa un trigger Time-driven (cada hora/dia) sobre aquesta funció.
 */
function netejaDuplicatsMillorTemps() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('No s’ha pogut obtenir el bloqueig per netejar els resultats.');
  try {
    const sheet = obreFullAmbReintents().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`No s'ha trobat la pestanya '${SHEET_NAME}'.`);
    netejaResultats(sheet);
  } finally {
    lock.releaseLock();
  }
}

/** Reintenta errors temporals del servei de Fulls de càlcul. */
function obreFullAmbReintents(id = SS_ID) {
  let ultimError;
  for (let intent = 0; intent < 3; intent++) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (err) {
      ultimError = err;
      if (intent < 2) Utilities.sleep(1000 * (intent + 1));
    }
  }
  throw ultimError;
}

/** Conserva només la millor marca vigent per nom i nivell. */
function netejaResultats(sheet) {

  const data = sheet.getDataRange().getValues();
  sincronitzaHistoric(sheet);
  if (data.length <= 1) return;

  const header = data[0];
  const idxNom = header.indexOf('Nom');
  const idxNivell = header.indexOf('Nivell');
  const idxTemps = header.indexOf('Temps');
  const idxData = header.indexOf('Data');

  if (idxNom === -1 || idxNivell === -1 || idxTemps === -1 || idxData === -1) {
    throw new Error("Les columnes 'Data', 'Nom', 'Nivell' o 'Temps' no existeixen.");
  }

  const limit = new Date();
  const dia = limit.getDate();
  limit.setDate(1);
  limit.setMonth(limit.getMonth() - 9);
  const ultimDia = new Date(limit.getFullYear(), limit.getMonth() + 1, 0).getDate();
  limit.setDate(Math.min(dia, ultimDia));

  // Determina la millor fila per a cada clau
  const millorPerClau = new Map();

  for (let i = 1; i < data.length; i++) {
    const fila = data[i];
    const nomKey = norm(fila[idxNom]);
    const nivellKey = norm(fila[idxNivell]);
    if (!nomKey || !nivellKey) continue;

    const dataMarca = fila[idxData] instanceof Date ? fila[idxData] : new Date(fila[idxData]);
    if (!Number.isFinite(dataMarca.getTime()) || dataMarca < limit) continue;

    const temps = secsFromCell(fila[idxTemps]);
    if (!Number.isFinite(temps) || temps <= 0) continue;
    const clau = `${nomKey}||${nivellKey}`;

    const actual = millorPerClau.get(clau);
    if (!actual || temps < actual.temps) {
      millorPerClau.set(clau, { fila: i + 1, temps });
    }
  }

  // Elimina totes les files que no siguin les millors
  const filesConservades = new Set([...millorPerClau.values()].map(x => x.fila));
  const filesAEliminar = [];
  const motius = new Map();

  for (let i = 1; i < data.length; i++) {
    const filaReal = i + 1;
    if (!filesConservades.has(filaReal)) {
      filesAEliminar.push(filaReal);
      const dataMarca = data[i][idxData] instanceof Date ? data[i][idxData] : new Date(data[i][idxData]);
      motius.set(idResultat(data[i], header), Number.isFinite(dataMarca.getTime()) && dataMarca < limit ? 'Caducitat (9 mesos)' : 'Marca duplicada o invàlida');
    }
  }

  filesAEliminar.sort((a, b) => b - a).forEach(f => sheet.deleteRow(f));
  if (filesAEliminar.length) sincronitzaHistoric(sheet, motius);
}

/** Crea una única vegada un full privat, propietat del compte que executa l'script. */
function fullHistoric() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(HISTORIC_PROPERTY);
  if (!id) {
    const ss = SpreadsheetApp.create('Històric privat - Quiz Taula Periòdica');
    const sheet = ss.getSheets()[0];
    sheet.setName('Històric');
    sheet.appendRow(HISTORIC_HEADERS);
    aplicaFormatHistoric(sheet);
    props.setProperty(HISTORIC_PROPERTY, ss.getId());
    return sheet;
  }
  const sheet = obreFullAmbReintents(id).getSheetByName('Històric');
  if (!sheet) throw new Error("No s'ha trobat la pestanya 'Històric'.");
  return sheet;
}

/** Copia l'històric existent a una pestanya del full de puntuacions i en canvia la destinació. */
function mouHistoricAlFullPrincipal() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('No s’ha pogut obtenir el bloqueig.');
  try {
    const props = PropertiesService.getScriptProperties();
    const origenId = props.getProperty(HISTORIC_PROPERTY);
    if (!origenId) throw new Error('No hi ha cap històric per traslladar.');
    const desti = obreFullAmbReintents();
    const existent = desti.getSheetByName('Històric');
    if (existent) {
      if (origenId === SS_ID) return;
      throw new Error("Ja existeix una pestanya 'Històric' al full principal.");
    }
    const origen = obreFullAmbReintents(origenId).getSheetByName('Històric');
    if (!origen) throw new Error("Falta la pestanya 'Històric' al full d'origen.");
    const nova = desti.insertSheet('Històric');
    const valors = origen.getDataRange().getValues();
    for (let i = 1; i < valors.length; i++) valors[i][7] = textTempsHistoric(valors[i][7]);
    nova.getRange('H:H').setNumberFormat('@');
    nova.getRange(1, 1, valors.length, HISTORIC_HEADERS.length).setValues(valors);
    aplicaFormatHistoric(nova);
    props.setProperty(HISTORIC_PROPERTY, SS_ID);
    Logger.log(`Traslladades ${valors.length - 1} marques a la pestanya Històric del full principal.`);
  } finally {
    lock.releaseLock();
  }
}

/** Dona format llegible al full privat. Es pot tornar a executar sense canviar dades. */
function formataHistoric() {
  const sheet = fullHistoric();
  aplicaFormatHistoric(sheet);
  const files = sheet.getDataRange().getValues();
  for (let i = 1; i < files.length; i++) {
    if (files[i][7] instanceof Date) sheet.getRange(i + 1, 8).setValue(textTempsHistoric(files[i][7]));
  }
}

function aplicaFormatHistoric(sheet) {
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HISTORIC_HEADERS.length).setFontWeight('bold').setBackground('#d9ead3');
  sheet.getRange('B:C').setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange('D:D').setNumberFormat('0.00');
  sheet.getRange('H:H').setNumberFormat('@');
  sheet.hideColumns(1);
  sheet.setColumnWidth(2, 155);
  sheet.setColumnWidth(3, 155);
  sheet.setColumnWidth(4, 110);
  sheet.setColumnWidth(5, 210);
  sheet.setColumnWidth(6, 100);
  sheet.setColumnWidth(7, 130);
  sheet.setColumnWidth(8, 100);
  sheet.setColumnWidth(9, 240);
  sheet.setColumnWidth(10, 150);
}

/** Evita que Sheets mostri els temps com dates de 1899. */
function textTempsHistoric(valor) {
  if (valor instanceof Date) return `${valor.getHours()}:${valor.getMinutes().toString().padStart(2, '0')}`;
  return String(valor);
}

/** Identifica una marca sense afegir columnes al full públic. */
function idResultat(fila, header) {
  const valorData = fila[header.indexOf('Data')];
  const data = valorData instanceof Date ? valorData : new Date(valorData);
  if (!Number.isFinite(data.getTime())) throw new Error('Una marca no té una data vàlida.');
  return [data.toISOString(), norm(fila[header.indexOf('Nom')]), norm(fila[header.indexOf('Nivell')]), String(fila[header.indexOf('Temps')])].join('|');
}

/** Obre les marques noves i tanca les que ja no són al full públic. */
function sincronitzaHistoric(sheet, motius = new Map()) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 1) throw new Error('Full de resultats sense capçalera.');
  const header = data[0];
  for (const nom of ['Data', 'Nom', 'Puntuació', 'Nivell', 'Temps']) {
    if (header.indexOf(nom) === -1) throw new Error(`Falta la columna '${nom}'.`);
  }

  const historic = fullHistoric();
  const registres = historic.getDataRange().getValues();
  const posicions = new Map();
  for (let i = 1; i < registres.length; i++) posicions.set(String(registres[i][0]), i + 1);

  const actius = new Set();
  const nous = [];
  for (let i = 1; i < data.length; i++) {
    const fila = data[i];
    if (!norm(fila[header.indexOf('Nom')])) continue;
    const id = idResultat(fila, header);
    actius.add(id);
    if (!posicions.has(id)) {
      nous.push([id, fila[header.indexOf('Data')], '', '', fila[header.indexOf('Nom')], fila[header.indexOf('Puntuació')], fila[header.indexOf('Nivell')], textTempsHistoric(fila[header.indexOf('Temps')]), '', 'Registre original']);
    }
  }
  if (nous.length) historic.getRange(historic.getLastRow() + 1, 1, nous.length, HISTORIC_HEADERS.length).setValues(nous);

  const ara = new Date();
  for (let i = 1; i < registres.length; i++) {
    const fila = registres[i];
    const id = String(fila[0]);
    if (!fila[2] && !actius.has(id)) {
      const entrada = fila[1] instanceof Date ? fila[1] : new Date(fila[1]);
      const dies = Number.isFinite(entrada.getTime()) ? Math.max(0, (ara - entrada) / 86400000) : '';
      historic.getRange(i + 1, 3, 1, 2).setValues([[ara, dies]]);
      historic.getRange(i + 1, 9).setValue(motius.get(id) || 'Sortida del rànquing');
    }
  }
}

/** Recupera una sola vegada les marques eliminades a la neteja del 28/10/2026. */
function migraHistoricAnterior() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) throw new Error('No s’ha pogut obtenir el bloqueig.');
  try {
    const props = PropertiesService.getScriptProperties();
    const idCopia = props.getProperty('HISTORIC_BACKUP_ID');
    if (!idCopia) throw new Error('Falta la propietat HISTORIC_BACKUP_ID.');
    const actual = obreFullAmbReintents().getSheetByName(SHEET_NAME);
    const copia = obreFullAmbReintents(idCopia).getSheetByName(SHEET_NAME);
    if (!actual || !copia) throw new Error('Falta la pestanya de resultats.');
    sincronitzaHistoric(actual);
    const historic = fullHistoric();
    const dades = copia.getDataRange().getValues();
    const header = dades[0];
    const dadesActuals = actual.getDataRange().getValues();
    const idsActius = new Set(dadesActuals.slice(1).map(fila => idResultat(fila, dadesActuals[0])));
    const idsExistents = new Set(historic.getDataRange().getValues().slice(1).map(fila => String(fila[0])));
    const sortida = new Date('2026-10-28T19:26:31Z');
    const nous = [];
    for (let i = 1; i < dades.length; i++) {
      const fila = dades[i];
      const id = idResultat(fila, header);
      if (idsActius.has(id) || idsExistents.has(id)) continue;
      const entrada = fila[header.indexOf('Data')];
      if (!(entrada instanceof Date) || !Number.isFinite(entrada.getTime())) throw new Error('La còpia conté una data invàlida.');
      const dies = Math.max(0, (sortida - entrada) / 86400000);
      nous.push([id, entrada, sortida, dies, fila[header.indexOf('Nom')], fila[header.indexOf('Puntuació')], fila[header.indexOf('Nivell')], textTempsHistoric(fila[header.indexOf('Temps')]), 'Neteja del 28/10/2026 (hora aproximada)', 'Recuperat de còpia']);
    }
    if (nous.length) historic.getRange(historic.getLastRow() + 1, 1, nous.length, HISTORIC_HEADERS.length).setValues(nous);
    props.deleteProperty('HISTORIC_BACKUP_ID');
    Logger.log(`S'han recuperat ${nous.length} marques antigues.`);
  } finally {
    lock.releaseLock();
  }
}

/******************** HELPERS ********************/

/** Resposta JSON */
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Normalitza claus (espais, majúscules, accents no afecten). */
function norm(v) {
  if (v === null || v === undefined) return '';
  return v.toString().trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Converteix cel·la de temps (string, número o Date) a segons. */
function secsFromCell(value) {
  if (value instanceof Date) {
    return value.getHours() * 60 + value.getMinutes() + value.getSeconds() / 60;
  }
  if (typeof value === 'number') {
    if (value > 0 && value < 1) return Math.round(value * 86400);
    return Math.round(value);
  }
  return parseTempsFlexible(value);
}

/** Accepta "mm:ss", "ss", "hh:mm:ss" o fraccions i retorna segons. */
function parseTempsFlexible(str) {
  if (str === null || str === undefined) return 0;
  let s = str.toString().trim().replace(',', '.');

  const parts = s.split(':').map(x => x.trim());
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return (+hh) * 3600 + (+mm) * 60 + parseFloat(ss);
  }
  if (parts.length === 2) {
    const [mm, ss] = parts;
    return (+mm) * 60 + parseFloat(ss);
  }
  const only = parseFloat(s);
  return isNaN(only) ? 0 : only;
}

/** Donat un nombre de segons, retorna "m:ss". */
function formatMMSS(totalSeconds) {
  const t = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
