/* ============================================================
   components.js — components d'UI reutilitzables
   Modal amb focus trap, toasts, pestanyes, targetes de predicció,
   controls de coeficients (lliscador + valor exacte), icones SVG
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});
  const F = L.fmt;

  /* ---------- icones ---------- */
  const ICONS = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7.5 15h9"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14A2.5 2.5 0 0 0 6.5 22H20v-2.5"/></svg>',
    projector: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M17 10h5v4h-5M6 12h.01M9 12h.01"/></svg>',
    eyeoff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-6 3 3 5-7"/></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M8 21h8M12 5l-7 3 3.5 6a3.5 3.5 0 0 0 7 0L19 8l-7-3z"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/></svg>',
    steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4v-4h4v-4h4V8h4"/></svg>',
    predict: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-1.5 3H17l-6.5 9L11.5 13H8l4-8h3z"/></svg>',
    magnifier: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4L8 20l-5 1 1-5L17 3z"/></svg>',
    arrows: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
    speech: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>'
  };
  function icon(name) { return ICONS[name] || ''; }

  /* ---------- modal ---------- */
  const modalRoot = () => document.getElementById('modal-root');
  const openModals = []; // pila: route() els tanca tots en canviar de laboratori
  function openModal(opts) {
    opts = opts || {};
    const root = modalRoot();
    const lastFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<div class="modal ' + (opts.small ? 'small' : opts.wide ? 'wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="modal-t">' +
      '<div class="modal-head">' +
      (opts.icon ? '<span class="mh-icon">' + opts.icon + '</span>' : '') +
      '<h2 id="modal-t">' + opts.title + '</h2>' +
      '<button class="modal-close" aria-label="Tanca la finestra">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="modal-body">' + (opts.bodyHTML || '') + '</div>' +
      (opts.footHTML ? '<div class="modal-foot">' + opts.footHTML + '</div>' : '') +
      '</div>';
    root.appendChild(overlay);

    const dialog = overlay.querySelector('.modal');
    const api = {
      root: overlay, dialog,
      close() {
        const i = openModals.indexOf(api);
        if (i >= 0) openModals.splice(i, 1);
        overlay.remove();
        document.removeEventListener('keydown', keyhandler);
        if (opts.onClose) opts.onClose();
        if (lastFocus && lastFocus.focus && document.contains(lastFocus)) { try { lastFocus.focus(); } catch (e) { } }
      }
    };
    openModals.push(api);
    const keyhandler = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); api.close(); }
      if (e.key === 'Tab') {
        const focusables = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keyhandler);
    overlay.addEventListener('pointerdown', (e) => { if (e.target === overlay) api.close(); });
    overlay.querySelector('.modal-close').addEventListener('click', () => api.close());
    if (opts.actions) {
      for (const a of opts.actions) {
        const b = overlay.querySelector('[data-action="' + a.id + '"]');
        if (b) b.addEventListener('click', () => { a.onClick(api); });
      }
    }
    const f = dialog.querySelector('button, input, select, textarea');
    if (f) f.focus(); else { dialog.tabIndex = -1; dialog.focus(); }
    return api;
  }

  function confirmModal(opts) {
    return new Promise((resolve) => {
      openModal({
        title: opts.title, small: true, icon: opts.icon || icon('info'),
        bodyHTML: '<p>' + (opts.bodyHTML || '') + '</p>',
        footHTML:
          '<button class="btn ghost" data-action="no">' + (opts.cancelLabel || 'Cancel·la') + '</button>' +
          '<button class="btn ' + (opts.danger ? 'danger-soft' : 'primary') + '" data-action="yes">' + (opts.okLabel || "D'acord") + '</button>',
        actions: [
          // resol abans de tancar: close() crida onClose, que resoldria false
          { id: 'no', onClick: (m) => { resolve(false); m.close(); } },
          { id: 'yes', onClick: (m) => { resolve(true); m.close(); } }
        ],
        onClose: () => resolve(false)
      });
    });
  }

  /* ---------- toast ---------- */
  function toast(msg, type, ms) {
    const root = document.getElementById('toast-root');
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'ok');
    t.innerHTML = (type === 'err' ? icon('alert') : type === 'warn' ? icon('info') : icon('check')) + '<span>' + msg + '</span>';
    root.appendChild(t);
    setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, ms || 2600);
  }

  /* ---------- pestanyes genèriques ---------- */
  function tabsInit(container, opts) {
    const bar = container.querySelector('[role="tablist"]');
    if (!bar) return;
    const btns = [...bar.querySelectorAll('[data-tab]')];
    const panels = [...container.querySelectorAll('[data-panel]')];
    function select(name, focus) {
      for (const b of btns) {
        const on = b.dataset.tab === name;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        if (focus && on) b.focus();
      }
      for (const p of panels) p.classList.toggle('active', p.dataset.panel === name);
      if (opts && opts.onChange) opts.onChange(name);
    }
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]'); if (!b) return;
      select(b.dataset.tab);
      // a la columna esquerra, si la barra queda a la meitat baixa, la pugem perquè el panell es vegi sencer
      const col = container.closest('.lab-left');
      if (col) {
        const top = bar.getBoundingClientRect().top - col.getBoundingClientRect().top;
        if (top > col.clientHeight / 2) col.scrollBy({ top: top - 4, behavior: 'smooth' });
      }
    });
    bar.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const ni = (i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
      select(btns[ni].dataset.tab, true);
    });
    if (btns.length) select(btns[0].dataset.tab);
    return { select };
  }

  /* ---------- targeta plegable ----------
     Amaga els fills marcats amb data-fold (nivells, lliscadors…) i deixa visible l'equació.
     L'estat es recorda per mòdul. */
  function foldCard(card, key) {
    const title = card && card.querySelector('.card-title');
    if (!title) return;
    const sk = 'labeq:fold:' + key;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fold-btn';
    function set(folded, save) {
      card.classList.toggle('folded', folded);
      btn.setAttribute('aria-expanded', folded ? 'false' : 'true');
      btn.title = folded ? 'Mostra els controls de l\'equació' : 'Plega els controls per guanyar espai';
      btn.innerHTML = (folded ? 'Desplega' : 'Plega') + ICONS.chevron;
      if (save) { try { localStorage.setItem(sk, folded ? '1' : '0'); } catch (e) { } }
    }
    let initial = false;
    try { initial = localStorage.getItem(sk) === '1'; } catch (e) { }
    btn.addEventListener('click', () => set(!card.classList.contains('folded'), true));
    title.appendChild(btn);
    set(initial, false);
  }

  /* ---------- targeta de pregunta o de predicció ----------
     opts: { question, options: [{label(html), correct, why}], onDone(ok, index), mode, shuffle, continueLabel }
     · mode 'hypothesis': l'alumne fa una hipòtesi (encertada o no) i després la comprova al laboratori.
     · mode per defecte (pregunta): un sol intent. Si falla, es mostra la resposta correcta i el perquè;
       no es van desactivant opcions, per evitar arribar a la resposta per eliminació. */
  function shuffled(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function labelText(html) { const d = document.createElement('div'); d.innerHTML = html; const p = d.querySelector('.pic-lab'); return (p || d).textContent.trim(); }
  function renderPrediction(opts) {
    const el = document.createElement('div');
    const hyp = opts.mode === 'hypothesis';
    el.className = 'predict-card' + (hyp ? ' hypothesis' : '');
    const order = opts.options.map((o, i) => i);
    const shown = opts.shuffle ? shuffled(order) : order;
    el.innerHTML =
      '<div class="pc-head"><span class="pc-icon">' + icon('predict') + '</span>' +
      '<div class="pc-q">' + opts.question + '</div></div>' +
      (hyp ? '<div class="pc-sub">No passa res si t\'equivoques: és la teva hipòtesi.</div>' : '') +
      '<div class="pc-options" role="group" aria-label="Opcions de resposta">' +
      shown.map(i => '<button type="button" class="pc-opt" data-i="' + i + '">' + opts.options[i].label + '</button>').join('') +
      '</div><div class="pc-feedback" hidden></div><div class="pc-actions" hidden></div>';
    let done = false;
    const feedback = el.querySelector('.pc-feedback');
    const actions = el.querySelector('.pc-actions');
    el.querySelector('.pc-options').addEventListener('click', (e) => {
      const b = e.target.closest('.pc-opt'); if (!b || done) return;
      done = true;
      const i = +b.dataset.i, o = opts.options[i];
      const btns = [...el.querySelectorAll('.pc-opt')];
      btns.forEach(x => { x.disabled = true; });
      feedback.hidden = false;
      if (hyp) {
        b.classList.add('chosen');
        feedback.innerHTML = '<b>La teva hipòtesi:</b> ' + labelText(o.label) + '. Ara comprova-la.';
        announce('Hipòtesi desada');
      } else if (o.correct) {
        b.classList.add('correct');
        feedback.innerHTML = '<b>Molt bé!</b> ' + (o.why || '');
        announce('Resposta correcta');
      } else {
        b.classList.add('wrong');
        const ci = opts.options.findIndex(x => x.correct);
        const cb = btns.find(x => +x.dataset.i === ci);
        if (cb) cb.classList.add('correct');
        const c = opts.options[ci];
        feedback.innerHTML = '<b>No és aquesta.</b> ' + (o.why || '') +
          '<br><b>La correcta és «' + labelText(c.label) + '».</b> ' + (c.why || '');
        announce('Resposta incorrecta. Es mostra la correcta.');
      }
      actions.hidden = false;
      actions.innerHTML = '<button type="button" class="btn primary small">' + (opts.continueLabel || 'Continua') + '</button>';
      actions.querySelector('button').addEventListener('click', () => {
        if (opts.removeOnDone !== false) el.remove();
        if (opts.onDone) opts.onDone(!!o.correct, i);
      });
      actions.querySelector('button').focus();
    });
    return el;
  }

  /* ---------- compara la hipòtesi amb el resultat i demana una explicació breu ----------
     o: { ok, said, happened, why, lab, onClose }. El text es desa només en aquest navegador. */
  function reflect(host, o) {
    const box = document.createElement('div');
    box.className = 'reflect-card ' + (o.ok ? 'ok' : 'miss');
    const frames = o.ok
      ? ['Ho havia previst perquè…', 'Ho he comprovat amb…', 'Ara sé que…']
      : ['Esperava que…, però…', 'He canviat d\'idea perquè…', 'Ara sé que…'];
    // primer, una sola frase de retorn; explicar-ho és opcional i queda plegat
    box.innerHTML =
      '<div class="rf-head">' + (o.ok ? icon('check') : icon('info')) +
      '<span class="rf-line">' + (o.ok ? 'Encertat: ' : 'Esperaves «' + o.said + '», però ') + o.happened.charAt(0).toLowerCase() + o.happened.slice(1) + '.' +
      (o.why ? ' <span class="rf-why">' + o.why + '</span>' : '') + '</span>' +
      '<button type="button" class="rf-close" aria-label="Tanca">' + icon('x') + '</button></div>' +
      (o.ask === false ? '' :
        '<details class="rf-more"><summary>Vull explicar-ho</summary>' +
        '<div class="rf-frames">' + frames.map(f => '<button type="button" class="rf-frame">' + f + '</button>').join('') + '</div>' +
        '<div class="rf-row"><textarea class="input rf-text" id="rf-text" rows="2" placeholder="Tria un començament o escriu lliurement" aria-label="La teva explicació"></textarea>' +
        '<button type="button" class="btn primary small rf-save">Desa</button></div></details>');
    host.innerHTML = '';
    host.appendChild(box);
    const close = () => { box.remove(); if (o.onClose) o.onClose(); };
    box.querySelector('.rf-close').addEventListener('click', close);
    if (o.ask === false) return box;
    const ta = box.querySelector('.rf-text');
    box.querySelectorAll('.rf-frame').forEach(b => b.addEventListener('click', () => {
      ta.value = b.textContent.replace(/…/g, ' ').replace(/\s+$/, '') + ' ';
      ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
    }));
    box.querySelector('.rf-save').addEventListener('click', () => {
      const text = ta.value.trim();
      if (text.replace(/[^a-zà-úïü]/gi, '').length < 12) { toast('Escriu una frase una mica més llarga.', 'warn'); ta.focus(); return; }
      if (L.App && L.App.saveReflection) L.App.saveReflection(o.lab, text, o.said + ' → ' + o.happened);
      toast('Explicació desada.', 'ok');
      close();
    });
    return box;
  }
  function announce(msg) {
    const root = document.getElementById('toast-root');
    if (!root) return;
    const live = document.createElement('div');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'assertive');
    live.textContent = msg;
    root.appendChild(live);
    setTimeout(() => live.remove(), 1500);
  }

  /* ---------- control de coeficient (lliscador + valor exacte) ---------- */
  /* opts: {name, value: R, min, max, step, onChange(R), warn(R)|null, ariaLabel} */
  function coefRow(opts) {
    const wrap = document.createElement('div');
    wrap.className = 'coef-row';
    const val = opts.value;
    wrap.innerHTML =
      '<span class="coef-name" aria-hidden="true"><i>' + opts.name + '</i></span>' +
      '<input type="range" min="' + opts.min + '" max="' + opts.max + '" step="' + (opts.step || 1) + '" value="' + val.toNumber() + '" aria-label="Coeficient ' + opts.name + '">' +
      '<input type="text" class="coef-val" value="' + displayVal(val) + '" aria-label="Valor exacte del coeficient ' + opts.name + '" inputmode="text">';
    const slider = wrap.querySelector('input[type="range"]');
    const input = wrap.querySelector('.coef-val');
    function displayVal(r) { return r.toString().replace('-', '\u2212'); }
    function commit(r, src) {
      if (opts.onChange) opts.onChange(r, src);
      if (src !== 'input') input.value = displayVal(r);
      const bad = opts.warn ? opts.warn(r) : null;
      input.classList.toggle('bad', !!bad);
      input.title = bad || '';
      slider.value = String(clampNum(r.toNumber(), +opts.min, +opts.max));
    }
    slider.addEventListener('input', () => {
      let r;
      try { r = L.R.num(Math.round(parseFloat(slider.value) * 2) / 2); } catch (e) { return; }
      commit(r, 'slider');
    });
    input.addEventListener('change', () => {
      try {
        const r = L.R.parse(input.value);
        if (Math.abs(r.toNumber()) > 1000) throw new Error('massa gran');
        commit(r, 'input');
        input.classList.remove('bad');
      } catch (e) {
        input.classList.add('bad');
        input.title = 'Valor no vàlid: escriu un nombre, una fracció (3/2) o un decimal (1,5)';
        toast('No he entès el valor «' + input.value + '». Pots escriure 3, −2, 1/2 o 1,5.', 'warn');
      }
    });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') input.blur(); });
    commit(val, 'init');
    // API per sincronitzar el control amb canvis externs (preset, desfés…)
    wrap.updateValue = function (r) {
      input.value = displayVal(r);
      input.classList.remove('bad');
      slider.value = String(clampNum(r.toNumber(), +opts.min, +opts.max));
    };
    return wrap;
  }
  function clampNum(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- mini-gràfic per a modals ---------- */
  function miniGraph(setup, opts) {
    const host = document.createElement('div');
    host.className = 'mini-graph-host';
    host.style.height = (opts && opts.height) || '190px';
    const g = new L.Graph(host, { mini: true, pad: { l: 34, r: 10, t: 10, b: 22 } });
    setup(g);
    return host;
  }

  /* ---------- botó «Per què?» ---------- */
  function whyBtn(label, modalOpts) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn soft small';
    b.innerHTML = icon('bulb') + ' <span>' + (label || 'Per què?') + '</span>';
    b.addEventListener('click', () => openModal(modalOpts));
    return b;
  }

  /* ---------- pestanyes de vista mòbil (Experimenta / Visualitza) ---------- */
  /* getEq(): HTML de l'equació actual. Al mòbil, quan es passa a la vista del gràfic,
     es mostra a dalt perquè l'alumne no la perdi de vista. */
  function bindLabViewTabs(labEl, initial, getEq) {
    const bar = labEl.querySelector('.lab-viewtabs');
    if (!bar) return;
    labEl.dataset.view = initial || 'ctrl';
    let strip = null;
    if (getEq) {
      strip = document.createElement('div');
      strip.className = 'viz-eqstrip math';
      strip.setAttribute('aria-hidden', 'true');
      const right = labEl.querySelector('.lab-right');
      if (right) right.prepend(strip);
    }
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-viewtab]');
      if (!b) return;
      labEl.dataset.view = b.dataset.viewtab;
      if (strip && b.dataset.viewtab === 'viz') strip.innerHTML = getEq();
    });
  }

  function closeAllModals() {
    while (openModals.length) openModals[openModals.length - 1].close();
  }

  /* ---------- «Explica-m'ho»: el que mostra el gràfic, en català senzill (A2) ----------
     getLines() retorna frases curtes (HTML) calculades amb l'estat actual del laboratori.
     Si el navegador té síntesi de veu, també es poden escoltar. */
  function plainText(html) { const d = document.createElement('div'); d.innerHTML = html; return d.textContent; }
  function speak(lines) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(lines.map(plainText).join(' ')
      .replace(/²/g, ' al quadrat').replace(/³/g, ' al cub').replace(/⁴/g, ' a la quarta')
      .replace(/−/g, 'menys ').replace(/·/g, ' per '));
    u.lang = 'ca-ES'; u.rate = 0.9;
    const v = speechSynthesis.getVoices().find(vv => /^ca/i.test(vv.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  function addExplain(head, getLines) {
    if (!head) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'explain-btn';
    b.title = 'Explica amb paraules senzilles què mostra el gràfic';
    b.innerHTML = icon('speech') + '<span>Explica-m\'ho</span>';
    head.appendChild(b);
    b.addEventListener('click', () => {
      const SUP = { 2: '²', 3: '³', 4: '⁴' };
      const lines = getLines().map(l => l.replace(/\^([234])/g, (m, d) => SUP[d]));
      const canSpeak = 'speechSynthesis' in window;
      openModal({
        title: 'Explica-m\'ho', small: true, icon: icon('speech'),
        bodyHTML: '<ol class="plain-lines">' + lines.map(l => '<li>' + l + '</li>').join('') + '</ol>',
        footHTML: (canSpeak ? '<button class="btn ghost" data-action="say">' + icon('play') + 'Escolta</button>' : '') +
          '<button class="btn primary" data-action="ok">D\'acord</button>',
        onClose: () => { if (canSpeak) speechSynthesis.cancel(); },
        actions: [
          { id: 'say', onClick: () => speak(lines) },
          { id: 'ok', onClick: (m) => m.close() }
        ]
      });
    });
  }

  /* ---------- guia de passos: ① Prediu → ② Prova-ho → ③ Comprova + una frase curta ----------
     Substitueix l'antiga franja d'observacions: un sol missatge cada vegada. */
  function guide(el, labels) {
    labels = labels || ['Mira les rectes', 'Prova-ho', 'Comprova'];
    el.className = 'guide';
    el.innerHTML = '<ol class="g-steps" aria-label="Passos">' +
      labels.map((l, i) => '<li><span class="g-dot">' + (i + 1) + '</span><span class="g-lab">' + l + '</span></li>').join('') +
      '</ol><div class="g-msg" aria-live="polite"></div>';
    const lis = [...el.querySelectorAll('li')], msg = el.querySelector('.g-msg');
    let last = 0;
    return {
      // step: pas actiu (1..n); més gran que n = tot fet. tone: '' | 'ok' | 'warn' | 'err'
      set(step, html, tone) {
        lis.forEach((li, i) => {
          const n = i + 1;
          li.classList.toggle('done', n < step);
          li.classList.toggle('on', n === step);
          li.querySelector('.g-dot').textContent = n < step ? '✓' : String(n);
        });
        if (step > last && last) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
        last = step;
        msg.innerHTML = html;
        el.dataset.tone = tone || '';
      }
    };
  }

  /* ---------- selector d'exemples per tipus: un botó per grup + «Un altre» ----------
     opts: { items:[{id, level:n, title}], groups?:[[n, nom]], onPick(id), onRandom?(), extra?:[{id, html, title, onClick}] }
     Els noms dels grups descriuen el contingut (p. ex. «x als dos costats»), no la dificultat. */
  const LEVELS = [[1, 'Fàcil'], [2, 'Mitjà'], [3, 'Repte']];
  function levelPicker(host, opts) {
    host.classList.add('lvl-row');
    const groups = opts.groups || LEVELS;
    host.innerHTML =
      groups.filter(([n]) => opts.items.some(it => it.level === n))
        .map(([n, name]) => '<button type="button" class="lvl" data-lvl="' + n + '"><span class="lvl-dot l' + n + '"></span>' + name + '</button>').join('') +
      '<button type="button" class="lvl rnd" data-rnd="1" title="Un exemple diferent">🎲 Un altre</button>' +
      (opts.extra || []).map(x => '<button type="button" class="lvl extra" data-extra="' + x.id + '" title="' + (x.title || '') + '">' + x.html + '</button>').join('');
    let active = null;
    function setActive(id) {
      active = id;
      const it = opts.items.find(i => i.id === id);
      host.querySelectorAll('[data-lvl]').forEach(b => {
        const on = !!it && +b.dataset.lvl === it.level;
        b.setAttribute('aria-pressed', String(on));
        if (on && it.title) b.title = it.title; else b.removeAttribute('title');
      });
      host.querySelectorAll('[data-extra]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.extra === id)));
    }
    host.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.lvl) {
        const list = opts.items.filter(i => i.level === +b.dataset.lvl);
        const k = list.findIndex(i => i.id === active);
        const next = list[(k + 1) % list.length];
        opts.onPick(next.id);
      } else if (b.dataset.rnd) {
        if (opts.onRandom) { opts.onRandom(); return; }
        const others = opts.items.filter(i => i.id !== active);
        opts.onPick(others[Math.floor(Math.random() * others.length)].id);
      } else if (b.dataset.extra) {
        const x = (opts.extra || []).find(x => x.id === b.dataset.extra);
        if (x) x.onClick();
      }
    });
    return { setActive };
  }

  /* ---------- celebració en aconseguir un repte ---------- */
  function celebrate() {
    try { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; } catch (e) { }
    const box = document.createElement('div');
    box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    const COLS = ['#ef9f17', '#0f766e', '#1d5fd6', '#0d9463', '#c22f2f', '#f2b544'];
    for (let i = 0; i < 42; i++) {
      const s = document.createElement('i');
      s.style.left = (Math.random() * 100) + '%';
      s.style.background = COLS[i % COLS.length];
      s.style.animationDelay = (Math.random() * .35) + 's';
      s.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      s.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2000);
  }

  /* ---------- miniatures per a les opcions de predicció ---------- */
  const PICS = (() => {
    const ax = '<path d="M4 30h56" stroke="#8a97a8" stroke-width="2"/>';
    const svg = (body) => '<svg class="pic" viewBox="0 0 64 40" aria-hidden="true">' + body + '</svg>';
    const par = (d) => svg(ax + '<path d="' + d + '" fill="none" stroke="#1d5fd6" stroke-width="3" stroke-linecap="round"/>');
    const lines = (a, b) => svg('<path d="' + a + '" stroke="#1d5fd6" stroke-width="3" stroke-linecap="round"/><path d="' + b + '" stroke="#0d9463" stroke-width="3" stroke-linecap="round"' + (a === b ? ' stroke-dasharray="6 6"' : '') + '/>');
    return {
      par0: par('M12 2Q32 28 52 2'),
      par1: par('M12 2Q32 58 52 2'),
      par2: par('M12 2Q32 72 52 2'),
      lCross: lines('M8 34L56 6', 'M8 8L56 34'),
      lPar: lines('M8 26L56 6', 'M8 36L56 16'),
      lSame: lines('M8 34L56 6', 'M8 34L56 6'),
      flipYes: svg('<text x="32" y="29" text-anchor="middle" font-size="24" font-weight="700" fill="#b26a05">&lt; ⇄ &gt;</text>'),
      flipNo: svg('<text x="32" y="29" text-anchor="middle" font-size="24" font-weight="700" fill="#0f766e">&lt; = &lt;</text>')
    };
  })();
  function pic(name, label) { return (PICS[name] || '') + '<span class="pic-lab">' + label + '</span>'; }

  /* ---------- vel sobre el gràfic: es treu quan l'alumne ha fet la hipòtesi ---------- */
  function veil(host, on, text) {
    if (!host) return;
    let v = host.querySelector(':scope > .viz-veil');
    if (!on) { if (v) v.remove(); return; }
    if (!v) { v = document.createElement('div'); v.className = 'viz-veil'; host.appendChild(v); }
    v.innerHTML = '<span class="vv-q" aria-hidden="true">?</span><span class="vv-t">' + text + '</span>';
  }

  L.UI = { openModal, foldCard, confirmModal, closeAllModals, toast, tabsInit, renderPrediction, reflect, shuffled, labelText, announce, coefRow, miniGraph, whyBtn, icon, ICONS, bindLabViewTabs, addExplain, guide, levelPicker, celebrate, pic, veil };
})(typeof window !== 'undefined' ? window : globalThis);
