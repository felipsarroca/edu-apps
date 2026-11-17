/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Motor físic pur per al simulador Densitats.
 * Totes les magnituds internes usen unitats coherents:
 * - massa en g
 * - volum en cm³ (= mL)
 * - densitat en g/cm³
 * - força / pes en N (amb g = 9,8 N/kg)
 */

export const G_TERRA = 9.8;

/**
 * Elimina residus de coma flotant binària.
 * @param {number} val
 * @param {number} [decimals=6]
 * @returns {number}
 */
export function neteja(val, decimals = 6) {
  if (!Number.isFinite(val)) return val;
  const f = 10 ** decimals;
  return Math.round((val + Math.sign(val) * 1e-12) * f) / f;
}

/**
 * Formata un nombre amb coma decimal catalana.
 * @param {number} val
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function fmt(val, decimals = 2) {
  if (!Number.isFinite(val)) return "—";
  const net = neteja(val, decimals);
  return net.toLocaleString("ca-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Formata un nombre amb decimals adaptatius (sense zeros innecessaris si és enter, o fins a maxDec).
 * @param {number} val
 * @param {number} [maxDec=2]
 * @returns {string}
 */
export function fmtNet(val, maxDec = 2) {
  if (!Number.isFinite(val)) return "—";
  const net = neteja(val, maxDec);
  return net.toLocaleString("ca-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDec
  });
}

/**
 * Calcula les magnituds intrínseques d'un objecte.
 * @param {object} obj
 * @param {number} [g=G_TERRA]
 * @returns {{ massa: number, volum: number, densitat: number, pes: number }}
 */
export function magnitudsObjecte(obj, g = G_TERRA) {
  const massa = Math.max(0.01, Number(obj.massa) || 0);
  const volum = Math.max(0.01, Number(obj.volum) || 0);
  const densitat = neteja(massa / volum, 4);
  const pes = neteja((massa / 1000) * g, 4);
  return { massa, volum, densitat, pes };
}

/**
 * Calcula l'estat d'equilibri d'un objecte lliure dins d'un líquid.
 * @param {object} obj
 * @param {number} densitatLiquid g/cm³
 * @param {number} [g=G_TERRA]
 * @returns {{
 *   massa: number,
 *   volum: number,
 *   densitat: number,
 *   pes: number,
 *   sura: boolean,
 *   equilibriNeutre: boolean,
 *   fraccioSubmergida: number,
 *   volumSubmergit: number,
 *   empenyiment: number,
 *   normal: number
 * }}
 */
export function estatEquilibriLliure(obj, densitatLiquid, g = G_TERRA) {
  const { massa, volum, densitat, pes } = magnitudsObjecte(obj, g);
  const dL = Math.max(0.01, densitatLiquid);

  const sura = densitat < dL - 1e-6;
  const equilibriNeutre = Math.abs(densitat - dL) <= 1e-6;

  let fraccioSubmergida;
  if (sura) {
    fraccioSubmergida = Math.min(1, Math.max(0, neteja(densitat / dL, 4)));
  } else {
    fraccioSubmergida = 1;
  }

  const volumSubmergit = neteja(volum * fraccioSubmergida, 3);
  const empenyiment = neteja((dL * volumSubmergit / 1000) * g, 4);
  const normal = sura || equilibriNeutre ? 0 : neteja(Math.max(0, pes - empenyiment), 4);

  return {
    massa,
    volum,
    densitat,
    pes,
    sura,
    equilibriNeutre,
    fraccioSubmergida,
    volumSubmergit,
    empenyiment,
    normal
  };
}

/**
 * Calcula l'estat d'un objecte penjat d'un dinamòmetre amb una fracció submergida controlada (0..1).
 * Si l'empenyiment supera o iguala el pes, la corda queda destensada (tensió = 0) i l'objecte no s'enfonsa més enllà del seu equilibri sense força externa.
 * @param {object} obj
 * @param {number} densitatLiquid
 * @param {number} fraccioDesitjada 0 (a l'aire) .. 1 (totalment submergit)
 * @param {number} [g=G_TERRA]
 * @returns {{
 *   massa: number,
 *   volum: number,
 *   densitat: number,
 *   pes: number,
 *   fraccioSubmergida: number,
 *   volumSubmergit: number,
 *   empenyiment: number,
 *   tensio: number,
 *   cordaTensa: boolean,
 *   percentatgeSubmergit: number
 * }}
 */
export function estatDinamometre(obj, densitatLiquid, fraccioDesitjada, g = G_TERRA) {
  const { massa, volum, densitat, pes } = magnitudsObjecte(obj, g);
  const dL = Math.max(0.01, densitatLiquid);
  const fReq = Math.min(1, Math.max(0, fraccioDesitjada));

  const suraEnLiquid = densitat < dL;
  const fEquilibri = suraEnLiquid ? densitat / dL : 1;
  const fraccioSubmergida = suraEnLiquid ? Math.min(fReq, fEquilibri) : fReq;
  const cordaTensa = suraEnLiquid ? fReq < fEquilibri - 1e-4 : true;

  const volumSubmergit = neteja(volum * fraccioSubmergida, 3);
  const empenyiment = neteja((dL * volumSubmergit / 1000) * g, 4);
  const tensio = cordaTensa ? neteja(Math.max(0, pes - empenyiment), 4) : 0;

  return {
    massa,
    volum,
    densitat,
    pes,
    fraccioSubmergida,
    volumSubmergit,
    empenyiment,
    tensio,
    cordaTensa,
    percentatgeSubmergit: Math.round(fraccioSubmergida * 100)
  };
}
