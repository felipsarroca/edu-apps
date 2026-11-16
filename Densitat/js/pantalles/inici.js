/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Pantalla d'Inici: itinerari d'investigacions per blocs (A a G), accés directe a continuar i laboratori lliure (08-disseny-visual-i-interaccio.md §3.2).
 */

import { BLOCS, INVESTIGACIONS_LLISTA, INVESTIGACIONS, REPTES } from "../dades/investigacions/index.js";
import { icona } from "../eines/icones.js";

export function renderitzaPantallaInici(estat, blocObert = "C") {
  const fetes = estat.progres?.fetes || [];
  const invActual = INVESTIGACIONS[estat.investigacio?.id] || INVESTIGACIONS.C4;
  const blocActiu = BLOCS.find(b => b.id === blocObert) || BLOCS[2];
  const invsDelBloc = INVESTIGACIONS_LLISTA.filter(i => i.bloc === blocActiu.id);

  const targetesBlocsHtml = BLOCS.map(b => {
    const llista = INVESTIGACIONS_LLISTA.filter(i => i.bloc === b.id);
    const fetesBloc = llista.filter(i => fetes.includes(i.id)).length;
    const puntsHtml = llista
      .map(
        i =>
          `<span class="punt-inv ${fetes.includes(i.id) ? "fet" : ""} ${i.id === estat.investigacio?.id ? "actual" : ""}" title="${i.id} · ${i.titol}"></span>`
      )
      .join("");

    return `
      <button type="button" class="targeta-bloc ${b.id === blocActiu.id ? "seleccionat" : ""}" data-selecciona-bloc="${b.id}" aria-expanded="${b.id === blocActiu.id}">
        <div class="targeta-bloc-cap">
          <span class="lletra-bloc">Bloc ${b.id}</span>
          <span class="curs-bloc">${b.nivellPrincipal}</span>
        </div>
        <h3>${b.titol}</h3>
        <p>${b.subtitol}</p>
        <div class="targeta-bloc-peu">
          <div class="punts-progres" aria-hidden="true">${puntsHtml}</div>
          <span class="comptador-bloc">${fetesBloc}/${llista.length}</span>
        </div>
      </button>
    `;
  }).join("");

  const llistaInvsHtml = invsDelBloc
    .map(inv => {
      const feta = fetes.includes(inv.id);
      const preg = estat.configuracio.lecturaFacil ? inv.preguntaFacil : inv.pregunta;
      const esNucli1a = inv.fase === "1a";
      return `
        <article class="item-inv-card ${feta ? "inv-feta" : ""}">
          <div class="item-inv-info">
            <div class="item-inv-meta">
              <span class="codi-inv">${inv.id}</span>
              <strong>${inv.titol}</strong>
              ${esNucli1a ? `<span class="badge-essencial">Essencial</span>` : ""}
              <span class="badge-nivell">Nivell ${inv.nivells.join("–")}</span>
              <span class="badge-durada">${inv.durada} min</span>
              ${feta ? `<span class="segell-completat">✓ Completada</span>` : ""}
            </div>
            <p class="item-inv-preg">${preg}</p>
          </div>
          <button type="button" class="bt bt-primari bt-petit" data-obre-inv="${inv.id}">
            ${feta ? "Repeteix" : "Investiga →"}
          </button>
        </article>
      `;
    })
    .join("");

  return `
    <section class="pantalla-inici">
      <div class="inici-hero">
        <div class="inici-hero-text">
          <span class="avant-titol">Laboratori digital de Física i Química · 1r a 4t d'ESO</span>
          <h1>Laboratori virtual de densitat i flotació</h1>
          <p class="inici-subtitol">Mesura, prediu i comprova per què uns objectes suren (floten) i d'altres s'enfonsen, amb un únic motor físic rigorós i quadern científic integrat.</p>
          <div class="inici-accions-principals">
            <button type="button" class="bt bt-primari bt-gran" data-obre-inv="${invActual.id}">
              ${icona("laboratori")} Continua: ${invActual.id} · ${invActual.titol}
            </button>
            <button type="button" class="bt bt-secundari bt-gran" data-obre-lliure="mesura">
              ${icona("balanca")} Laboratori lliure
            </button>
            <button type="button" class="bt bt-neutre" data-canvia-pantalla="progres">
              ${icona("progres")} Diagnòstic adaptatiu i progrés (${fetes.length}/51)
            </button>
          </div>
        </div>
        <div class="inici-hero-resum">
          <div class="inici-acces-rapid">
            <h4>Itinerari essencial recomanat (Fase 1a)</h4>
            <div class="chips-inici-1a">
              ${["A7", "C3", "C4", "C6", "D1", "D2", "D3", "D4", "D5"]
                .map(id => {
                  const i = INVESTIGACIONS[id];
                  const f = fetes.includes(id);
                  return `<button type="button" class="chip-inv-1a ${f ? "fet" : ""}" data-obre-inv="${id}" title="${i.pregunta}">
                    <strong>${id}</strong> · ${i.titol} ${f ? "✓" : ""}
                  </button>`;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="inici-cos">
        <div class="graella-blocs" role="tablist" aria-label="Blocs d'investigació">
          ${targetesBlocsHtml}
        </div>

        <div class="desplegable-bloc" role="region" aria-label="Investigacions del bloc ${blocActiu.id}">
          <div class="desplegable-bloc-cap">
            <div>
              <h2>Bloc ${blocActiu.id} · ${blocActiu.titol}</h2>
              <p>${blocActiu.subtitol}</p>
            </div>
            <div class="reptes-lliures-acc">
              <button type="button" class="bt bt-secundari bt-petit" data-obre-lliure="taller">
                ${icona("taller")} Taller i Drassana
              </button>
              <button type="button" class="bt bt-secundari bt-petit" data-obre-lliure="tanc">
                ${icona("tanc")} Tanc d'Arquimedes
              </button>
            </div>
          </div>
          <div class="llista-invs-grid">
            ${llistaInvsHtml}
          </div>
        </div>
      </div>
    </section>
  `;
}
