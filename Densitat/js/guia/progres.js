/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Càlcul del progrés en les quatre dimensions d'aprenentatge i recomanacions (01-fonaments-pedagogics.md §8, 07-guia-quadern-i-avaluacio.md §6).
 */

import { INVESTIGACIONS_LLISTA, INVESTIGACIONS } from "../dades/investigacions/index.js";

export const DIMENSIONS_PROGRES = [
  {
    id: "conceptual",
    nom: "Comprensió conceptual",
    descripcio: "Distingeix massa, volum, densitat, pes i empenyiment; supera les idees prèvies.",
    recomanada: "C4"
  },
  {
    id: "procediment",
    nom: "Procediment experimental",
    descripcio: "Tria l'instrument adequat, fa la tara, llegeix el menisc i controla variables.",
    recomanada: "A7"
  },
  {
    id: "matematica",
    nom: "Competència matemàtica",
    descripcio: "Calcula densitats amb unitats, converteix unitats i interpreta gràfiques.",
    recomanada: "B1"
  },
  {
    id: "raonament",
    nom: "Raonament científic",
    descripcio: "Prediu amb motiu, explica les discrepàncies i conclou a partir de les dades.",
    recomanada: "D2"
  }
];

/**
 * Calcula l'estat de les 4 dimensions de progrés i la següent investigació recomanada.
 * @param {object} estat
 * @returns {object}
 */
export function calculaResumProgres(estat) {
  const fetes = estat?.progres?.fetes || [];
  const evidencies = estat?.progres?.evidencies || [];
  const idees = estat?.progres?.diagnosi?.idees || {};

  const punts = {
    conceptual: 0,
    procediment: 0,
    matematica: 0,
    raonament: 0
  };

  // Cada investigació completada suma evidències a les dimensions relacionades amb el seu bloc
  for (const id of fetes) {
    const inv = INVESTIGACIONS[id];
    if (!inv) continue;
    punts.raonament += 12;
    if (inv.bloc === "A") {
      punts.procediment += 18;
      punts.conceptual += 8;
    } else if (inv.bloc === "B") {
      punts.matematica += 22;
      punts.conceptual += 8;
    } else if (inv.bloc === "C") {
      punts.conceptual += 15;
      punts.matematica += 15;
      punts.procediment += 10;
    } else if (inv.bloc === "D") {
      punts.conceptual += 18;
      punts.raonament += 12;
    } else if (inv.bloc === "E" || inv.bloc === "G") {
      punts.conceptual += 16;
      punts.matematica += 14;
    } else if (inv.bloc === "F") {
      punts.raonament += 15;
      punts.conceptual += 12;
      punts.procediment += 10;
    }
  }

  for (const ev of evidencies) {
    if (ev.dimensio && typeof punts[ev.dimensio] === "number") {
      punts[ev.dimensio] += ev.valor ?? 5;
    }
  }

  // Idees superades sumen comprensió conceptual
  const llistaIdees = Object.values(idees);
  const superades = llistaIdees.filter(i => i.estat === "superada");
  const actives = llistaIdees.filter(i => i.estat === "activa");
  const enRevisio = llistaIdees.filter(i => i.estat === "en_revisio");
  punts.conceptual += superades.length * 8;

  const dimensions = DIMENSIONS_PROGRES.map(d => ({
    ...d,
    percentatge: Math.min(100, Math.round(punts[d.id] || 0))
  }));

  // Recomanació:
  // 1. Si hi ha una idea prèvia activa amb investigació de contrast pendent, recomana-la
  let recomanadaId = null;
  for (const act of actives) {
    const infoInv = INVESTIGACIONS_LLISTA.find(
      inv => (inv.idees || []).includes(act.codi) && !fetes.includes(inv.id)
    );
    if (infoInv) {
      recomanadaId = infoInv.id;
      break;
    }
  }

  // 2. Si no, busca la dimensió més baixa i recomana una investigació no feta
  if (!recomanadaId) {
    const ordenada = [...dimensions].sort((a, b) => a.percentatge - b.percentatge);
    for (const dim of ordenada) {
      if (!fetes.includes(dim.recomanada)) {
        recomanadaId = dim.recomanada;
        break;
      }
    }
  }

  // 3. Si ja estan fetes, la primera de l'itinerari general pendent (prioritzant la fase 1a)
  if (!recomanadaId) {
    const ordre1a = ["D1", "A7", "C3", "C4", "D2", "D3", "D4", "D5", "C6"];
    recomanadaId =
      ordre1a.find(id => !fetes.includes(id)) ||
      INVESTIGACIONS_LLISTA.find(i => !fetes.includes(i.id))?.id ||
      "C4";
  }

  return {
    fetesCount: fetes.length,
    totalCount: INVESTIGACIONS_LLISTA.length,
    dimensions,
    ideesSuperades: superades,
    ideesActives: actives,
    ideesEnRevisio: enRevisio,
    recomanada: INVESTIGACIONS[recomanadaId] || INVESTIGACIONS.C4
  };
}
