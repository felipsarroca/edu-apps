window.VOL = window.VOL || {};
(function (V) {
  'use strict';
  const f = V.fmt, S = V.SHAPES;
  V.views = V.views || {};

  const TO_L = { mm: 1e-6, cm: 1e-3, dm: 1, m: 1000 };
  const IDEAS = {
    cub: ['Dobla l\'aresta. El volum es fa el doble? Desa una referència i comprova-ho.', 'Quina aresta ha de tenir un cub perquè hi càpiga 1 litre?'],
    ortoedre: ['Intercanvia la llargada i l\'altura. Canvia el volum?', 'Busca dos ortoedres diferents amb un volum de 24 cm³.'],
    prisma3: ['Dobla la base del triangle. Què passa amb el volum?', 'Què canvia si dobles l\'altura del prisma?'],
    prisma6: ['Dobla el costat de la base. Per quant es multiplica el volum?', 'Compara\'l amb un cilindre de radi igual al costat.'],
    cilindre: ['Dobla el radi. El volum es multiplica per 2, per 4 o per 8?', 'Dobla l\'altura. Què passa ara?'],
    piramide: ['Compara aquesta piràmide amb un cub de la mateixa base i altura.', 'Dobla l\'altura i observa el volum.'],
    con: ['Omple el con fins a la meitat de l\'altura. Quin percentatge del volum hi ha?', 'Dobla el radi. Per quant es multiplica el volum?'],
    esfera: ['Dobla el radi. El volum es multiplica per 8. Per què?', 'Omple l\'esfera fins a la meitat de l\'altura. Quina part del volum és?'],
    semiesfera: ['Compara-la amb un con del mateix radi i altura r.', 'Quina fracció de l\'esfera sencera és?']
  };

  V.views.explora = function (app) {
    const st = { shape: 'cilindre', p: {}, unit: 'cm', dims: true, cubes: false, water: false, fill: 0.5, ref: null };
    const defaults = id => { const p = {}; S[id].params.forEach(q => { p[q.k] = q.def; }); return p; };
    st.p = defaults(st.shape);

    app.innerHTML = `
      <div class="explore">
        <aside class="ex-panel card">
          <h2 class="panel-title">Tria un cos</h2>
          <div class="shape-grid">
            ${V.SHAPE_ORDER.map(id => `<button type="button" class="shape-btn" data-id="${id}" style="--c:${S[id].color}" aria-pressed="false">${V.ICONS[id]}<span>${S[id].name}</span></button>`).join('')}
          </div>
          <h2 class="panel-title">Mesures</h2>
          <div class="sliders"></div>
          <div class="unit-row"><span>Unitat</span><div class="unit-seg"></div></div>
          <h2 class="panel-title">Mostra</h2>
          <div class="toggles"></div>
          <div class="fill-ctl"></div>
        </aside>
        <div class="stage card">
          <div class="viewer stage-viewer"></div>
          <p class="viewer-hint">Arrossega per girar · Pessiga o fes servir la roda per apropar · Cada quadre del terra fa 1 ${'<span class="u">cm</span>'}</p>
        </div>
        <aside class="formula-panel card">
          <span class="chip shape-chip"></span>
          <div class="big-formula"></div>
          <ol class="calc"></ol>
          <div class="result"></div>
          <div class="water-ro" aria-live="polite"></div>
          <div class="compare"></div>
          <div class="ideas"><h3>Investiga</h3><ul></ul></div>
        </aside>
      </div>`;

    const $ = s => app.querySelector(s);
    const viewer = new V.Viewer($('.stage-viewer'), { zoom: 1.45 });
    const toggles = $('.toggles');

    const tDims = V.ui.toggle({ label: 'Cotes', value: st.dims, onChange: v => { st.dims = v; render(); } });
    const tCubes = V.ui.toggle({ label: 'Cubs unitaris', value: st.cubes, onChange: v => { st.cubes = v; if (v) { st.water = false; tWater.set(false); } render(); } });
    const tWater = V.ui.toggle({ label: 'Omple d\'aigua', value: st.water, onChange: v => { st.water = v; if (v) { st.cubes = false; tCubes.set(false); } render(); } });
    toggles.append(tDims, tCubes, tWater);
    const fillSlider = V.ui.slider({ label: 'Altura de l\'aigua', min: 0, max: 100, step: 1, value: 50, unit: '%', onInput: v => { st.fill = v / 100; viewer.setFill(0, st.fill); waterInfo(); } });
    $('.fill-ctl').appendChild(fillSlider);

    $('.unit-seg').appendChild(V.ui.seg({
      label: 'Unitat de longitud', value: st.unit,
      options: ['mm', 'cm', 'dm', 'm'].map(u => ({ v: u, label: u })),
      onChange: u => { st.unit = u; sliders.forEach(s => s.setUnit(u)); app.querySelector('.viewer-hint .u').textContent = u; render(); }
    }));

    let sliders = [];
    function buildSliders() {
      const box = $('.sliders');
      box.innerHTML = '';
      sliders = S[st.shape].params.map(q => {
        const s = V.ui.slider({ label: q.label, min: q.min, max: q.max, step: q.step, value: st.p[q.k], unit: st.unit, onInput: v => { st.p[q.k] = v; render(); } });
        box.appendChild(s);
        return s;
      });
    }

    function selectShape(id) {
      st.shape = id;
      st.p = defaults(id);
      st.ref = null;
      V.progress.explored[id] = true; V.saveProgress();
      app.querySelectorAll('.shape-btn').forEach(b => { const on = b.dataset.id === id; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      const canCubes = !!S[id].cubes;
      tCubes.hidden = !canCubes;
      if (!canCubes) { st.cubes = false; tCubes.set(false); }
      buildSliders();
      render('always');
    }

    function waterInfo() {
      const box = $('.water-ro');
      if (!st.water) { box.innerHTML = ''; return; }
      const Sh = S[st.shape], H = Sh.H(st.p), vol = Sh.upTo(st.p, st.fill * H), tot = Sh.V(st.p), u = st.unit;
      box.innerHTML = `<div class="water-box"><b>Aigua</b><span>${f(vol)} ${u}³ = ${f(vol * TO_L[u], 3)} L</span><span>${f(100 * vol / tot, 1)} % del volum total</span><i style="width:${(100 * vol / tot).toFixed(1)}%"></i></div>`;
    }

    function render(fit) {
      const Sh = S[st.shape], p = st.p, u = st.unit;
      const spec = { shape: st.shape, p: Object.assign({}, p), dims: st.dims, unit: u, cubes: st.cubes && Sh.cubes, water: st.water };
      viewer.setScene([spec], { fit: fit || 'auto' });
      if (st.water) viewer.setFill(0, st.fill);
      fillSlider.hidden = !st.water;

      const chip = $('.shape-chip');
      chip.textContent = Sh.name; chip.style.setProperty('--c', Sh.color);
      $('.big-formula').innerHTML = Sh.formula;
      $('.calc').innerHTML = Sh.steps(p, u).map(s => `<li><span>${s.t}</span><div>${s.m}</div></li>`).join('');
      const vol = Sh.V(p);
      $('.result').innerHTML = `<span>Volum</span><b>${f(vol)} ${u}³</b><small>Capacitat: ${f(vol * TO_L[u], 3)} L</small>`;
      waterInfo();

      const cmp = $('.compare');
      cmp.innerHTML = '';
      if (st.ref && st.ref.shape === st.shape) {
        const ratio = vol / st.ref.V;
        cmp.innerHTML = `<div class="cmp-box"><span>Referència: ${f(st.ref.V)} ${u}³</span><b>Ara: × ${f(ratio, 2)}</b><small>${ratio > 1.001 ? 'El volum actual és ' + f(ratio, 2) + ' vegades el de referència.' : ratio < 0.999 ? 'El volum actual és ' + f(1 / ratio, 2) + ' vegades més petit.' : 'Mateix volum que la referència.'}</small></div>`;
      }
      cmp.appendChild(V.ui.button(st.ref ? 'Desa una nova referència' : 'Desa com a referència', () => { st.ref = { shape: st.shape, V: vol }; render('never'); }, 'small'));
      $('.ideas ul').innerHTML = (IDEAS[st.shape] || []).map(t => `<li>${t}</li>`).join('');
    }

    app.querySelectorAll('.shape-btn').forEach(b => b.addEventListener('click', () => selectShape(b.dataset.id)));
    selectShape(st.shape);
  };
})(window.VOL);
