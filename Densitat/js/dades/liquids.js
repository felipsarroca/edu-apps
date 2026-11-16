/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Dades de referència dels líquids, gasos i taules de dissolució i temperatura.
 */

export const LIQUIDS = {
  gasolina: {
    id: "gasolina",
    nom: "gasolina",
    estat: "liquid",
    dEscolar: 0.75,
    dReferencia: 0.74,
    interval: [0.72, 0.76],
    familia: "oliosa",
    viscositatVisual: "baixa",
    menisc: "concau",
    color: "#FEF08A",
    transparencia: 0.75,
    perill: "inflamable",
    notes: ["Inflamable: pictograma de perill a l'etiqueta"]
  },
  alcohol: {
    id: "alcohol",
    nom: "alcohol (etanol)",
    estat: "liquid",
    dEscolar: 0.79,
    dReferencia: 0.789,
    interval: [0.788, 0.792],
    familia: "aquosa",
    viscositatVisual: "baixa",
    menisc: "concau",
    color: "#DDD6FE",
    transparencia: 0.78,
    perill: null,
    notes: ["Es mescla amb l'aigua; es presenta acolorit"]
  },
  oli: {
    id: "oli",
    nom: "oli",
    estat: "liquid",
    dEscolar: 0.92,
    dReferencia: 0.918,
    interval: [0.91, 0.925],
    familia: "oliosa",
    viscositatVisual: "mitjana",
    menisc: "concau",
    color: "#FDE047",
    transparencia: 0.82,
    perill: null,
    notes: ["D'oliva o de gira-sol"]
  },
  aigua: {
    id: "aigua",
    nom: "aigua",
    estat: "liquid",
    dEscolar: 1.00,
    dReferencia: 0.998,
    interval: [0.997, 1.000],
    familia: "aquosa",
    viscositatVisual: "baixa",
    menisc: "concau",
    color: "#BAE6FD",
    transparencia: 0.72,
    perill: null,
    notes: ["1,000 a 4 °C"]
  },
  aigua_mar: {
    id: "aigua_mar",
    nom: "aigua de mar",
    estat: "liquid",
    dEscolar: 1.03,
    dReferencia: 1.025,
    interval: [1.02, 1.03],
    familia: "aquosa",
    viscositatVisual: "baixa",
    menisc: "concau",
    color: "#7DD3FC",
    transparencia: 0.75,
    perill: null,
    notes: []
  },
  llet: {
    id: "llet",
    nom: "llet",
    estat: "liquid",
    dEscolar: 1.03,
    dReferencia: 1.03,
    interval: [1.028, 1.035],
    familia: "aquosa",
    viscositatVisual: "baixa",
    menisc: "concau",
    color: "#FFFBEB",
    transparencia: 0.96,
    perill: null,
    notes: ["Només per a «quanta massa té un litre?»"]
  },
  aigua_salada: {
    id: "aigua_salada",
    nom: "aigua salada saturada",
    estat: "liquid",
    dEscolar: 1.20,
    dReferencia: 1.197,
    interval: [1.19, 1.20],
    familia: "aquosa",
    viscositatVisual: "baixa",
    menisc: "concau",
    color: "#67E8F9",
    transparencia: 0.78,
    perill: null,
    notes: ["26 % de sal en massa"]
  },
  glicerina: {
    id: "glicerina",
    nom: "glicerina",
    estat: "liquid",
    dEscolar: 1.26,
    dReferencia: 1.26,
    interval: [1.258, 1.262],
    familia: "aquosa",
    viscositatVisual: "alta",
    menisc: "concau",
    color: "#FCE7F3",
    transparencia: 0.80,
    perill: null,
    notes: []
  },
  xarop: {
    id: "xarop",
    nom: "xarop",
    estat: "liquid",
    dEscolar: 1.33,
    dReferencia: 1.33,
    interval: [1.30, 1.35],
    familia: "aquosa",
    viscositatVisual: "alta",
    menisc: "concau",
    color: "#FCA5A5",
    transparencia: 0.85,
    perill: null,
    notes: ["Sucre concentrat"]
  },
  mel: {
    id: "mel",
    nom: "mel",
    estat: "liquid",
    dEscolar: 1.42,
    dReferencia: 1.42,
    interval: [1.38, 1.45],
    familia: "aquosa",
    viscositatVisual: "molt_alta",
    menisc: "concau",
    color: "#F59E0B",
    transparencia: 0.90,
    perill: null,
    notes: ["Es mescla amb l'aigua molt a poc a poc"]
  },
  mercuri: {
    id: "mercuri",
    nom: "mercuri",
    estat: "liquid",
    dEscolar: 13.55,
    dReferencia: 13.55,
    interval: [13.54, 13.56],
    familia: "mercuri",
    viscositatVisual: "baixa",
    menisc: "convex",
    color: "#94A3B8",
    transparencia: 1.0,
    perill: "toxic",
    notes: ["Tòxic: pictograma de perill a l'etiqueta"]
  }
};

