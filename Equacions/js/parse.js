/* ============================================================
   parse.js — parser segur d'entrades de l'alumnat (MAI eval)
   Admet: "3", "-4", "1/2", "1,5", "√5", "2√3", "(3+√5)/2",
          "x", "3x", "-2x", "x/2", "2(x+1)", "x + 1"...
   Modes: valor (R | Surd) i expressió lineal (Poly de grau ≤ 1)
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const R = L.R, Surd = L.Surd, Poly = L.Poly;

  function tokenize(str) {
    const s = String(str).replace(/[\u2212\u2013\u2014]/g, '-')
      .replace(/[·×]/g, '*').replace(/÷/g, '/')
      .replace(/,/g, '.').replace(/\s+/g, '');
    if (!s) throw new Error('No has escrit cap valor.');
    const toks = [];
    let i = 0;
    while (i < s.length) {
      const ch = s[i];
      if (/[0-9.]/.test(ch)) {
        let j = i, dots = 0;
        while (j < s.length && /[0-9.]/.test(s[j])) { if (s[j] === '.') dots++; j++; }
        if (dots > 1) throw new Error('Nombre mal escrit: hi ha més d\'un punt decimal.');
        const t = s.slice(i, j);
        if (t === '.') throw new Error('Nombre mal escrit: un punt sol no és un nombre.');
        toks.push({ t: 'num', v: t }); i = j; continue;
      }
      if (ch === '√') { toks.push({ t: 'sqrt' }); i++; continue; }
      if (ch === 'x' || ch === 'X') { toks.push({ t: 'var' }); i++; continue; }
      if ('+-*/()'.includes(ch)) { toks.push({ t: ch }); i++; continue; }
      if (ch === '^') { throw new Error('Aquí no calen potències: escriu el valor directament.'); }
      throw new Error('No entenc el caràcter «' + ch + '».');
    }
    return toks;
  }

  /* ---------- parser (descens recursiu) ---------- */
  function makeParser(toks, mode) { // mode: 'value' | 'poly'
    let pos = 0;
    const peek = () => toks[pos];
    const next = () => toks[pos++];
    const isVal = v => v !== undefined && v !== null;

    function parseExpr() {
      let left;
      if (peek() && peek().t === '-') { next(); left = neg(parseTerm()); }
      else if (peek() && peek().t === '+') { next(); left = parseTerm(); }
      else left = parseTerm();
      while (peek() && (peek().t === '+' || peek().t === '-')) {
        const op = next().t;
        const right = parseTerm();
        left = op === '+' ? add(left, right) : sub(left, right);
      }
      return left;
    }
    function startsFactor(tok) {
      return tok && (tok.t === 'num' || tok.t === 'sqrt' || tok.t === 'var' || tok.t === '(');
    }
    function parseTerm() {
      let left = parseFactor();
      while (true) {
        const p = peek();
        if (!p) break;
        if (p.t === '*' || p.t === '/') {
          next();
          const right = parseFactor();
          left = p.t === '*' ? mul(left, right) : div(left, right);
        } else if (startsFactor(p)) { // multiplicació implícita: 2√3, 3x, 2(x+1), (a)(b)
          const right = parseFactor();
          left = mul(left, right);
        } else break;
      }
      return left;
    }
    function parseFactor() {
      const p = peek();
      if (!p) throw new Error('L\'expressió s\'ha quedat a mitges.');
      if (p.t === 'num') {
        next();
        const val = R.parse(p.v);
        const q = peek();
        if (q && (q.t === 'sqrt')) { // 2√3
          return mul(val, parseSqrt());
        }
        return val;
      }
      if (p.t === 'sqrt') return parseSqrt();
      if (p.t === 'var') {
        if (mode !== 'poly') throw new Error('Aquí esperava un nombre, no la lletra x. Escriu per exemple 4 o 3/2.');
        next();
        return Poly.linear(R.ONE, R.ZERO);
      }
      if (p.t === '(') {
        next();
        const inner = parseExpr();
        if (!peek() || peek().t !== ')') throw new Error('Falta tancar un parèntesi.');
        next();
        return inner;
      }
      throw new Error('No entenc aquesta expressió per aquesta posició.');
    }
    function parseSqrt() {
      next(); // consumeix √
      const p = peek();
      if (p && p.t === 'num') {
        next();
        const v = R.parse(p.v);
        if (v.isNeg()) throw new Error('√ d\'un nombre negatiu: això no és un nombre real.');
        const sq = L.sqrtRational(v);
        return sq.exact !== undefined ? Surd.fromRational(sq.exact) : sq.surd;
      }
      if (p && p.t === '(') {
        next();
        const inner = parseExpr();
        if (!peek() || peek().t !== ')') throw new Error('Falta tancar un parèntesi.');
        next();
        const v = toRStrict(inner);
        if (v.isNeg()) throw new Error('√ d\'un nombre negatiu: això no és un nombre real.');
        const sq = L.sqrtRational(v);
        return sq.exact !== undefined ? Surd.fromRational(sq.exact) : sq.surd;
      }
      throw new Error('Després de √ cal un nombre o un parèntesi, per exemple √5 o √(9/4).');
    }

    // ---- operacions polimòrfiques R / Surd / Poly ----
    function asSurd(v) { return (v instanceof R) ? Surd.fromRational(v) : v; }
    function toRStrict(v) {
      if (v instanceof R) return v;
      if (v instanceof Surd) { if (v.isRational()) return v.q; throw new Error('Esperava un nombre sense radicals.'); }
      if (v instanceof Poly) { if (v.isConst()) return v.coef(0); throw new Error('Esperava un nombre, no una expressió amb x.'); }
      throw new Error('Valor inesperat.');
    }
    function checkPoly(v) {
      if (v instanceof Poly && v.deg > 1) {
        throw new Error('Aquesta expressió conté x' + (v.deg === 2 ? '²' : '³') + ': aquí només treballem fins a primer grau.');
      }
      return v;
    }
    function add(a, b) {
      if (a instanceof Poly || b instanceof Poly) return checkPoly(Poly.cast(a).add(Poly.cast(b)));
      return asSurd(a).add(asSurd(b));
    }
    function sub(a, b) {
      if (a instanceof Poly || b instanceof Poly) return checkPoly(Poly.cast(a).sub(Poly.cast(b)));
      return asSurd(a).sub(asSurd(b));
    }
    function neg(a) {
      if (a instanceof Poly) return a.scale(R.ONE.neg());
      return asSurd(a).neg();
    }
    function mul(a, b) {
      if (a instanceof Poly || b instanceof Poly) return checkPoly(Poly.cast(a).mul(Poly.cast(b)));
      return asSurd(a).mul(asSurd(b));
    }
    function div(a, b) {
      if (a instanceof Poly || b instanceof Poly) {
        const pa = Poly.cast(a), pb = Poly.cast(b);
        if (pb.deg > 0) throw new Error('Aquí no es pot dividir entre una expressió amb x: divideix només entre nombres.');
        const k = pb.isZero() ? null : pb.coef(0);
        if (!k) throw new Error('No es pot dividir per zero.');
        return checkPoly(pa.scale(R.ONE.div(k)));
      }
      const bb = toRStrict(b);
      if (bb.isZero()) throw new Error('No es pot dividir per zero.');
      return asSurd(a).div(asSurd(bb));
    }

    const result = parseExpr();
    if (pos < toks.length) throw new Error('Sobra alguna cosa al final de l\'expressió.');
    return result;
  }

  // Poly.cast: R|Surd(racional)|Poly → Poly
  if (!Poly.cast) {
    Poly.cast = function (v) {
      if (v instanceof Poly) return v;
      if (v instanceof R) return Poly.const(v);
      if (v instanceof Surd) { if (v.isRational()) return Poly.const(v.q); throw new Error('Coefficients amb radicals no admesos aquí.'); }
      throw new Error('Valor inesperat com a expressió.');
    };
  }

  /* ---------- API pública ---------- */
  function parseValue(str) { // → R | Surd
    const toks = tokenize(str);
    const v = makeParser(toks, 'value');
    if (v instanceof Poly) throw new Error('Aquí esperava un nombre, no la lletra x.');
    return v;
  }
  function parseLinear(str) { // → Poly grau ≤ 1
    const toks = tokenize(str);
    const v = makeParser(toks, 'poly');
    const p = Poly.cast(v);
    if (p.deg > 1) throw new Error('Aquesta expressió és de grau ' + p.deg + ': aquí només treballem fins a primer grau.');
    return p;
  }

  L.parseValue = parseValue;
  L.parseLinear = parseLinear;
  L.tokenize = tokenize;
})(typeof window !== 'undefined' ? window : globalThis);
