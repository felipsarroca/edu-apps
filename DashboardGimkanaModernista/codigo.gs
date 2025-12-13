/**************** CONFIG ****************/
var SHEET_RESPONSES = "Respostes";
var SHEET_SOLUTIONS = "Solucionari";
var SHEET_SCORES = "Puntuacions";
var SHEET_LEADERBOARD = "Classificacio";

var POINTS_BY_RANK = [10, 7, 5, 3]; // després: 1 punt

/**************** MENÚ ****************/
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Dashboard gimcana")
    .addItem("Recalcula tot", "recalculaTot")
    .addToUi();
}

/**************** WEB APP ****************/
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Dashboard gimcana");
}

/**************** MAIN ****************/
function recalculaTot() {
  var ss = SpreadsheetApp.getActive();
  var shR = ss.getSheetByName(SHEET_RESPONSES);
  var shS = ss.getSheetByName(SHEET_SOLUTIONS);

  if (!shR) throw new Error("No trobo la pestanya 'Respostes'");
  if (!shS) throw new Error("No trobo la pestanya 'Solucionari'");

  var resp = shR.getDataRange().getValues();
  var sol  = shS.getDataRange().getValues();
  if (resp.length < 2) throw new Error("'Respostes' no té dades (o només capçaleres).");
  if (sol.length < 2) throw new Error("'Solucionari' no té dades (o només capçaleres).");

  var RH = resp[0];
  var SH = sol[0];

  /***** COLUMNES RESPOSTES: keywords + fallback *****/
  var C_TS   = colKW(RH, [[ "marca", "timestamp", "time" ], [ "temps", "tiempo" ]], "Marca de temps");

  var C_CURS = colKW(RH, [[ "curs", "curso", "nivel", "nivell" ]], "Curs");
  var C_GRUP = colKW(RH, [[ "grup", "grupo", "equip", "equipo" ]], "Grup");

  // Edifici: "Edifici", "Nom de l'edifici", "Nombre del edificio"...
  var C_EDI  = colKW(RH, [[ "edific", "edificio", "building" ], [ "nom", "nombre" ]], "Edifici", true);

  // Any: Any/Año/Year/Data/Fecha… (i potser sense “construcció”)
  var C_ANY  = colKW(RH,
    [[ "any", "año", "ano", "year", "data", "fecha" ], [ "constru", "construc", "edific", "build", "obra" ]],
    "Any de construcció",
    true
  );
  if (C_ANY === -1) C_ANY = findYearColumnByValues(resp, RH);
  if (C_ANY === -1) throw new Error("No he pogut identificar la columna de l'any (ni per capçalera ni per valors).");

  var C_ARQ  = colKW(RH, [[ "arquitect", "arquitecto", "architect" ]], "Arquitecte");
  var C_FO   = colKW(RH, [[ "funcio", "función", "funcion", "uso" ], [ "original", "inicial" ]], "Funció original", true);
  var C_FA   = colKW(RH, [[ "funcio", "función", "funcion", "uso" ], [ "actual", "avui", "hoy" ]], "Funció actual", true);

  /***** COLUMNES SOLUCIONARI *****/
  var S_EDI  = colKW(SH, [[ "edific", "edificio", "building" ]], "Edifici");
  var S_ANY  = colKW(SH, [[ "any", "año", "ano", "year", "data", "fecha" ], [ "constru", "construc" ]], "Any de construcció", true);
  if (S_ANY === -1) S_ANY = findYearColumnByValues(sol, SH);
  if (S_ANY === -1) throw new Error("No he pogut identificar la columna de l'any al Solucionari.");

  var S_ARQ  = colKW(SH, [[ "arquitect", "arquitecto", "architect" ]], "Arquitecte");
  var S_FO   = colKW(SH, [[ "funcio", "función", "funcion", "uso" ], [ "original", "inicial" ]], "Funció original", true);
  var S_FA   = colKW(SH, [[ "funcio", "función", "funcion", "uso" ], [ "actual", "avui", "hoy" ]], "Funció actual", true);

  /***** MAPA DE SOLUCIONS *****/
  var solMap = {};
  for (var i = 1; i < sol.length; i++) {
    var rS = sol[i];
    var k = normText(rS[S_EDI]);
    if (!k) continue;
    solMap[k] = {
      any: normYear(rS[S_ANY]),
      arq: normText(rS[S_ARQ]),
      fo:  normText(rS[S_FO]),
      fa:  normText(rS[S_FA])
    };
  }

  /***** ORDENA RESPOSTES PER TEMPS *****/
  var rows = [];
  for (var j = 1; j < resp.length; j++) {
    var tsVal = resp[j][C_TS];
    var ts = (tsVal instanceof Date) ? tsVal : new Date(tsVal);
    rows.push({ ts: ts, r: resp[j] });
  }
  rows.sort(function(a, b) { return a.ts - b.ts; });

  /***** PUNTUACIÓ + DUPLICATS *****/
  var correctCount = {};   // curs|edifici => #encerts correctes (ordre)
  var firstAttempt = {};   // curs|grup|edifici => ja hi ha hagut un enviament

  var out = [[ "Timestamp","Curs","Grup","Edifici","Correcte","Punts","Error" ]];

  for (var x = 0; x < rows.length; x++) {
    var rr = rows[x].r;

    var curs = normalizeCurs(rr[C_CURS]);
    var grup = String(rr[C_GRUP] || "").trim();
    var ediT = String(rr[C_EDI] || "").trim();
    var ediK = normText(ediT);

    var correcte = false;
    var punts = 0;
    var err = "";

    // Regla: només puntua el primer enviament per (curs+grup+edifici)
    var attKey = curs + "|" + grup + "|" + ediK;
    if (ediK && firstAttempt[attKey]) {
      // (Opcional) indiquem si era correcte o no, però punts sempre 0
      var sRep = solMap[ediK];
      if (sRep) {
        var okAnyR = (normYear(rr[C_ANY]) === sRep.any);
        var okArqR = (normText(rr[C_ARQ]) === sRep.arq);
        var okFOR  = (normText(rr[C_FO])  === sRep.fo);
        var okFAR  = (normText(rr[C_FA])  === sRep.fa);
        correcte = okAnyR && okArqR && okFOR && okFAR;
      }
      punts = 0;
      err = "Repetit (ja comptava)";
      out.push([ rows[x].ts, curs, grup, ediT, correcte, punts, err ]);
      continue;
    }
    if (ediK) firstAttempt[attKey] = true;

    var srow = solMap[ediK];

    if (!ediK) {
      err = "Sense edifici";
    } else if (!srow) {
      err = "Edifici no al solucionari";
    } else {
      var okAny = (normYear(rr[C_ANY]) === srow.any);
      var okArq = (normText(rr[C_ARQ]) === srow.arq);
      var okFO  = (normText(rr[C_FO])  === srow.fo);
      var okFA  = (normText(rr[C_FA])  === srow.fa);

      correcte = okAny && okArq && okFO && okFA;

      if (!correcte) {
        var p = [];
        if (!okAny) p.push("Any");
        if (!okArq) p.push("Arquitecte");
        if (!okFO)  p.push("Funció original");
        if (!okFA)  p.push("Funció actual");
        err = p.join(", ");
      } else {
        var key = curs + "|" + ediK;
        correctCount[key] = (correctCount[key] || 0) + 1;
        var rank = correctCount[key];
        punts = (rank <= POINTS_BY_RANK.length) ? POINTS_BY_RANK[rank - 1] : 1;
      }
    }

    out.push([ rows[x].ts, curs, grup, ediT, correcte, punts, err ]);
  }

  writeSheet(ss, SHEET_SCORES, out);
  writeSheet(ss, SHEET_LEADERBOARD, buildLeaderboard(out));
}

