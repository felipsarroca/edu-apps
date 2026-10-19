/* ============================================================
   lab1.js — MÒDUL 1 · Equacions de primer grau i equivalència
   Laboratori central: opera als DOS membres (+, −, ×, ÷),
   història de passos reversible, gràfic amb rectes fantasma,
   comprovador per substitució, identitats i contradiccions,
   cas avançat x² = x amb divisió per x (pèrdua de solucions).
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const R = L.R, Poly = L.Poly, F = L.fmt, UI = L.UI;

  // els exemples surten del banc comú (js/banc.js)
  const PRESETS = L.BANC.m1.items.map(p => Object.assign({}, p,
    p.Ldisp ? { Ldisp: { k: R.cast(p.Ldisp.k), m: R.cast(p.Ldisp.m) } } : {}));
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  // equació nova del tipus a·x + b = c·x + d amb solució entera (per resoldre-la sense ajuda)
  function randomLinear() {
    for (;;) {
      const x0 = rnd(-6, 6), a = rnd(-5, 7), c = rnd(-3, 4), b = rnd(-9, 9);
      if (!a || a === c || !b) continue;
      const d = (a - c) * x0 + b;
      if (Math.abs(d) > 20) continue;
      return { a, b, c, d, x0 };
    }
  }

  function polyFromArr(a) { return new Poly(a.map(x => R.cast(x))); }

  function opLabel(kind, operand) {
    const names = { add: 'suma', sub: 'resta', mul: 'multiplica', div: 'divideix' };
    return names[kind] + ' ' + operandHTMLPlain(operand) + ' als dos membres';
  }
  function operandHTML(operand) {
    const needParens = operand.deg >= 1 || operand.coef(operand.deg).isNeg();
    const body = F.fmtPoly(operand, 'x');
    return needParens ? '(' + body + ')' : body;
  }
  function operandHTMLPlain(operand) {
    const s = F.fmtPolyPlain(operand);
    return operand.deg >= 1 || operand.coef(operand.deg).isNeg() ? '(' + s + ')' : s;
  }

  function whyFor(kind, operand) {
    if (kind === 'expand') return 'Distributiva: canvia la forma, no el valor.';
    const hasX = operand && operand.deg >= 1;
    if (kind === 'add' || kind === 'sub') return 'Fer el mateix als dos costats no canvia la solució.';
    if (hasX) return '⚠ Amb una expressió que té <i>x</i>, la solució pot canviar.';
    return 'Multiplicar o dividir per un nombre (que no sigui 0) no canvia la solució.';
  }

  function insightFor(kind, operand, st) {
    const hasX = operand && operand.deg >= 1;
    if (kind === 'expand') return 'Has desenvolupat el parèntesi: els dos costats són <b>iguals</b>.';
    if (kind === 'add' || kind === 'sub') {
      const k = operand.isConst() ? operand.coef(0) : null;
      if (k && k.isZero()) return 'Has sumat 0: no canvia res.';
      if (k) return 'Les rectes ' + (kind === 'add' ? 'pugen' : 'baixen') + ' igual. El punt de tall puja o baixa, però la seva <b>x no canvia</b>.';
      return 'Les rectes giren, però es tallen a la <b>mateixa x</b>.';
    }
    if (kind === 'mul') {
      if (hasX) return '⚠ Has multiplicat per una expressió amb <i>x</i>: han canviat les solucions?';
      return 'Les rectes s\'estiren. El punt de tall es mou amunt o avall, però la seva <b>x no canvia</b>.';
    }
    if (kind === 'div') {
      if (hasX) return '⚠ Has dividit per una expressió amb <i>x</i>: s\'ha perdut alguna solució?';
      return 'Les rectes s\'aplanen. El punt de tall es mou amunt o avall, però la seva <b>x no canvia</b>.';
    }
    return '';
  }

  function render(main, params) {
    const st = {
      hist: [], cursor: 0, opKind: 'add', view: 'dues',
      graph: null, challenges: { c1: false, c2: false, c3: false, c4: false, c5: false, c6: false },
      target: [-3, -2, 2, 3, 5, 6][Math.floor(Math.random() * 6)], // solució que l'alumne ha d'aconseguir amb la seva equació
      own: randomLinear(), justified: false
    };

    main.innerHTML =
      '<div class="lab cols wide-left">' +
      '<div class="lab-viewtabs" role="tablist" aria-label="Vistes del laboratori">' +
      '<button data-viewtab="ctrl" type="button">' + UI.icon('arrows') + 'Equació i operacions</button>' +
      '<button data-viewtab="viz" type="button">' + UI.icon('chart') + 'Gràfic</button></div>' +
      '<div class="lab-left" id="l1-left">' +
      '<div id="l1-predhost"></div>' +
      '<div class="card"><div class="card-title">' + UI.icon('flask') + 'Equació</div>' +
      '<div id="l1-presets"></div>' +
      '<div id="l1-editor" hidden style="margin-top:10px">' +
      '<div class="op-quick" id="l1-edrow" style="align-items:center"></div>' +
      '<div class="op-msg" id="l1-edmsg"></div></div>' +
      '<div class="eq-display removable" id="l1-eq" style="margin-top:12px"></div>' +
      '<div class="eq-hintline">Toca un terme per treure\'l dels dos costats.</div>' +
      '<div class="op-panel" style="margin-top:10px">' +
      '<div class="op-btns" role="group" aria-label="Operació">' +
      '<button class="op-btn" data-op="add" aria-label="Suma">+</button>' +
      '<button class="op-btn" data-op="sub" aria-label="Resta">−</button>' +
      '<button class="op-btn" data-op="mul" aria-label="Multiplica">×</button>' +
      '<button class="op-btn" data-op="div" aria-label="Divideix">÷</button>' +
      '</div>' +
      '<input class="input op-operand math" id="l1-operand" placeholder="4, x, 3x, 1/2…" aria-label="Operand de l\'operació">' +
      '<button class="btn primary" id="l1-apply">Aplica</button>' +
      '</div>' +

      '<div class="op-msg" id="l1-opmsg" role="alert"></div>' +
      '<div class="step-ctl" style="margin-top:10px">' +
      '<button class="btn ghost small" id="l1-undo">' + UI.icon('undo') + 'Desfés</button>' +
      '<button class="btn ghost small" id="l1-redo">' + UI.icon('redo') + 'Refés</button>' +
      '<button class="btn ghost small" id="l1-reset">' + UI.icon('refresh') + 'Reinicia</button>' +
      '</div></div>' +
      '<div class="vtabs">' +
      '<div class="vtabs-bar" role="tablist" aria-label="Seccions">' +
      '<button data-tab="passos" role="tab">Passos</button>' +
      '<button data-tab="comprova" role="tab">Comprova</button>' +
      '<button data-tab="reptes" role="tab">Reptes <span class="tab-count" id="l1-chalcount"></span></button></div>' +
      '<div class="vtabs-panel" data-panel="passos"><div class="step-list" id="l1-steps"></div></div>' +
      '<div class="vtabs-panel" data-panel="comprova" id="l1-checkpanel"></div>' +
      '<div class="vtabs-panel" data-panel="reptes" id="l1-chalpanel"></div>' +
      '</div></div>' +
      '<div class="lab-right">' +
      '<div class="viz-card">' +
      '<div class="viz-head">' +
      '<span class="viz-title">' + UI.icon('chart') + 'Rectes dels dos membres</span>' +
      '<div class="legend">' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#1d5fd6"></span>y = membre esquerre</span>' +
      '<span class="lg-chip"><span class="lg-swatch" style="border-color:#0d9463"></span>y = membre dret</span>' +
      '<span class="lg-chip ghost" id="l1-ghostchip"><span class="lg-swatch" style="border-color:#8a97a8"></span>abans de l\'últim pas</span>' +
      '</div></div>' +
      '<div class="viz-body"><div class="graph-host" id="l1-graf"></div></div></div>' +
      '<div class="statusbar" id="l1-status"></div>' +
      '<div id="l1-insight"></div>' +
      '</div></div>';

    UI.bindLabViewTabs(main.querySelector('.lab'), 'ctrl', () => el('l1-eq').innerHTML);
    const tabs = UI.tabsInit(main.querySelector('.vtabs'));
    const el = (id) => main.querySelector('#' + id);
    st.graph = new L.Graph(el('l1-graf'));
    const guide = UI.guide(el('l1-insight'));

    /* ================= estat i història ================= */
    function cur() { return st.hist[st.cursor]; }
    function loadPreset(id, coeffs) {
      let p = PRESETS.find(pp => pp.id === id);
      let Lp, Rp, Ldisp = null;
      if (id === 'lliure' && coeffs) {
        Lp = polyFromArr([coeffs.b, coeffs.a]); Rp = polyFromArr([coeffs.d, coeffs.c]);
      } else {
        if (!p) p = PRESETS[0];
        Lp = polyFromArr(p.L); Rp = polyFromArr(p.R);
        Ldisp = p.Ldisp ? { ...p.Ldisp } : null;
      }
      st.hist = [{ L: Lp, R: Rp, Ldisp: Ldisp, Rdisp: null, op: null, presetId: id }];
      st.cursor = 0;
      st.found = false; // la solució queda amagada fins que l'alumne aïlla la x (o la demana)
      st.justified = false; // es demana una justificació del primer pas de cada equació
      st.advanced = !!(p && p.advanced) || Lp.deg >= 2 || Rp.deg >= 2;
      renderPresets(id);
      refresh(true);
    }

    /* ================= operacions ================= */
    async function applyOp(kind, operand) {
      const c = cur();
      const isConst = operand.isConst();
      // --- validacions rigoroses ---
      if ((kind === 'mul' || kind === 'div') && isConst && operand.coef(0).isZero()) {
        if (kind === 'mul') return blockedMulZero(c);
        showOpMsg('No es pot dividir per zero: la divisió per zero no està definida.');
        return;
      }
      if ((kind === 'mul' || kind === 'div') && !isConst) {
        if (kind === 'div') {
          // divisió exacta per monomi k·x^deg?
          const deg = operand.deg, k = operand.coef(deg);
          const qL = c.L.divByMono(k, deg), qR = c.R.divByMono(k, deg);
          if (!qL || !qR) {
            showOpMsg('Dividir ' + F.fmtPolyPlain(c.L) + ' entre ' + operandHTMLPlain(operand) + ' no dóna un polinomi: aquí no ho podem fer.');
            return;
          }
        } else {
          if (Math.max(c.L.deg, c.R.deg) + operand.deg > 2) {
            showOpMsg('Això ens portaria a un grau superior a 2: massa per a aquest laboratori!');
            return;
          }
        }
        const ok = await UI.confirmModal({
          title: '⚠ Atenció: operació no reversible',
          icon: UI.icon('alert'),
          bodyHTML: '<p>Vols ' + (kind === 'div' ? 'dividir' : 'multiplicar') + ' els dos membres per <b class="math">' + operandHTMLPlain(operand) +
            '</b>, una expressió que conté <b><i>x</i></b>.</p>' +
            '<p>El problema: quan <span class="math">' + operandHTMLPlain(operand) + ' = 0</span>, aquesta operació no és legítima, i les solucions poden <b>desaparèixer</b> (en dividir) o <b>aparèixer</b> (en multiplicar).</p>' +
            '<p>És exactament el que volem <b>observar</b> aquí. Vols continuar?</p>',
          okLabel: 'Sí, continua (experiment)', cancelLabel: 'Millor no', danger: true
        });
        if (!ok) return;
      }
      // --- càlcul ---
      let nL, nR;
      try {
        if (kind === 'add') { nL = c.L.add(operand); nR = c.R.add(operand); }
        else if (kind === 'sub') { nL = c.L.sub(operand); nR = c.R.sub(operand); }
        else if (kind === 'mul') { nL = c.L.mul(operand); nR = c.R.mul(operand); }
        else {
          if (isConst) { const k = operand.coef(0); nL = c.L.scale(R.ONE.div(k)); nR = c.R.scale(R.ONE.div(k)); }
          else {
            const deg = operand.deg, k = operand.coef(deg);
            nL = c.L.divByMono(k, deg); nR = c.R.divByMono(k, deg);
            if (!nL || !nR) { showOpMsg('Aquesta divisió no és exacta.'); return; }
          }
        }
      } catch (e) { showOpMsg(e.message); return; }
      pushStep({ L: nL, R: nR, Ldisp: null, Rdisp: null, op: { kind, operand, label: opLabel(kind, operand) } });
      if (isConst || kind === 'add' || kind === 'sub') askJustify(kind, operand);
    }

    /* completa la justificació del primer pas: «He restat 4 als dos membres perquè…» */
    function askJustify(kind, operand) {
      const host = el('l1-predhost');
      if (st.justified || host.children.length) return;
      st.justified = true;
      const verb = { add: 'sumat', sub: 'restat', mul: 'multiplicat per', div: 'dividit per' }[kind];
      const what = operandHTMLPlain(operand);
      const addLike = kind === 'add' || kind === 'sub';
      const card = UI.renderPrediction({
        question: 'Completa la frase: «He ' + verb + ' <span class="math">' + what + '</span> ' + (addLike ? 'als' : 'els') + ' dos membres perquè…»',
        shuffle: true,
        options: addLike ? [
          { label: '…la igualtat es manté i la solució no canvia', correct: true, why: 'Fer el mateix als dos membres és una transformació equivalent.' },
          { label: '…així la x canvia de valor', correct: false, why: 'La x no canvia: l\'equació nova té la mateixa solució.' },
          { label: '…sempre s\'ha de començar restant', correct: false, why: 'No hi ha cap ordre obligatori: el que compta és fer el mateix als dos membres.' }
        ] : [
          { label: '…la igualtat es manté i la solució no canvia', correct: true, why: 'Multiplicar o dividir els dos membres per un nombre diferent de zero és equivalent.' },
          { label: '…així la solució es fa més petita', correct: false, why: 'La solució és la mateixa: només canvia la forma de l\'equació.' },
          { label: '…n\'hi ha prou de fer-ho al primer membre', correct: false, why: 'Si només ho fas a un membre, la igualtat deixa de ser certa.' }
        ],
        continueLabel: 'Continua',
        onDone: (ok, i) => {
          if (ok) L.App.saveReflection('m1', 'He ' + verb + ' ' + what + ' als dos membres perquè la igualtat es manté i la solució no canvia.', 'justificació');
          refresh();
        }
      });
      host.appendChild(card);
    }

    function blockedMulZero(c) {
      UI.openModal({
        title: 'Multiplicar per zero: compte!', icon: UI.icon('alert'),
        bodyHTML:
        '<p>Multiplicar els dos membres per <b>0</b> <b>no és una transformació equivalent</b>. Mira el contraexemple amb la teva equació:</p>' +
        '<div class="math-block">' + F.fmtPoly(c.L, 'x') + ' = ' + F.fmtPoly(c.R, 'x') + '<br>' +
        '<span class="hl">× 0 als dos membres</span><br>0 = 0</div>' +
        '<p>Ara <b>qualsevol</b> valor de <i>x</i> compleix «0 = 0»: les solucions originals s\'han <b>destruït</b> i n\'han aparegut infinites de noves. La informació de l\'equació s\'ha perdut per sempre.</p>' +
        '<p class="help-note">Per això el laboratori <b>impedeix</b> multiplicar per zero (i també dividir-hi: és impossible).</p>',
        footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
    }

    function pushStep(entry) {
      st.hist = st.hist.slice(0, st.cursor + 1);
      st.hist.push(entry);
      st.cursor = st.hist.length - 1;
      refresh();
    }

    function expandL() {
      const c = cur();
      if (!c.Ldisp) return;
      pushStep({
        L: c.L.clone(), R: c.R.clone(), Ldisp: null, Rdisp: c.Rdisp,
        op: { kind: 'expand', operand: null, label: 'desenvolupa ' + F.fmtValPlain(c.Ldisp.k) + '(x + ' + F.fmtValPlain(c.Ldisp.m) + ')' }
      });
    }

    /* ================= UI: presets i editor ================= */
    const plainOf = (p) => (p.Ldisp ? F.fmtValPlain(p.Ldisp.k) + '(x + ' + F.fmtValPlain(p.Ldisp.m) + ')' : F.fmtPolyPlain(polyFromArr(p.L))) + ' = ' + F.fmtPolyPlain(polyFromArr(p.R));
    const picker = UI.levelPicker(el('l1-presets'), {
      groups: L.BANC.m1.groups,
      items:
 PRESETS.map(p => ({ id: p.id, level: p.level, title: plainOf(p) })),
      onPick: (id) => { el('l1-editor').hidden = true; loadPreset(id); updateHash(); },
      extra: [{ id: 'lliure', html: '✎ La meva', title: 'Escriu la teva equació', onClick: () => { const ed = el('l1-editor'); ed.hidden = !ed.hidden; } }]
    });
    function renderPresets(activeId) { picker.setActive(activeId); }
    // editor de coeficients
    const edRow = el('l1-edrow');
    const edDefs = [['a', '3'], ['b', '4'], ['c', '1'], ['d', '12']];
    const edInputs = {};
    for (const [name, def] of edDefs) {
      const lab = document.createElement('span');
      lab.className = 'coef-name';
      lab.innerHTML = '<i>' + name + '</i>';
      lab.style.width = '22px';
      const inp = document.createElement('input');
      inp.className = 'coef-val';
      inp.style.width = '58px';
      inp.value = def;
      inp.setAttribute('aria-label', 'Coeficient ' + name);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') el('l1-create').click(); });
      edInputs[name] = inp;
      edRow.appendChild(lab); edRow.appendChild(inp);
    }
    const eqLab = document.createElement('span');
    eqLab.className = 'math';
    eqLab.innerHTML = '<i>ax</i> + <i>b</i> = <i>cx</i> + <i>d</i>';
    eqLab.style.cssText = 'margin-left:6px;color:var(--ink-faint);font-size:.9rem;flex:1;text-align:center';
    edRow.appendChild(eqLab);
    const createBtn = document.createElement('button');
    createBtn.className = 'btn navy small';
    createBtn.id = 'l1-create';
    createBtn.textContent = 'Crea';
    createBtn.addEventListener('click', () => {
      try {
        const a = R.parse(edInputs.a.value), b = R.parse(edInputs.b.value), c = R.parse(edInputs.c.value), d = R.parse(edInputs.d.value);
        st.fromOwn = false;
        loadPreset('lliure', { a, b, c, d });
        updateHash();
        showEdMsg('');
      } catch (e) { showEdMsg('Revisa els valors: ' + e.message); }
    });
    edRow.appendChild(createBtn);
    function showEdMsg(m) { el('l1-edmsg').textContent = m; }

    /* ================= UI: panell d'operacions ================= */
    const opBtns = [...main.querySelectorAll('.op-btn')];
    opBtns.forEach(b => b.addEventListener('click', () => {
      st.opKind = b.dataset.op;
      opBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    opBtns[0].setAttribute('aria-pressed', 'true');
    const operandInput = el('l1-operand');
    function tryApply() {
      const raw = operandInput.value.trim();
      if (!raw) { showOpMsg('Escriu l\'operand: per exemple 4, x, 3x o 1/2.'); return; }
      let operand;
      try { operand = L.parseLinear(raw); }
      catch (e) { showOpMsg(e.message); return; }
      showOpMsg('');
      applyOp(st.opKind, operand);
      operandInput.value = '';
      operandInput.focus();
    }
    el('l1-apply').addEventListener('click', tryApply);
    operandInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryApply(); });
    function showOpMsg(m) { const e = el('l1-opmsg'); e.textContent = m; }

    /* ================= UI: terms clicables ================= */
    function bindTermClicks() {
      const eqEl = el('l1-eq');
      eqEl.querySelectorAll('.term').forEach(t => {
        t.addEventListener('click', () => {
          if (t.dataset.factored) { expandL(); return; }
          const deg = +t.dataset.deg, coefS = t.dataset.coef;
          let term;
          try { term = Poly.fromTerms([{ deg, coef: R.parse(coefS) }]); }
          catch (e) { showOpMsg(e.message); return; }
          // el terme «vola» abans d'aplicar l'operació als dos costats
          t.classList.add('leaving');
          setTimeout(() => applyOp('sub', term), 240);
        });
      });
    }

    /* ================= historial de passos ================= */
    function renderSteps() {
      const host = el('l1-steps');
      host.innerHTML = '';
      for (let i = st.hist.length - 1; i >= 0; i--) {
        const h = st.hist[i];
        const item = document.createElement('button');
        item.className = 'step-item' + (i === st.cursor ? ' current' : '');
        item.type = 'button';
        let body = '';
        if (i === 0) {
          body = '<div class="si-curr math">' + sideDispHTML(h, 'L') + ' = ' + sideDispHTML(h, 'R') + '</div>' +
            (h.Ldisp ? '<div class="si-why">Toca el parèntesi per desenvolupar-lo.</div>' : '');
        } else {
          const prev = st.hist[i - 1];
          const op = h.op;
          let mid = '';
          if (op.kind === 'expand') {
            mid = '<div class="si-mid math">desenvolupa la distributiva</div>';
          } else if (op.kind === 'add' || op.kind === 'sub') {
            const sym = op.kind === 'add' ? '+' : '−';
            mid = '<div class="si-mid math">' + sideDispHTML(prev, 'L') + ' ' + sym + ' ' + operandHTML(op.operand) +
              ' = ' + sideDispHTML(prev, 'R') + ' ' + sym + ' ' + operandHTML(op.operand) + '</div><div class="si-note">redueix els termes semblants ↓</div>';
          } else if (op.kind === 'mul') {
            mid = '<div class="si-mid math">(' + sideDispHTML(prev, 'L') + ')·' + operandHTML(op.operand) +
              ' = (' + sideDispHTML(prev, 'R') + ')·' + operandHTML(op.operand) + '</div><div class="si-note">multiplica i redueix ↓</div>';
          } else {
            mid = '<div class="si-mid math">(' + sideDispHTML(prev, 'L') + ') ÷ ' + operandHTML(op.operand) +
              ' = (' + sideDispHTML(prev, 'R') + ') ÷ ' + operandHTML(op.operand) + '</div><div class="si-note">divideix cada terme ↓</div>';
          }
          body = mid +
            '<div class="si-curr math">' + F.fmtPoly(h.L, 'x') + ' = ' + F.fmtPoly(h.R, 'x') + '</div>' +
            '<div class="si-why"><b>Per què?</b> ' + whyFor(op.kind, op.operand) + '</div>';
        }
        item.innerHTML =
          '<span class="si-head"><span class="si-op">' + (i === 0 ? 'estat inicial' : 'pas ' + i + ' · ' + h.op.label) + '</span></span>' +
          body;
        item.addEventListener('click', () => { st.cursor = i; refresh(); });
        host.appendChild(item);
      }
      el('l1-undo').disabled = st.cursor === 0;
      el('l1-redo').disabled = st.cursor >= st.hist.length - 1;
    }
    function sideDispHTML(h, side) {
      const disp = side === 'L' ? h.Ldisp : h.Rdisp;
      if (disp) return F.fmtValPlain(disp.k) + '(x + ' + F.fmtValPlain(disp.m) + ')';
      return F.fmtPoly(side === 'L' ? h.L : h.R, 'x');
    }

    el('l1-undo').addEventListener('click', () => { if (st.cursor > 0) { st.cursor--; refresh(); } });
    el('l1-redo').addEventListener('click', () => { if (st.cursor < st.hist.length - 1) { st.cursor++; refresh(); } });
    el('l1-reset').addEventListener('click', () => { st.cursor = 0; refresh(); });

    /* ================= comprovador ================= */
    const cp = el('l1-checkpanel');
    cp.innerHTML =
      '<div class="checker">' +
      '<div class="ck-inputrow">' +
      '<label for="l1-ckx" class="help-note">Prova un valor de x:</label>' +
      '<input class="input math" id="l1-ckx" placeholder="p. ex. 4">' +
      '<button class="btn primary small" id="l1-ckgo">Comprova</button>' +
      '<button class="btn ghost small" id="l1-cksol">Prova la solució</button>' +
      '</div><div class="ck-result" id="l1-ckres"></div></div>';
    function doCheck(x) {
      const c = cur(), orig = st.hist[0];
      const lv = c.L.eval(x), rv = c.R.eval(x);
      const eq = lv.eq(rv);
      const olv = orig.L.eval(x), orv = orig.R.eval(x);
      const oeq = olv.eq(orv);
      el('l1-ckres').innerHTML =
        '<div class="check-line"><span class="cl-label">equació actual</span>' +
        F.fmtSubstitution(c.L, x) + ' = ' + F.fmtVal(lv) +
        ' <span class="math">· · ·</span> ' + F.fmtSubstitution(c.R, x) + ' = ' + F.fmtVal(rv) + '</div>' +
        '<div class="check-line"><span class="cl-label">original</span>' +
        F.fmtSubstitution(orig.L, x) + ' = ' + F.fmtVal(olv) +
        ' <span class="math">· · ·</span> ' + F.fmtSubstitution(orig.R, x) + ' = ' + F.fmtVal(orv) + '</div>' +
        '<div>' + (eq
          ? '<span class="verdict yes">' + UI.icon('check') + 'x = ' + F.fmtVal(x) + ' és solució (i de l\'original també: ' + (oeq ? 'sí' : 'no!') + ')</span>'
          : '<span class="verdict no">' + UI.icon('x') + 'x = ' + F.fmtVal(x) + ' no és solució (' + F.fmtVal(lv) + ' ≠ ' + F.fmtVal(rv) + ')</span>') + '</div>';
    }
    el('l1-ckgo').addEventListener('click', () => {
      try { doCheck(L.parseValue(el('l1-ckx').value)); }
      catch (e) { el('l1-ckres').innerHTML = '<span class="field-msg">' + e.message + '</span>'; }
    });
    el('l1-ckx').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('l1-ckgo').click(); });
    el('l1-cksol').addEventListener('click', () => {
      const sol = L.solvePolyPair(cur().L, cur().R);
      if (sol.kind !== 'unique' || !sol.roots.length) { UI.toast('Aquesta equació no té una solució única per provar.', 'warn'); return; }
      el('l1-ckx').value = F.fmtValPlain(sol.roots[0]);
      doCheck(sol.roots[0]);
    });

    /* ================= reptes ================= */
    function renderChallenges() {
      const host = el('l1-chalpanel');
      const nSteps = st.cursor;
      const CH = [
        {
          id: 'c1', title: 'Resol 3x + 4 = x + 12', done: st.challenges.c1, load: 'bas',
          desc: 'Arriba a <span class="math">x = 4</span> amb pocs passos.',
          state: st.challenges.c1 ? '✓ aconseguit' : (cur().presetId === 'bas' ? nSteps + (nSteps === 1 ? ' pas' : ' passos') : 'pendent')
        },
        {
          id: 'c2', title: 'Converteix 2(x+1) = 2x+2 en 0 = 0', done: st.challenges.c2, load: 'ide',
          desc: 'Desenvolupa el parèntesi i opera fins a <span class="math">0 = 0</span>.',
          state: st.challenges.c2 ? '✓ aconseguit' : 'pendent'
        },
        {
          id: 'c3', title: 'Provoca un 0 = 2', done: st.challenges.c3, load: 'con',
          desc: 'Parteix de <span class="math">2x + 1 = 2x + 3</span> i opera fins que surti una igualtat impossible.',
          state: st.challenges.c3 ? '✓ aconseguit' : 'pendent'
        },
        {
          id: 'c4', title: 'Avançat: x² = x', done: st.challenges.c4, load: 'qua',
          desc: '<b>Divideix per x</b>. Quina solució es perd?',
          state: st.challenges.c4 ? '✓ descobert' : 'pendent'
        },
        {
          id: 'c5', title: 'Inventa una equació amb solució x = ' + F.fmtValPlain(R.num(st.target)), done: st.challenges.c5, edit: true,
          desc: 'Amb <b>✎ La meva</b>, escriu una equació <span class="math">ax + b = cx + d</span> que tingui aquesta solució. Ha de tenir x als dos costats.',
          state: st.challenges.c5 ? '✓ aconseguit' : 'pendent'
        },
        {
          id: 'c6', title: 'Ara tu sol', done: st.challenges.c6, solo: true,
          desc: 'Resol <span class="math">' + ownPlain() + '</span> sense el laboratori i escriu la solució.',
          state: st.challenges.c6 ? '✓ aconseguit' : 'pendent'
        }
      ];
      CH.forEach(c => { if (c.done) L.App.markDone('m1', c.id); });
      el('l1-chalcount').textContent = CH.filter(c => c.done).length + '/' + CH.length;
      host.innerHTML = CH.map(c =>
        '<div class="challenge-card"><div class="ch-head"><span class="ch-num">' + (c.done ? '✓' : '▸') + '</span>' +
        '<span class="ch-title">' + c.title + '</span></div>' +
        '<div class="ch-desc">' + c.desc + '</div>' +
        (c.solo && !c.done ? '<div class="ck-inputrow"><span class="math" style="font-weight:700">x =</span>' +
          '<input class="input math" id="l1-solo" style="width:110px" placeholder="p. ex. −3" aria-label="La teva solució">' +
          '<button class="btn primary small" id="l1-sologo">Comprova</button></div><div class="pr-msg" id="l1-solomsg"></div>' : '') +
        '<div class="ch-foot"><span class="ch-state ' + (c.done ? 'done' : 'todo') + '">' + c.state + '</span>' +
        (!c.done && c.load && cur().presetId !== c.load ? '<button class="btn soft small" data-load="' + c.load + '">Prova-la ▸</button>' : '') +
        (!c.done && c.edit ? '<button class="btn soft small" id="l1-openedit">✎ Obre l\'editor</button>' : '') +
        '</div></div>').join('');
      host.querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => {
        loadPreset(b.dataset.load); updateHash(); tabs.select('passos');
      }));
      const oe = host.querySelector('#l1-openedit');
      if (oe) oe.addEventListener('click', () => { el('l1-editor').hidden = false; edInputs.a.focus(); edInputs.a.select(); });
      const sg = host.querySelector('#l1-sologo');
      if (sg) {
        const go = () => {
          let v;
          try { v = L.parseValue(host.querySelector('#l1-solo').value); }
          catch (e) { host.querySelector('#l1-solomsg').textContent = e.message; return; }
          const msg = host.querySelector('#l1-solomsg');
          let ok = false;
          try { ok = R.cast(v).eq(R.num(st.own.x0)); } catch (e) { }
          if (ok) {
            st.challenges.c6 = true; renderChallenges();
            UI.toast('Molt bé! L\'has resolta tu sol.', 'ok');
          } else {
            msg.className = 'pr-msg bad';
            msg.innerHTML = 'Encara no. Comprova-ho substituint, o <button class="btn ghost small" id="l1-soloload">resol-la al laboratori</button> i després prova\'n una altra.';
            msg.querySelector('#l1-soloload').addEventListener('click', () => {
              const o = st.own; st.own = randomLinear();
              loadPreset('lliure', { a: R.num(o.a), b: R.num(o.b), c: R.num(o.c), d: R.num(o.d) }); st.fromOwn = true; updateHash(); tabs.select('passos');
            });
          }
        };
        sg.addEventListener('click', go);
        host.querySelector('#l1-solo').addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
      }
    }
    function ownPlain() {
      const o = st.own;
      return F.fmtPolyPlain(Poly.linear(o.a, o.b)) + ' = ' + F.fmtPolyPlain(Poly.linear(o.c, o.d));
    }
    function checkChallenges() {
      const c = cur();
      const sol = L.solvePolyPair(c.L, c.R);
      // equació inventada: x als dos costats i la solució demanada
      const o = st.hist[0];
      if (!st.challenges.c5 && !st.fromOwn && st.cursor === 0 && o.presetId === 'lliure' && o.L.deg === 1 && o.R.deg === 1 && !o.L.coef(1).eq(o.R.coef(1)) &&
        sol.kind === 'unique' && sol.roots.length === 1 && sol.roots[0].eq(R.num(st.target))) {
        st.challenges.c5 = true; UI.toast('Repte aconseguit: has inventat una equació amb solució x = ' + st.target + '.', 'ok');
      }
      const isIsolated = (p, q) => (p.deg === 1 && p.coef(1).eq(R.ONE) && p.coef(0).isZero() && q.isConst()) ||
        (q.deg === 1 && q.coef(1).eq(R.ONE) && q.coef(0).isZero() && p.isConst());
      if (c.presetId === 'bas' && sol.kind === 'unique' && sol.roots[0] && sol.roots[0].eq(R.num(4)) && isIsolated(c.L, c.R)) {
        if (!st.challenges.c1) { st.challenges.c1 = true; UI.toast('Repte 1 aconseguit! Has aïllat la x en ' + st.cursor + ' passos.', 'ok'); }
      }
      if (c.L.isZero() && c.R.isZero() && st.cursor > 0 && !st.challenges.c2) {
        st.challenges.c2 = true; UI.toast('Repte 2 aconseguit! 0 = 0: identitat evident.', 'ok');
      }
      if ((c.L.isZero() && c.R.isConst() && !c.R.isZero() || c.R.isZero() && c.L.isConst() && !c.L.isZero()) && !st.challenges.c3) {
        st.challenges.c3 = true; UI.toast('Repte 3 aconseguit! Una contradicció evident: cap solució.', 'ok');
      }
      if (c.presetId === 'qua' && st.cursor > 0) {
        const orig = st.hist[0];
        const os = L.solvePolyPair(orig.L, orig.R), cs = L.solvePolyPair(c.L, c.R);
        if (os.kind === 'unique' && cs.kind === 'unique' && os.roots.length > cs.roots.length && !st.challenges.c4) {
          st.challenges.c4 = true;
          UI.openModal({
            title: 'Has descobert el secret de la divisió per x!', icon: UI.icon('bulb'),
            bodyHTML: '<p>En dividir <span class="math">x² = x</span> per <span class="math">x</span> has obtingut <span class="math">x = 1</span>... però l\'original també tenia la solució <span class="math">x = 0</span>!</p>' +
              '<p>Quan <span class="math">x = 0</span>, estaves <b>dividint per zero</b> sense adonar-te\'n: per això aquesta solució s\'ha esvaït. Al gràfic, la paràbola fantasma encara ensenyava la intersecció perduda.</p>' +
              '<p class="help-note"><b>La lliçó:</b> dividir per una expressió amb la incògnita exigeix estudiar abans si pot valer zero. La forma segura de resoldre x² = x és passar tot a un membre i factoritzar: x(x − 1) = 0 → x = 0 o x = 1.</p>',
            footHTML: '<button class="btn primary" data-action="ok">Fantàstic</button>',
            actions: [{ id: 'ok', onClick: (m) => m.close() }]
          });
        }
      }
    }

    /* ================= actualització global ================= */
    function refresh(full) {
      const c = cur();
      /* equació amb termes clicables */
      const eqEl = el('l1-eq');
      if (c.Ldisp) {
        eqEl.innerHTML =
          '<span class="eq-side member-l">' +
          '<button type="button" class="term factored" data-side="L" data-factored="1" aria-label="Desenvolupa el parèntesi amb la distributiva">' +
          '<span class="t-core">' + F.fmtVal(c.Ldisp.k) + '(' + F.V('x') + ' + ' + F.fmtVal(c.Ldisp.m) + ')</span></button></span>' +
          '<span class="eq-sign">=</span>' +
          '<span class="eq-side member-r">' + F.fmtPoly(c.R, 'x') + '</span>';
      } else {
        eqEl.innerHTML = F.fmtEquationChips(c.L, c.R, {
          ariaFn: (coef, deg, side) => 'Elimina aquest terme: resta ' + F.fmtValPlain(coef) + (deg >= 1 ? 'x' : '') + ' als dos membres'
        });
      }
      bindTermClicks();

      /* solucions i equivalència */
      const sol = L.solvePolyPair(c.L, c.R);
      const orig = st.hist[0];
      const osol = L.solvePolyPair(orig.L, orig.R);
      const equiv = L.sameSolutionSet(osol, sol);

      // aïllada: «x = k», «k = x» o dos nombres (0 = 0, 0 = 5): l'equació ja diu la solució
      const isX = (p) => p.deg === 1 && p.coef(1).eq(R.ONE) && p.coef(0).isZero();
      if (!st.found && ((isX(c.L) && c.R.isConst()) || (isX(c.R) && c.L.isConst()) || (c.L.isConst() && c.R.isConst()))) {
        st.found = true;

      }

      const sb = el('l1-status');
      let solBadge;
      if (!st.found) {
        solBadge = '<span class="sb-label">Solució</span><span class="sol-chip pending" title="Aïlla la x per descobrir-la">?</span>' +
          '<button class="btn ghost small" id="l1-showsol">Mostra-la</button>';
      } else if (sol.kind === 'unique') {
        solBadge = sol.roots.length === 1
          ? '<span class="badge ok">' + UI.icon('target') + '1 solució: <span class="math">x = ' + F.fmtVal(sol.roots[0]) + '</span></span>'
          : '<span class="badge ok">' + UI.icon('target') + sol.roots.length + ' solucions: <span class="math">x = ' + sol.roots.map(r => F.fmtVal(r)).join(' i ') + '</span></span>';
      } else if (sol.kind === 'all') {
        solBadge = '<span class="badge info">' + UI.icon('info') + 'Tots els reals (identitat)</span>';
      } else if (sol.kind === 'none' || sol.kind === 'none-real') {
        solBadge = '<span class="badge err">' + UI.icon('x') + 'Cap solució (contradicció)</span>';
      } else {
        solBadge = '<span class="badge neutral">Grau superior: fora d\'aquest laboratori</span>';
      }
      let eqBadge;
      if (equiv) {
        eqBadge = '<span class="badge ok">' + UI.icon('check') + '⇔ equivalent a l\'original</span>' +
          '<button class="btn soft small" id="l1-whyq">Per què?</button>';
      } else {
        eqBadge = '<span class="badge err">' + UI.icon('alert') + '⚠ les solucions han canviat!</span>' +
          '<button class="btn danger-soft small" id="l1-whyn">Què ha passat?</button>';
      }
      sb.innerHTML = '<span class="sb-item">' + solBadge + '</span><span class="sb-item">' + eqBadge + '</span>';
      const ss = el('l1-showsol');
      if (ss) ss.addEventListener('click', () => { st.found = true; refresh(); });
      const wq = el('l1-whyq');
      if (wq) wq.addEventListener('click', whyEquivalent);
      const wn = el('l1-whyn');
      if (wn) wn.addEventListener('click', () => whyBroken(osol, sol));

      /* guia: un sol missatge curt */
      const predPending = !!el('l1-predhost').querySelector('.predict-card');
      const step = predPending ? 1 : st.found ? 3 : 2;
      if (predPending) guide.set(1, 'Respon la pregunta de dalt.');
      else if (!equiv) guide.set(2, insightFor(c.op.kind, c.op.operand, st), 'err');
      else if (st.found && st.cursor > 0) guide.set(3, 'Has aïllat la <i>x</i>! Comprova-la a <b>Comprova</b>.', 'ok');
      else if (st.cursor > 0) guide.set(step, insightFor(c.op.kind, c.op.operand, st));
      else guide.set(step, 'Toca un terme per treure\'l dels <b>dos costats</b>.');

      renderSteps();
      checkChallenges();
      renderChallenges();

      /* ---- gràfic ---- */
      const g = st.graph;
      g.clearData();
      const ghost = st.cursor > 0 ? st.hist[st.cursor - 1] : null;
      if (ghost) {
        g.addCurve(ghost.L.toFn(), { color: '#1d5fd6', width: 2, dash: '7 6', opacity: .38 });
        g.addCurve(ghost.R.toFn(), { color: '#0d9463', width: 2, dash: '7 6', opacity: .38 });
      }
      g.addCurve(c.L.toFn(), { color: '#1d5fd6', width: 4.5 });
      g.addCurve(c.R.toFn(), { color: '#0d9463', width: 4.5 });
      g.setReadout({
        items: [
          { label: 'y₁', color: '#1d5fd6', ink: '#14418f', fn: c.L.toFn() },
          { label: 'y₂', color: '#0d9463', ink: '#0a6e4a', fn: c.R.toFn() }
        ], eq: true
      });
      const feats = [{ x: 0, y: 0 }, { x: 0, y: c.L.eval(R.ZERO).toNumber() }, { x: 0, y: c.R.eval(R.ZERO).toNumber() }];
      let outNote = false;
      if (sol.kind === 'unique') {
        for (const r of sol.roots) {
          const y = c.L.eval(r).toNumber();
          feats.push({ x: r.toNumber(), y });
          // el punt de tall es veu sempre (llegir-lo és part de l'activitat); les coordenades, només un cop trobada
          g.addMark(r.toNumber(), y, { color: '#ef9f17', label: st.found ? '(' + F.fmtValPlain(r) + ', ' + F.fmtValPlain(c.L.eval(r)) + ')' : null });
        }
      }
      g.onRenderCb = updateOutsideNote;
      function updateOutsideNote() {
        const host2 = el('l1-graf').parentElement;
        if (!host2) return;
        const old = host2.querySelector('.outside-note');
        if (old) old.remove();
        let outside = false;
        if (g.userView && sol.kind === 'unique') {
          for (const r of sol.roots) if (g.isOutside(r.toNumber(), c.L.eval(r).toNumber())) outside = true;
        }
        if (outside && !g._destroyed) {
          const div = document.createElement('div');
          div.className = 'outside-note';
          div.innerHTML = 'La solució existeix, però és fora de la vista <button id="l1-center">Centra-la</button>';
          host2.appendChild(div);
          div.querySelector('#l1-center').addEventListener('click', () => { g.userView = false; refresh(true); });
        }
      }
      g.setAriaLabel('Gràfic de les rectes y = ' + F.fmtPolyPlain(c.L) + ' i y = ' + F.fmtPolyPlain(c.R) +
        (sol.kind === 'unique' ? ', que es tallen a l\'abscissa x = ' + sol.roots.map(r => F.fmtValPlain(r)).join(' i ') : sol.kind === 'all' ? '. Les rectes coincideixen.' : '. No es tallen.'));
      if (!g.userView || full) g.autoFit(feats); else g.render();
      updateHash();
    }

    function whyEquivalent() {
      UI.openModal({
        title: 'Per què es conserva l\'equivalència?', icon: UI.icon('bulb'),
        bodyHTML:
        '<p>Totes les operacions que has fet (excepte les marcades amb ⚠) són <b>reversibles</b>: existeix una operació inversa que et torna a l\'equació anterior.</p>' +
        '<p>Si <span class="math">x</span> era solució de l\'anterior, després de sumar, restar, multiplicar o dividir (per nombre ≠ 0) el mateix als dos membres, <b>segueix sent-ho</b>: la igualtat es conserva perquè hem fet <b>el mateix</b> a les dues bandes.</p>' +
        '<p>I al revés: l\'operació inversa recupera l\'equació anterior, així que <b>cap solució nova ha aparegut</b>. Conclusió: el conjunt solució queda <b>exactament igual</b>.</p>' +
        '<p class="help-note">Al gràfic: les rectes es mouen o roten, però el punt d\'intersecció no canvia d\'abscissa.</p>',
        footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
    }
    function whyBroken(osol, csol) {
      const lost = (osol.roots || []).filter(r => !(csol.roots || []).some(rr => rr.eq(r)));
      const gained = (csol.roots || []).filter(r => !(osol.roots || []).some(rr => rr.eq(r)));
      UI.openModal({
        title: 'Què ha passat amb les solucions?', icon: UI.icon('alert'),
        bodyHTML:
        '<p>L\'última operació <b>no era reversible</b>: has multiplicat o dividit per una expressió que conté la incògnita, i això trenca l\'equivalència.</p>' +
        (lost.length ? '<p>S\'han <b>perdut</b> les solucions: <span class="math">' + lost.map(r => 'x = ' + F.fmtVal(r)).join(', ') + '</span> — justament els valors que feien <b>zero</b> l\'expressió divisor.</p>' : '') +
        (gained.length ? '<p>Han <b>aparegut</b> solucions noves: <span class="math">' + gained.map(r => 'x = ' + F.fmtVal(r)).join(', ') + '</span> — són els zeros de l\'expressió multiplicadora, que «es colen» perquè multiplicar per 0 dona 0 = 0.</p>' : '') +
        '<p class="help-note">Regla segura: mai divideixis per una expressió amb la incògnita sense estudiar abans si pot valer zero.</p>',
        footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
        actions: [{ id: 'ok', onClick: (m) => m.close() }]
      });
    }


    /* ================= hash ================= */
    function updateHash() {
      const c = cur();
      if (!c) return;
      if (c.presetId === 'lliure') {
        L.App.updateHash({
          p: 'lliure',
          a: c.L.coef(1).toString(), b: c.L.coef(0).toString(),
          c: c.R.coef(1).toString(), d: c.R.coef(0).toString()
        });
      } else {
        L.App.updateHash({ p: c.presetId || 'bas' });
      }
    }

    /* ================= inici ================= */
    let init = { p: 'bas', coeffs: null };
    if (params.p) {
      if (params.p === 'lliure' && params.a !== undefined) {
        try {
          init = { p: 'lliure', coeffs: { a: R.parse(params.a), b: R.parse(params.b), c: R.parse(params.c), d: R.parse(params.d) } };
        } catch (e) { }
      } else if (PRESETS.some(pp => pp.id === params.p)) init.p = params.p;
    }
    loadPreset(init.p, init.coeffs);
    if (init.p === 'lliure' && init.coeffs) {
      edInputs.a.value = init.coeffs.a.toString(); edInputs.b.value = init.coeffs.b.toString();
      edInputs.c.value = init.coeffs.c.toString(); edInputs.d.value = init.coeffs.d.toString();
      el('l1-editor').hidden = false;
    }

    /* ---- «Explica-m'ho» en català senzill ---- */
    UI.addExplain(main.querySelector('.viz-head'), () => {
      const c = cur(), sol = L.solvePolyPair(c.L, c.R);
      let last;
      if (!st.found) last = 'Fes la mateixa operació als dos costats fins que quedi <b>x = un nombre</b>.';
      else if (sol.kind === 'unique') last = 'Es tallen a <b>x = ' + sol.roots.map(r => F.fmtValPlain(r)).join(' i x = ') + '</b>. Aquesta és la solució.';
      else if (sol.kind === 'all') last = 'Les dues línies són <b>la mateixa</b>: tots els nombres són solució.';
      else last = 'Les dues línies no es tallen mai: <b>no hi ha cap solució</b>.';
      return [
        'La línia <b>blava</b> és el costat esquerre: y = ' + F.fmtPolyPlain(c.L) + '.',
        'La línia <b>verda</b> és el costat dret: y = ' + F.fmtPolyPlain(c.R) + '.',
        'On les dues línies <b>es tallen</b>, els dos costats valen igual. Allà hi ha la solució.',
        last,
        'Si fas la mateixa operació als dos costats, les línies es mouen. El punt de tall pot pujar o baixar, però <b>no es mou</b> ni a la dreta ni a l\'esquerra: la x és la mateixa.'
      ];
    });

    return function cleanup() { try { st.graph.destroy(); } catch (e) { } };
  }

  function help() {
    UI.openModal({
      title: 'Equivalències · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>La idea gran.</b> Resoldre una equació és fer-la <b>més senzilla sense canviar-ne les solucions</b>. Això només es pot fer de dues maneres segures:</p>' +
      '<ul style="list-style:disc;padding-left:22px;line-height:1.9">' +
      '<li>Sumar o restar <b>el mateix</b> valor (o expressió) als dos membres.</li>' +
      '<li>Multiplicar o dividir els dos membres per un <b>nombre diferent de zero</b>.</li></ul>' +
      '<p>Són les <b>transformacions equivalents</b>: conserven exactament el mateix conjunt solució.</p>' +
      '<div class="math-block"><span class="mb-note">exemple complet</span>' +
      '3x + 4 = x + 12<br>' +
      '3x + 4 <span class="hl">− 4</span> = x + 12 <span class="hl">− 4</span>  <span class="fs-why">(resto 4 als dos membres)</span><br>' +
      '3x = x + 8<br>' +
      '3x <span class="hl">− x</span> = x + 8 <span class="hl">− x</span>  <span class="fs-why">(resto x als dos membres)</span><br>' +
      '2x = 8<br>' +
      '2x <span class="hl">÷ 2</span> = 8 <span class="hl">÷ 2</span>  <span class="fs-why">(divideixo per 2)</span><br>' +
      'x = 4</div>' +
      '<p class="help-note"><b>Com usar el laboratori?</b> Fes clic sobre un terme per eliminar-lo, o usa el panell d\'operacions (+ − × ÷). Torna enrere amb «Desfés», compara amb les rectes <b>fantasma</b> i comprova qualsevol valor a «Comprova».</p>' +
      '<p class="help-note"><b>Errors que aquí no es poden colar:</b> multiplicar per zero està bloquejat (destrueix solucions) i dividir per expressions amb x demana confirmació, perquè poden fer perdre solucions.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'm1', kind: 'lab', num: 'M1', short: 'Equivalències', goals: 6,

    title: 'Equivalències de primer grau', sub: 'Mòdul 1 · opera als dos membres',
    desc: 'Fes el mateix als dos costats i aïlla la x.',
    foot: 'El laboratori central',
    iconHTML: '1',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
