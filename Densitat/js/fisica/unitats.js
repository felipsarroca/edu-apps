/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Unitats, aritmètica exacta de potències de deu i format de nombres en català (02-model-cientific.md §3, 10-llengua-i-glossari.md §4).
 * Mòdul pur del motor físic: sense accés a la pàgina ni a les dades.
 */

/**
 * Arrodoneix un nombre eliminant residus de coma flotant binària (ex. 0.30000000000000004 -> 0.3).
 * @param {number} val
 * @param {number} [decimals=9]
 * @returns {number}
 */
export function netejaDecimal(val, decimals = 9) {
  if (!Number.isFinite(val)) return val;
  const f = 10 ** decimals;
  return Math.round((val + Math.sign(val) * 1e-14) * f) / f;
}

/**
 * Compara dos valors amb una tolerància relativa o absoluta (per defecte 1e-6).
 * @param {number} a
 * @param {number} b
 * @param {number} [tolRel=1e-6]
 * @returns {boolean}
 */
export function iguals(a, b, tolRel = 1e-6) {
  if (a === b) return true;
  const ref = Math.max(Math.abs(a), Math.abs(b), 1);
  return Math.abs(a - b) <= tolRel * ref;
}

/**
 * Arrodoneix un valor al múltiple més proper d'una resolució donada.
 * @param {number} valor
 * @param {number} resolucio
 * @returns {number}
 */
export function arrodoneixAResolucio(valor, resolucio) {
  if (!resolucio || resolucio <= 0) return netejaDecimal(valor, 6);
  const inv = netejaDecimal(1 / resolucio, 6);
  if (Number.isInteger(inv)) {
    return netejaDecimal(Math.round((valor + 1e-12) * inv) / inv, 6);
  }
  const passos = Math.round((valor + 1e-12) / resolucio);
  return netejaDecimal(passos * resolucio, 6);
}

/**
 * Retorna el nombre de decimals que cal mostrar per a una resolució donada.
 * @param {number} resolucio
 * @returns {number}
 */
export function decimalsDeResolucio(resolucio) {
  if (!resolucio || resolucio >= 1) return 0;
  const s = String(netejaDecimal(resolucio, 6));
  const idx = s.indexOf(".");
  return idx === -1 ? 0 : s.length - idx - 1;
}

/**
 * Factores de conversió cap a la unitat base interna de cada família:
 * - massa -> g
 * - longitud -> cm
 * - volum / capacitat -> cm³ (= mL)
 * - densitat -> g/cm³
 * - forca -> N
 * - pressio -> Pa
 */
export const FACTORS_UNITATS = {
  // Massa (base: g)
  mg: { familia: "massa", factor: 0.001, pot10: -3 },
  cg: { familia: "massa", factor: 0.01, pot10: -2 },
  dg: { familia: "massa", factor: 0.1, pot10: -1 },
  g: { familia: "massa", factor: 1, pot10: 0 },
  dag: { familia: "massa", factor: 10, pot10: 1 },
  hg: { familia: "massa", factor: 100, pot10: 2 },
  kg: { familia: "massa", factor: 1000, pot10: 3 },
  t: { familia: "massa", factor: 1000000, pot10: 6 },

  // Longitud (base: cm)
  mm: { familia: "longitud", factor: 0.1, pot10: -1 },
  cm: { familia: "longitud", factor: 1, pot10: 0 },
  dm: { familia: "longitud", factor: 10, pot10: 1 },
  m: { familia: "longitud", factor: 100, pot10: 2 },

  // Capacitat i volum (base: cm³ = mL)
  "mm³": { familia: "volum", factor: 0.001, pot10: -3 },
  "mm3": { familia: "volum", factor: 0.001, pot10: -3 },
  "cm³": { familia: "volum", factor: 1, pot10: 0 },
  "cm3": { familia: "volum", factor: 1, pot10: 0 },
  mL: { familia: "volum", factor: 1, pot10: 0 },
  ml: { familia: "volum", factor: 1, pot10: 0 },
  cL: { familia: "volum", factor: 10, pot10: 1 },
  dL: { familia: "volum", factor: 100, pot10: 2 },
  L: { familia: "volum", factor: 1000, pot10: 3 },
  l: { familia: "volum", factor: 1000, pot10: 3 },
  "dm³": { familia: "volum", factor: 1000, pot10: 3 },
  "dm3": { familia: "volum", factor: 1000, pot10: 3 },
  "m³": { familia: "volum", factor: 1000000, pot10: 6 },
  "m3": { familia: "volum", factor: 1000000, pot10: 6 },

  // Densitat (base: g/cm³)
  "g/cm³": { familia: "densitat", factor: 1, pot10: 0 },
  "g/cm3": { familia: "densitat", factor: 1, pot10: 0 },
  "g/mL": { familia: "densitat", factor: 1, pot10: 0 },
  "g/ml": { familia: "densitat", factor: 1, pot10: 0 },
  "kg/L": { familia: "densitat", factor: 1, pot10: 0 },
  "kg/dm³": { familia: "densitat", factor: 1, pot10: 0 },
  "kg/dm3": { familia: "densitat", factor: 1, pot10: 0 },
  "kg/m³": { familia: "densitat", factor: 0.001, pot10: -3 },
  "kg/m3": { familia: "densitat", factor: 0.001, pot10: -3 },
  "g/L": { familia: "densitat", factor: 0.001, pot10: -3 },
  "g/dm³": { familia: "densitat", factor: 0.001, pot10: -3 },

  // Força (base: N)
  N: { familia: "forca", factor: 1, pot10: 0 },
  kN: { familia: "forca", factor: 1000, pot10: 3 },

  // Pressió (base: Pa)
  Pa: { familia: "pressio", factor: 1, pot10: 0 },
  hPa: { familia: "pressio", factor: 100, pot10: 2 },
  kPa: { familia: "pressio", factor: 1000, pot10: 3 }
};

