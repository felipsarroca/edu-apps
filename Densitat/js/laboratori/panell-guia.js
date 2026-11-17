/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Panell lateral del laboratori: Guia d'indagació (Observa, Prediu, Experimenta, Explica, Aplica),
 * mesures anotades en viu i notes (07-guia-quadern-i-avaluacio.md §1–§4, 08-disseny-visual-i-interaccio.md §3.1).
 * En el laboratori lliure, la guia es converteix en una llista d'idees per provar (targetes de repte).
 */

import {
  INVESTIGACIONS,
  INVESTIGACIONS_LLISTA,
  BLOCS,
  REPTES,
  seguentInvestigacio
} from "../dades/investigacions/index.js";
import {
  descriuCondicioPas,
  nomPasIndagacio,
  generaMissatgeContrastPrediccio
} from "../guia/motor.js";
import { renderitzaTaulaMesuresHTML } from "../quadern/quadern.js";
import { icona } from "../eines/icones.js";

/** Frase curta que explica què es demana en cada tipus de pas. */
const AJUDA_PAS = {
  observa: "Mira bé què tens al laboratori abans de tocar res.",
  prediu: "Què creus que passarà? No passa res si no l'encertes.",
  experimenta: "Ara fes-ho al laboratori.",
  mesura: "Ara mesura-ho al laboratori.",
  calcula: "Fes el càlcul amb les teves mesures.",
  explica: "Tria l'explicació que encaixa amb el que has vist.",
  aplica: "Fes servir el que has après en un cas nou."
};

const NOM_TAULA = {
  mesura: "Pesar i mesurar",
  columna: "Columna de líquids",
  tanc: "Tanc d'aigua",
  taller: "Taller"
};

export function renderitzaPanellLateral(estat) {
  if (estat.panellPlegat) {
    return `
      <aside class="laboratori-panell-plegat">
        <button type="button" class="bt-desplega-panell" data-plega-panell="false" title="Mostra la guia" aria-label="Mostra la guia">
          ${icona("desplega")}
        </button>
      </aside>
    `;
  }

  const lliure = estat.modeLaboratori === "lliure";
  const pestanya = estat.pestanyaPanell || "guia";
  const mesuresInv = (estat.quadern?.mesures || []).filter(
    m => lliure || m.investigacioId === estat.investigacio.id
  );

  return `
    <aside class="laboratori-panell" aria-label="Guia, mesures i notes">
      <div class="panell-pestanyes" role="tablist">
        <button type="button" role="tab" aria-selected="${pestanya === "guia"}" class="bt-pestanya-panell ${pestanya === "guia" ? "activa" : ""}" data-panell-tab="guia">
          ${lliure ? "Idees" : "Guia"}
        </button>
        <button type="button" role="tab" aria-selected="${pestanya === "dades"}" class="bt-pestanya-panell ${pestanya === "dades" ? "activa" : ""}" data-panell-tab="dades">
          Mesures${mesuresInv.length > 0 ? ` (${mesuresInv.length})` : ""}
        </button>
        <button type="button" role="tab" aria-selected="${pestanya === "notes"}" class="bt-pestanya-panell ${pestanya === "notes" ? "activa" : ""}" data-panell-tab="notes">
          Notes
        </button>
        <button type="button" class="bt-icona bt-plega" data-plega-panell="true" title="Amaga el panell per veure l'escena més gran" aria-label="Amaga el panell">
          ${icona("plega")}
        </button>
      </div>

      <div class="panell-cos">
        ${pestanya === "guia" ? (lliure ? renderitzaIdeesLliure(estat) : renderitzaContingutGuia(estat)) : ""}
        ${
          pestanya === "dades"
            ? `<div class="panell-dades-viu">
                <div class="fila-entre">
                  <h4>Mesures anotades</h4>
                  <button type="button" class="bt-link bt-petit" data-canvia-pantalla="quadern">Obre el quadern</button>
                </div>
                ${
                  mesuresInv.length === 0
                    ? `<p class="panell-buit">Encara no has anotat cap mesura. Posa un objecte en un instrument i prem <strong>«Anota»</strong>.</p>`
                    : renderitzaTaulaMesuresHTML(mesuresInv, true)
                }
              </div>`
            : ""
        }
        ${pestanya === "notes" ? renderitzaContingutNotes(estat) : ""}
      </div>
    </aside>
  `;
}

