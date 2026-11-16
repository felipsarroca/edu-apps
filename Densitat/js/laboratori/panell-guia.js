/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Panell lateral del laboratori: Guia d'indagació (Observa, Prediu, Experimenta, Explica, Aplica),
 * Dades anotades en viu i Notes / Targetes de repte (07-guia-quadern-i-avaluacio.md §1–§4, 08-disseny-visual-i-interaccio.md §3.1).
 */

import { INVESTIGACIONS, INVESTIGACIONS_LLISTA, REPTES } from "../dades/investigacions/index.js";
import {
  comprovaCondicioPas,
  nomPasIndagacio,
  generaMissatgeContrastPrediccio
} from "../guia/motor.js";
import { renderitzaTaulaMesuresHTML } from "../quadern/quadern.js";
import { icona } from "../eines/icones.js";

export function renderitzaPanellLateral(estat) {
  if (estat.panellPlegat) {
    return `
      <aside class="laboratori-panell-plegat">
        <button type="button" class="bt-desplega-panell" data-plega-panell="false" title="Desplega el panell lateral" aria-label="Desplega el panell">
          ${icona("desplega")}
        </button>
      </aside>
    `;
  }

  const pestanya = estat.pestanyaPanell || (estat.modeLaboratori === "investigacio" ? "guia" : "dades");
  const mesuresInv = (estat.quadern?.mesures || []).filter(
    m => estat.modeLaboratori === "lliure" || m.investigacioId === estat.investigacio.id
  );

  return `
    <aside class="laboratori-panell" aria-label="Guia d'investigació, dades i notes">
      <div class="panell-pestanyes" role="tablist">
        <button type="button" role="tab" aria-selected="${pestanya === "guia"}" class="bt-pestanya-panell ${pestanya === "guia" ? "activa" : ""}" data-panell-tab="guia">
          Guia
        </button>
        <button type="button" role="tab" aria-selected="${pestanya === "dades"}" class="bt-pestanya-panell ${pestanya === "dades" ? "activa" : ""}" data-panell-tab="dades">
          Dades (${mesuresInv.length})
        </button>
        <button type="button" role="tab" aria-selected="${pestanya === "notes"}" class="bt-pestanya-panell ${pestanya === "notes" ? "activa" : ""}" data-panell-tab="notes">
          ${estat.modeLaboratori === "lliure" ? "Reptes (12)" : "Notes"}
        </button>
        <button type="button" class="bt-icona bt-plega" data-plega-panell="true" title="Plega el panell lateral" aria-label="Plega el panell">
          ${icona("plega")}
        </button>
      </div>

      <div class="panell-cos">
        ${pestanya === "guia" ? renderitzaContingutGuia(estat) : ""}
        ${
          pestanya === "dades"
            ? `<div class="panell-dades-viu">
                <div class="fila-entre">
                  <h4>Mesures anotades</h4>
                  <button type="button" class="bt-link bt-petit" data-canvia-pantalla="quadern">Obre el Quadern →</button>
                </div>
                ${renderitzaTaulaMesuresHTML(mesuresInv, true)}
              </div>`
            : ""
        }
        ${pestanya === "notes" ? renderitzaContingutNotesOReptes(estat) : ""}
      </div>
    </aside>
  `;
}

