/* ============================================================
   practica.js — MOTOR DE PRÀCTICA
   L'alumne tria QUÈ treballa (contingut) i QUIN SUPORT vol
   (exemple resolt, passos incomplets o tot sol).
   Corrector: compara CONJUNTS solució (fraccions equivalents,
   qualsevol ordre i valors exactes amb radical).
   Progrés per concepte: explorat → amb ajuda → sense ajuda → justifica.
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, Surd = L.Surd, Poly = L.Poly, F = L.fmt, UI = L.UI;

  /* ---------- utilitats de generació ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const nz = (a, b) => { let v = 0; while (v === 0) v = ri(a, b); return v; };
  const nStr = (v) => v < 0 ? F.MIN + Math.abs(v) : String(v); // enter amb el menys tipogràfic
  const par = (v) => v < 0 ? '(' + nStr(v) + ')' : String(v);
  const lin = (a, b) => F.fmtPoly(Poly.linear(a, b), 'x');
  // «Resto 3 als dos membres» o «Sumo 3…» si el terme és negatiu (mai «Resto −3»)
  const undo = (v, xs) => (v < 0 ? 'Sumo ' : 'Resto ') + (Math.abs(v) === 1 && xs ? '' : Math.abs(v)) + (xs ? 'x' : '');
  function toSurd(v) { return (v instanceof Surd) ? v : Surd.fromRational(v); }
  function sameVal(a, b) { return toSurd(a).eq(toSurd(b)); }
  function distinct(vals) { return vals.filter((v, i) => vals.findIndex(w => sameVal(v, w)) === i); }
  /* conjunts: mateixos valors, sense importar l'ordre ni les repeticions */
  function matchSet(got, expected) {
    const g = distinct(got), e = distinct(expected);
    const hits = e.filter(x => g.some(y => sameVal(x, y))).length;
    return { hits, total: e.length, all: hits === e.length && g.length === e.length };
  }
  const valsHTML = (vals) => vals.length ? vals.map(v => 'x = ' + F.fmtValPlain(v).replace(' (aprox.)', '')).join(', ') : 'cap solució real';

  /* ---------- registre local (mai competitiu) ---------- */
  const STATS_KEY = 'labeq:practica-stats';
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch (e) { } }
  function statOf(stats, ex) {
    const s = stats[ex.concept] || (stats[ex.concept] = { hist: [], just: 0 });
    s.topic = ex.topic;
    if (!s.hist) s.hist = [];
    return s;
  }
  // outcome: 'clean' (sense cap ajuda) · 'help' (amb exemple, passos o pistes) · 'miss' (no resolt)
  function record(stats, ex, outcome) {
    const s = statOf(stats, ex);
    s.hist.push(outcome);
    s.hist = s.hist.slice(-10);
    saveStats(stats);
  }

  /* ---------- preguntes de justificació (una per contingut) ---------- */
  const JUSTIFY = {
    concepte: { q: 'Com comproves si un nombre és solució d\'una equació?', ok: 'Substitueixo el nombre i miro si els dos membres valen igual', no: ['Miro si el nombre és positiu', 'Miro si el nombre surt escrit a l\'equació'] },
    primer: { q: 'Per què pots fer la mateixa operació als dos membres?', ok: 'Perquè la igualtat es manté i la solució no canvia', no: ['Perquè així la x es fa més petita', 'Perquè sempre s\'ha de restar primer'] },
    ineq: { q: 'Quan s\'ha de girar el signe d\'una inequació?', ok: 'Només quan multiplico o divideixo per un nombre negatiu', no: ['Sempre que hi ha un nombre negatiu', 'Quan sumo o resto un nombre negatiu'] },
    segon: { q: 'Com pots saber quantes arrels té abans de calcular-les?', ok: 'Pel signe del discriminant Δ = b² − 4ac', no: ['Pel signe del coeficient a', 'Pel valor del terme independent c'] },
    sistemes: { q: 'Per què la solució d\'un sistema ha de complir les dues equacions?', ok: 'Perquè és el punt comú de les dues rectes', no: ['Perquè n\'hi ha prou que en compleixi una', 'Perquè x i y sempre valen el mateix'] },
    biquad: { q: 'Per què de t = 4 surten dues arrels en x?', ok: 'Perquè x² = 4 té dues solucions: x = 2 i x = −2', no: ['Perquè qualsevol t dona dues arrels, encara que sigui negatiu', 'Perquè 4 és un nombre parell'] }
  };

  /* ============================================================
     GENERADORS — matemàtica exacta. Cada un retorna un exercici:
     { topic, concept, questionHTML, answerKind, expected, hints, steps, explain, varName? }
     ============================================================ */

  /* ----- Què és una solució ----- */
  function genIsSolution() {
    const a = ri(2, 5);
    let c = ri(1, 4);
    while (c === a) c = ri(1, 4);
    const root = nz(-6, 6), b = ri(-9, 9);
    const d = (a - c) * root + b;
    const isSol = Math.random() < 0.5;
    const asked = isSol ? root : root + nz(-3, 3);
    const lv = a * asked + b, rv = c * asked + d;
    return {
      topic: 'concepte', concept: 'solució per substitució',
      questionHTML: 'És <span class="math">x = ' + nStr(asked) + '</span> solució de <span class="math">' + lin(a, b) + ' = ' + lin(c, d) + '</span>?',
      answerKind: 'choice',
      options: [{ label: 'Sí, és solució', correct: isSol }, { label: 'No, no ho és', correct: !isSol }],
      hints: ['Substitueix x = ' + nStr(asked) + ' i calcula els <b>dos membres</b> per separat.', 'És solució només si els dos membres donen exactament el mateix nombre.'],
      steps: [
        { label: 'Membre esquerre', math: a + '·' + par(asked) + (b < 0 ? ' − ' + Math.abs(b) : ' + ' + b) + ' = ' + nStr(lv), why: '' },
        { label: 'Membre dret', math: c + '·' + par(asked) + (d < 0 ? ' − ' + Math.abs(d) : ' + ' + d) + ' = ' + nStr(rv), why: '' }
      ],
      explain: nStr(lv) + (isSol ? ' = ' : ' ≠ ') + nStr(rv) + ': ' + (isSol ? 'sí que és solució.' : 'no és solució.')
    };
  }
  function genCount() {
    const kind = pick(['unique', 'all', 'none']);
    const a = nz(2, 5), b = ri(-9, 9);
    let c, d;
    if (kind === 'unique') { c = ri(1, 4); while (c === a) c = ri(1, 4); d = b + nz(-6, 6); }
    else if (kind === 'all') { c = a; d = b; }
    else { c = a; d = b + nz(1, 6) * (Math.random() < 0.5 ? 1 : -1); }
    const names = { unique: 'Una', all: 'Infinites', none: 'Cap' };
    return {
      topic: 'concepte', concept: 'tipus de conjunt solució',
      questionHTML: 'Quantes solucions té <span class="math">' + lin(a, b) + ' = ' + lin(c, d) + '</span>?',
      answerKind: 'choice',
      options: ['unique', 'all', 'none'].map(k => ({ label: names[k], correct: k === kind })),
      hints: ['Resta ' + lin(c, d) + ' als dos membres i mira què queda.', 'Si queda «x = nombre», una. Si queda «0 = 0», infinites. Si queda «0 = un nombre diferent de 0», cap.'],
      steps: [{ label: 'Resta el membre dret', math: lin(a - c, b - d) + ' = 0', why: '' }],
      explain: kind === 'unique' ? 'Queda ' + lin(a - c, b - d) + ' = 0: una única solució.'
        : kind === 'all' ? 'Queda 0 = 0, cert sempre: és una identitat, infinites solucions.'
          : 'Queda ' + nStr(b - d) + ' = 0, fals sempre: cap solució.'
    };
  }

  /* ----- Primer grau ----- */
  function genLinear(form) {
    form = form || pick(['basic', 'both', 'both', 'paren', 'frac']);
    const x0 = Math.random() < 0.75 ? R.num(ri(-8, 8)) : R.make(BigInt(nz(-9, 9)), BigInt(pick([2, 3])));
    let qHTML, steps, hints;
    if (form === 'basic' || form === 'both') {
      const a = nz(-6, 7);
      const c = form === 'both' ? (() => { let v = nz(-4, 5); while (v === a) v = nz(-4, 5); return v; })() : 0;
      const b = ri(-12, 12);
      const d = R.num(a - c).mul(x0).add(b); // constant del membre dret (pot ser fracció)
      const right = c ? F.fmtPoly(new Poly([d, R.num(c)]), 'x') : F.fmtR(d);
      qHTML = lin(a, b) + ' = ' + right;
      steps = [];
      if (c) steps.push({ label: 'Agrupa les x', math: lin(a - c, b) + ' = ' + F.fmtR(d), why: undo(c, true) + ' als dos membres.' });
      steps.push({ label: 'Aïlla el terme amb x', math: lin(a - c, 0) + ' = ' + F.fmtR(d.sub(b)), why: undo(b) + ' als dos membres.' });
      steps.push({ label: 'Divideix pel coeficient', math: 'x = ' + F.fmtR(d.sub(b)) + ' ÷ ' + par(a - c) + ' = ' + F.fmtR(x0), why: 'Divideixo els dos membres entre ' + nStr(a - c) + '.' });
      hints = [c ? 'Primer passa totes les x a un membre: ' + undo(c, true).toLowerCase() + ' als dos membres.' : 'Primer treu el ' + nStr(b) + ': ' + undo(b).toLowerCase() + ' als dos membres.',
        'Després divideix pel coeficient de la x. El resultat pot ser una fracció.'];
    } else if (form === 'paren') {
      const k = nz(2, 5) * (Math.random() < .25 ? -1 : 1), m = nz(-6, 6);
      const xi = R.num(ri(-6, 6));
      const cR = xi.add(m).mul(k);
      qHTML = k + '(x ' + (m < 0 ? '− ' + Math.abs(m) : '+ ' + m) + ') = ' + F.fmtR(cR);
      steps = [
        { label: 'Desenvolupa el parèntesi', math: lin(k, k * m) + ' = ' + F.fmtR(cR), why: 'El ' + nStr(k) + ' multiplica la x i també el ' + nStr(m) + '.' },
        { label: 'Aïlla el terme amb x', math: lin(k, 0) + ' = ' + F.fmtR(cR.sub(k * m)), why: undo(k * m) + ' als dos membres.' },
        { label: 'Divideix', math: 'x = ' + F.fmtR(xi), why: 'Divideixo els dos membres entre ' + nStr(k) + '.' }
      ];
      hints = ['Desenvolupa el parèntesi: el ' + nStr(k) + ' multiplica <b>cada</b> terme.', 'Després aïlla la x com sempre.'];
      return { topic: 'primer', concept: 'resoldre primer grau', questionHTML: 'Resol: <span class="math">' + qHTML + '</span>', answerKind: 'value', expected: xi, hints, steps, explain: 'x = ' + F.fmtValPlain(xi) };
    } else { // frac: x/k + b = c amb solució entera
      const k = pick([2, 3, 4, 5]), q = ri(-5, 6), b = ri(-6, 6);
      const xi = R.num(k * q), c = q + b;
      qHTML = F.fracHTML('x', k) + (b < 0 ? ' − ' + Math.abs(b) : ' + ' + b) + ' = ' + nStr(c);
      steps = [
        { label: 'Aïlla la fracció', math: F.fracHTML('x', k) + ' = ' + nStr(q), why: undo(b) + ' als dos membres.' },
        { label: 'Multiplica pel denominador', math: 'x = ' + nStr(q) + '·' + k + ' = ' + F.fmtR(xi), why: 'Multiplico els dos membres per ' + k + '.' }
      ];
      hints = ['Primer deixa sola la fracció: ' + undo(b).toLowerCase() + ' als dos membres.', 'Després multiplica els dos membres per ' + k + '.'];
      return { topic: 'primer', concept: 'resoldre primer grau', questionHTML: 'Resol: <span class="math">' + qHTML + '</span>', answerKind: 'value', expected: xi, hints, steps, explain: 'x = ' + F.fmtValPlain(xi) };
    }
    return { topic: 'primer', concept: 'resoldre primer grau', questionHTML: 'Resol: <span class="math">' + qHTML + '</span>', answerKind: 'value', expected: x0, hints, steps, explain: 'x = ' + F.fmtValPlain(x0) };
  }
  function genParam() {
    const x0 = nz(-5, 6), a = nz(-4, 5), k = nz(-9, 9);
    const c = a * x0 + k;
    return {
      topic: 'primer', concept: 'paràmetres', varName: 'k',
      questionHTML: 'Quin valor ha de tenir <span class="math">k</span> perquè <span class="math">' + lin(a, 0) + ' + k = ' + nStr(c) + '</span> tingui la solució <span class="math">x = ' + nStr(x0) + '</span>?',
      answerKind: 'value', expected: R.num(k),
      hints: ['Si x = ' + nStr(x0) + ' és solució, l\'ha de complir: substitueix-la.', 'Queda una equació en k: aïlla la k.'],
      steps: [
        { label: 'Substitueix la solució', math: a + '·' + par(x0) + ' + k = ' + nStr(c), why: '' },
        { label: 'Aïlla k', math: 'k = ' + nStr(c) + ' − ' + par(a * x0) + ' = ' + nStr(k), why: '' }
      ],
      explain: 'k = ' + nStr(k)
    };
  }

  /* ----- Inequacions ----- */
  function genSignFlip() {
    const kind = pick(['neg', 'pos', 'add']);
    let q, correct, why;
    if (kind === 'neg') {
      const k = nz(-5, -2);
      q = 'Si <b>multipliques</b> els dos membres d\'una desigualtat per <span class="math">' + nStr(k) + '</span>, què passa amb el sentit?';
      correct = 'flip'; why = 'Multiplicar per un negatiu <b>inverteix</b> el sentit: &lt; passa a &gt;.';
    } else if (kind === 'pos') {
      q = 'Si <b>divideixes</b> els dos membres d\'una desigualtat per <span class="math">' + pick([2, 3, 5]) + '</span>, què passa amb el sentit?';
      correct = 'keep'; why = 'Dividir per un positiu conserva el sentit.';
    } else {
      q = 'Si <b>sumes</b> <span class="math">' + nStr(nz(-8, -2)) + '</span> als dos membres d\'una desigualtat, què passa amb el sentit?';
      correct = 'keep'; why = 'Sumar o restar <b>mai</b> no canvia el sentit, encara que el nombre sigui negatiu.';
    }
    return {
      topic: 'ineq', concept: 'sentit de les desigualtats',
      questionHTML: q, answerKind: 'choice',
      options: [
        { label: 'S\'inverteix (&lt; ↔ &gt;)', correct: correct === 'flip' },
        { label: 'Es manté igual', correct: correct === 'keep' },
        { label: 'Depèn del valor de la incògnita', correct: false }
      ],
      hints: ['Pensa en un exemple amb nombres: 2 &lt; 5.', 'Fes la mateixa operació a 2 i a 5 i compara els resultats.'],
      explain: why
    };
  }
  function genIneq() {
    const both = Math.random() < 0.35;
    const a = nz(-6, 6);
    const c = both ? (() => { let v = nz(-4, 4); while (v === a) v = nz(-4, 4); return v; })() : 0;
    const k = a - c; // coeficient final de la x
    const bound = Math.random() < 0.7 ? R.num(ri(-8, 8)) : R.make(BigInt(nz(-9, 9)), 2n);
    const b = ri(-9, 9);
    const d = R.num(k).mul(bound).add(b);
    const sign = pick(['>', '<', '>=', '<=']);
    const finalSign = k < 0 ? L.SIGN_FLIP[sign] : sign;
    const S = (s) => L.SIGN_NAME[s];
    const right = c ? F.fmtPoly(new Poly([d, R.num(c)]), 'x') : F.fmtR(d);
    const steps = [];
    if (c) steps.push({ label: 'Agrupa les x', math: lin(k, b) + ' ' + S(sign) + ' ' + F.fmtR(d), why: undo(c, true) + ' als dos membres: el sentit no canvia.' });
    steps.push({ label: 'Aïlla el terme amb x', math: lin(k, 0) + ' ' + S(sign) + ' ' + F.fmtR(d.sub(b)), why: undo(b) + ' als dos membres: el sentit no canvia.' });
    steps.push({
      label: k < 0 ? 'Divideix i gira el signe' : 'Divideix', math: 'x ' + S(finalSign) + ' ' + F.fmtR(bound),
      why: k < 0 ? 'Divideixo per ' + nStr(k) + ', que és <b>negatiu</b>: el sentit s\'inverteix.' : 'Divideixo per ' + k + ', que és positiu: el sentit es manté.'
    });
    return {
      topic: 'ineq', concept: 'resoldre inequacions',
      questionHTML: 'Resol: <span class="math">' + lin(a, b) + ' ' + S(sign) + ' ' + right + '</span>',
      answerKind: 'ineq', expected: { bound, sign: finalSign },
      hints: [c ? 'Primer passa totes les x a un membre.' : 'Primer aïlla el terme amb x.',
        'Mira el signe del nombre pel qual has de dividir: si és <b>negatiu</b>, el sentit s\'inverteix; si és positiu, no.'],
      steps,
      explain: 'x ' + S(finalSign) + ' ' + F.fmtValPlain(bound)
    };
  }

  /* ----- Segon grau ----- */
  function genDeltaCount() {
    const kind = pick(['two', 'double', 'none']);
    const a = pick([1, 1, 2, -1]);
    let b, c;
    if (kind === 'two') { const r1 = ri(-4, 4), r2 = ri(-4, 4); if (r1 === r2) return genDeltaCount(); b = -a * (r1 + r2); c = a * r1 * r2; }
    else if (kind === 'double') { const r = nz(-3, 3); b = -2 * a * r; c = a * r * r; }
    else { b = ri(-3, 3); c = Math.sign(a) * (Math.ceil(b * b / (4 * Math.abs(a))) + ri(1, 4)); }
    const delta = b * b - 4 * a * c;
    const correct = delta > 0 ? 2 : (delta === 0 ? 1 : 0);
    const poly = new Poly([R.num(c), R.num(b), R.num(a)]);
    return {
      topic: 'segon', concept: 'discriminant',
      questionHTML: 'Sense resoldre-la, quantes <b>arrels reals</b> té <span class="math">' + F.fmtPoly(poly, 'x') + ' = 0</span>?',
      answerKind: 'choice',
      options: [{ label: 'Cap', correct: correct === 0 }, { label: 'Una (doble)', correct: correct === 1 }, { label: 'Dues', correct: correct === 2 }],
      hints: ['Calcula el discriminant Δ = b² − 4ac (aquí a = ' + nStr(a) + ', b = ' + nStr(b) + ', c = ' + nStr(c) + ').', 'Δ &gt; 0: dues arrels · Δ = 0: una de doble · Δ &lt; 0: cap.'],
      steps: [{ label: 'Discriminant', math: 'Δ = ' + par(b) + '² − 4·' + par(a) + '·' + par(c) + ' = ' + nStr(delta), why: '' }],
      explain: 'Δ = ' + nStr(delta) + ' → ' + (correct === 2 ? 'dues arrels reals.' : correct === 1 ? 'una arrel doble.' : 'cap arrel real.')
    };
  }
  function genQuadratic(form) {
    form = form || pick(['two', 'two', 'double', 'none', 'incb', 'incc', 'irr']);
    const a = pick([1, 1, 2, -1, 3]);
    let poly, expected, hints, steps;
    const P = (c0, c1, c2) => new Poly([R.num(c0), R.num(c1), R.num(c2)]);
    if (form === 'two' || form === 'double') {
      const p = ri(-5, 5);
      let q = form === 'double' ? p : ri(-5, 5);
      while (form === 'two' && q === p) q = ri(-5, 5);
      const B = -a * (p + q), C = a * p * q;
      poly = P(C, B, a);
      expected = distinct([R.num(p), R.num(q)]);
      const monic = P(p * q, -(p + q), 1);
      const delta = B * B - 4 * a * C;
      hints = [
        'Calcula el discriminant Δ = b² − 4ac. ' + (delta === 0 ? 'Si dona 0, hi ha una arrel doble.' : 'Aquí surt un quadrat perfecte.'),
        (a !== 1 ? 'Si vols factoritzar, divideix primer tota l\'equació per ' + nStr(a) + ': queda <span class="math">' + F.fmtPoly(monic, 'x') + ' = 0</span>. ' : '') +
        'Busca dos nombres que multiplicats donin ' + nStr(p * q) + ' i sumats donin ' + nStr(-(p + q)) + '.'
      ];
      steps = [
        { label: 'Identifica', math: 'a = ' + nStr(a) + ', b = ' + nStr(B) + ', c = ' + nStr(C), why: '' },
        { label: 'Discriminant', math: 'Δ = ' + par(B) + '² − 4·' + par(a) + '·' + par(C) + ' = ' + delta, why: delta > 0 ? 'Δ &gt; 0: dues arrels.' : 'Δ = 0: arrel doble.' },
        { label: 'Fórmula general', math: 'x = ' + F.fracHTML(nStr(-B) + ' ' + F.PM + ' √' + delta, nStr(2 * a)), why: '' },
        { label: 'Arrels', math: valsHTML(expected), why: 'Comprova-les substituint.' }
      ];
    } else if (form === 'none') {
      const b = ri(-3, 3), A = Math.abs(a);
      const c = Math.sign(a) * (Math.ceil(b * b / (4 * A)) + ri(1, 5));
      poly = P(c, b, a); expected = [];
      const delta = b * b - 4 * a * c;
      hints = ['Calcula el discriminant abans de fer res més.', 'Si Δ &lt; 0, l\'arrel quadrada no existeix en els reals.'];
      steps = [{ label: 'Discriminant', math: 'Δ = ' + par(b) + '² − 4·' + par(a) + '·' + par(c) + ' = ' + nStr(delta), why: 'Δ &lt; 0: cap arrel real.' }];
    } else if (form === 'incb') {
      const r = nz(1, 5);
      poly = P(-Math.abs(a) * r * r, 0, Math.abs(a)); expected = [R.num(-r), R.num(r)];
      hints = ['No cal la fórmula: aïlla x².', 'Si x² = k (k positiu), hi ha dues arrels: x = √k i x = −√k.'];
      steps = [{ label: 'Aïlla x²', math: 'x² = ' + r * r, why: '' }, { label: 'Arrel quadrada', math: 'x = ±' + r, why: 'No oblidis l\'arrel negativa.' }];
    } else if (form === 'irr') {
      const k = pick([2, 3, 5, 6, 7]);
      poly = P(-k, 0, 1); expected = [Surd.radical(R.num(1), BigInt(k)), Surd.radical(R.num(-1), BigInt(k))];
      hints = ['Aïlla x².', 'Si x² = ' + k + ', les arrels són x = √' + k + ' i x = −√' + k + ' (escriu √' + k + ').'];
      steps = [{ label: 'Aïlla x²', math: 'x² = ' + k, why: '' }, { label: 'Arrel quadrada', math: 'x = ±√' + k, why: 'És un nombre irracional: deixa\'l amb el radical.' }];
    } else { // incc: a·x² + b·x = 0
      const r = nz(-6, 6), A = Math.abs(a);
      poly = P(0, -A * r, A); expected = [R.ZERO, R.num(r)];
      hints = ['No cal la fórmula: treu x de factor comú.', 'Si x·(…) = 0, llavors x = 0 o el parèntesi val 0.'];
      steps = [{ label: 'Factor comú', math: 'x·(' + lin(A, -A * r) + ') = 0', why: '' }, { label: 'Arrels', math: 'x = 0 o x = ' + nStr(r), why: 'Un producte és zero si algun factor és zero.' }];
    }
    return {
      topic: 'segon', concept: 'resoldre segon grau',
      questionHTML: 'Resol: <span class="math">' + F.fmtPoly(poly, 'x') + ' = 0</span>',
      answerKind: 'set', expected, hints, steps,
      explain: valsHTML(expected)
    };
  }
  function genXsqX() {
    const k = pick([1, 2, 3, 4, -2]);
    return {
      topic: 'segon', concept: 'transformacions no reversibles',
      questionHTML: 'Quantes solucions té <span class="math">x² = ' + (k === 1 ? '' : nStr(k)) + 'x</span>?',
      answerKind: 'choice',
      options: [{ label: 'Una', correct: false }, { label: 'Dues', correct: true }, { label: 'Cap', correct: false }, { label: 'Infinites', correct: false }],
      hints: ['Compte: si divideixes entre x, pots perdre una solució.', 'Passa-ho tot a un membre i treu x de factor comú.'],
      steps: [{ label: 'Factor comú', math: 'x(x ' + (k < 0 ? '+ ' + Math.abs(k) : '− ' + k) + ') = 0', why: '' }],
      explain: 'x = 0 o x = ' + nStr(k) + ': <b>dues</b> solucions. Dividir entre x hauria fet perdre x = 0.'
    };
  }

  /* ----- Sistemes ----- */
  function genSystem(form) {
    form = form || pick(['y', 'gen', 'gen', 'classify']);
    const x0 = ri(-5, 5), y0 = ri(-5, 5);
    const sysHTML = (A, B, C) => F.fmtSystemLine(R.num(A), R.num(B), R.num(C));
    if (form === 'y') {
      const m1 = nz(-3, 3);
      let m2 = nz(-3, 3);
      while (m2 === m1) m2 = nz(-3, 3);
      const n1 = y0 - m1 * x0, n2 = y0 - m2 * x0;
      const yl = (m, n) => 'y = ' + lin(m, n);
      return {
        topic: 'sistemes', concept: 'resoldre sistemes',
        questionHTML: 'Resol el sistema: <span class="math">① ' + yl(m1, n1) + '</span> &nbsp;<span class="math">② ' + yl(m2, n2) + '</span>',
        answerKind: 'pair', expected: { x: R.num(x0), y: R.num(y0) },
        hints: ['Les dues equacions donen la y: iguala-les (mètode d\'igualació).', 'Resol l\'equació en x i després calcula la y amb qualsevol equació.'],
        steps: [
          { label: 'Iguala', math: lin(m1, n1) + ' = ' + lin(m2, n2), why: 'Al punt de tall, la y és la mateixa.' },
          { label: 'Agrupa', math: lin(m1 - m2, 0) + ' = ' + nStr(n2 - n1), why: '' },
          { label: 'Resol x', math: 'x = ' + nStr(x0), why: '' },
          { label: 'Calcula y', math: 'y = ' + m1 + '·' + par(x0) + (n1 < 0 ? ' − ' + Math.abs(n1) : ' + ' + n1) + ' = ' + nStr(y0), why: 'Comprova-ho també a ②.' }
        ],
        explain: '(x, y) = (' + nStr(x0) + ', ' + nStr(y0) + ')'
      };
    }
    // forma general A·x + B·y = C
    let A1, B1, A2, B2;
    do { A1 = nz(-4, 4); B1 = nz(-4, 4); A2 = nz(-4, 4); B2 = nz(-4, 4); } while (A1 * B2 - A2 * B1 === 0);
    const C1 = A1 * x0 + B1 * y0, C2 = A2 * x0 + B2 * y0;
    if (form === 'classify') {
      const kind = pick(['u', 'c', 'i']);
      const k = pick([2, 3, -1, -2]);
      let a2 = A2, b2 = B2, c2 = C2;
      if (kind !== 'u') { a2 = k * A1; b2 = k * B1; c2 = k * C1 + (kind === 'c' ? nz(-4, 4) : 0); }
      const names = { u: 'Una', c: 'Cap', i: 'Infinites' };
      return {
        topic: 'sistemes', concept: 'classificar sistemes',
        questionHTML: 'Sense resoldre\'l, quantes solucions té? <span class="math">① ' + sysHTML(A1, B1, C1) + '</span> &nbsp;<span class="math">② ' + sysHTML(a2, b2, c2) + '</span>',
        answerKind: 'choice',
        options: ['u', 'c', 'i'].map(x => ({ label: names[x], correct: x === kind })),
        hints: ['Mira si els coeficients de x i y de ② són els de ① multiplicats per un mateix nombre.', 'Si també ho és el terme independent, és la mateixa recta. Si no, són paral·leles.'],
        steps: [{ label: 'Compara', math: kind === 'u' ? 'Els coeficients no són proporcionals' : '② = ' + (k === -1 ? F.MIN : nStr(k) + '·') + '① als coeficients de x i y', why: '' }],
        explain: kind === 'u' ? 'Rectes que es tallen: <b>una</b> solució.' : kind === 'i' ? '② = ' + (k === -1 ? F.MIN : nStr(k) + '·') + '①: la mateixa recta, <b>infinites</b> solucions.' : 'Mateixa inclinació però terme independent diferent: paral·leles, <b>cap</b> solució.'
      };
    }
    return {
      topic: 'sistemes', concept: 'resoldre sistemes',
      questionHTML: 'Resol el sistema: <span class="math">① ' + sysHTML(A1, B1, C1) + '</span> &nbsp;<span class="math">② ' + sysHTML(A2, B2, C2) + '</span>',
      answerKind: 'pair', expected: { x: R.num(x0), y: R.num(y0) },
      hints: ['Tria un mètode: reducció (multiplica per eliminar una incògnita) o substitució (aïlla x o y en una equació).', 'Quan tinguis un valor, substitueix-lo en una equació per trobar l\'altre.'],
      steps: [
        { label: 'Iguala els coeficients de x', math: '① × ' + par(A2) + ': ' + sysHTML(A1 * A2, B1 * A2, C1 * A2) + '<br>② × ' + par(A1) + ': ' + sysHTML(A2 * A1, B2 * A1, C2 * A1), why: 'Multipliquem cada equació perquè la x tingui el mateix coeficient.' },
        { label: 'Resta i resol y', math: sysHTML(0, B1 * A2 - B2 * A1, C1 * A2 - C2 * A1) + ' → y = ' + nStr(y0), why: 'En restar, la x desapareix.' },
        { label: 'Recupera x', math: (A1 === 1 ? '' : A1 === -1 ? F.MIN : nStr(A1)) + 'x ' + (B1 < 0 ? '− ' : '+ ') + (Math.abs(B1) === 1 ? '' : Math.abs(B1) + '·') + par(y0) + ' = ' + nStr(C1) + ' → x = ' + nStr(x0), why: 'Comprova-ho també a ②.' }
      ],
      explain: '(x, y) = (' + nStr(x0) + ', ' + nStr(y0) + ')'
    };
  }

  /* ----- Biquadrades ----- */
  function genBiquad() {
    // a partir de dos valors de t: (t − t₁)(t − t₂) = 0, amb arrels enteres
    const T = [0, 1, 4, 9, 16, -1, -4];
    let t1 = pick(T), t2 = pick(T);
    if (t1 < 0 && t2 < 0 && Math.random() < .6) t2 = pick([1, 4, 9]);
    const b = -(t1 + t2), c = t1 * t2;
    const poly = new Poly([R.num(c), R.ZERO, R.num(b), R.ZERO, R.ONE]);
    const xs = [];
    for (const t of distinct([R.num(t1), R.num(t2)])) {
      const tv = t.toNumber();
      if (tv > 0) { const s = Math.round(Math.sqrt(tv)); xs.push(R.num(-s), R.num(s)); } else if (tv === 0) xs.push(R.ZERO);
    }
    const ts = distinct([R.num(t1), R.num(t2)]).map(t => 't = ' + F.fmtValPlain(t));
    const tPoly = new Poly([R.num(c), R.num(b), R.ONE]);
    return {
      topic: 'biquad', concept: 'resoldre biquadrades',
      questionHTML: 'Resol: <span class="math">' + F.fmtPoly(poly, 'x') + ' = 0</span>',
      answerKind: 'set', expected: distinct(xs),
      hints: ['Fes el canvi t = x²: queda una equació de segon grau en t.', 'Cada t positiu dona dues arrels (±√t), t = 0 en dona una i els t negatius, cap.'],
      steps: [
        { label: 'Canvi de variable', math: F.fmtPoly(tPoly, 't') + ' = 0', why: 'Amb t = x².' },
        { label: 'Valors de t', math: ts.join(' i '), why: '' },
        { label: 'Torna a x', math: valsHTML(distinct(xs)), why: 'Descarta els t negatius: x² no pot ser negatiu.' }
      ],
      explain: valsHTML(distinct(xs))
    };
  }
  function genTNeg() {
    const t = -ri(1, 5);
    return {
      topic: 'biquad', concept: 'valors de t admissibles',
      questionHTML: 'En una biquadrada, l\'equació auxiliar dona <span class="math">t = ' + nStr(t) + '</span>. Quantes arrels <b>reals</b> aporta aquest valor?',
      answerKind: 'choice',
      options: [{ label: 'Cap', correct: true }, { label: 'Una', correct: false }, { label: 'Dues', correct: false }],
      hints: ['Recorda que t = x². Un quadrat pot ser negatiu?', 'Cap nombre real elevat al quadrat dona ' + nStr(t) + '.'],
      explain: 'x² = ' + nStr(t) + ' és impossible en els reals: aquest t es <b>descarta</b>.'
    };
  }

  /* ---------- què treballo ---------- */
  const TOPICS = [
    { id: 'concepte', name: 'Què és una solució', gens: [genIsSolution, genCount] },
    { id: 'primer', name: 'Primer grau', gens: [genLinear, genLinear, genLinear, genParam] },
    { id: 'ineq', name: 'Inequacions', gens: [genIneq, genIneq, genIneq, genSignFlip] },
    { id: 'segon', name: 'Segon grau', gens: [genQuadratic, genQuadratic, genQuadratic, genDeltaCount, genXsqX] },
    { id: 'sistemes', name: 'Sistemes', gens: [genSystem, genSystem, genSystem] },
    { id: 'biquad', name: 'Biquadrades', gens: [genBiquad, genBiquad, genTNeg] }
  ];
  /* ---------- quin suport vull ---------- */
  const SUPPORTS = [
    { id: 'exemple', name: 'Amb un exemple resolt' },
    { id: 'passos', name: 'Amb els primers passos' },
    { id: 'sol', name: 'Tot sol' }
  ];

  /* ============================================================
     RENDER
     ============================================================ */
  function render(main, params) {
    const st = {
      topic: TOPICS.some(t => t.id === params.t) ? params.t : 'primer',
      support: SUPPORTS.some(s => s.id === params.s) ? params.s : 'passos',
      ex: null, gen: null, stats: loadStats(), solved: false, attempted: false,
      shownHints: 0, shownSteps: 0, sawSolution: false, hadWrong: false, solo: false
    };

    main.innerHTML =
      '<div class="prac-wrap"><div class="prac-inner">' +
      '<div class="card prac-pick">' +
      '<div class="pp-row"><span class="pp-lab">Què treballo</span><div id="prac-topics"></div></div>' +
      '<div class="pp-row"><span class="pp-lab">Quin suport vull</span><div id="prac-support"></div></div>' +
      '</div>' +
      '<div id="prac-example"></div>' +
      '<div class="card prac-item-card" id="prac-item"></div>' +
      '<div class="btn-row" style="justify-content:space-between">' +
      '<button class="btn ghost small" id="prac-new">' + UI.icon('refresh') + 'Un altre exercici</button>' +
      '<button class="btn ghost small" id="prac-summary">' + UI.icon('book') + 'El meu progrés</button>' +
      '</div>' +
      '<div class="card" id="prac-synth" hidden></div>' +
      '</div></div>';

    const el = (id) => main.querySelector('#' + id);

    /* ---- selectors ---- */
    function chips(host, list, cur, onPick) {
      host.className = 'lvl-row';
      host.innerHTML = list.map(x => '<button type="button" class="lvl" data-id="' + x.id + '" aria-pressed="' + (x.id === cur) + '">' + x.name + '</button>').join('');
      host.onclick = (e) => { const b = e.target.closest('[data-id]'); if (b) onPick(b.dataset.id); };
    }
    function renderPickers() {
      chips(el('prac-topics'), TOPICS, st.topic, (id) => { st.topic = id; renderPickers(); newExercise(); });
      chips(el('prac-support'), SUPPORTS, st.support, changeSupport);
      L.App.updateHash({ t: st.topic, s: st.support });
    }

    el('prac-new').addEventListener('click', () => newExercise());
    el('prac-summary').addEventListener('click', () => {
      const s = el('prac-synth');
      s.hidden = !s.hidden;
      if (!s.hidden) renderSynth();
    });

    /* un exercici no resolt després d'intentar-lo compta com a «no resolt» */
    function closeCurrent() {
      if (st.ex && !st.solved && (st.attempted || st.sawSolution)) record(st.stats, st.ex, 'miss');
    }
    // sameGen: mateix tipus d'exercici (per al suport canviat o per «un de semblant»)
    function newExercise(sameGen, solo) {
      closeCurrent();
      const t = TOPICS.find(x => x.id === st.topic);
      if (!sameGen || !st.gen) st.gen = pick(t.gens);
      st.ex = st.gen();
      st.solved = false; st.attempted = false; st.shownHints = 0; st.shownSteps = 0;
      st.sawSolution = false; st.hadWrong = false; st.solo = !!solo; st.helped = false;
      renderExample();
      renderItem();
    }

    /* canviar el suport no canvia l'exercici: es conserva el que l'alumne ja havia escrit */
    function changeSupport(id) {
      if (id === st.support) return;
      st.support = id;
      renderPickers();
      if (st.solved) return; // ja resolt: el suport nou valdrà per al pròxim
      const box = el('prac-item');
      const typed = {};
      box.querySelectorAll('#prac-answer input').forEach(i => { typed[i.id] = i.value; });
      const sign = box.querySelector('#prac-sign [aria-pressed="true"]');
      const signVal = sign ? sign.dataset.sign : null;
      const hints = el('prac-hints').innerHTML, fb = el('prac-feedback').innerHTML;
      const shown = st.shownSteps;
      renderExample();
      renderItem();
      st.shownSteps = Math.max(st.shownSteps, shown);
      box.querySelectorAll('#prac-answer input').forEach(i => { if (typed[i.id] !== undefined) i.value = typed[i.id]; });
      if (signVal) { const b = box.querySelector('#prac-sign [data-sign="' + signVal + '"]'); if (b) b.click(); }
      el('prac-hints').innerHTML = hints; el('prac-feedback').innerHTML = fb;
      buildTools();
    }

    /* ---- suport: exemple resolt del mateix tipus ---- */
    function stepsHTML(steps, n) {
      return (steps || []).slice(0, n === undefined ? 99 : n).map((s, i) =>
        '<div class="prac-hint"><b>' + (i + 1) + ' · ' + s.label + '.</b> <span class="math">' + s.math + '</span>' +
        (s.why ? '<br><span style="font-size:.8rem;color:var(--ink-faint)">' + s.why + '</span>' : '') + '</div>').join('');
    }
    function renderExample() {
      const host = el('prac-example');
      if (st.support !== 'exemple' || st.solo) { host.innerHTML = ''; return; }
      const ex = st.gen();
      const answer = ex.answerKind === 'choice' ? (ex.options.find(o => o.correct) || {}).label : '';
      host.innerHTML = '<div class="card prac-worked"><div class="card-title">' + UI.icon('book') + 'Exemple resolt</div>' +
        '<div class="prac-question" style="font-size:1rem">' + ex.questionHTML + '</div>' +
        stepsHTML(ex.steps) +
        '<div class="prac-hint" style="background:var(--amber-soft);border-color:#eed9b0;color:#5c3d06"><b>Resposta:</b> ' +
        (answer ? answer + '. ' : '') + '<span class="math">' + (ex.explain || '') + '</span></div>' +
        '<p class="help-note" style="margin-top:6px">Ara fes-ne tu un de semblant, a sota.</p></div>';
    }

    /* ---- exercici ---- */
    function renderItem() {
      const ex = st.ex;
      const box = el('prac-item');
      const t = TOPICS.find(x => x.id === ex.topic);
      // passos incomplets: es veuen els primers passos i l'alumne acaba la resta
      const given = st.support === 'passos' && !st.solo && ex.steps && ex.steps.length > 1 ? Math.max(1, ex.steps.length - (ex.steps.length >= 4 ? 2 : 1)) : 0;
      st.shownSteps = given;
      if (st.support !== 'sol' && !st.solo) st.helped = true; // amb exemple o passos ja no compta com a «tot sol»
      box.innerHTML =
        '<div class="prac-meta"><span class="badge neutral">' + UI.icon('target') + t.name + '</span>' +
        '<span>' + ex.concept + '</span>' + (st.solo ? '<span class="badge ok">tot sol</span>' : '') + '</div>' +
        '<div class="prac-question">' + ex.questionHTML + '</div>' +
        (given ? '<div class="prac-given"><div class="tools-label">Passos fets. Acaba\'l tu:</div>' + stepsHTML(ex.steps, given) + '</div>' : '') +
        '<div id="prac-answer"></div>' +
        '<div class="prac-hints" id="prac-hints"></div>' +
        '<div class="prac-tools-wrap"><span class="tools-label">Necessites ajuda?</span>' +
        '<div class="btn-row" id="prac-tools" style="flex-wrap:wrap"></div></div>' +
        '<div id="prac-feedback"></div>';
      buildAnswer(box.querySelector('#prac-answer'));
      buildTools();
    }

    function buildAnswer(host) {
      const ex = st.ex;
      const go = (fn) => {
        const b = host.querySelector('#prac-go');
        if (b) b.addEventListener('click', fn);
        host.querySelectorAll('input').forEach(i => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') fn(); }));
      };
      if (ex.answerKind === 'choice') {
        const order = UI.shuffled(ex.options.map((o, i) => i));
        host.innerHTML = '<div class="prac-opts" role="group" aria-label="Opcions de resposta">' +
          order.map(i => '<button type="button" class="prac-opt" data-i="' + i + '">' + ex.options[i].label + '</button>').join('') + '</div>';
        host.addEventListener('click', (e) => {
          const b = e.target.closest('.prac-opt');
          if (!b || st.solved || b.disabled) return;
          const o = ex.options[+b.dataset.i];
          // un sol intent: es mostra la correcta i el perquè (no s'arriba a la resposta per eliminació)
          host.querySelectorAll('.prac-opt').forEach(x => { x.disabled = true; if (ex.options[+x.dataset.i].correct) x.classList.add('correct'); });
          if (o.correct) answerCorrect('<b>Correcte!</b> ' + (ex.explain || ''));
          else { b.classList.add('wrong'); answerMissed('<b>No és aquesta.</b> ' + (ex.explain || '')); }
        });
      } else if (ex.answerKind === 'value') {
        host.innerHTML = '<div class="ck-inputrow" style="margin-top:6px">' +
          '<span class="math" style="font-size:1.15rem">' + F.V(ex.varName || 'x') + ' =</span>' +
          '<input class="input math" id="prac-in" style="width:150px" placeholder="p. ex. 4, −2/3, √5" aria-label="La teva resposta">' +
          '<button class="btn primary small" id="prac-go">Comprova</button></div>';
        go(() => {
          let v;
          try { v = L.parseValue(el('prac-in').value); } catch (e) { feedbackErr(e.message); return; }
          if (sameVal(v, ex.expected)) answerCorrect('<b>Correcte!</b> ' + ex.explain);
          else answerWrong('<b>Encara no.</b> Comprova-ho substituint a l\'enunciat.', 'err');
        });
      } else if (ex.answerKind === 'set') {
        host.innerHTML = '<div class="ck-inputrow" style="margin-top:6px;align-items:center;flex-wrap:wrap">' +
          '<span class="math" style="font-size:1.15rem">' + F.V('x') + ' =</span>' +
          '<input class="input math" id="prac-in" style="width:200px" placeholder="p. ex. −2; 3" aria-label="Les solucions, separades per punt i coma">' +
          '<button class="btn primary small" id="prac-go">Comprova</button>' +
          '<button class="btn ghost small" id="prac-none">No té solució real</button></div>' +
          '<p class="help-note" style="margin-top:4px">Escriu totes les solucions separades per <b>;</b> (punt i coma), en qualsevol ordre.</p>';
        const check = (got) => {
          const m = matchSet(got, ex.expected);
          if (m.all) answerCorrect('<b>Correcte!</b> ' + ex.explain);
          else if (!ex.expected.length) answerWrong('<b>Encara no.</b> Comprova si de veritat té solucions: mira el discriminant o el signe de t.', 'err');
          else if (!got.length) answerWrong('<b>Encara no.</b> Sí que té solucions reals. Torna-hi.', 'err');
          else if (m.hits > 0) answerWrong('<b>Gairebé!</b> Has trobat ' + m.hits + ' de les ' + m.total + ' solucions. En falta alguna o n\'hi sobra alguna? (Recorda el ±.)', 'partial');
          else answerWrong('<b>Encara no.</b> Comprova cada valor substituint-lo.', 'err');
        };
        go(() => {
          let got;
          try {
            const raw = el('prac-in').value.trim();
            if (!raw) throw new Error('Escriu les solucions o toca «No té solució real».');
            got = raw.split(/;|\s+i\s+|\s+o\s+/).map(s => s.trim()).filter(Boolean).map(s => L.parseValue(s));
          } catch (e) { feedbackErr(e.message); return; }
          check(got);
        });
        host.querySelector('#prac-none').addEventListener('click', () => check([]));
      } else if (ex.answerKind === 'pair') {
        host.innerHTML = '<div class="ck-inputrow" style="margin-top:6px;align-items:center">' +
          '<span class="math" style="font-weight:700">(</span>' +
          '<input class="input math" id="prac-in1" style="width:80px" placeholder="x" aria-label="Valor de x">' +
          '<span class="math" style="font-weight:700">,</span>' +
          '<input class="input math" id="prac-in2" style="width:80px" placeholder="y" aria-label="Valor de y">' +
          '<span class="math" style="font-weight:700">)</span>' +
          '<button class="btn primary small" id="prac-go">Comprova</button></div>';
        go(() => {
          let x, y;
          try { x = L.parseValue(el('prac-in1').value); y = L.parseValue(el('prac-in2').value); } catch (e) { feedbackErr(e.message); return; }
          const okX = sameVal(x, ex.expected.x), okY = sameVal(y, ex.expected.y);
          const swapped = sameVal(x, ex.expected.y) && sameVal(y, ex.expected.x);
          if (okX && okY) answerCorrect('<b>Correcte!</b> ' + ex.explain);
          else if (swapped) answerWrong('<b>Gairebé!</b> Els valors són bons però estan al revés: primer va la x i després la y.', 'partial');
          else if (okX || okY) answerWrong('<b>Gairebé!</b> Un dels dos valors és correcte. Comprova cada equació per separat.', 'partial');
          else answerWrong('<b>Encara no.</b> Comprova la parella a les dues equacions.', 'err');
        });
      } else if (ex.answerKind === 'ineq') {
        host.innerHTML = '<div class="ck-inputrow" style="margin-top:6px;align-items:center;flex-wrap:wrap">' +
          '<span class="math" style="font-weight:700">x</span>' +
          '<div class="sign-picker" id="prac-sign" role="group" aria-label="Signe de la solució">' +
          '<button data-sign="<" aria-label="menor">&lt;</button><button data-sign=">" aria-label="major">&gt;</button>' +
          '<button data-sign="<=" aria-label="menor o igual">≤</button><button data-sign=">=" aria-label="major o igual">≥</button></div>' +
          '<input class="input math" id="prac-in" style="width:110px" placeholder="frontera" aria-label="Valor frontera">' +
          '<button class="btn primary small" id="prac-go">Comprova</button></div>';
        let chosen = null;
        host.querySelectorAll('#prac-sign button').forEach(b => b.addEventListener('click', () => {
          chosen = b.dataset.sign;
          host.querySelectorAll('#prac-sign button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        }));
        go(() => {
          if (!chosen) { feedbackErr('Tria primer el signe de la solució.'); return; }
          let v;
          try { v = L.parseValue(el('prac-in').value); } catch (e) { feedbackErr(e.message); return; }
          const okV = sameVal(v, ex.expected.bound), okS = chosen === ex.expected.sign;
          if (okV && okS) answerCorrect('<b>Correcte!</b> ' + ex.explain);
          else if (okV) answerWrong('<b>La frontera és correcta, però el signe no.</b> Has dividit per un nombre negatiu? Llavors el sentit s\'inverteix.', 'partial');
          else if (okS) answerWrong('<b>El signe és correcte, però la frontera no.</b> Revisa l\'última divisió.', 'partial');
          else answerWrong('<b>Encara no.</b> Torna-hi pas a pas.', 'err');
        });
      }
    }

    function feedbackErr(msg) {
      el('prac-feedback').innerHTML = '<div class="det-feedback bad">' + UI.icon('alert') + msg + '</div>';
    }
    function lockAnswer() { el('prac-answer').querySelectorAll('button, input').forEach(x => { x.disabled = true; }); }

    /* encert: sense cap ajuda (i en mode «tot sol») compta com a autònom */
    function answerCorrect(html) {
      st.attempted = true; st.solved = true;
      const clean = (st.support === 'sol' || st.solo) && !st.helped && !st.hadWrong && !st.shownHints && !st.sawSolution && st.shownSteps === 0;
      record(st.stats, st.ex, clean ? 'clean' : 'help');
      lockAnswer();
      const fb = el('prac-feedback');
      const j = JUSTIFY[st.ex.topic];
      fb.innerHTML = '<div class="det-feedback good">' + html + '</div>' +
        (clean ? '<div class="prac-note">' + UI.icon('check') + 'Resolt <b>sense ajuda</b>.</div>' : '<div class="prac-note">Resolt amb ajuda. Quan et sentis segur, prova\'n un <b>tot sol</b>.</div>') +
        '<div id="prac-justify"></div>' +
        '<div class="btn-row" style="margin-top:10px">' +
        (!clean ? '<button class="btn soft" id="prac-solo">Un de semblant, tot sol ▸</button>' : '') +
        '<button class="btn primary" id="prac-next">Següent exercici ▸</button></div>';
      fb.querySelector('#prac-next').addEventListener('click', () => newExercise());
      const so = fb.querySelector('#prac-solo');
      if (so) so.addEventListener('click', () => newExercise(true, true));
      // justificació opcional després d'un encert sense ajuda
      if (clean && j) {
        const card = UI.renderPrediction({
          question: 'Ho saps justificar? ' + j.q,
          shuffle: true,
          options: [{ label: j.ok, correct: true }].concat(j.no.map(n => ({ label: n, correct: false }))),
          continueLabel: 'D\'acord',
          onDone: (ok) => {
            if (ok) { statOf(st.stats, st.ex).just = (statOf(st.stats, st.ex).just || 0) + 1; saveStats(st.stats); UI.toast('Justificació correcta.', 'ok'); }
            if (!el('prac-synth').hidden) renderSynth();
          }
        });
        fb.querySelector('#prac-justify').appendChild(card);
      }
      if (!el('prac-synth').hidden) renderSynth();
    }
    /* resposta d'opció incorrecta: es mostra la correcta i es proposa un de semblant */
    function answerMissed(html) {
      st.attempted = true; st.hadWrong = true; st.solved = true;
      record(st.stats, st.ex, 'miss');
      const fb = el('prac-feedback');
      fb.innerHTML = '<div class="det-feedback bad">' + html + '</div>' +
        '<div class="btn-row" style="margin-top:10px"><button class="btn primary" id="prac-solo">Prova\'n un de semblant ▸</button>' +
        '<button class="btn ghost" id="prac-next">Un altre exercici</button></div>';
      fb.querySelector('#prac-solo').addEventListener('click', () => newExercise(true, true));
      fb.querySelector('#prac-next').addEventListener('click', () => newExercise());
    }
    /* error o resposta parcial: anima a tornar-hi (mai revela la resposta) */
    function answerWrong(html, kind) {
      st.attempted = true; st.hadWrong = true;
      el('prac-feedback').innerHTML = '<div class="det-feedback ' + (kind === 'partial' ? 'info' : 'bad') + '">' + html + '</div>' +
        (kind === 'err' && st.shownHints < (st.ex.hints || []).length ? '<p class="help-note" style="margin-top:6px">Torna-ho a provar. Tens pistes a sota.</p>' : '');
    }

    function buildTools() {
      const tools = el('prac-tools');
      const ex = st.ex;
      const btns = [];
      if (ex.hints && st.shownHints < ex.hints.length) btns.push('<button class="btn soft small" id="prac-hint">' + UI.icon('bulb') + 'Pista ' + (st.shownHints + 1) + ' de ' + ex.hints.length + '</button>');
      if (ex.steps && st.shownSteps < ex.steps.length) btns.push('<button class="btn soft small" id="prac-step">' + UI.icon('steps') + 'Mostra el pas següent</button>');
      btns.push('<button class="btn ghost small" id="prac-sol">' + UI.icon('eye') + 'Solució raonada</button>');
      tools.innerHTML = btns.join('');
      const hb = tools.querySelector('#prac-hint');
      if (hb) hb.addEventListener('click', () => {
        const h = document.createElement('div');
        h.className = 'prac-hint';
        h.innerHTML = '<b>Pista ' + (st.shownHints + 1) + '.</b> ' + ex.hints[st.shownHints];
        el('prac-hints').appendChild(h);
        st.shownHints++;
        buildTools();
      });
      const sb = tools.querySelector('#prac-step');
      if (sb) sb.addEventListener('click', () => {
        const s = ex.steps[st.shownSteps];
        const h = document.createElement('div');
        h.className = 'prac-hint';
        h.innerHTML = '<b>Pas ' + (st.shownSteps + 1) + ' · ' + s.label + '.</b> <span class="math">' + s.math + '</span>' +
          (s.why ? '<br><span style="font-size:.8rem;color:var(--ink-faint)">' + s.why + '</span>' : '');
        el('prac-hints').appendChild(h);
        st.shownSteps++;
        buildTools();
      });
      tools.querySelector('#prac-sol').addEventListener('click', () => {
        st.sawSolution = true;
        el('prac-hints').innerHTML = stepsHTML(ex.steps) +
          '<div class="prac-hint" style="background:var(--amber-soft);border-color:#eed9b0;color:#5c3d06"><b>Solució:</b> <span class="math">' + (ex.explain || '') + '</span></div>' +
          (!st.solved ? '<div class="btn-row" style="margin-top:8px"><button class="btn primary small" id="prac-solo2">Ara un de semblant, tot sol ▸</button></div>' : '');
        const s2 = el('prac-hints').querySelector('#prac-solo2');
        if (s2) s2.addEventListener('click', () => newExercise(true, true));
        st.shownHints = ex.hints ? ex.hints.length : 0;
        st.shownSteps = ex.steps ? ex.steps.length : 0;
        buildTools();
      });
    }

    /* ---- el meu progrés ---- */
    function renderSynth() {
      const s = el('prac-synth');
      const entries = Object.entries(st.stats).filter(([, d]) => d.hist && d.hist.length);
      const refl = L.App.loadReflections().slice(-6).reverse();
      const reflHTML = refl.length
        ? '<div class="card-title" style="margin-top:12px">' + UI.icon('speech') + 'Les meves explicacions</div><ul class="refl-list">' +
          refl.map(r => '<li><span class="rl-ctx">' + (r.ctx || '') + '</span>' + r.text.replace(/</g, '&lt;') + '</li>').join('') + '</ul>'
        : '';
      if (!entries.length) {
        s.innerHTML = '<div class="card-title">' + UI.icon('book') + 'El meu progrés</div>' +
          '<p class="help-note">Encara no hi ha dades. Fes alguns exercicis i aquí veuràs com avances en cada concepte. No són notes: és la teva brúixola.</p>' + reflHTML;
        return;
      }
      const n = (h, k) => h.filter(x => x === k).length;
      const rows = entries.map(([concept, d]) => {
        const t = TOPICS.find(x => x.id === d.topic);
        return '<tr style="border-bottom:1px solid var(--line, #e3e8ef)"><td style="padding:6px 8px">' + concept + (t ? '<br><span style="font-size:.75rem;color:var(--ink-faint)">' + t.name + '</span>' : '') + '</td>' +
          '<td style="padding:6px 8px;text-align:center">' + n(d.hist, 'clean') + '</td>' +
          '<td style="padding:6px 8px;text-align:center">' + n(d.hist, 'help') + '</td>' +
          '<td style="padding:6px 8px;text-align:center">' + n(d.hist, 'miss') + '</td></tr>';
      }).join('');
      s.innerHTML =
        '<div class="card-title">' + UI.icon('book') + 'El meu progrés</div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:.85rem"><thead><tr style="color:var(--ink-faint);font-size:.75rem">' +
        '<th style="text-align:left;padding:4px 8px">Concepte</th><th style="padding:4px 8px">Tot sol</th><th style="padding:4px 8px">Amb ajuda</th><th style="padding:4px 8px">Sense resoldre</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>' +
        '<p class="help-note" style="margin-top:8px">Compten els últims 10 exercicis de cada concepte.</p>' +

        reflHTML +
        '<div class="btn-row" style="margin-top:8px"><button class="btn ghost small" id="prac-reset">' + UI.icon('refresh') + 'Esborra el progrés de la pràctica</button></div>';
      s.querySelector('#prac-reset').addEventListener('click', () => {
        st.stats = {}; saveStats(st.stats); renderSynth();
        UI.toast('Progrés de la pràctica esborrat.', 'ok');
      });
    }

    renderPickers();
    newExercise();
    // els generadors fan servir nombres JS («-4»): al text visible hi posem el signe menys tipogràfic «−4»
    const MINUS_RE = /(^|[\s(=<>≤≥,;:·+])-(\d)/g;
    function fixMinus(root) {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (MINUS_RE.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(MINUS_RE, '$1−$2');
        MINUS_RE.lastIndex = 0;
      }
    }
    fixMinus(main);
    const mo = new MutationObserver(() => fixMinus(main));
    mo.observe(main, { childList: true, subtree: true });

    return function cleanup() { closeCurrent(); mo.disconnect(); };
  }

  function help() {
    UI.openModal({
      title: 'Pràctica · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>Tria dues coses:</b></p>' +
      '<ul style="list-style:disc;padding-left:22px;line-height:1.9">' +
      '<li><b>Què treballo:</b> què és una solució, primer grau, inequacions, segon grau, sistemes o biquadrades.</li>' +
      '<li><b>Quin suport vull:</b> amb un exemple resolt a dalt, amb els primers passos fets o tot sol.</li></ul>' +
      '<p><b>Ajudes:</b> pistes, pas següent i solució raonada. Després de la solució, prova\'n un de semblant tot sol.</p>' +
      '<p><b>El meu progrés:</b> per a cada concepte, quants n\'has resolt tot sol, amb ajuda o sense resoldre.</p>' +
      '<p class="help-note"><b>El corrector</b> compara conjunts de solucions: 2/4 i 1/2 són la mateixa resposta, l\'ordre no importa i √5 és una resposta exacta. Les dades es desen <b>només en aquest navegador</b>.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'practica', kind: 'practica', num: 'P', short: 'Pràctica',
    title: 'Pràctica', sub: 'Tria el contingut i el suport',
    desc: 'Tria què treballes i quanta ajuda vols.',
    foot: 'Practicar sense presses',
    iconHTML: 'P',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
