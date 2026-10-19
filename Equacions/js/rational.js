/* ============================================================
   rational.js — aritmètica exacta amb racionals (BigInt) i radicals
   R: nombre racional exacte (num/den, sempre reduït, den > 0)
   Surd: q + r·√d  (una sola arrel quadrada, d quadrat-lliure)
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});

  /* ---------- utilitats BigInt ---------- */
  function absBig(a) { return a < 0n ? -a : a; }
  function gcdBig(a, b) {
    a = absBig(a); b = absBig(b);
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }
  function signBig(a) { return a < 0n ? -1 : a > 0n ? 1 : 0; }

  function isqrtBig(n) { // arrel sencera exacta o null
    if (n < 0n) return null;
    if (n < 2n) return n;
    let x = BigInt(Math.floor(Math.sqrt(Number(n)))) + 1n;
    let y = (x + n / x) >> 1n;
    while (y < x) { x = y; y = (x + n / x) >> 1n; }
    return x * x === n ? x : null;
  }
  // n = k²·m amb m quadrat-lliure
  function squareFreeParts(n) {
    n = absBig(n);
    if (n === 0n) return { k: 0n, m: 1n };
    let k = 1n, m = n;
    for (let p = 2n; p * p <= m; p++) {
      while (m % (p * p) === 0n) { m /= (p * p); k *= p; }
    }
    return { k, m };
  }

  /* ---------- R: racional ---------- */
  class R {
    constructor(n, d = 1n) {
      if (typeof n === 'number') n = BigInt(Math.round(n));
      if (typeof d === 'number') d = BigInt(Math.round(d));
      if (d === 0n) throw new Error('Divisió per zero en construir un racional');
      if (d < 0n) { n = -n; d = -d; }
      const g = gcdBig(n, d) || 1n;
      this.n = n / g; this.d = d / g;
    }
    static make(n, d) { return new R(n, d === undefined ? 1n : d); }
    static num(x) { // des de Number (només sencers exactes)
      if (!Number.isFinite(x)) throw new Error('Nombre no finit');
      if (!Number.isInteger(x)) throw new Error('Esperava un nombre enter exacte');
      return new R(BigInt(x));
    }
    static cast(x) {
      if (x instanceof R) return x;
      if (x instanceof Surd) { if (!x.isRational()) throw new Error('Esperava un racional'); return x.q; }
      if (typeof x === 'bigint') return new R(x);
      if (typeof x === 'number') return R.num(x);
      if (typeof x === 'string') return R.parse(x);
      throw new Error('No puc convertir a racional: ' + x);
    }
    // R.parse s'assigna després de la classe (accepta decimals amb coma o punt)
    static parse(s) { return parseRationalString(s); }
    add(o) { o = R.cast(o); return new R(this.n * o.d + o.n * this.d, this.d * o.d); }
    sub(o) { o = R.cast(o); return new R(this.n * o.d - o.n * this.d, this.d * o.d); }
    mul(o) { o = R.cast(o); return new R(this.n * o.n, this.d * o.d); }
    div(o) { o = R.cast(o); if (o.n === 0n) throw new Error('No es pot dividir per zero'); return new R(this.n * o.d, this.d * o.n); }
    neg() { return new R(-this.n, this.d); }
    abs() { return new R(absBig(this.n), this.d); }
    cmp(o) { o = R.cast(o); const s = signBig(this.n * o.d - o.n * this.d); return s; }
    eq(o) { o = R.cast(o); return this.n === o.n && this.d === o.d; }
    lt(o) { return this.cmp(o) < 0; } le(o) { return this.cmp(o) <= 0; }
    gt(o) { return this.cmp(o) > 0; } ge(o) { return this.cmp(o) >= 0; }
    isZero() { return this.n === 0n; }
    isInt() { return this.d === 1n; }
    isNeg() { return this.n < 0n; }
    isPos() { return this.n > 0n; }
    toNumber() { return Number(this.n) / Number(this.d); }
    toString() { return this.d === 1n ? String(this.n) : this.n + '/' + this.d; }
    toJSON() { return this.toString(); }
    clone() { return new R(this.n, this.d); }
  }
  function parseRationalString(s) { // "3", "−4", "1/2", "2.5", "1,5"
    if (s instanceof R) return s;
    let t = String(s).trim().replace(/[\u2212\u2013\u2014]/g, '-').replace(/,/g, '.').replace(/\s+/g, '');
    if (!t) throw new Error('Valor buit');
    let neg = false;
    if (t[0] === '-') { neg = true; t = t.slice(1); }
    else if (t[0] === '+') t = t.slice(1);
    let numS = t, denS = '1';
    if (t.includes('/')) {
      const parts = t.split('/');
      if (parts.length !== 2 || !parts[0] || !parts[1]) throw new Error('Fracció mal escrita: escriu per exemple 3/4');
      numS = parts[0]; denS = parts[1];
    }
    let n, d;
    if (numS.includes('.')) {
      const [i, f] = numS.split('.');
      n = BigInt(i + (f || '0')); d = BigInt('1' + '0'.repeat((f || '').length));
    } else { n = BigInt(numS); d = 1n; }
    if (denS.includes('.')) {
      const [i2, f2] = denS.split('.');
      const dn = BigInt(i2 + (f2 || '0')), dd = BigInt('1' + '0'.repeat((f2 || '').length));
      if (dn === 0n) throw new Error('El denominador no pot ser 0');
      const r0 = new R(n * dd, d * dn);
      return neg ? r0.neg() : r0;
    }
    d = d * BigInt(denS);
    if (d === 0n) throw new Error('El denominador no pot ser 0');
    const r = new R(n, d);
    return neg ? r.neg() : r;
  }

  R.ZERO = new R(0n); R.ONE = new R(1n);

  /* ---------- Surd: q + r·√d (d ≥ 2 quadrat-lliure) ---------- */
  class Surd {
    constructor(q, r, d) {
      this.q = R.cast(q); this.r = R.cast(r); this.d = BigInt(d);
      if (this.d < 0n) throw new Error('Radical negatiu');
    }
    static fromRational(q) { return new Surd(q, R.ZERO, 1n); }
    static radical(r, d) { // r·√d
      if (d < 2n) return new Surd(R.cast(r), R.ZERO, 1n);
      const { k, m } = squareFreeParts(d);
      if (m === 1n) return new Surd(R.cast(r).mul(k), R.ZERO, 1n);
      return new Surd(R.ZERO, R.cast(r).mul(k), m);
    }
    isRational() { return this.d < 2n || this.r.isZero(); }
    toR() { if (!this.isRational()) throw new Error('No és racional'); return this.q; }
    isZero() { return this.q.isZero() && this.r.isZero(); }
    isNeg() { return this.toNumber() < 0; }
    isPos() { return this.toNumber() > 0; }
    toNumber() { return this.q.toNumber() + this.r.toNumber() * Math.sqrt(Number(this.d)); }
    add(o) {
      if (o instanceof R) o = Surd.fromRational(o);
      const a = this.normForm(), b = o.normForm();
      Surd.checkD(a, b);
      return new Surd(a.q.add(b.q), a.r.add(b.r), a.d === 1n ? b.d : a.d);
    }
    sub(o) { if (o instanceof R) o = Surd.fromRational(o); return this.add(o.neg()); }
    neg() { return new Surd(this.q.neg(), this.r.neg(), this.d); }
    mul(o) {
      if (o instanceof R) o = Surd.fromRational(o);
      const a = this.normForm(), b = o.normForm();
      Surd.checkD(a, b);
      const d = a.d === 1n ? b.d : a.d;
      if (d < 2n) return new Surd(a.q.mul(b.q), R.ZERO, 1n);
      // (q1+r1√d)(q2+r2√d) = (q1q2 + r1r2·d) + (q1r2 + q2r1)√d
      return new Surd(a.q.mul(b.q).add(a.r.mul(b.r).mul(d)), a.q.mul(b.r).add(b.q.mul(a.r)), d);
    }
    div(o) {
      if (o instanceof R) o = Surd.fromRational(o);
      const b = o.normForm();
      if (b.isRational()) {
        const a = this.normForm();
        return new Surd(a.q.div(b.q), a.r.div(b.q), a.d);
      }
      const num = this.mul(o.conj());
      return num.div(o.norm());
    }
    conj() { return new Surd(this.q, this.r.neg(), this.d); }
    norm() { return this.q.mul(this.q).sub(this.r.mul(this.r).mul(this.d)); } // sempre racional
    static checkD(a, b) {
      if (a.d >= 2n && b.d >= 2n && a.d !== b.d)
        throw new Error('Aquí només treballem amb una sola arrel quadrada diferent');
    }
    eq(o) {
      if (o instanceof R) o = Surd.fromRational(o);
      const a = this.normForm(), b = o.normForm();
      return a.q.eq(b.q) && a.r.eq(b.r) && a.d === b.d;
    }
    normForm() {
      if (this.d < 2n || this.r.isZero()) return new Surd(this.q, R.ZERO, 1n);
      return this;
    }
    // comparem numèricament amb tolerància zero (exacte via quadrats si cal)
    approxEq(o, tol) {
      return Math.abs(this.toNumber() - o.toNumber()) <= (tol || 1e-9);
    }
  }

  /* ---------- ±√t amb t irracional (p. ex. t = (5 + √41)/2) ----------
     Apareix a les biquadrades quan l'equació en t té arrels irracionals: x = ±√t
     no és de la forma q + r√d, així que es guarda t i el signe. */
  class NestedRoot {
    constructor(t, sign) { this.t = t; this.sign = sign < 0 ? -1 : 1; }
    toNumber() { return this.sign * Math.sqrt(this.t.toNumber()); }
    neg() { return new NestedRoot(this.t, -this.sign); }
    isRational() { return false; }
    isZero() { return false; }
    isNeg() { return this.sign < 0; }
    isPos() { return this.sign > 0; }
    eq(o) { return o instanceof NestedRoot && o.sign === this.sign && o.t.eq(this.t); }
  }

  /* ---------- √ d'un racional no negatiu ---------- */
  function sqrtRational(x) {
    x = R.cast(x);
    if (x.isNeg()) return null;
    if (x.isZero()) return { exact: R.ZERO };
    // √(n/d) = √(n·d)/d
    const n = x.n * x.d, d = x.d;
    const { k, m } = squareFreeParts(n);
    if (m === 1n) return { exact: new R(k, d) };
    return { surd: Surd.radical(new R(k, d), m) }; // (k/d)·√m
  }

  L.R = R;
  L.Surd = Surd;
  L.NestedRoot = NestedRoot;
  L.sqrtRational = sqrtRational;
  L.isqrtBig = isqrtBig;
  L.squareFreeParts = squareFreeParts;
  L.gcdBig = gcdBig;
})(typeof window !== 'undefined' ? window : globalThis);
