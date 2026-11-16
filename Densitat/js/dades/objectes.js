/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Dades dels objectes del prestatge (03-dades-de-referencia.md §6).
 * Les magnituds derivades (massa, densitat, etc.) es calculen sempre al motor físic;
 * aquí es defineix l'estructura intrínseca de cada objecte (forma, mides, parts, cavitats).
 */

export const OBJECTES_PRESTATGE = {
  // 6.1 Joc bàsic (fase 1a)
  A: {
    id: "A",
    etiqueta: "A",
    nom: "Bloc metàl·lic",
    forma: "ortoedre",
    mides: { a: 2.5, b: 4.0, c: 10.0 }, // 100 cm³, dimensió mínima 2.5x4 (diagonal o secció 4.0 cm)
    parts: [{ material: "alumini", volum: 100 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  B: {
    id: "B",
    etiqueta: "B",
    nom: "Bloc de fusta",
    forma: "ortoedre",
    mides: { a: 4.0, b: 4.0, c: 12.5 }, // 200 cm³
    parts: [{ material: "pi", volum: 200 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  C: {
    id: "C",
    etiqueta: "C",
    nom: "Bola de plastilina",
    forma: "esfera",
    mides: { diametre: 4.2 }, // Volum exacte: 40 cm³
    parts: [{ material: "plastilina", volum: 40 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },

  // 6.2 Joc ampliat (fases 1a i 1b)
  cilindre_alumini: {
    id: "cilindre_alumini",
    etiqueta: "CA",
    nom: "Cilindre d'alumini",
    forma: "cilindre",
    mides: { diametre: 2.0, alcada: 6.37 },
    parts: [{ material: "alumini", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  cilindre_plom: {
    id: "cilindre_plom",
    etiqueta: "CP",
    nom: "Cilindre de plom",
    forma: "cilindre",
    mides: { diametre: 2.0, alcada: 6.37 },
    parts: [{ material: "plom", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  clau: {
    id: "clau",
    etiqueta: "Cl",
    nom: "Clau de ferro",
    forma: "cilindre",
    mides: { diametre: 0.8, alcada: 4.0 },
    parts: [{ material: "ferro", volum: 2 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  taulo: {
    id: "taulo",
    etiqueta: "T",
    nom: "Tauló de pi",
    forma: "ortoedre",
    mides: { a: 10.0, b: 20.0, c: 20.0 },
    parts: [{ material: "pi", volum: 4000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  patata: {
    id: "patata",
    etiqueta: "Pt",
    nom: "Patata",
    forma: "irregular",
    mides: { diametre: 4.8, alcada: 8.8 },
    parts: [{ material: "patata", volum: 160 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  pedra: {
    id: "pedra",
    etiqueta: "Pd",
    nom: "Pedra de granit",
    forma: "irregular",
    mides: { diametre: 3.2, alcada: 4.0 },
    parts: [{ material: "granit", volum: 30 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  tap: {
    id: "tap",
    etiqueta: "Tp",
    nom: "Tap de suro",
    forma: "cilindre",
    mides: { diametre: 2.2, alcada: 5.26 },
    parts: [{ material: "suro", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  espelma: {
    id: "espelma",
    etiqueta: "Es",
    nom: "Espelma de cera",
    forma: "cilindre",
    mides: { diametre: 3.0, alcada: 7.07 },
    parts: [{ material: "cera", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  glaco: {
    id: "glaco",
    etiqueta: "Gl",
    nom: "Glaçó de gel",
    forma: "cub",
    mides: { a: 3.1, b: 3.1, c: 3.12 },
    parts: [{ material: "gel", volum: 30 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  ou: {
    id: "ou",
    etiqueta: "Ou",
    nom: "Ou fresc",
    forma: "esfera",
    mides: { diametre: 4.5 }, // Massa 60 g (56 cm³ amb d=1.0714 o valor explícit 60 g)
    massaFixa: 60,
    parts: [{ material: "ou", volum: 56 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  poma: {
    id: "poma",
    etiqueta: "Pm",
    nom: "Poma",
    forma: "esfera",
    mides: { diametre: 7.26 },
    parts: [{ material: "poma", volum: 200 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  bala_vidre: {
    id: "bala_vidre",
    etiqueta: "BV",
    nom: "Bala de vidre",
    forma: "esfera",
    mides: { diametre: 1.97 },
    parts: [{ material: "vidre", volum: 4 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  peca_escacs: {
    id: "peca_escacs",
    etiqueta: "PE",
    nom: "Peça d'escacs de banús",
    forma: "cilindre",
    mides: { diametre: 2.4, alcada: 4.42 },
    parts: [{ material: "banus", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  pedra_tosca: {
    id: "pedra_tosca",
    etiqueta: "PT",
    nom: "Pedra tosca",
    forma: "irregular",
    mides: { diametre: 4.2, alcada: 4.5 },
    parts: [{ material: "tosca", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  dau_polietile: {
    id: "dau_polietile",
    etiqueta: "DP",
    nom: "Dau de polietilè",
    forma: "cub",
    mides: { a: 2.0, b: 2.0, c: 2.0 },
    parts: [{ material: "polietile", volum: 8 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  dau_nilo: {
    id: "dau_nilo",
    etiqueta: "DN",
    nom: "Dau de niló",
    forma: "cub",
    mides: { a: 2.0, b: 2.0, c: 2.0 },
    parts: [{ material: "nilo", volum: 8 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },

  // Quatre esferes (D2): Pi i plastilina de 20 i 60 cm³
  esfera_pi_20: {
    id: "esfera_pi_20",
    etiqueta: "E1",
    nom: "Esfera petita de fusta",
    forma: "esfera",
    mides: { diametre: 3.37 },
    parts: [{ material: "pi", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  esfera_pi_60: {
    id: "esfera_pi_60",
    etiqueta: "E2",
    nom: "Esfera gran de fusta",
    forma: "esfera",
    mides: { diametre: 4.86 },
    parts: [{ material: "pi", volum: 60 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  esfera_plast_20: {
    id: "esfera_plast_20",
    etiqueta: "E3",
    nom: "Esfera petita de plastilina",
    forma: "esfera",
    mides: { diametre: 3.37 },
    parts: [{ material: "plastilina", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  esfera_plast_60: {
    id: "esfera_plast_60",
    etiqueta: "E4",
    nom: "Esfera gran de plastilina",
    forma: "esfera",
    mides: { diametre: 4.86 },
    parts: [{ material: "plastilina", volum: 60 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },

  // Boles per a la columna de líquids (D3): 4 cm³ de poliestirè, cera, polietilè, niló i estany
  bola_col_poliestire: {
    id: "bola_col_poliestire",
    etiqueta: "B1",
    nom: "Bola de poliestirè",
    forma: "esfera",
    mides: { diametre: 1.97 },
    parts: [{ material: "poliestire", volum: 4 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  bola_col_cera: {
    id: "bola_col_cera",
    etiqueta: "B2",
    nom: "Bola de cera",
    forma: "esfera",
    mides: { diametre: 1.97 },
    parts: [{ material: "cera", volum: 4 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  bola_col_polietile: {
    id: "bola_col_polietile",
    etiqueta: "B3",
    nom: "Bola de polietilè",
    forma: "esfera",
    mides: { diametre: 1.97 },
    parts: [{ material: "polietile", volum: 4 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  bola_col_nilo: {
    id: "bola_col_nilo",
    etiqueta: "B4",
    nom: "Bola de niló",
    forma: "esfera",
    mides: { diametre: 1.97 },
    parts: [{ material: "nilo", volum: 4 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },
  bola_col_estany: {
    id: "bola_col_estany",
    etiqueta: "B5",
    nom: "Bola d'estany",
    forma: "esfera",
    mides: { diametre: 1.97 },
    parts: [{ material: "estany", volum: 4 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1a"
  },

  // Cubs bessons (C2): 10 cm³ de suro, pi, alumini, ferro, plom
  cub_suro_10: {
    id: "cub_suro_10",
    etiqueta: "CS",
    nom: "Cub de suro (10 cm³)",
    forma: "cub",
    mides: { a: 2.15, b: 2.15, c: 2.16 },
    parts: [{ material: "suro", volum: 10 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  cub_pi_10: {
    id: "cub_pi_10",
    etiqueta: "CPi",
    nom: "Cub de pi (10 cm³)",
    forma: "cub",
    mides: { a: 2.15, b: 2.15, c: 2.16 },
    parts: [{ material: "pi", volum: 10 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  cub_alumini_10: {
    id: "cub_alumini_10",
    etiqueta: "CAl",
    nom: "Cub d'alumini (10 cm³)",
    forma: "cub",
    mides: { a: 2.15, b: 2.15, c: 2.16 },
    parts: [{ material: "alumini", volum: 10 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  cub_ferro_10: {
    id: "cub_ferro_10",
    etiqueta: "CFe",
    nom: "Cub de ferro (10 cm³)",
    forma: "cub",
    mides: { a: 2.15, b: 2.15, c: 2.16 },
    parts: [{ material: "ferro", volum: 10 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  cub_plom_10: {
    id: "cub_plom_10",
    etiqueta: "CPb",
    nom: "Cub de plom (10 cm³)",
    forma: "cub",
    mides: { a: 2.15, b: 2.15, c: 2.16 },
    parts: [{ material: "plom", volum: 10 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },

  // Peces d'un quilo (C1): Poliestirè (20 000 cm³), Pi (2000 cm³), Alumini (370,37 cm³), Ferro (127,06 cm³)
  quilo_poliestire: {
    id: "quilo_poliestire",
    etiqueta: "1kg-Po",
    nom: "Peça d'1 kg de poliestirè",
    forma: "ortoedre",
    mides: { a: 20, b: 25, c: 40 },
    massaFixa: 1000,
    parts: [{ material: "poliestire", volum: 20000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  quilo_pi: {
    id: "quilo_pi",
    etiqueta: "1kg-Pi",
    nom: "Peça d'1 kg de pi",
    forma: "ortoedre",
    mides: { a: 10, b: 10, c: 20 },
    massaFixa: 1000,
    parts: [{ material: "pi", volum: 2000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  quilo_alumini: {
    id: "quilo_alumini",
    etiqueta: "1kg-Al",
    nom: "Peça d'1 kg d'alumini",
    forma: "ortoedre",
    mides: { a: 5, b: 7.4, c: 10 },
    massaFixa: 1000,
    parts: [{ material: "alumini", volum: 370.37 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  quilo_ferro: {
    id: "quilo_ferro",
    etiqueta: "1kg-Fe",
    nom: "Peça d'1 kg de ferro",
    forma: "ortoedre",
    mides: { a: 4, b: 5, c: 6.35 },
    massaFixa: 1000,
    parts: [{ material: "ferro", volum: 127.06 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },

  // Bloc regular per a A5 (2 × 4 × 5 cm = 40 cm³)
  bloc_regular_a5: {
    id: "bloc_regular_a5",
    etiqueta: "BR",
    nom: "Bloc regular (2 × 4 × 5 cm)",
    forma: "ortoedre",
    mides: { a: 2.0, b: 4.0, c: 5.0 },
    parts: [{ material: "pi", volum: 40 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },

  // 6.3 Objectes misteri (detectius de materials, C6)
  misteri_1: {
    id: "misteri_1",
    etiqueta: "M1",
    nom: "Objecte misteri M1",
    forma: "cilindre",
    mides: { diametre: 2.5, alcada: 8.15 },
    parts: [{ material: "alumini", volum: 40 }], // 108 g, 40 cm³ -> 2,70 g/cm³
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "1a"
  },
  misteri_2: {
    id: "misteri_2",
    etiqueta: "M2",
    nom: "Objecte misteri M2",
    forma: "ortoedre",
    mides: { a: 2.0, b: 2.5, c: 6.0 },
    parts: [{ material: "ferro", volum: 30 }], // 236,1 g, 30 cm³ -> 7,87 g/cm³
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "1a"
  },
  misteri_3: {
    id: "misteri_3",
    etiqueta: "M3",
    nom: "Objecte misteri M3",
    forma: "cilindre",
    mides: { diametre: 2.0, alcada: 7.96 },
    parts: [{ material: "coure", volum: 25 }], // 224 g, 25 cm³ -> 8,96 g/cm³
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "1a"
  },
  misteri_4: {
    id: "misteri_4",
    etiqueta: "M4",
    nom: "Objecte misteri M4",
    forma: "ortoedre",
    mides: { a: 2.0, b: 2.5, c: 10.0 },
    parts: [{ material: "pvc", volum: 50 }], // 70 g, 50 cm³ -> 1,40 g/cm³
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "1a"
  },
  misteri_5: {
    id: "misteri_5",
    etiqueta: "M5",
    nom: "Objecte misteri M5",
    forma: "cilindre",
    mides: { diametre: 2.0, alcada: 6.37 },
    parts: [{ material: "plom", volum: 20 }], // 226 g, 20 cm³ -> 11,30 g/cm³
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "1a"
  },
  misteri_6: {
    id: "misteri_6",
    etiqueta: "M6",
    nom: "Objecte misteri M6",
    forma: "ortoedre",
    mides: { a: 2.0, b: 2.0, c: 5.0 },
    parts: [{ material: "llauto", volum: 20 }], // 170 g, 20 cm³ -> 8,50 g/cm³
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "1a"
  },

  // 6.4 Fase 2 i 3: Esferes d'Arquimedes (E3, E4), cubs de fracció submergida (D6), boles buides, barques, submarí, corona
  arq_plast_20: {
    id: "arq_plast_20",
    etiqueta: "AP20",
    nom: "Esfera de plastilina (20 cm³)",
    forma: "esfera",
    mides: { diametre: 3.37 },
    parts: [{ material: "plastilina", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  arq_plast_50: {
    id: "arq_plast_50",
    etiqueta: "AP50",
    nom: "Esfera de plastilina (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "plastilina", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  arq_ceram_20: {
    id: "arq_ceram_20",
    etiqueta: "AC20",
    nom: "Esfera de ceràmica (20 cm³)",
    forma: "esfera",
    mides: { diametre: 3.37 },
    parts: [{ material: "ceramica", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  arq_ceram_50: {
    id: "arq_ceram_50",
    etiqueta: "AC50",
    nom: "Esfera de ceràmica (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "ceramica", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  arq_acer_20: {
    id: "arq_acer_20",
    etiqueta: "AA20",
    nom: "Esfera d'acer (20 cm³)",
    forma: "esfera",
    mides: { diametre: 3.37 },
    parts: [{ material: "acer", volum: 20 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  arq_acer_50: {
    id: "arq_acer_50",
    etiqueta: "AA50",
    nom: "Esfera d'acer (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "acer", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },

  // Quatre esferes que suren (E4): cera, polietilè, pi i suro de 50 cm³
  esf_sura_cera: {
    id: "esf_sura_cera",
    etiqueta: "SC",
    nom: "Esfera de cera (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "cera", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  esf_sura_polietile: {
    id: "esf_sura_polietile",
    etiqueta: "SPo",
    nom: "Esfera de polietilè (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "polietile", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  esf_sura_pi: {
    id: "esf_sura_pi",
    etiqueta: "SPi",
    nom: "Esfera de pi (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "pi", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  esf_sura_suro: {
    id: "esf_sura_suro",
    etiqueta: "SSu",
    nom: "Esfera de suro (50 cm³)",
    forma: "esfera",
    mides: { diametre: 4.57 },
    parts: [{ material: "suro", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },

  // Boles buides (F4)
  bola_buida_fina: {
    id: "bola_buida_fina",
    etiqueta: "BB1",
    nom: "Bola buida d'acer (paret fina)",
    forma: "esfera",
    mides: { diametre: 5.76 },
    massaFixa: 60,
    parts: [{ material: "acer", volum: 7.64 }],
    cavitatsTancades: [{ volum: 92.36, contingut: "aire" }],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "3"
  },
  bola_buida_gruixuda: {
    id: "bola_buida_gruixuda",
    etiqueta: "BB2",
    nom: "Bola buida d'acer (paret gruixuda)",
    forma: "esfera",
    mides: { diametre: 5.76 },
    massaFixa: 300,
    parts: [{ material: "acer", volum: 38.22 }],
    cavitatsTancades: [{ volum: 61.78, contingut: "aire" }],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "3"
  },

  // Plastilina de taller (200 g = 133,33 cm³) i Planxa d'acer de taller (500 g = 63,69 cm³)
  plastilina_taller: {
    id: "plastilina_taller",
    etiqueta: "PTa",
    nom: "Plastilina de taller (200 g)",
    forma: "esfera",
    mides: { diametre: 6.34 },
    massaFixa: 200,
    parts: [{ material: "plastilina", volum: 200 / 1.5 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "3"
  },
  acer_taller: {
    id: "acer_taller",
    etiqueta: "ATa",
    nom: "Planxa d'acer (500 g)",
    forma: "ortoedre",
    mides: { a: 2.0, b: 4.0, c: 7.96 },
    massaFixa: 500,
    parts: [{ material: "acer", volum: 500 / 7.85 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "3"
  },

  // Corona del rei Hieró (F7): 1000 g i 64,8 cm³ (d = 15,43 g/cm³) i Lingot d'or pur de 1000 g (51,81 cm³)
  corona: {
    id: "corona",
    etiqueta: "Cor",
    nom: "Corona del rei (1000 g)",
    forma: "irregular",
    mides: { diametre: 7.5, alcada: 5.0 },
    massaFixa: 1000,
    parts: [{ material: "aliatge_corona", volum: 64.8 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: true,
    fase: "3"
  },
  lingot_or: {
    id: "lingot_or",
    etiqueta: "Or",
    nom: "Lingot d'or pur (1000 g)",
    forma: "ortoedre",
    mides: { a: 2.5, b: 3.0, c: 6.91 },
    massaFixa: 1000,
    parts: [{ material: "or", volum: 1000 / 19.3 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "3"
  },

  // Sèrie d'alumini per a la recta massa-volum (C5): 10, 20, 50, 80, 100, 150, 200 cm³
  serie_al_10: {
    id: "serie_al_10",
    etiqueta: "Al-10",
    nom: "Mostra d'alumini (10 cm³)",
    forma: "cilindre",
    mides: { diametre: 2.0, alcada: 3.18 },
    parts: [{ material: "alumini", volum: 10 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  serie_al_50: {
    id: "serie_al_50",
    etiqueta: "Al-50",
    nom: "Mostra d'alumini (50 cm³)",
    forma: "ortoedre",
    mides: { a: 2.5, b: 4.0, c: 5.0 },
    parts: [{ material: "alumini", volum: 50 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  serie_al_80: {
    id: "serie_al_80",
    etiqueta: "Al-80",
    nom: "Mostra d'alumini (80 cm³)",
    forma: "ortoedre",
    mides: { a: 2.5, b: 4.0, c: 8.0 },
    parts: [{ material: "alumini", volum: 80 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  serie_al_150: {
    id: "serie_al_150",
    etiqueta: "Al-150",
    nom: "Mostra d'alumini (150 cm³)",
    forma: "ortoedre",
    mides: { a: 3.0, b: 5.0, c: 10.0 },
    parts: [{ material: "alumini", volum: 150 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },
  serie_al_200: {
    id: "serie_al_200",
    etiqueta: "Al-200",
    nom: "Mostra d'alumini (200 cm³)",
    forma: "ortoedre",
    mides: { a: 4.0, b: 5.0, c: 10.0 },
    parts: [{ material: "alumini", volum: 200 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "1b"
  },

  // Objecte de precisió per a C10 (123,47 g d'alumini: 45,73 cm³)
  peca_precisio: {
    id: "peca_precisio",
    etiqueta: "Pr",
    nom: "Peça calibrada",
    forma: "cilindre",
    mides: { diametre: 2.4, alcada: 10.11 },
    massaFixa: 123.47,
    parts: [{ material: "alumini", volum: 45.73 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },

  // Sis cubs de 10 cm d'aresta (1000 cm³) per a D6 (Quina part queda submergida?)
  cub10_suro: {
    id: "cub10_suro",
    etiqueta: "Su10",
    nom: "Cub de suro (10 cm)",
    forma: "cub",
    mides: { a: 10, b: 10, c: 10 },
    parts: [{ material: "suro", volum: 1000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  cub10_pi: {
    id: "cub10_pi",
    etiqueta: "Pi10",
    nom: "Cub de pi (10 cm)",
    forma: "cub",
    mides: { a: 10, b: 10, c: 10 },
    parts: [{ material: "pi", volum: 1000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  cub10_roure: {
    id: "cub10_roure",
    etiqueta: "Ro10",
    nom: "Cub de roure (10 cm)",
    forma: "cub",
    mides: { a: 10, b: 10, c: 10 },
    parts: [{ material: "roure", volum: 1000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  cub10_cera: {
    id: "cub10_cera",
    etiqueta: "Ce10",
    nom: "Cub de cera (10 cm)",
    forma: "cub",
    mides: { a: 10, b: 10, c: 10 },
    parts: [{ material: "cera", volum: 1000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  cub10_gel: {
    id: "cub10_gel",
    etiqueta: "Ge10",
    nom: "Cub de gel (10 cm)",
    forma: "cub",
    mides: { a: 10, b: 10, c: 10 },
    parts: [{ material: "gel", volum: 1000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },
  cub10_polietile: {
    id: "cub10_polietile",
    etiqueta: "Po10",
    nom: "Cub de polietilè (10 cm)",
    forma: "cub",
    mides: { a: 10, b: 10, c: 10 },
    parts: [{ material: "polietile", volum: 1000 }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },

  // Càpsula de flotació neutra (D8): 100 cm³ exterior i 40 g buida, amb càrrega ajustable
  capsula_d8: {
    id: "capsula_d8",
    etiqueta: "Cap",
    nom: "Càpsula estanca (100 cm³)",
    forma: "cilindre",
    mides: { diametre: 4.0, alcada: 7.96 },
    massaFixa: 40,
    carrega: 60, // Per defecte amb 60 g de llast -> 100 g en 100 cm³ (equilibri neutre en aigua)
    parts: [{ material: "pvc", volum: 28.57 }],
    cavitatsTancades: [{ volum: 71.43, contingut: "aire" }],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "2"
  },

  // Objectes compostos (F8): taronja amb pell i pelada, llaunes de refresc
  taronja_pell: {
    id: "taronja_pell",
    etiqueta: "Tr+",
    nom: "Taronja amb pell",
    forma: "esfera",
    mides: { diametre: 7.5 },
    massaFixa: 209,
    parts: [{ material: "poma", volum: 185 }],
    cavitatsTancades: [{ volum: 35, contingut: "aire" }], // 209 g / 220 cm³ = 0,95 g/cm³ -> sura
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "4"
  },
  taronja_pelada: {
    id: "taronja_pelada",
    etiqueta: "Tr-",
    nom: "Taronja pelada",
    forma: "esfera",
    mides: { diametre: 6.8 },
    massaFixa: 172.8,
    parts: [{ material: "patata", volum: 160 }], // 172,8 g / 160 cm³ = 1,08 g/cm³ -> s'enfonsa
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "4"
  },
  llauna_sucre: {
    id: "llauna_sucre",
    etiqueta: "Ll-S",
    nom: "Llauna de refresc amb sucre",
    forma: "cilindre",
    mides: { diametre: 6.6, alcada: 11.5 },
    massaFixa: 382,
    parts: [{ material: "alumini", volum: 15 }],
    cavitatsTancades: [{ volum: 345, contingut: "aigua", massa: 341.5 }], // 382 g / 360 cm³ = 1,06 g/cm³ -> s'enfonsa
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "4"
  },
  llauna_zero: {
    id: "llauna_zero",
    etiqueta: "Ll-0",
    nom: "Llauna de refresc sense sucre",
    forma: "cilindre",
    mides: { diametre: 6.6, alcada: 11.5 },
    massaFixa: 352,
    parts: [{ material: "alumini", volum: 15 }],
    cavitatsTancades: [{ volum: 345, contingut: "aigua", massa: 311.5 }], // 352 g / 360 cm³ = 0,98 g/cm³ -> sura
    cavitatOberta: null,
    origen: "prestatge",
    misteri: false,
    fase: "4"
  }
};