/**************** DASHBOARD DATA (PER INDEX.HTML) ****************/
function getDashboardData_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEET_SCORES);
  if (!sh) return { kpis: { respostes: 0, correctes: 0, punts: 0 }, leader: {} };

  var data = sh.getDataRange().getValues();
  if (data.length < 2) return { kpis: { respostes: 0, correctes: 0, punts: 0 }, leader: {} };

  var H = data[0];
  var C_CURS = H.indexOf("Curs");
  var C_GRUP = H.indexOf("Grup");
  var C_PTS  = H.indexOf("Punts");
  var C_OK   = H.indexOf("Correcte");

  var kpis = { respostes: 0, correctes: 0, punts: 0 };
  var totals = {}; // { "3r": { "2": 17, ... }, "4t": {...} }

  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    var curs = String(r[C_CURS] || "ALTRES");
    var grup = String(r[C_GRUP] || "Sense grup");
    var pts  = Number(r[C_PTS] || 0);
    var ok   = (r[C_OK] === true);

    kpis.respostes++;
    if (ok) kpis.correctes++;
    kpis.punts += pts;

    if (!totals[curs]) totals[curs] = {};
    totals[curs][grup] = (totals[curs][grup] || 0) + pts;
  }

  var leader = {};
  Object.keys(totals).forEach(function(c){
    leader[c] = Object.keys(totals[c]).map(function(g){
      return { grup: g, punts: totals[c][g] };
    }).sort(function(a,b){ return b.punts - a.punts; });
  });

  return { kpis: kpis, leader: leader };
}

