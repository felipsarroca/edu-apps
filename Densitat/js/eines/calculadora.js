/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Calculadora amb fitxes d'unitats (04-laboratori-i-instruments.md §7.1).
 * Les lectures anotades al quadern es presenten com a fitxes clicables amb número i unitat.
 * Si l'alumne divideix volum entre massa, obté cm³/g i un missatge socràtic (EM-01).
 */

import { formataNombre, interpretaNombre, netejaDecimal } from "../fisica/unitats.js";
import { icona } from "./icones.js";

/**
 * Calcula el resultat i la unitat derivada de l'operació entre dues mesures amb unitat.
 * @param {number} valA
 * @param {string} uniA
 * @param {string} op - "÷" | "−" | "×" | "+"
 * @param {number} valB
 * @param {string} uniB
 * @returns {{valor: number|null, unitat: string, magnitud: string, avís: string|null, codiError: string|null}}
 */
export function operaAmbUnitats(valA, uniA, op, valB, uniB) {
  if (!Number.isFinite(valA) || !Number.isFinite(valB)) {
    return { valor: null, unitat: "", magnitud: "", avís: "Introdueix o selecciona dos valors.", codiError: null };
  }

  if (op === "÷") {
    if (Math.abs(valB) < 1e-12) {
      return { valor: null, unitat: "", magnitud: "", avís: "No es pot dividir per zero.", codiError: null };
    }
    const q = netejaDecimal(valA / valB, 4);
    const uA = uniA.trim();
    const uB = uniB.trim();

    if ((uA === "g" || uA === "kg") && (uB === "cm³" || uB === "mL" || uB === "L" || uB === "m³")) {
      const unitatRes = uB === "mL" && uA === "g" ? "g/cm³" : `${uA}/${uB}`;
      return {
        valor: q,
        unitat: unitatRes,
        magnitud: "Densitat",
        avís: uB === "mL" && uA === "g" ? "Com que 1 mL = 1 cm³, g/mL és equivalent a g/cm³." : null,
        codiError: null
      };
    }

    if ((uA === "cm³" || uA === "mL" || uA === "L") && (uB === "g" || uB === "kg")) {
      return {
        valor: q,
        unitat: `${uA}/${uB}`,
        magnitud: "Volum específic (invers)",
        avís: "Has dividit el volum entre la massa: aquest número indica quant espai ocupa cada gram. Per obtenir la densitat (massa de cada cm³), divideix la massa entre el volum.",
        codiError: "EM-01"
      };
    }

    if (uA === "g" && uB.startsWith("g/")) {
      const uVol = uB.split("/")[1] || "cm³";
      return { valor: q, unitat: uVol, magnitud: "Volum calculat", avís: null, codiError: null };
    }

    return {
      valor: q,
      unitat: uA && uB ? `${uA}/${uB}` : uA || uB,
      magnitud: "Quocient",
      avís: null,
      codiError: null
    };
  }

  if (op === "−") {
    const r = netejaDecimal(valA - valB, 4);
    const equivalenVol = ["cm³", "mL"].includes(uniA) && ["cm³", "mL"].includes(uniB);
    if (uniA && uniB && uniA !== uniB && !equivalenVol) {
      return {
        valor: r,
        unitat: uniA,
        magnitud: "Diferència",
        avís: "Compte: estàs restant dues mesures amb unitats diferents.",
        codiError: "EM-02"
      };
    }
    const mag =
      uniA === "mL" || uniA === "cm³"
        ? "Volum per desplaçament"
        : uniA === "N"
        ? "Empenyiment (P − Pa)"
        : "Diferència";
    return {
      valor: r,
      unitat: equivalenVol ? "cm³" : uniA || uniB,
      magnitud: mag,
      avís: r < 0 ? "El resultat és negatiu: posa el valor final primer i l'inicial després." : null,
      codiError: null
    };
  }

  if (op === "×") {
    const p = netejaDecimal(valA * valB, 4);
    let unitat = `${uniA}·${uniB}`;
    let magnitud = "Producte";
    if (uniA.startsWith("g/") && (uniB === "cm³" || uniB === "mL")) {
      unitat = "g";
      magnitud = "Massa calculada";
    } else if ((uniA === "cm³" || uniA === "mL") && uniB.startsWith("g/")) {
      unitat = "g";
      magnitud = "Massa calculada";
    } else if (uniA === "kg" && uniB === "N/kg") {
      unitat = "N";
      magnitud = "Pes (P = m · g)";
    }
    return { valor: p, unitat, magnitud, avís: null, codiError: null };
  }

  return {
    valor: netejaDecimal(valA + valB, 4),
    unitat: uniA || uniB,
    magnitud: "Suma",
    avís: null,
    codiError: null
  };
}

