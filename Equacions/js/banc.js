/* ============================================================
   banc.js — BANC D'EXEMPLES de tots els laboratoris
   Un sol lloc per afegir, treure o canviar exemples.
   · groups: botons del selector, amb un nom que descriu el contingut.
   · items: cada exemple porta l'identificador, el grup (level) i les dades.
   Els coeficients es poden escriure com a enters o com a text ('1/2').
   Els polinomis van de menor a major grau: [b, a] vol dir a·x + b.
   ============================================================ */
(function (global) {
  'use strict';
  const L = (global.L = global.L || {});

  L.BANC = {
    /* ---- M0 · Què és una equació? (L = R, primer grau) ---- */
    m0: {
      groups: [[1, 'Solució entera'], [2, 'Negatius i fraccions'], [3, 'Casos especials']],
      items: [
        { id: 'clas', level: 1, L: [4, 3], R: [12, 1] },          // 3x + 4 = x + 12 → 4
        { id: 'e1', level: 1, L: [1, 2], R: [11] },               // 2x + 1 = 11 → 5
        { id: 'e2', level: 1, L: [-1, 4], R: [5, 2] },            // 4x − 1 = 2x + 5 → 3
        { id: 'e3', level: 1, L: [7, 1], R: [1, 2] },             // x + 7 = 2x + 1 → 6
        { id: 'e4', level: 1, L: [0, 6], R: [10, 4] },            // 6x = 4x + 10 → 5
        { id: 'neg', level: 2, L: [0, 5], R: [-4, 3] },           // 5x = 3x − 4 → −2
        { id: 'n1', level: 2, L: [9, 2], R: [0, -1] },            // 2x + 9 = −x → −3
        { id: 'n2', level: 2, L: [1, 4], R: [2, 2] },             // 4x + 1 = 2x + 2 → 1/2
        { id: 'n3', level: 2, L: [-2, 3], R: [-7, 1] },           // 3x − 2 = x − 7 → −5/2
        { id: 'n4', level: 2, L: [5, -2], R: [11, 1] },           // −2x + 5 = x + 11 → −2
        { id: 'idem', level: 3, L: [2, 2], R: [2, 2], Ldisp: { k: 2, m: 1 } },   // 2(x + 1) = 2x + 2
        { id: 'cont', level: 3, L: [1, 2], R: [3, 2] },           // 2x + 1 = 2x + 3
        { id: 'i2', level: 3, L: [6, 3], R: [6, 3], Ldisp: { k: 3, m: 2 } },     // 3(x + 2) = 3x + 6
        { id: 'c2', level: 3, L: [5, 1], R: [-1, 1] }             // x + 5 = x − 1
      ]
    },

    /* ---- M1 · Equivalències (L = R; grau ≤ 2 només al cas avançat) ---- */
    m1: {
      groups: [[1, 'Dos passos'], [2, 'x als dos costats'], [3, 'Parèntesis i fraccions'], [4, 'Casos especials']],
      items: [
        { id: 'sim', level: 1, L: [3, 2], R: [11] },              // 2x + 3 = 11 → 4
        { id: 's2', level: 1, L: [-4, 5], R: [16] },              // 5x − 4 = 16 → 4
        { id: 's3', level: 1, L: [7, 3], R: [-5] },               // 3x + 7 = −5 → −4
        { id: 's4', level: 1, L: [1, -2], R: [9] },               // −2x + 1 = 9 → −4
        { id: 's5', level: 1, L: [-3, 4], R: [6] },               // 4x − 3 = 6 → 9/4
        { id: 'bas', level: 2, L: [4, 3], R: [12, 1] },           // 3x + 4 = x + 12 → 4
        { id: 'mit', level: 2, L: [-4, 5], R: [8, 2] },           // 5x − 4 = 2x + 8 → 4
        { id: 'd2', level: 2, L: [2, 7], R: [-10, 3] },           // 7x + 2 = 3x − 10 → −3
        { id: 'd3', level: 2, L: [-5, 2], R: [3, 6] },            // 2x − 5 = 6x + 3 → −2
        { id: 'd4', level: 2, L: [9, 1], R: [0, 4] },             // x + 9 = 4x → 3
        { id: 'd5', level: 2, L: [-1, 6], R: [1, 2] },            // 6x − 1 = 2x + 1 → 1/2
        { id: 'fra', level: 3, L: [1, '1/2'], R: ['1/4'] },       // x/2 + 1 = 1/4 → −3/2
        { id: 'f2', level: 3, L: [-2, '1/3'], R: [1] },           // x/3 − 2 = 1 → 9
        { id: 'f3', level: 3, L: [0, '3/4'], R: [6] },            // 3x/4 = 6 → 8
        { id: 'p1', level: 3, L: [6, 2], R: [14], Ldisp: { k: 2, m: 3 } },       // 2(x + 3) = 14 → 4
        { id: 'p2', level: 3, L: [3, 3], R: [11, 1], Ldisp: { k: 3, m: 1 } },    // 3(x + 1) = x + 11 → 4
        { id: 'ide', level: 4, L: [2, 2], R: [2, 2], Ldisp: { k: 2, m: 1 } },    // identitat
        { id: 'id2', level: 4, L: [8, 4], R: [8, 4], Ldisp: { k: 4, m: 2 } },    // 4(x + 2) = 4x + 8
        { id: 'con', level: 4, L: [1, 2], R: [3, 2] },            // 2x + 1 = 2x + 3
        { id: 'co2', level: 4, L: [-3, 1], R: [5, 1] },           // x − 3 = x + 5
        { id: 'qua', level: 4, L: [0, 0, 1], R: [0, 1], advanced: true }          // x² = x
      ]
    },

    /* ---- M2 · Inequacions a·x + b ⋈ c ---- */
    m2: {
      groups: [[1, 'Coeficient positiu'], [2, 'Coeficient negatiu'], [3, 'Amb fraccions']],
      items: [
        { id: 'un', level: 1, a: 3, b: -1, sign: '<=', c: 8 },    // x ≤ 3
        { id: 'u2', level: 1, a: 2, b: 5, sign: '>', c: 1 },      // x > −2
        { id: 'u3', level: 1, a: 4, b: -3, sign: '<', c: 9 },     // x < 3
        { id: 'u4', level: 1, a: 5, b: 2, sign: '>=', c: -8 },    // x ≥ −2
        { id: 'cen', level: 2, a: -2, b: 3, sign: '>', c: 7 },    // x < −2
        { id: 'nv', level: 2, a: -1, b: 4, sign: '>=', c: 1 },    // x ≤ 3
        { id: 'n2', level: 2, a: -3, b: -2, sign: '<=', c: 7 },   // x ≥ −3
        { id: 'n3', level: 2, a: -4, b: 1, sign: '<', c: -7 },    // x > 2
        { id: 'n4', level: 2, a: -5, b: 0, sign: '>=', c: 10 },   // x ≤ −2
        { id: 'fra', level: 3, a: '1/2', b: 1, sign: '>', c: 4 }, // x > 6
        { id: 'f2', level: 3, a: '-1/3', b: 2, sign: '<=', c: 0 },// x ≥ 6
        { id: 'f3', level: 3, a: '3/4', b: -1, sign: '<', c: 2 }, // x < 4
        { id: 'f4', level: 3, a: '-1/2', b: 1, sign: '>=', c: 3 } // x ≤ −4
      ]
    },

    /* ---- M3 · Segon grau a·x² + b·x + c = 0 ---- */
    m3: {
      groups: [[1, 'Dues arrels'], [2, 'Una o cap'], [3, 'Incompletes'], [4, 'Amb radicals']],
      items: [
        { id: 'two', level: 1, a: 1, b: -5, c: 6 },               // 2 i 3
        { id: 't2', level: 1, a: 1, b: 1, c: -6 },                // −3 i 2
        { id: 't3', level: 1, a: 1, b: -2, c: -8 },               // −2 i 4
        { id: 't4', level: 1, a: 2, b: -2, c: -12 },              // −2 i 3
        { id: 't5', level: 1, a: -1, b: 1, c: 6 },                // −2 i 3 (obre cap avall)
        { id: 'doub', level: 2, a: 1, b: -4, c: 4 },              // 2 doble
        { id: 'd2', level: 2, a: 1, b: 6, c: 9 },                 // −3 doble
        { id: 'd3', level: 2, a: 4, b: -4, c: 1 },                // 1/2 doble
        { id: 'none', level: 2, a: 1, b: 1, c: 1 },               // cap
        { id: 'n2', level: 2, a: 1, b: -2, c: 5 },                // cap
        { id: 'n3', level: 2, a: -1, b: 2, c: -3 },               // cap (cap avall)
        { id: 'incb', level: 3, a: 1, b: 0, c: -4 },              // ±2
        { id: 'i2', level: 3, a: 1, b: 0, c: -9 },                // ±3
        { id: 'i3', level: 3, a: 3, b: 0, c: -12 },               // ±2
        { id: 'i4', level: 3, a: 1, b: 0, c: 4 },                 // cap
        { id: 'incc', level: 3, a: 2, b: -6, c: 0 },              // 0 i 3
        { id: 'i5', level: 3, a: 1, b: 5, c: 0 },                 // −5 i 0
        { id: 'irr', level: 4, a: 1, b: -3, c: 1 },               // (3 ± √5)/2
        { id: 'r2', level: 4, a: 1, b: 0, c: -2 },                // ±√2
        { id: 'r3', level: 4, a: 1, b: 2, c: -1 },                // −1 ± √2
        { id: 'r4', level: 4, a: 2, b: -4, c: 1 }                 // (2 ± √2)/2
      ]
    },

    /* ---- M4 · Sistemes A·x + B·y = C ---- */
    m4: {
      groups: [[1, 'Es tallen'], [2, 'Paral·leles o la mateixa'], [3, 'Casos especials']],
      items: [
        { id: 'det', level: 1, A1: 2, B1: -1, C1: -1, A2: 1, B2: 1, C2: 4 },     // (1, 3)
        { id: 'k2', level: 1, A1: 1, B1: 1, C1: 5, A2: 1, B2: -1, C2: 1 },       // (3, 2)
        { id: 'k3', level: 1, A1: 2, B1: 1, C1: 7, A2: 1, B2: -1, C2: -1 },      // (2, 3)
        { id: 'k4', level: 1, A1: 3, B1: 2, C1: 4, A2: 1, B2: -1, C2: 3 },       // (2, −1)
        { id: 'k5', level: 1, A1: 1, B1: 2, C1: 0, A2: 3, B2: -1, C2: 7 },       // (2, −1)
        { id: 'coin', level: 2, A1: 2, B1: -1, C1: -1, A2: 4, B2: -2, C2: -2 },  // la mateixa recta
        { id: 'par', level: 2, A1: 2, B1: -1, C1: -1, A2: 4, B2: -2, C2: -3 },   // paral·leles
        { id: 'q2', level: 2, A1: 1, B1: 1, C1: 2, A2: 2, B2: 2, C2: 4 },        // la mateixa recta
        { id: 'q3', level: 2, A1: 1, B1: -2, C1: 1, A2: -2, B2: 4, C2: 3 },      // paral·leles
        { id: 'q4', level: 2, A1: 3, B1: -1, C1: 2, A2: 6, B2: -2, C2: 1 },      // paral·leles
        { id: 'ver', level: 3, A1: 1, B1: 0, C1: 2, A2: 1, B2: 1, C2: 4 },       // recta vertical x = 2
        { id: 'hor', level: 3, A1: 0, B1: 1, C1: 3, A2: 1, B2: -1, C2: -1 },     // recta horitzontal y = 3
        { id: 'far', level: 3, A1: 1, B1: 1, C1: 30, A2: 1, B2: -1, C2: 10 },    // solució llunyana (20, 10)
        { id: 'frs', level: 3, A1: 2, B1: 1, C1: 1, A2: 1, B2: -1, C2: 1 }       // solució amb fraccions (2/3, −1/3)
      ]
    },

    /* ---- M5 · Biquadrades a·x⁴ + b·x² + c = 0 ---- */
    m5: {
      groups: [[1, 'Quatre o dues arrels'], [2, 'Cap arrel o t doble'], [3, 'Tres o una arrel']],
      items: [
        { id: 'p4', level: 1, a: 1, b: -5, c: 4 },                // ±1, ±2
        { id: 'q4', level: 1, a: 1, b: -13, c: 36 },              // ±2, ±3
        { id: 'r4', level: 1, a: 1, b: -10, c: 9 },               // ±1, ±3
        { id: 'p2', level: 1, a: 1, b: 0, c: -1 },                // ±1
        { id: 'q2', level: 1, a: 1, b: -3, c: -4 },               // ±2 (t = −1 es descarta)
        { id: 'r2', level: 1, a: 1, b: 0, c: -16 },               // ±2
        { id: 'p0', level: 2, a: 1, b: 3, c: 2 },                 // cap
        { id: 'q0', level: 2, a: 1, b: 4, c: 3 },                 // cap
        { id: 'r0', level: 2, a: 1, b: 0, c: 1 },                 // cap
        { id: 'pd', level: 2, a: 1, b: -2, c: 1 },                // t = 1 doble → ±1
        { id: 'qd', level: 2, a: 1, b: -8, c: 16 },               // t = 4 doble → ±2
        { id: 'p3', level: 3, a: 1, b: -1, c: 0 },                // −1, 0, 1
        { id: 'q3', level: 3, a: 1, b: -4, c: 0 },                // −2, 0, 2
        { id: 'p1', level: 3, a: 1, b: 0, c: 0 },                 // 0
        { id: 'q1', level: 3, a: 1, b: 2, c: 0 }                  // 0 (t = −2 es descarta)
      ]
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
