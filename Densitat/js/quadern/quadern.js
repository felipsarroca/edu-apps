/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Quadern científic integrat, taules de dades i generació de l'informe imprimible en PDF (07-guia-quadern-i-avaluacio.md §7).
 */

import { INVESTIGACIONS, INVESTIGACIONS_LLISTA } from "../dades/investigacions/index.js";
import { MATERIALS } from "../dades/materials.js";
import { formataNombre } from "../fisica/unitats.js";
import { magnitudsObjecte } from "../fisica/objecte.js";
import { icona } from "../eines/icones.js";

/**
 * Renderitza la pantalla completa del Quadern científic i la plantilla d'impressió A4 per a l'informe PDF.
 */
export function renderitzaPantallaQuadern(estat, filtreActiu = null) {
  const invActualId = filtreActiu || estat.investigacio?.id || "C4";
  const inv = INVESTIGACIONS[invActualId] || INVESTIGACIONS.C4;
  const mesures = estat.quadern?.mesures || [];
  const mesuresFiltrades =
    invActualId === "totes"
      ? mesures
      : mesures.filter(m => m.investigacioId === invActualId || (!m.investigacioId && invActualId === "lliure"));

  const entrada = estat.quadern?.entrades?.[invActualId] || {};
  const respostes = invActualId === estat.investigacio?.id ? estat.investigacio.respostes : entrada.respostes || {};

  // Llista d'investigacions que tenen dades o que s'han visitat
  const idsAmbDades = new Set([
    ...estat.progres.fetes,
    ...mesures.map(m => m.investigacioId).filter(Boolean),
    estat.investigacio?.id || "C4",
    "A7",
    "C3",
    "C4",
    "C6",
    "D1",
    "D2",
    "D3",
    "D4",
    "D5"
  ]);

  const llistaLateral = INVESTIGACIONS_LLISTA.filter(i => idsAmbDades.has(i.id));

  const pasPrediu = inv?.passos?.find(p => p.tipus === "prediu");
  const opcioPred = pasPrediu?.opcions?.find(o => o.id === respostes?.prediu?.opcioId);
  const motiuPred = pasPrediu?.motius?.find(m => m.id === respostes?.prediu?.motiuId);
  const feta = estat.progres.fetes.includes(invActualId);

  return `
    <section class="pantalla-quadern">
      <div class="quadern-layout">
        <aside class="quadern-sidebar" aria-label="Índex del quadern">
          <div class="quadern-sidebar-grup">
            <h4>Investigacions</h4>
            <ul class="quadern-llista-nav">
              <li>
                <button type="button" class="quadern-item-nav ${invActualId === "totes" ? "actiu" : ""}" data-quadern-filtre="totes">
                  <span>Totes les mesures (${mesures.length})</span>
                </button>
              </li>
              ${llistaLateral
                .map(
                  i => `
                <li>
                  <button type="button" class="quadern-item-nav ${i.id === invActualId ? "actiu" : ""}" data-quadern-filtre="${i.id}">
                    <span><strong>${i.id}</strong> · ${i.titol}</span>
                    ${estat.progres.fetes.includes(i.id) ? `<span class="segell-fet" title="Investigació completada">✓</span>` : ""}
                  </button>
                </li>`
                )
                .join("")}
            </ul>
          </div>
          <div class="quadern-sidebar-grup">
            <h4>Exportació i còpia</h4>
            <div class="quadern-accions-export">
              <button type="button" class="bt bt-primari bt-complet" data-exporta-pdf="true">
                ${icona("exporta")} Informe en PDF (A4)
              </button>
              <button type="button" class="bt bt-secundari bt-complet" data-exporta-csv="true">
                ${icona("exporta")} Descarrega taula CSV
              </button>
              <button type="button" class="bt bt-secundari bt-complet" data-exporta-json="true">
                ${icona("exporta")} Desa sessió (JSON)
              </button>
              <label class="bt bt-secundari bt-complet bt-importa-label">
                ${icona("quadern")} Carrega sessió (JSON)
                <input type="file" id="input-importa-json" accept=".json" class="sr-only">
              </label>
            </div>
          </div>
        </aside>

        <div class="quadern-contingut">
          <header class="quadern-cap">
            <div>
              <span class="insignia-bloc">Bloc ${inv.bloc} · Quadern científic</span>
              <h2>${invActualId === "totes" ? "Recull complet de mesures del laboratori" : `${inv.id} · ${inv.titol}`}</h2>
              <p class="quadern-pregunta">${invActualId === "totes" ? "Totes les lectures i càlculs registrats durant la sessió." : inv.pregunta}</p>
            </div>
            <div class="quadern-bts-cap">
              ${
                invActualId !== "totes"
                  ? `<button type="button" class="bt bt-primari" data-obre-inv="${inv.id}">
                      ${icona("laboratori")} Obre al laboratori
                    </button>`
                  : ""
              }
            </div>
          </header>

          ${
            invActualId !== "totes"
              ? `
            <div class="quadern-resum-cicle">
              <div class="quadern-caixa">
                <h4>1. Predicció i hipòtesi inicial</h4>
                ${
                  opcioPred
                    ? `<p><strong>Predicció:</strong> ${opcioPred.text}</p>
                       ${motiuPred ? `<p><strong>Motiu:</strong> ${motiuPred.text}</p>` : ""}`
                    : `<p class="text-suau">Encara no s'ha registrat la predicció d'aquesta investigació.</p>`
                }
              </div>
              <div class="quadern-caixa">
                <h4>2. Conclusió i transferència</h4>
                ${
                  feta || respostes?.explica
                    ? `<p class="text-justificat"><strong>Conclusió:</strong> ${estat.configuracio.lecturaFacil ? inv.conclusioFacil : inv.conclusio}</p>`
                    : `<p class="text-suau">Completa els passos d'explicació i aplicació al laboratori per consolidar la conclusió.</p>`
                }
              </div>
            </div>`
              : ""
          }

          <div class="quadern-caixa">
            <div class="fila-entre">
              <h4>Taula de dades experimentals i càlculs (${mesuresFiltrades.length})</h4>
              ${
                invActualId !== "totes" && mesures.length > mesuresFiltrades.length
                  ? `<button type="button" class="bt-link" data-quadern-filtre="totes">Mostra totes les mesures (${mesures.length})</button>`
                  : ""
              }
            </div>
            ${renderitzaTaulaMesuresHTML(mesuresFiltrades, true)}
          </div>

          <div class="quadern-caixa">
            <h4>Notes i observacions de l'alumne</h4>
            <textarea id="quadern-notes-area" class="quadern-textarea" rows="3" placeholder="Escriu aquí les teves observacions, càlculs o conclusions per a l'informe...">${estat.quadern.notes || ""}</textarea>
          </div>

          <div class="quadern-caixa">
            <h4>Dades per a la capçalera de l'informe imprimible (PDF)</h4>
            <p class="etiqueta-petita">Aquestes dades només apareixen al full d'impressió quan generes el PDF i no s'envien enlloc.</p>
            <div class="quadern-camps-alumne">
              <label>
                <span>Nom i cognoms</span>
                <input type="text" id="informe-nom-alumne" value="${estat.quadern.nomAlumne || ""}" placeholder="Escriu el teu nom...">
              </label>
              <label>
                <span>Curs i grup</span>
                <input type="text" id="informe-grup-alumne" value="${estat.quadern.grupAlumne || ""}" placeholder="Ex. 2n ESO A">
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista oculta en pantalla, visible només en imprimir l'informe en A4 (css/informe.css) -->
      ${renderitzaInformeImprimibleA4(estat, inv, mesuresFiltrades, opcioPred, motiuPred)}
    </section>
  `;
}

