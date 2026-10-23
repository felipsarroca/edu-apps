window.VOL = window.VOL || {};
(function (V) {
  'use strict';
  const PI = Math.PI, SQ3 = Math.sqrt(3);
  const f = (x, d) => V.fmt(x, d);

  // ---------- Geometria 2D i 3D ----------
  // Les bases es dibuixen al pla XY i s'extrudeixen cap amunt (eix Y). Un punt (x, y) de la base va a (x, 0, -y).
  const rect = (w, d) => poly([[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]]);
  const circle = r => { const s = new THREE.Shape(); s.absarc(0, 0, r, 0, 2 * PI, false); return s; };
  function poly(pts) {
    const s = new THREE.Shape();
    pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y)));
    s.closePath();
    return s;
  }
  const triPts = (b, t) => [[-b / 2, -t / 2], [b / 2, -t / 2], [0, t / 2]];
  const hexPts = c => Array.from({ length: 6 }, (_, i) => [c * Math.cos(i * PI / 3), c * Math.sin(i * PI / 3)]);
  const sqPts = l => [[-l / 2, -l / 2], [l / 2, -l / 2], [l / 2, l / 2], [-l / 2, l / 2]];

  function prism(shape, H) {
    const g = new THREE.ExtrudeGeometry(shape, { depth: H, bevelEnabled: false, curveSegments: 48 });
    g.rotateX(-PI / 2);
    return g;
  }
  function pyramid(pts, H) {
    const P = ([x, y]) => [x, 0, -y];
    const tris = THREE.ShapeUtils.triangulateShape(pts.map(([x, y]) => new THREE.Vector2(x, y)), []);
    const pos = [];
    tris.forEach(t => t.forEach(i => pos.push(...P(pts[i]))));
    pts.forEach((a, i) => pos.push(...P(a), ...P(pts[(i + 1) % pts.length]), 0, H, 0));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }
  function cyl(r1, r2, H) { const g = new THREE.CylinderGeometry(r1, r2, H, 64, 1); g.translate(0, H / 2, 0); return g; }

  V.geo = { rect, circle, poly, triPts, hexPts, sqPts, prism, pyramid };

  // ---------- Passos de resolució ----------
  function bh(o) {
    const Vv = o.third ? o.Ab * o.h / 3 : o.Ab * o.h;
    return [
      { t: 'Àrea de la base', m: `${o.abF} = ${o.abSub} = ${f(o.Ab)} ${o.u}²` },
      {
        t: 'Volum', m: o.third
          ? `V = (A<sub>b</sub> · ${o.hs}) / 3 = (${f(o.Ab)} · ${f(o.h)}) / 3 = <b>${f(Vv)} ${o.u}³</b>`
          : `V = A<sub>b</sub> · ${o.hs} = ${f(o.Ab)} · ${f(o.h)} = <b>${f(Vv)} ${o.u}³</b>`
      }
    ];
  }

  const C = { prismes: '#3b6cf6', cilindres: '#0fa3a3', piramides: '#f08a24', esferes: '#8b5cf6' };
  V.FAMILY_COLORS = C;

  V.SHAPES = {
    cub: {
      name: 'Cub', del: 'del cub', color: C.prismes,
      params: [{ k: 'a', label: 'Aresta (a)', min: 1, max: 10, step: 1, def: 3 }],
      H: p => p.a, Ab: p => p.a * p.a, V: p => Math.pow(p.a, 3),
      formula: 'V = a³', baseFormula: 'A<sub>b</sub> = a²',
      baseSub: p => `${f(p.a)}²`, volSub: p => `${f(p.a)}³ = ${f(p.a)} · ${f(p.a)} · ${f(p.a)}`,
      baseShape: p => rect(p.a, p.a), scaleAt: () => 1, upTo: (p, y) => p.a * p.a * y,
      build: p => prism(rect(p.a, p.a), p.a), cubes: p => [p.a, p.a, p.a],
      dims: (p, o) => [{ a: [-p.a / 2, 0, p.a / 2 + o.m], b: [p.a / 2, 0, p.a / 2 + o.m], sym: 'a', val: p.a }],
      steps: (p, u) => [{ t: 'Volum', m: `V = a³ = ${f(p.a)} · ${f(p.a)} · ${f(p.a)} = <b>${f(Math.pow(p.a, 3))} ${u}³</b>` }],
      decoys: [['V = 3 · a', 'Multiplicar l\'aresta per 3 no dona el volum.'], ['V = 6 · a²', 'Aquesta és l\'àrea total de les 6 cares.'], ['V = a²', 'Això és l\'àrea d\'una cara, no el volum.']],
      wrong: p => [
        { v: p.a * p.a, msg: 'Has calculat a², l\'àrea d\'una cara. El volum té tres dimensions: a · a · a.' },
        { v: 3 * p.a, msg: 'Has multiplicat l\'aresta per 3. Cal multiplicar-la per ella mateixa tres vegades: a · a · a.' },
        { v: 6 * p.a * p.a, msg: 'Això és l\'àrea total (les 6 cares), no el volum.' },
        { v: 12 * p.a, msg: 'Has sumat les 12 arestes. El volum és a · a · a.' }
      ]
    },

    ortoedre: {
      name: 'Ortoedre', del: 'de l\'ortoedre', color: C.prismes,
      params: [
        { k: 'a', label: 'Llargada (a)', min: 1, max: 10, step: 1, def: 4 },
        { k: 'b', label: 'Amplada (b)', min: 1, max: 10, step: 1, def: 3 },
        { k: 'c', label: 'Altura (c)', min: 1, max: 10, step: 1, def: 2 }
      ],
      H: p => p.c, Ab: p => p.a * p.b, V: p => p.a * p.b * p.c,
      formula: 'V = a · b · c', baseFormula: 'A<sub>b</sub> = a · b',
      baseSub: p => `${f(p.a)} · ${f(p.b)}`, volSub: p => `${f(p.a)} · ${f(p.b)} · ${f(p.c)}`,
      baseShape: p => rect(p.a, p.b), scaleAt: () => 1, upTo: (p, y) => p.a * p.b * y,
      build: p => prism(rect(p.a, p.b), p.c), cubes: p => [p.a, p.b, p.c],
      dims: (p, o) => [
        { a: [-p.a / 2, 0, p.b / 2 + o.m], b: [p.a / 2, 0, p.b / 2 + o.m], sym: 'a', val: p.a },
        { a: [p.a / 2 + o.m, 0, p.b / 2], b: [p.a / 2 + o.m, 0, -p.b / 2], sym: 'b', val: p.b },
        { a: [p.a / 2 + o.m * 0.7, 0, p.b / 2 + o.m * 0.7], b: [p.a / 2 + o.m * 0.7, p.c, p.b / 2 + o.m * 0.7], sym: 'c', val: p.c }
      ],
      steps: (p, u) => bh({ abF: 'A<sub>b</sub> = a · b', abSub: `${f(p.a)} · ${f(p.b)}`, Ab: p.a * p.b, hs: 'c', h: p.c, u }),
      decoys: [['V = a + b + c', 'Sumar les dimensions no dona el volum.'], ['V = 2 · (a·b + a·c + b·c)', 'Aquesta és l\'àrea total de les cares.'], ['V = a · b', 'Això només és l\'àrea de la base.']],
      wrong: p => [
        { v: p.a * p.b, msg: 'Només has calculat l\'àrea de la base. Falta multiplicar per l\'altura.' },
        { v: p.a + p.b + p.c, msg: 'Has sumat les dimensions. Cal multiplicar-les.' },
        { v: 2 * (p.a * p.b + p.a * p.c + p.b * p.c), msg: 'Això és l\'àrea total de les cares, no el volum.' }
      ]
    },

    prisma3: {
      name: 'Prisma triangular', del: 'del prisma triangular', color: C.prismes,
      params: [
        { k: 'b', label: 'Base del triangle (b)', min: 1, max: 10, step: 0.5, def: 4 },
        { k: 't', label: 'Altura del triangle (t)', min: 1, max: 10, step: 0.5, def: 3 },
        { k: 'h', label: 'Altura del prisma (h)', min: 1, max: 12, step: 0.5, def: 6 }
      ],
      H: p => p.h, Ab: p => p.b * p.t / 2, V: p => p.b * p.t / 2 * p.h,
      formula: 'V = (b · t / 2) · h', baseFormula: 'A<sub>b</sub> = (b · t) / 2',
      baseSub: p => `(${f(p.b)} · ${f(p.t)}) / 2`, volSub: p => `${f(p.b * p.t / 2)} · ${f(p.h)}`,
      baseShape: p => poly(triPts(p.b, p.t)), scaleAt: () => 1, upTo: (p, y) => p.b * p.t / 2 * y,
      build: p => prism(poly(triPts(p.b, p.t)), p.h),
      dims: (p, o) => [
        { a: [-p.b / 2, p.h, p.t / 2], b: [p.b / 2, p.h, p.t / 2], sym: 'b', val: p.b },
        { a: [0, p.h, p.t / 2], b: [0, p.h, -p.t / 2], sym: 't', val: p.t, dashed: true },
        { a: [p.b / 2 + o.m * 0.7, 0, p.t / 2], b: [p.b / 2 + o.m * 0.7, p.h, p.t / 2], sym: 'h', val: p.h }
      ],
      steps: (p, u) => bh({ abF: 'A<sub>b</sub> = (b · t) / 2', abSub: `(${f(p.b)} · ${f(p.t)}) / 2`, Ab: p.b * p.t / 2, hs: 'h', h: p.h, u }),
      decoys: [['V = b · t · h', 'Falta dividir per 2: l\'àrea del triangle és (b · t) / 2.'], ['V = (b · t · h) / 3', 'Dividir per 3 és per a piràmides i cons.'], ['V = (b + t) · h', 'L\'àrea del triangle no és b + t.']],
      wrong: p => [
        { v: p.b * p.t * p.h, msg: 'Has oblidat dividir per 2. L\'àrea del triangle és (b · t) / 2.' },
        { v: p.b * p.t / 2, msg: 'Només has calculat l\'àrea de la base. Falta multiplicar per l\'altura del prisma.' },
        { v: p.b * p.t * p.h / 3, msg: 'Dividir per 3 és per a piràmides i cons. Un prisma és A<sub>b</sub> · h.' }
      ]
    },

    prisma6: {
      name: 'Prisma hexagonal', del: 'del prisma hexagonal', color: C.prismes,
      params: [
        { k: 'c', label: 'Costat de la base (c)', min: 1, max: 6, step: 0.5, def: 2 },
        { k: 'h', label: 'Altura (h)', min: 1, max: 12, step: 0.5, def: 5 }
      ],
      ap: p => p.ap || p.c * SQ3 / 2,
      H: p => p.h, Ab: p => 3 * p.c * V.SHAPES.prisma6.ap(p), V: p => 3 * p.c * V.SHAPES.prisma6.ap(p) * p.h,
      formula: 'V = (P · ap / 2) · h', baseFormula: 'A<sub>b</sub> = (P · ap) / 2',
      baseSub: p => `(6 · ${f(p.c)} · ${f(V.SHAPES.prisma6.ap(p))}) / 2`,
      volSub: p => `${f(V.SHAPES.prisma6.Ab(p))} · ${f(p.h)}`,
      baseShape: p => poly(hexPts(p.c)), scaleAt: () => 1, upTo: (p, y) => V.SHAPES.prisma6.Ab(p) * y,
      build: p => prism(poly(hexPts(p.c)), p.h),
      dims: (p, o) => {
        const ap = V.SHAPES.prisma6.ap(p);
        return [
          { a: [-p.c / 2, 0, ap + o.m], b: [p.c / 2, 0, ap + o.m], sym: 'c', val: p.c },
          { a: [0, p.h, 0], b: [0, p.h, ap], sym: 'ap', val: ap, dashed: true },
          { a: [p.c + o.m * 0.7, 0, 0], b: [p.c + o.m * 0.7, p.h, 0], sym: 'h', val: p.h }
        ];
      },
      steps: (p, u) => {
        const ap = V.SHAPES.prisma6.ap(p), P = 6 * p.c;
        return [{ t: 'Perímetre', m: `P = 6 · c = 6 · ${f(p.c)} = ${f(P)} ${u}` }].concat(
          bh({ abF: 'A<sub>b</sub> = (P · ap) / 2', abSub: `(${f(P)} · ${f(ap)}) / 2`, Ab: P * ap / 2, hs: 'h', h: p.h, u }));
      },
      decoys: [['V = P · ap · h', 'Falta dividir per 2 en l\'àrea del polígon.'], ['V = 6 · c · h', 'Això és l\'àrea lateral del prisma.'], ['V = (P · ap · h) / 3', 'Dividir per 3 és per a piràmides.']],
      wrong: p => {
        const S = V.SHAPES.prisma6, ap = S.ap(p);
        return [
          { v: 6 * p.c * ap * p.h, msg: 'L\'àrea d\'un polígon regular és (P · ap) / 2: falta dividir per 2.' },
          { v: S.Ab(p), msg: 'Només has calculat l\'àrea de la base. Falta multiplicar per l\'altura.' },
          { v: 6 * p.c * p.h, msg: 'Això és l\'àrea lateral (6 rectangles), no el volum.' }
        ];
      }
    },

    cilindre: {
      name: 'Cilindre', del: 'del cilindre', color: C.cilindres,
      params: [
        { k: 'r', label: 'Radi (r)', min: 0.5, max: 6, step: 0.5, def: 2 },
        { k: 'h', label: 'Altura (h)', min: 1, max: 12, step: 0.5, def: 5 }
      ],
      H: p => p.h, Ab: p => PI * p.r * p.r, V: p => PI * p.r * p.r * p.h,
      formula: 'V = π · r² · h', baseFormula: 'A<sub>b</sub> = π · r²',
      baseSub: p => `π · ${f(p.r)}²`, volSub: p => `π · ${f(p.r)}² · ${f(p.h)}`,
      baseShape: p => circle(p.r), scaleAt: () => 1, upTo: (p, y) => PI * p.r * p.r * y,
      build: p => cyl(p.r, p.r, p.h),
      dims: (p, o) => [
        o.diam ? { a: [-p.r, p.h, 0], b: [p.r, p.h, 0], sym: 'd', val: 2 * p.r, dashed: true }
          : { a: [0, p.h, 0], b: [p.r, p.h, 0], sym: 'r', val: p.r, dashed: true },
        { a: [(p.r + o.m) * 0.82, 0, -(p.r + o.m) * 0.57], b: [(p.r + o.m) * 0.82, p.h, -(p.r + o.m) * 0.57], sym: 'h', val: p.h }
      ],
      steps: (p, u) => bh({ abF: 'A<sub>b</sub> = π · r²', abSub: `π · ${f(p.r)}²`, Ab: PI * p.r * p.r, hs: 'h', h: p.h, u }),
      decoys: [['V = 2 · π · r · h', 'Aquesta és l\'àrea lateral del cilindre.'], ['V = (π · r² · h) / 3', 'Aquesta és la fórmula del con.'], ['V = π · r · h', 'Falta elevar el radi al quadrat.']],
      wrong: p => [
        { v: PI * p.r * p.r, msg: 'Has calculat l\'àrea de la base. Falta multiplicar per l\'altura.' },
        { v: PI * 4 * p.r * p.r * p.h, msg: 'Has fet servir el diàmetre en lloc del radi. Recorda: r = d / 2.' },
        { v: 2 * PI * p.r * p.h, msg: 'Això és l\'àrea lateral (2 · π · r · h). Per al volum cal π · r² · h.' },
        { v: PI * p.r * p.h, msg: 'No has elevat el radi al quadrat: r² = r · r.' },
        { v: p.r * p.r * p.h, msg: 'T\'has oblidat de multiplicar per π (≈ 3,14).' },
        { v: PI * p.r * p.r * p.h / 3, msg: 'Has dividit per 3, però això només es fa en el con. El cilindre és π · r² · h.' }
      ]
    },

    piramide: {
      name: 'Piràmide quadrada', del: 'de la piràmide', color: C.piramides,
      params: [
        { k: 'l', label: 'Costat de la base (l)', min: 1, max: 10, step: 0.5, def: 4 },
        { k: 'h', label: 'Altura (h)', min: 1, max: 12, step: 0.5, def: 6 }
      ],
      H: p => p.h, Ab: p => p.l * p.l, V: p => p.l * p.l * p.h / 3,
      formula: 'V = (l² · h) / 3', baseFormula: 'A<sub>b</sub> = l²',
      baseSub: p => `${f(p.l)}²`, volSub: p => `(${f(p.l * p.l)} · ${f(p.h)}) / 3`,
      baseShape: p => rect(p.l, p.l), scaleAt: (p, y) => 1 - y / p.h,
      upTo: (p, y) => p.l * p.l * p.h / 3 * (1 - Math.pow(1 - y / p.h, 3)),
      build: p => pyramid(sqPts(p.l), p.h),
      dims: (p, o) => [
        { a: [-p.l / 2, 0, p.l / 2 + o.m], b: [p.l / 2, 0, p.l / 2 + o.m], sym: 'l', val: p.l },
        { a: [0, 0, 0], b: [0, p.h, 0], sym: 'h', val: p.h, dashed: true }
      ],
      steps: (p, u) => bh({ abF: 'A<sub>b</sub> = l²', abSub: `${f(p.l)}²`, Ab: p.l * p.l, hs: 'h', h: p.h, u, third: true }),
      decoys: [['V = l² · h', 'Aquest és el volum del prisma: a la piràmide cal dividir per 3.'], ['V = (l² · h) / 2', 'Es divideix per 3, no per 2.'], ['V = 4 · l · h', 'Això no és un volum.']],
      wrong: p => [
        { v: p.l * p.l * p.h, msg: 'Has oblidat dividir per 3. Una piràmide és la tercera part del prisma amb la mateixa base i altura.' },
        { v: p.l * p.l * p.h / 2, msg: 'Es divideix per 3, no per 2.' },
        { v: p.l * p.l, msg: 'Només has calculat l\'àrea de la base.' }
      ]
    },

    con: {
      name: 'Con', del: 'del con', color: C.piramides,
      params: [
        { k: 'r', label: 'Radi (r)', min: 0.5, max: 6, step: 0.5, def: 2 },
        { k: 'h', label: 'Altura (h)', min: 1, max: 12, step: 0.5, def: 5 }
      ],
      H: p => p.h, Ab: p => PI * p.r * p.r, V: p => PI * p.r * p.r * p.h / 3,
      formula: 'V = (π · r² · h) / 3', baseFormula: 'A<sub>b</sub> = π · r²',
      baseSub: p => `π · ${f(p.r)}²`, volSub: p => `(π · ${f(p.r)}² · ${f(p.h)}) / 3`,
      baseShape: p => circle(p.r), scaleAt: (p, y) => 1 - y / p.h,
      upTo: (p, y) => PI * p.r * p.r * p.h / 3 * (1 - Math.pow(1 - y / p.h, 3)),
      build: p => cyl(0.0001, p.r, p.h),
      dims: (p, o) => [
        o.diam ? { a: [-p.r, 0, 0], b: [p.r, 0, 0], sym: 'd', val: 2 * p.r, dashed: true }
          : { a: [0, 0, 0], b: [p.r, 0, 0], sym: 'r', val: p.r, dashed: true },
        { a: [0, 0, 0], b: [0, p.h, 0], sym: 'h', val: p.h, dashed: true }
      ],
      steps: (p, u) => bh({ abF: 'A<sub>b</sub> = π · r²', abSub: `π · ${f(p.r)}²`, Ab: PI * p.r * p.r, hs: 'h', h: p.h, u, third: true }),
      decoys: [['V = π · r² · h', 'Aquest és el volum del cilindre: el con en és la tercera part.'], ['V = (π · r · h) / 3', 'Falta elevar el radi al quadrat.'], ['V = (π · r² · h) / 2', 'Es divideix per 3, no per 2.']],
      wrong: p => [
        { v: PI * p.r * p.r * p.h, msg: 'Has oblidat dividir per 3. Un con és la tercera part del cilindre amb la mateixa base i altura.' },
        { v: PI * 4 * p.r * p.r * p.h / 3, msg: 'Has fet servir el diàmetre en lloc del radi. Recorda: r = d / 2.' },
        { v: PI * p.r * p.r * p.h / 2, msg: 'Es divideix per 3, no per 2.' },
        { v: PI * p.r * p.h / 3, msg: 'No has elevat el radi al quadrat: r² = r · r.' },
        { v: p.r * p.r * p.h / 3, msg: 'T\'has oblidat de multiplicar per π (≈ 3,14).' }
      ]
    },

    esfera: {
      name: 'Esfera', del: 'de l\'esfera', color: C.esferes,
      params: [{ k: 'r', label: 'Radi (r)', min: 0.5, max: 6, step: 0.5, def: 2 }],
      H: p => 2 * p.r, V: p => 4 / 3 * PI * Math.pow(p.r, 3),
      formula: 'V = (4/3) · π · r³',
      volSub: p => `(4/3) · π · ${f(p.r)}³`,
      baseShape: p => circle(p.r), scaleAt: (p, y) => Math.sqrt(Math.max(0, p.r * p.r - (y - p.r) * (y - p.r))) / p.r,
      upTo: (p, y) => PI * y * y * (3 * p.r - y) / 3,
      build: p => { const g = new THREE.SphereGeometry(p.r, 64, 40); g.translate(0, p.r, 0); return g; },
      dims: (p, o) => [o.diam
        ? { a: [-p.r, p.r, 0], b: [p.r, p.r, 0], sym: 'd', val: 2 * p.r, dashed: true }
        : { a: [0, p.r, 0], b: [p.r, p.r, 0], sym: 'r', val: p.r, dashed: true }],
      steps: (p, u) => [
        { t: 'Radi al cub', m: `r³ = ${f(p.r)} · ${f(p.r)} · ${f(p.r)} = ${f(Math.pow(p.r, 3))} ${u}³` },
        { t: 'Volum', m: `V = (4/3) · π · r³ = (4/3) · π · ${f(Math.pow(p.r, 3))} = <b>${f(4 / 3 * PI * Math.pow(p.r, 3))} ${u}³</b>` }
      ],
      decoys: [['V = 4 · π · r²', 'Aquesta és l\'àrea de la superfície de l\'esfera.'], ['V = (4/3) · π · r²', 'Per al volum cal r³, no r².'], ['V = π · r³', 'Falta el factor 4/3.']],
      wrong: p => [
        { v: 4 * PI * p.r * p.r, msg: 'Aquesta és l\'àrea de la superfície (4 · π · r²). El volum porta r³.' },
        { v: 4 / 3 * PI * p.r * p.r, msg: 'Has elevat el radi al quadrat. Per al volum cal r³.' },
        { v: PI * Math.pow(p.r, 3), msg: 'Falta multiplicar per 4/3.' },
        { v: 4 / 3 * PI * Math.pow(2 * p.r, 3), msg: 'Has fet servir el diàmetre en lloc del radi. Recorda: r = d / 2.' },
        { v: 4 * PI * Math.pow(p.r, 3), msg: 'Has multiplicat per 4 en lloc de per 4/3.' }
      ]
    },

    semiesfera: {
      name: 'Semiesfera', del: 'de la semiesfera', color: C.esferes,
      params: [{ k: 'r', label: 'Radi (r)', min: 0.5, max: 6, step: 0.5, def: 2 }],
      H: p => p.r, V: p => 2 / 3 * PI * Math.pow(p.r, 3),
      formula: 'V = (2/3) · π · r³',
      volSub: p => `(2/3) · π · ${f(p.r)}³`,
      baseShape: p => circle(p.r), scaleAt: (p, y) => Math.sqrt(Math.max(0, p.r * p.r - y * y)) / p.r,
      upTo: (p, y) => PI * (p.r * p.r * y - y * y * y / 3),
      build: p => new THREE.SphereGeometry(p.r, 64, 20, 0, 2 * PI, 0, PI / 2),
      dims: (p, o) => [{ a: [0, 0, 0], b: [p.r, 0, 0], sym: 'r', val: p.r, dashed: true }],
      steps: (p, u) => [
        { t: 'Radi al cub', m: `r³ = ${f(Math.pow(p.r, 3))} ${u}³` },
        { t: 'Volum', m: `V = (2/3) · π · r³ = (2/3) · π · ${f(Math.pow(p.r, 3))} = <b>${f(2 / 3 * PI * Math.pow(p.r, 3))} ${u}³</b>` }
      ],
      decoys: [['V = (4/3) · π · r³', 'Aquesta és l\'esfera sencera.'], ['V = 2 · π · r²', 'Això és una àrea.'], ['V = (2/3) · π · r²', 'Per al volum cal r³.']],
      wrong: p => [
        { v: 4 / 3 * PI * Math.pow(p.r, 3), msg: 'Has calculat l\'esfera sencera. La semiesfera n\'és la meitat.' },
        { v: 2 / 3 * PI * p.r * p.r, msg: 'Has elevat el radi al quadrat. Per al volum cal r³.' }
      ]
    }
  };

  V.SHAPE_ORDER = ['cub', 'ortoedre', 'prisma3', 'prisma6', 'cilindre', 'piramide', 'con', 'esfera', 'semiesfera'];

  // ---------- Icones (24×24, traç) ----------
  const ic = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${d}</svg>`;
  V.ICONS = {
    cub: ic('<path d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2z"/><path d="M4 7.2 12 11.6 20 7.2M12 11.6v9.6"/>'),
    ortoedre: ic('<path d="M2.5 9.5 9 6l12.5 3v7.5L15 20.5 2.5 17z"/><path d="M2.5 9.5 15 12.8l6.5-3.8M15 12.8v7.7"/>'),
    prisma3: ic('<path d="M12 3 19.5 6.5 5.5 7.5z"/><path d="M5.5 7.5v11l14-1v-11M5.5 18.5"/><path d="M12 3v11" stroke-dasharray="2 2"/>'),
    prisma6: ic('<path d="M7 4h10l4 3-4 3H7L3 7z"/><path d="M3 7v10l4 3h10l4-3V7M7 10v10M17 10v10"/>'),
    cilindre: ic('<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/>'),
    piramide: ic('<path d="M12 3 3 16.5l7.5 4L21 15.5z"/><path d="M12 3l-1.5 17.5"/>'),
    con: ic('<path d="M12 3 5 18M12 3l7 15"/><ellipse cx="12" cy="18" rx="7" ry="2.6"/>'),
    esfera: ic('<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="8.5" ry="3"/>'),
    semiesfera: ic('<path d="M3.5 15a8.5 8.5 0 0 1 17 0"/><ellipse cx="12" cy="15" rx="8.5" ry="3"/>'),
    unitats: ic('<path d="M6 4h10l-1 16H7z"/><path d="M6 4h12M10 8h4M10 12h4M10 16h4"/>'),
    invers: ic('<path d="M4 4h16v16H4z"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"/>'),
    barreja: ic('<path d="M4 7h4l8 10h4M4 17h4l2.5-3M14 10l2-3h4M17 4l3 3-3 3M17 14l3 3-3 3"/>')
  };
})(window.VOL);
