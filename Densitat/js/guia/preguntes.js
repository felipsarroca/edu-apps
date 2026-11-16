/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Auxiliars per a la correcció de preguntes, opcions amb diagnosi d'idees prèvies i càlculs (07-guia-quadern-i-avaluacio.md §3–§4).
 */

import { validaRespostaNumerica } from "../fisica/instruments.js";
import { ERRORS_MATEMATICS, ERRORS_PROCEDIMENT, IDEES_PREVIES } from "../dades/idees.js";

/**
 * Avalua una resposta d'un pas de tipus «explica» o «aplica».
 * Mai utilitza paraules com «incorrecte» ni «malament»: sempre ofereix una pregunta orientadora o reconeix el que està bé.
 *
 * @param {object} pas
 * @param {object} resposta { opcioId, valor, unitat }
 * @param {number} [nivell=1]
 * @returns {{superat: boolean, missatge: string, ideaDetectada: string|null, codiError: string|null}}
 */
export function avaluaRespostaPas(pas, resposta = {}, nivell = 1) {
  if (!pas) {
    return { superat: false, missatge: "Tria o escriu una resposta.", ideaDetectada: null, codiError: null };
  }

  // Cas 1: Pregunta d'opció múltiple («explica»)
  if (Array.isArray(pas.opcions) && pas.opcions.length > 0) {
    const opcio = pas.opcions.find(o => o.id === resposta.opcioId);
    if (!opcio) {
      return {
        superat: false,
        missatge: "Selecciona una de les opcions per continuar.",
        ideaDetectada: null,
        codiError: null
      };
    }
    if (opcio.correcta) {
      return {
        superat: true,
        missatge: "Ben raonat a partir de les dades de l'experiment.",
        ideaDetectada: null,
        codiError: null
      };
    }
    const idea = opcio.idea || null;
    const infoIdea = idea ? IDEES_PREVIES[idea] : null;
    const infoEP = idea ? ERRORS_PROCEDIMENT[idea] : null;
    const infoEM = idea ? ERRORS_MATEMATICS[idea] : null;
    const preguntaOrientadora =
      infoEP?.missatge ||
      infoEM?.missatge ||
      (infoIdea ? `Fixa't en les mesures de la taula: ${infoIdea.contrast}` : "Torna a mirar les mesures anotades al quadern. Què t'indiquen?");

    return {
      superat: false,
      missatge: preguntaOrientadora,
      ideaDetectada: idea,
      codiError: idea
    };
  }

  // Cas 2: Resposta numèrica amb unitat («aplica» o «calcula»)
  if (pas.respostaNumerica) {
    const rn = pas.respostaNumerica;
    const val = validaRespostaNumerica({
      valorAlumne: resposta.valor,
      unitatAlumne: resposta.unitat,
      valorEsperat: rn.valor,
      unitatEsperada: rn.unitat,
      toleranciaRelativa: rn.toleranciaRelativa ?? 0.02,
      toleranciaAbsoluta: rn.toleranciaAbsoluta ?? null,
      nivell
    });

    return {
      superat: val.correcte,
      missatge: val.missatge,
      ideaDetectada: null,
      codiError: val.codiError
    };
  }

  return { superat: true, missatge: "Anotat.", ideaDetectada: null, codiError: null };
}
