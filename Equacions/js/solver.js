/* ============================================================
   solver.js — resolució i classificació exacta de cada família
   · Equacions polinòmiques (grau ≤ 2): única / tots els reals / cap
   · Inequacions de primer grau (amb sentit i casos degenerats)
   · Equacions de segon grau (Δ, arrels exactes, vèrtex, factorització)
   · Sistemes 2×2 (Cramer exacte + classificació)
   · Biquadrades (canvi de variable t = x² amb admissibilitat)
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const R = L.R, Surd = L.Surd, sqrtRational = L.sqrtRational;

  /* ============ Equació L(x) = R(x) amb grau ≤ 2 ============ */
  function solvePolyPair(LP, RP) {
    const D = LP.sub(RP); // D(x) = L − R
    if (D.isZero()) return { kind: 'all', text: 'Tots els nombres reals són solució (identitat).' };
    if (D.isConst()) return { kind: 'none', text: 'Cap valor de x compleix la igualtat (contradicció).' };
    if (D.deg === 1) {
      const root = D.coef(0).neg().div(D.coef(1));
      return { kind: 'unique', roots: [root], text: 'Una única solució.' };
    }
    if (D.deg === 2) {
      const q = solveQuadratic(D.coef(2), D.coef(1), D.coef(0));
      if (q.kind === 'two' || q.kind === 'double') {
        const roots = q.kind === 'double' ? [q.root] : [q.root1, q.root2];
        return { kind: 'unique', roots, quadratic: true, mult: q.kind === 'double' ? 2 : 1 };
      }
      return { kind: 'none', realOnly: true, text: 'Cap solució real.' };
    }
    return { kind: 'unsupported' };
  }

  /* compara dos conjunts solució (llistes de Surd|R) */
  function sameSolutionSet(a, b) {
    if (a.kind !== b.kind) return false;
    if (a.kind === 'unique') {
      const ka = normRootKeys(a.roots), kb = normRootKeys(b.roots);
      if (ka.length !== kb.length) return false;
      return ka.every(k => kb.includes(k));
    }
    return true;
  }
  function normRootKeys(roots) {
    return roots.map(r => {
      const s = (r instanceof R) ? Surd.fromRational(r) : r.normForm();
      return s.d + '|' + s.q.toString() + '|' + s.r.toString();
    }).sort();
  }

  /* ============ Inequacions: a·x + b  ⋈  c ============ */
  // sign: '<' '>' '<=' '>='
  const SIGN_FLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
  const SIGN_NAME = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' };

  function solveInequality(a, b, sign, c) {
    a = R.cast(a); b = R.cast(b); c = R.cast(c);
    if (a.isZero()) {
      // b ⋈ c, sense x
      const holds = { '<': b.lt(c), '>': b.gt(c), '<=': b.le(c), '>=': b.ge(c) }[sign];
      return holds
        ? { kind: 'all', text: 'La desigualtat és certa per a qualsevol valor de x: tots els reals.' }
        : { kind: 'empty', text: 'La desigualtat no és certa mai: conjunt buit.' };
    }
    const bound = c.sub(b).div(a);
    const flip = a.isNeg(); // en dividir per a negatiu el sentit s'inverteix
    const finalSign = flip ? SIGN_FLIP[sign] : sign;
    return { kind: 'ray', dir: (finalSign === '<' || finalSign === '<=') ? 'left' : 'right', bound, closed: (finalSign === '<=' || finalSign === '>=') };
  }

  /* ============ Segon grau: ax² + bx + c = 0 ============ */
  function solveQuadratic(a, b, c) {
    a = R.cast(a); b = R.cast(b); c = R.cast(c);
    if (a.isZero()) {
      if (b.isZero()) {
        if (c.isZero()) return { kind: 'all', text: '0 = 0: tots els reals.' };
        return { kind: 'none', text: '0 = ' + c + ': cap solució.' };
      }
      return { kind: 'linear', root: c.neg().div(b), a: R.ZERO };
    }
    const delta = b.mul(b).sub(R.cast(4).mul(a).mul(c));
    const twoA = a.mul(2);
    const vx = b.neg().div(twoA);
    const vy = a.mul(vx).mul(vx).add(b.mul(vx)).add(c);
    const base = {
      a, b, c, delta, vertex: { x: vx, y: vy },
      opensUp: a.isPos()
    };
    if (delta.isNeg()) return { ...base, kind: 'none-real', text: 'Δ < 0: cap arrel real.' };
    if (delta.isZero()) return { ...base, kind: 'double', root: vx, mult: 2 };
    const sq = sqrtRational(delta);
    if (sq.exact !== undefined) {
      const r1 = b.neg().sub(sq.exact).div(twoA);
      const r2 = b.neg().add(sq.exact).div(twoA);
      const [lo, hi] = r1.lt(r2) ? [r1, r2] : [r2, r1];
      return { ...base, kind: 'two', root1: lo, root2: hi, rational: true };
    }
    // arrels irracionals exactes: (−b ± k√m)/(2a)
    const k = sq.surd.r, m = sq.surd.d;
    const mkRoot = (s) => new Surd(b.neg().div(twoA), s.mul(k).div(twoA), m);
    const A = mkRoot(R.ONE.neg()), B = mkRoot(R.ONE);
    const [lo, hi] = A.toNumber() <= B.toNumber() ? [A, B] : [B, A];
    return { ...base, kind: 'two', root1: lo, root2: hi, rational: false };
  }

  /* factorització a(x − r1)(x − r2) quan les arrels són racionals */
  function factorQuadratic(q) {
    if (q.kind !== 'two' && q.kind !== 'double') return null;
    if (!q.rational) return null;
    const r1 = q.kind === 'double' ? q.root : q.root1;
    const r2 = q.kind === 'double' ? q.root : q.root2;
    return { a: q.a, r1, r2, double: q.kind === 'double' };
  }

  /* ============ Sistemes: A1x + B1y = C1 ; A2x + B2y = C2 ============ */
  function solveSystem(A1, B1, C1, A2, B2, C2) {
    A1 = R.cast(A1); B1 = R.cast(B1); C1 = R.cast(C1);
    A2 = R.cast(A2); B2 = R.cast(B2); C2 = R.cast(C2);
    const det = A1.mul(B2).sub(A2.mul(B1));
    if (!det.isZero()) {
      const x = C1.mul(B2).sub(C2.mul(B1)).div(det);
      const y = A1.mul(C2).sub(A2.mul(C1)).div(det);
      return { kind: 'unique', x, y };
    }
    // det = 0: coincidents o paral·leles → rang ampliat
    const c1 = A1.mul(C2).sub(A2.mul(C1));
    const c2 = B1.mul(C2).sub(B2.mul(C1));
    if (c1.isZero() && c2.isZero()) return { kind: 'coincident', text: 'Les dues rectes són la mateixa: infinites solucions.' };
    return { kind: 'parallel', text: 'Rectes paral·leles diferents: cap solució.' };
  }

  /* ============ Biquadrades: ax⁴ + bx² + c = 0 ============ */
  function solveBiquadratic(a, b, c) {
    a = R.cast(a); b = R.cast(b); c = R.cast(c);
    if (a.isZero()) {
      return { kind: 'degenerate', text: 'Amb a = 0 l\'equació deixa de ser biquadrada: es converteix en una equació de segon grau (o menys).' };
    }
    const qt = solveQuadratic(a, b, c); // en t
    const out = { a, b, c, tSolutions: [], xRoots: [], degenerateT: false };
    if (qt.kind === 'none-real') {
      out.tSolutions = [];
      out.tText = 'cap solució real per a t';
    } else if (qt.kind === 'all') { // 0 = 0 → qualsevol t (cas a=b=c=0 impossible perquè a≠0)
      out.tSolutions = [];
    } else if (qt.kind === 'linear') { // a=0 no arriba aquí, però bx+c=0 no passa: qt ve de quadràtica amb a≠0
    } else if (qt.kind === 'double') {
      out.tSolutions = [{ val: qt.root, mult: 2 }];
    } else if (qt.kind === 'two') {
      out.tSolutions = [{ val: qt.root1 }, { val: qt.root2 }];
    }
    // classifiquem cada t i recuperem x
    for (const ts of out.tSolutions) {
      if (ts.val.isNeg()) {
        ts.status = 'discarded';
        ts.note = 't < 0: cap x real compleix x² = ' + ts.val;
      } else if (ts.val.isZero()) {
        ts.status = 'zero';
        ts.note = 't = 0: només x = 0';
        out.xRoots.push(Surd.fromRational(R.ZERO));
      } else {
        ts.status = 'ok';
        if (ts.val instanceof Surd && !ts.val.isRational()) {
          ts.sqrt = new L.NestedRoot(ts.val, 1); // t irracional: x = ±√t
        } else {
          const sq = sqrtRational(ts.val instanceof Surd ? ts.val.q : ts.val);
          ts.sqrt = sq.exact !== undefined ? Surd.fromRational(sq.exact) : sq.surd;
        }
        ts.note = 't > 0: dues arrels oposades';
        out.xRoots.push(ts.sqrt.neg());
        out.xRoots.push(ts.sqrt);
      }
    }
    // arrels distintes ordenades
    const seen = new Set(); const distinct = [];
    for (const xr of out.xRoots) {
      const key = xr instanceof L.NestedRoot ? 'N:' + xr.sign + ':' + xr.t.toNumber()
        : xr.eq(Surd.fromRational(R.ZERO)) ? '0' : (xr.isRational() ? 'R:' + xr.q.toString() : 'S:' + xr.d + ':' + xr.q.toString() + ':' + xr.r.toString());
      if (!seen.has(key)) { seen.add(key); distinct.push(xr); }
    }
    distinct.sort((p, q) => p.toNumber() - q.toNumber());
    out.xRootsDistinct = distinct;
    out.count = distinct.length;
    return out;
  }

  L.solvePolyPair = solvePolyPair;
  L.sameSolutionSet = sameSolutionSet;
  L.solveInequality = solveInequality;
  L.SIGN_FLIP = SIGN_FLIP;
  L.SIGN_NAME = SIGN_NAME;
  L.solveQuadratic = solveQuadratic;
  L.factorQuadratic = factorQuadratic;
  L.solveSystem = solveSystem;
  L.solveBiquadratic = solveBiquadratic;
})(typeof window !== 'undefined' ? window : globalThis);
