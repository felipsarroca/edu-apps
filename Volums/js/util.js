window.VOL = window.VOL || {};
(function (V) {
  'use strict';

  // Format català: coma decimal, sense zeros sobrers
  V.fmt = function (x, dec) {
    if (dec === undefined) dec = 2;
    if (!isFinite(x)) return '—';
    const k = Math.pow(10, dec);
    let r = Math.round(x * k) / k;
    if (Object.is(r, -0)) r = 0;
    return r.toLocaleString('ca-ES', { maximumFractionDigits: dec });
  };

  // Accepta coma o punt decimal i punts de milers (1.000,5)
  V.parseNum = function (s) {
    if (s == null) return NaN;
    s = String(s).trim().replace(/\s/g, '').replace(/'/g, '');
    if (!s) return NaN;
    if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
  };

  V.close = function (a, b, rel) {
    if (rel === undefined) rel = 0.01;
    if (b === 0) return Math.abs(a) < 1e-9;
    return Math.abs(a - b) <= Math.abs(b) * rel + 1e-9;
  };

  V.ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  V.pick = arr => arr[Math.floor(Math.random() * arr.length)];
  V.rstep = (min, max, step) => Math.round((min + step * V.ri(0, Math.floor((max - min) / step))) * 1000) / 1000;
  V.shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  V.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Animació simple amb suavitzat
  V.tween = function (ms, fn, done) {
    const t0 = performance.now();
    let stop = false;
    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    function frame(now) {
      if (stop) return;
      const t = Math.min(1, (now - t0) / ms);
      fn(ease(t), t);
      if (t < 1) requestAnimationFrame(frame);
      else if (done) done();
    }
    requestAnimationFrame(frame);
    return () => { stop = true; };
  };

  // Lectura en veu alta
  const SAY = [
    [/mm³/g, ' mil·límetres cúbics'], [/cm³/g, ' centímetres cúbics'], [/dm³/g, ' decímetres cúbics'], [/m³/g, ' metres cúbics'],
    [/mm²/g, ' mil·límetres quadrats'], [/cm²/g, ' centímetres quadrats'], [/dm²/g, ' decímetres quadrats'], [/m²/g, ' metres quadrats'],
    [/π/g, ' pi '], [/·/g, ' per '], [/ = /g, ' igual a '], [/³/g, ' al cub'], [/²/g, ' al quadrat']
  ];
  V.speak = function (html) {
    if (!('speechSynthesis' in window)) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    let text = tmp.textContent;
    SAY.forEach(([re, rep]) => { text = text.replace(re, rep); });
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ca-ES';
    const voice = speechSynthesis.getVoices().find(v => /^ca/i.test(v.lang));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    speechSynthesis.speak(u);
  };

  // Progrés desat al navegador
  const KEY = 'volums-progres-v1';
  const blank = () => ({ skills: {}, lessons: {}, reptes: {}, explored: {}, xp: 0, exercises: 0, settings: { mode: 'guiat', level: 'auto' } });
  V.loadProgress = function () {
    try {
      const raw = localStorage.getItem(KEY);
      V.progress = Object.assign(blank(), raw ? JSON.parse(raw) : {});
    } catch (e) { V.progress = blank(); }
  };
  V.saveProgress = function () {
    try { localStorage.setItem(KEY, JSON.stringify(V.progress)); } catch (e) { /* sense emmagatzematge */ }
  };
  V.resetProgress = function () { V.progress = blank(); V.saveProgress(); };

  V.recordResult = function (skill, score) {
    const s = V.progress.skills[skill] || (V.progress.skills[skill] = { hist: [], n: 0 });
    s.hist.push(Math.round(score * 100) / 100);
    if (s.hist.length > 8) s.hist.shift();
    s.n++;
    V.progress.exercises++;
    V.progress.xp += Math.round(10 * score);
    V.saveProgress();
  };

  V.mastery = function (skill) {
    const s = V.progress.skills[skill];
    if (!s || !s.hist.length) return 0;
    let sum = 0, w = 0;
    s.hist.forEach((v, i) => { const k = 1 + i * 0.25; sum += v * k; w += k; });
    return (sum / w) * Math.min(1, s.hist.length / 4);
  };
  V.stars = m => m >= 0.85 ? 3 : m >= 0.6 ? 2 : m >= 0.3 ? 1 : 0;
  V.starsHtml = n => `<span class="stars" aria-label="${n} de 3 estrelles">${[0, 1, 2].map(i => `<span class="${i < n ? 'on' : ''}">★</span>`).join('')}</span>`;

  // Controls d'interfície reutilitzables
  V.ui = {
    slider(o) {
      const w = document.createElement('label');
      w.className = 'ctl-slider';
      const show = v => `${V.fmt(v)}${o.unit ? ' ' + o.unit : ''}`;
      w.innerHTML = `<span class="ctl-top"><span>${o.label}</span><output>${show(o.value)}</output></span>
        <input type="range" min="${o.min}" max="${o.max}" step="${o.step}" value="${o.value}">`;
      const inp = w.querySelector('input'), out = w.querySelector('output');
      inp.addEventListener('input', () => { const v = parseFloat(inp.value); out.textContent = show(v); o.onInput(v); });
      w.setUnit = u => { o.unit = u; out.textContent = show(parseFloat(inp.value)); };
      return w;
    },
    toggle(o) {
      const w = document.createElement('label');
      w.className = 'ctl-toggle';
      w.innerHTML = `<input type="checkbox" ${o.value ? 'checked' : ''}><span class="switch" aria-hidden="true"></span><span>${o.label}</span>`;
      const inp = w.querySelector('input');
      // L'estat també va en una classe: alguns navegadors no repinten :checked a temps
      const sync = () => w.classList.toggle('on', inp.checked);
      inp.addEventListener('change', () => { sync(); o.onChange(inp.checked); });
      w.input = inp;
      w.set = v => { inp.checked = !!v; sync(); };
      sync();
      return w;
    },
    seg(o) {
      const w = document.createElement('div');
      w.className = 'ctl-seg';
      w.setAttribute('role', 'group');
      if (o.label) w.setAttribute('aria-label', o.label);
      w.innerHTML = o.options.map(op => `<button type="button" data-v="${op.v}" class="${op.v === o.value ? 'on' : ''}">${op.label}</button>`).join('');
      w.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        w.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        o.onChange(b.dataset.v);
      }));
      return w;
    },
    button(label, onClick, cls) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn ' + (cls || '');
      b.innerHTML = label;
      b.addEventListener('click', onClick);
      return b;
    }
  };

  V.ICON_UI = {
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ---------- Variables amb color i unitats enganxades al número ----------
  // Cada lletra té sempre el mateix color: a la figura, a la fórmula i a l'enunciat
  V.VARC = { h: '#c2255c', r: '#2b8a3e', d: '#2b8a3e', a: '#1864ab', l: '#1864ab', b: '#7048e8', c: '#0b7285', t: '#5c940d', ap: '#9c36b5' };
  const FORMULA = '.big-formula, .calc, .solution, .choice, .key-f, .formula-list, .step-sum, .reveal b, .eq, .ro-grid b, .ctl-top, .vf';
  const VAR_RE = /(^|[^A-Za-zÀ-ÿ0-9_'’])(ap|[abcdhlrt])(?![A-Za-zÀ-ÿ0-9_'’])/g;
  const UNIT_RE = / (?=(?:mm|cm|dm|km|m|mL|cL|dL|L)[²³]?(?![A-Za-zÀ-ÿ]))/g;
  V.polish = function (root) {
    if (!root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('script, style, svg, input, select, textarea, sub, .var, .no-var') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => {
      const nb = n.data.replace(UNIT_RE, ' ');
      if (nb !== n.data) n.data = nb;
      const el = n.parentElement;
      const bold = el.closest('b, strong');
      if (!el.closest(FORMULA) && !(bold && bold.textContent.includes('='))) return;
      VAR_RE.lastIndex = 0;
      if (!VAR_RE.test(n.data)) return;
      const html = V.esc(n.data).replace(VAR_RE, (m, pre, v) => `${pre}<var class="var" style="--vc:${V.VARC[v]}">${v}</var>`);
      const tpl = document.createElement('template');
      tpl.innerHTML = html;
      n.replaceWith(tpl.content);
    });
  };
})(window.VOL);
