/* ============================================================
   lab4.js — MÒDUL 4 · Sistemes de dues equacions lineals
   Forma general Ax + By = C (admet rectes verticals).
   Predicció del tipus de sistema, classificació ALGEBRAICA
   (mai per inspecció visual), tres mètodes pas a pas i
   comprovació de parelles candidates (x, y) escrites o clicant al gràfic.
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, F = L.fmt, UI = L.UI;

  // els exemples surten del banc comú (js/banc.js)
  const PRESETS = L.BANC.m4.items;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // sistema aleatori: sovint amb solució entera; de tant en tant, paral·leles o coincidents
  function randomSystem() {
    for (;;) {
      const A1 = rnd(-3, 3), B1 = rnd(-3, 3), x0 = rnd(-4, 4), y0 = rnd(-4, 4);
      if (!A1 && !B1) continue;
      const t = Math.random();
      let A2, B2, C2;
      if (t < .7) { A2 = rnd(-3, 3); B2 = rnd(-3, 3); if (A1 * B2 - A2 * B1 === 0) continue; C2 = A2 * x0 + B2 * y0; }
      else { const k = [2, -1, 3][rnd(0, 2)]; A2 = k * A1; B2 = k * B1; C2 = k * (A1 * x0 + B1 * y0) + (t < .85 ? rnd(1, 4) : 0); }
      const C1 = A1 * x0 + B1 * y0;
      return { A1, B1, C1, A2, B2, C2 };
    }
  }

  function sysLine(A, B, C) { return F.fmtSystemLine(A, B, C); }
  function num(v) { return R.cast(v); }

  /* y = mx + n ben escrit (linRHS: només el costat dret) */
  function linRHS(m, n, vname) {
    vname = vname || 'x';
    m = num(m); n = num(n);
    const coef = (k) => k.eq(R.ONE) ? '' : (k.eq(R.ONE.neg()) ? '−' : F.fmtR(k));
    if (m.isZero()) return F.fmtR(n);
    let out = coef(m) + F.V(vname);
    if (!n.isZero()) out += ' ' + (n.isNeg() ? '−' : '+') + ' ' + F.fmtR(n.abs());
    return out;
  }
  function linHTML(m, n, vname) { return F.V('y') + ' = ' + linRHS(m, n, vname); }
  /* A·(x) + B·(y) = valor — línia de comprovació */
  function substHTML(A, B, C, x, y) {
    A = num(A); B = num(B);
    const val = A.mul(x).add(B.mul(y));
    const par = (v) => v instanceof R && v.isNeg() ? '(' + F.fmtR(v) + ')' : F.fmtVal(v);
    let out = '';
    if (!A.isZero()) out += F.fmtR(A) + '·' + par(x);
    if (!B.isZero()) {
      if (out) out += ' ' + (B.isNeg() ? '\u2212' : '+') + ' ' + F.fmtR(B.abs()) + '·' + par(y);
      else out += (B.isNeg() ? '\u2212' : '') + F.fmtR(B.abs()) + '·' + par(y);
    }
    if (!out) out = '0';
    const eq = val.eq(num(C));
    return out + ' = ' + F.fmtVal(val) + ' <span class="' + (eq ? 'hl-green' : 'hl') + '">' + (eq ? '✓' : '✗') + '</span>';
  }

  function render(main, params) {
    const st = {
      A1: R.make(2n), B1: R.make(-1n), C1: R.make(-1n),
      A2: R.ONE, B2: R.ONE, C2: R.make(4n),
      presetId: 'det', revealed: true, cand: null, challenged: {},
      graph: null
    };
    Object.assign(st.challenged, L.App.doneMap('m4'));

    main.innerHTML =
      '<div class="lab cols wide-left">' +
      '<div class="lab-viewtabs" role="tablist" aria-label="Vistes del laboratori">' +
      '<button data-viewtab="ctrl" type="button">' + UI.icon('arrows') + 'Sistema i mètodes</button>' +
      '<button data-viewtab="viz" type="button">' + UI.icon('chart') + 'Rectes</button></div>' +
      '<div class="lab-left">' +
      '<div class="card" id="l4-card"><div class="card-title">' + UI.icon('flask') + 'Sistema</div>' +
      '<div class="sys-eq se1" id="l4-eq1"></div>' +
      '<div class="sys-eq se2" id="l4-eq2" style="margin-top:8px"></div>' +
      '<div id="l4-presets" style="margin-top:10px"></div></div>' +
      '<div class="vtabs">' +
      '<div class="vtabs-bar" role="tablist" aria-label="Seccions">' +
      '<button data-tab="metodes" role="tab">Mètodes</button>' +
      '<button data-tab="comprova" role="tab">Comprova un punt</button>' +
      '<button data-tab="reptes" role="tab">Reptes <span class="tab-count" id="l4-chalcount"></span></button></div>' +
      '<div class="vtabs-panel" data-panel="metodes" id="l4-metodes"></div>' +
      '<div class="vtabs-panel" data-panel="comprova" id="l4-check"></div>' +
      '<div class="vtabs-panel" data-panel="reptes" id="l4-chal"></div>' +
      '</div></div>' +
      '<div class="lab-right">' +
      '<div id="l4-predhost"></div>' +
      '<div class="viz-card">' +
      '<div class="viz-head">' +
      '<span class="viz-title">' + UI.icon('chart') + 'Les dues rectes</span>' +
      '<div class="legend">' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#1d5fd6"></span>eq 1</span>' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#0d9463"></span>eq 2</span>' +
      '<button type="button" class="chip scale-toggle on" id="l4-scale" aria-pressed="true" title="Mateixa mida d\'unitat als dos eixos: les pendents i els angles es veuen reals">Escala 1:1</button>' +
      '</div></div>' +
      '<div class="viz-body"><div class="graph-host" id="l4-graf"></div></div></div>' +
      '<div class="statusbar" id="l4-status"></div>' +
      '<div id="l4-insight"></div>' +
      '</div></div>';

    UI.bindLabViewTabs(main.querySelector('.lab'), 'ctrl', () => '① ' + sysHTML(1) + '<br>② ' + sysHTML(2));
    const tabs = UI.tabsInit(main.querySelector('.vtabs'));
    const el = (id) => main.querySelector('#' + id);
    st.graph = new L.Graph(el('l4-graf'));
    const guide = UI.guide(el('l4-insight'), ['Mira les rectes', 'Classifica', 'Comprova el punt']);
    // escala 1:1 activada per defecte: amb unitats diferents als eixos, les pendents i els angles enganyen
    st.graph.setEqualScale(true);
    el('l4-scale').addEventListener('click', (e) => {
      const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
      e.currentTarget.setAttribute('aria-pressed', String(on));
      e.currentTarget.classList.toggle('on', on);
      st.graph.setEqualScale(on);
      if (!on) { st.graph.userView = false; refresh(true); }
    });

    /* ---- edició de coeficients ---- */
    const coefInputs = {};
    function buildCoefInput(eqEl, which, idx, label) {
      const wrap = document.createElement('span');
      wrap.className = 'se-coef';
      wrap.innerHTML = '<label for="l4-' + which + idx + '">' + label + '</label>' +
        '<input id="l4-' + which + idx + '" value="" aria-label="Coeficient ' + label + ' de l\'equació ' + (idx === '1' ? 'primera' : 'segona') + '">';
      const inp = wrap.querySelector('input');
      inp.addEventListener('change', () => {
        try {
          const r = R.parse(inp.value);
          if (Math.abs(r.toNumber()) > 500) throw new Error('massa gran');
          st[which + idx] = r;
          st.presetId = 'lliure'; st.acted = true; st.cand = null; st.reflect = null;
          inp.classList.remove('bad');
          renderPresets(); refresh(); updateHash();
        } catch (e) {
          inp.classList.add('bad');
          UI.toast('No he entès «' + inp.value + '»: escriu 2, −1 o 3/2.', 'warn');
        }
      });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
      coefInputs[which + idx] = inp;
      eqEl.querySelector('.se-controls').appendChild(wrap);
    }
    el('l4-eq1').innerHTML =
      '<span class="se-tag">①</span><span class="se-display math" id="l4-d1"></span><span class="se-controls"></span>';
    el('l4-eq2').innerHTML =
      '<span class="se-tag">②</span><span class="se-display math" id="l4-d2"></span><span class="se-controls"></span>';
    buildCoefInput(el('l4-eq1'), 'A', '1', 'A₁');
    buildCoefInput(el('l4-eq1'), 'B', '1', 'B₁');
    buildCoefInput(el('l4-eq1'), 'C', '1', 'C₁');
    buildCoefInput(el('l4-eq2'), 'A', '2', 'A₂');
    buildCoefInput(el('l4-eq2'), 'B', '2', 'B₂');
    buildCoefInput(el('l4-eq2'), 'C', '2', 'C₂');
    function syncCoefInputs() {
      for (const k of ['A1', 'B1', 'C1', 'A2', 'B2', 'C2']) {
        if (coefInputs[k]) coefInputs[k].value = st[k].toString().replace('-', '\u2212');
      }
    }

    /* ---- presets ---- */
    function loadCoefs(p, id) {
      st.A1 = num(p.A1); st.B1 = num(p.B1); st.C1 = num(p.C1);
      st.A2 = num(p.A2); st.B2 = num(p.B2); st.C2 = num(p.C2);
      st.presetId = id; st.acted = true; st.cand = null; st.reflect = null;
      syncCoefInputs(); renderPresets(); refresh(true); updateHash();
    }
    function loadPreset(id) { loadCoefs(PRESETS.find(p => p.id === id), id); }
    const picker = UI.levelPicker(el('l4-presets'), {
      groups: L.BANC.m4.groups,
      items: PRESETS.map(p => ({ id: p.id, level: p.level, title: F.fmtSystemLinePlain(num(p.A1), num(p.B1), num(p.C1)) + ' · ' + F.fmtSystemLinePlain(num(p.A2), num(p.B2), num(p.C2)) })),
      onPick: loadPreset,
      onRandom: () => { const r = randomSystem(); for (const k in r) r[k] = BigInt(r[k]); loadCoefs(r, 'lliure'); },
      extra: [{ id: 'edita', html: '✎ Edita', title: 'Canvia els coeficients a mà', onClick: () => el('l4-card').classList.toggle('editing') }]
    });
    function renderPresets() { picker.setActive(st.presetId); }

    /* ---- solució ---- */
    function solution() { return L.solveSystem(st.A1, st.B1, st.C1, st.A2, st.B2, st.C2); }
    function det() { return st.A1.mul(st.B2).sub(st.A2.mul(st.B1)); }

    /* ---- predicció ---- */
    /* les equacions són proporcionals? (② = k·①). Explica el tipus de sistema sense determinants */
    function proportion() {
      const k = !st.A1.isZero() ? st.A2.div(st.A1) : st.B2.div(st.B1);
      const xy = st.A2.eq(st.A1.mul(k)) && st.B2.eq(st.B1.mul(k));
      return { k, xy, all: xy && st.C2.eq(st.C1.mul(k)) };
    }
    function kindWhy(s) {
      const pr = proportion();
      if (s.kind === 'unique') return 'Els coeficients de <i>x</i> i <i>y</i> <b>no són proporcionals</b>: les rectes tenen inclinacions diferents i es tallen en un sol punt.';
      if (s.kind === 'coincident') return 'L\'equació ② és la ① multiplicada per <b>' + F.fmtValPlain(pr.k) + '</b>: són <b>equacions equivalents</b>, la mateixa recta.';
      return 'Els coeficients de <i>x</i> i <i>y</i> de ② són els de ① multiplicats per <b>' + F.fmtValPlain(pr.k) + '</b>, però el terme independent no: mateixa inclinació i rectes <b>paral·leles</b>.';
    }
    // hipòtesi a partir de les equacions (les rectes encara no es veuen); després es compara
    const KIND = { u: 'Una: es tallen', c: 'Cap: paral·leles', i: 'Infinites: la mateixa' };
    function renderPrediction() {
      const host = el('l4-predhost');
      if (st.revealed) {
        if (st.reflect && !host.querySelector('.reflect-card')) {
          UI.reflect(host, Object.assign({ lab: 'm4', onClose: () => { st.reflect = null; } }, st.reflect));
        } else if (!st.reflect) host.innerHTML = '';
        return;
      }
      host.innerHTML = '';
      const s = solution();
      const correct = s.kind === 'unique' ? 'u' : (s.kind === 'coincident' ? 'i' : 'c');
      const keys = ['u', 'c', 'i'];
      const opts = [
        { label: UI.pic('lCross', KIND.u), correct: correct === 'u' },
        { label: UI.pic('lPar', KIND.c), correct: correct === 'c' },
        { label: UI.pic('lSame', KIND.i), correct: correct === 'i' }
      ];
      const card = UI.renderPrediction({
        mode: 'hypothesis',
        question: 'Mira les dues equacions. Quantes solucions creus que té el sistema? <span style="font-weight:400">Pista: compara els coeficients.</span>',
        options: opts,
        continueLabel: 'Mostra les rectes ▸',
        onDone: (ok, i) => {
          st.reflect = { ok, said: KIND[keys[i]], happened: KIND[correct], why: kindWhy(s) };
          st.revealed = true; refresh();
        }
      });
      host.appendChild(card);
    }

    /* ---- barra d'estat ---- */
    function renderStatus() {
      const sb = el('l4-status');
      const s = solution();
      const d = det();
      let badge, sol;
      if (s.kind === 'unique') {
        badge = '<span class="badge ok">' + UI.icon('check') + 'Compatible determinat: una solució</span>';
        sol = '<span class="sol-chip math">(x, y) = (' + F.fmtVal(s.x) + ', ' + F.fmtVal(s.y) + ')</span>';
      } else if (s.kind === 'coincident') {
        badge = '<span class="badge info">' + UI.icon('info') + 'Compatible indeterminat: infinites solucions</span>';
        sol = '<span class="sol-chip">infinites (tota la recta)</span>';
      } else {
        badge = '<span class="badge err">' + UI.icon('x') + 'Incompatible: cap solució</span>';
        sol = '<span class="sol-chip none">∅</span>';
      }
      // abans de la hipòtesi no es mostra ni la classificació ni la solució
      const pending = (t) => '<span class="sb-item"><span class="sb-label">' + t + '</span><span class="sol-chip pending" title="Fes primer la hipòtesi">?</span></span>';
      sb.innerHTML = st.revealed
        ? '<span class="sb-item">' + badge + '</span><span class="sb-item">' + sol + '</span>'
        : pending('Tipus de sistema') + pending('Solució');
    }

    /* ---- insight ---- */
    function renderInsight() {
      const s = solution();
      if (!st.revealed) { guide.set(1, 'Compara les dues equacions i fes la teva hipòtesi.'); return; }
      if (s.kind === 'unique') {
        guide.set(st.challenged.c1 ? 4 : 3, st.challenged.c1
          ? 'Comprovat! <b>' + F.fmtPoint(s.x, s.y) + '</b> compleix les dues equacions.'
          : 'Es tallen en <b>un punt</b>. Clica\'l al gràfic per comprovar-lo.', 'ok');
      } else if (s.kind === 'coincident') guide.set(4, 'És <b>la mateixa recta</b>: infinites solucions.', 'ok');
      else guide.set(4, 'Són <b>paral·leles</b>: no hi ha cap solució.', 'warn');
    }

    /* ---- mètodes ---- */
    function renderMethods() {
      const host = el('l4-metodes');
      const s = solution();
      // la resolució pas a pas desvetlla el tipus de sistema: es desbloqueja després de la predicció
      if (!st.revealed) {
        host.innerHTML = '<div class="fstep" style="border-style:dashed;text-align:center"><div class="fs-why">' +
          '🔒 Fes la <b>hipòtesi</b> per veure com es resol.</div></div>';
        return;
      }
      const par = (r) => r.isNeg() ? '(' + F.fmtR(r) + ')' : F.fmtR(r);
      // ampliació opcional: el determinant (no és necessari per classificar a 4t)
      const detBox = '<details class="fstep opt-more"><summary class="fs-label">Per saber-ne més: el determinant</summary>' +
        '<div class="fs-math">det = A₁B₂ − A₂B₁ = ' + par(st.A1) + '·' + par(st.B2) + ' − ' + par(st.A2) + '·' + par(st.B1) + ' = <b>' + F.fmtR(det()) + '</b></div>' +
        '<div class="fs-why">Si el determinant no és zero, el sistema té una sola solució. Si és zero, les rectes són paral·leles o la mateixa.</div></details>';
      if (s.kind !== 'unique') {
        const pr = proportion();
        host.innerHTML =
          '<div class="fstep"><div class="fs-label"><span class="fs-n">1</span>Compara els coeficients de x i y</div>' +
          '<div class="fs-math">' + lines(['① × ' + par(pr.k) + ': &nbsp;' + sysLine(st.A1.mul(pr.k), st.B1.mul(pr.k), st.C1.mul(pr.k)), '② ' + sysHTML(2)]) + '</div>' +
          '<div class="fs-why">Multiplicant ① per ' + F.fmtValPlain(pr.k) + ' obtenim els mateixos coeficients de <i>x</i> i <i>y</i> que a ②: les dues rectes tenen la <b>mateixa inclinació</b>.</div></div>' +
          '<div class="fstep"><div class="fs-label"><span class="fs-n">2</span>Compara els termes independents</div>' +
          '<div class="fs-math">' + F.fmtR(st.C1.mul(pr.k)) + (s.kind === 'coincident' ? ' = ' : ' ≠ ') + F.fmtR(st.C2) + '</div>' +
          '<div class="fs-why">' + (s.kind === 'coincident'
            ? 'També coincideixen: ② és la ① multiplicada per ' + F.fmtValPlain(pr.k) + '. Són <b>equacions equivalents</b>: la mateixa recta i <b>infinites solucions</b>.'
            : 'No coincideixen: si un punt complís ① i ②, tindríem ' + F.fmtValPlain(st.C1.mul(pr.k)) + ' = ' + F.fmtValPlain(st.C2) + ', que és impossible. Rectes <b>paral·leles</b>: <b>cap solució</b>.') + '</div></div>' +
          detBox;
        return;
      }
      const methods = [];
      methods.push({ id: 'red', name: 'Reducció', steps: stepsReduction() });
      if (!st.B1.isZero() || !st.B2.isZero()) methods.push({ id: 'sub', name: 'Substitució', steps: stepsSubstitution() });
      if (!st.B1.isZero() && !st.B2.isZero()) methods.push({ id: 'iga', name: 'Igualació', steps: stepsEqualize() });
      host.innerHTML =
        '<div class="method-tabs" role="tablist">' +
        methods.map((m, i) => '<button role="tab" data-m="' + m.id + '" aria-selected="' + (i === 0) + '">' + m.name + '</button>').join('') +
        '</div><div id="l4-mbody"></div>';
      const body = host.querySelector('#l4-mbody');
      function show(id) {
        host.querySelectorAll('[data-m]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.m === id)));
        const m = methods.find(x => x.id === id);
        body.innerHTML = '<div class="formula-steps">' + m.steps.map((s2, i) =>
          '<div class="fstep"><div class="fs-label"><span class="fs-n">' + (i + 1) + '</span>' + s2.label + '</div>' +
          '<div class="fs-math">' + s2.math + '</div>' +
          (s2.why ? '<div class="fs-why">' + s2.why + '</div>' : '') + '</div>').join('') + '</div>' + detBox;
      }
      host.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => show(b.dataset.m)));
      show(methods[0].id);
    }

    function sysHTML(i) {
      const A = i === 1 ? st.A1 : st.A2, B = i === 1 ? st.B1 : st.B2, C = i === 1 ? st.C1 : st.C2;
      return sysLine(A, B, C);
    }
    /* peces per escriure els passos amb signes nets */
    const VX = F.V('x'), VY = F.V('y');
    const mono = (k, v) => k.eq(R.ONE) ? v : k.eq(R.ONE.neg()) ? F.MIN + v : F.fmtR(k) + v;     // 2x, x, −x
    const parR = (r) => r.isNeg() ? '(' + F.fmtR(r) + ')' : F.fmtR(r);                             // (−3)
    const signed = (r) => r.isZero() ? '' : (r.isNeg() ? ' − ' : ' + ') + F.fmtR(r.abs());        //  − 3
    // diverses línies, una sota l'altra (sense repetir-ne cap)
    const lines = (arr) => '<span class="mrows">' + arr.filter((l, i) => arr.indexOf(l) === i).map(l => '<span class="mline">' + l + '</span>').join('') + '</span>';
    // A·x + B·(y conegut) = C  →  x = …
    function recoverX(A, B, C, y) {
      const rest = C.sub(B.mul(y));
      return lines([
        mono(A, VX) + ' + ' + parR(B) + '·' + parR(y) + ' = ' + F.fmtR(C),
        mono(A, VX) + signed(B.mul(y)) + ' = ' + F.fmtR(C),
        mono(A, VX) + ' = ' + F.fmtR(rest),
        VX + ' = ' + F.fmtR(rest.div(A))
      ]);
    }
    // k·v = c  →  v = c/k
    const solveFor = (k, c, v) => lines([mono(k, v) + ' = ' + F.fmtR(c), v + ' = ' + F.fmtR(c.div(k))]);
    // y = m·x + n amb x conegut
    function evalY(m, n, x) {
      return lines([VY + ' = ' + linRHS(m, n),
        VY + ' = ' + (m.eq(R.ONE) ? parR(x) : F.fmtR(m) + '·' + parR(x)) + signed(n) + ' = ' + F.fmtR(m.mul(x).add(n))]);
    }
    function stepSys() {
      return {
        label: 'Sistema inicial',
        math: lines(['① ' + sysHTML(1), '② ' + sysHTML(2)]),
        why: 'Dues equacions lineals amb dues incògnites: cal que es compleixin totes dues.'
      };
    }
    function stepSol(x, y) {
      return {
        label: 'Solució',
        math: '(' + VX + ', ' + VY + ') = (' + F.fmtR(x) + ', ' + F.fmtR(y) + ')',
        why: 'La parella (' + F.fmtValPlain(x) + ', ' + F.fmtValPlain(y) + ') compleix les dues equacions. Comprova-la a la pestanya «Comprova un punt».'
      };
    }

    function stepsReduction() {
      const { A1, B1, C1, A2, B2, C2 } = st;
      const steps = [stepSys()];
      if (A1.isZero() || A2.isZero()) { // una equació no té x → dona y directament
        const one = A1.isZero();
        const [Bk, Ck] = one ? [B1, C1] : [B2, C2];
        const [Ao, Bo, Co] = one ? [A2, B2, C2] : [A1, B1, C1];
        const y = Ck.div(Bk), x = Co.sub(Bo.mul(y)).div(Ao);
        steps.push({
          label: 'La ' + (one ? '1a' : '2a') + ' equació no té x',
          math: solveFor(Bk, Ck, VY),
          why: 'Aquesta equació només conté la incògnita y: la resolem directament.'
        });
        steps.push({
          label: 'Substitueix a la ' + (one ? '2a' : '1a'),
          math: recoverX(Ao, Bo, Co, y),
          why: 'Substituïm el valor de y i aïllem x.'
        });
        steps.push(stepSol(x, y));
        return steps;
      }
      // cas general: eliminem x multiplicant en creu
      if (!A1.eq(A2)) {
        steps.push({
          label: 'Iguala els coeficients de x',
          math: lines(['① × ' + parR(A2) + ': &nbsp;' + sysLine(A1.mul(A2), B1.mul(A2), C1.mul(A2)),
            '② × ' + parR(A1) + ': &nbsp;' + sysLine(A2.mul(A1), B2.mul(A1), C2.mul(A1))]),
          why: 'Multipliquem cada equació perquè el coeficient de x sigui el mateix a totes dues. Multiplicar per un nombre diferent de zero dona una equació equivalent.'
        });
      } else {
        steps.push({
          label: 'Els coeficients de x ja coincideixen',
          math: lines(['① ' + sysHTML(1), '② ' + sysHTML(2)]),
          why: 'No cal multiplicar res: el coeficient de x és el mateix a les dues equacions.'
        });
      }
      const By = B1.mul(A2).sub(B2.mul(A1));
      const Cy = C1.mul(A2).sub(C2.mul(A1));
      steps.push({
        label: 'Resta les dues equacions',
        math: sysLine(R.ZERO, By, Cy),
        why: 'Restem membre a membre: els termes en x s\'anul·len.'
      });
      const y = Cy.div(By);
      const x = C1.sub(B1.mul(y)).div(A1);
      steps.push({ label: 'Resol l\'equació en y', math: solveFor(By, Cy, VY), why: 'Ja només queda una incògnita.' });
      steps.push({
        label: 'Recupera x amb la 1a equació',
        math: recoverX(A1, B1, C1, y),
        why: 'Substituïm el valor de y en qualsevol de les equacions originals.'
      });
      steps.push(stepSol(x, y));
      return steps;
    }

    function stepsSubstitution() {
      const { A1, B1, C1, A2, B2, C2 } = st;
      const steps = [stepSys()];
      const first = !B1.isZero();
      const A = first ? A1 : A2, B = first ? B1 : B2, C = first ? C1 : C2;
      const At = first ? A2 : A1, Bt = first ? B2 : B1, Ct = first ? C2 : C1;
      const tag = first ? '①' : '②', tagT = first ? '②' : '①';
      const m = A.neg().div(B), n = C.div(B);
      steps.push({
        label: 'Aïlla y a l\'equació ' + tag,
        math: linHTML(m, n),
        why: 'Expressem y en funció de x per substituir-la a l\'altra equació.'
      });
      const k = At.add(Bt.mul(m));
      const kk = Ct.sub(Bt.mul(n));
      steps.push({
        label: 'Substitueix-ho a l\'equació ' + tagT,
        math: lines([
          (At.isZero() ? '' : mono(At, VX) + ' ') + (Bt.isNeg() ? F.MIN + ' ' : (At.isZero() ? '' : '+ ')) +
            (Bt.abs().eq(R.ONE) ? '' : F.fmtR(Bt.abs()) + '·') + '(' + linRHS(m, n) + ') = ' + F.fmtR(Ct),
          mono(k, VX) + ' = ' + F.fmtR(kk)
        ]),
        why: 'Ara l\'equació només té la incògnita x.'
      });
      const x = kk.div(k);
      steps.push({ label: 'Resol x', math: solveFor(k, kk, VX), why: 'És una equació de primer grau en x.' });
      steps.push({ label: 'Recupera y', math: evalY(m, n, x), why: 'Tornem a l\'expressió del pas 2.' });
      steps.push(stepSol(x, m.mul(x).add(n)));
      return steps;
    }

    function stepsEqualize() {
      const { A1, B1, C1, A2, B2, C2 } = st;
      const steps = [stepSys()];
      const m1 = A1.neg().div(B1), n1 = C1.div(B1);
      const m2 = A2.neg().div(B2), n2 = C2.div(B2);
      steps.push({
        label: 'Aïlla y a les dues equacions',
        math: lines(['① ' + linHTML(m1, n1), '② ' + linHTML(m2, n2)]),
        why: 'Escrivim les dues equacions en la forma y = mx + n per poder-les igualar.'
      });
      steps.push({
        label: 'Iguala les expressions de y',
        math: linRHS(m1, n1) + ' = ' + linRHS(m2, n2),
        why: 'Al punt de tall, la y és la mateixa a les dues rectes.'
      });
      const dm = m1.sub(m2), dn = n2.sub(n1);
      const x = dn.div(dm);
      steps.push({ label: 'Agrupa i resol x', math: solveFor(dm, dn, VX), why: 'Passem els termes amb x a un costat i les constants a l\'altre.' });
      steps.push({ label: 'Recupera y', math: evalY(m1, n1, x), why: 'Substituïm x a qualsevol de les dues expressions.' });
      steps.push(stepSol(x, m1.mul(x).add(n1)));
      return steps;
    }

    /* ---- comprovació de punts ---- */
    const ck = el('l4-check');
    ck.innerHTML =
      '<div class="checker">' +
      '<div class="ck-inputrow">' +
      '<label for="l4-px" class="help-note">Punt candidat:</label>' +
      '<input class="input math" id="l4-px" placeholder="x" style="width:80px" aria-label="Valor de x del punt">' +
      '<span class="math" style="font-weight:700">,</span>' +
      '<input class="input math" id="l4-py" placeholder="y" style="width:80px" aria-label="Valor de y del punt">' +
      '<button class="btn primary small" id="l4-pgo">Comprova</button>' +
      '<button class="btn ghost small" id="l4-psol">Prova la solució</button>' +
      '</div><div class="ck-result" id="l4-pres"></div>' +

      '</div>';
    function checkPoint(x, y) {
      st.cand = { x, y };
      const ok1 = st.A1.mul(x).add(st.B1.mul(y)).eq(st.C1);
      const ok2 = st.A2.mul(x).add(st.B2.mul(y)).eq(st.C2);
      el('l4-pres').innerHTML =
        '<div class="check-line"><span class="cl-label">eq ①</span>' + substHTML(st.A1, st.B1, st.C1, x, y) + '</div>' +
        '<div class="check-line"><span class="cl-label">eq ②</span>' + substHTML(st.A2, st.B2, st.C2, x, y) + '</div>' +
        ((ok1 && ok2)
          ? '<span class="verdict yes">' + UI.icon('check') + '(' + F.fmtVal(x) + ', ' + F.fmtVal(y) + ') <b>és solució del sistema</b></span>'
          : '<span class="verdict no">' + UI.icon('x') + '(' + F.fmtVal(x) + ', ' + F.fmtVal(y) + ') <b>no és solució</b>' +
          ((!ok1 && !ok2) ? ' — no compleix cap de les dues' : ' — només compleix l\'equació ' + (ok1 ? '①' : '②')) + '</span>');
      const s = solution();
      if (s.kind === 'unique' && ok1 && ok2 && !st.challenged.c1) {
        st.challenged.c1 = true;
        UI.toast('Has trobat (i comprovat) la solució del sistema!', 'ok');
        renderChallenges();
      }
      refresh(false);
    }
    el('l4-pgo').addEventListener('click', () => {
      try {
        const x = L.parseValue(el('l4-px').value), y = L.parseValue(el('l4-py').value);
        checkPoint(x, y);
      } catch (e) { el('l4-pres').innerHTML = '<span class="field-msg">' + e.message + '</span>'; }
    });
    [el('l4-px'), el('l4-py')].forEach(i => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') el('l4-pgo').click(); }));
    el('l4-psol').addEventListener('click', () => {
      const s = solution();
      if (s.kind !== 'unique') { UI.toast('Aquest sistema no té una parella única per provar.', 'warn'); return; }
      el('l4-px').value = F.fmtValPlain(s.x); el('l4-py').value = F.fmtValPlain(s.y);
      checkPoint(s.x, s.y);
    });

    /* clic al gràfic = punt candidat */
    (function bindGraphClick() {
      let down = null;
      st.graph.svg.addEventListener('pointerdown', (e) => { down = { x: e.offsetX, y: e.offsetY }; });
      st.graph.svg.addEventListener('pointerup', (e) => {
        if (!down) return;
        const moved = Math.hypot(e.offsetX - down.x, e.offsetY - down.y);
        down = null;
        if (moved > 6) return; // era un arrossegament (pan)
        const gx = st.graph.Xinv(e.offsetX), gy = st.graph.Yinv(e.offsetY);
        const snap = (v) => R.num(Math.round(v * 2) / 2);
        el('l4-px').value = F.fmtValPlain(snap(gx));
        el('l4-py').value = F.fmtValPlain(snap(gy));
        checkPoint(snap(gx), snap(gy));
      });
    })();

    /* ---- reptes ---- */
    function renderChallenges() {
      const s = solution();
      const CH = [
        { id: 'c1', title: 'Troba i comprova la solució', load: 'det', desc: 'Clica el punt de tall al gràfic.', done: !!st.challenged.c1 },
        { id: 'c2', title: 'Fes-les paral·leles', desc: 'Amb <b>✎ Edita</b>, canvia un coeficient perquè no es tallin mai.', done: !!st.challenged.c2 },
        { id: 'c3', title: 'Fes-les coincidents', desc: 'Que la segona equació sigui la primera multiplicada per 2.', done: !!st.challenged.c3 },
        { id: 'c4', title: 'Una recta vertical', load: 'ver', desc: 'Quantes solucions té si una recta és <span class="math">x = 2</span>?', done: !!st.challenged.c4 }
      ];
      CH.forEach(c => { if (c.done) L.App.markDone('m4', c.id); });
      el('l4-chalcount').textContent = CH.filter(c => c.done).length + '/' + CH.length;
      el('l4-chal').innerHTML = CH.map(c =>
        '<div class="challenge-card"><div class="ch-head"><span class="ch-num">' + (c.done ? '✓' : '▸') + '</span>' +
        '<span class="ch-title">' + c.title + '</span></div>' +
        '<div class="ch-desc">' + c.desc + '</div>' +
        '<div class="ch-foot"><span class="ch-state ' + (c.done ? 'done' : 'todo') + '">' + (c.done ? '✓ aconseguit' : 'pendent') + '</span>' +
        (!c.done && c.load && (st.presetId !== c.load || !st.acted) ? '<button class="btn soft small" data-load="' + c.load + '">Prova-la ▸</button>' : '') +
        '</div></div>').join('');
      el('l4-chal').querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => loadPreset(b.dataset.load)));
      if (!st.challenged.c2 && st.acted && s.kind === 'parallel') { st.challenged.c2 = true; UI.toast('Repte aconseguit: rectes paral·leles, cap solució.', 'ok'); renderChallenges(); }
      if (!st.challenged.c3 && st.acted && s.kind === 'coincident') { st.challenged.c3 = true; UI.toast('Repte aconseguit: mateixa recta, infinites solucions.', 'ok'); renderChallenges(); }
      if (!st.challenged.c4 && st.presetId === 'ver' && st.acted) { st.challenged.c4 = true; UI.toast('Repte aconseguit: has treballat amb una recta vertical.', 'ok'); renderChallenges(); }
    }

    /* ---- gràfic ---- */
    function renderGraph(full) {
      const g = st.graph;
      g.clearData();
      g.addImplicitLine(st.A1.toNumber(), st.B1.toNumber(), st.C1.toNumber(), { color: '#1d5fd6', width: 4.5, label: '①' });
      g.addImplicitLine(st.A2.toNumber(), st.B2.toNumber(), st.C2.toNumber(), { color: '#0d9463', width: 4.5, label: '②' });
      g.setReadout({
        items: [
          { label: 'y₁', color: '#1d5fd6', ink: '#14418f', fn: (x) => st.B1.toNumber() === 0 ? NaN : (st.C1.toNumber() - st.A1.toNumber() * x) / st.B1.toNumber() },
          { label: 'y₂', color: '#0d9463', ink: '#0a6e4a', fn: (x) => st.B2.toNumber() === 0 ? NaN : (st.C2.toNumber() - st.A2.toNumber() * x) / st.B2.toNumber() }
        ], eq: true
      });
      const s = solution();
      const feats = [{ x: 0, y: 0 }];
      if (!st.B1.isZero()) feats.push({ x: 0, y: st.C1.div(st.B1).toNumber() });
      if (!st.B2.isZero()) feats.push({ x: 0, y: st.C2.div(st.B2).toNumber() });
      if (!st.A1.isZero()) feats.push({ x: st.C1.div(st.A1).toNumber(), y: 0 });
      if (!st.A2.isZero()) feats.push({ x: st.C2.div(st.A2).toNumber(), y: 0 });
      if (s.kind === 'unique') {
        feats.push({ x: s.x.toNumber(), y: s.y.toNumber() });
        if (st.revealed) {
          g.addMark(s.x.toNumber(), s.y.toNumber(), {
            color: '#ef9f17', label: '(' + F.fmtValPlain(s.x) + ', ' + F.fmtValPlain(s.y) + ')'
          });
        }
      }
      if (st.cand) {
        g.addMark(st.cand.x.toNumber(), st.cand.y.toNumber(), {
          color: '#5b70c9', hollow: true, r: 8, label: null
        });
      }
      /* avís «fora de vista»: la intersecció existeix encara que no es vegi.
         Es reevalua a cada render del gràfic (també durant pan/zoom). */
      g.onRenderCb = updateOutsideNote;
      function updateOutsideNote() {
        const s2 = solution();
        const host2 = el('l4-graf').parentElement;
        const old = host2.querySelector('.outside-note');
        if (old) old.remove();
        if (s2.kind === 'unique' && g.userView && g.isOutside(s2.x.toNumber(), s2.y.toNumber()) && !g._destroyed) {
          const div = document.createElement('div');
          div.className = 'outside-note';
          div.innerHTML = 'La solució existeix, però és fora de la vista: <b>no passi res!</b> <button id="l4-center">Centra-la</button>';
          host2.appendChild(div);
          div.querySelector('#l4-center').addEventListener('click', () => { g.userView = false; refresh(true); });
        }
      }
      updateOutsideNote();
      g.setAriaLabel('Gràfic de les dues rectes del sistema: ' + F.fmtSystemLinePlain(st.A1, st.B1, st.C1) + ' i ' + F.fmtSystemLinePlain(st.A2, st.B2, st.C2) +
        (s.kind === 'unique' ? '. La solució és el punt (' + F.fmtValPlain(s.x) + ', ' + F.fmtValPlain(s.y) + ')' : s.kind === 'coincident' ? '. Les dues rectes coincideixen.' : '. Les rectes són paral·leles i no es tallen.'));
      UI.veil(el('l4-graf').parentElement, !st.revealed, 'Primer fes la teva hipòtesi. Després veuràs les rectes.');
      if (!g.userView || full) g.autoFit(feats); else g.render();
    }

    /* ---- refresc ---- */
    function refresh(full) {
      el('l4-d1').innerHTML = sysHTML(1);
      el('l4-d2').innerHTML = sysHTML(2);
      renderPrediction();
      renderStatus();
      renderInsight();
      renderMethods();
      renderChallenges();
      renderGraph(full);
      updateHash();
    }

    /* ---- hash ---- */
    function updateHash() {
      if (st.presetId === 'lliure') {
        L.App.updateHash({
          a1: st.A1.toString(), b1: st.B1.toString(), c1: st.C1.toString(),
          a2: st.A2.toString(), b2: st.B2.toString(), c2: st.C2.toString()
        });
      } else L.App.updateHash({ p: st.presetId });
    }

    /* ---- inici ---- */
    let loaded = false;
    if (params.p && PRESETS.some(pp => pp.id === params.p)) {
      const p = PRESETS.find(pp => pp.id === params.p);
      st.A1 = num(p.A1); st.B1 = num(p.B1); st.C1 = num(p.C1);
      st.A2 = num(p.A2); st.B2 = num(p.B2); st.C2 = num(p.C2);
      st.presetId = p.id; loaded = true;
    } else if (params.a1 !== undefined) {
      try {
        st.A1 = R.parse(params.a1); st.B1 = R.parse(params.b1); st.C1 = R.parse(params.c1);
        st.A2 = R.parse(params.a2); st.B2 = R.parse(params.b2); st.C2 = R.parse(params.c2);
        st.presetId = 'lliure'; loaded = true;
      } catch (e) { }
    }
    syncCoefInputs();
    renderPresets();
    refresh(true);
    if (!loaded) updateHash();

    /* ---- «Explica-m'ho» en català senzill ---- */
    UI.addExplain(main.querySelector('.viz-head'), () => {
      const s = solution();
      let now;
      if (!st.revealed) now = 'Compara les equacions: si una és l\'altra multiplicada per un nombre, les rectes tenen la mateixa inclinació.';
      else if (s.kind === 'unique') now = 'Aquí es tallen al punt <b>(' + F.fmtValPlain(s.x) + ', ' + F.fmtValPlain(s.y) + ')</b>: x = ' + F.fmtValPlain(s.x) + ' i y = ' + F.fmtValPlain(s.y) + '.';
      else if (s.kind === 'coincident') now = 'Aquí les dues rectes són <b>la mateixa</b>: hi ha infinites solucions.';
      else now = 'Aquí les rectes són <b>paral·leles</b>: no es toquen mai i no hi ha cap solució.';
      return [
        'Hi ha dues rectes: la <b>blava</b> és l\'equació ① i la <b>verda</b> és l\'equació ②.',
        'La solució del sistema és el punt on les dues rectes <b>es tallen</b>. Aquest punt compleix les dues equacions alhora.',
        'Es tallen en un punt: <b>1 solució</b>. Són paral·leles: <b>cap solució</b>. Són la mateixa recta: <b>infinites solucions</b>.',
        now
      ];
    });

    return function cleanup() { try { st.graph.destroy(); } catch (e) { } };
  }

  function help() {
    UI.openModal({
      title: 'Sistemes · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>La idea gran.</b> Resoldre un sistema és trobar la parella <span class="math">(x, y)</span> que compleix <b>les dues</b> equacions alhora. Gràficament: el punt on es tallen les rectes.</p>' +
      '<div class="math-block"><span class="mb-note">exemple complet: substitució</span>' +
      '① y = 2x + 1<br>② y = −x + 4<br>' +
      'Igualar: 2x + 1 = −x + 4 → 3x = 3 → <b>x = 1</b><br>' +
      'i llavors y = 2·1 + 1 = <b>3</b>. Solució: (1, 3)</div>' +
      '<p><b>Tres famílies de sistemes:</b></p>' +
      '<ul style="list-style:disc;padding-left:22px;line-height:1.9">' +
      '<li><b>Determinat</b>: rectes secants → una única solució (det ≠ 0).</li>' +
      '<li><b>Indeterminat</b>: rectes coincidents → infinites solucions.</li>' +
      '<li><b>Incompatible</b>: rectes paral·leles diferents → cap solució.</li></ul>' +
      '<p class="help-note"><b>Com es classifica?</b> Compara les equacions. Si la ② és la ① multiplicada per un nombre, és la mateixa recta. Si només ho són els coeficients de <i>x</i> i <i>y</i>, són paral·leles. Si no, es tallen. No ho decideixis només mirant el gràfic: el punt de tall pot ser fora de la finestra (clica «Centra-la»).</p>' +

      '<p class="help-note"><b>Per què forma general Ax + By = C?</b> Perquè hi ha rectes verticals (x = k) que no es poden escriure com y = mx + n. Aquí les pots crear posant B = 0.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'm4', kind: 'lab', num: 'M4', short: 'Sistemes', goals: 4,
    title: 'Sistemes d\'equacions lineals', sub: 'Mòdul 4 · dues rectes, tres finals',
    desc: 'Dues rectes: es tallen, són paral·leles o la mateixa?',
    foot: 'Rectes, determinants i mètodes',
    iconHTML: '4',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
