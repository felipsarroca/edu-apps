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
 * Explica en llenguatge planer què falta fer al laboratori per completar un pas experimental
 * (o confirma que ja està fet), perquè l'alumne sàpiga sempre quin és el pas següent.
 * @param {object} estat
 * @param {object} pas
 * @param {string} invId
 * @returns {{fet: boolean, text: string}|null} null si el pas no té cap condició de laboratori
 */
export function descriuCondicioPas(estat, pas, invId) {
  if (!pas || !pas.condicio) return null;
  const fet = comprovaCondicioPas(estat, pas, invId);
  if (fet) return { fet: true, text: "Fet! Ja pots continuar." };

  const cond = pas.condicio;
  const nMesures = (estat?.quadern?.mesures || []).filter(
    m => !m.investigacioId || m.investigacioId === invId
  ).length;
  const textos = {
    tallat_o_anotat: "Talla l'objecte (botó «Talla per la meitat» de la seva fitxa) o anota una mesura.",
    objecte_en_columna: "Posa un objecte a la columna de líquids.",
    objecte_en_vas_o_anotat: "Posa un objecte al vas per veure si sura o s'enfonsa.",
    sal_afegida_o_anotat: "Afegeix cullerades de sal a l'aigua.",
    remenat_o_anotat: "Remena la columna de líquids.",
    objecte_construit_o_anotat: "Construeix un objecte al Taller.",
    barca_provada_o_anotat: "Prova la barca: canvia'n la càrrega o les mides.",
    submari_equilibri_o_anotat: "Mou el llast del submarí.",
    globus_provat_o_anotat: "Tria un gas per al globus.",
    temperatura_provada_o_anotat: "Canvia la temperatura de l'aigua.",
    densimetre_provat_o_anotat: "Prova el densímetre en un líquid.",
    sonda_provada_o_anotat: "Mou la sonda de pressió."
  };

  if (cond.tipus === "anotacions_minimes") {
    const min = cond.min ?? 1;
    return {
      fet: false,
      text:
        min === 1
          ? "Fes una mesura i prem «Anota» per desar-la."
          : `Prem «Anota» després de cada mesura: en portes ${Math.min(nMesures, min)} de ${min}.`
    };
  }
  return { fet: false, text: textos[cond.tipus] || "Fes una mesura i prem «Anota» per desar-la." };
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
