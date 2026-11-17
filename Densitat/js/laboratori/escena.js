/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Composició principal de la pantalla del Laboratori:
 * Prestatge + Zones de treball (pestanyes) + Escena + Eines + Panell lateral (08-disseny-visual-i-interaccio.md §3.1).
 *
 * A dalt, les zones de treball (pestanyes), el menú «Vistes» i les accions de l'escena; a baix, les sis eines.
 * La vista completa (Opcions) afegeix els detalls tècnics, el catàleg sencer i les ampolles de líquids.
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
  { id: "mesura", nom: "Pesar i mesurar", ic: "balanca", ajuda: "Balança, proveta i vas per veure si un objecte sura" },
  { id: "columna", nom: "Columna de líquids", ic: "proveta", ajuda: "Líquids que no es barregen i aigua amb sal" },
  { id: "tanc", nom: "Tanc d'aigua", ic: "tanc", ajuda: "Dinamòmetre, barques, submarí, pressió i més" },
  { id: "taller", nom: "Taller", ic: "taller", ajuda: "Talla, modela i construeix objectes i barques" }
];

const EINES_PENSA = [
  { id: "calculadora", nom: "Calculadora", ic: "calculadora", ajuda: "Calcula la densitat amb les mesures que has anotat" },
  { id: "regle", nom: "Regle", ic: "regle", ajuda: "Mesura els costats d'un objecte per calcular-ne el volum" },
  { id: "lupa", nom: "Lupa", ic: "lupa", ajuda: "Amplia el nivell del líquid de la proveta per llegir-lo bé" },
  { id: "conversor", nom: "Conversor", ic: "conversor", ajuda: "Passa d'una unitat a una altra (g i kg, mL i L…)" },
  { id: "grafica", nom: "Gràfica", ic: "grafica", ajuda: "Dibuixa les teves mesures en una gràfica de massa i volum" },
  { id: "comparador", nom: "Comparador", ic: "comparador", ajuda: "Compara dues situacions canviant una sola cosa" }
];

// Vistes addicionals de l'escena (els noms coincideixen amb els que citen les guies de les investigacions)
const VISTES = [
  { id: "cubets", nom: "Cubets", ic: "cubets", ajuda: "Divideix l'objecte en cubets d'1 cm³: quant pesa cadascun?" },
  { id: "volums", nom: "Volums", ic: "volums", ajuda: "Separa el material i els buits de dins de l'objecte" },
  { id: "forces", nom: "Forces", ic: "forces", ajuda: "Dibuixa les fletxes del pes i de l'empenyiment" },
  { id: "particules", nom: "Partícules", ic: "particules", ajuda: "Model de com és el material per dins" }
];

/**
 * Targeta de primers passos: es mostra la primera vegada que s'entra al laboratori i es pot recuperar amb el botó d'ajuda.
 */
function renderitzaGuiaRapida() {
  return `
    <div class="guia-rapida" role="note" aria-label="Com funciona el laboratori">
      <ol class="guia-rapida-passos">
        <li><span class="guia-rapida-num">1</span><span><strong>Tria un objecte</strong> de la llista de l'esquerra.</span></li>
        <li><span class="guia-rapida-num">2</span><span><strong>Fes clic a un instrument</strong> (la balança, la proveta…) per posar-l'hi.</span></li>
        <li><span class="guia-rapida-num">3</span><span><strong>Prem «Anota»</strong> per desar la mesura al teu quadern.</span></li>
      </ol>
      <button type="button" class="bt bt-primari bt-petit" data-tanca-guia-rapida="true">Entesos</button>
    </div>
  `;
}

