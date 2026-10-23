window.VOL = window.VOL || {};
(function (V) {
  'use strict';
  const I = V.ICON_UI;
  V.views = V.views || {};

  // ---------- Inici ----------
  V.views.inici = function (app) {
    const P = V.progress;
    const lessonsDone = V.LESSONS.filter(L => P.lessons[L.id]).length;
    const nextLesson = V.LESSONS.find(L => !P.lessons[L.id]);
    const reptesDone = V.REPTES.filter(R => P.reptes[R.id]).length;
    app.innerHTML = `
      <section class="hero">
        <div class="hero-txt">
          <h1>Quant d'espai <em>ocupa</em>?</h1>
          <p class="lead">Aprèn a calcular volums de prismes, cilindres, piràmides, cons i esferes. Gira les figures, omple-les d'aigua i descobreix d'on surten les fórmules.</p>
          <div class="hero-cta">
            <a class="btn primary big" href="#/leccio/${(nextLesson || V.LESSONS[0]).id}">${lessonsDone ? 'Continua aprenent' : 'Comença per la lliçó 1'} ${I.arrow}</a>
            <a class="btn big" href="#/explora">Explora en 3D</a>
          </div>
        </div>
        <div class="hero-stage"><div class="viewer hero-viewer"></div></div>
      </section>
      <div class="wrap">
        <div class="home-grid">
          <a class="home-card" href="#/apren" style="--c:#3b6cf6">
            <span class="hc-n">01</span><strong>Aprèn</strong>
            <small>6 lliçons amb laboratori 3D: dels cubs unitaris al secret d'Arquimedes.</small>
            <span class="bar"><i style="width:${Math.round(100 * lessonsDone / V.LESSONS.length)}%"></i></span>
            <span class="hc-meta">${lessonsDone} de ${V.LESSONS.length} fetes</span>
          </a>
          <a class="home-card" href="#/explora" style="--c:#0fa3a3">
            <span class="hc-n">02</span><strong>Explora</strong>
            <small>9 cossos manipulables. Canvia mides, mostra cubs, omple d'aigua i compara.</small>
            <span class="bar"><i style="width:${Math.round(100 * Object.keys(P.explored).length / V.SHAPE_ORDER.length)}%"></i></span>
            <span class="hc-meta">${Object.keys(P.explored).length} de ${V.SHAPE_ORDER.length} cossos explorats</span>
          </a>
          <a class="home-card" href="#/practica" style="--c:#f08a24">
            <span class="hc-n">03</span><strong>Practica</strong>
            <small>Exercicis nous cada vegada, pas a pas, amb pistes i correcció dels errors típics.</small>
            <span class="bar"><i style="width:${Math.round(100 * V.SKILLS.reduce((a, s) => a + V.mastery(s.id), 0) / V.SKILLS.length)}%"></i></span>
            <span class="hc-meta">${P.exercises} exercicis fets</span>
          </a>
          <a class="home-card" href="#/reptes" style="--c:#8b5cf6">
            <span class="hc-n">04</span><strong>Reptes</strong>
            <small>Problemes reals: el bric de llet, la piscina, el gelat, la piràmide de Kheops…</small>
            <span class="bar"><i style="width:${Math.round(100 * reptesDone / V.REPTES.length)}%"></i></span>
            <span class="hc-meta">${reptesDone} de ${V.REPTES.length} superats</span>
          </a>
        </div>
      </div>`;
    // En fila i amb un balanceig suau: cap cos no en tapa un altre
    const v = new V.Viewer(app.querySelector('.hero-viewer'), { sway: 0.32, dir: [0.32, 0.62, 1.8], zoom: 0.86, label: 'Prisma, cilindre, con i esfera' });
    v.setScene([
      { shape: 'prisma6', p: { c: 1.3, h: 3.4 }, x: -5.4 },
      { shape: 'cilindre', p: { r: 1.3, h: 3 }, x: -1.8 },
      { shape: 'con', p: { r: 1.4, h: 3.6 }, x: 1.8 },
      { shape: 'esfera', p: { r: 1.45 }, x: 5.4 }
    ], { fit: 'always' });
  };

  // ---------- Progrés ----------
  const BADGES = [
    { id: 'primer', name: 'Primer pas', desc: 'Fes el primer exercici.', ok: P => P.exercises >= 1 },
    { id: 'capes', name: 'Capa a capa', desc: 'Domina l\'habilitat «Compta cubs».', ok: () => V.mastery('cubs') >= 0.8 },
    { id: 'arquimedes', name: 'Herència d\'Arquimedes', desc: 'Domina l\'habilitat «Esferes».', ok: () => V.mastery('esfera') >= 0.8 },
    { id: 'unitats', name: 'Domini de les unitats', desc: 'Domina «Unitats i capacitat».', ok: () => V.mastery('unitats') >= 0.8 },
    { id: 'explora', name: 'Exploració 3D', desc: 'Explora els 9 cossos.', ok: P => Object.keys(P.explored).length >= V.SHAPE_ORDER.length },
    { id: 'teoria', name: 'Teoria completa', desc: 'Acaba les 6 lliçons.', ok: P => V.LESSONS.every(L => P.lessons[L.id]) },
    { id: 'farao', name: 'Escala faraònica', desc: 'Supera el repte de Kheops.', ok: P => !!P.reptes.kheops },
    { id: 'reptes', name: 'Tots els reptes', desc: 'Supera els 8 reptes.', ok: P => V.REPTES.every(R => P.reptes[R.id]) }
  ];

  V.views.progres = function (app) {
    const P = V.progress;
    app.innerHTML = `
      <div class="wrap">
        <header class="page-head"><h1>El meu progrés</h1><p class="lead">El progrés es desa en aquest navegador. Si canvies d'ordinador o de navegador, començaràs de zero.</p></header>
        <div class="stat-row">
          <div class="stat card"><b>${P.xp}</b><span>punts</span></div>
          <div class="stat card"><b>${P.exercises}</b><span>exercicis</span></div>
          <div class="stat card"><b>${V.LESSONS.filter(L => P.lessons[L.id]).length}/${V.LESSONS.length}</b><span>lliçons</span></div>
          <div class="stat card"><b>${V.REPTES.filter(R => P.reptes[R.id]).length}/${V.REPTES.length}</b><span>reptes</span></div>
        </div>
        <section class="card">
          <h2>Domini per habilitat</h2>
          <ul class="mastery">
            ${V.SKILLS.map(s => {
              const m = V.mastery(s.id), n = (P.skills[s.id] || {}).n || 0;
              return `<li style="--c:${s.color}"><span class="skill-ic sm">${V.ICONS[s.icon]}</span><span class="m-name">${s.name}<small>${n} exercicis</small></span><span class="bar"><i style="width:${Math.round(m * 100)}%"></i></span>${V.starsHtml(V.stars(m))}<a class="btn small" href="#/exercici/${s.id}">Practica</a></li>`;
            }).join('')}
          </ul>
        </section>
        <section class="card">
          <h2>Insígnies</h2>
          <div class="badges">
            ${BADGES.map(b => { const ok = b.ok(P); return `<div class="badge ${ok ? 'on' : ''}"><span class="medal">${ok ? I.check : '?'}</span><strong>${b.name}</strong><small>${b.desc}</small></div>`; }).join('')}
          </div>
        </section>
        <div class="reset-row"><button type="button" class="btn small ghost" id="reset">Esborra el meu progrés</button></div>
      </div>`;
    const rb = app.querySelector('#reset');
    let armed = false;
    rb.addEventListener('click', () => {
      if (!armed) { armed = true; rb.textContent = 'Segur? Torna a fer clic per esborrar-ho tot'; rb.classList.add('danger'); return; }
      V.resetProgress();
      V.views.progres(app);
    });
  };

  // ---------- Xuleta de fórmules ----------
  const GLOSS = [
    ['volum', 'volumen', 'volume', 'حجم', '体积', 'حجم'],
    ['capacitat', 'capacidad', 'capacity', 'سعة', '容积', 'گنجائش'],
    ['àrea', 'área', 'area', 'مساحة', '面积', 'رقبہ'],
    ['base', 'base', 'base', 'قاعدة', '底面', 'قاعدہ'],
    ['altura', 'altura', 'height', 'ارتفاع', '高', 'اونچائی'],
    ['aresta', 'arista', 'edge', 'حافة', '棱', 'کنارہ'],
    ['radi', 'radio', 'radius', 'نصف القطر', '半径', 'نصف قطر'],
    ['diàmetre', 'diámetro', 'diameter', 'قطر', '直径', 'قطر'],
    ['cub', 'cubo', 'cube', 'مكعب', '立方体', 'مکعب'],
    ['prisma', 'prisma', 'prism', 'منشور', '棱柱', 'منشور'],
    ['cilindre', 'cilindro', 'cylinder', 'أسطوانة', '圆柱', 'سلنڈر'],
    ['piràmide', 'pirámide', 'pyramid', 'هرم', '棱锥', 'ہرم'],
    ['con', 'cono', 'cone', 'مخروط', '圆锥', 'مخروط'],
    ['esfera', 'esfera', 'sphere', 'كرة', '球', 'کرہ'],
    ['litre', 'litro', 'litre', 'لتر', '升', 'لیٹر']
  ];

  function buildXuleta() {
    const d = document.getElementById('xuleta');
    d.innerHTML = `
      <div class="drawer-inner" role="dialog" aria-modal="true" aria-labelledby="xul-t">
        <div class="drawer-head"><h2 id="xul-t">Fórmules</h2><button type="button" class="icon-btn" id="xul-close" aria-label="Tanca">✕</button></div>
        <ul class="formula-list">
          ${V.SHAPE_ORDER.map(id => { const S = V.SHAPES[id]; return `<li style="--c:${S.color}"><span class="skill-ic sm">${V.ICONS[id]}</span><span>${S.name}</span><b>${S.formula}</b></li>`; }).join('')}
        </ul>
        <h3>Unitats</h3>
        ${V.ladderHtml()}
        <h3>Glossari</h3>
        <div class="gloss-wrap"><table class="gloss">
          <thead><tr><th>Català</th><th>Castellano</th><th>English</th><th lang="ar">العربية</th><th lang="zh">中文</th><th lang="ur">اردو</th></tr></thead>
          <tbody>${GLOSS.map(r => `<tr>${r.map((w, i) => `<td${i >= 3 ? ` lang="${['ar', 'zh', 'ur'][i - 3]}"` : ''}>${w}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
      </div>`;
    d.addEventListener('click', e => { if (e.target === d) toggleX(false); });
    d.querySelector('#xul-close').addEventListener('click', () => toggleX(false));
  }
  function toggleX(on) {
    const d = document.getElementById('xuleta');
    d.hidden = !on;
    document.body.classList.toggle('no-scroll', on);
    if (on) d.querySelector('#xul-close').focus();
  }

  // ---------- Enrutador ----------
  const ROUTES = { '': 'inici', apren: 'apren', leccio: 'leccio', explora: 'explora', practica: 'practica', exercici: 'exercici', reptes: 'reptes', repte: 'repte', progres: 'progres' };
  const NAV = { leccio: 'apren', exercici: 'practica', reptes: 'practica', repte: 'practica' };

  function route() {
    const [r, arg] = location.hash.replace(/^#\/?/, '').split('/');
    const name = ROUTES[r] || 'inici';
    V.disposeViewers();
    toggleX(false);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = 'view-' + name;
    V.views[name](app, arg);
    const active = NAV[name] || name;
    document.querySelectorAll('.mainnav a').forEach(a => a.classList.toggle('on', a.dataset.route === active));
    document.getElementById('btn-progres').classList.toggle('on', name === 'progres');
    window.scrollTo(0, 0);
  }

  function start() {
    V.loadProgress();
    buildXuleta();
    document.getElementById('btn-xuleta').addEventListener('click', () => toggleX(true));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleX(false); });
    window.addEventListener('hashchange', route);
    // Colors de variables i unitats: s'apliquen a tot el que es pinta, també als canvis en directe
    let pending = false;
    const polish = () => { pending = false; V.polish(document.getElementById('app')); };
    new MutationObserver(() => { if (!pending) { pending = true; requestAnimationFrame(polish); } })
      .observe(document.getElementById('app'), { childList: true, subtree: true });
    route();
    V.polish(document.getElementById('xuleta'));
  }

  if (typeof THREE === 'undefined') {
    document.getElementById('app').innerHTML = '<div class="wrap"><div class="card"><h2>No s\'ha pogut carregar el motor 3D</h2><p>Comprova la connexió a internet i torna a carregar la pàgina.</p></div></div>';
    return;
  }
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]).then(start);
})(window.VOL);
