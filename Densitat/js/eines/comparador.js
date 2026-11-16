/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Comparador de dues situacions A i B per al control de variables (04-laboratori-i-instruments.md §7.3, investigació E5).
 * Si l'alumne canvia més d'una variable independent alhora, avisa:
 * «Has canviat dues coses. Com sabràs quina ha causat el resultat?»
 */

import { MATERIALS } from "../dades/materials.js";
import { LIQUIDS } from "../dades/liquids.js";
import { estatObjecteEnLiquid } from "../fisica/flotacio.js";
import { formataNombre } from "../fisica/unitats.js";
import { icona } from "./icones.js";

export function renderitzaComparador(estatComp = {}) {
  const sitA = estatComp.A || { material: "alumini", volum: 50, liquid: "aigua", profunditat: 10 };
  const sitB = estatComp.B || { material: "acer", volum: 50, liquid: "aigua", profunditat: 10 };

  const variablesCanviades = [];
  if (sitA.material !== sitB.material) variablesCanviades.push("material (massa)");
  if (Number(sitA.volum) !== Number(sitB.volum)) variablesCanviades.push("volum");
  if (sitA.liquid !== sitB.liquid) variablesCanviades.push("líquid");
  if (Number(sitA.profunditat) !== Number(sitB.profunditat)) variablesCanviades.push("profunditat");

  const objA = { id: "compA", forma: "esfera", parts: [{ material: sitA.material, volum: Number(sitA.volum) }] };
  const objB = { id: "compB", forma: "esfera", parts: [{ material: sitB.material, volum: Number(sitB.volum) }] };

  const resA = estatObjecteEnLiquid(objA, LIQUIDS[sitA.liquid]?.dEscolar ?? 1.0, {
    materials: MATERIALS,
    nombresSenzills: true
  });
  const resB = estatObjecteEnLiquid(objB, LIQUIDS[sitB.liquid]?.dEscolar ?? 1.0, {
    materials: MATERIALS,
    nombresSenzills: true
  });

  let missatgeControl = "Canvia una sola variable entre A i B per fer un experiment controlat.";
  let classeControl = "control-neutre";
  if (variablesCanviades.length === 1) {
    missatgeControl = `Control de variables correcte: només has canviat «${variablesCanviades[0]}».`;
    classeControl = "control-ok";
  } else if (variablesCanviades.length > 1) {
    missatgeControl = `Has canviat ${variablesCanviades.length} coses (${variablesCanviades.join(", ")}). Com sabràs quina ha causat el resultat?`;
    classeControl = "control-avis";
  }

  const materialsOpcions = ["suro", "pi", "cera", "plastilina", "ceramica", "alumini", "acer", "plom"];
  const liquidsOpcions = ["alcohol", "oli", "aigua", "aigua_salada", "mel"];

  const columnaHTML = (lletra, sit, res) => `
    <div class="comp-col">
      <h5>Situació ${lletra}</h5>
      <label class="comp-fila">
        <span>Material</span>
        <select data-comp-col="${lletra}" data-comp-camp="material">
          ${materialsOpcions.map(m => `<option value="${m}" ${m === sit.material ? "selected" : ""}>${MATERIALS[m]?.nom || m} (${formataNombre(MATERIALS[m]?.dEscolar)} g/cm³)</option>`).join("")}
        </select>
      </label>
      <label class="comp-fila">
        <span>Volum</span>
        <select data-comp-col="${lletra}" data-comp-camp="volum">
          ${[20, 50, 100, 200].map(v => `<option value="${v}" ${Number(sit.volum) === v ? "selected" : ""}>${v} cm³</option>`).join("")}
        </select>
      </label>
      <label class="comp-fila">
        <span>Líquid</span>
        <select data-comp-col="${lletra}" data-comp-camp="liquid">
          ${liquidsOpcions.map(l => `<option value="${l}" ${l === sit.liquid ? "selected" : ""}>${LIQUIDS[l]?.nom || l} (${formataNombre(LIQUIDS[l]?.dEscolar)} g/cm³)</option>`).join("")}
        </select>
      </label>
      <label class="comp-fila">
        <span>Profunditat (si s'enfonsa)</span>
        <select data-comp-col="${lletra}" data-comp-camp="profunditat">
          ${[10, 25, 40].map(p => `<option value="${p}" ${Number(sit.profunditat) === p ? "selected" : ""}>${p} cm</option>`).join("")}
        </select>
      </label>
      <div class="comp-resultats">
        <div><span>Massa:</span> <strong>${formataNombre(res.massa)} g</strong></div>
        <div><span>Estat:</span> <strong>${res.sura ? `Sura (${formataNombre(res.percentatgeSubmergit, 1)} %)` : "S'enfonsa"}</strong></div>
        <div><span>Pes P:</span> <strong>${formataNombre(res.pes, 2)} N</strong></div>
        <div><span>Empenyiment E:</span> <strong>${formataNombre(res.empenyiment, 2)} N</strong></div>
      </div>
    </div>
  `;

  return `
    <div class="eina-flotant eina-comparador" role="region" aria-label="Comparador de dues situacions">
      <div class="eina-cap">
        <h4>${icona("comparador")} Comparador A / B (control de variables)</h4>
        <button type="button" class="bt-icona" data-tanca-eina="true" aria-label="Tanca el comparador">${icona("tanca")}</button>
      </div>
      <div class="comp-banner ${classeControl}">${missatgeControl}</div>
      <div class="comp-grid">
        ${columnaHTML("A", sitA, resA)}
        ${columnaHTML("B", sitB, resB)}
      </div>
    </div>
  `;
}