/**
 * Taula de densitat de l'aigua amb sal segons el percentatge en massa a 20 °C (valors de referència).
 */
export const TAULA_AIGUA_SAL = [
  { pct: 0, d: 0.998 },
  { pct: 5, d: 1.034 },
  { pct: 10, d: 1.071 },
  { pct: 15, d: 1.109 },
  { pct: 20, d: 1.148 },
  { pct: 25, d: 1.189 },
  { pct: 26, d: 1.197 }
];

export const SOLUBILITAT_MAX_SAL_PER_100G_AIGUA = 36; // g de sal per 100 g d'aigua (~26,47 % en massa)

/**
 * Taula de densitat de l'aigua segons la temperatura (fase 4).
 */
export const TAULA_AIGUA_TEMPERATURA = [
  { t: 0, estat: "gel", d: 0.917 },
  { t: 0, estat: "liquid", d: 0.9998 },
  { t: 4, estat: "liquid", d: 1.0000 },
  { t: 10, estat: "liquid", d: 0.9997 },
  { t: 20, estat: "liquid", d: 0.9982 },
  { t: 40, estat: "liquid", d: 0.9922 },
  { t: 60, estat: "liquid", d: 0.9832 },
  { t: 80, estat: "liquid", d: 0.9718 },
  { t: 100, estat: "liquid", d: 0.9584 }
];

/**
 * Gasos a 20 °C i 1 atm, densitat en kg/m³ (o g/L).
 */
export const GASOS = {
  hidrogen: { id: "hidrogen", nom: "hidrogen", dEscolar: 0.09, dReferencia: 0.084, notes: ["Inflamable"] },
  heli: { id: "heli", nom: "heli", dEscolar: 0.17, dReferencia: 0.166, notes: ["El dels globus de fira"] },
  meta: { id: "meta", nom: "metà", dEscolar: 0.70, dReferencia: 0.67, notes: [] },
  aire_calent: { id: "aire_calent", nom: "aire calent (100 °C)", dEscolar: 0.95, dReferencia: 0.946, notes: ["Globus aerostàtic"] },
  aire: { id: "aire", nom: "aire", dEscolar: 1.20, dReferencia: 1.204, notes: [] },
  co2: { id: "co2", nom: "diòxid de carboni", dEscolar: 1.80, dReferencia: 1.84, notes: ["S'acumula a baix"] },
  buta: { id: "buta", nom: "butà", dEscolar: 2.50, dReferencia: 2.49, notes: [] }
};

/**
 * Constants físiques i entorns planetaris.
 */
export const ENTORNS = {
  terra: { id: "terra", nom: "Terra", g: 9.8 },
  lluna: { id: "lluna", nom: "Lluna", g: 1.6 },
  mart: { id: "mart", nom: "Mart", g: 3.7 }
};

export const PRESSIO_ATMOSFERICA = 101325; // Pa
