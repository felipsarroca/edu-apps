/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Script de validació de les dades de referència (03-dades-de-referencia.md §9).
 * Comprova:
 * 1. Que cada valor escolar cau dins de l'interval de referència (quan n'hi ha).
 * 2. Que la massa de cada objecte massís del prestatge és d · V.
 * 3. Que cada objecte que es mesura per desplaçament hi cap almenys en una proveta o al vas de vessament,
 *    i que els grans tenen forma regular per mesurar amb el regle.
 * 4. Que els sis objectes misteri del joc de detectius tenen densitats diferents.
 */

import { MATERIALS } from "../js/dades/materials.js";
import { LIQUIDS } from "../js/dades/liquids.js";
import { OBJECTES_PRESTATGE } from "../js/dades/objectes.js";
import { RECIPIENTS } from "../js/dades/recipients.js";
import { magnitudsObjecte } from "../js/fisica/objecte.js";
import { hiCapObjecte } from "../js/fisica/recipient.js";
import { iguals } from "../js/fisica/unitats.js";

export function validaTotesLesDades() {
  const errors = [];

  // 1. Valors escolars dins de l'interval de referència (sòlids i líquids)
  for (const [id, mat] of Object.entries(MATERIALS)) {
    if (mat.dEscolar <= 0) {
      errors.push(`Material ${id}: dEscolar ha de ser positiu.`);
    }
    if (Array.isArray(mat.interval) && mat.interval.length === 2) {
      const [min, max] = mat.interval;
      if (mat.dEscolar < min - 1e-6 || mat.dEscolar > max + 1e-6) {
        errors.push(`Material ${id}: dEscolar (${mat.dEscolar}) fora de l'interval [${min}, ${max}].`);
      }
    }
  }

  for (const [id, liq] of Object.entries(LIQUIDS)) {
    if (liq.dEscolar <= 0) {
      errors.push(`Líquid ${id}: dEscolar ha de ser positiu.`);
    }
    if (Array.isArray(liq.interval) && liq.interval.length === 2) {
      const [min, max] = liq.interval;
      if (liq.dEscolar < min - 1e-6 || liq.dEscolar > max + 1e-6) {
        errors.push(`Líquid ${id}: dEscolar (${liq.dEscolar}) fora de l'interval [${min}, ${max}].`);
      }
    }
  }

  // 2 i 3. Objectes del prestatge: massa = d * V i compatibilitat amb provetes/vessament o regle
  const recipientsImmersio = [
    RECIPIENTS.proveta25,
    RECIPIENTS.proveta100,
    RECIPIENTS.proveta250,
    RECIPIENTS.proveta500,
    RECIPIENTS.proveta1000,
    RECIPIENTS.vasVessament
  ];

  for (const [id, obj] of Object.entries(OBJECTES_PRESTATGE)) {
    const mag = magnitudsObjecte(obj, { materials: MATERIALS, nombresSenzills: true });
    if (mag.massa <= 0 || mag.volumExterior <= 0) {
      errors.push(`Objecte ${id}: massa (${mag.massa}) o volum (${mag.volumExterior}) no vàlids.`);
    }

    // Si és un sòlid homogeni sense cavitats ni massa forçada especial (com l'ou de 60 g i 56 cm³)
    if (
      obj.parts.length === 1 &&
      (!obj.cavitatsTancades || obj.cavitatsTancades.length === 0) &&
      id !== "ou" &&
      id !== "corona"
    ) {
      const dMat = MATERIALS[obj.parts[0].material]?.dEscolar;
      const massaTeorica = dMat * mag.volumMaterial;
      if (!iguals(mag.massa, massaTeorica, 1e-3)) {
        errors.push(`Objecte ${id}: la massa (${mag.massa}) no coincideix amb d·V (${massaTeorica}).`);
      }
    }

    const capEnAlgunRecipient = recipientsImmersio.some(r => hiCapObjecte(obj, r).hiCap);
    const esRegularGran = obj.forma === "ortoedre" || obj.forma === "cub";
    if (!capEnAlgunRecipient && !esRegularGran) {
      errors.push(`Objecte ${id}: no cap en cap proveta ni al vas de vessament i tampoc té forma regular per mesurar amb el regle.`);
    }
  }

  // 4. Els sis objectes misteri han de tenir densitats diferents entre si
  const misteris = Object.values(OBJECTES_PRESTATGE).filter(o => o.id.startsWith("misteri_"));
  const densitatsMisteri = new Set();
  for (const m of misteris) {
    const mag = magnitudsObjecte(m, { materials: MATERIALS, nombresSenzills: true });
    const clau = mag.densitatMitjana.toFixed(2);
    if (densitatsMisteri.has(clau)) {
      errors.push(`Objecte misteri ${m.id}: densitat duplicada (${clau} g/cm³) dins el joc bàsic de detectius.`);
    }
    densitatsMisteri.add(clau);
  }

  return {
    valid: errors.length === 0,
    errors,
    resum: {
      materials: Object.keys(MATERIALS).length,
      liquids: Object.keys(LIQUIDS).length,
      objectes: Object.keys(OBJECTES_PRESTATGE).length,
      recipients: Object.keys(RECIPIENTS).length
    }
  };
}

// Si s'executa directament des de CLI
if (import.meta.url.endsWith("valida-dades.mjs")) {
  const res = validaTotesLesDades();
  if (!res.valid) {
    console.error("Errors de validació de dades:", res.errors);
    process.exit(1);
  } else {
    console.log(
      `Dades validades correctament: ${res.resum.materials} materials, ${res.resum.liquids} líquids, ${res.resum.objectes} objectes i ${res.resum.recipients} recipients.`
    );
  }
}