/**
 * Converteix un valor d'una unitat d'origen a una unitat de destinació utilitzant aritmètica exacta de potències de 10.
 * @param {number} valor
 * @param {string} unitatOrigen
 * @param {string} unitatDesti
 * @returns {number}
 */
export function converteixUnitat(valor, unitatOrigen, unitatDesti) {
  const uOrig = FACTORS_UNITATS[unitatOrigen];
  const uDest = FACTORS_UNITATS[unitatDesti];
  if (!uOrig || !uDest) {
    throw new Error(`Unitat no reconeguda: ${unitatOrigen} -> ${unitatDesti}`);
  }
  if (uOrig.familia !== uDest.familia) {
    throw new Error(`No es poden convertir unitats de famílies diferents: ${uOrig.familia} i ${uDest.familia}`);
  }
  const diffPot = uOrig.pot10 - uDest.pot10;
  if (diffPot === 0) return netejaDecimal(valor, 9);
  // Operem sobre enters escalats per evitar errors com 0.3 * 1000 = 300.00000000000006
  const s = String(netejaDecimal(valor, 9));
  const neg = s.startsWith("-");
  const net = neg ? s.slice(1) : s;
  const [partEntera, partDec = ""] = net.split(".");
  const digits = partEntera + partDec;
  const potActual = -partDec.length + diffPot;
  let resultat;
  if (potActual >= 0) {
    resultat = Number(digits + "0".repeat(potActual));
  } else {
    const posComa = digits.length + potActual;
    if (posComa > 0) {
      resultat = Number(digits.slice(0, posComa) + "." + digits.slice(posComa));
    } else {
      resultat = Number("0." + "0".repeat(-posComa) + digits);
    }
  }
  return neg ? -resultat : resultat;
}

/**
 * Converteix massa (g) a força de pes (N): P (N) = m (g) / 1000 * g.
 * @param {number} massaGrams
 * @param {number} [g=9.8]
 * @returns {number}
 */
export function massaAPes(massaGrams, g = 9.8) {
  return netejaDecimal((massaGrams / 1000) * g, 6);
}

/**
 * Converteix densitat (g/cm³), gravetat (N/kg) i profunditat (cm) a pressió hidrostàtica (Pa):
 * p (Pa) = d (g/cm³) * 1000 * g * (h (cm) / 100) = d * 10 * g * h.
 * @param {number} densitatGcm3
 * @param {number} profunditatCm
 * @param {number} [g=9.8]
 * @returns {number}
 */
export function calculaPressioHidrostatica(densitatGcm3, profunditatCm, g = 9.8) {
  if (profunditatCm <= 0) return 0;
  return netejaDecimal(densitatGcm3 * 10 * g * profunditatCm, 6);
}

/**
 * Formata un nombre segons la normativa catalana de l'app (10-llengua-i-glossari.md §4):
 * - Coma decimal
 * - Espai fi (\u202F o espai) als milers a partir de 5 xifres (ex. 19 600, però 2700 sense espai)
 * @param {number} valor
 * @param {number|null} [decimals=null] Nombre fix de decimals, o null per automàtic
 * @param {string} [espaiMilers=" "]
 * @returns {string}
 */
export function formataNombre(valor, decimals = null, espaiMilers = " ") {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return "—";
  const net = decimals !== null ? Number(valor).toFixed(decimals) : String(netejaDecimal(valor, 4));
  const neg = net.startsWith("-");
  const absStr = neg ? net.slice(1) : net;
  const [entera, dec] = absStr.split(".");
  let enteraFormatada = entera;
  if (entera.length >= 5) {
    enteraFormatada = entera.replace(/\B(?=(\d{3})+(?!\d))/g, espaiMilers);
  }
  const signe = neg && Number(absStr) !== 0 ? "−" : "";
  return dec !== undefined && dec.length > 0
    ? `${signe}${enteraFormatada},${dec}`
    : `${signe}${enteraFormatada}`;
}

/**
 * Formata un nombre amb la seva unitat separada per un espai.
 * @param {number} valor
 * @param {string} unitat
 * @param {number|null} [decimals=null]
 * @returns {string}
 */
export function formataMesura(valor, unitat, decimals = null) {
  const txt = formataNombre(valor, decimals);
  if (txt === "—") return txt;
  return unitat ? `${txt} ${unitat}` : txt;
}

/**
 * Analitza un número introduït per l'alumne (accepta coma o punt decimal i espais).
 * @param {string|number} text
 * @returns {number}
 */
export function interpretaNombre(text) {
  if (typeof text === "number") return text;
  if (typeof text !== "string") return NaN;
  const net = text
    .trim()
    .replace(/\u2212/g, "-")
    .replace(/[\s\u00A0\u202F]/g, "")
    .replace(",", ".");
  if (net === "") return NaN;
  return Number(net);
}

/**
 * Normalitza l'escriptura d'una unitat (ex. "g/cm3" -> "g/cm³", "ml" -> "mL").
 * @param {string} unitat
 * @returns {string}
 */
export function normalitzaUnitat(unitat) {
  if (!unitat || typeof unitat !== "string") return "";
  const u = unitat.trim();
  const mapa = {
    "cm3": "cm³",
    "dm3": "dm³",
    "m3": "m³",
    "mm3": "mm³",
    "g/cm3": "g/cm³",
    "kg/m3": "kg/m³",
    "kg/dm3": "kg/dm³",
    "g/dm3": "g/dm³",
    "ml": "mL",
    "l": "L",
    "g/ml": "g/mL"
  };
  return mapa[u] || u;
}
