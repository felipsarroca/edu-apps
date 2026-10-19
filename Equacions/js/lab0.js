/* ============================================================
   lab0.js — MÒDUL 0 · Què és una equació?
   Experiment central: triar un valor de x i comprovar si fa
   iguals els dos membres (balança, recta numèrica i gràfic).
   Descobriment del conjunt solució: {a}, ℝ (identitat) o ∅.
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, Poly = L.Poly, F = L.fmt, UI = L.UI;

  // els exemples surten del banc comú (js/banc.js)
  const toPoly = (arr) => new Poly(arr.map(v => R.cast(v)));
  const PRESETS = L.BANC.m0.items.map(p => ({
    id: p.id, level: p.level, L: toPoly(p.L), R: toPoly(p.R),
    Ldisp: p.Ldisp ? { k: R.cast(p.Ldisp.k), m: R.cast(p.Ldisp.m) } : null
  }));

  function equationHTML(p) {
    const l = p.Ldisp
      ? '<span class="mterm">' + F.fmtR(p.Ldisp.k) + '(' + F.V('x') + ' + ' + F.fmtR(p.Ldisp.m) + ')</span>'
      : F.fmtPoly(p.L, 'x');
    return '<span class="member-l">' + l + '</span><span class="eq-sign">=</span><span class="member-r">' + F.fmtPoly(p.R, 'x') + '</span>';
  }
  function equationPlain(p) {
    const l = p.Ldisp ? F.fmtValPlain(p.Ldisp.k) + '(x + ' + F.fmtValPlain(p.Ldisp.m) + ')' : F.fmtPolyPlain(p.L);
    return l + ' = ' + F.fmtPolyPlain(p.R);
  }

  function render(main, params) {
    const st = {
      preset: PRESETS[0], x: R.ZERO, tried: new Set(), revealed: false,
      graph: null, nline: null, balance: null, ro: null
    };
    if (params.p) { const f = PRESETS.find(pp => pp.id === params.p); if (f) st.preset = f; }

    main.innerHTML =
      '<div class="lab cols">' +
      '<div class="lab-viewtabs" role="tablist" aria-label="Vistes del laboratori">' +
      '<button data-viewtab="ctrl" type="button">' + UI.icon('arrows') + 'Experimenta</button>' +
      '<button data-viewtab="viz" type="button">' + UI.icon('chart') + 'Visualitza</button></div>' +
      '<div class="lab-left">' +
      '<div class="card"><div class="card-title">' + UI.icon('flask') + 'Tria una equació</div>' +
      '<div id="m0-presets" data-fold></div></div>' +
      '<div class="card"><div class="card-title">' + UI.icon('scale') + 'Prova un valor de x</div>' +
      '<div class="eq-display" id="m0-eq"></div>' +
      '<div class="m0-values">' +
      '<div class="m0-val l"><span class="mv-tag">Membre esquerre</span><span class="mv-expr math" id="m0-lsub"></span><span class="mv-num math" id="m0-lval"></span></div>' +
      '<div class="m0-mid"><span class="m0-eq-badge" id="m0-badge" aria-live="polite">=</span></div>' +
      '<div class="m0-val r"><span class="mv-tag">Membre dret</span><span class="mv-expr math" id="m0-rsub"></span><span class="mv-num math" id="m0-rval"></span></div>' +
      '</div>' +
      '<div class="m0-xrow">' +
      '<span class="m0-xlabel">x =</span>' +
      '<input type="range" id="m0-slider" min="-12" max="12" step="0.5" value="0" aria-label="Valor de x">' +
      '<input type="text" class="m0-xval" id="m0-xinput" value="0" aria-label="Valor exacte de x">' +
      '</div></div>' +
      '<div class="vtabs">' +
      '<div class="vtabs-bar" role="tablist" aria-label="Seccions">' +
      '<button data-tab="reptes" role="tab">Microreptes</button></div>' +
      '<div class="vtabs-panel" data-panel="reptes" id="m0-reptes"></div>' +
      '</div>' +
      '</div>' +
      '<div class="lab-right">' +
      '<div class="viz-card">' +
      '<div class="viz-head">' +
      '<span class="viz-title">' + UI.icon('chart') + 'Vista</span>' +
      '<div class="legend" role="tablist" aria-label="Tipus de visualització">' +
      '<button class="chip on" data-viz="bal" style="min-height:30px;padding:3px 12px">Balança</button>' +
      '<button class="chip" data-viz="recta" style="min-height:30px;padding:3px 12px">Recta numèrica</button>' +
      '<button class="chip" data-viz="graf" style="min-height:30px;padding:3px 12px">Gràfic</button>' +
      '</div></div>' +
      '<div class="viz-body">' +
      '<div class="graph-host" id="m0-bal" style="padding:6px"></div>' +
      '<div class="graph-host" id="m0-recta" style="padding:6px 4px"></div>' +
      '<div class="graph-host" id="m0-graf"></div>' +
      '</div></div>' +
      '<div class="statusbar" id="m0-status"></div>' +
      '<div id="m0-insight"></div>' +
      '</div></div>';

    UI.bindLabViewTabs(main.querySelector('.lab'), 'ctrl', () => equationHTML(st.preset) + '<div style="font-size:.85rem;margin-top:2px">x = ' + F.fmtVal(st.x) + '</div>');
    UI.tabsInit(main.querySelector('.vtabs'));
    UI.foldCard(main.querySelector('.lab-left [data-fold]').closest('.card'), 'm0');
    const el = (id) => main.querySelector('#' + id);

    /* ---- visualitzacions ---- */
    st.balance = new L.Balance(el('m0-bal'));
    st.nline = new L.NumberLine(el('m0-recta'), {
      height: 118,
      onChange: (x) => setX(x)
    });
    st.graph = new L.Graph(el('m0-graf'));

    /* ---- pestanyes de vista ---- */
    const vizBtns = [...main.querySelectorAll('[data-viz]')];
    const vizHosts = { bal: el('m0-bal'), recta: el('m0-recta'), graf: el('m0-graf') };
    function setViz(v) {
      for (const b of vizBtns) b.classList.toggle('on', b.dataset.viz === v);
      for (const k in vizHosts) vizHosts[k].style.display = k === v ? '' : 'none';
      if (v === 'graf') st.graph.render();
      if (v === 'recta') st.nline.render();
      if (v === 'bal') st.balance.render();
    }
    vizBtns.forEach(b => b.addEventListener('click', () => setViz(b.dataset.viz)));
    setViz('bal');

    /* ---- presets ---- */
    const picker = UI.levelPicker(el('m0-presets'), {
      groups: L.BANC.m0.groups,
      items: PRESETS.map(p => ({ id: p.id, level: p.level, title: equationPlain(p) })),
      onPick: (id) => {
        st.preset = PRESETS.find(p => p.id === id); st.tried = new Set(); st.revealed = false;
        updateHash();
        refresh(true);
      }
    });
    const guide = UI.guide(el('m0-insight'), ['Prova valors', 'Troba la solució', 'Microreptes']);

    /* ---- control de x ---- */
    const slider = el('m0-slider'), xinput = el('m0-xinput');
    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      let r; try { r = R.num(Math.round(v * 2) / 2); } catch (e) { return; }
      setX(r, 'slider');
    });
    xinput.addEventListener('change', () => {
      try { setX(R.parse(xinput.value), 'input'); }
      catch (e) { UI.toast('No he entès el valor. Prova 4, −2, 1/2 o 1,5.', 'warn'); xinput.value = F.fmtValPlain(st.x); }
    });
    xinput.addEventListener('keydown', (e) => { if (e.key === 'Enter') xinput.blur(); });

    function setX(x, src) {
      if (Math.abs(x.toNumber()) > 50) { UI.toast('Me\'l queda una mica lluny... prova valors entre −50 i 50.', 'warn'); return; }
      st.x = x;
      if (src !== 'input') xinput.value = F.fmtValPlain(x);
      slider.value = String(x.toNumber());
      st.tried.add(x.toString());
      refresh();
      updateHash();
    }

    function solucionat() { return L.solvePolyPair(st.preset.L, st.preset.R); }

    function refresh(full) {
      const p = st.preset, x = st.x;
      const lv = p.L.eval(x), rv = p.R.eval(x);
      const eq = lv.eq(rv);

      /* equació + valors */
      el('m0-eq').innerHTML = equationHTML(p);
      const lsub = p.Ldisp
        ? F.fmtR(p.Ldisp.k) + '·(' + F.fmtVal(x) + ' + ' + F.fmtR(p.Ldisp.m) + ') = ' + F.fmtVal(lv)
        : F.fmtSubstitution(p.L, x) + ' = ' + F.fmtVal(lv);
      el('m0-lsub').innerHTML = lsub;
      el('m0-rsub').innerHTML = F.fmtSubstitution(p.R, x) + ' = ' + F.fmtVal(rv);
      el('m0-lval').innerHTML = F.fmtVal(lv);
      el('m0-rval').innerHTML = F.fmtVal(rv);
      const badge = el('m0-badge');
      badge.textContent = eq ? '=' : '≠';
      badge.className = 'm0-eq-badge ' + (eq ? 'eq' : 'neq');
      badge.setAttribute('aria-label', eq ? 'els dos membres són iguals' : 'els dos membres són diferents');
      picker.setActive(p.id);

      /* estat de descobriment */
      const sol = solucionat();
      let found = st.revealed;
      if (sol.kind === 'unique' && sol.roots.some(rr => rr.eq(x))) found = true;
      if (sol.kind === 'all' && st.tried.size >= 3) found = true;
      if (sol.kind === 'none' && st.tried.size >= 3) found = true;

      /* statusbar */
      const sb = el('m0-status');
      let solHTML;
      if (sol.kind === 'unique') solHTML = '<span class="sol-chip math">{ ' + F.fmtVal(sol.roots[0]) + ' }</span> <span class="sc-note">una única solució</span>';
      else if (sol.kind === 'all') solHTML = '<span class="sol-chip">ℝ</span> <span class="sc-note">tots els nombres reals (identitat)</span>';
      else solHTML = '<span class="sol-chip none">∅</span> <span class="sc-note">cap valor la compleix (contradicció)</span>';
      sb.innerHTML =
        '<span class="sb-item"><span class="sb-label">Conjunt solució</span>' +
        (found ? '<span data-answer>' + solHTML + '</span>'
          : '<span class="badge neutral">' + UI.icon('target') + ' explora per descobrir-lo</span>' +
          '<button class="btn ghost small" id="m0-reveal">Mostra\'l</button>') +
        '</span>' +
        // provar uns quants valors no demostra res: per a identitats i contradiccions cal l'àlgebra
        (found && sol.kind !== 'unique' ? '<button class="btn soft small" id="m0-proof">' + UI.icon('bulb') + 'Demostra-ho</button>' : '');
      if (!found) {
        const rb = sb.querySelector('#m0-reveal');
        if (rb) rb.addEventListener('click', () => { st.revealed = true; refresh(); });
      }
      const pb = sb.querySelector('#m0-proof');
      if (pb) pb.addEventListener('click', proof);

      /* guia: un sol missatge curt */
      const step = quizDone() ? 4 : found ? 3 : st.tried.size > 1 ? 2 : 1;
      if (eq && sol.kind === 'unique') {
        guide.set(step, '<b>Sí!</b> Amb <span class="math">x = ' + F.fmtVal(x) + '</span> els dos costats valen <span class="math">' + F.fmtVal(lv) + '</span>. És la solució.', 'ok');
      } else if (sol.kind === 'all') {
        guide.set(step, found ? 'Sembla que <b>tots</b> funcionen. Però provar valors no ho demostra: toca <b>Demostra-ho</b>.' : 'Prova diversos valors. Què hi observes?', found ? 'ok' : '');
      } else if (sol.kind === 'none') {
        guide.set(step, found ? 'Sembla que <b>cap</b> funciona. Provar valors no ho demostra: toca <b>Demostra-ho</b>.' : 'Prova diversos valors. Algun funciona?', found ? 'warn' : '');
      } else {
        const d = lv.sub(rv);
        guide.set(step, 'No és solució. Prova un valor més <b>' + (d.isNeg() ? 'gran' : 'petit') + '</b>.');
      }

      /* balança */
      st.balance.setSides(equationPlain(p).split(' = ')[0], lv.toNumber(), F.fmtPolyPlain(p.R), rv.toNumber(), F.fmtValPlain(lv), F.fmtValPlain(rv));

      /* recta numèrica */
      const pts = [];
      if (sol.kind === 'unique' && found) pts.push({ x: sol.roots[0].toNumber(), ok: true, label: 'solució' });
      st.nline.autoRange([x.toNumber(), ...(sol.kind === 'unique' ? [sol.roots[0].toNumber()] : [8, -8])], 3);
      st.nline.setPoints(pts);
      st.nline.setMarker({
        x: x.toNumber(), color: eq ? '#ef9f17' : '#1d5fd6', halo: eq,
        label: 'x = ' + F.fmtValPlain(x)
      });
      if (sol.kind === 'all' && found) st.nline.band = { x0: st.nline.range.min, x1: st.nline.range.max, color: '#ef9f17' };
      else st.nline.band = null;
      st.nline.setAriaLabel('Recta numèrica amb el valor x = ' + F.fmtValPlain(x) +
        (eq ? ', que és solució' : ', que no és solució'));

      /* gràfic */
      const g = st.graph;
      g.clearData();
      g.addVGuide(x.toNumber(), { color: eq ? '#b26a05' : '#8a97a8', label: 'x = ' + F.fmtValPlain(x) });
      g.addCurve(p.L.toFn(), { color: '#1d5fd6', width: 4.5 });
      g.addCurve(p.R.toFn(), { color: '#0d9463', width: 4.5 });
      g.setReadout({
        items: [
          { label: 'y₁', color: '#1d5fd6', ink: '#14418f', fn: p.L.toFn() },
          { label: 'y₂', color: '#0d9463', ink: '#0a6e4a', fn: p.R.toFn() }
        ], eq: true
      });
      const feats = [{ x: 0, y: 0 }, { x: x.toNumber(), y: lv.toNumber() }];
      if (sol.kind === 'unique') {
        const yStar = p.L.eval(sol.roots[0]).toNumber();
        feats.push({ x: sol.roots[0].toNumber(), y: yStar });
        g.addMark(sol.roots[0].toNumber(), yStar, {
          color: '#ef9f17', label: '(' + F.fmtValPlain(sol.roots[0]) + ', ' + F.fmtValPlain(p.L.eval(sol.roots[0])) + ')'
        });
      }
      if (sol.kind === 'all') {
        // les rectes coincideixen: marquem un parell de punts de contacte
        g.addMark(2, p.L.eval(R.num(2)).toNumber(), { color: '#0d9463', r: 5, label: null });
      }
      g.setAriaLabel('Gràfic de les rectes y = ' + F.fmtPolyPlain(p.L) + ' (blava) i y = ' + F.fmtPolyPlain(p.R) + ' (verda)' +
        (sol.kind === 'unique' ? '. Es tallen al punt d\'abscissa x = ' + F.fmtValPlain(sol.roots[0]) : sol.kind === 'all' ? '. Les dues rectes coincideixen.' : '. Les rectes són paral·leles i no es tallen.'));
      if (!g.userView || full) g.autoFit(feats);
      else g.render();
    }

    /* ---- demostració algebraica (identitat o contradicció) ---- */
    function proof() {
      const p = st.preset;
      const sol = solucionat();
      const k = p.L.sub(p.R).coef(0); // el que queda en restar el membre dret: la x desapareix
      const lines = [];
      if (p.Ldisp) lines.push(F.fmtR(p.Ldisp.k) + '(x + ' + F.fmtR(p.Ldisp.m) + ') = ' + F.fmtPoly(p.R, 'x') + ' &nbsp;<span class="fs-why">(desenvolupo el parèntesi)</span>');
      lines.push(F.fmtPoly(p.L, 'x') + ' = ' + F.fmtPoly(p.R, 'x'));
      lines.push(F.fmtPoly(p.L, 'x') + ' <span class="hl">− (' + F.fmtPoly(p.R, 'x') + ')</span> = ' + F.fmtPoly(p.R, 'x') + ' <span class="hl">− (' + F.fmtPoly(p.R, 'x') + ')</span>');
      lines.push('<b>' + F.fmtR(k) + ' = 0</b>');
      UI.openModal({
        title: sol.kind === 'all' ? 'Per què funciona amb tots els nombres?' : 'Per què no funciona amb cap nombre?', icon: UI.icon('bulb'),
        bodyHTML:
          '<p>Has provat ' + st.tried.size + ' valors. Però hi ha <b>infinits</b> nombres i no els podem provar tots. L\'àlgebra ho demostra per a tots alhora.</p>' +
          '<div class="math-block">' + lines.join('<br>') + '</div>' +
          (sol.kind === 'all'
            ? '<p>La <i>x</i> desapareix i queda <b>0 = 0</b>, que és cert sempre. Per tant, <b>qualsevol</b> valor de <i>x</i> és solució: és una <b>identitat</b>.</p>'
            : '<p>La <i>x</i> desapareix i queda <b>' + F.fmtR(k) + ' = 0</b>, que és fals sempre. Per tant, <b>cap</b> valor de <i>x</i> és solució: és una <b>contradicció</b>.</p>') +
          '<p class="help-note"><b>Model de frase:</b> «Si resto ' + F.fmtPolyPlain(p.R) + ' als dos membres, la x desapareix i queda ' + F.fmtValPlain(k) + ' = 0, que és ' + (sol.kind === 'all' ? 'cert' : 'fals') + ' per a qualsevol x.»</p>',
        footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
    }

    /* ---- microreptes ---- */
    const QUIZ = [
      {
        q: '«5x − 3» — és una equació o una expressió algebraica?',
        opts: [
          { label: 'Una equació', correct: false, why: 'No hi ha cap signe d\'igualtat: no podem parlar de solucions.' },
          { label: 'Una expressió algebraica', correct: true, why: 'Exacte: només té termes i operacions, sense signe igual.' }
        ]
      },
      {
        q: '«5x − 3 = 12» — i ara?',
        opts: [
          { label: 'Una equació', correct: true, why: 'Sí: hi ha una igualtat entre el membre esquerre «5x − 3» i el dret «12».' },
          { label: 'Una expressió', correct: false, why: 'Conté el signe «=»: ja és una igualtat, no una simple expressió.' }
        ]
      },
      {
        q: 'És <span class="math">x = 4</span> solució de <span class="math">3x + 4 = x + 12</span>?',
        opts: [
          { label: 'Sí', correct: true, why: 'Substituïm: 3·4 + 4 = 16 i 4 + 12 = 16. Com que 16 = 16, sí que ho és.' },
          { label: 'No', correct: false, why: 'Comprova-ho substituint: 3·(4) + 4 = 16 i (4) + 12 = 16. Sí que ho és!' }
        ]
      },
      {
        q: 'És <span class="math">x = 2</span> solució de <span class="math">3x + 4 = x + 12</span>?',
        opts: [
          { label: 'Sí', correct: false, why: 'Substituïm: 3·2 + 4 = 10 i 2 + 12 = 14. Com que 10 ≠ 14, no ho és.' },
          { label: 'No', correct: true, why: 'Molt bé: 3·(2) + 4 = 10 però 2 + 12 = 14. No ho és.' }
        ]
      },
      {
        q: 'És <span class="math">x = 7</span> solució de <span class="math">2(x + 1) = 2x + 2</span>?',
        opts: [
          { label: 'Sí', correct: true, why: 'Sí! I el 3, i el −5, i el 0,2... Tots els valors ho són: és una identitat.' },
          { label: 'No', correct: false, why: 'Substituïm: 2·(7+1) = 16 i 2·7 + 2 = 16. Sí que ho és... com qualsevol altre valor!' }
        ]
      },
      {
        q: 'Quantes solucions té <span class="math">x + 3 = 8</span>?',
        opts: [
          { label: 'Una', correct: true, why: 'Només x = 5: és l\'únic valor que fa iguals els dos membres.' },
          { label: 'Cap', correct: false, why: 'Prova x = 5: 5 + 3 = 8. Sí que en té, exactament una.' },
          { label: 'Totes', correct: false, why: 'Amb x = 0: 0 + 3 = 3 ≠ 8. No totes, només una.' }
        ]
      },
      {
        q: 'Quantes solucions té <span class="math">2(x + 1) = 2x + 2</span>?',
        opts: [
          { label: 'Una', correct: false, why: 'Si x = 0 funciona i x = 10 també... no pot ser només una!' },
          { label: 'Cap', correct: false, why: 'Prova qualsevol valor: sempre els dos membres surten iguals.' },
          { label: 'Totes (infinites)', correct: true, why: 'És una identitat: qualsevol nombre real és solució.' }
        ]
      },
      {
        q: 'Quantes solucions té <span class="math">x + 1 = x + 2</span>?',
        opts: [
          { label: 'Una', correct: false, why: 'Restant x als dos membres queda 1 = 2: impossible per a qualsevol x.' },
          { label: 'Cap', correct: true, why: 'Molt bé: és una contradicció, cap valor la compleix.' },
          { label: 'Totes', correct: false, why: 'Amb x = 0: 1 ≠ 2. No es compleix mai.' }
        ]
      }
    ];
    // les preguntes fallades tornen a sortir al final: es demostra la comprensió, no l'eliminació
    let queue = QUIZ.map((q, i) => i);
    const solved = new Set();
    function quizDone() { return !queue.length; }
    const quizHost = el('m0-reptes');
    function nextQuiz() {
      quizHost.innerHTML = '';
      if (quizDone()) {
        quizHost.innerHTML = '<div class="challenge-card"><div class="ch-head"><span class="ch-num">✓</span>' +
          '<span class="ch-title">Microreptes completats!</span></div>' +
          '<div class="ch-desc">Ja distingeixes expressió, equació, identitat i contradicció, i saps comprovar solucions per substitució. ' +
          'Continua amb el <b>Mòdul 1</b>: transformacions equivalents!</div>' +
          '<div class="btn-row"><a class="btn primary" href="#/m1">Ves al Mòdul 1</a>' +
          '<button class="btn ghost" id="m0-quiz-restart">Repeteix els microreptes</button></div></div>';
        const rb = quizHost.querySelector('#m0-quiz-restart');
        if (rb) rb.addEventListener('click', () => { queue = QUIZ.map((q, i) => i); solved.clear(); nextQuiz(); });
        return;
      }
      const qi = queue[0];
      const q = QUIZ[qi];
      const card = UI.renderPrediction({
        question: '<span class="m0-quiz-n">' + (solved.size + 1) + '/' + QUIZ.length + '</span> ' + q.q,
        options: q.opts, continueLabel: 'Següent ▸',
        onDone: (ok) => {
          queue.shift();
          if (ok) { solved.add(qi); L.App.markDone('m0', 'q' + qi); }
          else queue.push(qi); // la tornarà a veure més endavant
          nextQuiz(); if (quizDone()) refresh();
        }
      });

      quizHost.appendChild(card);
    }
    nextQuiz();

    /* ---- hash ---- */
    function updateHash() {
      L.App.updateHash({ p: st.preset.id, x: F.fmtValPlain(st.x).replace('\u2212', '-') });
    }
    if (params.x) { try { st.x = R.parse(params.x); } catch (e) { } }
    slider.value = String(st.x.toNumber());
    xinput.value = F.fmtValPlain(st.x);
    refresh(true);
    updateHash();

    /* ---- «Explica-m'ho» en català senzill ---- */
    UI.addExplain(main.querySelector('.viz-head'), () => {
      const p = st.preset, x = F.fmtValPlain(st.x);
      const lv = p.L.eval(st.x), rv = p.R.eval(st.x);
      return [
        'L\'equació és <b>' + equationPlain(p) + '</b>.',
        'Ara la <b>x</b> val <b>' + x + '</b>.',
        'El costat esquerre val <b>' + F.fmtValPlain(lv) + '</b>. El costat dret val <b>' + F.fmtValPlain(rv) + '</b>.',
        lv.eq(rv)
          ? 'Els dos costats valen igual. Per tant, x = ' + x + ' <b>és una solució</b>.'
          : 'Els dos costats no valen igual. Per tant, x = ' + x + ' <b>no és una solució</b>. Prova un altre nombre.',
        'A la balança: el costat que val més baixa. Si els dos valen igual, la balança queda recta.'
      ];
    });

    return function cleanup() {
      try { st.graph.destroy(); } catch (e) { }
      try { st.nline.destroy(); } catch (e) { }
      try { st.balance.destroy(); } catch (e) { }
    };
  }

  function help() {
    UI.openModal({
      title: 'Què és una equació? · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>Definicions clau.</b> Una <b>expressió algebraica</b> combina nombres i lletres amb operacions, però no té signe d\'igualtat. Una <b>equació</b> és una <b>igualtat</b> entre dues expressions, el <b>membre esquerre</b> i el <b>membre dret</b>.</p>' +
      '<p>Un valor de la incògnita és <b>solució</b> (o <b>arrel</b>) de l\'equació si, en substituir-lo, els dos membres prenen el mateix valor. Comprovar-ho és fàcil: substitueix, calcula cada membre per separat i compara.</p>' +
      '<div class="math-block"><span class="mb-note">exemple complet</span>' +
      'És x = 4 solució de 3x + 4 = x + 12?<br>' +
      '<span class="member-l">3·4 + 4 = 16</span> <span class="eq-sign">=</span> <span class="member-r">4 + 12 = 16</span><br>' +
      'Sí: com que 16 = 16, x = 4 és solució.</div>' +
      '<p>Segons el conjunt solució, una equació pot ser: de <b>solució única</b> (el cas més corrent), una <b>identitat</b> (tots els reals, com 2(x+1) = 2x+2) o una <b>contradicció</b> (cap valor, com 2x+1 = 2x+3).</p>' +
      '<p class="help-note"><b>Com funciona aquest laboratori?</b> Llisca el valor de <i>x</i> i observa la balança, la recta numèrica i el gràfic: tot s\'actualitza alhora perquè totes les representacions descriuen <b>el mateix estat matemàtic</b>.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'm0', kind: 'concept', num: 'M0', short: 'Què és?', goals: 8, goalName: 'microreptes', goalSuffix: ' fets',
    title: 'Què és una equació?', sub: 'Mòdul 0 · solucions per substitució',
    desc: 'Quan és solució un nombre? Ho veuràs a la balança.',
    foot: 'El fonament de tota la resta',
    badge: 'Comença aquí',
    iconHTML: '0',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
