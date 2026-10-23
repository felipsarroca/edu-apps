window.VOL = window.VOL || {};
(function (V) {
  'use strict';
  const f = V.fmt, I = V.ICON_UI;
  V.views = V.views || {};

  const PRAISE = ['Correcte!', 'Molt bé!', 'Perfecte!', 'Ben fet!', 'Exacte!'];
  const good = m => `<p class="fb fb-ok">${I.check}<span>${m}</span></p>`;
  const bad = m => `<p class="fb fb-bad"><span>${m}</span></p>`;
  const warn = m => `<p class="fb fb-warn"><span>${m}</span></p>`;
  // Quan es mostra la solució, primer s'explica l'error i després la resposta
  const diag = (m, ans) => `<div class="fb-diag"><span class="diag-t">Què ha passat?</span><p class="diag-m">${m}</p><p class="reveal">La resposta correcta és <b>${ans}</b>.</p></div>`;

  function unitMsg(correct, chosen) {
    if (/³$/.test(correct) && /²$/.test(chosen)) return 'El número és correcte, però el volum es mesura en unitats cúbiques (³), no quadrades.';
    if (/³$/.test(correct)) return 'El número és correcte, però el volum es mesura en unitats cúbiques (³), no de longitud.';
    if (!/[²³]$/.test(correct)) return 'El número és correcte, però busques una longitud: la unitat no porta exponent.';
    return 'El número és correcte, però revisa la unitat.';
  }
  function generic(x, ans) {
    if (V.close(x, ans * 1000, 0.01) || V.close(x, ans / 1000, 0.01)) return 'Sembla un error d\'unitats (× 1000). Revisa les conversions.';
    if (V.close(x, ans * 10, 0.01) || V.close(x, ans / 10, 0.01)) return 'Revisa la coma decimal: el resultat és 10 vegades més gran o més petit.';
    if (V.close(x, ans, 0.05)) return 'T\'hi has apropat molt. Revisa l\'arrodoniment o fes servir π ≈ 3,1416.';
    return 'No és correcte. Revisa el càlcul.';
  }

  // ---------- Motor d'exercicis ----------
  V.runExercise = function (root, ex, opts) {
    opts = opts || {};
    const mode = opts.mode || 'guiat';
    let steps = ex.steps;
    if (mode === 'directe' && steps.length > 1) {
      const last = steps[steps.length - 1];
      steps = [Object.assign({}, last, { prompt: last.prompt.replace(' i tria la unitat', '') + (last.unitChoice ? ' Tria també la unitat.' : ''), hints: [...new Set((ex.hints || []).concat(last.hints || []))] })];
    }
    let errors = 0, hintsUsed = 0, reveals = 0, idx = 0;

    root.innerHTML = `
      <div class="ex ${opts.compact ? 'ex-compact' : ''}">
        <section class="card ex-statement">
          <div class="ex-head">
            <span class="chip" style="--c:${ex.color || '#2f5bea'}">${ex.tag || ''}</span>
            ${ex.level ? `<span class="chip chip-soft">${V.LEVELS[ex.level]}</span>` : ''}
            <button class="icon-btn speak" type="button" title="Escolta l'enunciat" aria-label="Escolta l'enunciat">${I.speaker}</button>
          </div>
          ${ex.title ? `<h2 class="ex-title">${ex.title}</h2>` : ''}
          <div class="ex-text">${ex.text}</div>
          ${ex.scene ? '<div class="viewer ex-viewer"></div><p class="viewer-hint">Arrossega per girar la figura · Pessiga o fes servir la roda per apropar-la</p>' : ''}
          ${ex.visual || ''}
        </section>
        <section class="card ex-work">
          <h3 class="work-title">${steps.length > 1 ? 'Resol-ho pas a pas' : 'La teva resposta'}</h3>
          <ol class="steps"></ol>
          <div class="ex-end" hidden></div>
        </section>
      </div>`;

    root.querySelector('.speak').addEventListener('click', () => V.speak((ex.title ? ex.title + '. ' : '') + ex.text));
    if (ex.scene) {
      const v = new V.Viewer(root.querySelector('.ex-viewer'));
      v.setScene(ex.scene, { fit: 'always' });
      ex.scene.forEach((s, i) => { if (s.water) v.setFill(i, s.fill != null ? s.fill : 0.7); });
    }
    const ol = root.querySelector('.steps');

    function next() {
      if (idx >= steps.length) return end();
      renderStep(steps[idx], idx);
    }

    function renderStep(st, i) {
      // Els passos ja resolts es pleguen en una línia amb el resultat
      ol.querySelectorAll('.step').forEach(p => p.classList.add('folded'));
      const li = document.createElement('li');
      li.className = 'step active';
      li.innerHTML = `
        <div class="step-prompt">${steps.length > 1 ? `<span class="step-n">${i + 1}</span>` : ''}<div>${st.prompt}</div><span class="step-sum">${st.kind === 'choice' ? st.options.find(o => o.correct).html : `${f(st.answer, st.dec != null ? st.dec : 2)} ${st.unit || ''}`}</span></div>
        <div class="step-body"></div>
        <div class="step-fb" aria-live="polite"></div>
        <div class="step-hints"></div>
        <div class="step-foot"></div>`;
      ol.appendChild(li);
      const body = li.querySelector('.step-body'), fb = li.querySelector('.step-fb'), hintsEl = li.querySelector('.step-hints'), foot = li.querySelector('.step-foot');
      let attempts = 0, hintI = 0;
      const hints = [...new Set(st.hints || [])];

      if (hints.length) {
        // Cada pista surt una sola vegada; quan s'acaben, el botó queda desactivat
        const label = () => hintI >= hints.length ? 'No hi ha més pistes' : hintI ? `Una altra pista (${hints.length - hintI})` : 'Necessito una pista';
        const hb = V.ui.button(`${I.bulb}<span>${label()}</span>`, () => {
          if (hintI >= hints.length) return;
          hintsEl.insertAdjacentHTML('beforeend', `<p class="hint">${hints[hintI++]}</p>`);
          hintsUsed++;
          hb.querySelector('span').textContent = label();
          if (hintI >= hints.length) hb.disabled = true;
        }, 'btn-hint');
        foot.appendChild(hb);
      }

      function finish(ok, needContinue) {
        li.classList.remove('active');
        li.classList.add(ok ? 'ok' : 'revealed');
        body.querySelectorAll('input,select,button').forEach(b => { b.disabled = true; });
        foot.innerHTML = '';
        idx++;
        if (needContinue) {
          const c = V.ui.button(`Continua ${I.arrow}`, () => { c.remove(); next(); }, 'primary');
          foot.appendChild(c);
          c.focus();
        } else next();
      }

      if (st.kind === 'choice') {
        body.innerHTML = `<div class="choices">${st.options.map((o, k) => `<button type="button" class="choice" data-k="${k}">${o.html}</button>`).join('')}</div>`;
        body.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click', () => {
          const o = st.options[+btn.dataset.k];
          if (o.correct) {
            btn.classList.add('is-ok');
            fb.innerHTML = good(st.okMsg || 'Correcte!');
            finish(true, false);
            return;
          }
          attempts++; errors++;
          btn.classList.add('is-bad'); btn.disabled = true;
          if (attempts >= 2) {
            reveals++;
            const k = st.options.findIndex(x => x.correct);
            body.querySelectorAll('.choice')[k].classList.add('is-ok');
            fb.innerHTML = diag(o.msg || 'Aquesta fórmula no és la del cos que calcules.', st.options[k].html);
            finish(false, true);
          } else fb.innerHTML = bad(`${o.msg || 'No és aquesta.'} Torna-ho a provar.`);
        }));
        return;
      }

      body.innerHTML = `
        <form class="answer" novalidate>
          <input class="num" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="Resultat" aria-label="Resposta">
          ${st.unitChoice
            ? `<select class="unit" aria-label="Unitat"><option value="">unitat…</option>${st.unitChoice.map(u => `<option>${u}</option>`).join('')}</select>`
            : (st.unit ? `<span class="unit-fixed">${st.unit}</span>` : '')}
          <button class="btn primary" type="submit">Comprova</button>
          ${Math.abs(st.answer - Math.round(st.answer)) > 1e-9 ? `<p class="round-note">Arrodoneix a ${(st.dec != null ? st.dec : 2) === 1 ? '1 decimal' : (st.dec != null ? st.dec : 2) + ' decimals'}.</p>` : ''}
        </form>`;
      const form = body.querySelector('form'), inp = body.querySelector('.num'), sel = body.querySelector('select');
      if (i > 0) setTimeout(() => inp.focus({ preventScroll: true }), 30);
      form.addEventListener('submit', e => {
        e.preventDefault();
        const x = V.parseNum(inp.value);
        if (isNaN(x)) { fb.innerHTML = warn('Escriu un nombre. Per als decimals, fes servir la coma: 12,5'); return; }
        if (sel && !sel.value) { fb.innerHTML = warn('Tria també la unitat.'); sel.focus(); return; }
        const numOk = V.close(x, st.answer, st.tol || 0.01);
        const unitOk = !sel || sel.value === st.unit;
        if (numOk && unitOk) {
          fb.innerHTML = good(V.pick(PRAISE) + (attempts ? '' : ''));
          finish(true, false);
          return;
        }
        attempts++; errors++;
        let msg;
        if (numOk) msg = unitMsg(st.unit, sel.value);
        else {
          const d = (st.distractors || []).find(dd => V.close(x, dd.v, 0.005));
          msg = d ? d.msg : generic(x, st.answer);
        }
        inp.classList.remove('shake'); void inp.offsetWidth; inp.classList.add('shake');
        if (attempts >= 2) {
          reveals++;
          fb.innerHTML = diag(msg, `${f(st.answer, st.dec != null ? st.dec : 2)} ${st.unit || ''}`);
          finish(false, true);
        } else fb.innerHTML = bad(msg + ' Torna-ho a provar.');
      });
    }

    function end() {
      const score = reveals ? Math.max(0, 0.4 - 0.1 * (reveals - 1)) : Math.max(0.3, 1 - 0.2 * errors - 0.1 * hintsUsed);
      const box = root.querySelector('.ex-end');
      const title = score >= 0.9 ? 'Perfecte!' : score >= 0.6 ? 'Molt bé!' : 'Exercici acabat';
      const sub = score >= 0.9 ? 'Ho has resolt sense errors.' : score >= 0.6 ? 'Has trobat la resposta amb alguna ajuda.' : 'Revisa la solució amb calma: d\'aquí s\'aprèn molt.';
      box.hidden = false;
      box.innerHTML = `
        <div class="end-head ${score >= 0.6 ? 'is-good' : 'is-mid'}"><strong>${title}</strong><span>${sub}</span></div>
        ${ex.solution ? `<details class="solution" ${score < 0.9 ? 'open' : ''}><summary>Solució pas a pas</summary><ol>${ex.solution.map(s => `<li><span>${s.t}</span><div>${s.m}</div></li>`).join('')}</ol></details>` : ''}
        ${ex.curiosity ? `<div class="curiosity"><b>Sabies que…?</b> ${ex.curiosity}</div>` : ''}
        <div class="end-actions"></div>`;
      if (opts.onEnd) opts.onEnd(score);
      if (opts.onFinish) {
        const nb = V.ui.button(`${opts.nextLabel || 'Següent'} ${I.arrow}`, () => opts.onFinish(score), 'primary big');
        box.querySelector('.end-actions').appendChild(nb);
        nb.focus({ preventScroll: true });
      }
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    next();
  };

  // ---------- Pantalla de pràctica ----------
  V.views.practica = function (app) {
    const st = V.progress.settings;
    app.innerHTML = `
      <div class="wrap">
        <header class="page-head">
          <h1>Practica</h1>
          <p class="lead">Tria una habilitat. Cada sessió té 6 exercicis nous. En mode automàtic, el nivell s'adapta a com et va.</p>
        </header>
        <div class="settings card">
          <div class="set-group"><span class="set-label">Manera de treballar</span><div id="set-mode"></div></div>
          <div class="set-group"><span class="set-label">Nivell</span><div id="set-level"></div></div>
        </div>
        <a class="mix-card" href="#/exercici/barreja">
          <span class="skill-ic" style="--c:#ff7a3d">${V.ICONS.barreja}</span>
          <span><strong>Barreja recomanada</strong><small>Exercicis de totes les habilitats, amb més pes en les que encara has de reforçar.</small></span>
          <span class="go">${I.arrow}</span>
        </a>
        <div class="skill-grid">
          ${V.SKILLS.map(s => {
            const m = V.mastery(s.id);
            return `<a class="skill-card" href="#/exercici/${s.id}" style="--c:${s.color}">
              <span class="skill-ic">${V.ICONS[s.icon]}</span>
              <strong>${s.name}</strong>
              <small>${s.desc}</small>
              <span class="skill-foot">${V.starsHtml(V.stars(m))}<span class="lvl">${st.level === 'auto' ? V.LEVELS[V.levelFor(s.id)] : ''}</span></span>
              <span class="bar"><i style="width:${Math.round(m * 100)}%"></i></span>
            </a>`;
          }).join('')}
        </div>
        <section class="reptes-block">
          <h2>Reptes: problemes reals</h2>
          <p class="muted">Objectes de veritat i diversos passos: calcula, converteix unitats i interpreta el resultat.</p>
          ${repteGrid()}
        </section>
      </div>`;
    app.querySelector('#set-mode').appendChild(V.ui.seg({
      label: 'Manera de treballar', value: st.mode,
      options: [{ v: 'guiat', label: 'Pas a pas' }, { v: 'directe', label: 'Directe' }],
      onChange: v => { st.mode = v; V.saveProgress(); }
    }));
    app.querySelector('#set-level').appendChild(V.ui.seg({
      label: 'Nivell', value: st.level,
      options: [{ v: 'auto', label: 'Automàtic' }, { v: '1', label: '1' }, { v: '2', label: '2' }, { v: '3', label: '3' }],
      onChange: v => { st.level = v; V.saveProgress(); V.views.practica(app); }
    }));
  };

  V.views.exercici = function (app, skill) {
    const N = 6;
    const info = skill === 'barreja' ? { name: 'Barreja recomanada' } : V.skill(skill);
    if (!info) { location.hash = '#/practica'; return; }
    let i = 0;
    const scores = [];
    app.innerHTML = `
      <div class="wrap">
        <div class="session-bar">
          <a class="btn-link" href="#/practica">${I.back}<span>Habilitats</span></a>
          <strong>${info.name}</strong>
          <div class="dots" aria-label="Progrés de la sessió">${Array.from({ length: N }, () => '<i></i>').join('')}</div>
        </div>
        <div id="exroot"></div>
      </div>`;
    const root = app.querySelector('#exroot');
    const dots = app.querySelectorAll('.dots i');

    function nextEx() {
      V.disposeViewers();
      dots.forEach((d, k) => d.classList.toggle('now', k === i));
      if (i >= N) return summary();
      const sk = skill === 'barreja' ? V.pickAdaptive() : skill;
      const ex = V.makeExercise(sk, V.levelFor(sk));
      V.runExercise(root, ex, {
        mode: V.progress.settings.mode,
        nextLabel: i === N - 1 ? 'Veure el resultat' : 'Següent exercici',
        onEnd: score => {
          V.recordResult(sk, score);
          scores.push(score);
          dots[i].classList.add(score >= 0.9 ? 'ok' : score >= 0.5 ? 'mid' : 'ko');
        },
        onFinish: () => { i++; nextEx(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      });
    }

    function summary() {
      const clean = scores.filter(s => s >= 0.9).length;
      const pts = scores.reduce((a, s) => a + Math.round(10 * s), 0);
      const m = skill === 'barreja' ? null : V.mastery(skill);
      root.innerHTML = `
        <section class="card summary">
          <h2>Sessió acabada</h2>
          <div class="sum-grid">
            <div><b>${clean}/${N}</b><span>sense errors</span></div>
            <div><b>+${pts}</b><span>punts</span></div>
            ${m != null ? `<div>${V.starsHtml(V.stars(m))}<span>domini de l'habilitat</span></div>` : ''}
          </div>
          <p class="lead">${clean >= 5 ? 'Excel·lent! Pots provar el nivell següent o un repte.' : clean >= 3 ? 'Vas pel bon camí. Una altra ronda et farà anar més segur.' : 'Repassa la lliçó corresponent i torna-ho a provar. Fes servir les pistes sense por.'}</p>
          <div class="end-actions">
            <a class="btn primary big" href="#/exercici/${skill}" data-reload>Una altra ronda</a>
            <a class="btn" href="#/practica">Tria una altra habilitat</a>
            <a class="btn" href="#/reptes">Prova un repte</a>
          </div>
        </section>`;
      root.querySelector('[data-reload]').addEventListener('click', e => { e.preventDefault(); V.views.exercici(app, skill); });
    }

    nextEx();
  };

  // ---------- Reptes ----------
  function repteGrid() {
    return `<div class="repte-grid">
      ${V.REPTES.map((R, k) => `
        <a class="repte-card ${V.progress.reptes[R.id] ? 'done' : ''}" href="#/repte/${R.id}" style="--c:${R.color}">
          <span class="repte-n">${String(k + 1).padStart(2, '0')}</span>
          <span class="skill-ic">${V.ICONS[R.icon]}</span>
          <strong>${R.title}</strong>
          <small>${R.short}</small>
          ${V.progress.reptes[R.id] ? `<span class="done-badge">${I.check} Superat</span>` : ''}
        </a>`).join('')}
    </div>`;
  }

  // La llista de reptes viu dins de Practica; aquesta ruta hi porta directament
  V.views.reptes = function (app) {
    V.views.practica(app);
    const b = app.querySelector('.reptes-block');
    if (b) requestAnimationFrame(() => b.scrollIntoView());
  };

  V.views.repte = function (app, id) {
    const k = V.REPTES.findIndex(R => R.id === id);
    if (k < 0) { location.hash = '#/reptes'; return; }
    const R = V.REPTES[k], nextR = V.REPTES[k + 1];
    app.innerHTML = `<div class="wrap"><div class="session-bar"><a class="btn-link" href="#/reptes">${I.back}<span>Tots els reptes</span></a><strong>Repte ${k + 1} de ${V.REPTES.length}</strong></div><div id="exroot"></div></div>`;
    V.runExercise(app.querySelector('#exroot'), V.repteExercise(R), {
      nextLabel: nextR ? 'Repte següent' : 'Torna a Practica',
      onEnd: score => {
        if (score >= 0.3) { V.progress.reptes[R.id] = true; V.progress.xp += Math.round(20 * score); V.saveProgress(); }
      },
      onFinish: () => { location.hash = nextR ? '#/repte/' + nextR.id : '#/reptes'; }
    });
  };
})(window.VOL);
