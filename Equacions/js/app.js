/* ============================================================
   app.js — carcassa de l'aplicació: registre de laboratoris,
   router per hash (#/m1?a=2&b=−3), capçalera, pantalla d'inici,
   glossari, mode projector, amagar respostes, enllaç compartible
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const UI = () => L.UI;

  const registry = [];
  let current = null;   // {lab, cleanup}
  const settings = { projector: false, mask: false };

  /* ---------- registre de laboratoris ---------- */
  function registerLab(def) { registry.push(def); }

  /* ---------- configuració persistida ---------- */
  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('labeq:settings') || '{}');
      if (typeof s.projector === 'boolean') settings.projector = s.projector;
      if (typeof s.mask === 'boolean') settings.mask = s.mask;
    } catch (e) { }
    applySettings();
  }
  function saveSettings() {
    try { localStorage.setItem('labeq:settings', JSON.stringify(settings)); } catch (e) { }
  }
  function applySettings() {
    document.documentElement.classList.toggle('projector', settings.projector);
    document.body.classList.toggle('mask-answers', settings.mask);
  }

  /* ---------- progrés de l'alumne (només al navegador) ----------
     Cada laboratori marca els reptes que aconsegueix; la pantalla d'inici
     ho resumeix a cada targeta i a l'itinerari recomanat. */
  const PROG_KEY = 'labeq:progress';
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch (e) { return {}; }
  }
  function markDone(labKey, itemId) {
    const p = loadProgress();
    const list = p[labKey] || [];
    if (list.includes(itemId)) return;
    list.push(itemId); p[labKey] = list;
    try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch (e) { }
    UI().celebrate(); // cada repte nou es celebra
  }

  // reptes ja aconseguits d'un laboratori, com a { id: true }, per restaurar-los en tornar-hi
  function doneMap(labKey) {
    const map = {};
    for (const id of loadProgress()[labKey] || []) map[id] = true;
    return map;
  }

  /* ---------- explicacions escrites per l'alumne (hipòtesis i justificacions) ---------- */
  const REFL_KEY = 'labeq:reflexions';
  function loadReflections() {
    try { return JSON.parse(localStorage.getItem(REFL_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveReflection(labKey, text, ctx) {
    const list = loadReflections();
    list.push({ lab: labKey || '', text, ctx: ctx || '', t: Date.now() });
    try { localStorage.setItem(REFL_KEY, JSON.stringify(list.slice(-60))); } catch (e) { }
  }



  /* ---------- il·lustracions de les targetes d'inici ---------- */
  const AX = '<path d="M6 46h108" stroke="#b8c4d3" stroke-width="2"/>';
  const ART = {
    m0: '<path d="M60 10v40M44 52h32" stroke="#123c5e" stroke-width="4" stroke-linecap="round"/><path d="M22 18L98 14" stroke="#123c5e" stroke-width="4" stroke-linecap="round"/><path d="M22 18v8M98 14v8" stroke="#8a97a8" stroke-width="2"/><path d="M10 26h24a12 6 0 0 1-24 0zM86 22h24a12 6 0 0 1-24 0z" fill="#dbe7f5" stroke="#8a97a8" stroke-width="2"/><circle cx="60" cy="16" r="4" fill="#ef9f17"/>',
    m1: AX + '<path d="M14 40L106 12" stroke="#1d5fd6" stroke-width="2" stroke-dasharray="5 5" opacity=".4"/><path d="M14 52L106 6" stroke="#1d5fd6" stroke-width="4" stroke-linecap="round"/><path d="M14 18L106 40" stroke="#0d9463" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="28" r="6" fill="#ef9f17" stroke="#fff" stroke-width="2"/>',
    m2: '<path d="M6 32h108" stroke="#123c5e" stroke-width="2.5"/><path d="M8 32h58" stroke="#ef9f17" stroke-width="9" stroke-linecap="round" opacity=".85"/><path d="M14 24l-8 8 8 8" fill="none" stroke="#b26a05" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="70" cy="32" r="7" fill="#fff" stroke="#b26a05" stroke-width="3"/><text x="94" y="20" font-size="20" font-weight="700" fill="#123c5e" text-anchor="middle">&lt;</text>',
    m3: '<path d="M6 32h108M48 2v56" stroke="#b8c4d3" stroke-width="2"/><path d="M23.7 4Q62 108 100.3 4" fill="none" stroke="#1d5fd6" stroke-width="4" stroke-linecap="round"/><circle cx="36" cy="32" r="4.5" fill="#ef9f17" stroke="#fff" stroke-width="1.5"/><circle cx="88" cy="32" r="4.5" fill="#ef9f17" stroke="#fff" stroke-width="1.5"/>',
    m4: '<path d="M60 4v52M6 30h108" stroke="#b8c4d3" stroke-width="2"/><path d="M20 54L100 6" stroke="#1d5fd6" stroke-width="4" stroke-linecap="round"/><path d="M14 10L106 50" stroke="#0d9463" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="29" r="6" fill="#ef9f17" stroke="#fff" stroke-width="2"/>',
    m5: '<path d="M6 43.2h108M60 2v56" stroke="#b8c4d3" stroke-width="2"/><path d="M8.3 4.0L9.6 12.9L10.9 20.9L12.2 27.8L13.5 33.8L14.8 39.0L16.1 43.4L17.3 47.0L18.6 49.9L19.9 52.2L21.2 53.9L22.5 55.1L23.8 55.8L25.1 56.0L26.4 55.9L27.7 55.4L29.0 54.5L30.3 53.4L31.6 52.1L32.9 50.6L34.1 48.9L35.4 47.1L36.7 45.1L38.0 43.2L39.3 41.1L40.6 39.1L41.9 37.1L43.2 35.1L44.5 33.2L45.8 31.3L47.1 29.6L48.4 27.9L49.7 26.4L51.0 25.1L52.2 23.9L53.5 22.8L54.8 22.0L56.1 21.3L57.4 20.8L58.7 20.5L60.0 20.4L61.3 20.5L62.6 20.8L63.9 21.3L65.2 22.0L66.5 22.8L67.8 23.9L69.0 25.1L70.3 26.4L71.6 27.9L72.9 29.6L74.2 31.3L75.5 33.2L76.8 35.1L78.1 37.1L79.4 39.1L80.7 41.1L82.0 43.2L83.3 45.1L84.6 47.1L85.8 48.9L87.1 50.6L88.4 52.1L89.7 53.4L91.0 54.5L92.3 55.4L93.6 55.9L94.9 56.0L96.2 55.8L97.5 55.1L98.8 53.9L100.1 52.2L101.4 49.9L102.7 47.0L103.9 43.4L105.2 39.0L106.5 33.8L107.8 27.8L109.1 20.9L110.4 12.9L111.7 4.0" fill="none" stroke="#1d5fd6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="43.2" r="4.5" fill="#ef9f17" stroke="#fff" stroke-width="1.5"/><circle cx="38" cy="43.2" r="4.5" fill="#ef9f17" stroke="#fff" stroke-width="1.5"/><circle cx="82" cy="43.2" r="4.5" fill="#ef9f17" stroke="#fff" stroke-width="1.5"/><circle cx="104" cy="43.2" r="4.5" fill="#ef9f17" stroke="#fff" stroke-width="1.5"/>',
    detectiu: '<rect x="14" y="8" width="58" height="10" rx="4" fill="#dbe7f5"/><rect x="14" y="24" width="58" height="10" rx="4" fill="#fde2e2" stroke="#c22f2f" stroke-width="2"/><rect x="14" y="40" width="58" height="10" rx="4" fill="#dbe7f5"/><circle cx="88" cy="28" r="14" fill="none" stroke="#123c5e" stroke-width="5"/><path d="M98 38l12 12" stroke="#123c5e" stroke-width="6" stroke-linecap="round"/>',
    practica: '<rect x="12" y="8" width="44" height="44" rx="8" fill="#e0f2ef"/><path d="M22 30l8 8 16-18" fill="none" stroke="#0f766e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="64" y="8" width="44" height="44" rx="8" fill="#fdf1dc"/><text x="86" y="40" font-size="26" font-weight="700" fill="#b26a05" text-anchor="middle">x</text>'
  };
  function progressOf(def) {
    if (def.key === 'practica') { // la pràctica no té un total: compta els exercicis resolts
      let n = 0;
      try {
        const s = JSON.parse(localStorage.getItem('labeq:practica-stats') || '{}');
        for (const k in s) n += (s[k].hist || []).filter(x => x !== 'miss').length;
      } catch (e) { }
      return { done: n, total: 0, label: n + (n === 1 ? ' exercici resolt' : ' exercicis resolts') };
    }
    if (!def.goals) return null;
    const done = Math.min(def.goals, (loadProgress()[def.key] || []).length);
    return { done, total: def.goals, label: done + '/' + def.goals + ' ' + (def.goalName || 'reptes') + (def.goalSuffix || ' explorats') };
  }
  function resetProgress() {
    try { localStorage.removeItem(PROG_KEY); localStorage.removeItem('labeq:practica-stats'); localStorage.removeItem(REFL_KEY); } catch (e) { }
  }

  /* ---------- hash i enllaços ---------- */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '');
    if (!h) return { key: '', params: {} };
    const [key, qs] = h.split('?');
    const params = {};
    if (qs) for (const kv of qs.split('&')) {
      const [k, v] = kv.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    }
    return { key, params };
  }
  let hashTimer = null;
  function updateHash(params) {
    // els laboratoris hi passen els paràmetres actuals (objecte pla de strings)
    if (!current) return;
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      if (!current) return; // s'ha sortit del laboratori abans que s'actualitzés l'enllaç
      const key = current.lab.key;
      const qs = Object.entries(params || {}).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
      const target = '#/' + key + (qs ? '?' + qs : '');
      if (location.hash !== target) {
        suppressRoute = true;
        location.hash = target;
        setTimeout(() => { suppressRoute = false; }, 0);
      }
    }, 350);
  }
  let suppressRoute = false;

  async function copyLink() {
    const url = location.href;
    try {
      await navigator.clipboard.writeText(url);
      UI().toast('Enllaç copiat! El pots compartir amb qui vulguis.', 'ok');
    } catch (e) {
      UI().openModal({
        title: 'Comparteix aquesta activitat', small: true,
        bodyHTML: '<p>Copia aquesta adreça (no conté cap dada personal):</p>' +
          '<p><input class="input" style="width:100%" readonly value="' + url.replace(/"/g, '&quot;') + '"></p>',
        footHTML: '<button class="btn primary" data-action="ok">D\'acord</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
    }
  }

  /* ---------- capçalera ---------- */
  function renderHeader(lab) {
    const h = document.getElementById('app-header');
    const icons = UI().ICONS;
    const globalBtns =
      '<button class="hbtn" id="btn-glossary" title="Glossari de termes" aria-label="Obre el glossari">' + icons.book + '<span class="hbtn-label">Glossari</span></button>' +
      '<button class="hbtn' + (settings.projector ? ' on' : '') + '" id="btn-projector" title="Mode projector: lletres i fórmules grans" aria-label="Mode projector" aria-pressed="' + settings.projector + '">' + icons.projector + '<span class="hbtn-label">Projector</span></button>' +
      '<button class="hbtn' + (settings.mask ? ' on' : '') + '" id="btn-mask" title="Amaga les respostes (per debatre abans de revelar-les)" aria-label="Amaga les respostes" aria-pressed="' + settings.mask + '">' + icons.eyeoff + '</button>' +
      '<button class="hbtn" id="btn-share" title="Copia l\'enllaç d\'aquesta activitat" aria-label="Comparteix l\'enllaç">' + icons.share + '</button>';
    if (!lab) {
      h.innerHTML =
        '<div class="brand">' +
        '<span class="brand-mark" aria-hidden="true">' + icons.flask + '</span>' +
        '<span class="brand-text"><span class="brand-title">Laboratori d\'equacions</span></span></div>' +
        '<span class="spacer"></span>' + globalBtns;
    } else {
      h.innerHTML =
        '<button class="back-btn" id="btn-home" aria-label="Torna a la pantalla d\'inici">' + icons.home + '<span>Inici</span></button>' +
        '<div class="brand"><span class="brand-title">' + lab.title + '</span></div>' +
        '<span class="spacer"></span>' + globalBtns +
        (lab.help ? '<button class="hbtn" id="btn-help" title="Ajuda d\'aquest laboratori" aria-label="Ajuda del laboratori">' + icons.help + '<span class="hbtn-label">Ajuda</span></button>' : '');
      h.querySelector('#btn-home').addEventListener('click', () => { location.hash = '#/'; });
      const bh = h.querySelector('#btn-help');
      if (bh) bh.addEventListener('click', () => lab.help());
    }
    h.querySelector('#btn-glossary').addEventListener('click', openGlossary);
    h.querySelector('#btn-projector').addEventListener('click', (e) => {
      settings.projector = !settings.projector; saveSettings(); applySettings();
      const b = e.currentTarget; b.classList.toggle('on', settings.projector);
      b.setAttribute('aria-pressed', String(settings.projector));
    });
    h.querySelector('#btn-mask').addEventListener('click', (e) => {
      settings.mask = !settings.mask; saveSettings(); applySettings();
      const b = e.currentTarget; b.classList.toggle('on', settings.mask);
      b.setAttribute('aria-pressed', String(settings.mask));
    });
    h.querySelector('#btn-share').addEventListener('click', copyLink);
  }

  /* ---------- pantalla d'inici ---------- */
  function renderHome() {
    const main = document.getElementById('main');
    main.className = 'app-main scrollable';
    main.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'home';
    const progs = registry.map(progressOf);
    const cardsHTML = registry.map((d, i) => {
      const pr = progs[i];
      const complete = pr && pr.total && pr.done >= pr.total;
      const progHTML = pr
        ? '<span class="lc-prog' + (complete ? ' complete' : '') + '">' +
          (pr.total ? '<span class="lc-bar" aria-hidden="true"><i style="width:' + Math.round(100 * pr.done / pr.total) + '%"></i></span>' : '') +
          '<span class="lc-prog-label">' + (complete ? '✓ ' : '') + pr.label + '</span></span>'
        : '';
      return '<button class="lab-card" data-key="' + d.key + '" data-kind="' + (d.kind || 'lab') + '">' +
        (d.badge ? '<span class="lc-badge">' + d.badge + '</span>' : '') +
        '<span class="lc-top"><span class="lc-num">' + d.iconHTML + '</span><span class="lc-title">' + d.title + '</span></span>' +
        (ART[d.key] ? '<span class="lc-art" aria-hidden="true"><svg viewBox="0 0 120 60">' + ART[d.key] + '</svg></span>' : '') +
        '<span class="lc-foot">' + (progHTML || '<span></span>') + '<span class="lc-arrow">→</span></span>' +
        '</button>';
    }).join('');
    // itinerari recomanat: l'ordre del registre és l'ordre didàctic
    const pathHTML = registry.map((d, i) => {
      const pr = progs[i];
      const state = pr && pr.total && pr.done >= pr.total ? 'done' : (pr && pr.done > 0 ? 'started' : '');
      return '<li><a class="path-step ' + state + '" href="#/' + d.key + '" data-kind="' + (d.kind || 'lab') + '">' +
        '<span class="ps-dot">' + (state === 'done' ? '✓' : d.iconHTML) + '</span>' +
        '<span class="ps-name">' + (d.short || d.title) + '</span></a></li>';
    }).join('');
    const anyProgress = progs.some(p => p && p.done > 0);
    wrap.innerHTML =
      '<div class="home-inner">' +
      '<div class="home-hero">' +
      '<h1>Laboratori d\'<span class="accent">equacions</span></h1>' +
      '</div>' +
      // les targetes són el centre; l'itinerari és només una guia discreta
      '<section class="home-path compact" aria-labelledby="path-title">' +
      '<div class="path-head"><h2 id="path-title">Itinerari</h2>' +
      (anyProgress ? '<button class="btn ghost small" id="btn-reset-prog">' + UI().icon('refresh') + 'Esborra el meu progrés</button>' : '') +
      '</div>' +
      '<ol class="path-list">' + pathHTML + '</ol></section>' +
      '<div class="lab-grid">' + cardsHTML + '</div>' +
      '</div>';
    main.appendChild(wrap);
    wrap.addEventListener('click', (e) => {
      const c = e.target.closest('.lab-card');
      if (c) location.hash = '#/' + c.dataset.key;
    });
    const rp = wrap.querySelector('#btn-reset-prog');
    if (rp) rp.addEventListener('click', () => {
      resetProgress(); renderHome(); UI().toast('Progrés esborrat d\'aquest navegador.', 'ok');
    });
    document.title = 'Laboratori d\'equacions · 4t d\'ESO';
  }

  /* ---------- glossari ---------- */
  const GLOSSARY = [
    ['Expressió algebraica', 'Combinació de nombres, lletres i operacions, <b>sense</b> signe d\'igualtat. Exemple: <span class="math">3x + 4</span>.'],
    ['Equació', 'Igualtat entre dues expressions que només es compleix per a certs valors de la incògnita. Exemple: <span class="math">3x + 4 = x + 12</span>.'],
    ['Membre', 'Cada una de les dues expressions que s\'igualen: el <b>membre esquerre</b> (a l\'esquerra del signe =) i el <b>membre dret</b>.'],
    ['Incògnita', 'La lletra (normalment <span class="math"><i>x</i></span>) el valor de la qual volem trobar.'],
    ['Solució o arrel', 'Valor de la incògnita que fa <b>vertadera</b> la igualtat. Per comprovar-ho: substitueix el valor i calcula els dos membres. Exemple: <span class="math">x = 4</span> és solució de <span class="math">3x + 4 = x + 12</span> perquè <span class="math">16 = 16</span>.'],
    ['Conjunt solució', 'El conjunt de totes les solucions. Pot tenir un element, cap, infinites... En els reals s\'escriu amb claus: <span class="math">{4}</span>, <span class="math">∅</span> o <span class="math">ℝ</span>.'],
    ['Identitat', 'Igualtat que es compleix per a <b>qualsevol</b> valor de la incògnita. Exemple: <span class="math">2(x + 1) = 2x + 2</span>. El gràfic: dues rectes que coincideixen.'],
    ['Contradicció', 'Igualtat que no es compleix <b>mai</b>. Exemple: <span class="math">2x + 1 = 2x + 3</span> (dona <span class="math">1 = 3</span>, impossible).'],
    ['Equacions equivalents', 'Dues equacions que tenen <b>exactament el mateix</b> conjunt solució. Sumar o restar el mateix valor als dos membres, o multiplicar-los o dividir-los per un nombre diferent de zero, dona equacions equivalents.'],
    ['Transformació no reversible', 'Operació que pot fer aparèixer o desaparèixer solucions: multiplicar per zero, o multiplicar/dividir per una expressió que contingui la incògnita. Cal analitzar-la amb cura!'],
    ['Inequació', 'Desigualtat amb una incògnita, com <span class="math">−2x + 3 &gt; 7</span>. La solució no és un únic nombre: és un <b>conjunt de valors</b> (un interval).'],
    ['Sentit d\'una desigualtat', 'Quan multipliquem o dividim una inequació per un nombre <b>negatiu</b>, el sentit s\'inverteix: <span class="math">&lt;</span> passa a <span class="math">&gt;</span> i viceversa.'],
    ['Extrem obert / tancat', 'A la recta numèrica, un extrem <b>obert</b> (cercle buit) indica que el valor frontera queda <b>exclòs</b>; un extrem <b>tancat</b> (cercle ple) indica que queda <b>inclòs</b>.'],
    ['Interval', 'Notació d\'un conjunt de valors: <span class="math">(−∞, −2)</span> vol dir «tots els reals més petits que −2»; <span class="math">[2, +∞)</span> vol dir «tots els reals més grans o iguals que 2».'],
    ['Discriminant', 'En una equació <span class="math">ax² + bx + c = 0</span>, la quantitat <span class="math">Δ = b² − 4ac</span>. Si <span class="math">Δ &gt; 0</span>: dues arrels reals diferents; si <span class="math">Δ = 0</span>: una arrel doble; si <span class="math">Δ &lt; 0</span>: cap arrel real.'],
    ['Arrel doble', 'Quan <span class="math">Δ = 0</span>, les dues arrels coincideixen. Gràficament: el vèrtex de la paràbola toca l\'eix X.'],
    ['Paràbola', 'Gràfica de <span class="math">y = ax² + bx + c</span>. Obre cap amunt si <span class="math">a &gt; 0</span> i cap avall si <span class="math">a &lt; 0</span>. Les arrels de l\'equació són els seus talls amb l\'eix X.'],
    ['Vèrtex', 'Punt màxim o mínim de la paràbola: <span class="math">V(−b/2a, f(−b/2a))</span>. Es troba sobre l\'eix de simetria.'],
    ['Factorització', 'Escriure una expressió com a <b>producte</b>. Si <span class="math">A·B = 0</span>, llavors <span class="math">A = 0</span> o <span class="math">B = 0</span>: així es troben les arrels.'],
    ['Sistema d\'equacions', 'Conjunt d\'equacions que s\'han de complir <b>alhora</b>. La solució és una parella <span class="math">(x, y)</span>.'],
    ['Sistema compatible determinat', 'Té una única solució. Gràficament: dues rectes que es tallen en un punt.'],
    ['Sistema compatible indeterminat', 'Té infinites solucions. Gràficament: dues rectes que són <b>la mateixa</b> (coincidents).'],
    ['Sistema incompatible', 'No té cap solució. Gràficament: dues rectes <b>paral·leles</b> diferents.'],
    ['Canvi de variable', 'Tècnica per resoldre equacions biquadrades: posem <span class="math">t = x²</span> i resolem primer l\'equació auxiliar en <span class="math">t</span>.'],
    ['Equació auxiliar', 'L\'equació en <span class="math">t</span> que apareix amb el canvi de variable: <span class="math">at² + bt + c = 0</span>. Només ens serveixen les solucions amb <span class="math">t ≥ 0</span>.']
  ];
  function openGlossary(focusTerm) {
    // ordre alfabètic català (ignora accents i majúscules)
    const sorted = GLOSSARY.slice().sort((a, b) => a[0].localeCompare(b[0], 'ca', { sensitivity: 'base' }));
    const body = sorted.map(([t, d]) =>
      '<div class="gloss-item" id="gloss-' + t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '') + '">' +
      '<div class="gloss-term">' + t + '</div><div class="gloss-def">' + d + '</div></div>').join('');
    const m = L.UI.openModal({
      title: 'Glossari', wide: true, icon: L.UI.icon('book'),
      bodyHTML: '<p class="help-note" style="margin-bottom:8px">Els termes matemàtics que fem servir a tota l\'aplicació.</p>' + body,
      footHTML: '<button class="btn primary" data-action="ok">Tanca</button>',
      actions: [{ id: 'ok', onClick: (mm) => mm.close() }]
    });
    if (typeof focusTerm === 'string') {
      const id = 'gloss-' + focusTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
      const el = m.root.querySelector('#' + id);
      if (el) {
        el.scrollIntoView({ block: 'center' });
        el.style.background = 'var(--amber-soft)';
        el.style.borderRadius = '8px';
        setTimeout(() => { el.style.background = ''; }, 2000);
      }
    }
  }

  /* ---------- amagar respostes: clic per revelar ---------- */
  function bindMaskClicks() {
    document.body.addEventListener('click', (e) => {
      const masked = e.target.closest('[data-answer]:not(.revealed)');
      if (masked && document.body.classList.contains('mask-answers')) {
        masked.classList.add('revealed');
        e.stopPropagation();
      }
    });
  }

  /* ---------- router ---------- */
  function route() {
    if (suppressRoute) return;
    const { key, params } = parseHash();
    if (L.UI && L.UI.closeAllModals) L.UI.closeAllModals(); // cap modal orfe en canviar de context
    if (current && current.cleanup) { try { current.cleanup(); } catch (e) { console.error(e); } current = null; }
    const lab = registry.find(d => d.key === key);
    if (!lab) { renderHeader(null); renderHome(); current = null; return; }
    renderHeader(lab);
    const main = document.getElementById('main');
    main.className = 'app-main';
    main.innerHTML = '';
    document.title = lab.title + ' · Laboratori d\'equacions';
    let cleanup = null;
    try { cleanup = lab.render(main, params) || null; }
    catch (e) {
      console.error(e);
      main.innerHTML = '<div class="home"><div class="card" style="max-width:520px"><h2>Vaja!</h2><p>S\'ha produït un error en obrir aquest laboratori.</p><p><button class="btn primary" onclick="location.hash=\'#/\'">Torna a l\'inici</button></p></div></div>';
    }
    current = { lab, cleanup };
    main.focus({ preventScroll: true });
  }

  /* ---------- incògnites en cursiva ----------
     Molts passos s'escriuen com a text («2x − 3 = −1»): aquí les lletres x, y, t, k soltes
     de qualsevol fórmula passen a cursiva, igual que a les fórmules generades amb fmt. */
  const VAR_RE = /(^|[^A-Za-zÀ-ÿ])([xytk])(?![A-Za-zÀ-ÿ])/;
  function italVars(root) {
    root.querySelectorAll('.math, .fs-math, .math-block').forEach(m => {
      const w = document.createTreeWalker(m, NodeFilter.SHOW_TEXT);
      const todo = [];
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (!n.parentElement.closest('i.var, .mb-note, .fs-why, svg, .sol-chip, .bq-val') && VAR_RE.test(n.nodeValue)) todo.push(n);
      }
      todo.forEach(n => {
        const frag = document.createDocumentFragment();
        let rest = n.nodeValue, mt;
        while ((mt = VAR_RE.exec(rest))) {
          frag.appendChild(document.createTextNode(rest.slice(0, mt.index) + mt[1]));
          const i = document.createElement('i'); i.className = 'var'; i.textContent = mt[2];
          frag.appendChild(i);
          rest = rest.slice(mt.index + mt[0].length);
        }
        frag.appendChild(document.createTextNode(rest));
        n.parentNode.replaceChild(frag, n);
      });
    });
  }
  function watchVars() {
    let queued = false;
    const run = () => { queued = false; italVars(document.body); };
    new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(run); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true });
    run();
  }

  /* ---------- inicialització ---------- */
  function init() {
    loadSettings();
    bindMaskClicks();
    watchVars();
    window.addEventListener('hashchange', route);
    route();
  }

  L.App = { init, registerLab, updateHash, openGlossary, settings, markDone, doneMap, saveReflection, loadReflections };

})(typeof window !== 'undefined' ? window : globalThis);