/**
 * Renderitza una taula HTML de mesures anotades.
 */
export function renderitzaTaulaMesuresHTML(mesures = [], permetEsborrar = true) {
  if (!mesures || mesures.length === 0) {
    return `<p class="quadern-buit">Encara no has anotat cap mesura. Fes servir el botó «Anota» d'un instrument o de la calculadora al laboratori.</p>`;
  }

  return `
    <div class="taula-scroll">
      <table class="taula-dades">
        <thead>
          <tr>
            <th>Inv.</th>
            <th>Objecte / Mostra</th>
            <th>Magnitud</th>
            <th>Valor</th>
            <th>Unitat</th>
            <th>Instrument (resolució)</th>
            ${permetEsborrar ? `<th aria-label="Accions"></th>` : ""}
          </tr>
        </thead>
        <tbody>
          ${mesures
            .map(
              m => `
            <tr>
              <td><span class="badge-inv">${m.investigacioId || "Lliure"}</span></td>
              <td><strong>${m.objecteNom || m.objecteId}</strong></td>
              <td>${m.magnitud}</td>
              <td class="num-tabular">${typeof m.valor === "number" ? formataNombre(m.valor) : m.valor}</td>
              <td>${m.unitat}</td>
              <td class="text-suau">${m.instrument}${m.resolucio ? ` (${formataNombre(m.resolucio)} ${m.unitat})` : ""}</td>
              ${
                permetEsborrar
                  ? `<td><button type="button" class="bt-esborra-fila" data-esborra-mesura="${m.id}" title="Esborra aquesta mesura" aria-label="Esborra mesura">✕</button></td>`
                  : ""
              }
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderitzaInformeImprimibleA4(estat, inv, mesures, opcioPred, motiuPred) {
  const dataAvui = new Date().toLocaleDateString("ca-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  return `
    <article class="informe-a4-print" aria-hidden="true">
      <header class="informe-cap">
        <div>
          <h1>Densitat · Informe de laboratori científic</h1>
          <p>Escola Ramon Pont · Física i Química (ESO)</p>
        </div>
        <div class="informe-meta">
          <p><strong>Alumne/a:</strong> ${estat.quadern.nomAlumne || "___________________________"}</p>
          <p><strong>Grup:</strong> ${estat.quadern.grupAlumne || "___________"} &nbsp;·&nbsp; <strong>Data:</strong> ${dataAvui}</p>
        </div>
      </header>
      <section class="informe-seccio">
        <h2>Investigació: ${inv.id} · ${inv.titol}</h2>
        <p class="text-justificat"><strong>Pregunta d'investigació:</strong> ${inv.pregunta}</p>
        <p class="text-justificat"><strong>Predicció inicial:</strong> ${opcioPred ? opcioPred.text : "No registrada."}${motiuPred ? ` (${motiuPred.text})` : ""}</p>
      </section>
      <section class="informe-seccio">
        <h2>Taula de dades experimentals i càlculs</h2>
        ${renderitzaTaulaMesuresHTML(mesures, false)}
      </section>
      <section class="informe-seccio">
        <h2>Conclusions i observacions</h2>
        <p class="text-justificat"><strong>Conclusió científica:</strong> ${inv.conclusio}</p>
        ${
          estat.quadern.notes
            ? `<p class="text-justificat"><strong>Observacions de l'alumne/a:</strong> ${estat.quadern.notes}</p>`
            : ""
        }
      </section>
    </article>
  `;
}