function renderitzaContingutGuia(estat) {
  const invId = estat.investigacio?.id || "C4";
  const inv = INVESTIGACIONS[invId] || INVESTIGACIONS.C4;
  const facil = estat.configuracio.lecturaFacil;
  const passos = inv.passos || [];
  const idxPas = Math.max(0, Math.min(passos.length - 1, estat.investigacio?.pas ?? 0));
  const pas = passos[idxPas];
  const respostes = estat.investigacio?.respostes || {};
  const pistesMostrades = estat.investigacio?.pistesPerPas?.[idxPas] || 0;
  const feta = estat.progres.fetes.includes(inv.id);

  // Condició automàtica de laboratori per als passos experimentals
  const condicioComplerta = comprovaCondicioPas(estat, pas, inv.id);
  const contrastPrediccio =
    pas.tipus === "explica" ? generaMissatgeContrastPrediccio(inv.id, respostes) : null;

  return `
    <div class="guia-container">
      <!-- Selector ràpid d'investigació -->
      <div class="guia-selector-inv">
        <select id="sel-investigacio-activa" aria-label="Canvia d'investigació">
          ${INVESTIGACIONS_LLISTA.map(
            i =>
              `<option value="${i.id}" ${i.id === inv.id ? "selected" : ""}>${i.id} · ${i.titol} ${
                estat.progres.fetes.includes(i.id) ? "✓" : ""
              }</option>`
          ).join("")}
        </select>
      </div>

      <div class="guia-pregunta-box">
        <span class="etiqueta-petita">Bloc ${inv.bloc} · Nivell ${inv.nivells.join("–")} · ${inv.durada} min</span>
        <h3>${facil ? inv.preguntaFacil : inv.pregunta}</h3>
      </div>

      <!-- Barra de passos del cicle d'indagació -->
      <div class="guia-passos-nav" role="navigation" aria-label="Passos de la investigació">
        ${passos
          .map(
            (p, i) => `
          <button type="button" class="bt-pas-dot ${i === idxPas ? "actiu" : ""} ${i < idxPas || feta ? "completat" : ""}" data-ves-pas="${i}">
            <span>${i + 1}. ${nomPasIndagacio(p.tipus)}</span>
          </button>`
          )
          .join("")}
      </div>

      <!-- Contingut del pas actiu -->
      <div class="guia-pas-card">
        <div class="fila-entre">
          <span class="insignia-pas">Pas ${idxPas + 1} de ${passos.length} · ${nomPasIndagacio(pas.tipus)}</span>
          ${
             (pas.tipus === "experimenta" || pas.tipus === "mesura") && condicioComplerta
              ? `<span class="badge-cond-ok">✓ Acció verificada al laboratori</span>`
              : ""
          }
        </div>

        <p class="guia-enunciat">${facil ? pas.facil : pas.text}</p>

        ${contrastPrediccio ? `<div class="guia-contrast-box">${contrastPrediccio}</div>` : ""}

        ${renderitzaControlsPas(estat, inv, pas, idxPas, respostes)}

        ${
          estat.investigacio.feedbackPas
            ? `<div class="guia-feedback ${estat.investigacio.feedbackPas.ok ? "fb-ok" : "fb-orienta"}" role="status">
                ${estat.investigacio.feedbackPas.text}
              </div>`
            : ""
        }

        <!-- Pistes en tres graons -->
        ${
          estat.configuracio.pistesActives && Array.isArray(pas.pistes) && pas.pistes.length > 0
            ? `
          <div class="guia-pistes-zona">
            ${
              pistesMostrades > 0
                ? `<ul class="llista-pistes-obertes">
                    ${pas.pistes
                      .slice(0, pistesMostrades)
                      .map((pTxt, pi) => `<li><strong>Pista ${pi + 1}:</strong> ${pTxt}</li>`)
                      .join("")}
                  </ul>`
                : ""
            }
            ${
              pistesMostrades < pas.pistes.length
                ? `<button type="button" class="bt bt-secundari bt-petit" data-demana-pista="${idxPas}">
                    ${icona("pista")} Demana pista (${pistesMostrades + 1}/${pas.pistes.length})
                  </button>`
                : ""
            }
          </div>`
            : ""
        }
      </div>

      <!-- Targeta de conclusió quan la investigació s'ha completat -->
      ${
        feta
          ? `
        <div class="guia-conclusio-final">
          <h4>✓ Investigació completada</h4>
          <p><strong>Conclusió:</strong> ${facil ? inv.conclusioFacil : inv.conclusio}</p>
        </div>`
          : ""
      }
    </div>
  `;
}

