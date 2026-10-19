/* ============================================================
   lab2.js — MÒDUL 2 · Inequacions de primer grau
   Opera als dos membres; en multiplicar o dividir per un
   negatiu, predicció prèvia i inversió automàtica del signe.
   Recta numèrica amb extrems oberts/tancats + prova de valors.
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, Poly = L.Poly, F = L.fmt, UI = L.UI;

  // els exemples surten del banc comú (js/banc.js)
  const PRESETS = L.BANC.m2.items;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // inequació nova amb frontera entera; la meitat de les vegades amb coeficient negatiu
  function randomIneq() {
    const a = (Math.random() < .5 ? -1 : 1) * rnd(1, 5), x0 = rnd(-5, 5), b = rnd(-8, 8);
    return { a, b, sign: ['<', '>', '<=', '>='][rnd(0, 3)], c: a * x0 + b };
  }

  function render(main, params) {
    const P0 = PRESETS[0];
    const st = {
      hist: [{ a: R.cast(P0.a), b: R.cast(P0.b), sign: P0.sign, c: R.cast(P0.c), op: null, presetId: P0.id }],
      cursor: 0, opKind: 'add',
      nline: null, graph: null,
      chal: { c1: false, c2: false, c3: false }, probes: { bound: false, near: false }, askedPos: false, askedNeg: false
    };
    Object.assign(st.chal, L.App.doneMap('m2'));

    main.innerHTML =
      '<div class="lab cols">' +
      '<div class="lab-viewtabs" role="tablist" aria-label="Vistes del laboratori">' +
      '<button data-viewtab="ctrl" type="button">' + UI.icon('arrows') + 'Inequació i operacions</button>' +
      '<button data-viewtab="viz" type="button">' + UI.icon('chart') + 'Recta i gràfic</button></div>' +
      '<div class="lab-left">' +
      '<div class="card"><div class="card-title">' + UI.icon('flask') + 'Inequació</div>' +
      '<div id="l2-presets" data-fold></div>' +
      '<div class="eq-display" id="l2-eq" style="margin-top:12px"></div>' +
      '<div id="l2-coefs" data-fold style="margin-top:6px"></div>' +
      '<div data-fold style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px">' +
      '<span class="help-note" style="font-weight:700">signe:</span>' +
      '<div class="sign-picker" role="group" aria-label="Signe de la desigualtat">' +
      '<button data-sign="<" aria-label="més petit">&lt;</button>' +
      '<button data-sign=">" aria-label="més gran">&gt;</button>' +
      '<button data-sign="<=" aria-label="més petit o igual">≤</button>' +
      '<button data-sign=">=" aria-label="més gran o igual">≥</button>' +
      '</div></div></div>' +
      '<div class="card"><div class="card-title">' + UI.icon('steps') + 'Opera als dos costats</div>' +
      '<div class="op-panel">' +
      '<div class="op-btns" role="group" aria-label="Operació">' +
      '<button class="op-btn" data-op="add" aria-label="Suma">+</button>' +
      '<button class="op-btn" data-op="sub" aria-label="Resta">−</button>' +
      '<button class="op-btn" data-op="mul" aria-label="Multiplica">×</button>' +
      '<button class="op-btn" data-op="div" aria-label="Divideix">÷</button>' +
      '</div>' +
      '<input class="input op-operand math" id="l2-operand" placeholder="p. ex. 3 o −2" aria-label="Operand">' +
      '<button class="btn primary" id="l2-apply">Aplica</button>' +
      '</div>' +
      '<div class="op-msg" id="l2-opmsg" role="alert"></div>' +
      '<div id="l2-reflhost" style="margin-top:8px"></div>' +
      '<div class="step-ctl" style="margin-top:8px">' +
      '<button class="btn ghost small" id="l2-undo">' + UI.icon('undo') + 'Desfés</button>' +
      '<button class="btn ghost small" id="l2-reset">' + UI.icon('refresh') + 'Reinicia</button>' +
      '<button class="btn soft small" id="l2-whyflip">' + UI.icon('bulb') + 'Per què es gira el signe?</button>' +
      '</div></div>' +
      '<div class="vtabs">' +
      '<div class="vtabs-bar" role="tablist" aria-label="Seccions">' +
      '<button data-tab="passos" role="tab">Passos</button>' +
      '<button data-tab="prova" role="tab">Prova valors</button>' +
      '<button data-tab="reptes" role="tab">Reptes <span class="tab-count" id="l2-chalcount"></span></button></div>' +
      '<div class="vtabs-panel" data-panel="passos"><div class="step-list" id="l2-steps"></div></div>' +
      '<div class="vtabs-panel" data-panel="prova" id="l2-prova"></div>' +
      '<div class="vtabs-panel" data-panel="reptes" id="l2-chal"></div>' +
      '</div></div>' +
      '<div class="lab-right">' +
      '<div class="viz-card">' +
      '<div class="viz-head">' +
      '<span class="viz-title">' + UI.icon('chart') + 'Recta numèrica i gràfic</span>' +
      '<div class="legend">' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#ef9f17"></span>solucions</span>' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#1d5fd6"></span>membre esquerre</span>' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#0d9463"></span>membre dret</span>' +
      '</div></div>' +
      // les dues vistes alhora: la franja de la recta numèrica és la mateixa que la del gràfic
      '<div class="viz-body m2-split">' +
      '<div class="graph-host m2-recta" id="l2-recta"></div>' +

      '<div class="graph-host m2-graf" id="l2-graf"></div>' +
      '</div></div>' +
      '<div class="statusbar" id="l2-status"></div>' +
      '<div id="l2-insight"></div>' +
      '</div></div>';

    UI.bindLabViewTabs(main.querySelector('.lab'), 'ctrl', () => el('l2-eq').innerHTML);
    const tabs = UI.tabsInit(main.querySelector('.vtabs'));
    UI.foldCard(main.querySelector('.lab-left [data-fold]').closest('.card'), 'm2');
    const el = (id) => main.querySelector('#' + id);
    const guide = UI.guide(el('l2-insight'), ['Aïlla la x', 'Vigila el signe', 'Comprova']);
    // mateixos marges laterals que el gràfic (pad.l = 46, pad.r = 16): la recta i el gràfic queden alineats
    st.nline = new L.NumberLine(el('l2-recta'), { height: 128, readonly: true, padL: 46, padR: 16 });
    st.graph = new L.Graph(el('l2-graf'));
    // cada vegada que el gràfic es redibuixa (també en arrossegar o fer zoom), la recta copia el seu interval de x
    st.graph.onRenderCb = () => {
      const v = st.graph.view;
      st.nline.setRange(v.x0, v.x1);
      st.nline.render();
    };

    function cur() { return st.hist[st.cursor]; }
    function loadPreset(id, data) {
      const p = data || PRESETS.find(pp => pp.id === id) || PRESETS[0];
      st.hist = [{ a: R.cast(p.a), b: R.cast(p.b), sign: p.sign, c: R.cast(p.c), op: null, presetId: data ? 'lliure' : p.id }];
      st.cursor = 0;
      el('l2-reflhost').innerHTML = '';
      renderPresets(data ? 'lliure' : p.id);
      refresh(true);
    }

    /* ---- presets ---- */
    const picker = UI.levelPicker(el('l2-presets'), {
      groups: L.BANC.m2.groups,
      items: PRESETS.map(p => ({ id: p.id, level: p.level, title: F.fmtPolyPlain(Poly.linear(R.cast(p.a), R.cast(p.b))) + ' ' + L.SIGN_NAME[p.sign] + ' ' + F.fmtValPlain(R.cast(p.c)) })),
      onPick: (id) => { loadPreset(id); updateHash(); },
      onRandom: () => { loadPreset(null, randomIneq()); updateHash(); }
    });
    function renderPresets(activeId) { picker.setActive(activeId); }

    /* ---- controls de coeficients ---- */
    const coefs = el('l2-coefs');
    function bindCoef(name, get, set) {
      const row = UI.coefRow({
        name, value: get(), min: name === 'c' ? -20 : -10, max: name === 'c' ? 20 : 10, step: 1,
        onChange: (r, src) => {
          if (src === 'init') return; // la initView no és una edició
          set(r); refresh(); updateHash();
        },
        warn: (r) => (name === 'a' && r.isZero()) ? 'Amb a = 0 no hi ha incògnita: la desigualtat serà sempre certa o sempre falsa.' : null
      });
      coefs.appendChild(row);
      return row;
    }
    const rows = {
      a: bindCoef('a', () => cur().a, (r) => { cur().a = r; }),
      b: bindCoef('b', () => cur().b, (r) => { cur().b = r; }),
      c: bindCoef('c', () => cur().c, (r) => { cur().c = r; })
    };
    // nota: editar coeficients modifica l'estat ACTUAL sense tocar la història

    const signBtns = [...main.querySelectorAll('.sign-picker button')];
    signBtns.forEach(b => b.addEventListener('click', () => {
      cur().sign = b.dataset.sign;
      refresh(); updateHash();
    }));

    /* ---- operacions ---- */
    const opBtns = [...main.querySelectorAll('.op-btn')];
    opBtns.forEach(b => b.addEventListener('click', () => {
      st.opKind = b.dataset.op;
      opBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    opBtns[0].setAttribute('aria-pressed', 'true');
    const operandInput = el('l2-operand');
    el('l2-apply').addEventListener('click', tryApply);
    operandInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryApply(); });

    async function tryApply() {
      const raw = operandInput.value.trim();
      if (!raw) { showOpMsg('Escriu un nombre (p. ex. 3, −2, 1/2).'); return; }
      let k;
      try { k = R.parse(raw); } catch (e) { showOpMsg(e.message); return; }
      const kind = st.opKind;
      if ((kind === 'mul' || kind === 'div') && k.isZero()) {
        showOpMsg(kind === 'div' ? 'No es pot dividir per zero.' : 'Multiplicar per zero no és equivalent: destrueix la informació (com al Mòdul 1).');
        return;
      }
      showOpMsg('');
      // la hipòtesi només es demana la primera vegada amb un positiu i la primera amb un negatiu;
      // després n'hi ha prou amb un avís breu al costat de l'operació
      const scaling = kind === 'mul' || kind === 'div';
      const neg = k.isNeg();
      const firstTime = scaling && !(neg ? st.askedNeg : st.askedPos);
      let hyp = null;
      if (firstTime) {
        hyp = await predictFlip(k, kind);
        if (!hyp) return; // ha tancat la finestra sense respondre
        if (neg) st.askedNeg = true; else st.askedPos = true;
      }
      applyOp(kind, k);
      operandInput.value = '';
      const host = el('l2-reflhost');
      if (hyp) {
        const flipped = neg;
        UI.reflect(host, {
          ok: hyp.ok, lab: 'm2', said: hyp.said, happened: flipped ? 'El signe s\'ha girat' : 'El signe no ha canviat',
          why: flipped ? 'Has ' + (kind === 'mul' ? 'multiplicat' : 'dividit') + ' per un nombre <b>negatiu</b>: l\'ordre dels nombres s\'inverteix.'
            : 'Has ' + (kind === 'mul' ? 'multiplicat' : 'dividit') + ' per un nombre <b>positiu</b>: l\'ordre es manté.'
        });
      } else if (scaling) {
        host.innerHTML = '<div class="op-note' + (neg ? ' flip' : '') + '">' + (kind === 'mul' ? 'Multipliquem' : 'Dividim') +
          ' per <span class="math">' + F.fmtR(k) + '</span>: ' + (neg ? '<b>invertim el signe</b>.' : 'el signe es manté.') + '</div>';
      } else host.innerHTML = '';
    }
    function showOpMsg(m) { el('l2-opmsg').textContent = m; }

    // hipòtesi abans d'operar; retorna { ok, said } o null si es tanca la finestra
    function predictFlip(k, kind) {
      const neg = k.isNeg();
      return new Promise((resolve) => {
        let answer = null;
        const m = UI.openModal({
          title: 'Abans d\'aplicar-ho: què creus que passarà?', icon: UI.icon('predict'),
          bodyHTML: '<div id="l2-pred"></div>',
          footHTML: '',
          onClose: () => resolve(answer)
        });
        const opts = [
          { label: UI.pic('flipNo', 'No, es manté igual'), correct: !neg },
          { label: UI.pic('flipYes', 'Sí, s\'inverteix'), correct: neg },
          { label: 'Depèn de la x', correct: false }
        ];
        const card = UI.renderPrediction({
          mode: 'hypothesis',
          question: 'Vols <b>' + (kind === 'mul' ? 'multiplicar' : 'dividir') + '</b> els dos membres per <span class="math">' + F.fmtR(k) +
            '</span>. Canviarà el sentit de la desigualtat?',
          options: opts,
          continueLabel: 'Aplica-ho i comprova-ho ▸',
          onDone: (ok, i) => { answer = { ok, said: UI.labelText(opts[i].label) }; m.close(); }
        });
        m.dialog.querySelector('#l2-pred').appendChild(card);
      });
    }

    function applyOp(kind, k) {
      const c = { ...cur() };
      let flipped = false;
      if (kind === 'add') { c.b = c.b.add(k); c.c = c.c.add(k); }
      else if (kind === 'sub') { c.b = c.b.sub(k); c.c = c.c.sub(k); }
      else if (kind === 'mul') {
        c.a = c.a.mul(k); c.b = c.b.mul(k); c.c = c.c.mul(k);
        if (k.isNeg()) { c.sign = L.SIGN_FLIP[c.sign]; flipped = true; }
      } else {
        c.a = c.a.div(k); c.b = c.b.div(k); c.c = c.c.div(k);
        if (k.isNeg()) { c.sign = L.SIGN_FLIP[c.sign]; flipped = true; }
      }
      st.hist = st.hist.slice(0, st.cursor + 1);
      st.hist.push({ ...c, op: { kind, k, flipped } });
      st.cursor = st.hist.length - 1;
      refresh();
      if (flipped) {
        // el signe fa una volta per fer visible la inversió
        const signEl = el('l2-eq').querySelector('.eq-sign');
        if (signEl) signEl.classList.add('flip-anim');
      }
    }

    el('l2-undo').addEventListener('click', () => { if (st.cursor > 0) { st.cursor--; refresh(); } });
    el('l2-reset').addEventListener('click', () => { st.cursor = 0; refresh(); });
    el('l2-whyflip').addEventListener('click', whyFlip);

    function whyFlip() {
      UI.openModal({
        title: 'Per què s\'inverteix el sentit?', wide: true, icon: UI.icon('bulb'),
        bodyHTML:
        '<p>Pensa en la <b>recta numèrica</b>: els negatius van cap a l\'esquerra. Multiplicar per un nombre negatiu fa un <b>canvi de signe</b> que «gira» la recta: el que era més gran queda més petit.</p>' +
        '<div class="math-block">2 &lt; 5 <span class="hl">és cert</span><br>' +
        '2·(−3) = −6 i 5·(−3) = −15<br>' +
        '−6 &gt; −15 <span class="hl">el sentit s\'ha invertit!</span></div>' +
        '<div id="l2-whyflip-nl" class="mini-graph-host"></div>' +
        '<p class="help-note">Amb ≤ i ≥ passa exactament el mateix: ≥ es converteix en ≤ i al revés. En canvi, <b>sumar o restar</b> un nombre (positiu o negatiu!) <b>mai</b> no canvia el sentit: tothom es mou igual cap a un costat.</p>',
        footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
      const host = document.getElementById('l2-whyflip-nl');
      if (host) {
        const nl = new L.NumberLine(host, { height: 86, readonly: true });
        nl.setRange(-17, 8, 3);
        nl.setPoints([
          { x: -15, ok: false, label: '−15' },
          { x: -6, ok: true, label: '−6' },
          { x: 2, ok: true, label: '2' },
          { x: 5, ok: false, label: '5' }
        ]);
        nl.render();
      }
    }

    /* ---- prova de valors ---- */
    const prova = el('l2-prova');
    prova.innerHTML =
      '<div class="checker">' +
      '<div class="ck-inputrow">' +
      '<label for="l2-pv" class="help-note">És solució aquest valor?</label>' +
      '<input class="input math" id="l2-pv" placeholder="p. ex. −3">' +
      '<button class="btn primary small" id="l2-pvgo">Comprova</button>' +
      '<button class="btn ghost small" id="l2-pvb">Prova la frontera</button>' +
      '</div><div class="ck-result" id="l2-pvres"></div>' +

      '</div>';
    function testValue(x) {
      const c = cur();
      const sol = L.solveInequality(c.a, c.b, c.sign, c.c);
      let inside;
      if (sol.kind === 'all') inside = true;
      else if (sol.kind === 'empty') inside = false;
      else {
        const v = c.a.mul(x).add(c.b), cc = c.c;
        inside = { '<': v.lt(cc), '>': v.gt(cc), '<=': v.le(cc), '>=': v.ge(cc) }[c.sign];
      }
      st.probe = { x: x.toNumber(), ok: inside };
      if (sol.kind === 'ray') {
        if (x.eq(sol.bound)) st.probes.bound = true;
        else if (Math.abs(x.toNumber() - sol.bound.toNumber()) <= 0.5) st.probes.near = true;
        if (st.probes.bound && st.probes.near) st.chal.c2 = true;
      }
      const subst = F.fmtPoly(Poly.linear(c.a, c.b), 'x').replace(/<i class="var">x<\/i>/, F.fmtVal(x));
      el('l2-pvres').innerHTML =
        '<div class="check-line"><span class="cl-label">comprovació</span>' +
        F.fmtSubstitution(Poly.linear(c.a, c.b), x) + ' ' + L.SIGN_NAME[c.sign] + ' ' + F.fmtVal(c.c) + '</div>' +
        (inside
          ? '<span class="verdict yes">' + UI.icon('check') + 'x = ' + F.fmtVal(x) + ' <b>sí</b> que és solució</span>'
          : '<span class="verdict no">' + UI.icon('x') + 'x = ' + F.fmtVal(x) + ' <b>no</b> és solució</span>') +
        (sol.kind === 'ray' && x.eq(sol.bound)
          ? '<p class="help-note">Exacte: és el valor frontera. ' + (sol.closed ? 'Com que el signe inclou l\'igual (≤/≥), el cercle és <b>ple</b> i la frontera <b>compta</b>.' : 'Com que el signe és estricte (&lt;/&gt;), el cercle és <b>buit</b> i la frontera <b>no compta</b>.') + '</p>'
          : '');
      refresh(false);
    }
    el('l2-pvgo').addEventListener('click', () => {
      try { testValue(L.parseValue(el('l2-pv').value)); }
      catch (e) { el('l2-pvres').innerHTML = '<span class="field-msg">' + e.message + '</span>'; }
    });
    el('l2-pv').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('l2-pvgo').click(); });
    el('l2-pvb').addEventListener('click', () => {
      const sol = L.solveInequality(cur().a, cur().b, cur().sign, cur().c);
      if (sol.kind !== 'ray') { UI.toast('Aquesta inequació no té valor frontera (és sempre certa o sempre falsa).', 'warn'); return; }
      el('l2-pv').value = F.fmtValPlain(sol.bound);
      testValue(sol.bound);
    });

    /* ---- reptes (amb seguiment del progrés) ---- */
    function renderChallenges() {
      const CH = [
        { id: 'c1', title: 'Resol −2x + 3 &gt; 7', done: st.chal.c1, load: 'cen',
          desc: 'Arriba a <span class="math">x &lt; −2</span>. Hauràs de dividir per un negatiu!' },
        { id: 'c2', title: 'Prova la frontera', done: st.chal.c2,
          desc: 'A «Prova valors», prova la <b>frontera</b> i un valor <b>molt a prop</b>.' },
        { id: 'c3', title: 'I si no gires el signe?', done: st.chal.c3,
          desc: 'Descobreix què passa si t\'oblides de girar el signe.',
          extra: '<button class="btn ghost small" id="l2-noflip">Mostra la trampa</button>' }
      ];
      CH.forEach(c => { if (c.done) L.App.markDone('m2', c.id); });
      el('l2-chalcount').textContent = CH.filter(c => c.done).length + '/' + CH.length;
      el('l2-chal').innerHTML = CH.map(c =>
        '<div class="challenge-card"><div class="ch-head"><span class="ch-num">' + (c.done ? '✓' : '▸') + '</span>' +
        '<span class="ch-title">' + c.title + '</span></div>' +
        '<div class="ch-desc">' + c.desc + '</div>' +
        '<div class="ch-foot"><span class="ch-state ' + (c.done ? 'done' : 'todo') + '">' + (c.done ? '✓ aconseguit' : 'pendent') + '</span>' +
        (c.extra || '') +
        (!c.done && c.load && cur().presetId !== c.load ? '<button class="btn soft small" data-load="' + c.load + '">Prova-la ▸</button>' : '') +
        '</div></div>').join('');
      main.querySelector('#l2-noflip').addEventListener('click', showNoFlip);
      el('l2-chal').querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => {
        loadPreset(b.dataset.load); updateHash(); tabs.select('passos');
      }));
    }
    function showNoFlip() {
      st.chal.c3 = true; renderChallenges();
      UI.openModal({
        title: 'La trampa de no invertir el signe', icon: UI.icon('alert'),
        bodyHTML:
        '<p>Si de <span class="math">−2x &gt; 4</span> escrivim <span class="math">x &gt; −2</span>, diem que la solució és tot el que és més gran que −2. Però provem-ho amb <b>x = 0</b>:</p>' +
        '<div class="math-block">−2·(0) + 3 = 3 > 7? <span class="hl">NO!</span> 3 no és més gran que 7.</div>' +
        '<p>En canvi, amb la resposta correcta <span class="math">x &lt; −2</span>, provem <b>x = −3</b>: <span class="math">−2·(−3) + 3 = 9 &gt; 7 ✓</span>. Tot quadra.</p>' +
        '<p class="help-note"><b>Compte:</b> aquest és un dels errors més freqüents. Recorda: multiplicar o dividir per un negatiu → <b>inverteix el signe</b>.</p>',
        footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
    }

    /* ---- passos ---- */
    function renderSteps() {
      const host = el('l2-steps');
      host.innerHTML = '';
      for (let i = st.hist.length - 1; i >= 0; i--) {
        const h = st.hist[i];
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'step-item' + (i === st.cursor ? ' current' : '');
        let body;
        if (i === 0) {
          body = '<div class="si-curr math">' + ineqHTML(h) + '</div>';
        } else {
          const prev = st.hist[i - 1], op = h.op;
          const names = { add: 'suma', sub: 'resta', mul: 'multiplica', div: 'divideix' };
          body =
            '<div class="si-prev math">' + ineqHTML(prev) + '</div>' +
            '<div class="si-mid math">' + names[op.kind] + ' ' + F.fmtValPlain(op.k) + ' als dos membres' +
            (op.flipped ? ' <span class="badge warn" style="font-size:.68rem;padding:1px 8px">⚠ signe invertit</span>' : '') + '</div>' +
            '<div class="si-curr math">' + ineqHTML(h) + '</div>' +
            '<div class="si-why"><b>Per què?</b> ' + (op.flipped
              ? 'Per un nombre <b>negatiu</b>: el signe es gira.'
              : (op.kind === 'add' || op.kind === 'sub'
                ? 'Sumar o restar no gira el signe.'
                : 'Per un nombre positiu: el signe no es gira.')) + '</div>';
        }
        item.innerHTML = '<span class="si-head"><span class="si-op">' + (i === 0 ? 'estat inicial' : 'pas ' + i) + '</span></span>' + body;
        item.addEventListener('click', () => { st.cursor = i; refresh(); });
        host.appendChild(item);
      }
      el('l2-undo').disabled = st.cursor === 0;
    }
    function ineqHTML(h) {
      return F.fmtPoly(Poly.linear(h.a, h.b), 'x') +
        ' <span style="font-weight:800;color:var(--amber-ink);font-size:1.25em">' + L.SIGN_NAME[h.sign] + '</span> ' + F.fmtVal(h.c);
    }


    /* ---- refresc global ---- */
    function refresh(full) {
      const c = cur();
      /* display de la inequació */
      el('l2-eq').innerHTML =
        '<span class="eq-side member-l">' + F.fmtPoly(Poly.linear(c.a, c.b), 'x') + '</span>' +
        '<span class="eq-sign cmp">' + L.SIGN_NAME[c.sign] + '</span>' +
        '<span class="eq-side member-r">' + F.fmtVal(c.c) + '</span>';
      signBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sign === c.sign)));
      // els lliscadors segueixen l'estat actual (exemple carregat, desfés, operacions…)
      rows.a.updateValue(c.a); rows.b.updateValue(c.b); rows.c.updateValue(c.c);

      const sol = L.solveInequality(c.a, c.b, c.sign, c.c);
      const orig = st.hist[0];
      // repte 1: partint del preset central, arribar a «x < −2» (x aïllada amb coeficient 1)
      // (només operant: cal haver aplicat passos i que l'enunciat original no s'hagi editat)
      if (!st.chal.c1 && st.cursor > 0 && orig.a.eq(-2) && orig.b.eq(3) && orig.c.eq(7) && orig.sign === '>' &&
        c.a.eq(R.ONE) && c.b.isZero() && c.c.eq(-2) && c.sign === '<') {
        st.chal.c1 = true; UI.toast('Repte aconseguit: has aïllat la x i has invertit el signe!', 'ok');
      }
      renderChallenges();
      const osol = L.solveInequality(orig.a, orig.b, orig.sign, orig.c);
      const equiv = (sol.kind === osol.kind) && (sol.kind !== 'ray' || (sol.dir === osol.dir && sol.closed === osol.closed && sol.bound.eq(osol.bound)));

      /* status */
      const sb = el('l2-status');
      let solBadge;
      if (sol.kind === 'ray') {
        const fi = F.fmtIntervalIneq(sol);
        solBadge = '<span class="badge ok">' + UI.icon('target') + '<span class="math">' + fi.ineq + '</span></span>' +
          '<span class="sb-item"><span class="sb-label">interval</span><span class="math" data-answer>' + fi.interval + '</span></span>';
      } else if (sol.kind === 'all') {
        solBadge = '<span class="badge info">' + UI.icon('info') + 'Tots els reals: la desigualtat és sempre certa</span>';
      } else {
        solBadge = '<span class="badge err">' + UI.icon('x') + 'Conjunt buit: cap valor la compleix</span>';
      }
      const eqBadge = equiv
        ? '<span class="badge ok">' + UI.icon('check') + '⇔ equivalent a l\'original</span>'
        : '<span class="badge err">' + UI.icon('alert') + '⚠ la solució ha canviat</span>';
      sb.innerHTML = solBadge + eqBadge;

      /* guia: un sol missatge curt */
      const isolated = c.a.eq(R.ONE) && c.b.isZero();
      const step = isolated && st.cursor > 0 ? (st.probes.bound || st.probes.near ? 4 : 3) : st.cursor > 0 ? 2 : 1;
      if (c.a.isZero()) {
        guide.set(step, 'Sense <i>x</i>, la desigualtat és sempre certa o sempre falsa.', 'warn');
      } else if (isolated && st.cursor > 0) {
        guide.set(step, 'Ja tens la solució! Prova un valor a <b>Prova valors</b>.', 'ok');
      } else if (st.cursor > 0 && c.op.flipped) {
        guide.set(step, '⚠ Has ' + (c.op.kind === 'mul' ? 'multiplicat' : 'dividit') + ' per <b>' + F.fmtValPlain(c.op.k) + '</b>: el signe <b>s\'ha girat</b>.', 'warn');
      } else if (st.cursor > 0) {
        guide.set(step, 'La franja taronja <b>no s\'ha mogut</b>: la solució és la mateixa.');
      } else {
        guide.set(step, 'Aïlla la <i>x</i>. Compte si divideixes per un <b>negatiu</b>!');
      }

      /* recta numèrica */
      const nl = st.nline;
      if (sol.kind === 'ray') {
        nl.setSolution({ kind: 'ray', dir: sol.dir, bound: sol.bound, closed: sol.closed, boundStr: F.fmtValPlain(sol.bound) });
        nl.autoRange([sol.bound.toNumber(), sol.bound.toNumber() + (sol.dir === 'left' ? 4 : -4), sol.bound.toNumber() - (sol.dir === 'left' ? 4 : -4)], 2);
      } else if (sol.kind === 'all') {
        nl.setSolution({ kind: 'all' });
        nl.setRange(-10, 10, 2);
      } else {
        nl.setSolution(null);
        nl.setRange(-10, 10, 2);
      }
      if (st.probe) nl.setProbe(st.probe); else nl.setProbe(null);
      nl.setAriaLabel(sol.kind === 'ray'
        ? 'Recta numèrica: la solució és tots els valors ' + (sol.dir === 'left' ? 'menors' : 'majors') + (sol.closed ? ' o iguals' : '') + ' que ' + F.fmtValPlain(sol.bound)
        : sol.kind === 'all' ? 'Recta numèrica: tots els valors són solució' : 'Recta numèrica: cap valor és solució');
      nl.render();

      /* gràfic */
      const g = st.graph;
      g.clearData();
      const line = Poly.linear(c.a, c.b);
      g.addCurve(line.toFn(), { color: '#1d5fd6', width: 4.5 });
      g.addCurve(() => c.c.toNumber(), { color: '#0d9463', width: 4.5 });
      g.setReadout({
        items: [
          { label: 'y₁', color: '#1d5fd6', ink: '#14418f', fn: line.toFn() },
          { label: 'y₂', color: '#0d9463', ink: '#0a6e4a', fn: () => c.c.toNumber() }
        ], eq: true
      });
      if (sol.kind === 'ray') {
        const bx = sol.bound.toNumber();
        g.addBand(sol.dir === 'left' ? -1000 : bx, sol.dir === 'left' ? bx : 1000, {
          color: '#ef9f17', closedLeft: sol.dir !== 'left' && sol.closed, closedRight: sol.dir === 'left' && sol.closed
        });
        g.addMark(bx, c.a.mul(sol.bound).add(c.b).toNumber(), { color: '#ef9f17', label: 'frontera x = ' + F.fmtValPlain(sol.bound) });
        // marge de 4 unitats a banda i banda de la frontera: es veu on la recta queda per sobre i per sota
        if (!g.userView || full) g.autoFit([{ x: 0, y: 0 }, { x: bx, y: c.c.toNumber() }, { x: 0, y: c.b.toNumber() }, { x: bx - 4 }, { x: bx + 4 }]);
      } else {
        if (!g.userView || full) g.autoFit([{ x: 0, y: 0 }, { x: 4, y: c.c.toNumber() }, { x: 0, y: c.b.toNumber() }]);
      }
      g.setAriaLabel('Gràfic de la recta y = ' + F.fmtPolyPlain(line) + ' i la recta horitzontal y = ' + F.fmtValPlain(c.c) +
        (sol.kind === 'ray' ? '. La solució és on la recta blava és ' + (c.sign === '<' || c.sign === '<=' ? 'per sota' : 'per sobre') + ' de la verda' : ''));
      g.render();

      renderSteps();
      updateHash();
    }

    /* ---- hash ---- */
    function updateHash() {
      const c = st.hist[0];
      if (c.presetId === 'lliure') L.App.updateHash({ a: c.a.toString(), b: c.b.toString(), s: c.sign, c: c.c.toString() });
      else L.App.updateHash({ p: c.presetId || 'cen' });
    }

    let initId = 'cen';
    if (params.p && PRESETS.some(pp => pp.id === params.p)) initId = params.p;
    let initData = null;
    if (params.a !== undefined && L.SIGN_NAME[params.s]) {
      try { initData = { a: R.parse(params.a), b: R.parse(params.b), sign: params.s, c: R.parse(params.c) }; } catch (e) { }
    }
    loadPreset(initId, initData);


    /* ---- «Explica-m'ho» en català senzill ---- */
    UI.addExplain(main.querySelector('.viz-head'), () => {
      const c = cur(), sol = L.solveInequality(c.a, c.b, c.sign, c.c);
      const sg = L.SIGN_NAME[c.sign].replace('<', '&lt;').replace('>', '&gt;');
      let what;
      if (sol.kind === 'ray') {
        const b = F.fmtValPlain(sol.bound);
        what = 'Són tots els nombres <b>' + (sol.dir === 'left' ? 'més petits' : 'més grans') + '</b> que ' + b + '. ' +
          (sol.closed ? 'El ' + b + ' també hi entra (cercle <b>ple</b>).' : 'El ' + b + ' no hi entra (cercle <b>buit</b>).');
      } else if (sol.kind === 'all') what = 'Tots els nombres la compleixen: la recta és tota taronja.';
      else what = 'Cap nombre no la compleix: no hi ha cap part taronja.';
      return [
        'La inequació és <b>' + F.fmtPolyPlain(Poly.linear(c.a, c.b)) + ' ' + sg + ' ' + F.fmtValPlain(c.c) + '</b>.',
        'No busquem un sol nombre: busquem <b>tots</b> els nombres que la fan certa.',
        'A la recta numèrica, la part <b>taronja</b> són aquests nombres.',
        what,
        'Compte: si multipliques o divideixes per un nombre <b>negatiu</b>, el signe es gira (&lt; passa a ser &gt;).'
      ];
    });

    return function cleanup() {
      try { st.nline.destroy(); } catch (e) { }
      try { st.graph.destroy(); } catch (e) { }
    };
  }

  function help() {
    UI.openModal({
      title: 'Inequacions · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>Què canvia respecte a les equacions?</b> La solució no és un número aïllat: és un <b>conjunt de valors</b> que representem com una franja a la recta numèrica.</p>' +
      '<p>Es resolen gairebé com les equacions, amb <b>una norma extra</b>:</p>' +
      '<div class="math-block"><span class="mb-note">la norma d\'or</span>' +
      'Quan <b>multipliques</b> o <b>divideixes</b> els dos membres per un nombre <b>negatiu</b>,<br>el sentit de la desigualtat <b>s\'inverteix</b>: &lt; ↔ &gt;, ≤ ↔ ≥</div>' +
      '<div class="math-block"><span class="mb-note">exemple complet: −2x + 3 &gt; 7</span>' +
      '−2x + 3 <span class="hl">− 3</span> &gt; 7 <span class="hl">− 3</span><br>' +
      '−2x &gt; 4<br>' +
      '−2x <span class="hl">÷ (−2)</span> &gt; 4 <span class="hl">÷ (−2)</span> → <b>inverteix!</b><br>' +
      'x &lt; −2</div>' +
      '<p>Sumar o restar (el que sigui) <b>mai</b> no canvia el sentit; multiplicar o dividir per un <b>positiu</b> tampoc. Només el negatiu ho fa.</p>' +
      '<p class="help-note"><b>Extrems:</b> cercle <b>ple</b> = el valor frontera està inclòs (≤, ≥); cercle <b>buit</b> = exclòs (&lt;, &gt;).</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'm2', kind: 'lab', num: 'M2', short: 'Inequacions', goals: 3,
    title: 'Inequacions de primer grau', sub: 'Mòdul 2 · conjunts de solucions',
    desc: 'Si divideixes per un negatiu, el signe es gira.',
    foot: 'La norma d\'or del signe',
    iconHTML: '2',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
