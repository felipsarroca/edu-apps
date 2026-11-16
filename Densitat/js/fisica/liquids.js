/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Física dels líquids: miscibilitat, capes, mescles, dissolució de sal i temperatura.
 * Mòdul pur del motor físic (02-model-cientific.md §4.8, regla R18).
 */

import { netejaDecimal } from "./unitats.js";

const TAULA_REF_SAL = [
  { pct: 0, d: 0.998 },
  { pct: 5, d: 1.034 },
  { pct: 10, d: 1.071 },
  { pct: 15, d: 1.109 },
  { pct: 20, d: 1.148 },
  { pct: 25, d: 1.189 },
  { pct: 26, d: 1.197 }
];

const TAULA_TEMP_AIGUA = [
  { t: 0, d: 0.9998 },
  { t: 4, d: 1.0000 },
  { t: 10, d: 0.9997 },
  { t: 20, d: 0.9982 },
  { t: 40, d: 0.9922 },
  { t: 60, d: 0.9832 },
  { t: 80, d: 0.9718 },
  { t: 100, d: 0.9584 }
];

/**
 * Calcula la densitat de l'aigua amb sal segons el percentatge en massa (0 a 26 %).
 * @param {number} pctMassa Percentatge en massa de sal dissolta (0..26)
 * @param {boolean} [nombresSenzills=false] Si és true, usa d = 1,00 + 0,0075 * %; si és false, usa la taula a 20 °C
 * @returns {number} Densitat en g/cm³
 */
export function densitatAiguaSalPerPercentatge(pctMassa, nombresSenzills = false) {
  const pct = Math.max(0, Math.min(26, pctMassa));
  if (nombresSenzills) {
    return netejaDecimal(1.0 + 0.0075 * pct, 6);
  }
  for (let i = 0; i < TAULA_REF_SAL.length - 1; i++) {
    const a = TAULA_REF_SAL[i];
    const b = TAULA_REF_SAL[i + 1];
    if (pct >= a.pct && pct <= b.pct) {
      if (a.pct === b.pct) return a.d;
      const t = (pct - a.pct) / (b.pct - a.pct);
      return netejaDecimal(a.d + t * (b.d - a.d), 6);
    }
  }
  return TAULA_REF_SAL[TAULA_REF_SAL.length - 1].d;
}

/**
 * Calcula l'estat d'una dissolució d'aigua i sal a partir de les masses d'aigua i de sal afegida.
 * Solubilitat màxima: 36 g de sal per cada 100 g d'aigua (26,47 %, limitat a 26 % de la taula).
 * @param {number} massaAiguaGrams
 * @param {number} massaSalGrams
 * @param {boolean} [nombresSenzills=false]
 * @returns {object} { massaAigua, massaSalDissolta, massaSalFons, pctMassa, densitat, volumDissolucio, saturada }
 */
export function calculaDissolucioSal(massaAiguaGrams, massaSalGrams, nombresSenzills = false) {
  const mAigua = Math.max(0, massaAiguaGrams);
  const mSalTotal = Math.max(0, massaSalGrams);
  if (mAigua === 0) {
    return {
      massaAigua: 0,
      massaSalDissolta: 0,
      massaSalFons: mSalTotal,
      pctMassa: 0,
      densitat: nombresSenzills ? 1.0 : 0.998,
      volumDissolucio: 0,
      saturada: mSalTotal > 0
    };
  }
  // 26 % en massa equival a mSal / (mSal + mAigua) = 0.26 => mSalMax = (0.26 / 0.74) * mAigua ≈ 0.35135 * mAigua (uns 35,1–36 g per 100 g)
  const maxSalDissolta = netejaDecimal((26 / 74) * mAigua, 4);
  const saturada = mSalTotal > maxSalDissolta + 1e-6;
  const massaSalDissolta = saturada ? maxSalDissolta : mSalTotal;
  const massaSalFons = netejaDecimal(Math.max(0, mSalTotal - massaSalDissolta), 4);
  const massaDissolucio = mAigua + massaSalDissolta;
  const pctMassa = netejaDecimal((massaSalDissolta / massaDissolucio) * 100, 4);
  const densitat = densitatAiguaSalPerPercentatge(pctMassa, nombresSenzills);
  const volumDissolucio = netejaDecimal(massaDissolucio / densitat, 4);

  return {
    massaAigua: mAigua,
    massaSalDissolta: netejaDecimal(massaSalDissolta, 4),
    massaSalFons,
    massaDissolucio: netejaDecimal(massaDissolucio, 4),
    pctMassa,
    densitat,
    volumDissolucio,
    saturada
  };
}

