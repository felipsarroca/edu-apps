window.VOL = window.VOL || {};
(function (V) {
  'use strict';
  const f = V.fmt, I = V.ICON_UI, PI = Math.PI;
  V.views = V.views || {};

  const ro = rows => `<div class="ro-grid">${rows.map(([k, v, cls]) => `<div class="${cls || ''}"><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;

  V.LESSONS = [
    {
      id: 'que-es', title: 'Què és el volum?', short: 'Cubs unitaris i capes', icon: 'cub', color: '#3b6cf6',
      goals: ['Entendre què mesura el volum.', 'Calcular-lo comptant cubs unitaris.', 'Descobrir per què V = a · b · c.'],
      sections: [
        { h: 'L\'espai que ocupa un cos', html: '<p>El <b>volum</b> és la quantitat d\'espai que ocupa un cos. Per mesurar-lo fem servir una unitat que també ocupa espai: el <b>cub unitari</b>, un cub d\'1 cm d\'aresta.</p><p>El volum d\'aquest cub és <b>1 cm³</b> (es llegeix «un centímetre cúbic»).</p>' },
        { h: 'Comptar per capes', html: '<p>Comptar els cubs un per un és lent. És molt més ràpid comptar per <b>capes</b>:</p><ol class="nice"><li>Compta els cubs d\'una capa: <b>llargada × amplada</b>.</li><li>Compta quantes capes hi ha: és l\'<b>altura</b>.</li><li>Multiplica-ho.</li></ol><p>Prova-ho al laboratori: canvia les mides i prem <i>Construeix capa a capa</i>.</p>' }
      ],
      key: '<p>Volum = cubs per capa × nombre de capes</p><p class="key-f">V = A<sub>b</sub> · h = a · b · c</p><p>Aquesta idea (base × altura) serveix per a molts altres cossos.</p>',
      check: { text: 'Una capsa fa <b>5 cm</b> de llarg, <b>2 cm</b> d\'ample i <b>3 cm</b> d\'alt. Quants cubs d\'1 cm³ hi caben?', answer: 30, unit: 'cm³', hints: ['Cubs per capa: 5 · 2. Capes: 3.'], distractors: [{ v: 10, msg: 'Aquesta és només una capa. Falta multiplicar per les 3 capes.' }, { v: 10 + 3, msg: 'Cal multiplicar, no sumar.' }], solution: [{ t: 'Càlcul', m: '5 · 2 · 3 = <b>30 cm³</b>' }] },
      setup({ viewer, controls, readout }) {
        const p = { a: 4, b: 3, c: 2 };
        let stop = null;
        const show = (n) => {
          const layer = p.a * p.b, tot = layer * p.c;
          const capa = n == null ? p.c : Math.min(p.c, Math.ceil(n / layer));
          readout.innerHTML = ro([
            ['Cubs per capa', `${p.a} · ${p.b} = ${layer}`],
            ['Capes', n == null ? `${p.c}` : `${capa} de ${p.c}`],
            ['Volum', n == null ? `${layer} · ${p.c} = ${tot} cm³` : `${n} cubs`, 'ro-total']
          ]);
        };
        const draw = () => { if (stop) stop(); viewer.setScene([{ shape: 'ortoedre', p: Object.assign({}, p), cubes: true }], { fit: 'auto' }); show(); };
        [['a', 'Llargada (a)'], ['b', 'Amplada (b)'], ['c', 'Altura (c)']].forEach(([k, label]) => {
          controls.appendChild(V.ui.slider({ label, min: 1, max: 6, step: 1, value: p[k], unit: 'cm', onInput: v => { p[k] = v; draw(); } }));
        });
        controls.appendChild(V.ui.button('Construeix capa a capa', () => {
          if (stop) stop();
          const tot = p.a * p.b * p.c;
          viewer.setCubes(0, 0);
          stop = V.tween(Math.min(7000, p.c * 1100), (e, t) => { const n = Math.round(t * tot); viewer.setCubes(0, n); show(n); }, () => { stop = null; show(); });
        }, 'primary'));
        draw();
      }
    },
    {
      id: 'unitats', title: 'Unitats de volum i capacitat', short: 'm³, dm³, cm³ i litres', icon: 'unitats', color: '#e0457b',
      goals: ['Relacionar cm³, dm³ i m³.', 'Saber que 1 dm³ = 1 L.', 'Convertir unitats amb l\'escala × 1000.'],
      sections: [
        { h: 'De cm³ a dm³', html: '<p>Un cub d\'1 dm d\'aresta fa 10 cm de costat. A dins hi caben 10 · 10 · 10 = <b>1000 cubs d\'1 cm³</b>.</p><p class="key-f">1 dm³ = 1000 cm³</p>' },
        { h: 'L\'escala de les unitats de volum', html: V.ladderHtml() + '<p>Cada graó multiplica o divideix per <b>1000</b> (no per 10, com a les longituds), perquè el volum té tres dimensions: 10 · 10 · 10 = 1000.</p>' },
        { h: 'Volum i capacitat', html: '<p>La <b>capacitat</b> és el que pot contenir un recipient. Es mesura en litres. Si omples d\'aigua el cub d\'1 dm³, hi caben exactament <b>1 litre</b>.</p><table class="eq"><tr><td>1 m³</td><td>=</td><td>1000 L</td></tr><tr><td>1 dm³</td><td>=</td><td>1 L</td></tr><tr><td>1 cm³</td><td>=</td><td>1 mL</td></tr></table>' }
      ],
      key: '<p class="key-f">1 dm³ = 1000 cm³ = 1 L</p><p>Per baixar un graó a l\'escala de volum, multiplica per 1000. Per pujar-lo, divideix per 1000.</p>',
      check: { text: 'Quants cm³ són <b>3,5 dm³</b>?', answer: 3500, unit: 'cm³', hints: ['1 dm³ = 1000 cm³'], distractors: [{ v: 35, msg: 'Entre unitats de volum, el factor és 1000, no 10.' }, { v: 350, msg: 'Entre unitats de volum, el factor és 1000, no 100.' }], solution: [{ t: 'Càlcul', m: '3,5 · 1000 = <b>3500 cm³</b>' }] },
      setup({ viewer, controls, readout }) {
        let mode = 'cubs', stop = null, fill = 0.6;
        const draw = () => {
          if (stop) { stop(); stop = null; }
          if (mode === 'cubs') {
            viewer.setScene([{ shape: 'cub', p: { a: 10 }, cubes: true, dims: true, unit: 'cm' }], { fit: 'always' });
            readout.innerHTML = ro([['Cubs', '10 · 10 · 10'], ['Volum', '1000 cm³ = 1 dm³', 'ro-total']]);
          } else {
            viewer.setScene([{ shape: 'cub', p: { a: 10 }, water: true, dims: true, unit: 'cm' }], { fit: 'always' });
            setFill(fill);
          }
          fillCtl.hidden = mode !== 'aigua';
          buildBtn.hidden = mode !== 'cubs';
        };
        const setFill = v => {
          fill = v;
          viewer.setFill(0, v);
          const cm3 = 1000 * v;
          readout.innerHTML = ro([['Aigua', `${f(cm3, 0)} cm³`], ['Capacitat', `${f(cm3, 0)} mL`], ['En litres', `${f(cm3 / 1000, 3)} L`, 'ro-total']]);
        };
        controls.appendChild(V.ui.seg({ value: mode, options: [{ v: 'cubs', label: 'Cubs d\'1 cm³' }, { v: 'aigua', label: 'Omple d\'aigua' }], onChange: v => { mode = v; draw(); } }));
        const buildBtn = V.ui.button('Construeix el decímetre cúbic', () => {
          if (stop) stop();
          viewer.setCubes(0, 0);
          stop = V.tween(5000, (e, t) => { const n = Math.round(t * 1000); viewer.setCubes(0, n); readout.innerHTML = ro([['Cubs', `${n}`], ['Capes', `${Math.ceil(n / 100)} de 10`], ['Volum', `${n} cm³`, 'ro-total']]); }, () => { stop = null; draw(); });
        }, 'primary');
        const fillCtl = V.ui.slider({ label: 'Nivell de l\'aigua', min: 0, max: 100, step: 1, value: 60, unit: '%', onInput: v => setFill(v / 100) });
        controls.append(buildBtn, fillCtl);
        draw();
      }
    },
    {
      id: 'prismes', title: 'Prismes i cilindres', short: 'Una pila de llesques: V = Ab · h', icon: 'prisma6', color: '#0fa3a3',
      goals: ['Entendre per què V = A<sub>b</sub> · h.', 'Aplicar-ho a qualsevol prisma i al cilindre.', 'Conèixer el principi de Cavalieri.'],
      sections: [
        { h: 'Una pila de llesques', html: '<p>Imagina un cos format per llesques iguals apilades, com una pila de monedes o de fulls. Cada llesca d\'1 cm de gruix té un volum igual a l\'<b>àrea de la base</b>.</p><p>Si n\'apilem <b>h</b>, el volum és <b>A<sub>b</sub> · h</b>.</p>' },
        { h: 'Funciona amb tots els prismes i amb el cilindre', html: '<table class="eq wide"><tr><th>Cos</th><th>Àrea de la base</th></tr><tr><td>Prisma rectangular</td><td>a · b</td></tr><tr><td>Prisma triangular</td><td>(b · t) / 2</td></tr><tr><td>Prisma regular</td><td>(P · ap) / 2</td></tr><tr><td>Cilindre</td><td>π · r²</td></tr></table>' },
        { h: 'El principi de Cavalieri', html: '<p>Si inclines la pila de monedes, el volum no canvia: les llesques són les mateixes. Ho va formular el matemàtic italià <b>Bonaventura Cavalieri</b> el 1635. Activa <i>Inclina la pila</i> per veure-ho.</p>' }
      ],
      key: '<p class="key-f">V = A<sub>b</sub> · h</p><p>Cilindre: <b>V = π · r² · h</b></p>',
      check: { text: 'Un cilindre té un radi de <b>3 cm</b> i una altura de <b>5 cm</b>. Quin és el volum?', answer: PI * 45, unit: 'cm³', hints: ['A<sub>b</sub> = π · 3² ≈ 28,27 cm²', 'V = A<sub>b</sub> · 5'], distractors: [{ v: 2 * PI * 3 * 5, msg: 'Això és l\'àrea lateral (2 · π · r · h).' }, { v: PI * 9, msg: 'Aquesta és l\'àrea de la base. Falta multiplicar per l\'altura.' }, { v: PI * 15, msg: 'No has elevat el radi al quadrat: r² = 3 · 3.' }], solution: [{ t: 'Base', m: 'π · 3² ≈ 28,27 cm²' }, { t: 'Volum', m: '28,27 · 5 ≈ <b>141,37 cm³</b>' }] },
      setup({ viewer, controls, readout }) {
        const G = V.geo;
        const BASES = {
          quadrat: { label: 'Quadrat', shape: () => G.rect(3, 3), A: 9, color: '#3b6cf6', f: '3 · 3' },
          triangle: { label: 'Triangle', shape: () => G.poly(G.triPts(4, 3)), A: 6, color: '#5b7cfa', f: '(4 · 3) / 2' },
          hexagon: { label: 'Hexàgon', shape: () => G.poly(G.hexPts(2)), A: 6 * 2 * Math.sqrt(3), color: '#2f8fe0', f: '(12 · 1,73) / 2' },
          cercle: { label: 'Cercle', shape: () => G.circle(1.8), A: PI * 1.8 * 1.8, color: '#0fa3a3', f: 'π · 1,8²' }
        };
        const st = { base: 'cercle', n: 5, sep: true, tilt: false };
        const draw = (fit) => {
          viewer.setScene([]);
          const B = BASES[st.base];
          const geom = G.prism(B.shape(), 0.92);
          for (let i = 0; i < st.n; i++) {
            const col = new THREE.Color(B.color).offsetHSL(0, 0, i % 2 ? 0.08 : 0);
            const m = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 }));
            const y = i * (st.sep ? 1.25 : 1), x = st.tilt ? i * 0.45 : 0;
            m.position.set(x, y, 0);
            const l = V.thickEdges(geom, V.shade(B.color, -0.3), 0.025);
            l.position.copy(m.position);
            viewer.add(m); viewer.root.add(l);
          }
          viewer.finish(fit || 'auto');
          readout.innerHTML = ro([
            ['Àrea de la base', `${B.f} ≈ ${f(B.A)} cm²`],
            ['Llesques d\'1 cm', `${st.n}`],
            ['Volum', `${f(B.A)} · ${st.n} ≈ ${f(B.A * st.n)} cm³`, 'ro-total']
          ]) + (st.tilt ? '<p class="ro-note">Inclinada o recta, el volum és el mateix.</p>' : '');
        };
        controls.appendChild(V.ui.seg({ label: 'Forma de la base', value: st.base, options: Object.keys(BASES).map(k => ({ v: k, label: BASES[k].label })), onChange: v => { st.base = v; draw('always'); } }));
        controls.appendChild(V.ui.slider({ label: 'Nombre de llesques (h)', min: 1, max: 9, step: 1, value: st.n, unit: '', onInput: v => { st.n = v; draw(); } }));
        controls.appendChild(V.ui.toggle({ label: 'Separa les llesques', value: st.sep, onChange: v => { st.sep = v; draw(); } }));
        controls.appendChild(V.ui.toggle({ label: 'Inclina la pila (Cavalieri)', value: st.tilt, onChange: v => { st.tilt = v; draw(); } }));
        draw('always');
      }
    },
    {
      id: 'tercera', title: 'Piràmides i cons: la tercera part', short: 'L\'experiment d\'abocar', icon: 'con', color: '#f08a24',
      goals: ['Descobrir amb un experiment per què es divideix per 3.', 'Calcular el volum de piràmides i cons.'],
      sections: [
        { h: 'Un experiment', html: '<p>Agafa un con i un cilindre amb <b>la mateixa base</b> i <b>la mateixa altura</b>. Omple el con d\'aigua i aboca\'l dins del cilindre.</p><p>Quantes vegades cal fer-ho per omplir el cilindre? Fes una predicció i prem <i>Aboca el con</i>.</p>' },
        { h: 'Resultat', html: '<p>Calen exactament <b>3 cons</b>. El con té la tercera part del volum del cilindre.</p><p>El mateix passa amb una piràmide i el prisma que té la mateixa base i la mateixa altura.</p>' }
      ],
      key: '<p class="key-f">V = (A<sub>b</sub> · h) / 3</p><p>Con: <b>V = (π · r² · h) / 3</b> · Piràmide quadrada: <b>V = (l² · h) / 3</b></p>',
      check: { text: 'Un con té un radi de <b>3 cm</b> i una altura de <b>4 cm</b>. Quin és el volum?', answer: PI * 9 * 4 / 3, unit: 'cm³', hints: ['A<sub>b</sub> = π · 3²', 'V = (A<sub>b</sub> · 4) / 3'], distractors: [{ v: PI * 36, msg: 'Has oblidat dividir per 3.' }], solution: [{ t: 'Base', m: 'π · 3² ≈ 28,27 cm²' }, { t: 'Volum', m: '(28,27 · 4) / 3 ≈ <b>37,70 cm³</b>' }] },
      setup({ viewer, controls, readout }) {
        let mode = 'con', n = 0, busy = false;
        const draw = () => {
          n = 0;
          const sc = mode === 'con'
            ? [{ shape: 'con', p: { r: 2, h: 5 }, flip: true, water: true, x: -3.2 }, { shape: 'cilindre', p: { r: 2, h: 5 }, water: true, x: 3.2 }]
            : [{ shape: 'piramide', p: { l: 3.6, h: 5 }, flip: true, water: true, x: -3.2 }, { shape: 'ortoedre', p: { a: 3.6, b: 3.6, c: 5 }, water: true, x: 3.2 }];
          viewer.setScene(sc, { fit: 'always' });
          viewer.setFill(0, 1); viewer.setFill(1, 0);
          info();
        };
        const big = () => mode === 'con' ? 'cilindre' : 'prisma';
        const info = () => {
          readout.innerHTML = ro([
            [`${mode === 'con' ? 'Cons' : 'Piràmides'} abocats`, `${n} de 3`],
            [`Ple del ${big()}`, n === 0 ? '0' : n === 3 ? 'ple!' : `${n}/3`, n === 3 ? 'ro-total' : '']
          ]) + (n === 3 ? `<p class="ro-note">Calen 3 ${mode === 'con' ? 'cons' : 'piràmides'}: V = V<sub>${big()}</sub> / 3</p>` : '');
        };
        const pour = () => {
          if (busy) return;
          if (n >= 3) { draw(); return; }
          busy = true;
          V.tween(1500, (e) => {
            // El cos invertit es buida: volum restant (1 - e) → altura = H · ∛(1 - e)
            viewer.setFill(0, Math.cbrt(1 - e));
            viewer.setFill(1, (n + e) / 3);
          }, () => {
            n++;
            info();
            if (n < 3) V.tween(500, e => viewer.setFill(0, Math.cbrt(e)), () => { busy = false; });
            else busy = false;
          });
        };
        controls.appendChild(V.ui.seg({ value: mode, options: [{ v: 'con', label: 'Con i cilindre' }, { v: 'piramide', label: 'Piràmide i prisma' }], onChange: v => { if (!busy) { mode = v; draw(); } } }));
        controls.appendChild(V.ui.button('Aboca', pour, 'primary'));
        controls.appendChild(V.ui.button('Torna a començar', () => { if (!busy) draw(); }));
        draw();
      }
    },
    {
      id: 'esfera', title: 'L\'esfera i el secret d\'Arquimedes', short: 'L\'esfera és 2/3 del cilindre', icon: 'esfera', color: '#8b5cf6',
      goals: ['Conèixer el descobriment d\'Arquimedes.', 'Entendre d\'on surt V = (4/3) · π · r³.'],
      sections: [
        { h: 'Arquimedes de Siracusa', html: '<p>Arquimedes (segle III aC) va demostrar que una esfera ocupa exactament <b>2/3</b> del cilindre on encaixa: el que té el mateix radi i una altura igual al diàmetre.</p><p>Li agradava tant aquest descobriment que va demanar que el gravessin a la seva tomba. Segons Ciceró, que la va trobar l\'any 75 aC, la tomba encara mostrava una esfera dins d\'un cilindre.</p>' },
        { h: 'D\'on surt la fórmula', html: '<p>El cilindre té radi r i altura 2r:</p><p class="key-f">V<sub>cilindre</sub> = π · r² · 2r = 2 · π · r³</p><p>L\'esfera en té 2/3:</p><p class="key-f">V<sub>esfera</sub> = (2/3) · 2 · π · r³ = (4/3) · π · r³</p>' }
      ],
      key: '<p class="key-f">V = (4/3) · π · r³</p><p>Semiesfera: <b>V = (2/3) · π · r³</b></p>',
      check: { text: 'Una esfera té un radi de <b>4 cm</b>. Quin és el volum?', answer: 4 / 3 * PI * 64, unit: 'cm³', hints: ['r³ = 4 · 4 · 4 = 64', 'V = (4/3) · π · 64'], distractors: [{ v: 4 * PI * 16, msg: 'Això és l\'àrea de la superfície (4 · π · r²).' }, { v: 4 / 3 * PI * 16, msg: 'Per al volum cal r³, no r².' }, { v: PI * 64, msg: 'Falta multiplicar per 4/3.' }], solution: [{ t: 'r³', m: '4³ = 64 cm³' }, { t: 'Volum', m: '(4/3) · π · 64 ≈ <b>268,08 cm³</b>' }] },
      setup({ viewer, controls, readout }) {
        let r = 2, cyl = true;
        const draw = (fit) => {
          const sc = [{ shape: 'esfera', p: { r }, dims: true, unit: 'cm' }];
          if (cyl) sc.push({ shape: 'cilindre', p: { r: r * 1.003, h: 2 * r }, opacity: 0.16, color: '#0fa3a3' });
          viewer.setScene(sc, { fit: fit || 'auto' });
          const ve = 4 / 3 * PI * r * r * r, vc = 2 * PI * r * r * r;
          readout.innerHTML = ro([['Volum de l\'esfera', `${f(ve)} cm³`], ['Volum del cilindre', `${f(vc)} cm³`], ['Esfera / cilindre', `${f(ve / vc, 3)} = 2/3`, 'ro-total']]);
        };
        controls.appendChild(V.ui.slider({ label: 'Radi (r)', min: 1, max: 5, step: 0.5, value: r, unit: 'cm', onInput: v => { r = v; draw(); } }));
        controls.appendChild(V.ui.toggle({ label: 'Mostra el cilindre', value: cyl, onChange: v => { cyl = v; draw(); } }));
        draw('always');
      }
    },
    {
      id: 'compostos', title: 'Cossos compostos', short: 'Descompon, calcula i suma', icon: 'barreja', color: '#1f9d6b',
      goals: ['Descompondre un objecte en cossos simples.', 'Sumar o restar volums.'],
      sections: [
        { h: 'Divideix i venceràs', html: '<p>Molts objectes reals combinen cossos simples: un gelat (con + semiesfera), un dipòsit (cilindre + semiesfera), una casa (prisma + piràmide).</p><ol class="nice"><li>Identifica les parts.</li><li>Calcula el volum de cada part.</li><li>Suma\'ls.</li></ol>' },
        { h: 'I si hi ha un forat?', html: '<p>Si un cos té un forat, <b>resta</b> el volum del forat. Per exemple, un tub és un cilindre gran menys un cilindre petit:</p><p class="key-f">V<sub>tub</sub> = V<sub>gran</sub> − V<sub>petit</sub></p>' }
      ],
      key: '<p class="key-f">V<sub>total</sub> = V<sub>1</sub> + V<sub>2</sub> + …</p><p>Si hi ha forats, es resten.</p>',
      check: { text: 'Un gelat té un con de radi <b>3 cm</b> i altura <b>10 cm</b>, i a sobre una semiesfera de radi <b>3 cm</b>. Quin és el volum total?', answer: PI * 9 * 10 / 3 + 2 / 3 * PI * 27, unit: 'cm³', hints: ['Con: (π · 3² · 10) / 3', 'Semiesfera: (2/3) · π · 3³'], distractors: [{ v: PI * 9 * 10 / 3, msg: 'Només has calculat el con. Falta sumar la semiesfera.' }, { v: PI * 90 + 2 / 3 * PI * 27, msg: 'El volum del con es divideix per 3.' }], solution: [{ t: 'Con', m: '(π · 9 · 10) / 3 ≈ 94,25 cm³' }, { t: 'Semiesfera', m: '(2/3) · π · 27 ≈ 56,55 cm³' }, { t: 'Total', m: '<b>≈ 150,8 cm³</b>' }] },
      setup({ viewer, controls, readout }) {
        const MODELS = {
          gelat: { label: 'Gelat', parts: [{ shape: 'con', p: { r: 3, h: 10 }, flip: true, color: '#d9a15b', n: 'Con' }, { shape: 'semiesfera', p: { r: 3 }, y: 10, color: '#f59ac0', n: 'Semiesfera' }] },
          diposit: { label: 'Dipòsit', parts: [{ shape: 'cilindre', p: { r: 2, h: 5 }, color: '#8fa6c4', n: 'Cilindre' }, { shape: 'semiesfera', p: { r: 2 }, y: 5, color: '#8fa6c4', n: 'Semiesfera' }] },
          casa: { label: 'Casa', parts: [{ shape: 'ortoedre', p: { a: 5, b: 5, c: 4 }, color: '#f2e3c6', n: 'Prisma' }, { shape: 'piramide', p: { l: 5, h: 3 }, y: 4, color: '#d9534f', n: 'Piràmide' }] }
        };
        let model = 'gelat', sep = false, stop = null;
        const draw = () => {
          if (stop) stop();
          const M = MODELS[model];
          viewer.setScene(M.parts.map(pt => Object.assign({ dims: true, unit: 'cm' }, pt)), { fit: 'always' });
          if (sep) viewer.items[1].group.position.y += 2.5;
          const vols = M.parts.map(pt => V.SHAPES[pt.shape].V(pt.p));
          readout.innerHTML = ro(M.parts.map((pt, i) => [pt.n, `${f(vols[i])} cm³`]).concat([['Total', `${f(vols[0])} + ${f(vols[1])} = ${f(vols[0] + vols[1])} cm³`, 'ro-total']]));
        };
        controls.appendChild(V.ui.seg({ value: model, options: Object.keys(MODELS).map(k => ({ v: k, label: MODELS[k].label })), onChange: v => { model = v; sep = false; sepT.set(false); draw(); } }));
        const sepT = V.ui.toggle({
          label: 'Separa les parts', value: sep, onChange: v => {
            sep = v;
            if (stop) stop();
            const g = viewer.items[1].group, y0 = g.position.y, y1 = y0 + (v ? 2.5 : -2.5);
            stop = V.tween(600, e => { g.position.y = y0 + (y1 - y0) * e; }, () => { stop = null; });
          }
        });
        controls.appendChild(sepT);
        draw();
      }
    }
  ];

  V.views.apren = function (app) {
    app.innerHTML = `
      <div class="wrap">
        <header class="page-head">
          <h1>Aprèn</h1>
          <p class="lead">Sis lliçons curtes per entendre d'on surten les fórmules. Cada lliçó té un laboratori 3D i una pregunta per comprovar que ho has entès.</p>
        </header>
        <ol class="lesson-list">
          ${V.LESSONS.map((L, k) => `
            <li><a class="lesson-card ${V.progress.lessons[L.id] ? 'done' : ''}" href="#/leccio/${L.id}" style="--c:${L.color}">
              <span class="lesson-n">${k + 1}</span>
              <span class="skill-ic">${V.ICONS[L.icon]}</span>
              <span class="lesson-txt"><strong>${L.title}</strong><small>${L.short}</small></span>
              ${V.progress.lessons[L.id] ? `<span class="done-badge">${I.check} Feta</span>` : `<span class="go">${I.arrow}</span>`}
            </a></li>`).join('')}
        </ol>
      </div>`;
  };

  V.views.leccio = function (app, id) {
    const k = V.LESSONS.findIndex(L => L.id === decodeURIComponent(id || ''));
    if (k < 0) { location.hash = '#/apren'; return; }
    const L = V.LESSONS[k], prev = V.LESSONS[k - 1], next = V.LESSONS[k + 1];
    app.innerHTML = `
      <div class="wrap lesson" style="--c:${L.color}">
        <div class="lesson-top">
          <a class="btn-link" href="#/apren">${I.back}<span>Totes les lliçons</span></a>
          <span class="lesson-kicker">Lliçó ${k + 1} de ${V.LESSONS.length}</span>
        </div>
        <header class="lesson-head">
          <h1>${L.title}</h1>
        </header>
        <div class="lesson-grid">
          <div class="lesson-text">
            ${L.sections.map(s => `<section class="card"><h2>${s.h}</h2>${s.html}</section>`).join('')}
            <section class="key"><h2>Recorda</h2>${L.key}</section>
          </div>
          <aside class="lab card">
            <div class="lab-head"><span class="chip" style="--c:${L.color}">Laboratori</span><span class="viewer-hint">Arrossega per girar</span></div>
            <div class="viewer lab-viewer"></div>
            <div class="lab-controls"></div>
            <div class="lab-readout" aria-live="polite"></div>
          </aside>
        </div>
        <section class="lesson-check">
          <h2>Comprova-ho</h2>
          <div class="check-root"></div>
        </section>
        <nav class="lesson-nav">
          ${prev ? `<a class="btn" href="#/leccio/${prev.id}">${I.back}<span>${prev.title}</span></a>` : '<span></span>'}
          ${next ? `<a class="btn" href="#/leccio/${next.id}"><span>${next.title}</span>${I.arrow}</a>` : '<a class="btn" href="#/practica"><span>Ara, a practicar!</span>' + I.arrow + '</a>'}
        </nav>
      </div>`;
    const viewer = new V.Viewer(app.querySelector('.lab-viewer'));
    L.setup({ viewer, controls: app.querySelector('.lab-controls'), readout: app.querySelector('.lab-readout') });
    const c = L.check;
    V.runExercise(app.querySelector('.check-root'), {
      tag: 'Comprova-ho', color: L.color, text: c.text,
      steps: [{ kind: 'num', prompt: 'Escriu el resultat.', answer: c.answer, unit: c.unit, hints: c.hints, distractors: c.distractors }],
      solution: c.solution
    }, {
      compact: true,
      nextLabel: next ? 'Lliçó següent' : 'Ves a practicar',
      onEnd: score => { if (score >= 0.3) { V.progress.lessons[L.id] = true; V.saveProgress(); } },
      onFinish: () => { location.hash = next ? '#/leccio/' + next.id : '#/practica'; }
    });
  };
})(window.VOL);
