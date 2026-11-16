/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Conversor i escala visual d'unitats de massa, capacitat, volum i densitat (04-laboratori-i-instruments.md §7.2).
 */

import { converteixUnitat, formataNombre, interpretaNombre } from "../fisica/unitats.js";
import { icona } from "./icones.js";

export const ESCALES_UNITATS = {
  massa: {
    titol: "Massa (graons de 10)",
    pas: 10,
    unitats: ["kg", "hg", "dag", "g", "dg", "cg", "mg"],
    defecteVal: "270",
    defecteOrig: "g",
    defecteDest: "kg"
  },
  capacitat: {
    titol: "Capacitat (graons de 10)",
    pas: 10,
    unitats: ["L", "dL", "cL", "mL"],
    defecteVal: "0,25",
    defecteOrig: "L",
    defecteDest: "mL"
  },
  volum: {
    titol: "Volum (graons de 1000: 10 × 10 × 10)",
    pas: 1000,
    unitats: ["m³", "dm³", "cm³", "mm³"],
    defecteVal: "1",
    defecteOrig: "dm³",
    defecteDest: "cm³"
  },
  densitat: {
    titol: "Densitat i factors de conversió",
    pas: 1000,
    unitats: ["g/cm³", "g/mL", "kg/L", "kg/dm³", "kg/m³", "g/L"],
    defecteVal: "2,7",
    defecteOrig: "g/cm³",
    defecteDest: "kg/m³"
  }
};

export function renderitzaConversor(estatConv = {}) {
  const familia = estatConv.familia || "volum";
  const info = ESCALES_UNITATS[familia] || ESCALES_UNITATS.volum;
  const valTxt = estatConv.valor ?? info.defecteVal;
  const uOrig = info.unitats.includes(estatConv.uOrig) ? estatConv.uOrig : info.defecteOrig;
  const uDest = info.unitats.includes(estatConv.uDest) ? estatConv.uDest : info.defecteDest;

  const num = interpretaNombre(valTxt);
  let resultat = null;
  if (Number.isFinite(num)) {
    try {
      resultat = converteixUnitat(num, uOrig, uDest);
    } catch (e) {
      resultat = null;
    }
  }

  const graonsHtml = info.unitats
    .map(
      (u, idx) => `
      <div class="grao-escala ${u === uOrig ? "grao-orig" : ""} ${u === uDest ? "grao-dest" : ""}">
        <span class="grao-nom">${u}</span>
        ${idx < info.unitats.length - 1 ? `<span class="grao-fletxa">×${info.pas} ⇄ ÷${info.pas}</span>` : ""}
      </div>`
    )
    .join("");

  return `
    <div class="eina-flotant eina-conversor" role="region" aria-label="Conversor i escala d'unitats">
      <div class="eina-cap">
        <h4>${icona("conversor")} Escala i conversor d'unitats</h4>
        <button type="button" class="bt-icona" data-tanca-eina="true" aria-label="Tanca el conversor">${icona("tanca")}</button>
      </div>
      <div class="pestanyes-curtes">
        ${Object.entries(ESCALES_UNITATS)
          .map(
            ([k, v]) =>
              `<button type="button" class="pestanya-curta ${k === familia ? "activa" : ""}" data-conv-familia="${k}">${k.charAt(0).toUpperCase() + k.slice(1)}</button>`
          )
          .join("")}
      </div>
      <p class="etiqueta-petita">${info.titol}</p>
      <div class="escala-graons">${graonsHtml}</div>
      <div class="conv-controls">
        <input type="text" id="conv-val" value="${valTxt}" inputmode="decimal" aria-label="Valor a convertir">
        <select id="conv-orig" aria-label="Unitat origen">
          ${info.unitats.map(u => `<option value="${u}" ${u === uOrig ? "selected" : ""}>${u}</option>`).join("")}
        </select>
        <span>=</span>
        <strong class="conv-resultat">${resultat !== null ? `${formataNombre(resultat)} ${uDest}` : "—"}</strong>
        <select id="conv-dest" aria-label="Unitat destí">
          ${info.unitats.map(u => `<option value="${u}" ${u === uDest ? "selected" : ""}>${u}</option>`).join("")}
        </select>
      </div>
      ${
        familia === "densitat" && Number.isFinite(num)
          ? `<div class="conv-factor-box">
              <span>Factor de conversió del llibre:</span>
              <code>${formataNombre(num)} g/cm³ · (1 kg / 1000 g) · (1 000 000 cm³ / 1 m³) = <strong>${formataNombre(converteixUnitat(num, "g/cm³", "kg/m³"))} kg/m³</strong></code>
            </div>`
          : `<div class="conv-factor-box">
              <span>Equivalència clau:</span>
              <code>1 dm³ = 1 L = 1000 cm³ = 1000 mL &nbsp;·&nbsp; 1 cm³ = 1 mL &nbsp;·&nbsp; 1 m³ = 1000 L</code>
            </div>`
      }
    </div>
  `;
}