/**
 * Determina si dos líquids pertanyen a la mateixa família de miscibilitat (regla R18).
 * @param {object} liq1
 * @param {object} liq2
 * @returns {boolean}
 */
export function sonMiscibles(liq1, liq2) {
  if (!liq1 || !liq2) return false;
  if (!liq1.familia || !liq2.familia) return false;
  if (liq1.familia === "mercuri" || liq2.familia === "mercuri") {
    return liq1.id === liq2.id;
  }
  return liq1.familia === liq2.familia;
}

/**
 * Calcula la densitat d'una mescla ideal de dos o més líquids miscibles: d = Σm / ΣV (02-model-cientific.md §4.8.5).
 * @param {Array<{volum: number, densitat: number}>} capes
 * @returns {{massaTotal: number, volumTotal: number, densitat: number}}
 */
export function calculaMesclaIdeal(capes) {
  let massaTotal = 0;
  let volumTotal = 0;
  for (const c of capes) {
    const v = c.volum || 0;
    const d = c.densitat || 1;
    volumTotal += v;
    massaTotal += v * d;
  }
  volumTotal = netejaDecimal(volumTotal, 6);
  massaTotal = netejaDecimal(massaTotal, 6);
  const densitat = volumTotal > 0 ? netejaDecimal(massaTotal / volumTotal, 6) : 0;
  return { massaTotal, volumTotal, densitat };
}

/**
 * Contracció de volum d'una mescla real d'aigua i etanol a 20 °C (fase 4, 02-model-cientific.md §4.8.7).
 * Quan es mesclen 50 mL d'aigua i 50 mL d'etanol, el volum resultant és d'uns 96,4 mL (< 100 mL).
 * @param {number} volAigua
 * @param {number} volEtanol
 * @param {boolean} [nombresSenzills=true]
 * @returns {{massaTotal: number, volumSuma: number, volumReal: number, contraccio: number, densitatReal: number}}
 */
export function calculaMesclaNoAdditivaAiguaEtanol(volAigua, volEtanol, nombresSenzills = true) {
  const dAigua = nombresSenzills ? 1.0 : 0.998;
  const dEtanol = nombresSenzills ? 0.79 : 0.789;
  const mAigua = volAigua * dAigua;
  const mEtanol = volEtanol * dEtanol;
  const massaTotal = netejaDecimal(mAigua + mEtanol, 4);
  const volumSuma = netejaDecimal(volAigua + volEtanol, 4);
  if (volAigua <= 0 || volEtanol <= 0) {
    return {
      massaTotal,
      volumSuma,
      volumReal: volumSuma,
      contraccio: 0,
      densitatReal: volumSuma > 0 ? netejaDecimal(massaTotal / volumSuma, 4) : 0
    };
  }
  const f = volEtanol / volumSuma;
  // Màxima contracció (~3,6 %) al voltant de 50-55 % en volum: 4 * f * (1 - f) * 0.036
  const factorContraccio = 4 * f * (1 - f) * 0.036;
  const contraccio = netejaDecimal(volumSuma * factorContraccio, 3);
  const volumReal = netejaDecimal(volumSuma - contraccio, 3);
  const densitatReal = netejaDecimal(massaTotal / volumReal, 4);
  return { massaTotal, volumSuma, volumReal, contraccio, densitatReal };
}

/**
 * Retorna la densitat de l'aigua segons la temperatura (0 a 100 °C) i l'estat (gel o líquid).
 * @param {number} temperaturaC
 * @param {string} [estat="liquid"] - "gel" | "liquid"
 * @returns {number} Densitat en g/cm³
 */
export function densitatAiguaTemperatura(temperaturaC, estat = "liquid") {
  if (estat === "gel" || temperaturaC < 0) return 0.917;
  const t = Math.max(0, Math.min(100, temperaturaC));
  for (let i = 0; i < TAULA_TEMP_AIGUA.length - 1; i++) {
    const a = TAULA_TEMP_AIGUA[i];
    const b = TAULA_TEMP_AIGUA[i + 1];
    if (t >= a.t && t <= b.t) {
      if (a.t === b.t) return a.d;
      const r = (t - a.t) / (b.t - a.t);
      return netejaDecimal(a.d + r * (b.d - a.d), 6);
    }
  }
  return 0.9584;
}