function renderitzaContingutGuia(estat) {
  const invId = estat.investigacio?.id || "C4";
  const inv = INVESTIGACIONS[invId] || INVESTIGACIONS.C4;
  const cfg = estat.configuracio;
  const facil = cfg.lecturaFacil;
  const passos = inv.passos || [];
  const idxPas = Math.max(0, Math.min(passos.length - 1, estat.investigacio?.pas ?? 0));
  const pas = passos[idxPas];
  const respostes = estat.investigacio?.respostes || {};
  const pistesMostrades = estat.investigacio?.pistesPerPas?.[idxPas] || 0;
  const feta = estat.progres.fetes.includes(inv.id);
  const bloc = BLOCS.find(b => b.id === inv.bloc);

  // Què falta fer al laboratori per completar el pas (només passos experimentals)
  const condicio =
    pas.tipus === "experimenta" || pas.tipus === "mesura" ? descriuCondicioPas(estat, pas, inv.id) : null;
  const contrastPrediccio =
    pas.tipus === "explica" ? generaMissatgeContrastPrediccio(inv.id, respostes) : null;
  const seguent = feta ? seguentInvestigacio(estat.progres.fetes, inv.id) : null;

  return `
    <div class="guia-container">
      ${
        cfg.vistaCompleta
          ? `<div class="guia-selector-inv">
              <select id="sel-investigacio-activa" aria-label="Canvia d'investigació">
                ${INVESTIGACIONS_LLISTA.map(
                  i =>
                    `<option value="${i.id}" ${i.id === inv.id ? "selected" : ""}>${i.id} · ${i.titol} ${
                      estat.progres.fetes.includes(i.id) ? "✓" : ""
                    }</option>`
                ).join("")}
              </select>
            </div>`
          : ""
      }

      <div class="guia-pregunta-box">
        <span class="etiqueta-petita">${bloc ? bloc.titol : "Investigació"} · ${inv.titol}</span>
        <h3>${facil ? inv.preguntaFacil : inv.pregunta}</h3>
      </div>

      <!-- Camí de passos del cicle d'indagació -->
      <ol class="guia-cami" aria-label="Passos de la investigació">
        ${passos
          .map((p, i) => {
            const estatPas = i === idxPas ? "actiu" : i < idxPas || feta ? "completat" : "";
            return `
          <li class="guia-cami-pas ${estatPas}">
            <button type="button" data-ves-pas="${i}" ${i === idxPas ? 'aria-current="step"' : ""} title="Pas ${i + 1}: ${nomPasIndagacio(p.tipus)}">
              <span class="guia-cami-num" aria-hidden="true">${estatPas === "completat" ? icona("verifica") : i + 1}</span>
              <span class="guia-cami-nom">${nomPasIndagacio(p.tipus)}</span>
            </button>
          </li>`;
          })
          .join("")}
      </ol>

      <!-- Contingut del pas actiu -->
      <div class="guia-pas-card">
        <div class="guia-pas-cap">
          <span class="insignia-pas">Pas ${idxPas + 1} de ${passos.length} · ${nomPasIndagacio(pas.tipus)}</span>
          <span class="guia-pas-ajuda">${AJUDA_PAS[pas.tipus] || ""}</span>
        </div>

        <p class="guia-enunciat">${facil ? pas.facil : pas.text}</p>

        ${contrastPrediccio ? `<div class="guia-contrast-box">${contrastPrediccio}</div>` : ""}

        ${
          condicio
            ? `<div class="guia-condicio ${condicio.fet ? "feta" : ""}" role="status">
                ${icona(condicio.fet ? "verifica" : "laboratori")}
                <span>${condicio.text}</span>
              </div>`
            : ""
        }

        ${renderitzaControlsPas(estat, inv, pas, idxPas, respostes, condicio)}

        ${
          estat.investigacio.feedbackPas
            ? `<div class="guia-feedback ${estat.investigacio.feedbackPas.ok ? "fb-ok" : "fb-orienta"}" role="status">
                ${estat.investigacio.feedbackPas.text}
              </div>`
            : ""
        }

        <!-- Pistes en tres graons -->
        ${
          cfg.pistesActives && Array.isArray(pas.pistes) && pas.pistes.length > 0
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
                ? `<button type="button" class="bt-pista" data-demana-pista="${idxPas}">
                    ${icona("pista")} ${pistesMostrades === 0 ? "No saps com fer-ho? Demana una pista" : `Una altra pista (${pistesMostrades + 1} de ${pas.pistes.length})`}
                  </button>`
                : ""
            }
          </div>`
            : ""
        }
      </div>

      <!-- Targeta de conclusió i pas següent quan la investigació s'ha completat -->
      ${
        feta
          ? `
        <div class="guia-conclusio-final">
          <h4>${icona("verifica")} Investigació completada</h4>
          <p><strong>Què has descobert:</strong> ${facil ? inv.conclusioFacil : inv.conclusio}</p>
          <div class="guia-conclusio-accions">
            ${
              seguent
                ? `<button type="button" class="bt bt-primari bt-complet" data-obre-inv="${seguent.id}">
                    Següent: «${seguent.titol}» ${icona("plega")}
                  </button>`
                : ""
            }
            <button type="button" class="bt bt-secundari bt-complet" data-canvia-pantalla="inici">Tria'n una altra</button>
          </div>
        </div>`
          : `<button type="button" class="bt-link bt-canvia-inv" data-canvia-pantalla="inici">${icona("enrere")} Tria una altra investigació</button>`
      }
    </div>
  `;
}

function renderitzaControlsPas(estat, inv, pas, idxPas, respostes, condicio) {
  const tipus = pas.tipus;
  const passos = inv.passos || [];
  const seguentPas = passos[idxPas + 1];
  const nomSeguent = seguentPas ? nomPasIndagacio(seguentPas.tipus).toLowerCase() : "";

  if (tipus === "observa") {
    return `
      <div class="guia-accions-pas">
        <button type="button" class="bt bt-primari bt-complet" data-avanca-pas="${idxPas}">
          Ja ho he mirat: continua ${icona("plega")}
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
            <span>Per què ho creus?</span>
            <select id="sel-prediu-motiu">
              <option value="">Tria el teu motiu…</option>
              ${pas.motius.map(m => `<option value="${m.id}" ${motSel === m.id ? "selected" : ""}>${m.text}</option>`).join("")}
            </select>
          </label>`
            : ""
        }

        <button type="button" class="bt bt-primari bt-complet" data-confirma-prediu="${idxPas}">
          Desa la predicció i comprova-ho ${icona("plega")}
        </button>
      </div>
    `;
  }

  if (tipus === "experimenta" || tipus === "mesura") {
    const pendent = condicio && !condicio.fet;
    return `
      <div class="guia-accions-pas">
        <button type="button" class="bt ${pendent ? "bt-secundari" : "bt-primari"} bt-complet" data-avanca-pas="${idxPas}">
          ${pendent ? "Continua igualment" : `Continua${nomSeguent ? `: ${nomSeguent}` : ""}`} ${icona("plega")}
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
          ${icona("verifica")} Comprova la resposta
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
        <span class="etiqueta-petita">La teva resposta (nombre i unitat):</span>
        <div class="fila-input-aplica">
          <input type="text" id="input-aplica-valor" value="${valActual}" placeholder="Nombre…" inputmode="decimal" aria-label="Valor numèric de la resposta">
          <select id="sel-aplica-unitat" aria-label="Unitat de la resposta">
            <option value="">Unitat…</option>
            ${llistaUnitats.map(u => `<option value="${u}" ${u === uniActual ? "selected" : ""}>${u}</option>`).join("")}
          </select>
        </div>
        <button type="button" class="bt bt-primari bt-complet" data-confirma-aplica="${idxPas}">
          ${icona("verifica")} Comprova la resposta
        </button>
      </div>
    `;
  }

  return "";
}