/**************** LEADERBOARD ****************/
function buildLeaderboard(data) {
  var H = data[0];
  var C_CURS = H.indexOf("Curs");
  var C_GRUP = H.indexOf("Grup");
  var C_PTS  = H.indexOf("Punts");

  var map = {};
  for (var i = 1; i < data.length; i++) {
    var r = data[i];
    var k = r[C_CURS] + "|" + (r[C_GRUP] || "Sense grup");
    map[k] = (map[k] || 0) + Number(r[C_PTS] || 0);
  }

  var out = [["Curs","Grup","Punts"]];
  Object.keys(map).forEach(function(k){
    var p = k.split("|");
    out.push([p[0], p[1], map[k]]);
  });

  out.splice(1, out.length - 1,
    ...out.slice(1).sort(function(a, b){
      if (a[0] === b[0]) return b[2] - a[2];
      return orderCurs(a[0]) - orderCurs(b[0]);
    })
  );

  return out;
}

/**************** HELPERS ****************/
function writeSheet(ss, name, data) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clear();
  sh.getRange(1, 1, data.length, data[0].length).setValues(data);
}

function orderCurs(c) {
  if (c === "3r") return 1;
  if (c === "4t") return 2;
  return 9;
}

function normalizeCurs(v) {
  v = String(v || "").toLowerCase();
  if (v.indexOf("3") !== -1) return "3r";
  if (v.indexOf("4") !== -1) return "4t";
  return "ALTRES";
}

/** Normalitza text de dades (respostes i solucions) */
function normText(v) {
  var s = String(v === undefined || v === null ? "" : v);
  s = s.trim().toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/\s+/g, " ");
  return s;
}

/** Normalitza ANY: extreu primer any de 4 dígits si n’hi ha (robust) */
function normYear(v) {
  var s = String(v === undefined || v === null ? "" : v);
  var m = s.match(/(1[0-9]{3}|20[0-9]{2}|2100)/);
  return m ? m[1] : normText(s);
}

/** Normalitza capçalera: sense accents, sense apòstrofs, sense puntuació */
function normHeader(v) {
  var s = String(v === undefined || v === null ? "" : v);
  s = s.trim().toLowerCase();
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[’']/g, "");
  s = s.replace(/[^a-z0-9]+/g, " ").trim();
  s = s.replace(/\s+/g, " ");
  return s;
}

/**
 * Troba columna per "conjunts de keywords".
 * keywordSets = [ [k1,k2,k3], [k4,k5] ... ]
 * - Score: suma 1 per cada conjunt on la capçalera conté ALMENYS una keyword d’aquell conjunt.
 * - allowPartial=true: accepta score>=1 (en lloc de score==nConjunts)
 */
function colKW(headers, keywordSets, label, allowPartial) {
  var hNorm = headers.map(normHeader);
  var bestIdx = -1;
  var bestScore = 0;

  for (var i = 0; i < hNorm.length; i++) {
    var score = 0;
    for (var s = 0; s < keywordSets.length; s++) {
      var set = keywordSets[s];
      var hit = false;
      for (var k = 0; k < set.length; k++) {
        var kk = normHeader(set[k]);
        if (kk && hNorm[i].indexOf(kk) !== -1) { hit = true; break; }
      }
      if (hit) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  var need = allowPartial ? 1 : keywordSets.length;
  if (bestIdx !== -1 && bestScore >= need) return bestIdx;

  // No fem throw aquí: deixem que el caller decideixi si fa fallback o peta
  return -1;
}

/** Fallback: detecta columna d’any mirant valors (4 dígits) */
function findYearColumnByValues(table, headers) {
  var maxRows = Math.min(30, table.length - 1);
  if (maxRows <= 0) return -1;

  var cols = headers.length;
  var bestIdx = -1;
  var bestHits = 0;

  for (var c = 0; c < cols; c++) {
    var hits = 0;
    for (var r = 1; r <= maxRows; r++) {
      var v = table[r][c];
      var y = normYear(v);
      if (String(y).match(/^(1[0-9]{3}|20[0-9]{2}|2100)$/)) hits++;
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestIdx = c;
    }
  }

  if (bestIdx !== -1 && bestHits >= 3) return bestIdx;
  return -1;
}
