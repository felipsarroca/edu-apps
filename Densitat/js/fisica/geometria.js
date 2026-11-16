/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Geometria dels objectes i càlcul de volums i fraccions submergides.
 * Mòdul pur del motor físic.
 */

import { netejaDecimal } from "./unitats.js";

/**
 * Calcula el volum geomètric d'una forma regular a partir de les seves mides en cm.
 * @param {string} forma - "cub" | "ortoedre" | "cilindre" | "esfera" | "irregular" | "buc"
 * @param {object} mides
 * @returns {number} Volum en cm³
 */
export function calculaVolumGeometric(forma, mides) {
  if (!mides) return 0;
  if (typeof mides.volum === "number") return netejaDecimal(mides.volum, 6);
  switch (forma) {
    case "cub": {
      const a = mides.a ?? mides.aresta ?? 0;
      const b = mides.b ?? a;
      const c = mides.c ?? a;
      return netejaDecimal(a * b * c, 6);
    }
    case "ortoedre": {
      const { a = 0, b = 0, c = 0 } = mides;
      return netejaDecimal(a * b * c, 6);
    }
    case "cilindre": {
      const r = (mides.diametre ?? (mides.radi ?? 0) * 2) / 2;
      const h = mides.alcada ?? 0;
      return netejaDecimal(Math.PI * r * r * h, 6);
    }
    case "esfera": {
      const r = (mides.diametre ?? (mides.radi ?? 0) * 2) / 2;
      return netejaDecimal((4 / 3) * Math.PI * r ** 3, 6);
    }
    case "buc": {
      const { L = 0, B = 0, H = 0 } = mides;
      return netejaDecimal(L * B * H, 6);
    }
    default:
      return netejaDecimal(mides.volum ?? 0, 6);
  }
}

/**
 * Retorna la dimensió transversal mínima d'un objecte (en cm) per saber si passa per la boca d'una proveta.
 * Per a un ortoedre de 2,5 × 4 × 10 cm que entra verticalment per l'aresta llarga de 10 cm,
 * la secció transversal és de 2,5 × 4 cm, l'amplada màxima d'entrada és max(2.5, 4.0) = 4.0 cm
 * (per això el bloc A de 2,5 × 4 × 10 cm no cap a la proveta de 250 mL de boca 3,6 cm, però sí a la de 500 mL de boca 5,0 cm: cas T04b).
 * @param {object} obj
 * @returns {number} Diàmetre mínim de boca necessari en cm
 */
export function diametreEntradaObjecte(obj) {
  if (!obj) return 0;
  const m = obj.mides || {};
  if (typeof m.diametre === "number") return m.diametre;
  if (obj.forma === "cub" || obj.forma === "ortoedre") {
    const dims = [m.a ?? 0, m.b ?? 0, m.c ?? 0].filter(x => x > 0).sort((x, y) => x - y);
    if (dims.length >= 2) {
      // S'introdueix orientant la dimensió més llarga verticalment; la boca ha d'admetre la segona dimensió
      return dims[1];
    }
    return dims[0] || 0;
  }
  if (obj.forma === "buc") {
    return Math.min(m.L ?? 0, m.B ?? 0);
  }
  // Estimació per defecte a partir del volum envoltant si no té mides explícites
  const v = obj.volumExterior ?? obj.parts?.reduce((s, p) => s + p.volum, 0) ?? 0;
  return netejaDecimal(Math.cbrt(v), 2);
}

/**
 * Retorna l'alçada vertical d'un objecte en cm segons la seva orientació d'equilibri.
 * @param {object} obj
 * @returns {number}
 */
export function alcadaObjecte(obj) {
  if (!obj) return 1;
  const m = obj.mides || {};
  if (obj.forma === "buc") return m.H ?? 5;
  if (typeof m.alcada === "number") return m.alcada;
  if (typeof m.diametre === "number") return m.diametre;
  if (obj.forma === "cub" || obj.forma === "ortoedre") {
    return m.c ?? m.a ?? 1;
  }
  const v = obj.parts?.reduce((s, p) => s + p.volum, 0) ?? 1;
  return netejaDecimal(Math.cbrt(v), 2);
}
