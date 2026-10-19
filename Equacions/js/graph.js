/* ============================================================
   graph.js — motor de gràfics SVG per a funcions y = f(x)
   · eixos i graella amb esglaons «bonys» (1-2-5) i etiquetes clamped
   · corbes amb mostreig adaptatiu, retallades a l'àrea de dibuix
   · marcadors de punts amb guies als eixos i etiquetes amb xip
   · interacció: arrossega (pan), roda/pessic (zoom), botons, restableix
   · crosshair amb lectura de valors de les corbes
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const MINUS = '\u2212';

  function el(name, attrs, parent) {
    const e = document.createElementNS(SVG_NS, name);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function niceStep(range, targetCount) {
    const raw = range / Math.max(1, targetCount);
    if (!Number.isFinite(raw) || raw <= 0) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    let s;
    if (norm < 1.5) s = 1; else if (norm < 3.5) s = 2; else if (norm < 7.5) s = 5; else s = 10;
    return s * mag;
  }
  function fmtTick(v, step) {
    if (Math.abs(v) < step * 1e-6) return '0';
    const dec = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
    let s = v.toFixed(Math.min(6, dec));
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('-', MINUS).replace('.', ',');
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* retalla la recta implícita A·x + B·y = C a la finestra de vista */
  function clipImplicitLine(A, B, C, x0, x1, y0, y1) {
    const pts = [];
    const push = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      if (x < x0 - 1e-9 || x > x1 + 1e-9 || y < y0 - 1e-9 || y > y1 + 1e-9) return;
      if (!pts.some(p => Math.abs(p.x - x) < 1e-9 && Math.abs(p.y - y) < 1e-9)) pts.push({ x, y });
    };
    if (Math.abs(B) > 1e-12) { push(x0, (C - A * x0) / B); push(x1, (C - A * x1) / B); }
    if (Math.abs(A) > 1e-12) { push((C - B * y0) / A, y0); push((C - B * y1) / A, y1); }
    return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null;
  }

  class Graph {
    constructor(host, opts) {
      opts = opts || {};
      this.host = host;
      this.mini = !!opts.mini;
      this.pad = opts.pad || (this.mini
        ? { l: 30, r: 8, t: 8, b: 20 }
        : { l: 46, r: 16, t: 14, b: 30 });
      this.view = { x0: -10, x1: 10, y0: -10, y1: 10 };
      this.userView = false;
      this.curves = [];
      this.marks = [];
      this.bands = [];
      this.vguides = [];
      this.readoutCfg = null;
      this.onHoverCb = opts.onHover || null;
      this.onRenderCb = opts.onRender || null; // avís «fora de vista» en pan/zoom
      this.fitPadding = opts.fitPadding === undefined ? 0.28 : opts.fitPadding;
      this.ariaLabel = '';
      this._destroyed = false;

      host.classList.add('graph-host-root');
      // no trepitgem el posicionament del CSS (.viz-body .graph-host és absolut i omple tota l'alçada)
      if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.style.overflow = 'hidden';
      host.style.touchAction = 'none'; // el pan/zoom el gestionem nosaltres

      this.svg = el('svg', { class: 'graph-svg' });
      this.svg.setAttribute('role', 'img');
      host.appendChild(this.svg);

      this.defs = el('defs', null, this.svg);
      this.clip = el('clipPath', { id: 'clip' + Math.random().toString(36).slice(2, 8) }, this.defs);
      this.clipRect = el('rect', null, this.clip);

      this.gGrid = el('g', null, this.svg);
      this.gPlot = el('g', { 'clip-path': 'url(#' + this.clip.getAttribute('id') + ')' }, this.svg);
      this.gMarks = el('g', null, this.svg);
      this.gHover = el('g', { 'pointer-events': 'none' }, this.svg);

      this.hoverLine = el('line', { stroke: '#94a3b8', 'stroke-width': 1, 'stroke-dasharray': '4 4' }, this.gHover);
      this.hoverDots = null;

      if (!this.mini) {
        this.readoutEl = document.createElement('div');
        this.readoutEl.className = 'graph-readout';
        this.readoutEl.style.display = 'none';
        host.appendChild(this.readoutEl);

        const tools = document.createElement('div');
        tools.className = 'graph-tools';
        tools.innerHTML =
          '<button class="gt-btn" data-act="zin" aria-label="Amplia el gràfic" title="Amplia"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>' +
          '<button class="gt-btn" data-act="zout" aria-label="Redueix el gràfic" title="Redueix"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>' +
          '<button class="gt-btn" data-act="reset" aria-label="Restableix la vista" title="Restableix la vista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></button>';
        this.toolsEl = tools;
        host.appendChild(tools);
        tools.addEventListener('click', (e) => {
          const b = e.target.closest('button'); if (!b) return;
          if (b.dataset.act === 'zin') this.zoomAt(this.w / 2, this.h / 2, 0.8);
          else if (b.dataset.act === 'zout') this.zoomAt(this.w / 2, this.h / 2, 1.25);
          else { this.userView = false; this.autoFit(this._lastFeatures || null); }
        });

        this._bindPointer();
        this.svg.addEventListener('wheel', (e) => {
          e.preventDefault();
          const f = Math.pow(1.0015, e.deltaY);
          this.zoomAt(e.offsetX, e.offsetY, f);
        }, { passive: false });
      }

      this.ro = new ResizeObserver(() => { if (!this._destroyed) this.render(); });
      this.ro.observe(host);
      this.w = host.clientWidth || 300;
      this.h = host.clientHeight || 200;
    }

    /* ---------- configuració ---------- */
    setView(x0, x1, y0, y1) {
      if (!(x1 > x0)) { x0 = -10; x1 = 10; }
      if (!(y1 > y0)) { y0 = -10; y1 = 10; }
      this.view = { x0, x1, y0, y1 };
      this.render();
      return this;
    }
    clearData() {
      this.curves = []; this.marks = []; this.bands = []; this.vguides = []; this.readoutCfg = null;
      return this;
    }
    addCurve(fn, style) {
      style = style || {};
      const c = {
        fn, color: style.color || '#1d5fd6', width: style.width || (this.mini ? 2 : 4.5),
        dash: style.dash || null, opacity: style.opacity === undefined ? 1 : style.opacity,
        label: style.label || null, labelColor: style.color
      };
      this.curves.push(c);
      return c;
    }
    addImplicitLine(A, B, C, style) { // recta A·x + B·y = C (admet verticals i horitzontals)
      style = style || {};
      this.curves.push({
        line: { A: +A, B: +B, C: +C },
        color: style.color || '#1d5fd6', width: style.width || (this.mini ? 2 : 4.5),
        dash: style.dash || null, opacity: style.opacity === undefined ? 1 : style.opacity,
        label: style.label || null
      });
      return this;
    }
    addMark(x, y, style) {
      style = style || {};
      const m = {
        x, y, color: style.color || '#e8960c', r: style.r || (this.mini ? 5 : 7),
        label: style.label || null, guides: style.guides !== false, pulse: !!style.pulse,
        labelPos: style.labelPos || 'auto', stroke: style.stroke || '#fff', hollow: !!style.hollow
      };
      this.marks.push(m);
      return m;
    }
    addBand(x0, x1, style) { // franja sobre l'eix X (solució d'una inequació)
      this.bands.push({ x0, x1, color: (style && style.color) || '#ef9f17', closedLeft: style && style.closedLeft, closedRight: style && style.closedRight });
      return this;
    }
    addVGuide(x, style) { // guia vertical persistent (per exemple, l'x actual)
      style = style || {};
      this.vguides.push({ x, color: style.color || '#7c8b9a', dash: style.dash || '6 4', width: style.width || 1.6, label: style.label || null });
      return this;
    }
    setReadout(cfg) { this.readoutCfg = cfg; } // {items:[{label,color,fn}], eq:boolean}
    setAriaLabel(t) { this.ariaLabel = t; this.svg.setAttribute('aria-label', t); }

    /* ---------- vista automàtica ---------- */
    autoFit(features, opts) {
      opts = opts || {};
      this._lastFeatures = features;
      const xs = [], ys = [];
      if (features) for (const f of features) {
        if (Number.isFinite(f.x)) xs.push(f.x);
        if (Number.isFinite(f.y)) ys.push(f.y);
      }
      let x0, x1;
      if (xs.length) {
        const xmin = Math.min(...xs), xmax = Math.max(...xs);
        const span = Math.max(xmax - xmin, 1) * (1 + this.fitPadding * 2);
        const cx = (xmax + xmin) / 2;
        x0 = Math.min(cx - span / 2, -1); x1 = Math.max(cx + span / 2, 1); // inclou el 0
      } else { x0 = -10; x1 = 10; }
      // y: mostregem les corbes dins de [x0, x1]
      let ymin = Infinity, ymax = -Infinity;
      const probes = [];
      const N = 48;
      for (let i = 0; i <= N; i++) probes.push(x0 + (x1 - x0) * i / N);
      for (const c of this.curves) {
        if (c.line) { // rectes implícites: extremes de la finestra
          for (const px of [x0, x1]) {
            const v = Math.abs(c.line.B) > 1e-12 ? (c.line.C - c.line.A * px) / c.line.B : NaN;
            if (Number.isFinite(v)) { ymin = Math.min(ymin, v); ymax = Math.max(ymax, v); }
          }
          continue;
        }
        for (const px of probes) {
          try {
            const v = c.fn(px);
            if (Number.isFinite(v)) { ymin = Math.min(ymin, v); ymax = Math.max(ymax, v); }
          } catch (e) { /* ignorem */ }
        }
      }
      for (const y of ys) { ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
      if (!Number.isFinite(ymin)) { ymin = -10; ymax = 10; }
      if (ymax === ymin) { ymin -= 5; ymax += 5; }
      // enquadrament didàctic: si la corba s'escapa molt dels punts d'interès
      // (arrels, vèrtexs, interseccions), prioritzem els punts d'interès
      if (ys.length >= 2) {
        const fmin = Math.min(...ys), fmax = Math.max(...ys);
        const fspan = Math.max(fmax - fmin, 2);
        if (ymin < fmin - fspan * 0.8) ymin = fmin - fspan * 0.8;
        if (ymax > fmax + fspan * 0.8) ymax = fmax + fspan * 0.8;
        if (ymin === ymax) { ymin -= 3; ymax += 3; }
      }
      // clamp de rangs enormes (paràboles punxegudes fora de vista)
      const yspanRaw = ymax - ymin;
      const cap = Math.max(yspanRaw, 20);
      if (yspanRaw > cap * 3) {
        const yc = (ymax + ymin) / 2; ymin = yc - cap; ymax = yc + cap;
      }
      const yspan = (ymax - ymin) * (1 + this.fitPadding * 2);
      const yc = (ymax + ymin) / 2;
      let y0 = Math.min(yc - yspan / 2, -1), y1 = Math.max(yc + yspan / 2, 1);
      if (opts.yCenter0) { y0 = Math.min(0 - yspan / 2, -1); y1 = 0 + yspan / 2; }
      return this.setView(x0, x1, y0, y1);
    }
    isOutside(x, y) { // el punt és fora de la vista actual?
      return x < this.view.x0 || x > this.view.x1 || y < this.view.y0 || y > this.view.y1;
    }

    /* ---------- interacció ---------- */
    _bindPointer() {
      const pointers = new Map();
      let last = null, pinchD = 0;
      this.svg.style.cursor = 'grab';
      this.svg.addEventListener('pointerdown', (e) => {
        pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
        this.svg.setPointerCapture(e.pointerId);
        if (pointers.size === 1) { last = { x: e.offsetX, y: e.offsetY }; this.svg.style.cursor = 'grabbing'; }
        if (pointers.size === 2) {
          const [p1, p2] = [...pointers.values()];
          pinchD = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        }
      });
      this.svg.addEventListener('pointermove', (e) => {
        if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.offsetX, y: e.offsetY });
        if (pointers.size === 2) {
          const [p1, p2] = [...pointers.values()];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (pinchD > 0 && d > 0) {
            const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2;
            this.zoomAt(cx, cy, pinchD / d);
          }
          pinchD = d;
          return;
        }
        if (pointers.size === 1 && last) {
          const dx = e.offsetX - last.x, dy = e.offsetY - last.y;
          last = { x: e.offsetX, y: e.offsetY };
          this.panBy(dx, dy);
          this._hideHover();
        } else {
          this._showHover(e.offsetX, e.offsetY);
        }
      });
      const up = (e) => {
        pointers.delete(e.pointerId);
        if (pointers.size < 2) pinchD = 0;
        if (pointers.size === 0) { last = null; this.svg.style.cursor = 'grab'; }
      };
      this.svg.addEventListener('pointerup', up);
      this.svg.addEventListener('pointercancel', up);
      this.svg.addEventListener('pointerleave', () => this._hideHover());
    }
    panBy(dx, dy) {
      const { x0, x1, y0, y1 } = this.view;
      const kx = (x1 - x0) / this.plotW(), ky = (y1 - y0) / this.plotH();
      this.userView = true;
      this.view = { x0: x0 - dx * kx, x1: x1 - dx * kx, y0: y0 + dy * ky, y1: y1 + dy * ky };
      this.render();
    }
    zoomAt(px, py, factor) {
      const mx = this.Xinv(px), my = this.Yinv(py);
      const { x0, x1, y0, y1 } = this.view;
      this.userView = true;
      this.view = {
        x0: mx + (x0 - mx) * factor, x1: mx + (x1 - mx) * factor,
        y0: my + (y0 - my) * factor, y1: my + (y1 - my) * factor
      };
      this.render();
    }

    /* ---------- mapatge ---------- */
    plotW() { return Math.max(10, this.w - this.pad.l - this.pad.r); }
    plotH() { return Math.max(10, this.h - this.pad.t - this.pad.b); }
    X(x) { const { x0, x1 } = this.view; return this.pad.l + (x - x0) / (x1 - x0) * this.plotW(); }
    Y(y) { const { y0, y1 } = this.view; return this.pad.t + (y1 - y) / (y1 - y0) * this.plotH(); }
    Xinv(px) { const { x0, x1 } = this.view; return x0 + (px - this.pad.l) / this.plotW() * (x1 - x0); }
    Yinv(py) { const { y0, y1 } = this.view; return y1 - (py - this.pad.t) / this.plotH() * (y1 - y0); }

    /* ---------- dibuix ---------- */
    setEqualScale(on) { this.equalScale = !!on; this.render(); return this; }
    // escala 1:1: amplia l'eix que va «curt» perquè una unitat de x mesuri el mateix que una de y
    _applyEqualScale() {
      const { x0, x1, y0, y1 } = this.view;
      const kx = (x1 - x0) / this.plotW(), ky = (y1 - y0) / this.plotH();
      if (Math.abs(kx - ky) / Math.max(kx, ky) < 1e-6) return;
      if (kx > ky) {
        const yc = (y0 + y1) / 2, half = kx * this.plotH() / 2;
        this.view = { x0, x1, y0: yc - half, y1: yc + half };
      } else {
        const xc = (x0 + x1) / 2, half = ky * this.plotW() / 2;
        this.view = { x0: xc - half, x1: xc + half, y0, y1 };
      }
    }

    render() {
      const w = this.host.clientWidth, h = this.host.clientHeight;
      this.w = w; this.h = h;
      if (w < 20 || h < 20) return;
      if (this.equalScale) this._applyEqualScale();
      this.svg.setAttribute('width', w);
      this.svg.setAttribute('height', h);
      this.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      this.clipRect.setAttribute('x', this.pad.l); this.clipRect.setAttribute('y', this.pad.t);
      this.clipRect.setAttribute('width', this.plotW()); this.clipRect.setAttribute('height', this.plotH());
      for (const g of [this.gGrid, this.gPlot, this.gMarks, this.gHover]) while (g.firstChild) g.removeChild(g.firstChild);
      this._drawGrid();
      this._drawBands();
      this._drawVGuides();
      this._drawCurves();
      this._drawMarks();
      if (this.onRenderCb) { try { this.onRenderCb(); } catch (e) { /* el dibuix no ha de fallar per un callback */ } }
    }

    _drawGrid() {
      const { x0, x1, y0, y1 } = this.view;
      const w = this.w, h = this.h;
      const stepX = niceStep(x1 - x0, Math.max(4, Math.min(10, Math.floor(this.plotW() / 70))));
      const stepY = niceStep(y1 - y0, Math.max(4, Math.min(9, Math.floor(this.plotH() / 55))));
      const axY = clamp(this.Y(0), this.pad.t, h - this.pad.b); // posició de l'eix X
      const axX = clamp(this.X(0), this.pad.l, w - this.pad.r); // posició de l'eix Y
      const minorX = stepX / 5, minorY = stepY / 5;
      const pxMinor = minorX / (x1 - x0) * this.plotW();
      const pyMinor = minorY / (y1 - y0) * this.plotH();

      if (pxMinor > 11) {
        for (let x = Math.ceil(x0 / minorX) * minorX; x <= x1 + 1e-9; x += minorX) {
          el('line', { x1: this.X(x), y1: this.pad.t, x2: this.X(x), y2: h - this.pad.b, stroke: '#eef2f8', 'stroke-width': 1, 'shape-rendering': 'crispEdges' }, this.gGrid);
        }
      }
      if (pyMinor > 11) {
        for (let y = Math.ceil(y0 / minorY) * minorY; y <= y1 + 1e-9; y += minorY) {
          el('line', { x1: this.pad.l, y1: this.Y(y), x2: w - this.pad.r, y2: this.Y(y), stroke: '#eef2f8', 'stroke-width': 1, 'shape-rendering': 'crispEdges' }, this.gGrid);
        }
      }
      // graella principal
      const xTicks = [], yTicks = [];
      for (let x = Math.ceil(x0 / stepX) * stepX; x <= x1 + 1e-9; x += stepX) {
        xTicks.push(x);
        el('line', { x1: this.X(x), y1: this.pad.t, x2: this.X(x), y2: h - this.pad.b, stroke: '#dce4ef', 'stroke-width': 1, 'shape-rendering': 'crispEdges' }, this.gGrid);
      }
      for (let y = Math.ceil(y0 / stepY) * stepY; y <= y1 + 1e-9; y += stepY) {
        yTicks.push(y);
        el('line', { x1: this.pad.l, y1: this.Y(y), x2: w - this.pad.r, y2: this.Y(y), stroke: '#dce4ef', 'stroke-width': 1, 'shape-rendering': 'crispEdges' }, this.gGrid);
      }
      // eixos
      const axisCol = '#43536a';
      const y0vis = y0 <= 0 && y1 >= 0, x0vis = x0 <= 0 && x1 >= 0;
      if (y0vis) el('line', { x1: this.pad.l - 4, y1: axY, x2: w - this.pad.r + 6, y2: axY, stroke: axisCol, 'stroke-width': 1.8 }, this.gGrid);
      else el('line', { x1: this.pad.l - 4, y1: h - this.pad.b, x2: w - this.pad.r + 6, y2: h - this.pad.b, stroke: axisCol, 'stroke-width': 1.8 }, this.gGrid);
      if (x0vis) el('line', { x1: axX, y1: h - this.pad.b + 4, x2: axX, y2: this.pad.t - 6, stroke: axisCol, 'stroke-width': 1.8 }, this.gGrid);
      else el('line', { x1: this.pad.l, y1: h - this.pad.b + 4, x2: this.pad.l, y2: this.pad.t - 6, stroke: axisCol, 'stroke-width': 1.8 }, this.gGrid);
      // fletxes
      const arrow = 'M0,0 L-7,-3 L-7,3 Z';
      el('path', { d: arrow, fill: axisCol, transform: 'translate(' + (w - this.pad.r + 7) + ',' + (y0vis ? axY : h - this.pad.b) + ')' }, this.gGrid);
      el('path', { d: arrow, fill: axisCol, transform: 'translate(' + (x0vis ? axX : this.pad.l) + ',' + (this.pad.t - 7) + ') rotate(-90)' }, this.gGrid);
      // noms dels eixos
      const t1 = el('text', { x: w - this.pad.r + 2, y: (y0vis ? axY : h - this.pad.b) - 9, 'font-size': 13, 'font-style': 'italic', 'font-family': 'Georgia,serif', fill: axisCol, 'text-anchor': 'end' }, this.gGrid);
      t1.textContent = 'x';
      const t2 = el('text', { x: (x0vis ? axX : this.pad.l) + 8, y: this.pad.t + 2, 'font-size': 13, 'font-style': 'italic', 'font-family': 'Georgia,serif', fill: axisCol }, this.gGrid);
      t2.textContent = 'y';
      // etiquetes de les marques (amb guarda de distància mínima)
      const labCol = '#5f7186';
      let lastPx = -1e9;
      for (const x of xTicks) {
        const px = this.X(x);
        if (px - lastPx < 34) continue; // massa a prop de l'anterior
        lastPx = px;
        if (Math.abs(x) < stepX * 1e-6 && !x0vis) continue;
        if (Math.abs(x) < stepX * 1e-6) {
          const zt = el('text', { x: this.X(x) - 5, y: axY + 15, 'font-size': 11, fill: labCol, 'text-anchor': 'end', 'font-family': 'inherit' }, this.gGrid);
          zt.textContent = '0';
          continue;
        }
        const t = el('text', { x: this.X(x), y: axY + 16, 'font-size': 11, fill: labCol, 'text-anchor': 'middle' }, this.gGrid);
        t.textContent = fmtTick(x, stepX);
      }
      let lastPy = -1e9;
      for (const y of yTicks) {
        if (Math.abs(y) < stepY * 1e-6) continue; // el 0 ja el posa l'eix X
        const py = this.Y(y);
        if (Math.abs(py - lastPy) < 26) continue;
        lastPy = py;
        const t = el('text', { x: axX - 7, y: this.Y(y) + 4, 'font-size': 11, fill: labCol, 'text-anchor': 'end' }, this.gGrid);
        t.textContent = fmtTick(y, stepY);
      }
    }

    _drawVGuides() {
      for (const vg of this.vguides) {
        const px = this.X(vg.x);
        if (px < this.pad.l - 2 || px > this.w - this.pad.r + 2) continue;
        el('line', {
          x1: px, y1: this.pad.t, x2: px, y2: this.h - this.pad.b,
          stroke: vg.color, 'stroke-width': vg.width, 'stroke-dasharray': vg.dash
        }, this.gMarks);
        if (vg.label) {
          const t = L.fmt.svgRich(this.gMarks, vg.label, { size: 11.5, fill: vg.color });
          t.place(clamp(px, this.pad.l + t.width / 2 + 4, this.w - this.pad.r - t.width / 2 - 4), this.pad.t + 14);
        }
      }
    }

    _drawCurves() {
      const { x0, x1 } = this.view;
      const N = Math.max(120, Math.min(700, Math.floor(this.plotW() * 1.6)));
      for (const c of this.curves) {
        if (c.line) { // recta implícita A·x + B·y = C (pot ser vertical)
          const pts = clipImplicitLine(c.line.A, c.line.B, c.line.C, this.view.x0, this.view.x1, this.view.y0, this.view.y1);
          if (pts) {
            const d = 'M' + this.X(pts[0].x).toFixed(1) + ',' + this.Y(pts[0].y).toFixed(1) +
              'L' + this.X(pts[1].x).toFixed(1) + ',' + this.Y(pts[1].y).toFixed(1);
            const attrs = { d, fill: 'none', stroke: c.color, 'stroke-width': c.width, 'stroke-linecap': 'round' };
            if (c.dash) attrs['stroke-dasharray'] = c.dash;
            if (c.opacity < 1) attrs['stroke-opacity'] = c.opacity;
            el('path', attrs, this.gPlot);
            if (c.label) { // etiqueta de la recta (①, ②…)
              const { x0: vx0, x1: vx1, y0: vy0, y1: vy1 } = this.view;
              let lx = null, ly = null, anchor = 'start';
              if (Math.abs(c.line.B) > 1e-12) {
                for (const f of [0.94, 0.06, 0.5]) {
                  const xx = vx0 + (vx1 - vx0) * f;
                  const yy = (c.line.C - c.line.A * xx) / c.line.B;
                  if (yy >= vy0 && yy <= vy1) { lx = xx; ly = yy; anchor = f > 0.5 ? 'end' : 'start'; break; }
                }
              } else if (Math.abs(c.line.A) > 1e-12) {
                lx = c.line.C / c.line.A; ly = vy0 + (vy1 - vy0) * 0.12;
              }
              if (lx !== null) {
                const t = el('text', {
                  x: this.X(lx) + (anchor === 'end' ? -10 : 10), y: this.Y(ly) - 8,
                  'font-size': 13, 'font-weight': 800, fill: c.color,
                  'text-anchor': anchor, 'font-family': 'Georgia,serif',
                  stroke: '#fff', 'stroke-width': 3.5, 'paint-order': 'stroke'
                }, this.gMarks);
                t.textContent = c.label;
              }
            }
          }
          continue;
        }
        let d = '';
        let pen = false;
        for (let i = 0; i <= N; i++) {
          const x = x0 + (x1 - x0) * i / N;
          let y;
          try { y = c.fn(x); } catch (e) { y = NaN; }
          if (!Number.isFinite(y)) { pen = false; continue; }
          const px = this.X(x), py = this.Y(y);
          if (py < this.pad.t - 2000 || py > this.h - this.pad.b + 2000) { pen = false; continue; }
          d += (pen ? 'L' : 'M') + px.toFixed(1) + ',' + py.toFixed(1);
          pen = true;
        }
        if (!d) continue;
        const attrs = {
          d, fill: 'none', stroke: c.color, 'stroke-width': c.width,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        };
        if (c.dash) attrs['stroke-dasharray'] = c.dash;
        if (c.opacity < 1) attrs['stroke-opacity'] = c.opacity;
        el('path', attrs, this.gPlot);
      }
    }

    _drawMarks() {
      const w = this.w, h = this.h;
      for (const m of this.marks) {
        const px = this.X(m.x), py = this.Y(m.y);
        if (px < this.pad.l - 20 || px > w - this.pad.r + 20 || py < this.pad.t - 20 || py > h - this.pad.b + 20) continue;
        const axY = clamp(this.Y(0), this.pad.t, h - this.pad.b);
        const axX = clamp(this.X(0), this.pad.l, w - this.pad.r);
        if (m.guides) {
          el('line', { x1: px, y1: py, x2: px, y2: axY, stroke: '#8a97a8', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, this.gMarks);
          el('line', { x1: px, y1: py, x2: axX, y2: py, stroke: '#8a97a8', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, this.gMarks);
        }
        const circle = el('circle', {
          cx: px, cy: py, r: m.r, fill: m.hollow ? '#fff' : m.color,
          stroke: m.hollow ? m.color : m.stroke, 'stroke-width': 2.4
        }, this.gMarks);
        circle.style.filter = 'drop-shadow(0 1px 2px rgba(18,42,66,.35))';
        if (m.label) {
          const g = el('g', null, this.gMarks);
          // etiqueta amb fraccions verticals i incògnites en cursiva
          const t = L.fmt.svgRich(g, m.label, { size: this.mini ? 11 : 14 });
          const bb = t.g.getBBox();
          const asc = -bb.y, desc = bb.y + bb.height; // per sobre i per sota de la línia de base
          const side = m.labelPos === 'below' || m.labelPos === 'above';
          let lx = side ? px : px + 14, ly = py - 10 - desc;
          if (lx + bb.width / 2 > w - this.pad.r) lx = side ? w - this.pad.r - bb.width / 2 : px - 14 - bb.width / 2;
          if (lx - bb.width / 2 < this.pad.l) lx = this.pad.l + bb.width / 2;
          if (ly - asc < this.pad.t) ly = py + 12 + asc;
          if (m.labelPos === 'below') ly = py + m.r + 7 + asc;
          if (m.labelPos === 'above') ly = py - m.r - 7 - desc;
          t.place(lx, ly);
          const bb2 = g.getBBox();
          const r = el('rect', {
            x: bb2.x - 6, y: bb2.y - 3, width: bb2.width + 12, height: bb2.height + 6,
            rx: 7, fill: 'rgba(255,255,255,.93)', stroke: '#c9d4e0', 'stroke-width': 1
          }, g);
          g.insertBefore(r, t.g);
        }
      }
    }

    _drawBands() {
      const h = this.h;
      const axY = clamp(this.Y(0), this.pad.t, h - this.pad.b);
      for (const b of this.bands) {
        const x0 = Math.max(this.view.x0, Math.min(b.x0, this.view.x1));
        const x1 = Math.min(this.view.x1, Math.max(b.x1, this.view.x0));
        if (x1 <= x0) continue;
        const px0 = this.X(x0), px1 = this.X(x1);
        el('rect', { x: px0, y: axY - 5, width: px1 - px0, height: 10, rx: 5, fill: b.color, 'fill-opacity': .8 }, this.gMarks);
        // extrems obert/tancat: només als extrems reals; si la franja continua fora de la vista, fletxa (cap a ±∞)
        const endMark = (px, closed, real, dir) => {
          if (!real) {
            el('path', { d: 'M0,-7 L' + (dir * 10) + ',0 L0,7 Z', fill: b.color, transform: 'translate(' + px + ',' + axY + ')' }, this.gMarks);
          } else if (closed) el('circle', { cx: px, cy: axY, r: 6.5, fill: b.color, stroke: '#fff', 'stroke-width': 2 }, this.gMarks);
          else el('circle', { cx: px, cy: axY, r: 6.5, fill: '#fff', stroke: b.color, 'stroke-width': 2.6 }, this.gMarks);
        };
        endMark(px0, b.closedLeft, b.x0 >= this.view.x0, -1);
        endMark(px1, b.closedRight, b.x1 <= this.view.x1, 1);
      }
    }

    /* ---------- crosshair ---------- */
    _showHover(px, py) {
      if (this._destroyed) return;
      if (px < this.pad.l || px > this.w - this.pad.r || py < this.pad.t || py > this.h - this.pad.b) { this._hideHover(); return; }
      const x = this.Xinv(px);
      this.hoverLine.setAttribute('x1', px); this.hoverLine.setAttribute('y1', this.pad.t);
      this.hoverLine.setAttribute('x2', px); this.hoverLine.setAttribute('y2', this.h - this.pad.b);
      this.hoverLine.style.display = '';
      // punts sobre les corbes del readout
      if (this.hoverDots) { this.hoverDots.remove(); this.hoverDots = null; }
      const cfg = this.readoutCfg;
      if (cfg && cfg.items && cfg.items.length) {
        this.hoverDots = el('g', null, this.gHover);
        let allEq = true, prev = null, eqExact = false;
        const parts = ['<span><i>x</i> = ' + L.fmt.fmtNum(x, 2) + '</span>'];
        for (const it of cfg.items) {
          let y; try { y = it.fn(x); } catch (e) { y = NaN; }
          if (!Number.isFinite(y)) continue;
          el('circle', { cx: this.X(x), cy: this.Y(y), r: 5, fill: it.color, stroke: '#fff', 'stroke-width': 2 }, this.hoverDots);
          parts.push('<span style="color:' + it.ink + '">' + it.label + ' = ' + L.fmt.fmtNum(y, 2) + '</span>');
          if (prev !== null && Math.abs(y - prev) < 1e-9) eqExact = true;
          if (prev !== null && Math.abs(y - prev) > 1e-9) allEq = false;
          prev = y;
        }
        if (cfg.eq && this.curves.length >= 2 && allEq && eqExact) {
          parts.push('<span class="ro-eq">y\u2081 = y\u2082 !</span>');
        }
        this.readoutEl.innerHTML = parts.join('');
        this.readoutEl.style.display = 'flex';
      }
      if (this.onHoverCb) this.onHoverCb(x);
    }
    _hideHover() {
      if (this._destroyed) return;
      this.hoverLine.style.display = 'none';
      if (this.readoutEl) this.readoutEl.style.display = 'none';
      if (this.hoverDots) { this.hoverDots.remove(); this.hoverDots = null; }
    }

    destroy() {
      this._destroyed = true;
      try { this.ro.disconnect(); } catch (e) { }
      if (this.toolsEl && this.toolsEl.parentNode) this.toolsEl.remove();
      if (this.readoutEl && this.readoutEl.parentNode) this.readoutEl.remove();
      this.svg.remove();
    }
  }

  L.Graph = Graph;
  L.GraphUtil = { niceStep, fmtTick, el, SVG_NS };
})(typeof window !== 'undefined' ? window : globalThis);
