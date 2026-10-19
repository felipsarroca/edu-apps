/* ============================================================
   lab5.js — MÒDUL 5 · Equacions biquadrades
   Tres nivells sincronitzats: equació original en x, equació
   auxiliar en t (t = x²) amb admissibilitat, i arrels en x.
   Predicció del nombre d'arrels; avís del mite «0, 2 o 4».
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, Poly = L.Poly, F = L.fmt, UI = L.UI;

  // els exemples surten del banc comú (js/banc.js)
  const PRESETS = L.BANC.m5.items;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // biquadrada aleatòria a partir de dos valors enters de t: (t − t₁)(t − t₂) = 0
  function randomBiquad() {
    for (;;) {
      const t1 = rnd(-3, 4), t2 = rnd(-3, 4), b = -(t1 + t2), c = t1 * t2;
      if (Math.abs(b) <= 10 && Math.abs(c) <= 10) return { a: 1n, b: BigInt(b), c: BigInt(c) };
    }
  }

  function polyX4(a, b, c) { return new Poly([R.cast(c), R.ZERO, R.cast(b), R.ZERO, R.cast(a)]); }

  function render(main, params) {
    const st = {
      a: R.ONE, b: R.make(-5n), c: R.make(4n),
      presetId: 'p4', revealed: true, challenged: {}, graph: null
    };

    main.innerHTML =
      '<div class="lab cols">' +
      '<div class="lab-viewtabs" role="tablist" aria-label="Vistes del laboratori">' +
      '<button data-viewtab="ctrl" type="button">' + UI.icon('arrows') + 'Equació i canvi de variable</button>' +
      '<button data-viewtab="viz" type="button">' + UI.icon('chart') + 'Funció de quart grau</button></div>' +
      '<div class="lab-left">' +

      '<div class="card"><div class="card-title">' + UI.icon('flask') + 'Equació biquadrada</div>' +
      '<div class="eq-display" id="l5-eq"></div>' +
      '<div id="l5-coefs" style="margin-top:6px"></div>' +
      '<div id="l5-presets" style="margin-top:8px"></div></div>' +
      '<div class="bq-level lvl-x"><div class="bq-tag"><span class="bq-dot"></span>① En x</div>' +
      '<div class="math" style="font-size:1.2rem" id="l5-lx"></div></div>' +
      '<div class="bq-level lvl-t"><div class="bq-tag"><span class="bq-dot"></span>② Canvia x² per t</div>' +
      '<div class="math" style="font-size:1.1rem" id="l5-lt"></div>' +
      '<div class="bq-vals" id="l5-ltvals"></div></div>' +
      '<div class="bq-level lvl-roots"><div class="bq-tag"><span class="bq-dot"></span>③ Torna a x</div>' +
      '<div class="bq-vals" id="l5-lroots"></div>' +
      '<div class="help-note" id="l5-lnote" style="font-size:.78rem"></div></div>' +
      '<div class="vtabs">' +
      '<div class="vtabs-bar" role="tablist" aria-label="Seccions">' +
      '<button data-tab="comprova" role="tab">Comprova</button>' +
      '<button data-tab="reptes" role="tab">Reptes <span class="tab-count" id="l5-chalcount"></span></button></div>' +
      '<div class="vtabs-panel" data-panel="comprova" id="l5-check"></div>' +
      '<div class="vtabs-panel" data-panel="reptes" id="l5-chal"></div>' +
      '</div></div>' +
      '<div class="lab-right">' +
      '<div id="l5-predhost"></div>' +
      '<div class="viz-card">' +
      '<div class="viz-head">' +
      '<span class="viz-title">' + UI.icon('chart') + 'y = ax⁴ + bx² + c</span>' +
      '<div class="legend">' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#1d5fd6"></span>funció de quart grau</span>' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#ef9f17"></span>arrels</span>' +
      '</div></div>' +
      '<div class="viz-body"><div class="graph-host" id="l5-graf"></div></div></div>' +
      '<div class="statusbar" id="l5-status"></div>' +
      '<div id="l5-insight"></div>' +
      '</div></div>';

    UI.bindLabViewTabs(main.querySelector('.lab'), 'ctrl', () => el('l5-eq').innerHTML);
    const tabs = UI.tabsInit(main.querySelector('.vtabs'));
    const el = (id) => main.querySelector('#' + id);
    st.graph = new L.Graph(el('l5-graf'));
    const guide = UI.guide(el('l5-insight'), ['Mira la corba', 'Mira t', 'Comprova']);

    /* ---- coeficients ---- */
    const coefs = el('l5-coefs');
    const rows = {};
    function bindCoef(name, get, set) {
      const row = UI.coefRow({
        name, value: get(), min: -10, max: 10, step: 1,
        onChange: (r, src) => {
          if (src === 'init') return; // la initView no és una edició
          // després de la hipòtesi, moure els lliscadors és explorar
          set(r); st.presetId = 'lliure'; st.acted = true; st.checked = false; st.reflect = null; renderPresets(); refresh(); updateHash();
        },
        warn: (r) => (name === 'a' && r.isZero())
          ? 'Amb a = 0 l\'equació deixa de ser biquadrada (deixa de tenir x⁴).'
          : null
      });
      coefs.appendChild(row);
      rows[name] = row;
    }
    bindCoef('a', () => st.a, (r) => { st.a = r; });
    bindCoef('b', () => st.b, (r) => { st.b = r; });
    bindCoef('c', () => st.c, (r) => { st.c = r; });

    /* ---- presets ---- */
    function loadCoefs(p, id) {
      st.a = R.cast(p.a); st.b = R.cast(p.b); st.c = R.cast(p.c);
      st.presetId = id; st.acted = true; st.checked = false; st.reflect = null;
      rows.a.updateValue(st.a); rows.b.updateValue(st.b); rows.c.updateValue(st.c);
      renderPresets(); refresh(true); updateHash();
    }
    function loadPreset(id) { loadCoefs(PRESETS.find(p => p.id === id), id); }
    const picker = UI.levelPicker(el('l5-presets'), {
      groups: L.BANC.m5.groups,
      items: PRESETS.map(p => ({ id: p.id, level: p.level, title: F.fmtPolyPlain(polyX4(p.a, p.b, p.c)) + ' = 0' })),
      onPick: loadPreset,
      onRandom: () => loadCoefs(randomBiquad(), 'lliure')
    });
    function renderPresets() { picker.setActive(st.presetId); }

    /* ---- solució ---- */
    function solution() { return L.solveBiquadratic(st.a, st.b, st.c); }
    function isBiquadratic() { return !st.a.isZero(); }

    /* ---- predicció ---- */
    // hipòtesi a partir de l'equació (la corba encara no es veu); després es compara
    function renderPrediction() {
      const host = el('l5-predhost');
      if (st.revealed) {
        if (st.reflect && !host.querySelector('.reflect-card')) {
          UI.reflect(host, Object.assign({ lab: 'm5', onClose: () => { st.reflect = null; } }, st.reflect));
        } else if (!st.reflect) host.innerHTML = '';
        return;
      }
      host.innerHTML = '';
      if (!isBiquadratic()) return;
      const s = solution();
      const correct = s.count;
      const name = (n) => n + (n === 1 ? ' arrel' : ' arrels');
      const card = UI.renderPrediction({
        mode: 'hypothesis',
        question: 'Mira l\'equació. Quantes arrels diferents creus que tindrà? Compte: no sempre són 0, 2 o 4.',
        options: [0, 1, 2, 3, 4].map(n => ({ label: String(n), correct: correct === n })),
        continueLabel: 'Mostra-ho ▸',
        onDone: (ok, i) => {
          const pos = s.tSolutions.filter(t => t.status === 'ok').length;
          const zero = s.tSolutions.filter(t => t.status === 'zero').length;
          st.reflect = {
            ok, said: name(i), happened: name(correct),
            why: 'Amb t = x²: ' + (s.tSolutions.length ? s.tSolutions.map(t => 't = ' + F.fmtValPlain(t.val)).join(' i ') : 'cap t real') + '. ' +
              'Cada t positiu dona 2 arrels (' + pos + ' × 2), t = 0 en dona 1 (' + zero + ') i els t negatius, cap.'
          };
          st.revealed = true; refresh();
        }
      });
      host.appendChild(card);
    }

    /* ---- tres nivells ---- */
    function renderLevels() {
      el('l5-lx').innerHTML = F.fmtPoly(polyX4(st.a, st.b, st.c), 'x') + ' = 0';
      if (!isBiquadratic()) {
        el('l5-lt').innerHTML = '—';
        el('l5-ltvals').innerHTML = '<span class="help-note">Amb a = 0 no és una biquadrada: el canvi de variable ja no fa servei.</span>';
        el('l5-lroots').innerHTML = '';
        el('l5-lnote').textContent = '';
        return;
      }
      el('l5-lt').innerHTML =
        'amb <span class="math">' + F.V('t') + ' = ' + F.V('x') + '<sup class="exp">2</sup></span>: &nbsp;' +
        F.fmtPoly(new Poly([R.cast(st.c), R.cast(st.b), R.cast(st.a)]), 't') + ' = 0'; // equació auxiliar at² + bt + c = 0
      const s = solution();
      const tv = el('l5-ltvals');
      if (!st.revealed) { // els valors de t (admissibles o descartats) ja donarien el recompte d'arrels
        tv.innerHTML = '<span class="sol-chip pending" title="Fes primer la predicció">?</span>';
      } else if (!s.tSolutions.length) {
        tv.innerHTML = '<span class="bq-val discarded">cap t real</span>' +
          (s.tText ? '<span class="help-note" style="align-self:center">' + s.tText + '</span>' : '');
      } else {
        tv.innerHTML = s.tSolutions.map(ts => {
          const cls = ts.status === 'ok' ? 'ok' : (ts.status === 'zero' ? 'zero' : 'discarded');
          const note = ts.status === 'ok' ? 'admissible: t &gt; 0 → dues arrels x oposades'
            : ts.status === 'zero' ? 'admissible: t = 0 → només x = 0'
              : 'descartat: x² no pot ser negatiu';
          return '<span class="bq-val ' + cls + '"><span class="math">t = ' + F.fmtVal(ts.val) + '</span>' +
            '<span class="bq-note">' + note + '</span></span>';
        }).join('');
      }
      const lr = el('l5-lroots');
      if (!st.revealed) {
        lr.innerHTML = '<span class="sol-chip pending" title="Fes primer la predicció">?</span>';
      } else if (!s.xRootsDistinct.length) {
        lr.innerHTML = '<span class="sol-chip none">cap arrel real</span>';
      } else {
        lr.innerHTML = s.xRootsDistinct.map(r =>
          '<span class="sol-chip math">x = ' + F.fmtVal(r) + '</span>').join('');
      }
      const n = el('l5-lnote');
      if (st.revealed) {
        if (s.count === 3) n.innerHTML = '<b>Tres!</b> Qui digui que una biquadrada només pot tenir 0, 2 o 4 arrels s\'equivoca: aquí t = 0 (una arrel) i t &gt; 0 (dues arrels) es combinen.';
        else if (s.count === 1) n.innerHTML = 'Una sola arrel <b>distinta</b>: x = 0 (encara que sigui quàdruple). Les arrels compten per valor, no per multiplicitat.';
        else if (s.count === 2 && s.tSolutions.length === 1) n.innerHTML = 'Un únic t &gt; 0 (doble) dona exactament dues arrels oposades.';
        else if (s.count === 0) n.innerHTML = 'Els dos t són negatius: cap es pot convertir en x² real. Cap arrel.';
        else n.innerHTML = 'Cada t &gt; 0 admissible dona dues arrels oposades: ' + s.tSolutions.filter(t => t.status === 'ok').length + ' × 2 = ' + s.count + ' arrels.';
      } else n.textContent = '';
    }

    /* ---- barra d'estat ---- */
    function renderStatus() {
      const sb = el('l5-status');
      if (!isBiquadratic()) {
        sb.innerHTML = '<span class="sb-item"><span class="badge warn">' + UI.icon('info') + 'a = 0: deixa de ser biquadrada</span></span>' +
          '<span class="sb-item"><span class="help-note">' + (solution().text || '') + '</span></span>';
        return;
      }
      const s = solution();
      const countHTML = '<span class="badge ok">' + UI.icon('target') + s.count + ' ' + (s.count === 1 ? 'arrel' : 'arrels') + ' reals distintes</span>';
      const rootsHTML = s.xRootsDistinct.length
        ? s.xRootsDistinct.map(r => '<span class="sol-chip math">x = ' + F.fmtVal(r) + '</span>').join('')
        : '<span class="sol-chip none">∅</span>';
      const pending = (t) => '<span class="sb-item"><span class="sb-label">' + t + '</span><span class="sol-chip pending" title="Fes primer la predicció">?</span></span>';
      sb.innerHTML = st.revealed
        ? '<span class="sb-item">' + countHTML + '</span><span class="sb-item">' + rootsHTML + '</span>'
        : pending('Nombre d\'arrels') + pending('Arrels');
    }

    /* ---- insight ---- */
    function renderInsight() {
      if (!isBiquadratic()) { guide.set(1, 'Amb <b>a = 0</b> ja no és biquadrada: no hi ha x⁴.', 'warn'); return; }
      if (!st.revealed) { guide.set(1, 'Mira l\'equació i fes la teva hipòtesi.'); return; }
      const s = solution();
      const pos = s.tSolutions.filter(t => t.status === 'ok').length;
      const zero = s.tSolutions.filter(t => t.status === 'zero').length;
      const neg = s.tSolutions.filter(t => t.status === 'discarded').length;
      // recompte curt: cada t > 0 dona 2 arrels, t = 0 en dona 1 i els t < 0 no en donen cap
      const parts = [];
      if (pos) parts.push(pos + ' t positiu' + (pos > 1 ? 's' : '') + ' → ' + 2 * pos);
      if (zero) parts.push('t = 0 → 1');
      if (neg) parts.push(neg + ' t negatiu' + (neg > 1 ? 's' : '') + ' → 0');
      guide.set(st.checked || !s.count ? 4 : 3, (parts.length ? parts.join(' · ') + ' = ' : '') + '<b>' + s.count + (s.count === 1 ? ' arrel' : ' arrels') + '</b>.', s.count ? 'ok' : 'warn');
    }

    /* ---- comprovador ---- */
    const ck = el('l5-check');
    ck.innerHTML =
      '<div class="checker">' +
      '<div class="ck-inputrow">' +
      '<label for="l5-ckx" class="help-note">És aquest valor arrel?</label>' +
      '<input class="input math" id="l5-ckx" placeholder="p. ex. 2 o √3">' +
      '<button class="btn primary small" id="l5-ckgo">Comprova</button>' +
      '<button class="btn ghost small" id="l5-cksol">Prova una arrel</button>' +
      '</div><div class="ck-result" id="l5-ckres"></div>' +

      '</div>';
    function doCheck(x) {
      const p = polyX4(st.a, st.b, st.c);
      let val;
      try { val = p.eval(x); } catch (e) {
        // coeficients amb radicals no: aquí són racionals; x pot ser Surd
        el('l5-ckres').innerHTML = '<span class="field-msg">No he pogut avaluar: ' + e.message + '</span>';
        return;
      }
      if (val.isZero() && !st.checked) { st.checked = true; renderInsight(); }
      el('l5-ckres').innerHTML =
        '<div class="check-line"><span class="cl-label">substitució</span>' +
        F.fmtSubstitution(p, x) + ' = ' + F.fmtVal(val) + '</div>' +
        (val.isZero()
          ? '<span class="verdict yes">' + UI.icon('check') + 'x = ' + F.fmtVal(x) + ' <b>és arrel</b></span>'
          : '<span class="verdict no">' + UI.icon('x') + 'x = ' + F.fmtVal(x) + ' <b>no és arrel</b>: dona ' + F.fmtVal(val) + '</span>');
    }
    el('l5-ckgo').addEventListener('click', () => {
      try { doCheck(L.parseValue(el('l5-ckx').value)); }
      catch (e) { el('l5-ckres').innerHTML = '<span class="field-msg">' + e.message + '</span>'; }
    });
    el('l5-ckx').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('l5-ckgo').click(); });
    el('l5-cksol').addEventListener('click', () => {
      const s = solution();
      // les arrels ±√t amb t irracional no es poden substituir exactament: se'n tria una altra si n'hi ha
      const exact = s.xRootsDistinct.filter(r => !(r instanceof L.NestedRoot));
      if (!exact.length && s.xRootsDistinct.length) UI.toast('Aquestes arrels són de la forma ±√t amb t irracional: mira-les al gràfic.', 'warn');
      else if (exact.length) {
        const r = exact[0];
        el('l5-ckx').value = F.fmtValPlain(r);
        doCheck(r);
      } else UI.toast('Aquesta biquadrada no té cap arrel real per provar.', 'warn');
    });

    /* ---- reptes ---- */
    function renderChallenges() {
      const s = solution();
      const CH = [
        { id: 'c4', title: 'Quatre arrels', load: 'p4', desc: 'Mira com t = 1 i t = 4 donen ±1 i ±2.', done: !!st.challenged.c4 },
        { id: 'c3', title: 'Tres arrels', desc: 'Troba\'n una amb exactament <b>3</b> arrels. Pista: t = 0.', done: !!st.challenged.c3 },
        { id: 'c1', title: 'Una sola arrel', desc: 'I amb <b>una</b> arrel? Pista: tot zero.', done: !!st.challenged.c1 },
        { id: 'c0', title: 'Cap arrel', desc: 'Fes que els dos valors de t siguin negatius.', done: !!st.challenged.c0 },
        { id: 'cd', title: 'El mite de «0, 2 o 4»', desc: 'Troba un contraexemple al mite.', done: !!st.challenged.cd }
      ];
      CH.forEach(c => { if (c.done) L.App.markDone('m5', c.id); });
      el('l5-chalcount').textContent = CH.filter(c => c.done).length + '/' + CH.length;
      el('l5-chal').innerHTML = CH.map(c =>
        '<div class="challenge-card"><div class="ch-head"><span class="ch-num">' + (c.done ? '✓' : '▸') + '</span>' +
        '<span class="ch-title">' + c.title + '</span></div>' +
        '<div class="ch-desc">' + c.desc + '</div>' +
        '<div class="ch-foot"><span class="ch-state ' + (c.done ? 'done' : 'todo') + '">' + (c.done ? '✓ aconseguit' : 'pendent') + '</span>' +
        (!c.done && c.load && st.presetId !== c.load ? '<button class="btn soft small" data-load="' + c.load + '">Prova-la ▸</button>' : '') +
        '</div></div>').join('');
      el('l5-chal').querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => loadPreset(b.dataset.load)));
      if (!st.challenged.c4 && st.acted && s.count === 4) { st.challenged.c4 = true; UI.toast('Repte aconseguit: el cas de les 4 arrels.', 'ok'); renderChallenges(); }
      if (!st.challenged.c3 && st.acted && s.count === 3) {
        st.challenged.c3 = true;
        UI.openModal({
          title: 'Tres arrels: contraexemple perfecte!', icon: UI.icon('bulb'),
          bodyHTML: '<p>Amb <span class="math">' + F.fmtPoly(polyX4(st.a, st.b, st.c), 'x') + ' = 0</span> has arribat a <b>tres</b> arrels distintes: <span class="math">x = ' +
            s.xRootsDistinct.map(r => F.fmtValPlain(r)).join(', ') + '</span>.</p>' +
            '<p>Un dels valors de t és <b>zero</b>, i de zero només surt <b>una</b> arrel (x = 0), no dues d\'oposades. Per això el recompte trenca el patró parell.</p>' +
            '<p class="help-note">Aquest és l\'argument definitiu contra el mite «0, 2 o 4»: sempre que <span class="math">c = 0</span> i <span class="math">t = 0</span> sigui solució de l\'auxiliar, pot aparèixer un nombre <b>senar</b> d\'arrels.</p>',
          footHTML: '<button class="btn primary" data-action="ok">Fantàstic</button>',
          actions: [{ id: 'ok', onClick: (m) => m.close() }]
        });
        renderChallenges();
      }
      if (!st.challenged.c1 && st.acted && s.count === 1) { st.challenged.c1 = true; UI.toast('Repte aconseguit: una sola arrel (0).', 'ok'); renderChallenges(); }
      if (!st.challenged.c0 && st.acted && s.count === 0) { st.challenged.c0 = true; UI.toast('Repte aconseguit: cap arrel real.', 'ok'); renderChallenges(); }
      if (!st.challenged.cd && st.acted && s.count === 3) { st.challenged.cd = true; renderChallenges(); }
    }

    /* ---- gràfic ---- */
    function renderGraph(full) {
      const g = st.graph;
      g.clearData();
      const p = polyX4(st.a, st.b, st.c);
      g.addCurve(p.toFn(), { color: '#1d5fd6', width: 4.5 });
      const s = solution();
      const feats = [{ x: 0, y: 0 }, { x: 0, y: st.c.toNumber() }];
      if (isBiquadratic()) {
        // la funció és parella: enquadrament simètric respecte de l'eix Y, amb totes les arrels
        // i els mínims/màxims laterals (x² = −b/2a) dins de la vista, encara que no estiguin revelats
        const f = p.toFn();
        const ext = -st.b.toNumber() / (2 * st.a.toNumber());
        const xe = ext > 0 ? Math.sqrt(ext) : 0;
        const rmax = Math.max(1, xe, ...s.xRootsDistinct.map(r => Math.abs(r.toNumber())));
        feats.push({ x: -rmax, y: f(rmax) }, { x: rmax, y: f(rmax) });
        if (xe) feats.push({ x: -xe, y: f(xe) }, { x: xe, y: f(xe) });
        if (st.revealed) for (const r of s.xRootsDistinct) {
          feats.push({ x: r.toNumber(), y: 0 });
          g.addMark(r.toNumber(), 0, { color: '#ef9f17', label: 'x = ' + F.fmtValExact(r) });
        }
      }
      let outNote = false;
      if (g.userView) for (const f of feats) if (f.y === 0 && f.x !== 0 && g.isOutside(f.x, f.y)) outNote = true;
      g.onRenderCb = updateOutsideNote;
      function updateOutsideNote() {
        const host2 = el('l5-graf').parentElement;
        if (!host2) return;
        const old = host2.querySelector('.outside-note');
        if (old) old.remove();
        let outside = false;
        if (g.userView) for (const f of feats) if (f.y === 0 && f.x !== 0 && g.isOutside(f.x, f.y)) outside = true;
        if (outside && !g._destroyed) {
          const div = document.createElement('div');
          div.className = 'outside-note';
          div.innerHTML = 'Hi ha arrels fora de la vista <button id="l5-center">Centra-les</button>';
          host2.appendChild(div);
          div.querySelector('#l5-center').addEventListener('click', () => { g.userView = false; refresh(true); });
        }
      }
      updateOutsideNote();
      UI.veil(el('l5-graf').parentElement, !st.revealed && isBiquadratic(), 'Primer fes la teva hipòtesi. Després veuràs la corba.');
      g.setAriaLabel('Gràfic de y = ' + F.fmtPolyPlain(p) +
        (st.revealed && s.count ? '. Talla l\'eix X a ' + s.xRootsDistinct.map(r => 'x = ' + F.fmtValPlain(r)).join(' i ') : ''));
      if (!g.userView || full) g.autoFit(feats); else g.render();
    }

    /* ---- refresc ---- */
    function refresh(full) {
      el('l5-eq').innerHTML =
        '<span class="eq-side member-l">' + F.fmtPoly(polyX4(st.a, st.b, st.c), 'x') + '</span>' +
        '<span class="eq-sign">=</span><span class="eq-side member-r">0</span>';
      renderPrediction();
      renderLevels();
      renderStatus();
      renderInsight();
      renderChallenges();
      renderGraph(full);
      updateHash();
    }

    /* ---- hash ---- */
    function updateHash() {
      if (st.presetId === 'lliure') L.App.updateHash({ a: st.a.toString(), b: st.b.toString(), c: st.c.toString() });
      else L.App.updateHash({ p: st.presetId });
    }

    /* ---- inici ---- */
    let loaded = false;
    if (params.p && PRESETS.some(pp => pp.id === params.p)) {
      const p = PRESETS.find(pp => pp.id === params.p);
      st.a = R.cast(p.a); st.b = R.cast(p.b); st.c = R.cast(p.c); st.presetId = p.id; loaded = true;
    } else if (params.a !== undefined) {
      try {
        st.a = R.parse(params.a); st.b = R.parse(params.b); st.c = R.parse(params.c);
        st.presetId = 'lliure'; loaded = true;
      } catch (e) { }
    }
    rows.a.updateValue(st.a); rows.b.updateValue(st.b); rows.c.updateValue(st.c);
    renderPresets();
    refresh(true);
    if (!loaded) updateHash();

    /* ---- «Explica-m'ho» en català senzill ---- */
    UI.addExplain(main.querySelector('.viz-head'), () => {
      if (!isBiquadratic()) return ['Amb <b>a = 0</b> no hi ha x⁴: ja no és una biquadrada.'];
      const s = solution();
      let now;
      if (!st.revealed) now = 'Primer fes la teva hipòtesi: quantes vegades creus que la corba tocarà la línia horitzontal?';

      else if (s.count) now = 'Aquesta corba toca l\'eix X <b>' + s.count + (s.count === 1 ? ' vegada' : ' vegades') + '</b>: x = ' + s.xRootsDistinct.map(r => F.fmtValPlain(r)).join(', x = ') + '.';
      else now = 'Aquesta corba <b>no toca</b> l\'eix X: no hi ha cap solució.';
      return [
        'La línia <b>blava</b> és y = ' + F.fmtPolyPlain(polyX4(st.a, st.b, st.c)) + '.',
        'Les solucions són els punts on la corba <b>toca la línia horitzontal</b> (l\'eix X).',
        'El dibuix és <b>simètric</b>: la part esquerra és com un mirall de la dreta. Si x = 2 és solució, x = −2 també.',
        'Truc: canvia <b>x²</b> per <b>t</b>. Així tens una equació de segon grau, que ja saps resoldre.',
        now
      ];
    });

    return function cleanup() { try { st.graph.destroy(); } catch (e) { } };
  }

  function help() {
    UI.openModal({
      title: 'Biquadrades · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>La idea gran.</b> El canvi de variable <span class="math">t = x²</span> transforma una equació de quart grau en una de segon grau que ja saps resoldre. Després, <b>desfem</b> el canvi amb compte.</p>' +
      '<div class="math-block"><span class="mb-note">exemple complet: x⁴ − 5x² + 4 = 0</span>' +
      'Canvi: t = x² → t² − 5t + 4 = 0<br>' +
      'Δ = 25 − 16 = 9 → t = 1 o t = 4 (els dos positius: admesos)<br>' +
      't = 1 → x = ±1 &nbsp;&nbsp; t = 4 → x = ±2<br>' +
      '<b>4 arrels: x = −2, −1, 1, 2</b></div>' +
      '<p><b>La taula de decisió per recuperar x:</b></p>' +
      '<ul style="list-style:disc;padding-left:22px;line-height:1.9">' +
      '<li><span class="math">t &gt; 0</span> → dues arrels oposades <span class="math">x = ±√t</span></li>' +
      '<li><span class="math">t = 0</span> → una sola arrel <span class="math">x = 0</span></li>' +
      '<li><span class="math">t &lt; 0</span> → cap x real (un quadrat mai és negatiu!)</li></ul>' +
      '<p class="help-note"><b>Avís del mite:</b> no és cert que una biquadrada tingui sempre 0, 2 o 4 arrels. <span class="math">x⁴ − x² = 0</span> en té <b>3</b> (−1, 0, 1) i <span class="math">x⁴ = 0</span> només <b>1</b> (el 0). El culpable és el <span class="math">t = 0</span>.</p>' +
      '<p class="help-note"><b>Error de detectiu:</b> donar només <span class="math">+√t</span> i oblidar <span class="math">−√t</span>, o acceptar un <span class="math">t</span> negatiu com si res. Els tres nivells del laboratori et porten per evitar-ho.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'm5', kind: 'lab', num: 'M5', short: 'Biquadrades', goals: 5,
    title: 'Equacions biquadrades', sub: 'Mòdul 5 · el canvi de variable',
    desc: 'Canvia x² per t i compta les arrels.',
    foot: 'Quart grau amb ofici de segon',
    iconHTML: '5',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
