/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Pantalla d'Inici: una acció principal clara (començar o continuar), la ruta recomanada en ordre
 * i totes les investigacions agrupades per temes (08-disseny-visual-i-interaccio.md §3.2).
 */

import {
  BLOCS,
  INVESTIGACIONS_LLISTA,
  INVESTIGACIONS,
  RUTA_RECOMANADA,
  seguentInvestigacio,
  dificultatInvestigacio
} from "../dades/investigacions/index.js";
import { icona } from "../eines/icones.js";

/**
 * Decideix quina investigació s'ha de proposar al botó principal.
 */
function proposaInvestigacio(estat) {
  const fetes = estat.progres?.fetes || [];
  const haComencat =
    fetes.length > 0 ||
    Object.keys(estat.quadern?.entrades || {}).length > 0 ||
    (estat.quadern?.mesures || []).length > 0;
  const actual = INVESTIGACIONS[estat.investigacio?.id];

  if (!haComencat) {
    return { inv: INVESTIGACIONS[RUTA_RECOMANADA[0]], verb: "Comença", haComencat };
  }
  if (actual && !fetes.includes(actual.id)) {
    return { inv: actual, verb: "Continua", haComencat };
  }
  const seguent = seguentInvestigacio(fetes, actual?.id);
  return { inv: seguent || actual || INVESTIGACIONS[RUTA_RECOMANADA[0]], verb: seguent ? "Següent" : "Repeteix", haComencat };
}

export function renderitzaPantallaInici(estat, blocObert = null) {
  const fetes = estat.progres?.fetes || [];
  const facil = estat.configuracio.lecturaFacil;
  const proposta = proposaInvestigacio(estat);
  const blocActiu = BLOCS.find(b => b.id === (blocObert || proposta.inv.bloc)) || BLOCS[0];
  const invsDelBloc = INVESTIGACIONS_LLISTA.filter(i => i.bloc === blocActiu.id);
  const fetesRuta = RUTA_RECOMANADA.filter(id => fetes.includes(id)).length;
  const seguentRuta = RUTA_RECOMANADA.find(id => !fetes.includes(id));

  const rutaHtml = RUTA_RECOMANADA.map((id, idx) => {
    const inv = INVESTIGACIONS[id];
    const feta = fetes.includes(id);
    const esSeguent = id === seguentRuta;
    return `
      <li>
        <button type="button" class="ini-pas-ruta ${feta ? "fet" : ""} ${esSeguent ? "seguent" : ""}" data-obre-inv="${id}" title="${facil ? inv.preguntaFacil : inv.pregunta}">
          <span class="ini-pas-num" aria-hidden="true">${feta ? icona("verifica") : idx + 1}</span>
          <span class="ini-pas-titol">${inv.titol}</span>
          <span class="sr-only">${feta ? "(feta)" : esSeguent ? "(la següent)" : ""}</span>
        </button>
      </li>
    `;
  }).join("");

  const temesHtml = BLOCS.map(b => {
    const llista = INVESTIGACIONS_LLISTA.filter(i => i.bloc === b.id);
    const fetesBloc = llista.filter(i => fetes.includes(i.id)).length;
    const pct = Math.round((fetesBloc / llista.length) * 100);
    return `
      <button type="button" class="ini-tema ${b.id === blocActiu.id ? "seleccionat" : ""}" data-selecciona-bloc="${b.id}" aria-pressed="${b.id === blocActiu.id}" title="${b.subtitol}">
        <strong>${b.titol}</strong>
        <span class="ini-tema-meta">${b.nivellPrincipal} d'ESO · ${fetesBloc} de ${llista.length}</span>
        <span class="ini-tema-barra" aria-hidden="true"><span style="width:${pct}%"></span></span>
      </button>
    `;
  }).join("");

  const llistaInvsHtml = invsDelBloc
    .map(inv => {
      const feta = fetes.includes(inv.id);
      const dif = dificultatInvestigacio(inv.nivells);
      const recomanada = RUTA_RECOMANADA.includes(inv.id);
      return `
        <button type="button" class="ini-inv ${feta ? "feta" : ""}" data-obre-inv="${inv.id}">
          <span class="ini-inv-cos">
            <span class="ini-inv-cap">
              <strong>${inv.titol}</strong>
              ${feta ? `<span class="ini-etiqueta ini-etiqueta-feta">${icona("verifica")} Feta</span>` : ""}
              ${recomanada && !feta ? `<span class="ini-etiqueta ini-etiqueta-ruta">Recomanada</span>` : ""}
            </span>
            <span class="ini-inv-preg">${facil ? inv.preguntaFacil : inv.pregunta}</span>
            <span class="ini-inv-meta">
              <span class="ini-dificultat ini-dif-${dif.grau}" title="Dificultat: ${dif.text}"><i></i><i></i><i></i> ${dif.text}</span>
              <span>${inv.durada} min</span>
              <span class="ini-inv-codi" title="Codi de la investigació">${inv.id}</span>
            </span>
          </span>
          <span class="ini-inv-accio">${feta ? "Repeteix" : "Comença"} ${icona("plega")}</span>
        </button>
      `;
    })
    .join("");

  return `
    <section class="pantalla-inici ini">
      <div class="ini-hero">
        <div class="ini-hero-text">
          <h1>Per què unes coses suren i d'altres s'enfonsen?</h1>
          <p class="ini-subtitol">Descobreix-ho fent experiments en un laboratori virtual: pesa objectes, mesura'n el volum i comprova si suren. Cada investigació et guia pas a pas.</p>
          <div class="ini-accions">
            <button type="button" class="bt bt-primari bt-gran ini-bt-principal" data-obre-inv="${proposta.inv.id}">
              ${icona("laboratori")}
              <span>${proposta.verb}: «${proposta.inv.titol}»</span>
            </button>
            <button type="button" class="bt bt-secundari bt-gran" data-obre-lliure="mesura" title="Entra al laboratori sense guia i prova el que vulguis">
              ${icona("balanca")} Experimenta lliurement
            </button>
          </div>
        </div>
        <ol class="ini-com-funciona" aria-label="Com funciona">
          <li><span class="ini-cf-num">1</span><span><strong>Tria</strong> una investigació (o segueix la ruta recomanada).</span></li>
          <li><span class="ini-cf-num">2</span><span><strong>Experimenta</strong> al laboratori: la guia et diu què fer a cada pas.</span></li>
          <li><span class="ini-cf-num">3</span><span><strong>Anota</strong> les mesures i explica què has descobert.</span></li>
        </ol>
      </div>

      <div class="ini-seccio">
        <div class="ini-seccio-cap">
          <h2>Ruta recomanada</h2>
          <span class="ini-seccio-nota">Nou investigacions per entendre la densitat des de zero · ${fetesRuta} de ${RUTA_RECOMANADA.length} fetes</span>
        </div>
        <ol class="ini-ruta">${rutaHtml}</ol>
      </div>

      <div class="ini-seccio ini-seccio-temes">
        <div class="ini-seccio-cap">
          <h2>Totes les investigacions, per temes</h2>
          <span class="ini-seccio-nota">${fetes.length} de ${INVESTIGACIONS_LLISTA.length} fetes</span>
        </div>
        <div class="ini-temes" role="group" aria-label="Temes">${temesHtml}</div>
        <div class="ini-llista" role="region" aria-label="Investigacions del tema ${blocActiu.titol}">
          <p class="ini-llista-intro"><strong>${blocActiu.titol}.</strong> ${blocActiu.subtitol}.</p>
          <div class="ini-llista-grid">${llistaInvsHtml}</div>
        </div>
      </div>
    </section>
  `;
}