function renderitzaControlsPas(estat, inv, pas, idxPas, respostes) {
  const tipus = pas.tipus;

  if (tipus === "observa") {
    return `
      <div class="guia-accions-pas">
        <button type="button" class="bt bt-primari bt-complet" data-avanca-pas="${idxPas}">
          Continua al pas de predicció →
        </button>
      </div>
    `;
  }

  if (tipus === "prediu") {
    const respPred = respostes.prediu || {};
    const opSel = respPred.opcioId || "";
    const motSel = respPred.motiuId || "";

    return `
      <div class="guia-opcions-prediu">
        <fieldset class="grup-radios">
          <legend class="sr-only">Què passarà?</legend>
          ${(pas.opcions || [])
            .map(
              op => `
            <label class="opcio-radio ${opSel === op.id ? "seleccionada" : ""}">
              <input type="radio" name="prediu-opcio" value="${op.id}" ${opSel === op.id ? "checked" : ""}>
              <span>${op.text}</span>
            </label>`
            )
            .join("")}
        </fieldset>

        ${
          Array.isArray(pas.motius) && pas.motius.length > 0
            ? `
          <label class="guia-motiu-sel">
            <span>Perquè (tria el teu motiu):</span>
            <select id="sel-prediu-motiu">
              <option value="">Tria el motiu de la teva predicció...</option>
              ${pas.motius.map(m => `<option value="${m.id}" ${motSel === m.id ? "selected" : ""}>${m.text}</option>`).join("")}
            </select>
          </label>`
            : ""
        }

        <button type="button" class="bt bt-primari bt-complet" data-confirma-prediu="${idxPas}">
          Anota la predicció i comprovem-ho →
        </button>
      </div>
    `;
  }

  if (tipus === "experimenta" || tipus === "mesura") {
    return `
      <div class="guia-accions-pas">
        <button type="button" class="bt bt-primari bt-complet" data-avanca-pas="${idxPas}">
          Continua al pas d'explicació →
        </button>
      </div>
    `;
  }

  if (tipus === "explica") {
    const respExp = respostes.explica || {};
    const opSel = respExp.opcioId || "";

    return `
      <div class="guia-opcions-explica">
        <fieldset class="grup-radios">
          <legend class="sr-only">Explicació científica</legend>
          ${(pas.opcions || [])
            .map(
              op => `
            <label class="opcio-radio ${opSel === op.id ? "seleccionada" : ""}">
              <input type="radio" name="explica-opcio" value="${op.id}" ${opSel === op.id ? "checked" : ""}>
              <span>${op.text}</span>
            </label>`
            )
            .join("")}
        </fieldset>
        <button type="button" class="bt bt-primari bt-complet" data-confirma-explica="${idxPas}">
          Comprova l'explicació i continua →
        </button>
      </div>
    `;
  }

  if (tipus === "aplica" || tipus === "calcula") {
    const respAp = respostes.aplica || {};
    const valActual = respAp.valor ?? "";
    const uniActual = respAp.unitat ?? (pas.respostaNumerica?.unitat || "g/cm³");
    const llistaUnitats = ["g", "kg", "cm³", "mL", "L", "g/cm³", "g/mL", "kg/m³", "N", "Pa", "cm", "%"];

    return `
      <div class="guia-aplica-box">
        <div class="fila-input-aplica">
          <input type="text" id="input-aplica-valor" value="${valActual}" placeholder="Valor numèric..." inputmode="decimal" aria-label="Valor numèric de la resposta">
          <select id="sel-aplica-unitat" aria-label="Unitat de la resposta">
            <option value="">Unitat...</option>
            ${llistaUnitats.map(u => `<option value="${u}" ${u === uniActual ? "selected" : ""}>${u}</option>`).join("")}
          </select>
        </div>
        <button type="button" class="bt bt-primari bt-complet" data-confirma-aplica="${idxPas}">
          ${icona("verifica")} Comprova i completa la investigació
        </button>
      </div>
    `;
  }

  return "";
}

function renderitzaContingutNotesOReptes(estat) {
  return `
    <div class="panell-notes-reptes">
      <div class="quadern-caixa">
        <h4>Notes ràpides de la sessió</h4>
        <textarea id="panell-notes-area" class="quadern-textarea" rows="3" placeholder="Anota idees, hipòtesis o observacions...">${estat.quadern.notes || ""}</textarea>
      </div>
      <div class="reptes-llista-panell">
        <h4>12 Targetes de repte (Laboratori lliure)</h4>
        ${REPTES.map(
          r => `
          <div class="targeta-repte-mini">
            <div class="fila-entre">
              <strong>Repte ${r.num} · ${r.titol}</strong>
              <span class="badge-nivell">N${r.nivell}</span>
            </div>
            <p>${r.descripcio}</p>
            <button type="button" class="bt bt-secundari bt-petit" data-obre-lliure="${r.taula}">
              Prova-ho a la taula «${r.taula.charAt(0).toUpperCase() + r.taula.slice(1)}» →
            </button>
          </div>`
        ).join("")}
      </div>
    </div>
  `;
}
