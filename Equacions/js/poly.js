/* ============================================================
   poly.js — polinomis amb coeficients racional exactes
   coeffs[i] = coeficient de x^i
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const R = L.R;

  class Poly {
    constructor(coeffs) { // coeffs: array de R | number | bigint | string
      this.c = (coeffs || []).map(x => R.cast(x));
      this.trim();
    }
    trim() {
      while (this.c.length && (this.c[this.c.length - 1].isZero())) this.c.pop();
      return this;
    }
    static fromTerms(terms) { // [{deg, coef}]
      const c = [];
      for (const t of terms) c[t.deg] = R.cast(t.coef);
      for (let i = 0; i < c.length; i++) if (!c[i]) c[i] = R.ZERO;
      return new Poly(c);
    }
    static const(k) { return new Poly([R.cast(k)]); }
    static linear(a, b) { return new Poly([R.cast(b), R.cast(a)]); }
    get deg() { return this.c.length - 1; } // -1 si zero
    isZero() { return this.c.length === 0; }
    isConst() { return this.deg <= 0; }
    coef(i) { return this.c[i] || R.ZERO; }
    add(o) {
      const n = Math.max(this.c.length, o.c.length), out = [];
      for (let i = 0; i < n; i++) out.push(this.coef(i).add(o.coef(i)));
      return new Poly(out);
    }
    sub(o) {
      const n = Math.max(this.c.length, o.c.length), out = [];
      for (let i = 0; i < n; i++) out.push(this.coef(i).sub(o.coef(i)));
      return new Poly(out);
    }
    scale(k) { return new Poly(this.c.map(x => x.mul(R.cast(k)))); }
    mul(o) {
      if (this.isZero() || o.isZero()) return new Poly([]);
      const out = new Array(this.c.length + o.c.length - 1).fill(R.ZERO);
      for (let i = 0; i < this.c.length; i++)
        for (let j = 0; j < o.c.length; j++)
          out[i + j] = out[i + j].add(this.c[i].mul(o.c[j]));
      return new Poly(out);
    }
    // divisió exacta per un monomi k·x (només si el terme independent és 0)
    divByMono(k, power) { // divideix per k·x^power
      k = R.cast(k);
      if (k.isZero()) throw new Error('Divisió per zero');
      if (!this.coef(0).isZero() && power > 0) return null;
      if (this.deg < power) return new Poly([]);
      const out = this.c.slice(power).map(x => x.div(k));
      return new Poly(out);
    }
    eval(x) { // x: R | Surd | Number
      if (x instanceof L.Surd && !x.isRational()) {
        // Horner amb aritmètica exacta de radicals (coeficients racionals)
        const S = L.Surd;
        let acc = S.fromRational(R.ZERO);
        for (let i = this.c.length - 1; i >= 0; i--) {
          acc = acc.mul(x).add(S.fromRational(this.c[i]));
        }
        return acc; // pot ser R (dins d'un Surd racional) — vegeu isZero/isNeg
      }
      x = R.cast(x);
      let acc = R.ZERO;
      for (let i = this.c.length - 1; i >= 0; i--) acc = acc.mul(x).add(this.c[i]);
      return acc;
    }
    evalNum(x) { return this.eval(R.num(Math.round(x))).toNumber(); } // per mostres? no: usar toNum
    toFn() { // funció numèrica per dibuixar
      const cs = this.c.map(z => z.toNumber());
      return function (x) {
        let y = 0;
        for (let i = cs.length - 1; i >= 0; i--) y = y * x + cs[i];
        return y;
      };
    }
    eq(o) {
      if (this.deg !== o.deg) return false;
      for (let i = 0; i < this.c.length; i++) if (!this.c[i].eq(o.c[i])) return false;
      return true;
    }
    clone() { return new Poly(this.c.slice()); }
    toString() { return 'Poly(' + this.c.map(x => x.toString()).join(',') + ')'; }
  }

  L.Poly = Poly;
})(typeof window !== 'undefined' ? window : globalThis);
