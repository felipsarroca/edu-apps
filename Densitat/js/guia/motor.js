/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Motor pedagògic de la guia d'investigacions: avaluació reactiva de condicions del laboratori,
 * gestió dels passos del cicle d'indagació i pistes en tres graons (07-guia-quadern-i-avaluacio.md §2–§4).
 */

import { INVESTIGACIONS } from "../dades/investigacions/index.js";

/**
 * Comprova si el pas actual d'una investigació (especialment els de tipus «experimenta» o «mesura»)
 * ja s'ha completat automàticament segons l'estat del laboratori i del quadern.
 * @param {object} estat Estat global de l'app
 * @param {object} pas Pas de la investigació
 * @param {string} invId Id de la investigació
 * @returns {boolean}
 */
export function comprovaCondicioPas(estat, pas, invId) {
  if (!pas || !pas.condicio) return false;
  const cond = pas.condicio;
  const mesuresInv = (estat?.quadern?.mesures || []).filter(
    m => !m.investigacioId || m.investigacioId === invId
  );
  const totesMesures = estat?.quadern?.mesures || [];
  const lab = estat?.laboratori || {};
  const accionsRecents = lab.accionsFetes || {};

  switch (cond.tipus) {
    case "anotacions_minimes": {
      const min = cond.min ?? 1;
      return mesuresInv.length >= min || totesMesures.length >= min;
    }
    case "tallat_o_anotat": {
      return Boolean(accionsRecents.tallat) || mesuresInv.length >= (cond.min ?? 1);
    }
    case "objecte_en_columna": {
      return Boolean(accionsRecents.objecteEnColumna) || mesuresInv.length >= 1;
    }
    case "objecte_en_vas_o_anotat": {
      return Boolean(accionsRecents.objecteEnVas) || mesuresInv.length >= 1;
    }
    case "sal_afegida_o_anotat": {
      return (lab.salGrams ?? 0) >= (cond.minSal ?? 10) || mesuresInv.length >= 1;
    }
    case "remenat_o_anotat": {
      return Boolean(accionsRecents.remenat) || mesuresInv.length >= 1;
    }
    case "objecte_construit_o_anotat": {
      return Boolean(accionsRecents.construit) || mesuresInv.length >= 1;
    }
    case "barca_provada_o_anotat": {
      return Boolean(accionsRecents.barcaProvada) || mesuresInv.length >= 1;
    }
    case "submari_equilibri_o_anotat": {
      return Boolean(accionsRecents.submariProvat) || mesuresInv.length >= 1;
    }
    case "globus_provat_o_anotat": {
      return Boolean(accionsRecents.globusProvat) || mesuresInv.length >= 1;
    }
    case "temperatura_provada_o_anotat": {
      return Boolean(accionsRecents.temperaturaProvada) || mesuresInv.length >= 1;
    }
    case "densimetre_provat_o_anotat": {
      return Boolean(accionsRecents.densimetreProvat) || mesuresInv.length >= 1;
    }
    case "sonda_provada_o_anotat": {
      return Boolean(accionsRecents.sondaProvada) || mesuresInv.length >= 1;
    }
    default:
      return mesuresInv.length >= 1;
  }
}

/**
 * Retorna l'etiqueta amable de cada tipus de pas del cicle d'indagació.
 * @param {string} tipus
 * @returns {string}
 */
export function nomPasIndagacio(tipus) {
  const mapa = {
    observa: "Observa",
    prediu: "Prediu",
    experimenta: "Experimenta",
    mesura: "Mesura",
    calcula: "Calcula",
    explica: "Explica",
    aplica: "Aplica"
  };
  return mapa[tipus] || "Pas";
}

/**
 * Construeix el missatge de contrast quan l'alumne arriba al pas «Explica» després d'haver fet una predicció.
 * @param {string} invId
 * @param {object} respostesInv
 * @returns {string|null}
 */
export function generaMissatgeContrastPrediccio(invId, respostesInv = {}) {
  const inv = INVESTIGACIONS[invId];
  if (!inv) return null;
  const pasPrediu = inv.passos.find(p => p.tipus === "prediu");
  const respPred = respostesInv.prediu;
  if (!pasPrediu || !respPred) return null;

  const opcioTriada = (pasPrediu.opcions || []).find(o => o.id === respPred.opcioId);
  if (!opcioTriada) return null;

  if (opcioTriada.correcta) {
    return " les dades de l'experiment confirmen la teva predicció inicial.";
  }
  return `Havies previst «${opcioTriada.text}». Compara-ho amb el que has observat i mesurat al laboratori: què no havies tingut en compte?`;
}
