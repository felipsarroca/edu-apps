/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Moviment vertical il·lustratiu fins a la posició d'equilibri (02-model-cientific.md §5).
 * Mòdul pur del motor físic.
 */

import { netejaDecimal } from "./unitats.js";

const FACTOR_VISCOSITAT = {
  baixa: 1.0,
  mitjana: 1.45,
  alta: 2.0,
  molt_alta: 2.5
};

/**
 * Calcula la durada prevista del trajecte (entre 0,6 i 2,5 s) segons la viscositat visual i la diferència de densitats.
 * @param {string} [viscositatVisual="baixa"]
 * @param {number} [diferenciaRelativaDensitat=0.5]
 * @param {boolean} [reduirMoviment=false]
 * @returns {number} Durada en segons
 */
export function duradaTrajecte(viscositatVisual = "baixa", diferenciaRelativaDensitat = 0.5, reduirMoviment = false) {
  if (reduirMoviment) return 0;
  const fVisc = FACTOR_VISCOSITAT[viscositatVisual] ?? 1.0;
  const impuls = Math.max(0.15, Math.min(2.0, Math.abs(diferenciaRelativaDensitat)));
  const base = (0.9 * fVisc) / Math.sqrt(impuls);
  return netejaDecimal(Math.max(0.6, Math.min(2.5, base)), 2);
}

/**
 * Calcula l'estat instantani del moviment d'un objecte entre una posició inicial `y0` i la posició d'equilibri `yFinal`.
 * Quan `t >= durada` o `reduirMoviment === true`, l'objecte es col·loca exactament a `yFinal` i la força neta val 0.
 * Mentre es mou (`0 < t < durada`), la força neta no és zero i apunta en el sentit del desplaçament.
 *
 * @param {object} params
 * @param {number} params.y0 Posició inicial (cm)
 * @param {number} params.yFinal Posició exacta d'equilibri (cm)
 * @param {number} params.tempsTranscorregutSegons Temps des de l'inici del moviment (s)
 * @param {number} [params.pes=1] Pes de l'objecte (N)
 * @param {number} [params.empenyimentEquilibri=1] Empenyiment en l'estat final (N)
 * @param {string} [params.viscositatVisual="baixa"]
 * @param {boolean} [params.reduirMoviment=false]
 * @returns {{y: number, velocitat: number, enMoviment: boolean, progres: number, forcaNetaInstantania: number}}
 */
export function calculaEstatMoviment(params) {
  const {
    y0,
    yFinal,
    tempsTranscorregutSegons = 0,
    pes = 1,
    empenyimentEquilibri = 1,
    viscositatVisual = "baixa",
    reduirMoviment = false
  } = params;

  const dist = yFinal - y0;
  if (reduirMoviment || Math.abs(dist) < 1e-4) {
    return {
      y: yFinal,
      velocitat: 0,
      enMoviment: false,
      progres: 1,
      forcaNetaInstantania: 0
    };
  }

  const durada = duradaTrajecte(viscositatVisual, 0.5, false);
  if (tempsTranscorregutSegons >= durada) {
    return {
      y: yFinal,
      velocitat: 0,
      enMoviment: false,
      progres: 1,
      forcaNetaInstantania: 0
    };
  }

  const u = Math.max(0, Math.min(1, tempsTranscorregutSegons / durada));
  // Corba suau esmorteïda (ease-out cúbica) sense rebots
  const s = 1 - (1 - u) ** 3;
  const dsdu = 3 * (1 - u) ** 2;

  const y = netejaDecimal(y0 + dist * s, 4);
  const velocitat = netejaDecimal((dist * dsdu) / durada, 4);
  // Mentre es mou, la força neta decau proporcionalment a l'acceleració cap a zero en arribar a l'equilibri
  const amplitudForca = Math.max(0.15, Math.abs(empenyimentEquilibri - pes) || pes * 0.25);
  const signe = Math.sign(dist); // positiu cap amunt, negatiu cap avall
  const forcaNetaInstantania = netejaDecimal(signe * amplitudForca * (1 - u) ** 2, 3);

  return {
    y,
    velocitat,
    enMoviment: true,
    progres: netejaDecimal(u, 3),
    forcaNetaInstantania
  };
}