function renderitzaBarraEines(estat) {
  const einaActiva = estat.laboratori.einaActiva;
  return `
    <footer class="barra-eines-laboratori" role="toolbar" aria-label="Eines del laboratori">
      <div class="grup-eines-pensa">
        <span class="barra-rotul">Eines</span>
        ${EINES_PENSA.map(
          e => `
          <button type="button" class="bt-eina ${e.id === einaActiva ? "activa" : ""}" data-obre-eina="${e.id}" aria-pressed="${e.id === einaActiva}" title="${e.ajuda}">
            ${icona(e.ic)} <span>${e.nom}</span>
          </button>`
        ).join("")}
      </div>
    </footer>
  `;
}

function renderitzaMenuVistes(estat, menuObert) {
  const vistes = estat.laboratori.vistes;
  const nActives = VISTES.filter(v => vistes[v.id]).length;
  return `
    <div class="menu-ancora" data-menu="vistes">
      <button type="button" class="bt-accio-escena amb-text ${nActives > 0 ? "activa" : ""}" data-toggle-menu="vistes" aria-haspopup="true" aria-expanded="${menuObert === "vistes"}" title="Vistes: mostra cubets, volums, forces o partícules sobre l'escena">
        ${icona("ull")} <span>Vistes${nActives > 0 ? ` (${nActives})` : ""}</span>
      </button>
      <div class="menu-emergent menu-avall menu-dreta" role="menu" aria-label="Vistes de l'escena" ${menuObert === "vistes" ? "" : "hidden"}>
        <p class="menu-titol">Mostra sobre l'escena…</p>
        ${VISTES.map(
          v => `
          <button type="button" class="menu-element ${vistes[v.id] ? "actiu" : ""}" data-toggle-vista="${v.id}" role="menuitemcheckbox" aria-checked="${Boolean(vistes[v.id])}">
            ${icona(v.ic)}
            <span class="menu-element-text"><strong>${v.nom}</strong><small>${v.ajuda}</small></span>
            <span class="menu-element-marca" aria-hidden="true">${vistes[v.id] ? icona("verifica") : ""}</span>
          </button>`
        ).join("")}
      </div>
    </div>
  `;
}

export function renderitzaPantallaLaboratori(estat, estatEines = {}, ui = {}) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
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
          <!-- Pestanyes de zones de treball i accions de l'escena -->
          <div class="lab-barra-superior">
            <div class="lab-taules" role="tablist" aria-label="Zones de treball">
              ${TAULES_DISPONIBLES.map(
                t => `
                <button type="button" role="tab" aria-selected="${t.id === taulaActiva}" class="bt-taula ${t.id === taulaActiva ? "activa" : ""}" data-canvia-taula="${t.id}" title="${t.ajuda}">
                  ${icona(t.ic)} <span>${t.nom}</span>
                </button>`
              ).join("")}
            </div>
            <div class="lab-accions-escena">
              <button type="button" class="bt-accio-escena" data-desfes="true" ${potDesfer() ? "" : "disabled"} title="Desfés l'última acció (Ctrl+Z)" aria-label="Desfés">
                ${icona("desfes")}
              </button>
              <button type="button" class="bt-accio-escena" data-refes="true" ${potRefer() ? "" : "disabled"} title="Refés (Ctrl+Y)" aria-label="Refés">
                ${icona("refes")}
              </button>
              <button type="button" class="bt-accio-escena amb-text" data-reinicia-escena="true" title="Torna a deixar l'escena com al principi (les mesures anotades es conserven)">
                ${icona("reinicia")} <span>Reinicia</span>
              </button>
              ${renderitzaMenuVistes(estat, ui.menuObert)}
              <button type="button" class="bt-accio-escena ${cfg.guiaRapidaVista ? "" : "activa"}" data-obre-guia-rapida="true" title="Com funciona el laboratori" aria-label="Com funciona el laboratori">
                ${icona("ajuda")}
              </button>
            </div>
          </div>

          <div class="laboratori-escena-container">
            ${cfg.guiaRapidaVista ? "" : renderitzaGuiaRapida()}
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

          ${renderitzaBarraEines(estat)}
        </div>

        ${renderitzaPanellLateral(estat)}
      </div>
    </section>
  `;
}
