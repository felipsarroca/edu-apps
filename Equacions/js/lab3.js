/* ============================================================
   lab3.js — MÒDUL 3 · Equacions de segon grau
   Coeficients a, b, c vinculats a paràbola, discriminant i arrels.
   Predicció abans de revelar Δ; fórmula general pas a pas;
   factorització i mètodes ràpids per a incompletes; comprovació.
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, Poly = L.Poly, F = L.fmt, UI = L.UI;

  // els exemples surten del banc comú (js/banc.js)
  const PRESETS = L.BANC.m3.items;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // equació aleatòria «amable»: arrels enteres, doble o cap arrel real, amb coeficients dins dels lliscadors
  function randomQuad() {
    for (;;) {
      const t = Math.random(), a = [1, 1, 1, -1, 2][rnd(0, 4)];
      let b, c;
      if (t < .6) { const r1 = rnd(-4, 4), r2 = rnd(-4, 4); b = -a * (r1 + r2); c = a * r1 * r2; }
      else if (t < .8) { const r = rnd(-3, 3); b = -2 * a * r; c = a * r * r; }
      else { b = rnd(-4, 4); c = Math.sign(a) * (Math.ceil(b * b / (4 * Math.abs(a))) + rnd(1, 3)); }
      if (Math.abs(b) <= 10 && Math.abs(c) <= 10) return { a: BigInt(a), b: BigInt(b), c: BigInt(c) };
    }
  }

  function polyOf(a, b, c) { return new Poly([R.cast(c), R.cast(b), R.cast(a)]); }

  function render(main, params) {
    const st = {
      a: R.ONE, b: R.make(-5n), c: R.make(6n),
      presetId: 'two', revealed: true, challenged: {}, graph: null
    };

    main.innerHTML =
      '<div class="lab cols">' +
      '<div class="lab-viewtabs" role="tablist" aria-label="Vistes del laboratori">' +
      '<button data-viewtab="ctrl" type="button">' + UI.icon('arrows') + 'Equació i coeficients</button>' +
      '<button data-viewtab="viz" type="button">' + UI.icon('chart') + 'Paràbola</button></div>' +
      '<div class="lab-left">' +

      '<div class="card"><div class="card-title">' + UI.icon('flask') + 'Equació</div>' +
      '<div class="eq-display" id="l3-eq"></div>' +
      '<div id="l3-coefs" data-fold style="margin-top:6px"></div>' +
      '<div id="l3-presets" data-fold style="margin-top:8px"></div></div>' +
      '<div class="vtabs">' +
      '<div class="vtabs-bar" role="tablist" aria-label="Seccions">' +
      '<button data-tab="formula" role="tab">Resol pas a pas</button>' +
      '<button data-tab="comprova" role="tab">Comprova</button>' +
      '<button data-tab="reptes" role="tab">Reptes <span class="tab-count" id="l3-chalcount"></span></button></div>' +
      '<div class="vtabs-panel" data-panel="formula" id="l3-formula"></div>' +
      '<div class="vtabs-panel" data-panel="comprova" id="l3-check"></div>' +
      '<div class="vtabs-panel" data-panel="reptes" id="l3-chal"></div>' +
      '</div></div>' +
      '<div class="lab-right">' +
      '<div id="l3-predhost"></div>' +
      '<div class="viz-card">' +
      '<div class="viz-head">' +
      '<span class="viz-title">' + UI.icon('chart') + 'Paràbola y = f(x)</span>' +
      '<div class="legend">' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#1d5fd6"></span>y = ax² + bx + c</span>' +
      '<span class="lg-chip" id="l3-legroots"><span class="lg-swatch" style="border-color:#ef9f17"></span>arrels / vèrtex</span>' +
      '</div></div>' +
      '<div class="viz-body"><div class="graph-host" id="l3-graf"></div></div></div>' +
      '<div class="statusbar" id="l3-status"></div>' +
      '<div id="l3-insight"></div>' +
      '</div></div>';

    UI.bindLabViewTabs(main.querySelector('.lab'), 'ctrl', () => el('l3-eq').innerHTML);
    const tabs = UI.tabsInit(main.querySelector('.vtabs'));
    UI.foldCard(main.querySelector('.lab-left [data-fold]').closest('.card'), 'm3');
    const el = (id) => main.querySelector('#' + id);
    st.graph = new L.Graph(el('l3-graf'));
    const guide = UI.guide(el('l3-insight'), ['Mira la paràbola', 'Mira Δ', 'Comprova']);

    /* ---- coeficients ---- */
    const coefs = el('l3-coefs');
    const rows = {};
    function bindCoef(name, get, set) {
      const row = UI.coefRow({
        name, value: get(), min: -10, max: 10, step: 1,
        onChange: (r, src) => {
          if (src === 'init') return; // la initView no és una edició
          // després de la hipòtesi, moure els lliscadors és explorar: Δ i les arrels es veuen en directe
          set(r); st.presetId = 'lliure'; st.acted = true; st.checked = false; st.reflect = null; renderPresets(); refresh(); updateHash();
        },
        warn: (r) => (name === 'a' && r.isZero())
          ? 'Amb a = 0 l\'equació deixa de ser de segon grau: passa a de primer grau.'
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
    const picker = UI.levelPicker(el('l3-presets'), {
      groups: L.BANC.m3.groups,
      items: PRESETS.map(p => ({ id: p.id, level: p.level, title: F.fmtPolyPlain(polyOf(p.a, p.b, p.c)) + ' = 0' })),
      onPick: loadPreset,
      onRandom: () => loadCoefs(randomQuad(), 'lliure')
    });
    function renderPresets() { picker.setActive(st.presetId); }

    /* ---- solució ---- */
    function solution() { return L.solveQuadratic(st.a, st.b, st.c); }
    function isQuadratic() { return !st.a.isZero(); }

    function rootCountText(q) {
      if (!isQuadratic()) {
        if (q.kind === 'linear') return 'una';
        if (q.kind === 'all') return 'infinites';
        return 'cap';
      }
      if (q.kind === 'two') return 'dues';
      if (q.kind === 'double') return 'una (doble)';
      if (q.kind === 'none-real') return 'cap';
      return '?';
    }

    /* ---- predicció ---- */
    // hipòtesi a partir de l'equació (la paràbola encara no es veu); després es compara amb el gràfic
    const COUNT = ['Cap', 'Una (doble)', 'Dues'];
    function renderPrediction() {
      const host = el('l3-predhost');
      if (st.revealed) {
        if (st.reflect && !host.querySelector('.reflect-card')) {
          const r = st.reflect;
          UI.reflect(host, Object.assign({ lab: 'm3', onClose: () => { st.reflect = null; } }, r));
        } else if (!st.reflect) host.innerHTML = '';
        return;
      }
      host.innerHTML = '';
      if (!isQuadratic()) return;
      const q = solution();
      const correct = q.kind === 'two' ? 2 : (q.kind === 'double' ? 1 : 0);
      const opts = [
        { label: UI.pic('par0', COUNT[0]), correct: correct === 0 },
        { label: UI.pic('par1', COUNT[1]), correct: correct === 1 },
        { label: UI.pic('par2', COUNT[2]), correct: correct === 2 }
      ];
      const card = UI.renderPrediction({
        mode: 'hypothesis',
        question: 'Mira l\'equació. Quantes vegades creus que la paràbola tallarà l\'eix X?',
        options: opts,
        continueLabel: 'Mostra la paràbola ▸',
        onDone: (ok, i) => {
          const d = q.delta;
          st.reflect = {
            ok, said: COUNT[i], happened: COUNT[correct],
            why: 'Δ = b² − 4ac = ' + F.fmtValPlain(d) + (d.isPos() ? ' &gt; 0: dues arrels.' : d.isZero() ? ' = 0: una arrel doble.' : ' &lt; 0: cap arrel real.') +
              ' El discriminant ho diu <b>sense dibuixar</b> la paràbola.'
          };
          st.revealed = true; refresh();
        }
      });
      host.appendChild(card);
    }

    /* ---- barra d'estat ---- */
    function renderStatus() {
      const sb = el('l3-status');
      const q = solution();
      if (!isQuadratic()) {
        let badge, sol;
        if (q.kind === 'linear') {
          badge = '<span class="badge warn">' + UI.icon('info') + 'a = 0: ha passat a <b>primer grau</b></span>';
          sol = '<span class="sol-chip math">x = ' + F.fmtVal(q.root) + '</span>';
        } else if (q.kind === 'all') {
          badge = '<span class="badge warn">' + UI.icon('info') + 'a = 0 i b = 0: identitat</span>';
          sol = '<span class="sol-chip">ℝ</span>';
        } else {
          badge = '<span class="badge warn">' + UI.icon('info') + 'a = 0 i b = 0: contradicció</span>';
          sol = '<span class="sol-chip none">∅</span>';
        }
        sb.innerHTML = '<span class="sb-item">' + badge + '</span><span class="sb-item">' + sol + '</span>';
        return;
      }
      const dPos = q.delta.isPos(), dZero = q.delta.isZero();
      const dChip = '<span class="d-chip ' + (dPos ? 'pos' : dZero ? 'zero' : 'neg') + '">' +
        'Δ = ' + F.fmtVal(q.delta) + (dPos ? ' &gt; 0' : dZero ? ' = 0' : ' &lt; 0') + '</span>';
      let rootsHTML;
      if (q.kind === 'two') {
        rootsHTML = '<span class="sol-chip math">x₁ = ' + F.fmtVal(q.root1, { approx: !q.rational }) + '</span>' +
          '<span class="sol-chip math">x₂ = ' + F.fmtVal(q.root2, { approx: !q.rational }) + '</span>';
      } else if (q.kind === 'double') {
        rootsHTML = '<span class="sol-chip math">x = ' + F.fmtVal(q.root) + '</span> <span class="sc-note">arrel doble</span>';
      } else {
        rootsHTML = '<span class="sol-chip none">cap arrel <b>real</b></span>';
      }
      const vx = F.fmtValPlain(q.vertex.x), vy = F.fmtValPlain(q.vertex.y);
      // abans de la predicció no mostrem cap resposta (ni tan sols amb el mode «amaga respostes» desactivat)
      const pending = '<span class="sol-chip pending" title="Fes primer la predicció">?</span>';
      const masked = !st.revealed;
      sb.innerHTML =
        '<span class="sb-item"><span class="sb-label">Discriminant</span>' +
        (masked ? pending : '<span class="m3-delta">' + dChip + '</span>') + '</span>' +
        '<span class="sb-item"><span class="sb-label">Arrels</span>' + (masked ? pending : rootsHTML) + '</span>' +
        '<span class="sb-item"><span class="sb-label">Vèrtex</span><span class="math">' +
        (masked ? pending : 'V(' + vx + ', ' + vy + ')') + '</span></span>';
      const legRoots = main.querySelector('#l3-legroots');
      if (legRoots) legRoots.style.display = st.revealed ? '' : 'none';
    }

    /* ---- insight ---- */
    function renderInsight() {
      const q = solution();
      if (!isQuadratic()) { guide.set(1, 'Amb <b>a = 0</b> ja no és de segon grau: és una recta.', 'warn'); return; }
      if (!st.revealed) { guide.set(1, 'Mira l\'equació i fes la teva hipòtesi.'); return; }
      const step = st.checked ? 4 : 3;
      if (q.kind === 'two') guide.set(step, '<b>Δ &gt; 0</b>: talla l\'eix dues vegades. Comprova una arrel a <b>Comprova</b>.', 'ok');
      else if (q.kind === 'double') guide.set(step, '<b>Δ = 0</b>: el vèrtex toca l\'eix. Hi ha una arrel doble.', 'ok');
      else guide.set(4, '<b>Δ &lt; 0</b>: no toca l\'eix. No hi ha cap arrel real.', 'warn');
    }

    /* ---- fórmula pas a pas ---- */
    function renderFormula() {
      const host = el('l3-formula');
      const a = st.a, b = st.b, c = st.c;
      const q = solution();
      if (!isQuadratic()) {
        host.innerHTML =
          '<div class="fstep"><div class="fs-label">Atenció: a = 0</div>' +
          '<div class="fs-why">L\'equació <b>no és de segon grau</b> (el coeficient de x² és zero). El laboratori no corrigeix el valor en silenci: la reclassifica. ' +
          (q.kind === 'linear'
            ? 'Ara és lineal: ' + F.fmtPoly(polyOf(a, b, c), 'x') + ' = 0 → <span class="math">x = ' + F.fmtValPlain(q.root) + '</span>.'
            : q.kind === 'all' ? 'Queda 0 = 0: identitat, tots els reals.'
              : 'Queda una contradicció sense solució.') + '</div></div>';
        return;
      }
      const steps = [];
      steps.push({
        label: 'Identifica els coeficients',
        math: 'a = ' + F.fmtR(a) + ',&nbsp; b = ' + F.fmtR(b) + ',&nbsp; c = ' + F.fmtR(c),
        why: 'Compara amb la forma general ax² + bx + c = 0. Els signes compten!'
      });
      const b2 = b.mul(b), ac4 = R.make(4n).mul(a).mul(c);
      // els negatius substituïts van entre parèntesis: (−5)² = 25, mentre que −5² = −25
      const par = (r) => r.isNeg() ? '(' + F.fmtR(r) + ')' : F.fmtR(r);
      steps.push({
        label: 'Calcula el discriminant Δ',
        math: F.chain('Δ', [
          F.V('b') + '<sup class="exp">2</sup> − 4' + F.V('a') + F.V('c'),
          par(b) + '<sup class="exp">2</sup> − 4·' + par(a) + '·' + par(c),
          F.fmtR(b2) + (ac4.isNeg() ? ' + ' + F.fmtR(ac4.abs()) : ' − ' + F.fmtR(ac4)),
          '<b>' + F.fmtR(q.delta) + '</b>'
        ]),
        why: 'És el número decisiu: anuncia quantes arrels reals hi haurà abans de calcular-les.'
      });
      steps.push({
        label: 'Interpreta el signe de Δ',
        math: q.delta.isPos() ? 'Δ &gt; 0 → dues arrels reals diferents'
          : q.delta.isZero() ? 'Δ = 0 → una arrel doble' : 'Δ &lt; 0 → cap arrel real',
        why: q.delta.isPos() ? 'El radicand de la fórmula general serà positiu: hi ha dues arrels.'
          : q.delta.isZero() ? 'El radicand és zero: ±√0 no separa res, les arrels coincideixen.'
            : 'En els reals no existeix l\'arrel d\'un negatiu: cap tall amb l\'eix X.'
      });
      if (!q.delta.isNeg()) {
        const twoA = a.mul(2);
        // √Δ simplificat (√16 = 4, √8 = 2√2) per a l'últim pas de la fórmula
        const sq = L.sqrtRational(q.delta);
        const rootD = sq.exact !== undefined ? F.fmtR(sq.exact) : F.fmtSurd(sq.surd);
        const negB = F.fmtR(b.neg());
        steps.push({
          label: 'Aplica la fórmula general',
          math: F.chain(F.V('x'), [
            F.fracHTML('−' + F.V('b') + ' ' + F.PM + ' ' + F.sqrtHTML(F.V('b') + '<sup class="exp">2</sup> − 4' + F.V('a') + F.V('c')), '2' + F.V('a')),
            F.fracHTML('−' + par(b) + ' ' + F.PM + ' ' + F.sqrtHTML(F.fmtR(q.delta)), '2·' + par(a)),
            F.fracHTML(negB + ' ' + F.PM + ' ' + rootD, F.fmtR(twoA))
          ]),
          why: 'Substituïm a, b i Δ pels seus valors. El ± dona les dues arrels: una amb + i l\'altra amb −.'
        });
        if (q.kind === 'two') {
          // amb + dona l'arrel més gran si 2a > 0
          const plusFirst = twoA.isPos();
          const hi = q.root1.toNumber() > q.root2.toNumber() ? q.root1 : q.root2;
          const lo = hi === q.root1 ? q.root2 : q.root1;
          const rPlus = plusFirst ? hi : lo, rMinus = plusFirst ? lo : hi;
          const row = (name, sign, val) => F.chain(name, (q.rational
            ? [F.fracHTML(negB + ' ' + sign + ' ' + rootD, F.fmtR(twoA)), '<b>' + F.fmtVal(val) + '</b>']
            : ['<b>' + F.fmtVal(val) + '</b> &nbsp;≈ ' + F.fmtNum(val.toNumber(), 3)]));
          steps.push({
            label: 'Les dues arrels',
            math: '<span class="mrows">' + row(F.V('x') + '<sub>1</sub>', '+', rPlus) + row(F.V('x') + '<sub>2</sub>', '−', rMinus) + '</span>',
            why: q.rational ? 'Δ era un quadrat perfecte: les arrels són racionals (exactes).' :
              'Són irracionals: les deixem exactes amb el radical. El decimal només és una aproximació.'
          });
          const f = L.factorQuadratic(q);
          if (f) {
            steps.push({
              label: 'Comprova-ho factoritzant',
              math: '<span class="mrows">' + F.chain(F.fmtPoly(polyOf(a, b, c), 'x'), [F.fmtFactorized(f) + ' = 0']) +
                '<span class="mline">' + F.V('x') + ' = ' + F.fmtVal(f.r1) + ' &nbsp;o&nbsp; ' + F.V('x') + ' = ' + F.fmtVal(f.r2) + '</span></span>',

              why: 'Si A·B = 0, llavors A = 0 o B = 0. Mateixes arrels: tot quadra!'
            });
          }
        } else {
          steps.push({
            label: 'Arrel doble',
            math: 'x = ' + F.fmtVal(q.root) + ' (multiplicitat 2)',
            why: 'Les dues arrels coincideixen: el vèrtex de la paràbola és sobre l\'eix X.'
          });
        }
      } else {
        steps.push({
          label: 'Conclusió',
          math: 'Cap arrel real',
          why: 'Δ &lt; 0: √Δ no existeix en els reals. La paràbola no toca l\'eix X. (En els nombres complexos sí que hi hauria arrels: ho veuràs a batxillerat.)'
        });
      }
      /* mètodes ràpids per a incompletes */
      if (b.isZero() && !a.isZero()) {
        const k = c.neg().div(a);
        const sq = L.sqrtRational(k);
        const has = !k.isNeg();
        steps.push({
          label: 'Mètode ràpid (incompleta amb b = 0)',
          math: F.fmtR(a) + 'x² = ' + F.fmtR(c.neg()) + ' → x² = ' + F.fmtR(k) +
            (has ? ' → x = ' + F.PM + (sq.exact !== undefined ? F.fmtVal(sq.exact) : F.fmtSurd(sq.surd)) : ' → cap arrel real'),
          why: 'Amb b = 0 no cal la fórmula: aïlla x² i extreu l\'arrel. Compte: l\'arrel d\'un negatiu no existeix en els reals!'
        });
      }
      if (c.isZero() && !a.isZero() && !b.isZero()) {
        steps.push({
          label: 'Mètode ràpid (incompleta amb c = 0)',
          math: F.fmtPoly(polyOf(a, b, c), 'x') + ' = x(' + F.fmtPoly(Poly.linear(a, b), 'x') + ') = 0 → x = 0 o x = ' + F.fmtVal(b.neg().div(a)),
          why: 'Treiem x de factor comú. Un producte és zero si algun dels factors és zero: així x = 0 és sempre arrel.'
        });
      }
      // fins que no hi ha predicció només es veu el primer pas: la resta desvetllaria la resposta
      const shown = st.revealed ? steps : steps.slice(0, 1);
      host.innerHTML = '<div class="formula-steps">' + shown.map((s, i) =>
        '<div class="fstep"><div class="fs-label"><span class="fs-n">' + (i + 1) + '</span>' + s.label + '</div>' +
        '<div class="fs-math">' + s.math + '</div>' +
        (s.why ? '<div class="fs-why">' + s.why + '</div>' : '') + '</div>').join('') +
        (st.revealed ? '' : '<div class="fstep" style="border-style:dashed;text-align:center"><div class="fs-why">' +
          '🔒 Fes la <b>predicció</b> per veure la resta.</div></div>') +
        '</div>';
    }

    /* ---- comprovador ---- */
    const ck = el('l3-check');
    ck.innerHTML =
      '<div class="checker">' +
      '<div class="ck-inputrow">' +
      '<label for="l3-ckx" class="help-note">És aquest valor arrel?</label>' +
      '<input class="input math" id="l3-ckx" placeholder="p. ex. 2 o (3+√5)/2">' +
      '<button class="btn primary small" id="l3-ckgo">Comprova</button>' +
      '<button class="btn ghost small" id="l3-cksol">Prova una arrel</button>' +
      '</div><div class="ck-result" id="l3-ckres"></div>' +

      '</div>';
    function doCheck(x) {
      const p = polyOf(st.a, st.b, st.c);
      const val = p.eval(x);
      if (val.isZero() && !st.checked) { st.checked = true; renderInsight(); }
      el('l3-ckres').innerHTML =
        '<div class="check-line"><span class="cl-label">substitució</span>' +
        F.fmtSubstitution(p, x) + ' = ' + F.fmtVal(val) + '</div>' +
        (val.isZero()
          ? '<span class="verdict yes">' + UI.icon('check') + 'x = ' + F.fmtVal(x) + ' <b>és arrel</b>: fa zero el primer membre</span>'
          : '<span class="verdict no">' + UI.icon('x') + 'x = ' + F.fmtVal(x) + ' <b>no és arrel</b>: dona ' + F.fmtVal(val) + ', no 0</span>');
    }
    el('l3-ckgo').addEventListener('click', () => {
      try { doCheck(L.parseValue(el('l3-ckx').value)); }
      catch (e) { el('l3-ckres').innerHTML = '<span class="field-msg">' + e.message + '</span>'; }
    });
    el('l3-ckx').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('l3-ckgo').click(); });
    el('l3-cksol').addEventListener('click', () => {
      const q = solution();
      if (q.kind === 'two' || q.kind === 'double') {
        const r = q.kind === 'double' ? q.root : q.root1;
        el('l3-ckx').value = F.fmtValPlain(r);
        doCheck(r);
      } else UI.toast('Aquesta equació no té cap arrel real per provar!', 'warn');
    });

    /* ---- reptes ---- */
    function renderChallenges() {
      const q = solution();
      const CH = [
        {
          id: 'dbl', title: 'Aconsegueix una arrel doble',
          desc: 'Mou els lliscadors fins que el vèrtex toqui l\'eix X.',
          done: !!st.challenged.dbl
        },
        {
          id: 'non', title: 'Fes que no toqui l\'eix',
          desc: 'Troba una paràbola sense cap arrel real.',
          done: !!st.challenged.non
        },
        {
          id: 'irr', title: 'Arrels amb radical', load: 'irr',
          desc: 'Mira com s\'escriuen les arrels de <span class="math">x² − 3x + 1 = 0</span>.',
          done: !!st.challenged.irr
        },
        {
          id: 'deg', title: 'Posa a = 0',
          desc: 'Què passa amb la paràbola?',
          done: !!st.challenged.deg
        }
      ];
      CH.forEach(c => { if (c.done) L.App.markDone('m3', c.id); });
      el('l3-chalcount').textContent = CH.filter(c => c.done).length + '/' + CH.length;
      el('l3-chal').innerHTML = CH.map(c =>
        '<div class="challenge-card"><div class="ch-head"><span class="ch-num">' + (c.done ? '✓' : '▸') + '</span>' +
        '<span class="ch-title">' + c.title + '</span></div>' +
        '<div class="ch-desc">' + c.desc + '</div>' +
        '<div class="ch-foot"><span class="ch-state ' + (c.done ? 'done' : 'todo') + '">' + (c.done ? '✓ aconseguit' : 'pendent') + '</span>' +
        (!c.done && c.load && st.presetId !== c.load ? '<button class="btn soft small" data-load="' + c.load + '">Prova-la ▸</button>' : '') +
        '</div></div>').join('');
      el('l3-chal').querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => { loadPreset(b.dataset.load); tabs.select('formula'); }));
      if (!st.challenged.dbl && st.acted && q.kind === 'double') {
        st.challenged.dbl = true;
        UI.toast('Repte aconseguit: arrel doble! El vèrtex toca l\'eix X.', 'ok');
        renderChallenges();
      }
      if (!st.challenged.non && st.acted && q.kind === 'none-real') {
        st.challenged.non = true;
        UI.toast('Repte aconseguit: cap arrel real (Δ < 0).', 'ok');
        renderChallenges();
      }
      if (!st.challenged.irr && st.acted && q.kind === 'two' && !q.rational) {
        st.challenged.irr = true;
        UI.toast('Repte aconseguit: has vist arrels irracionals exactes.', 'ok');
        renderChallenges();
      }
      if (!st.challenged.deg && st.acted && !isQuadratic()) {
        st.challenged.deg = true;
        UI.toast('Repte aconseguit: has vist la reclassificació amb a = 0.', 'ok');
        renderChallenges();
      }
    }

    /* ---- gràfic ---- */
    function renderGraph(full) {
      const g = st.graph;
      g.clearData();
      const p = polyOf(st.a, st.b, st.c);
      g.addCurve(p.toFn(), { color: '#1d5fd6', width: 4.5 });
      const q = solution();
      const feats = [{ x: 0, y: 0 }, { x: 0, y: st.c.toNumber() }];
      if (isQuadratic()) {
        const vxn = q.vertex.x.toNumber();
        feats.push({ x: vxn, y: q.vertex.y.toNumber() });
        // enquadrament simètric respecte de l'eix de la paràbola: el punt simètric del tall amb l'eix Y
        // i les arrels (encara que no estiguin revelades) perquè la corba no quedi tallada
        feats.push({ x: 2 * vxn, y: st.c.toNumber() });
        if (q.kind === 'two') feats.push({ x: q.root1.toNumber() }, { x: q.root2.toNumber() });
        if (st.revealed) {
          // etiquetes a banda i banda de l'eix: arrels cap a fora i vèrtex cap a dins, perquè no se solapin
          const up = st.a.isPos();
          if (q.kind === 'two') {
            for (const r of [q.root1, q.root2]) {
              feats.push({ x: r.toNumber(), y: 0 });
              g.addMark(r.toNumber(), 0, { color: '#ef9f17', label: 'x = ' + F.fmtValExact(r), labelPos: up ? 'above' : 'below' });
            }
          } else if (q.kind === 'double') {
            feats.push({ x: q.root.toNumber(), y: 0 });
            g.addMark(q.root.toNumber(), 0, { color: '#ef9f17', label: 'x = ' + F.fmtValExact(q.root), pulse: true });
          }
          g.addMark(q.vertex.x.toNumber(), q.vertex.y.toNumber(), {
            color: '#7c5cbf', r: 6, labelPos: up ? 'below' : 'above', label: 'V(' + F.fmtValPlain(q.vertex.x) + ', ' + F.fmtValPlain(q.vertex.y) + ')'
          });
        }
      } else if (q.kind === 'linear') {
        feats.push({ x: q.root.toNumber(), y: 0 });
        g.addMark(q.root.toNumber(), 0, { color: '#ef9f17', label: 'x = ' + F.fmtValExact(q.root) });
      }
      let outNote = false;
      if (g.userView) {
        for (const f of feats) if (f.y === 0 && f.x !== 0 && g.isOutside(f.x, f.y)) outNote = true;
      }
      g.onRenderCb = updateOutsideNote;
      function updateOutsideNote() {
        const host2 = el('l3-graf').parentElement;
        if (!host2) return;
        const old = host2.querySelector('.outside-note');
        if (old) old.remove();
        let outside = false;
        if (g.userView) {
          for (const f of feats) if (f.y === 0 && f.x !== 0 && g.isOutside(f.x, f.y)) outside = true;
        }
        if (outside && !g._destroyed) {
          const div = document.createElement('div');
          div.className = 'outside-note';
          div.innerHTML = 'Hi ha arrels fora de la vista: existeixen igualment! <button id="l3-center">Centra-les</button>';
          host2.appendChild(div);
          div.querySelector('#l3-center').addEventListener('click', () => { g.userView = false; refresh(true); });
        }
      }
      updateOutsideNote();
      UI.veil(el('l3-graf').parentElement, !st.revealed && isQuadratic(), 'Primer fes la teva hipòtesi. Després veuràs la paràbola.');
      g.setAriaLabel('Paràbola y = ' + F.fmtPolyPlain(p) +
        (st.revealed && q.kind === 'two' ? '. Talla l\'eix X a x = ' + F.fmtValPlain(q.root1) + ' i x = ' + F.fmtValPlain(q.root2) : ''));
      if (!g.userView || full) g.autoFit(feats); else g.render();
    }

    /* ---- refresc global ---- */
    function refresh(full) {
      el('l3-eq').innerHTML =
        '<span class="eq-side member-l">' + F.fmtPoly(polyOf(st.a, st.b, st.c), 'x') + '</span>' +
        '<span class="eq-sign">=</span><span class="eq-side member-r">0</span>';
      renderPrediction();
      renderStatus();
      renderInsight();
      renderFormula();
      renderChallenges();
      renderGraph(full);
      updateHash();
    }

    /* ---- hash ---- */
    function updateHash() {
      if (st.presetId === 'lliure') {
        L.App.updateHash({ a: st.a.toString(), b: st.b.toString(), c: st.c.toString() });
      } else {
        L.App.updateHash({ p: st.presetId });
      }
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
      const p = polyOf(st.a, st.b, st.c), q = solution();
      if (!isQuadratic()) return ['Amb <b>a = 0</b> no hi ha x²: ja no és una paràbola, és una recta.'];
      let now;
      if (!st.revealed) now = 'Primer fes la teva hipòtesi: quantes vegades creus que tocarà la línia horitzontal?';

      else if (q.kind === 'two') now = 'Aquesta paràbola talla l\'eix X a <b>x = ' + F.fmtValPlain(q.root1) + '</b> i a <b>x = ' + F.fmtValPlain(q.root2) + '</b>: 2 solucions.';
      else if (q.kind === 'double') now = 'Aquesta paràbola només toca l\'eix X a <b>x = ' + F.fmtValPlain(q.root) + '</b>: 1 solució (doble).';
      else now = 'Aquesta paràbola <b>no toca</b> l\'eix X: no té cap solució real.';
      return [
        'La línia <b>blava</b> és la paràbola y = ' + F.fmtPolyPlain(p) + '.',
        st.a.isPos() ? 'Com que <b>a</b> és positiu, la paràbola s\'obre cap amunt (forma de U).' : 'Com que <b>a</b> és negatiu, la paràbola s\'obre cap avall (forma de ∩).',
        'Les solucions són els punts on la paràbola <b>toca la línia horitzontal</b> (l\'eix X).',
        'Si la toca en 2 punts, hi ha 2 solucions. Si la toca en 1 punt, 1 solució. Si no la toca, cap.',
        now
      ];
    });

    return function cleanup() { try { st.graph.destroy(); } catch (e) { } };
  }

  function help() {
    UI.openModal({
      title: 'Segon grau · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>La idea gran.</b> Una equació <span class="math">ax² + bx + c = 0</span> (amb <span class="math">a ≠ 0</span>) té, com a màxim, dues arrels reals. El <b>discriminant</b> les anuncia abans de calcular-les:</p>' +
      '<div class="math-block"><span class="mb-note">el discriminant</span>' +
      'Δ = b² − 4ac<br>' +
      'Δ &gt; 0 → dues arrels reals diferents<br>' +
      'Δ = 0 → una arrel doble<br>' +
      'Δ &lt; 0 → cap arrel real</div>' +
      '<div class="math-block"><span class="mb-note">exemple complet: x² − 5x + 6 = 0</span>' +
      'Δ = (−5)² − 4·1·6 = 25 − 24 = 1 &gt; 0<br>' +
      'x = ' + F.fracHTML('5 ' + F.PM + ' √1', '2') + ' = ' + F.fracHTML('5 ± 1', '2') + '<br>' +
      'x₁ = 2, x₂ = 3 &nbsp;(i de fet x² − 5x + 6 = (x − 2)(x − 3))</div>' +
      '<p><b>Al gràfic:</b> l\'equació <span class="math">f(x) = 0</span> i la paràbola <span class="math">y = f(x)</span> diuen el mateix: les arrels són els talls amb l\'eix X, i el vèrtex indica el mínim o màxim.</p>' +
      '<p class="help-note"><b>Incompletes?</b> Si <span class="math">b = 0</span>, aïlla <span class="math">x²</span> i extreu l\'arrel. Si <span class="math">c = 0</span>, treu <span class="math">x</span> de factor comú. Més ràpid que la fórmula general!</p>' +
      '<p class="help-note"><b>Detall de rigor:</b> amb <span class="math">Δ &lt; 0</span> diem «cap arrel <b>real</b>», no «cap solució» sense qualificar el domini.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'm3', kind: 'lab', num: 'M3', short: 'Segon grau', goals: 4,
    title: 'Equacions de segon grau', sub: 'Mòdul 3 · discriminant i paràbola',
    desc: 'Mira la paràbola: quantes vegades talla l\'eix?',
    foot: 'Àlgebra i gràfic, plegats',
    iconHTML: '3',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
