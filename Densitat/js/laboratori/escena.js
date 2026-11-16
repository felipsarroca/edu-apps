/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Composició principal de la pantalla del Laboratori:
 * Prestatge + Taula de treball activa + Eina emergent + Barra inferior de taules i eines + Panell lateral (08-disseny-visual-i-interaccio.md §3.1).
 */

import { renderitzaPrestatge } from "./prestatge.js";
import {
  renderitzaTaulaMesura,
  renderitzaTaulaColumna,
  renderitzaTaulaTanc,
  renderitzaTaulaTaller,
  renderitzaLupaMenisc,
  renderitzaRegle
} from "./taules.js";
import { renderitzaPanellLateral } from "./panell-guia.js";
import { renderitzaCalculadora } from "../eines/calculadora.js";
import { renderitzaConversor } from "../eines/conversor.js";
import { renderitzaGraficaMassaVolum } from "../eines/grafica.js";
import { renderitzaComparador } from "../eines/comparador.js";
import { potDesfer, potRefer } from "../estat/magatzem.js";
import { icona } from "../eines/icones.js";

const TAULES_DISPONIBLES = [
  { id: "mesura", nom: "Mesura", ic: "balanca" },
  { id: "columna", nom: "Columna", ic: "proveta" },
  { id: "tanc", nom: "Tanc", ic: "tanc" },
  { id: "taller", nom: "Taller", ic: "taller" }
];

const EINES_PENSA = [
  { id: "regle", nom: "Regle", ic: "regle" },
  { id: "lupa", nom: "Lupa menisc", ic: "lupa" },
  { id: "calculadora", nom: "Calculadora", ic: "calculadora" },
  { id: "conversor", nom: "Conversor", ic: "conversor" },
  { id: "grafica", nom: "Gràfica m-V", ic: "grafica" },
  { id: "comparador", nom: "Comparador A/B", ic: "comparador" }
];

export function renderitzaPantallaLaboratori(estat, estatEines = {}) {
  const lab = estat.laboratori;
  const taulaActiva = lab.taula || "mesura";
  const einaActiva = lab.einaActiva;

  let escenaTaulaHtml = "";
  if (taulaActiva === "mesura") escenaTaulaHtml = renderitzaTaulaMesura(estat);
  else if (taulaActiva === "columna") escenaTaulaHtml = renderitzaTaulaColumna(estat);
  else if (taulaActiva === "tanc") escenaTaulaHtml = renderitzaTaulaTanc(estat);
  else if (taulaActiva === "taller") escenaTaulaHtml = renderitzaTaulaTaller(estat);

  let einaFlotantHtml = "";
  if (einaActiva === "regle") einaFlotantHtml = renderitzaRegle(estat);
  else if (einaActiva === "lupa") einaFlotantHtml = renderitzaLupaMenisc(estat);
  else if (einaActiva === "calculadora") einaFlotantHtml = renderitzaCalculadora(estat, estatEines.calculadora);
  else if (einaActiva === "conversor") einaFlotantHtml = renderitzaConversor(estatEines.conversor);
  else if (einaActiva === "grafica") einaFlotantHtml = renderitzaGraficaMassaVolum(estat, estatEines.grafica);
  else if (einaActiva === "comparador") einaFlotantHtml = renderitzaComparador(estatEines.comparador);

  return `
    <section class="pantalla-laboratori ${estat.panellPlegat ? "amb-panell-plegat" : ""}">
      <div class="laboratori-cos">
        ${renderitzaPrestatge(estat)}

        <div class="laboratori-zona-central">
          <div class="laboratori-escena-container">
            ${
              lab.avísFisic
                ? `<div class="bafarada-avis-fisic" role="alert">
                    <span>${icona("avís")} ${lab.avísFisic}</span>
                    <button type="button" class="bt-icona" data-tanca-avis="true" aria-label="Tanca l'avís">${icona("tanca")}</button>
                  </div>`
                : ""
            }
            ${escenaTaulaHtml}
            ${einaFlotantHtml}
          </div>

          <!-- Barra inferior de taules de treball i eines de pensament (56 px) -->
          <footer class="barra-eines-laboratori" role="toolbar" aria-label="Taules de treball i eines del laboratori">
            <div class="grup-taules" role="tablist" aria-label="Taules de treball">
              ${TAULES_DISPONIBLES.map(
                t => `
                <button type="button" role="tab" aria-selected="${t.id === taulaActiva}" class="bt-taula ${t.id === taulaActiva ? "activa" : ""}" data-canvia-taula="${t.id}">
                  ${icona(t.ic)} <span>${t.nom}</span>
                </button>`
              ).join("")}
            </div>

            <div class="separador-vertical" aria-hidden="true"></div>

            <div class="grup-eines-pensa">
              ${EINES_PENSA.map(
                e => `
                <button type="button" class="bt-eina ${e.id === einaActiva ? "activa" : ""}" data-obre-eina="${e.id}" aria-pressed="${e.id === einaActiva}">
                  ${icona(e.ic)} <span>${e.nom}</span>
                </button>`
              ).join("")}
            </div>

            <div class="separador-vertical" aria-hidden="true"></div>

            <div class="grup-historial">
              <button type="button" class="bt-eina" data-desfes="true" ${potDesfer() ? "" : "disabled"} title="Desfés l'última acció (Ctrl+Z)">
                ${icona("desfes")} <span>Desfés</span>
              </button>
              <button type="button" class="bt-eina" data-refes="true" ${potRefer() ? "" : "disabled"} title="Refés (Ctrl+Y)">
                ${icona("refes")}
              </button>
              <button type="button" class="bt-eina" data-reinicia-escena="true" title="Reinicia l'escena actual sense esborrar el quadern">
                ${icona("reinicia")} <span>Reinicia</span>
              </button>
            </div>
          </footer>
        </div>

        ${renderitzaPanellLateral(estat)}
      </div>
    </section>
  `;
}