/**
 * Renderitza el panell emergent de la calculadora amb unitats.
 */
export function renderitzaCalculadora(estat, estatCalc = {}) {
  const mesures = (estat.quadern.mesures || []).slice(-10).reverse();
  const valA = estatCalc.valA ?? "270";
  const uniA = estatCalc.uniA ?? "g";
  const op = estatCalc.op ?? "÷";
  const valB = estatCalc.valB ?? "100";
  const uniB = estatCalc.uniB ?? "cm³";

  const res = operaAmbUnitats(interpretaNombre(valA), uniA, op, interpretaNombre(valB), uniB);

  const fitxesHtml =
    mesures.length > 0
      ? mesures
          .map(
            (m, idx) => `
          <button type="button" class="chip-mesura" data-calc-chip="${idx}" data-val="${m.valor}" data-uni="${m.unitat}" data-obj="${m.objecteId}">
            <span class="chip-obj">${m.objecteNom || m.objecteId}</span>
            <strong>${formataNombre(m.valor)} ${m.unitat}</strong>
          </button>`
          )
          .join("")
      : `<span class="text-suau">Anota mesures dels instruments per tenir fitxes ràpides aquí, o escriu els valors directament.</span>`;

  return `
    <div class="eina-flotant eina-calculadora" role="region" aria-label="Calculadora amb unitats">
      <div class="eina-cap">
        <h4>${icona("calculadora")} Calculadora amb unitats</h4>
        <button type="button" class="bt-icona" data-tanca-eina="true" aria-label="Tanca la calculadora">${icona("tanca")}</button>
      </div>
      <div class="calc-fitxes">
        <span class="etiqueta-petita">Fitxes del quadern (clica per portar a A o B):</span>
        <div class="llista-fitxes">${fitxesHtml}</div>
      </div>
      <div class="calc-operacio">
        <div class="calc-camp">
          <label>Dada A</label>
          <div class="fila-input">
            <input type="text" id="calc-val-a" value="${valA}" inputmode="decimal" aria-label="Valor A">
            <select id="calc-uni-a" aria-label="Unitat A">
              ${["g", "kg", "cm³", "mL", "L", "g/cm³", "N"].map(u => `<option value="${u}" ${u === uniA ? "selected" : ""}>${u}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="calc-camp calc-op-sel">
          <label>Operació</label>
          <select id="calc-op" aria-label="Operació">
            <option value="÷" ${op === "÷" ? "selected" : ""}>÷ (divideix: d = m / V)</option>
            <option value="−" ${op === "−" ? "selected" : ""}>− (resta: Vfinal − Vinicial o P − Pa)</option>
            <option value="×" ${op === "×" ? "selected" : ""}>× (multiplica: m = d · V)</option>
          </select>
        </div>
        <div class="calc-camp">
          <label>Dada B</label>
          <div class="fila-input">
            <input type="text" id="calc-val-b" value="${valB}" inputmode="decimal" aria-label="Valor B">
            <select id="calc-uni-b" aria-label="Unitat B">
              ${["cm³", "mL", "L", "g", "kg", "g/cm³", "N", "N/kg"].map(u => `<option value="${u}" ${u === uniB ? "selected" : ""}>${u}</option>`).join("")}
            </select>
          </div>
        </div>
      </div>
      <div class="calc-resultat ${res.codiError ? "amb-avis" : ""}">
        <div>
          <span class="etiqueta-petita">${res.magnitud || "Resultat"}:</span>
          <strong class="calc-valor-final">${res.valor !== null ? `${formataNombre(res.valor)} ${res.unitat}` : "—"}</strong>
        </div>
        ${
          res.valor !== null
            ? `<button type="button" class="bt bt-primari bt-petit" data-anota-calcul="true" data-mag="${res.magnitud}" data-val="${res.valor}" data-uni="${res.unitat}">
                ${icona("anota")} Anota al quadern
              </button>`
            : ""
        }
      </div>
      ${res.avís ? `<p class="calc-avis">${res.avís}</p>` : ""}
    </div>
  `;
}