/**
 * Laboratori lliure: explicació breu i targetes de repte com a idees per provar.
 */
function renderitzaIdeesLliure(estat) {
  const completa = estat.configuracio.vistaCompleta;
  return `
    <div class="guia-container">
      <div class="guia-pregunta-box">
        <span class="etiqueta-petita">Laboratori lliure</span>
        <h3>Aquí no hi ha passos: prova el que vulguis.</h3>
      </div>
      <p class="guia-enunciat">Canvia de zona de treball amb les pestanyes de dalt i anota el que mesuris. Si no saps per on començar, tria un repte:</p>

      <div class="reptes-llista-panell">
        ${REPTES.map(
          r => `
          <div class="targeta-repte-mini">
            <strong>${r.num}. ${r.titol}</strong>
            <p>${r.descripcio}</p>
            <button type="button" class="bt bt-secundari bt-petit" data-obre-lliure="${r.taula}">
              Ves a «${NOM_TAULA[r.taula] || r.taula}»${completa ? ` · N${r.nivell}` : ""}
            </button>
          </div>`
        ).join("")}
      </div>

      <button type="button" class="bt-link bt-canvia-inv" data-canvia-pantalla="inici">${icona("enrere")} Prefereixo una investigació guiada</button>
    </div>
  `;
}

function renderitzaContingutNotes(estat) {
  return `
    <div class="panell-notes-reptes">
      <div class="quadern-caixa">
        <h4>Les teves notes</h4>
        <p class="etiqueta-petita">Idees, dubtes o observacions. També les trobaràs al quadern.</p>
        <textarea id="panell-notes-area" class="quadern-textarea" rows="9" placeholder="Escriu aquí…">${estat.quadern.notes || ""}</textarea>
      </div>
    </div>
  `;
}
