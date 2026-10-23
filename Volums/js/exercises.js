window.VOL = window.VOL || {};
(function (V) {
  'use strict';
  const S = V.SHAPES, f = V.fmt, ri = V.ri, pick = V.pick, rs = V.rstep, PI = Math.PI;

  V.SKILLS = [
    { id: 'cubs', name: 'Compta cubs', desc: 'El volum com a nombre de cubs unitaris.', icon: 'cub', color: '#3b6cf6' },
    { id: 'ortoedre', name: 'Cubs i ortoedres', desc: 'V = a · b · c', icon: 'ortoedre', color: '#3b6cf6' },
    { id: 'prismes', name: 'Prismes', desc: 'Bases triangulars i hexagonals.', icon: 'prisma6', color: '#3b6cf6' },
    { id: 'cilindre', name: 'Cilindres', desc: 'V = π · r² · h', icon: 'cilindre', color: '#0fa3a3' },
    { id: 'piramide', name: 'Piràmides', desc: 'La tercera part del prisma.', icon: 'piramide', color: '#f08a24' },
    { id: 'con', name: 'Cons', desc: 'La tercera part del cilindre.', icon: 'con', color: '#f08a24' },
    { id: 'esfera', name: 'Esferes', desc: 'V = (4/3) · π · r³', icon: 'esfera', color: '#8b5cf6' },
    { id: 'unitats', name: 'Unitats i capacitat', desc: 'm³, dm³, cm³, litres…', icon: 'unitats', color: '#e0457b' },
    { id: 'invers', name: 'Troba la dada', desc: 'Saps el volum: troba l\'altura o l\'aresta.', icon: 'invers', color: '#1f9d6b' }
  ];
  V.skill = id => V.SKILLS.find(s => s.id === id);
  V.LEVELS = { 1: 'Nivell 1', 2: 'Nivell 2', 3: 'Nivell 3' };

  const unitFor = L => L === 1 ? 'cm' : L === 2 ? pick(['cm', 'cm', 'm', 'dm']) : pick(['cm', 'm', 'dm', 'mm']);

  // ---------- Dades aleatòries per a cada cos ----------
  function genParams(shape, L) {
    switch (shape) {
      case 'cub': return { a: L === 1 ? ri(2, 6) : L === 2 ? rs(1.5, 9.5, 0.5) : rs(1.2, 6, 0.1) };
      case 'ortoedre': return L === 1 ? { a: ri(2, 8), b: ri(2, 6), c: ri(2, 6) }
        : L === 2 ? { a: rs(1.5, 9, 0.5), b: rs(1.5, 6, 0.5), c: rs(2, 8, 0.5) }
          : { a: rs(1.2, 9, 0.1), b: rs(1.2, 6, 0.1), c: rs(1.5, 8, 0.1) };
      case 'prisma3': return L === 1 ? { b: ri(1, 5) * 2, t: ri(2, 7), h: ri(3, 10) } : { b: rs(2, 9, 0.5), t: rs(1.5, 7, 0.5), h: rs(3, 12, 0.5) };
      case 'prisma6': {
        const c = L === 1 ? ri(2, 6) : rs(1.5, 6, 0.5);
        return { c, ap: Math.round(c * Math.sqrt(3) / 2 * 100) / 100, h: L === 1 ? ri(3, 10) : rs(3, 12, 0.5) };
      }
      case 'cilindre': case 'con': return { r: L === 3 ? rs(1.2, 6, 0.1) : ri(1, 6), h: L === 1 ? ri(2, 12) : rs(2, 12, 0.5) };
      case 'piramide': {
        if (L === 1) { let p; do { p = { l: ri(2, 8), h: ri(3, 12) }; } while ((p.l * p.l * p.h) % 3); return p; }
        return { l: rs(1.5, 9, 0.5), h: rs(3, 12, 0.5) };
      }
      case 'esfera': return { r: L === 3 ? rs(1.5, 6, 0.5) : ri(1, 6) };
    }
  }

  const CTX = {
    cub: ['d\'un cub', 'd\'un dau', 'd\'una capsa cúbica'],
    ortoedre: ['d\'un ortoedre (prisma rectangular)', 'd\'una capsa', 'd\'un maó'],
    cilindre: ['d\'un cilindre', 'd\'un got cilíndric', 'd\'una llauna'],
    con: ['d\'un con', 'd\'un barret de festa amb forma de con', 'd\'un con de trànsit'],
    esfera: ['d\'una esfera', 'd\'una pilota', 'd\'una bola de Nadal'],
    piramide: ['d\'una piràmide de base quadrada'],
    prisma3: ['d\'un prisma triangular'],
    prisma6: ['d\'un prisma hexagonal regular', 'd\'un llapis sense punta (prisma hexagonal)']
  };
  const b = (s, x, u) => `<b>${s} = ${f(x)} ${u}</b>`;
  function describe(shape, p, u, diam, L) {
    const w = L === 1 ? CTX[shape][0] : pick(CTX[shape]);
    const rd = diam ? `diàmetre ${b('d', 2 * p.r, u)}` : `radi ${b('r', p.r, u)}`;
    switch (shape) {
      case 'cub': return `Calcula el volum ${w} d'aresta ${b('a', p.a, u)}.`;
      case 'ortoedre': return `Calcula el volum ${w} de dimensions ${b('a', p.a, u)}, ${b('b', p.b, u)} i ${b('c', p.c, u)}.`;
      case 'prisma3': return `La base ${w.replace('d\'un', 'd\'aquest')} és un triangle de base ${b('b', p.b, u)} i altura ${b('t', p.t, u)}. L'altura del prisma és ${b('h', p.h, u)}. Calcula'n el volum.`;
      case 'prisma6': return `Calcula el volum ${w}. El costat de la base fa ${b('c', p.c, u)}, l'apotema de la base fa ${b('ap', p.ap, u)} i l'altura és ${b('h', p.h, u)}.`;
      case 'cilindre': case 'con': return `Calcula el volum ${w} de ${rd} i altura ${b('h', p.h, u)}.`;
      case 'piramide': return `Calcula el volum ${w} de costat ${b('l', p.l, u)} i altura ${b('h', p.h, u)}.`;
      case 'esfera': return `Calcula el volum ${w} de ${rd}.`;
    }
  }

  function formulaStep(shape) {
    const Sh = S[shape];
    const opts = [{ html: Sh.formula, correct: true }].concat(Sh.decoys.map(([html, msg]) => ({ html, msg })));
    return { kind: 'choice', prompt: 'Quina fórmula has de fer servir?', options: V.shuffle(opts), okMsg: 'Bona tria.' };
  }

  // ---------- Exercici de càlcul directe d'un cos ----------
  function solidEx(shape, L) {
    const Sh = S[shape];
    const p = genParams(shape, L);
    const diam = ['cilindre', 'con', 'esfera'].includes(shape) && L >= 2 && Math.random() < 0.55;
    const u = unitFor(L);
    const steps = [formulaStep(shape)];
    const sol = [{ t: 'Fórmula', m: Sh.formula }];
    if (diam) {
      steps.push({
        kind: 'num', prompt: 'Calcula el radi a partir del diàmetre.', answer: p.r, unit: u,
        hints: ['El radi és la meitat del diàmetre: r = d / 2.'],
        distractors: [{ v: 4 * p.r, msg: 'El radi és la meitat del diàmetre, no el doble.' }]
      });
      sol.push({ t: 'Radi', m: `r = d / 2 = ${f(2 * p.r)} / 2 = ${f(p.r)} ${u}` });
    }
    if (Sh.Ab) {
      steps.push({
        kind: 'num', prompt: `Calcula l'àrea de la base: ${Sh.baseFormula}`, answer: Sh.Ab(p), unit: u + '²',
        hints: [`Substitueix: A<sub>b</sub> = ${Sh.baseSub(p)}`, shape === 'cilindre' || shape === 'con' ? 'Fes primer r² = r · r i després multiplica per π (≈ 3,14).' : 'Fes les operacions amb la calculadora si cal.'],
        distractors: (shape === 'cilindre' || shape === 'con') ? [
          { v: 2 * PI * p.r, msg: 'Això és la longitud de la circumferència (2 · π · r). L\'àrea del cercle és π · r².' },
          { v: PI * p.r, msg: 'Falta elevar el radi al quadrat.' }, { v: PI * 4 * p.r * p.r, msg: 'Has fet servir el diàmetre en lloc del radi.' }
        ] : shape === 'prisma3' ? [{ v: p.b * p.t, msg: 'L\'àrea del triangle és (b · t) / 2: falta dividir per 2.' }]
          : shape === 'prisma6' ? [{ v: 6 * p.c * p.ap, msg: 'L\'àrea és (P · ap) / 2: falta dividir per 2.' }]
            : [{ v: shape === 'cub' ? 2 * p.a : shape === 'piramide' ? 2 * p.l : p.a + p.b, msg: 'Per calcular l\'àrea cal multiplicar, no sumar.' }]
      });
    } else {
      steps.push({
        kind: 'num', prompt: 'Calcula r³ (el radi elevat al cub).', answer: Math.pow(p.r, 3), unit: u + '³',
        hints: ['r³ = r · r · r'],
        distractors: [{ v: 3 * p.r, msg: 'r³ no és 3 · r: és r · r · r.' }, { v: p.r * p.r, msg: 'Això és r². Cal multiplicar el radi tres vegades.' }]
      });
    }
    const hints = [`Fórmula: ${Sh.formula}`, `Substitueix: V = ${Sh.volSub(p)}`, 'El volum es mesura en unitats cúbiques (³).'];
    steps.push({
      kind: 'num', prompt: 'Calcula el volum i tria la unitat.', answer: Sh.V(p), unit: u + '³', unitChoice: [u, u + '²', u + '³'],
      distractors: Sh.wrong(p), hints: [`Substitueix: V = ${Sh.volSub(p)}`, 'El volum es mesura en unitats cúbiques (³).']
    });
    return {
      tag: Sh.name, color: Sh.color, text: describe(shape, p, u, diam, L),
      scene: [{ shape, p, dims: true, diam, unit: u }],
      steps, hints, solution: sol.concat(Sh.steps(p, u))
    };
  }

  // ---------- Comptar cubs ----------
  function cubsEx(L) {
    const a = ri(2, L === 1 ? 4 : 6), bb = ri(2, L === 1 ? 4 : 5), c = ri(2, L === 1 ? 3 : 5);
    const n = a * bb * c, color = '#3b6cf6';
    const scene = [{ shape: 'ortoedre', p: { a, b: bb, c }, cubes: true }];
    const layerStep = {
      kind: 'num', prompt: 'Quants cubs hi ha en una capa?', answer: a * bb, unit: 'cubs',
      hints: ['Mira la capa de baix. Quants cubs té de llarg? I d\'ample? Multiplica-ho.'],
      distractors: [{ v: a + bb, msg: 'Has sumat. Cal multiplicar: cubs de llarg × cubs d\'ample.' }]
    };
    const capesStep = { kind: 'num', prompt: 'Quantes capes hi ha?', answer: c, unit: 'capes', hints: ['Cada capa té un color una mica diferent. Compta-les de baix a dalt.'] };
    const totalWrong = [
      { v: a * bb + c, msg: 'Has sumat les capes. Cal multiplicar: cubs per capa × nombre de capes.' },
      { v: a + bb + c, msg: 'Has sumat les tres mides. Cal multiplicar-les.' },
      { v: a * bb, msg: 'Només has comptat una capa.' }
    ];
    if (L < 3) {
      return {
        tag: 'Compta cubs', color, text: 'Quants cubs unitaris formen aquest cos? Gira la figura per veure-la bé.', scene,
        steps: [layerStep, capesStep, { kind: 'num', prompt: 'Quants cubs hi ha en total?', answer: n, unit: 'cubs', distractors: totalWrong, hints: ['Cubs per capa × nombre de capes.'] }],
        hints: ['Compta per capes: cubs d\'una capa × nombre de capes.'],
        solution: [{ t: 'Cubs per capa', m: `${a} · ${bb} = ${a * bb}` }, { t: 'Capes', m: `${c}` }, { t: 'Total', m: `${a * bb} · ${c} = <b>${n} cubs</b>` }]
      };
    }
    return {
      tag: 'Compta cubs', color, text: 'Cada cub d\'aquest cos fa <b>2 cm</b> d\'aresta. Quin és el volum total del cos?', scene,
      steps: [
        { kind: 'num', prompt: 'Quants cubs hi ha en total?', answer: n, unit: 'cubs', distractors: totalWrong, hints: ['Cubs per capa × nombre de capes.'] },
        {
          kind: 'num', prompt: 'Quin és el volum d\'un sol cub?', answer: 8, unit: 'cm³',
          hints: ['El volum d\'un cub és a · a · a.'],
          distractors: [{ v: 2, msg: 'L\'aresta fa 2 cm, però el volum és 2 · 2 · 2.' }, { v: 6, msg: 'Has sumat 2 + 2 + 2. Cal multiplicar: 2 · 2 · 2.' }, { v: 4, msg: 'Això és l\'àrea d\'una cara (2 · 2). Falta multiplicar una altra vegada per 2.' }]
        },
        {
          kind: 'num', prompt: 'Calcula el volum total i tria la unitat.', answer: n * 8, unit: 'cm³', unitChoice: ['cm', 'cm²', 'cm³'],
          distractors: [{ v: n * 2, msg: 'Cada cub no fa 2 cm³ sinó 2 · 2 · 2 = 8 cm³.' }, { v: n, msg: 'Aquest és el nombre de cubs. Multiplica pel volum de cada cub.' }]
        }
      ],
      hints: ['Compta els cubs i multiplica pel volum de cada cub (2 · 2 · 2).'],
      solution: [{ t: 'Cubs', m: `${a} · ${bb} · ${c} = ${n}` }, { t: 'Volum d\'un cub', m: '2 · 2 · 2 = 8 cm³' }, { t: 'Total', m: `${n} · 8 = <b>${n * 8} cm³</b>` }]
    };
  }

  // ---------- Unitats ----------
  const UF = { 'm³': 1e6, 'dm³': 1e3, 'cm³': 1, 'mm³': 1e-3, 'kL': 1e6, 'hL': 1e5, 'L': 1e3, 'dL': 100, 'cL': 10, 'mL': 1 };
  const VOLU = ['m³', 'dm³', 'cm³', 'mm³'];
  V.UF = UF;
  V.ladderHtml = function () {
    const st = (u, cap) => `<div class="lad-step"><b>${u}</b>${cap ? `<span>${cap}</span>` : ''}</div>`;
    const ar = '<div class="lad-arrow"><span>× 1000</span><i></i><span>: 1000</span></div>';
    return `<div class="ladder" role="img" aria-label="Escala d'unitats de volum: cada graó multiplica o divideix per 1000">
      ${st('m³', '= 1000 L')}${ar}${st('dm³', '= 1 L')}${ar}${st('cm³', '= 1 mL')}${ar}${st('mm³')}
    </div>`;
  };
  function unitsEx(L) {
    const pairs = {
      1: [['dm³', 'cm³'], ['m³', 'dm³'], ['cm³', 'dm³'], ['dm³', 'L'], ['L', 'dm³'], ['cm³', 'mL']],
      2: [['m³', 'L'], ['L', 'cm³'], ['cm³', 'L'], ['dm³', 'cm³'], ['mL', 'cm³'], ['dm³', 'm³']],
      3: [['m³', 'cm³'], ['cm³', 'L'], ['mL', 'dm³'], ['dL', 'cm³'], ['cL', 'mL'], ['hL', 'm³'], ['mm³', 'cm³']]
    }[L];
    const [from, to] = pick(pairs);
    const k = UF[from] / UF[to];
    const base = L === 1 ? ri(2, 9) : pick([0.25, 0.5, 1.5, 2.4, 0.75, 3.2, 0.05, 12, 4.5]);
    const val = k >= 1 ? base : Math.round(base / k * 1e6) / 1e6;
    const ans = val * k;
    const bothVol = VOLU.includes(from) && VOLU.includes(to);
    const dist = [];
    if (k !== 1) dist.push({ v: val / k, msg: 'Has fet l\'operació al revés. Si passes a una unitat més petita, el número es fa més gran (i a l\'inrevés).' });
    if (bothVol && k !== 1) {
      const n = Math.round(Math.log10(k) / 3);
      dist.push({ v: val * Math.pow(10, n), msg: 'Entre unitats de volum, cada graó és × 1000 (10 · 10 · 10), no × 10.' });
      dist.push({ v: val * Math.pow(100, n), msg: 'Entre unitats de volum, cada graó és × 1000, no × 100. El × 100 és per a les àrees.' });
    }
    if (k === 1) dist.push({ v: val * 1000, msg: 'Recorda: 1 dm³ = 1 L exactament.' }, { v: val / 1000, msg: 'Recorda: 1 dm³ = 1 L exactament.' });
    const mult = k >= 1;
    return {
      tag: 'Unitats', color: '#e0457b', kind: 'conv',
      text: `Expressa <b>${f(val, 6)} ${from}</b> en <b>${to}</b>.`,
      visual: V.ladderHtml() + '<p class="small muted">Capacitat: 1 L = 10 dL = 100 cL = 1000 mL</p>',
      steps: [{
        kind: 'num', prompt: `${f(val, 6)} ${from} = ? ${to}`, answer: ans, unit: to, dec: 6,
        distractors: dist,
        hints: ['Mira l\'escala: cada graó de les unitats de volum és × 1000. Recorda que 1 dm³ = 1 L i 1 cm³ = 1 mL.',
          k === 1 ? `1 ${from} = 1 ${to}` : `De ${from} a ${to} ${mult ? 'multiplica' : 'divideix'} per ${f(mult ? k : 1 / k, 6)}.`]
      }],
      hints: [],
      solution: [
        { t: 'Equivalència', m: `1 ${from} = ${f(k, 6)} ${to}` },
        { t: 'Càlcul', m: `${f(val, 6)} ${mult ? '·' : ':'} ${f(mult ? k : 1 / k, 6)} = <b>${f(ans, 6)} ${to}</b>` }
      ]
    };
  }

  // ---------- Problemes inversos ----------
  function inversEx(L) {
    const u = L === 1 ? 'cm' : pick(['cm', 'm', 'dm']);
    const kind = L === 1 ? pick(['ortoedre', 'cub']) : L === 2 ? pick(['ortoedre', 'cilindre', 'cub']) : pick(['cilindre', 'con', 'aquari']);
    const tag = 'Troba la dada', color = '#1f9d6b';
    const lenChoice = [u, u + '²', u + '³'];
    if (kind === 'ortoedre') {
      const a = ri(2, 9), bb = ri(2, 6), c = ri(2, 9), Vv = a * bb * c;
      return {
        tag, color, text: `Un ortoedre té un volum de <b>${Vv} ${u}³</b>. La base fa ${b('a', a, u)} per ${b('b', bb, u)}. Quina és l'altura <b>c</b>?`,
        scene: [{ shape: 'ortoedre', p: { a, b: bb, c }, dims: true, unit: u, unknown: 'c' }],
        steps: [
          { kind: 'num', prompt: 'Calcula l\'àrea de la base.', answer: a * bb, unit: u + '²', hints: ['A<sub>b</sub> = a · b'] },
          {
            kind: 'num', prompt: 'Aïlla l\'altura: c = V / A<sub>b</sub>', answer: c, unit: u, unitChoice: lenChoice,
            hints: ['Si V = A<sub>b</sub> · c, llavors c = V / A<sub>b</sub>.'],
            distractors: [{ v: Vv * a * bb, msg: 'Cal dividir, no multiplicar: c = V / A<sub>b</sub>.' }, { v: Vv - a * bb, msg: 'Cal dividir, no restar: c = V / A<sub>b</sub>.' }, { v: Vv / a, msg: 'Divideix per l\'àrea de la base (a · b), no només per a.' }]
          }
        ],
        hints: ['V = a · b · c, per tant c = V / (a · b).'],
        solution: [{ t: 'Base', m: `A<sub>b</sub> = ${a} · ${bb} = ${a * bb} ${u}²` }, { t: 'Altura', m: `c = V / A<sub>b</sub> = ${Vv} / ${a * bb} = <b>${c} ${u}</b>` }]
      };
    }
    if (kind === 'cub') {
      const a = ri(2, L === 1 ? 6 : 10), Vv = a * a * a;
      return {
        tag, color, text: `Un cub té un volum de <b>${Vv} ${u}³</b>. Quant fa l'aresta?`,
        scene: [{ shape: 'cub', p: { a }, dims: true, unit: u, unknown: 'a' }],
        steps: [{
          kind: 'num', prompt: 'Troba l\'aresta a.', answer: a, unit: u, unitChoice: lenChoice,
          hints: [`Busca un nombre que, multiplicat tres vegades per ell mateix, doni ${Vv}: a · a · a = ${Vv}.`, 'Prova: 2³ = 8, 3³ = 27, 4³ = 64, 5³ = 125, 6³ = 216…'],
          distractors: [{ v: Vv / 3, msg: 'No es divideix per 3. Cal buscar el nombre que multiplicat tres vegades per ell mateix dona el volum (arrel cúbica).' }, { v: Math.sqrt(Vv), msg: 'Això és l\'arrel quadrada. Necessites l\'arrel cúbica: a · a · a = V.' }]
        }],
        hints: [],
        solution: [{ t: 'Arrel cúbica', m: `a = ∛${Vv} = <b>${a} ${u}</b>, perquè ${a} · ${a} · ${a} = ${Vv}` }]
      };
    }
    if (kind === 'cilindre' || kind === 'con') {
      const r = ri(1, 5), h = ri(2, 12), third = kind === 'con';
      const Vv = Math.round(PI * r * r * h / (third ? 3 : 1) * 100) / 100, Ab = PI * r * r;
      return {
        tag, color, text: `${third ? 'Un con' : 'Un cilindre'} té un volum de <b>${f(Vv)} ${u}³</b> i el radi de la base fa ${b('r', r, u)}. Quina és l'altura?`,
        scene: [{ shape: kind, p: { r, h }, dims: true, unit: u, unknown: 'h' }],
        steps: [
          { kind: 'num', prompt: 'Calcula l\'àrea de la base.', answer: Ab, unit: u + '²', hints: [`A<sub>b</sub> = π · r² = π · ${r}²`] },
          {
            kind: 'num', prompt: third ? 'Aïlla l\'altura: h = 3 · V / A<sub>b</sub>' : 'Aïlla l\'altura: h = V / A<sub>b</sub>', answer: h, unit: u, unitChoice: lenChoice,
            hints: [third ? 'Si V = (A<sub>b</sub> · h) / 3, llavors h = 3 · V / A<sub>b</sub>.' : 'Si V = A<sub>b</sub> · h, llavors h = V / A<sub>b</sub>.'],
            distractors: third ? [{ v: Vv / Ab, msg: 'Has oblidat el 3. Si V = (A<sub>b</sub> · h) / 3, llavors h = 3 · V / A<sub>b</sub>.' }]
              : [{ v: Vv / (PI * r), msg: 'Cal dividir per l\'àrea de la base, π · r².' }, { v: Vv / (r * r), msg: 'No t\'oblidis de π a l\'àrea de la base.' }]
          }
        ],
        hints: [],
        solution: [{ t: 'Base', m: `A<sub>b</sub> = π · ${r}² = ${f(Ab)} ${u}²` }, { t: 'Altura', m: third ? `h = 3 · ${f(Vv)} / ${f(Ab)} = <b>${f(h)} ${u}</b>` : `h = ${f(Vv)} / ${f(Ab)} = <b>${f(h)} ${u}</b>` }]
      };
    }
    // aquari
    const a = ri(4, 8) * 10, bb = ri(2, 4) * 10, h = ri(2, 5) * 10, lit = a * bb * h / 1000;
    return {
      tag, color, text: `Un aquari té una base rectangular de <b>${a} cm × ${bb} cm</b>. Hi aboquem <b>${f(lit)} L</b> d'aigua. Fins a quina altura arriba l'aigua?`,
      scene: [{ shape: 'ortoedre', p: { a, b: bb, c: h + 20 }, dims: true, unit: 'cm', hideDims: ['c'], water: true, fill: h / (h + 20), color: '#9fb4d9' }],
      steps: [
        { kind: 'num', prompt: 'Expressa el volum d\'aigua en cm³.', answer: lit * 1000, unit: 'cm³', hints: ['1 L = 1 dm³ = 1000 cm³'], distractors: [{ v: lit * 100, msg: '1 L = 1000 cm³, no 100.' }, { v: lit * 10, msg: '1 L = 1000 cm³, no 10.' }] },
        { kind: 'num', prompt: 'Calcula l\'àrea de la base.', answer: a * bb, unit: 'cm²', hints: ['A<sub>b</sub> = a · b'] },
        {
          kind: 'num', prompt: 'Calcula l\'altura de l\'aigua.', answer: h, unit: 'cm', unitChoice: ['cm', 'cm²', 'cm³'],
          hints: ['h = V / A<sub>b</sub>'], distractors: [{ v: lit / (a * bb), msg: 'Abans de dividir, passa els litres a cm³.' }]
        }
      ],
      hints: [],
      solution: [{ t: 'Volum', m: `${f(lit)} L = ${f(lit * 1000)} cm³` }, { t: 'Base', m: `${a} · ${bb} = ${a * bb} cm²` }, { t: 'Altura', m: `h = ${f(lit * 1000)} / ${a * bb} = <b>${h} cm</b>` }]
    };
  }

  // Descarta dades en què un error típic dona el mateix resultat que la resposta correcta
  const ambiguous = ex => ex.steps.some(st => (st.distractors || []).some(d => V.close(d.v, st.answer, 0.02)));
  V.makeExercise = function (skill, L) {
    let ex, tries = 0;
    do { ex = buildExercise(skill, L); } while (ambiguous(ex) && ++tries < 40);
    return ex;
  };
  function buildExercise(skill, L) {
    let ex;
    switch (skill) {
      case 'cubs': ex = cubsEx(L); break;
      case 'ortoedre': ex = solidEx(L === 1 && Math.random() < 0.4 ? 'cub' : pick(['cub', 'ortoedre', 'ortoedre']), L); break;
      case 'prismes': ex = solidEx(L === 1 ? 'prisma3' : pick(['prisma3', 'prisma6']), L); break;
      case 'unitats': ex = unitsEx(L); break;
      case 'invers': ex = inversEx(L); break;
      default: ex = solidEx(skill, L);
    }
    ex.level = L;
    return ex;
  }

  V.levelFor = function (skill) {
    const set = V.progress.settings.level;
    if (set !== 'auto') return +set;
    const m = V.mastery(skill);
    return m < 0.45 ? 1 : m < 0.8 ? 2 : 3;
  };

  V.pickAdaptive = function () {
    const w = V.SKILLS.map(s => ({ id: s.id, w: 0.15 + (1 - V.mastery(s.id)) }));
    let r = Math.random() * w.reduce((a, x) => a + x.w, 0);
    for (const x of w) { r -= x.w; if (r <= 0) return x.id; }
    return w[0].id;
  };

  // ---------- Reptes contextualitzats ----------
  const rf = (Ab, H) => Ab * H;
  V.REPTES = [
    {
      id: 'bric', title: 'El bric de llet', icon: 'ortoedre', color: '#3b6cf6', short: 'Hi cap realment 1 litre?',
      text: 'Un bric de llet té forma d\'ortoedre i fa <b>9,5 cm</b> de llarg, <b>6,4 cm</b> d\'ample i <b>16,5 cm</b> d\'alt. A l\'etiqueta hi posa «1 L». És cert?',
      scene: [{ shape: 'ortoedre', p: { a: 9.5, b: 6.4, c: 16.5 }, dims: true, unit: 'cm', color: '#6b93f0' }],
      steps: [
        { prompt: 'Calcula l\'àrea de la base.', answer: 60.8, unit: 'cm²', hints: ['A<sub>b</sub> = 9,5 · 6,4'] },
        { prompt: 'Calcula el volum del bric.', answer: 1003.2, unit: 'cm³', hints: ['V = A<sub>b</sub> · altura'], distractors: [{ v: 60.8, msg: 'Falta multiplicar per l\'altura.' }] },
        { prompt: 'Expressa el volum en litres.', answer: 1.0032, unit: 'L', dec: 3, hints: ['1 L = 1000 cm³'], distractors: [{ v: 100.32, msg: '1 L = 1000 cm³: cal dividir per 1000.' }, { v: 10.032, msg: '1 L = 1000 cm³: cal dividir per 1000.' }] }
      ],
      solution: [{ t: 'Base', m: '9,5 · 6,4 = 60,8 cm²' }, { t: 'Volum', m: '60,8 · 16,5 = 1003,2 cm³' }, { t: 'Litres', m: '1003,2 cm³ = <b>1,0032 L</b>' }],
      curiosity: 'Sí que hi cap un litre, i encara sobra una mica d\'espai. Per això el bric no vessa quan l\'obres.'
    },
    {
      id: 'llauna', title: 'La llauna de refresc', icon: 'cilindre', color: '#0fa3a3', short: 'Per què diu 33 cl?',
      text: 'Una llauna de refresc és gairebé un cilindre de radi <b>3,3 cm</b> i altura <b>11,5 cm</b>. Quants centilitres hi caben?',
      scene: [{ shape: 'cilindre', p: { r: 3.3, h: 11.5 }, dims: true, unit: 'cm', color: '#d64545' }],
      steps: [
        { prompt: 'Calcula l\'àrea de la base.', answer: PI * 3.3 * 3.3, unit: 'cm²', hints: ['A<sub>b</sub> = π · r² = π · 3,3²'], distractors: [{ v: 2 * PI * 3.3, msg: 'Això és la longitud de la circumferència. L\'àrea és π · r².' }] },
        { prompt: 'Calcula el volum de la llauna.', answer: rf(PI * 3.3 * 3.3, 11.5), unit: 'cm³', hints: ['V = A<sub>b</sub> · h'] },
        { prompt: 'Expressa la capacitat en centilitres.', answer: rf(PI * 3.3 * 3.3, 11.5) / 10, unit: 'cl', hints: ['1 cm³ = 1 mL i 10 mL = 1 cl'], distractors: [{ v: rf(PI * 3.3 * 3.3, 11.5) / 100, msg: '1 cl = 10 mL = 10 cm³: divideix per 10.' }] }
      ],
      solution: [{ t: 'Base', m: 'π · 3,3² ≈ 34,21 cm²' }, { t: 'Volum', m: '34,21 · 11,5 ≈ 393,44 cm³' }, { t: 'Capacitat', m: '393,44 mL ≈ <b>39,34 cl</b>' }],
      curiosity: 'A la llauna hi posa 33 cl. La diferència s\'explica perquè la llauna real no és un cilindre perfecte (la part de dalt és més estreta) i no s\'omple fins dalt.'
    },
    {
      id: 'piscina', title: 'Omplir la piscina', icon: 'ortoedre', color: '#2a9df4', short: 'Quantes hores per omplir-la?',
      text: 'Una piscina fa <b>10 m</b> de llarg, <b>5 m</b> d\'ample i <b>1,6 m</b> de fondària. Una bomba hi aboca <b>20 L</b> d\'aigua cada minut.',
      scene: [{ shape: 'ortoedre', p: { a: 10, b: 5, c: 1.6 }, dims: true, unit: 'm', water: true, fill: 0.85, color: '#b9c6dc' }],
      steps: [
        { prompt: 'Calcula el volum de la piscina.', answer: 80, unit: 'm³', hints: ['V = a · b · c'] },
        { prompt: 'Quants litres d\'aigua hi caben?', answer: 80000, unit: 'L', hints: ['1 m³ = 1000 L'], distractors: [{ v: 800, msg: '1 m³ = 1000 L, no 10.' }, { v: 8000, msg: '1 m³ = 1000 L, no 100.' }] },
        { prompt: 'Quants minuts trigarà a omplir-se?', answer: 4000, unit: 'min', hints: ['Divideix els litres totals entre els litres per minut.'] },
        { prompt: 'Quantes hores són?', answer: 4000 / 60, unit: 'h', hints: ['1 h = 60 min'] }
      ],
      solution: [{ t: 'Volum', m: '10 · 5 · 1,6 = 80 m³' }, { t: 'Litres', m: '80 · 1000 = 80.000 L' }, { t: 'Temps', m: '80.000 : 20 = 4000 min = <b>66,67 h</b> (gairebé 3 dies)' }],
      curiosity: 'Amb l\'aigua d\'aquesta piscina es podrien omplir 80.000 ampolles d\'1 litre.'
    },
    {
      id: 'gelat', title: 'El gelat', icon: 'con', color: '#f08a24', short: 'Con + semiesfera',
      text: 'Un gelat té un con de galeta de radi <b>2,5 cm</b> i altura <b>10 cm</b>, ple de gelat, i a sobre una bola en forma de semiesfera del mateix radi. Quin volum de gelat hi ha?',
      scene: [{ shape: 'con', p: { r: 2.5, h: 10 }, flip: true, dims: true, unit: 'cm', color: '#d9a15b' }, { shape: 'semiesfera', p: { r: 2.5 }, y: 10, color: '#f59ac0' }],
      steps: [
        { prompt: 'Calcula el volum del con.', answer: PI * 6.25 * 10 / 3, unit: 'cm³', hints: ['V = (π · r² · h) / 3'], distractors: [{ v: PI * 6.25 * 10, msg: 'Has oblidat dividir per 3.' }] },
        { prompt: 'Calcula el volum de la semiesfera.', answer: 2 / 3 * PI * Math.pow(2.5, 3), unit: 'cm³', hints: ['V = (2/3) · π · r³'], distractors: [{ v: 4 / 3 * PI * Math.pow(2.5, 3), msg: 'Aquest és el volum de l\'esfera sencera. En vols la meitat.' }] },
        { prompt: 'Quin és el volum total de gelat?', answer: PI * 6.25 * 10 / 3 + 2 / 3 * PI * Math.pow(2.5, 3), unit: 'cm³', hints: ['Suma els dos volums.'] }
      ],
      solution: [{ t: 'Con', m: '(π · 2,5² · 10) / 3 ≈ 65,45 cm³' }, { t: 'Semiesfera', m: '(2/3) · π · 2,5³ ≈ 32,72 cm³' }, { t: 'Total', m: '65,45 + 32,72 ≈ <b>98,17 cm³</b>' }],
      curiosity: 'El con conté el doble de gelat que la bola de dalt!'
    },
    {
      id: 'pilota', title: 'La pilota de bàsquet', icon: 'esfera', color: '#8b5cf6', short: 'Quant d\'aire hi ha a dins?',
      text: 'Una pilota de bàsquet té un radi d\'uns <b>12 cm</b>. Quants litres d\'aire hi ha a dins?',
      scene: [{ shape: 'esfera', p: { r: 12 }, dims: true, unit: 'cm', color: '#e8742a' }],
      steps: [
        { prompt: 'Calcula r³.', answer: 1728, unit: 'cm³', hints: ['r³ = 12 · 12 · 12'] },
        { prompt: 'Calcula el volum de la pilota.', answer: 4 / 3 * PI * 1728, unit: 'cm³', hints: ['V = (4/3) · π · r³'], distractors: [{ v: 4 * PI * 144, msg: 'Això és l\'àrea de la superfície. El volum és (4/3) · π · r³.' }] },
        { prompt: 'Expressa-ho en litres.', answer: 4 / 3 * PI * 1728 / 1000, unit: 'L', hints: ['1 L = 1000 cm³'] }
      ],
      solution: [{ t: 'r³', m: '12³ = 1728 cm³' }, { t: 'Volum', m: '(4/3) · π · 1728 ≈ 7238,23 cm³' }, { t: 'Litres', m: '≈ <b>7,24 L</b>' }],
      curiosity: 'Hi caben més de 7 litres: com 7 ampolles d\'aigua grans!'
    },
    {
      id: 'tenda', title: 'La tenda de campanya', icon: 'prisma3', color: '#3b6cf6', short: 'Un prisma triangular estirat',
      text: 'Una tenda de campanya té forma de prisma triangular. El triangle de la porta fa <b>1,8 m</b> de base i <b>1,2 m</b> d\'alçada. La tenda fa <b>2,2 m</b> de llarg.',
      scene: [{ shape: 'prisma3', p: { b: 1.8, t: 1.2, h: 2.2 }, rot: [Math.PI / 2, 0, 0], y: 0.6, z: -1.1, dims: true, unit: 'm', color: '#4caf7d' }],
      steps: [
        { prompt: 'Calcula l\'àrea del triangle de la porta.', answer: 1.08, unit: 'm²', hints: ['A = (b · t) / 2'], distractors: [{ v: 2.16, msg: 'Falta dividir per 2.' }] },
        { prompt: 'Calcula el volum de la tenda.', answer: 2.376, unit: 'm³', dec: 3, hints: ['V = A<sub>b</sub> · llargada'] },
        { prompt: 'Quants litres d\'aire hi ha dins?', answer: 2376, unit: 'L', hints: ['1 m³ = 1000 L'] }
      ],
      solution: [{ t: 'Base', m: '(1,8 · 1,2) / 2 = 1,08 m²' }, { t: 'Volum', m: '1,08 · 2,2 = 2,376 m³' }, { t: 'Litres', m: '<b>2376 L</b>' }],
      curiosity: 'Fixa\'t que la «base» d\'un prisma no sempre és la cara de sota: és la cara que es repeteix al llarg del cos.'
    },
    {
      id: 'diposit', title: 'El dipòsit d\'aigua', icon: 'cilindre', color: '#0fa3a3', short: 'Cilindre + semiesfera',
      text: 'Un dipòsit és un cilindre de radi <b>1 m</b> i altura <b>3 m</b> amb una tapa en forma de semiesfera del mateix radi. Quants litres hi caben?',
      scene: [{ shape: 'cilindre', p: { r: 1, h: 3 }, dims: true, unit: 'm', color: '#8fa6c4' }, { shape: 'semiesfera', p: { r: 1 }, y: 3, color: '#8fa6c4' }],
      steps: [
        { prompt: 'Calcula el volum del cilindre.', answer: 3 * PI, unit: 'm³', hints: ['V = π · r² · h'] },
        { prompt: 'Calcula el volum de la semiesfera.', answer: 2 / 3 * PI, unit: 'm³', hints: ['V = (2/3) · π · r³'] },
        { prompt: 'Calcula el volum total.', answer: 3 * PI + 2 / 3 * PI, unit: 'm³', hints: ['Suma els dos volums.'] },
        { prompt: 'Quants litres hi caben?', answer: (3 * PI + 2 / 3 * PI) * 1000, unit: 'L', hints: ['1 m³ = 1000 L'] }
      ],
      solution: [{ t: 'Cilindre', m: 'π · 1² · 3 ≈ 9,42 m³' }, { t: 'Semiesfera', m: '(2/3) · π · 1³ ≈ 2,09 m³' }, { t: 'Total', m: '≈ 11,52 m³ = <b>11.519 L</b>' }]
    },
    {
      id: 'kheops', title: 'La piràmide de Kheops', icon: 'piramide', color: '#f08a24', short: 'Un volum faraònic',
      text: 'La Gran Piràmide de Gizeh (Egipte) té una base quadrada d\'uns <b>230 m</b> de costat i una altura original d\'uns <b>146 m</b>. Quin volum té?',
      scene: [{ shape: 'piramide', p: { l: 230, h: 146 }, dims: true, unit: 'm', color: '#e2c27a' }],
      steps: [
        { prompt: 'Calcula l\'àrea de la base.', answer: 52900, unit: 'm²', hints: ['A<sub>b</sub> = l² = 230 · 230'] },
        { prompt: 'Calcula el volum de la piràmide.', answer: 52900 * 146 / 3, unit: 'm³', hints: ['V = (A<sub>b</sub> · h) / 3'], distractors: [{ v: 52900 * 146, msg: 'Has oblidat dividir per 3.' }] }
      ],
      solution: [{ t: 'Base', m: '230² = 52.900 m²' }, { t: 'Volum', m: '(52.900 · 146) / 3 ≈ <b>2.574.466,67 m³</b>' }],
      curiosity: 'Es va construir cap al 2560 aC. Avui fa uns 138 m d\'alçada perquè ha perdut el revestiment exterior i la punta. Es calcula que s\'hi van col·locar uns 2,3 milions de blocs de pedra.'
    }
  ];

  V.repteExercise = function (R) {
    return {
      tag: 'Repte', color: R.color, title: R.title, text: R.text, scene: R.scene,
      steps: R.steps.map(s => Object.assign({ kind: 'num' }, s)), hints: [], solution: R.solution, curiosity: R.curiosity
    };
  };
})(window.VOL);
