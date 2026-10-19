/* ============================================================
   fmt.js — format de fórmules com a HTML accessible
   Fraccions verticals, radicals amb vincle, termes clicables,
   notació catalana (−, ·, ≤, ≥, coma decimal)
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const R = L.R, Surd = L.Surd, Poly = L.Poly;
  const MIN = '\u2212'; // −
  const PM = '\u00b1';  // ±

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  const V = (name) => '<i class="var">' + name + '</i>';
  const SUP = (n) => '<sup class="exp">' + n + '</sup>';

  /* ---------- racionals ---------- */
  function fmtR(r, opts) {
    opts = opts || {};
    r = R.cast(r);
    if (r.d === 1n) return (r.isNeg() ? MIN : '') + absBigStr(r.n);
    const neg = r.isNeg();
    const body = fracHTML(absBigStr(r.n), absBigStr(r.d));
    return (neg ? MIN : '') + (opts.wrap && neg ? '(' + body + ')' : body);
  }
  function absBigStr(n) { return String(n < 0n ? -n : n); }
  function fracHTML(num, den) {
    return '<span class="frac"><span class="fnum">' + num + '</span><span class="fden">' + den + '</span></span>';
  }

  /* ---------- radicals: q + r·√d ---------- */
  function fmtSurd(s) {
    s = (s instanceof R) ? Surd.fromRational(s) : s.normForm();
    if (s.isRational()) return fmtR(s.q);
    const d = s.d, q = s.q, r = s.r;
    const radHTML = sqrtHTML(d);
    const den = lcmBig(q.d, r.d);
    if (den === 1n) {
      // q i r sencers: «q ± r√d» (o només una part)
      let out = '';
      if (!q.isZero()) out += fmtR(q);
      if (!r.isZero()) {
        const neg = r.isNeg();
        const coefStr = r.abs().eq(R.ONE) ? '' : fmtR(r.abs());
        out += (out ? ' ' + (neg ? MIN : '+') + ' ' : (neg ? MIN : '')) + coefStr + radHTML;
      }
      return out || '0';
    }
    // denominador comú → fracció amb numerador «q ± r√d»
    const qn = q.n * (den / q.d), rn = r.n * (den / r.d);
    let num;
    if (qn === 0n) {
      const neg = rn < 0n, arn = rn < 0n ? -rn : rn;
      num = (neg ? MIN : '') + (arn === 1n ? '' : String(arn)) + radHTML;
    } else {
      const negq = qn < 0n, aq = negq ? -qn : qn;
      const negr = rn < 0n, arn = negr ? -rn : rn;
      num = (negq ? MIN : '') + String(aq) + ' ' + (negr ? MIN : '+') + ' ' + (arn === 1n ? '' : String(arn)) + radHTML;
    }
    return fracHTML(num, String(den));
  }
  function lcmBig(a, b) { const g = L.gcdBig(a, b) || 1n; return (a / g) * b; }
  // radical amb vincle: el traç (SVG) s'estira amb el radicand i enllaça amb la ratlla superior
  const RAD_SVG = '<svg class="sq-svg" viewBox="0 0 10 24" preserveAspectRatio="none" aria-hidden="true">' +
    '<path d="M0.6 14.2 L2.9 12.8 L5.7 22.6 L9.4 0.8 L10 0.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
  function sqrtHTML(d) {
    return '<span class="sqrt"><span class="sq-sym">√</span>' + RAD_SVG + '<span class="sq-body">' + d + '</span></span>';
  }
  /* cadena d'igualtats alineada: cada «=» en una fila, un sota l'altre
     chain('Δ', ['b² − 4ac', '25 − 24', '1']) */
  function chain(lhs, parts, op) {
    op = op || '=';
    return '<span class="mchain">' + parts.map((p, i) =>
      '<span class="mc-l">' + (i ? '' : lhs) + '</span><span class="mc-op">' + (Array.isArray(op) ? op[i] : op) + '</span><span class="mc-r">' + p + '</span>').join('') + '</span>';
  }

  /* ---------- valors (R | Surd) ---------- */
  function fmtVal(v, opts) {
    opts = opts || {};
    let html;
    if (L.NestedRoot && v instanceof L.NestedRoot) { // ±√t amb t irracional
      html = (v.sign < 0 ? MIN : '') + sqrtHTML(fmtSurd(v.t));
      return opts.approx ? html + ' <span class="approx">≈ ' + fmtNum(v.toNumber(), 3) + '</span>' : html;
    }
    if (v instanceof Surd && !v.isRational()) {
      html = fmtSurd(v);
      if (opts.approx) html += ' <span class="approx">≈ ' + fmtNum(v.toNumber(), 3) + '</span>';
    } else {
      const r = v instanceof Surd ? v.q : v;
      html = fmtR(r, opts);
      if (opts.approx && !r.isInt()) html += ' <span class="approx">≈ ' + fmtNum(r.toNumber(), 3) + '</span>';
    }
    return html;
  }
  function fmtValPlain(v) { // text pla per a aria-labels i SVG
    if (L.NestedRoot && v instanceof L.NestedRoot) return roundSmart(v.toNumber()) + ' (aprox.)';
    if (v instanceof Surd && !v.isRational()) return roundSmart(v.toNumber()) + ' (aprox.)';
    const r = v instanceof Surd ? v.q : R.cast(v);
    const neg = r.isNeg();
    const n = r.n < 0n ? -r.n : r.n;
    return (neg ? MIN : '') + (r.isInt() ? String(n) : n + '/' + r.d);
  }
  // text pla exacte, també amb radicals: «(3 + √5)/2», «−√2», «1 − 2√3» (per a les etiquetes SVG)
  function fmtValExact(v) {
    if (L.NestedRoot && v instanceof L.NestedRoot) return (v.sign < 0 ? MIN : '') + '√(' + fmtValExact(v.t) + ')';
    if (!(v instanceof Surd) || v.isRational()) return fmtValPlain(v);
    const s = v.normForm(), q = s.q, r = s.r;
    const den = lcmBig(q.d, r.d);
    const qn = q.n * (den / q.d), rn = r.n * (den / r.d);
    const ar = rn < 0n ? -rn : rn;
    const rad = (ar === 1n ? '' : String(ar)) + '√' + s.d;
    let num;
    if (qn === 0n) num = (rn < 0n ? MIN : '') + rad;
    else num = (qn < 0n ? MIN : '') + String(qn < 0n ? -qn : qn) + ' ' + (rn < 0n ? MIN : '+') + ' ' + rad;
    if (den === 1n) return num;
    return (qn === 0n ? num : '(' + num + ')') + '/' + den;
  }
  function roundSmart(x) {
    const r = Math.round(x * 1000) / 1000;
    return String(r).replace('-', MIN).replace('.', ',');
  }

  /* ---------- nombre decimal en català ---------- */
  function fmtNum(x, maxDec) {
    maxDec = maxDec === undefined ? 2 : maxDec;
    if (!Number.isFinite(x)) return '—';
    let s;
    if (Math.abs(x) >= 1e6 || (Math.abs(x) < 1e-4 && x !== 0)) s = x.toExponential(2);
    else s = String(Math.round(x * Math.pow(10, maxDec)) / Math.pow(10, maxDec));
    return s.replace('-', MIN).replace('.', ',');
  }

  /* ---------- termes i polinomis ---------- */
  // terme com a text HTML; first indica si és el primer (sense signe + inicial)
  function termHTML(coef, deg, vname, first, opts) {
    opts = opts || {};
    const c = R.cast(coef);
    if (c.isZero()) return '';
    const neg = c.isNeg();
    const ac = c.abs();
    let coefStr;
    if (deg === 0) coefStr = fmtR(ac);
    else if (ac.eq(R.ONE)) coefStr = '';
    else coefStr = fmtR(ac);
    let varStr = '';
    if (deg === 1) varStr = V(vname);
    else if (deg >= 2) varStr = V(vname) + SUP(deg);
    const core = (coefStr && varStr) ? coefStr + varStr : (coefStr || varStr);
    let signStr = '';
    if (!first) signStr = neg ? ' ' + MIN + ' ' : ' + ';
    else if (neg) signStr = MIN;
    if (opts.chip) {
      const signHTML = first
        ? (neg ? '<span class="t-sign">' + MIN + '</span>' : '')
        : '<span class="t-sign">' + (neg ? MIN : '+') + '</span>';
      return '<button type="button" class="term' + (opts.cls ? ' ' + opts.cls : '') + '"' +
        ' data-deg="' + deg + '" data-coef="' + c.toString() + '"' +
        (opts.side ? ' data-side="' + opts.side + '"' : '') +
        (opts.aria ? ' aria-label="' + esc(opts.aria) + '"' : '') +
        '><span class="t-core">' + signHTML + core + '</span></button>';
    }
    return '<span class="mterm">' + signStr + core + '</span>';
  }

  function fmtPoly(p, vname, opts) {
    opts = opts || {};
    vname = vname || 'x';
    p = Poly.cast(p);
    if (p.isZero()) return '0';
    let out = '', first = true;
    for (let d = p.deg; d >= 0; d--) {
      const c = p.coef(d);
      if (c.isZero()) continue;
      out += termHTML(c, d, vname, first, opts);
      first = false;
    }
    return out || '0';
  }
  function fmtPolyPlain(p, vname) {
    vname = vname || 'x';
    p = Poly.cast(p);
    if (p.isZero()) return '0';
    let out = '';
    let first = true;
    for (let d = p.deg; d >= 0; d--) {
      const c = p.coef(d);
      if (c.isZero()) continue;
      const neg = c.isNeg(), ac = c.abs();
      let coefStr = (d === 0) ? ac.toString() : (ac.eq(R.ONE) ? '' : ac.toString());
      let varStr = d === 0 ? '' : vname + (d >= 2 ? '^' + d : '');
      out += (first ? (neg ? MIN : '') : (neg ? ' ' + MIN + ' ' : ' + ')) + coefStr + varStr;
      first = false;
    }
    return out || '0';
  }

  /* ---------- equació L = R amb termes clicables ---------- */
  function fmtEquationChips(LP, RP, opts) {
    opts = opts || {};
    const vl = opts.vname || 'x';
    function side(p, sideName, colorCls) {
      if (p.isZero()) return '<span class="eq-side ' + colorCls + '"><button type="button" class="term" data-deg="0" data-coef="0" data-side="' + sideName + '"><span class="t-core">0</span></button></span>';
      let out = '<span class="eq-side ' + colorCls + '">';
      let first = true;
      for (let d = p.deg; d >= 0; d--) {
        const c = p.coef(d);
        if (c.isZero()) continue;
        out += termHTML(c, d, vl, first, { chip: true, side: sideName, aria: opts.ariaFn ? opts.ariaFn(c, d, sideName) : '' });
        first = false;
      }
      return out + '</span>';
    }
    const sign = '<span class="eq-sign' + (opts.cmp ? ' cmp' : '') + '">' + (opts.cmp || '=') + '</span>';
    return side(LP, 'L', 'member-l') + sign + side(RP, 'R', 'member-r');
  }

  /* ---------- inequació ---------- */
  function fmtIneq(a, b, sign, c, opts) {
    opts = opts || {};
    const s = L.SIGN_NAME[sign] || sign;
    return fmtPoly(Poly.linear(a, b), 'x', opts) + '<span class="eq-sign cmp" style="margin:0 6px">' + s + '</span>' + fmtR(c);
  }

  /* ---------- interval ---------- */
  function fmtIntervalIneq(sol) {
    if (sol.kind === 'all') return { ineq: 'qualsevol valor de <i>x</i>', interval: '(−∞, +∞) = ℝ', note: 'tots els reals' };
    if (sol.kind === 'empty') return { ineq: 'cap valor', interval: '∅', note: 'conjunt buit' };
    const b = sol.bound;
    const fb = fmtVal(b);
    const ineq = 'x ' + (sol.dir === 'left' ? (sol.closed ? '≤' : '<') : (sol.closed ? '≥' : '>')) + ' ' + fb;
    const interval = sol.dir === 'left'
      ? '(−∞, ' + fb + (sol.closed ? ']' : ')')
      : (sol.closed ? '[' : '(') + fb + ', +∞)';
    const note = sol.dir === 'left'
      ? 'tot el que és a l\'esquerra de ' + fb
      : 'tot el que és a la dreta de ' + fb;
    return { ineq, interval, note };
  }

  /* ---------- sistema ---------- */
  function fmtSystemLine(A, B, C, tag) {
    A = R.cast(A); B = R.cast(B); C = R.cast(C);
    // Ax + By = C (mostra amb signes nets)
    let out = '';
    let first = true;
    if (!A.isZero()) { out += termHTML(A, 1, 'x', first); first = false; }
    if (!B.isZero()) { out += termHTML(B, 1, 'y', first); first = false; }
    if (first) out += '0';
    out += ' = ' + fmtR(C);
    return out;
  }
  function fmtSystemLinePlain(A, B, C) { // versió text pla (aria-labels)
    A = R.cast(A); B = R.cast(B); C = R.cast(C);
    let out = '', first = true;
    if (!A.isZero()) {
      const neg = A.isNeg(), ac = A.abs();
      out += (neg ? '\u2212' : '') + (ac.eq(R.ONE) ? '' : ac.toString()) + 'x';
      first = false;
    }
    if (!B.isZero()) {
      const neg = B.isNeg(), ac = B.abs();
      out += (first ? (neg ? '\u2212' : '') : (neg ? ' \u2212 ' : ' + ')) + (ac.eq(R.ONE) ? '' : ac.toString()) + 'y';
      first = false;
    }
    if (first) out = '0';
    return out + ' = ' + R.cast(C).toString().replace('-', '\u2212');
  }

  /* ---------- factorització: a(x − r₁)(x − r₂) ---------- */
  function fmtFactorized(f) {
    const a = f.a;
    let out = '';
    if (!a.eq(R.ONE)) out += a.isInt() ? fmtR(a) : fmtR(a);
    const lin = (r) => {
      if (r.isZero()) return V('x');
      const neg = r.isNeg(), ac = r.abs();
      return '(' + V('x') + ' ' + (neg ? '+' : MIN) + ' ' + fmtR(ac) + ')';
    };
    if (f.double) return out + lin(f.r1) + SUP(2);
    return out + lin(f.r1) + lin(f.r2);
  }

  /* ---------- substitució: p amb x = val ---------- */
  function fmtSubstitution(p, val, opts) {
    opts = opts || {};
    const v = (val instanceof Surd) ? val : R.cast(val);
    p = Poly.cast(p);
    const fv = fmtVal(v);
    const pval = v.isNeg() ? '(' + fv + ')' : fv;
    let out = '';
    let first = true;
    for (let d = p.deg; d >= 0; d--) {
      const c = p.coef(d);
      if (c.isZero()) continue;
      const neg = c.isNeg();
      const ac = c.abs();
      let core;
      if (d === 0) core = fmtR(ac);
      else {
        const coefStr = ac.eq(R.ONE) ? '' : fmtR(ac) + '·';
        core = coefStr + pval + (d >= 2 ? SUP(d) : '');
      }
      out += (first ? (neg ? MIN : '') : (neg ? ' ' + MIN + ' ' : ' + ')) + core;
      first = false;
    }
    if (!out) out = '0';
    return out;
  }

  /* ---------- miscel·lània ---------- */
  function fmtPar(v) { // negatiu entre parèntesis
    const r = v instanceof Surd ? (v.isRational() ? v.q : v) : R.cast(v);
    if (r instanceof R && r.isNeg()) return '(' + fmtR(r) + ')';
    return fmtVal(v);
  }
  function fmtPoint(x, y) { return '(' + fmtVal(x) + ', ' + fmtVal(y) + ')'; }

  /* ---------- etiquetes SVG amb tipografia d'editorial ----------
     «x = −1/3» → x en cursiva i 1/3 com a fracció vertical (1 a dalt, 3 a baix).
     També «(3 + √5)/2». Retorna { g, place(x, y) }: (x, y) és el centre a l'altura de la línia de base. */
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(name, attrs, parent) {
    const e = document.createElementNS(SVGNS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const FRAC_RE = /(\([^()]+\)|\d+(?:,\d+)?)\/(\d+)/;
  const SVAR_RE = /(^|[^A-Za-zÀ-ÿ])([xyt])(?![A-Za-zÀ-ÿ₀-₉])/;
  function svgRich(parent, label, opts) {
    opts = opts || {};
    const size = opts.size || 12.5;
    const base = {
      'font-family': opts.family || 'Georgia,"Times New Roman",serif', 'font-weight': opts.weight || 700,
      fill: opts.fill || '#152738'
    };
    const g = svgEl('g', null, parent);
    let x = 0;
    // text amb les incògnites en cursiva
    const textRun = (str, fs, px, py, anchor) => {
      const t = svgEl('text', Object.assign({ x: px, y: py, 'font-size': fs, 'text-anchor': anchor || 'start', style: 'white-space:pre' }, base), g);
      let rest = str, mt;
      while ((mt = SVAR_RE.exec(rest))) {
        if (mt.index + mt[1].length) svgEl('tspan', null, t).textContent = rest.slice(0, mt.index) + mt[1];
        svgEl('tspan', { 'font-style': 'italic' }, t).textContent = mt[2];
        rest = rest.slice(mt.index + mt[0].length);
      }
      if (rest) svgEl('tspan', null, t).textContent = rest;
      return t;
    };
    let rest = String(label), mt;
    const pieces = [];
    while ((mt = FRAC_RE.exec(rest))) {
      if (mt.index) pieces.push({ text: rest.slice(0, mt.index) });
      pieces.push({ num: mt[1].replace(/^\((.*)\)$/, '$1'), den: mt[2] });
      rest = rest.slice(mt.index + mt[0].length);
    }
    if (rest) pieces.push({ text: rest });
    const fs = size * 0.9, axis = -size * 0.3;
    for (const p of pieces) {
      if (p.text !== undefined) {
        const t = textRun(p.text, size, x, 0);
        x += t.getComputedTextLength();
      } else {
        const tn = textRun(p.num, fs, 0, axis - fs * 0.24, 'middle');
        const td = textRun(p.den, fs, 0, axis + fs * 0.9, 'middle');
        const w = Math.max(tn.getComputedTextLength(), td.getComputedTextLength()) + 4;
        const cx = x + 1.5 + w / 2;
        tn.setAttribute('x', cx); td.setAttribute('x', cx);
        svgEl('line', { x1: x + 1.5, x2: x + 1.5 + w, y1: axis, y2: axis, stroke: base.fill, 'stroke-width': 1.2 }, g);
        x += w + 3;
      }
    }
    // vincle de les arrels: ratlla sobre les xifres que segueixen «√»
    g.querySelectorAll('text').forEach(t => {
      const str = t.textContent;
      for (let i = str.indexOf('√'); i >= 0; i = str.indexOf('√', i + 1)) {
        let j = i + 1;
        while (j < str.length && /\d/.test(str[j])) j++;
        if (j === i + 1) continue;
        try {
          const s = t.getExtentOfChar(i), b = t.getExtentOfChar(j - 1);
          const yTop = s.y + s.height * 0.12;
          svgEl('line', { x1: s.x + s.width * 0.82, x2: b.x + b.width + 0.5, y1: yTop, y2: yTop, stroke: base.fill, 'stroke-width': 1.1 }, g);
        } catch (e) { }
      }
    });
    const width = x;
    return {
      g, width,
      place(cx, y) { g.setAttribute('transform', 'translate(' + (opts.anchor === 'start' ? cx : cx - width / 2) + ',' + y + ')'); }
    };
  }

  L.fmt = {
    svgRich,
    esc, MIN, PM, V, SUP,
    fmtR, fmtSurd, fmtVal, fmtValPlain, fmtValExact, fmtNum, roundSmart,
    termHTML, fmtPoly, fmtPolyPlain, fmtEquationChips, fmtIneq,
    fmtIntervalIneq, fmtSystemLine, fmtSystemLinePlain, fmtFactorized, fmtSubstitution,
    fmtPar, fmtPoint, fracHTML, sqrtHTML, chain

  };
})(typeof window !== 'undefined' ? window : globalThis);
