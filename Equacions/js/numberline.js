/* ============================================================
   numberline.js — recta numèrica interactiva i balança
   · NumberLine: solucions d'inequacions (raigs, extrems oberts/
     tancats), sondes de valors, marcador d'x arrossegable
   · Balance: balança que s'inclina segons els dos membres (M0)
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const { el, niceStep, fmtTick } = L.GraphUtil;
  const MINUS = '\u2212';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class NumberLine {
    constructor(host, opts) {
      opts = opts || {};
      this.host = host;
      this.h = opts.height || 120;
      this.onProbe = opts.onProbe || null;
      this.onChange = opts.onChange || null; // arrossegament del marcador
      this.snap = opts.snap === undefined ? 1 : opts.snap;
      this.range = { min: -10, max: 10, step: 2 };
      this.solution = null;
      this.marker = null;   // {x, color, label}
      this.probe = null;    // {x, ok}
      this.points = [];     // punts addicionals {x, color, label, kind}
      this.band = null;     // {x0,x1,color} per a «tots els reals»
      this.readonly = !!opts.readonly;
      // marges laterals: es poden igualar als del gràfic perquè les dues vistes quedin alineades
      this.padL = opts.padL === undefined ? 14 : opts.padL;
      this.padR = opts.padR === undefined ? 14 : opts.padR;

      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      this.svg = el('svg', { role: 'img' });
      this.svg.setAttribute('aria-label', 'Recta numèrica');
      host.appendChild(this.svg);
      this.svg.style.cursor = this.readonly ? 'default' : 'pointer';

      if (!this.readonly) {
        this.svg.addEventListener('click', (e) => {
          const x = this.pxToX(e.offsetX);
          if (this.onProbe) this.onProbe(this.snapTo(x));
        });
        // arrossegament del marcador
        let dragging = false;
        this.svg.addEventListener('pointerdown', (e) => {
          if (this.marker && Math.abs(e.offsetX - this.xToPx(this.marker.x)) < 26 && this.onChange) {
            dragging = true; this.svg.setPointerCapture(e.pointerId);
          }
        });
        this.svg.addEventListener('pointermove', (e) => {
          if (dragging) { this.onChange(this.snapTo(this.pxToX(e.offsetX), true)); e.preventDefault(); }
        });
        const up = () => { dragging = false; };
        this.svg.addEventListener('pointerup', up);
        this.svg.addEventListener('pointercancel', up);
      }
      this.ro = new ResizeObserver(() => this.render());
      this.ro.observe(host);
    }
    snapTo(x, fine) {
      const s = fine ? this.snap : Math.max(this.snap / 2, 0.5);
      return Math.round(x / s) * s;
    }
    setRange(min, max, step) {
      this.range = { min, max, step: step || niceStep(max - min, 9) };
      return this;
    }
    autoRange(points, pad) {
      pad = pad === undefined ? 3 : pad;
      let lo = Infinity, hi = -Infinity;
      for (const p of points) { if (Number.isFinite(p)) { lo = Math.min(lo, p); hi = Math.max(hi, p); } }
      if (!Number.isFinite(lo)) { lo = -10; hi = 10; }
      lo -= pad; hi += pad;
      if (hi - lo < 8) { const c = (hi + lo) / 2; lo = c - 4; hi = c + 4; }
      return this.setRange(lo, hi);
    }
    setSolution(sol) { this.solution = sol; return this; }
    setMarker(m) { this.marker = m; return this; }
    setProbe(p) { this.probe = p; return this; }
    setPoints(pts) { this.points = pts || []; return this; }
    setAriaLabel(t) { this.svg.setAttribute('aria-label', t); }

    lineY() { return this.h * 0.52; }
    xToPx(x) {
      const w = this.host.clientWidth || 320;
      return this.padL + (x - this.range.min) / (this.range.max - this.range.min) * (w - this.padL - this.padR);
    }
    pxToX(px) {
      const w = this.host.clientWidth || 320;
      return this.range.min + (px - this.padL) / (w - this.padL - this.padR) * (this.range.max - this.range.min);
    }

    render() {
      const w = this.host.clientWidth || 320;
      this.svg.setAttribute('width', w);
      this.svg.setAttribute('height', this.h);
      this.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + this.h);
      while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
      const y = this.lineY(), m = this.padL, iw = w - this.padL - this.padR;
      const { min, max, step } = this.range;

      // franja de solució (darrere de tot)
      if (this.solution) {
        const sol = this.solution;
        const amber = '#ef9f17';
        if (sol.kind === 'ray') {
          const bx = this.xToPx(sol.bound.toNumber());
          const x0 = sol.dir === 'left' ? m : bx, x1 = sol.dir === 'left' ? bx : m + iw;
          el('rect', { x: x0, y: y - 5, width: Math.max(0, x1 - x0), height: 10, rx: 5, fill: amber, 'fill-opacity': .75 }, this.svg);
          el('circle', { cx: bx, cy: y, r: 8, fill: sol.closed ? amber : '#fff', stroke: amber, 'stroke-width': 3 }, this.svg);
          // etiqueta del valor frontera
          L.fmt.svgRich(this.svg, sol.boundStr, { size: 13.5, fill: '#8a5200' }).place(bx, y - 24);
          const t2 = el('text', { x: bx, y: y - 46, 'font-size': 10, fill: '#8a5200', 'text-anchor': 'middle', 'font-weight': 600 }, this.svg);
          t2.textContent = sol.closed ? 'extrem tancat (inclòs)' : 'extrem obert (exclòs)';
        } else if (sol.kind === 'all') {
          el('rect', { x: m, y: y - 5, width: iw, height: 10, rx: 5, fill: amber, 'fill-opacity': .75 }, this.svg);
          el('circle', { cx: m, cy: y, r: 8, fill: '#fff', stroke: amber, 'stroke-width': 3 }, this.svg);
          el('circle', { cx: m + iw, cy: y, r: 8, fill: '#fff', stroke: amber, 'stroke-width': 3 }, this.svg);
        }
      }
      if (this.band) {
        const bx0 = this.xToPx(this.band.x0), bx1 = this.xToPx(this.band.x1);
        el('rect', { x: bx0, y: y - 5, width: Math.max(0, bx1 - bx0), height: 10, rx: 5, fill: this.band.color, 'fill-opacity': .55 }, this.svg);
      }

      // recta
      el('line', { x1: m - 6, y1: y, x2: m + iw + 6, y2: y, stroke: '#43536a', 'stroke-width': 2.2 }, this.svg);
      el('path', { d: 'M0,0 L-8,-4 L-8,4 Z', fill: '#43536a', transform: 'translate(' + (m + iw + 8) + ',' + y + ')' }, this.svg);

      // marques i etiquetes
      for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
        const px = this.xToPx(v);
        el('line', { x1: px, y1: y - 6, x2: px, y2: y + 6, stroke: '#43536a', 'stroke-width': 1.6 }, this.svg);
        const t = el('text', { x: px, y: y + 24, 'font-size': 11.5, fill: '#5f7186', 'text-anchor': 'middle' }, this.svg);
        t.textContent = fmtTick(v, step);
      }
      // marques menors
      const minor = step / 2;
      if (minor / (max - min) * iw > 13) {
        for (let v = Math.ceil(min / minor) * minor; v <= max + 1e-9; v += minor) {
          if (Math.abs(v / step - Math.round(v / step)) < 1e-9) continue;
          el('line', { x1: this.xToPx(v), y1: y - 3.5, x2: this.xToPx(v), y2: y + 3.5, stroke: '#8a97a8', 'stroke-width': 1 }, this.svg);
        }
      }

      // punts addicionals (per comprovar valors)
      for (const p of this.points) {
        const px = this.xToPx(p.x);
        const col = p.ok ? '#0d9463' : '#c22f2f';
        el('circle', { cx: px, cy: y, r: 7, fill: p.ok ? col : '#fff', stroke: col, 'stroke-width': 2.6 }, this.svg);
        if (p.label) {
          L.fmt.svgRich(this.svg, p.label, { size: 11.5, fill: col }).place(px, y - 17);
        }
      }

      // sonda
      if (this.probe) {
        const px = this.xToPx(this.probe.x);
        const ok = this.probe.ok;
        const col = ok ? '#0d9463' : '#c22f2f';
        const g = el('g', null, this.svg);
        el('circle', { cx: px, cy: y - 26, r: 8, fill: ok ? col : '#fff', stroke: col, 'stroke-width': 2.6 }, g);
        const mark = el('path', { d: ok ? 'M-3.5,0 L-1,2.8 L3.5,-2.8' : 'M-3,-3 L3,3 M3,-3 L-3,3', stroke: '#fff', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', transform: 'translate(' + px + ',' + (y - 26) + ')' }, g);
        if (!ok) mark.setAttribute('stroke', col);
        el('line', { x1: px, y1: y - 17, x2: px, y2: y - 6, stroke: col, 'stroke-width': 1.6, 'stroke-dasharray': '3 3' }, g);
      }

      // marcador principal (l'x de M0)
      if (this.marker) {
        const px = this.xToPx(this.marker.x);
        const col = this.marker.color || '#1d5fd6';
        const g = el('g', null, this.svg);
        if (this.marker.halo) el('circle', { cx: px, cy: y, r: 16, fill: col, 'fill-opacity': .18 }, g);
        const c = el('circle', { cx: px, cy: y, r: 9, fill: col, stroke: '#fff', 'stroke-width': 2.6 }, g);
        c.style.filter = 'drop-shadow(0 1px 2px rgba(18,42,66,.3))';
        if (this.marker.label) L.fmt.svgRich(g, this.marker.label, { size: 13, fill: col }).place(px, y - 20);
        if (this.onChange) {
          const grip = el('circle', { cx: px, cy: y, r: 20, fill: 'transparent', style: 'cursor:grab' }, g);
        }
      }
    }
    destroy() { try { this.ro.disconnect(); } catch (e) { } this.svg.remove(); }
  }

  /* ============ Balança (M0) ============ */
  class Balance {
    constructor(host) {
      this.host = host;
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      this.svg = el('svg', { role: 'img' });
      this.svg.setAttribute('aria-label', 'Balança dels dos membres de l\'equació');
      host.appendChild(this.svg);
      this.L = { expr: '', val: 0 }; this.R = { expr: '', val: 0 };
      this.ro = new ResizeObserver(() => this.render());
      this.ro.observe(host);
    }
    // lStr / rStr: valor exacte per mostrar (p. ex. «−1/3»); lVal / rVal: nombre per inclinar la balança
    setSides(lExpr, lVal, rExpr, rVal, lStr, rStr) {
      this.L = { expr: lExpr, val: lVal, str: lStr }; this.R = { expr: rExpr, val: rVal, str: rStr };
      this.render();
    }
    // anima l'angle del braç des de la posició anterior fins a la nova, amb una petita oscil·lació
    render() {
      const diff = this.L.val - this.R.val;
      const eq = Math.abs(diff) < 1e-9;
      // angle SVG positiu = sentit horari (baixa el plat dret): si pesa més l'esquerre, angle negatiu
      const target = eq ? 0 : clamp(-10 * Math.tanh(diff / 18), -11, 11);
      const from = this.angle === undefined ? target : this.angle;
      cancelAnimationFrame(this._raf);
      if (reduceMotion() || Math.abs(target - from) < 0.05) { this.angle = target; this._draw(target); return; }
      const t0 = performance.now(), dur = 650;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        // molla amortida: arriba, es passa una mica i torna
        const k = 1 - Math.cos(t * Math.PI * 1.5) * Math.exp(-5 * t);
        this.angle = from + (target - from) * (t >= 1 ? 1 : k);
        this._draw(this.angle);
        if (t < 1) this._raf = requestAnimationFrame(step);
      };
      this._raf = requestAnimationFrame(step);
    }
    _draw(angle) {
      // mida lògica fixa d'alçada i amplada proporcional al panell: l'SVG s'amplia per omplir-lo
      const hw = this.host.clientWidth || 300, hh = this.host.clientHeight || 250;
      const h = 250;
      const w = clamp(h * hw / Math.max(1, hh), 300, 620);
      this.svg.setAttribute('width', '100%');
      this.svg.setAttribute('height', '100%'); // s'escala i es centra dins de l'alçada disponible
      this.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
      const cx = w / 2, pivotY = 54, armLen = Math.min(120, w / 2 - 46);
      const diff = this.L.val - this.R.val;
      const eq = Math.abs(diff) < 1e-9;

      // suport
      el('rect', { x: cx - 30, y: h - 26, width: 60, height: 10, rx: 5, fill: '#123c5e' }, this.svg);
      el('path', { d: 'M' + (cx - 5) + ',' + (h - 26) + ' L' + (cx + 5) + ',' + (h - 26) + ' L' + (cx + 2) + ',' + (pivotY + 6) + ' L' + (cx - 2) + ',' + (pivotY + 6) + ' Z', fill: '#123c5e' }, this.svg);
      if (eq) el('circle', { cx, cy: pivotY, r: 26, fill: '#ef9f17', 'fill-opacity': .25 }, this.svg);
      el('circle', { cx, cy: pivotY, r: 8, fill: eq ? '#ef9f17' : '#123c5e', stroke: '#fff', 'stroke-width': 2.5 }, this.svg);

      const g = el('g', { transform: 'rotate(' + angle + ' ' + cx + ' ' + pivotY + ')' }, this.svg);
      // (l'animació la fa render() fotograma a fotograma)
      // braç
      el('rect', { x: cx - armLen, y: pivotY - 4, width: armLen * 2, height: 8, rx: 4, fill: '#0e3a5c' }, g);
      // plats (penjarien; simplifiquem amb contrarotació)
      const drawPan = (px, col, expr, val, isEq) => {
        const gg = el('g', { transform: 'rotate(' + (-angle) + ' ' + px + ' ' + (pivotY) + ')' }, g);
        el('line', { x1: px, y1: pivotY, x2: px, y2: pivotY + 30, stroke: '#57708c', 'stroke-width': 1.6 }, gg);
        // plat
        el('path', { d: 'M' + (px - 52) + ',' + (pivotY + 30) + ' A 52 14 0 0 0 ' + (px + 52) + ',' + (pivotY + 30), fill: '#e8eef6', stroke: '#8fa5bd', 'stroke-width': 1.5 }, gg);
        // xip amb expressió i valor
        const bg = el('g', null, gg);
        L.fmt.svgRich(bg, expr, { size: 14, fill: col }).place(px, pivotY + 60);
        L.fmt.svgRich(bg, typeof val === 'number' ? L.fmt.fmtNum(val, 2) : String(val), { size: 21, fill: '#152738' }).place(px, pivotY + 90);
        const bb = bg.getBBox();
        const r = el('rect', { x: bb.x - 12, y: bb.y - 6, width: bb.width + 24, height: bb.height + 12, rx: 10, fill: '#fff', stroke: '#c9d4e0', 'stroke-width': 1.4 }, bg);
        bg.insertBefore(r, bg.firstChild);
      };
      drawPan(cx - armLen, '#14418f', this.L.expr, this.L.str || this.L.val);
      drawPan(cx + armLen, '#0a6e4a', this.R.expr, this.R.str || this.R.val);

      // lectura superior
      const t3 = el('text', { x: cx, y: 22, 'font-size': 15, 'font-weight': 800, 'text-anchor': 'middle', 'font-family': 'Georgia,serif' }, this.svg);
      t3.textContent = eq ? 'Equilibri: els dos membres valen el mateix'
        : 'Pesa més el membre ' + (diff > 0 ? 'esquerre' : 'dret') + ': el seu plat baixa';
      t3.setAttribute('fill', eq ? '#0a6e4a' : '#46596c');
    }
    destroy() { cancelAnimationFrame(this._raf); try { this.ro.disconnect(); } catch (e) { } this.svg.remove(); }
  }

  L.NumberLine = NumberLine;
  L.Balance = Balance;
})(typeof window !== 'undefined' ? window : globalThis);
