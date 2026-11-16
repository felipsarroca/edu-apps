/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Pantalla de Progrés en quatre dimensions, radar de concepcions, segells d'investigacions
 * i diagnòstic adaptatiu bayesià amb barres de probabilitat posterior en viu (07-guia-quadern-i-avaluacio.md §5–§6).
 */

import { calculaResumProgres } from "../guia/progres.js";
import {
  seleccionaSeguentItemBayesia,
  generaInformeBayesia,
  NOMS_NIVELLS
} from "../guia/diagnosi.js";
import { INVESTIGACIONS_LLISTA, BLOCS } from "../dades/investigacions/index.js";
import { IDEES_PREVIES } from "../dades/idees.js";
import { formataNombre } from "../fisica/unitats.js";
import { icona } from "../eines/icones.js";

export function renderitzaPantallaProgres(estat) {
  const resum = calculaResumProgres(estat);
  const estatBayesia = estat.progres.diagnosi.bayesia;
  const informeBayes = generaInformeBayesia(estatBayesia);
  const itemActiuBayes = estatBayesia.tancat ? null : seleccionaSeguentItemBayesia(estatBayesia);
  const post = informeBayes.distribucioPosterior || [1 / 3, 1 / 3, 1 / 3];

  // Idees prèvies principals per al radar conceptual
  const ideesPrincipals = ["IP-01", "IP-02", "IP-03", "IP-04", "IP-05", "IP-06", "IP-07", "IP-09", "IP-12"].map(codi => {
    const info = IDEES_PREVIES[codi];
    const det = estat.progres.diagnosi.idees?.[codi] || { estat: "no_observada" };
    const fac = estatBayesia.factors?.[codi] || { probPresent: info?.prior ?? 0.25, intents: 0 };
    return {
      codi,
      enunciat: info?.enunciat || codi,
      contrast: info?.contrast || "",
      invRecomanada: info?.investigacions?.[0] || "C4",
      estatDet: det.estat,
      probError: Math.round((fac.probPresent ?? 0.25) * 100),
      intents: fac.intents
    };
  });

  return `
    <section class="pantalla-progres">
      <div class="progres-grid-principal">
        <div class="targeta-progres">
          <div class="fila-entre">
            <div>
              <h2>${icona("progres")} El meu progrés científic</h2>
              <p>Evidències recollides en les quatre dimensions del treball científic (sense nota numèrica).</p>
            </div>
            <div class="badge-comptador-gran">${resum.fetesCount} de ${resum.totalCount} investigacions</div>
          </div>

          <div class="dimensions-llista">
            ${resum.dimensions
              .map(
                d => `
              <div class="dimensio-item">
                <div class="fila-entre">
                  <strong>${d.nom}</strong>
                  <span class="num-tabular">${d.percentatge} %</span>
                </div>
                <div class="barra-progres" role="progressbar" aria-valuenow="${d.percentatge}" aria-valuemin="0" aria-valuemax="100">
                  <div class="barra-progres-omplert" style="width:${d.percentatge}%"></div>
                </div>
                <p class="etiqueta-petita">${d.descripcio}</p>
              </div>`
              )
              .join("")}
          </div>

          <div class="recomanacio-caixa">
            <div>
              <span class="etiqueta-petita">Pas següent recomanat:</span>
              <h4>${resum.recomanada.id} · ${resum.recomanada.titol}</h4>
              <p>${resum.recomanada.pregunta}</p>
            </div>
            <button type="button" class="bt bt-primari" data-obre-inv="${resum.recomanada.id}">
              Investiga ara →
            </button>
          </div>
        </div>

        <!-- Diagnòstic adaptatiu bayesià (Fase 4 · Especificació Juan José de Haro v2.6) -->
        <div class="targeta-progres targeta-bayesia">
          <div class="fila-entre">
            <div>
              <span class="insignia-bloc">Diagnòstic adaptatiu bayesià (IRT 3PL + perfil d'idees)</span>
              <h3>Comprovem les nostres idees sobre densitat i flotació</h3>
            </div>
            <button type="button" class="bt bt-secundari bt-petit" data-reinicia-bayesia="true">
              ${icona("reinicia")} Reinicia el test
            </button>
          </div>

          <!-- Distribució de probabilitat posterior P(H_i | respostes) en temps real -->
          <div class="bayes-posterior-panel">
            <div class="fila-entre">
              <span class="etiqueta-petita"><strong>Distribució posterior de domini en viu</strong> (llindar de decisió: 80 %)</span>
              <span class="etiqueta-petita">Preguntes respostes: ${estatBayesia.respostes.length} / 10</span>
            </div>
            <div class="bayes-barres-grid">
              ${NOMS_NIVELLS.map((nom, i) => {
                const pct = Math.round((post[i] || 0) * 100);
                return `
                  <div class="bayes-barra-col">
                    <div class="fila-entre">
                      <small>${nom}</small>
                      <strong class="num-tabular">${pct} %</strong>
                    </div>
                    <div class="barra-progres barra-bayes">
                      <div class="barra-progres-omplert ${pct >= 80 ? "assolida" : ""}" style="width:${pct}%"></div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          ${
            !estatBayesia.tancat && itemActiuBayes
              ? `
            <div class="bayes-pregunta-activa">
              <div class="fila-entre">
                <span class="etiqueta-petita">Pregunta adaptativa ${estatBayesia.respostes.length + 1} (seleccionada per màxim guany d'informació de Shannon)</span>
                <span class="etiqueta-petita">Confiança màxima: <strong>${Math.round(informeBayes.probabilitatNivell * 100)} %</strong></span>
              </div>
              <p class="bayes-enunciat"><strong>${itemActiuBayes.enunciat}</strong></p>
              <div class="bayes-opcions">
                ${itemActiuBayes.opcions
                  .map(
                    op => `
                  <button type="button" class="bt-opcio-bayes" data-respon-bayes="${itemActiuBayes.id}" data-opcio-bayes="${op.id}">
                    ${op.text}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>`
              : `
            <div class="bayes-informe-final">
              <div class="recomanacio-destacada-alumne">
                <h4>Recomanació personalitzada de treball</h4>
                <p>${informeBayes.recomanacioTasca}</p>
                <button type="button" class="bt bt-primari bt-petit" data-obre-inv="${informeBayes.pasSeguent}">
                  Vés a la investigació ${informeBayes.pasSeguent} →
                </button>
              </div>
              ${
                informeBayes.alertaAtzar
                  ? `<p class="calc-avis">Sembla que algunes respostes han estat molt ràpides o contradictòries (índex d'ajust l_z = ${formataNombre(informeBayes.personFitLz)}). Pots repetir el diagnòstic amb calma quan vulguis.</p>`
                  : ""
              }
              <div class="bayes-solucions-posposades">
                <h5>Solucions comentades de les preguntes respostes (${estatBayesia.respostes.length})</h5>
                <ul class="llista-solucions-bayes">
                  ${estatBayesia.respostes
                    .map(r => {
                      return `<li class="${r.correcta ? "sol-ok" : "sol-rev"}">
                        <strong>${r.id}:</strong> ${r.correcta ? "Resposta encertada ✓" : `Hipòtesi a comprovar al laboratori (${r.idea || "revisar"})`}
                      </li>`;
                    })
                    .join("")}
                </ul>
              </div>
            </div>`
          }

          <p class="nota-metodologia">
            <a href="https://jjdeharo.github.io/recursos-adaptativos/" target="_blank" rel="noopener noreferrer">Metodologia: recursos adaptatius bayesians</a> (Juan José de Haro, v2.6).
          </p>
        </div>
      </div>

      <!-- Radar de concepcions i idees prèvies amb enllaç directe a l'experiment de contrast -->
      <div class="targeta-progres">
        <div class="fila-entre">
          <div>
            <h3>Radar de concepcions i hipòtesis a comprovar al laboratori</h3>
            <p class="etiqueta-petita">Cada idea prèvia es posa a prova amb un experiment concret del laboratori.</p>
          </div>
        </div>
        <div class="radar-idees-grid">
          ${ideesPrincipals
            .map(
              idObj => `
            <div class="targeta-idea-radar estat-${idObj.estatDet}">
              <div class="fila-entre">
                <span class="codi-inv">${idObj.codi}</span>
                <span class="badge-estat-idea">${
                  idObj.estatDet === "superada"
                    ? "✓ Superada"
                    : idObj.estatDet === "activa"
                    ? "⚠ Per comprovar"
                    : idObj.estatDet === "en_revisio"
                    ? "En revisió"
                    : `Risc estimat: ${idObj.probError} %`
                }</span>
              </div>
              <p class="idea-mite">«${idObj.enunciat}»</p>
              <p class="idea-contrast">${idObj.contrast}</p>
              <button type="button" class="bt bt-secundari bt-petit" data-obre-inv="${idObj.invRecomanada}">
                Comprova-ho a ${idObj.invRecomanada} →
              </button>
            </div>`
            )
            .join("")}
        </div>
      </div>

      <!-- Segells de totes les investigacions i botó Comença de nou -->
      <div class="targeta-progres">
        <div class="fila-entre">
          <h3>Mapa de segells de les 51 investigacions</h3>
          <button type="button" class="bt bt-perill bt-petit" data-comenca-de-nou="true">
            ${icona("reinicia")} Comença de nou (esborra la sessió d'aquest navegador)
          </button>
        </div>
        <div class="segells-blocs-grid">
          ${BLOCS.map(b => {
            const invs = INVESTIGACIONS_LLISTA.filter(i => i.bloc === b.id);
            return `
              <div class="grup-segells-bloc">
                <h4>Bloc ${b.id} · ${b.titol}</h4>
                <div class="chips-segells">
                  ${invs
                    .map(i => {
                      const f = estat.progres.fetes.includes(i.id);
                      return `<button type="button" class="chip-segell ${f ? "fet" : ""}" data-obre-inv="${i.id}" title="${i.titol}: ${i.pregunta}">
                        <strong>${i.id}</strong> ${f ? "✓" : ""}
                      </button>`;
                    })
                    .join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}
