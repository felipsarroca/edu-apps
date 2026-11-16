/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Pantalla i modal de Consulta: Fórmules, Unitats, Taula de densitats, Instruments, Glossari trilingüe (ca/es/en)
 * i «Com funciona aquest laboratori» amb les simplificacions S1–S14 (08-disseny-visual-i-interaccio.md §3.4, 10-llengua-i-glossari.md §6).
 */

import { MATERIALS } from "../dades/materials.js";
import { LIQUIDS, GASOS } from "../dades/liquids.js";
import { INSTRUMENTS } from "../dades/instruments.js";
import { GLOSSARI } from "../dades/glossari.js";
import { SIMPLIFICACIONS } from "../dades/idees.js";
import { formataNombre } from "../fisica/unitats.js";
import { icona } from "../eines/icones.js";

const PESTANYES_CONSULTA = [
  { id: "formules", titol: "Fórmules" },
  { id: "unitats", titol: "Unitats" },
  { id: "densitats", titol: "Taula de densitats" },
  { id: "instruments", titol: "Instruments" },
  { id: "glossari", titol: "Glossari (CA · ES · EN)" },
  { id: "com_funciona", titol: "Com funciona el laboratori" }
];

export function renderitzaPantallaConsulta(estat, opcionsConsulta = {}) {
  const pestanya = estat.pestanyaConsulta || "formules";
  const filtreEstat = opcionsConsulta.filtreEstat || "tots";
  const cercaGlossari = (opcionsConsulta.cercaGlossari || "").toLowerCase().trim();

  return `
    <section class="pantalla-consulta">
      <header class="consulta-cap">
        <div>
          <h2>${icona("consulta")} Consulta científica i glossari</h2>
          <p>Fórmules, equivalències d'unitats, taules de referència de materials, instruments i vocabulari amb traducció al castellà i a l'anglès.</p>
        </div>
        <div class="pestanyes-consulta" role="tablist">
          ${PESTANYES_CONSULTA.map(
            p => `
            <button type="button" role="tab" aria-selected="${p.id === pestanya}" class="bt-pestanya-consulta ${p.id === pestanya ? "activa" : ""}" data-consulta-tab="${p.id}">
              ${p.titol}
            </button>`
          ).join("")}
        </div>
      </header>

      <div class="consulta-cos">
        ${pestanya === "formules" ? renderitzaTabFormules(estat) : ""}
        ${pestanya === "unitats" ? renderitzaTabUnitats() : ""}
        ${pestanya === "densitats" ? renderitzaTabDensitats(estat, filtreEstat) : ""}
        ${pestanya === "instruments" ? renderitzaTabInstruments() : ""}
        ${pestanya === "glossari" ? renderitzaTabGlossari(estat, cercaGlossari) : ""}
        ${pestanya === "com_funciona" ? renderitzaTabComFunciona() : ""}
      </div>
    </section>
  `;
}

function renderitzaTabFormules(estat) {
  return `
    <div class="consulta-grid-2">
      <div class="targeta-consulta">
        <h3>1. Massa, volum i densitat</h3>
        <div class="triangle-formula-wrap">
          <svg viewBox="0 0 180 150" class="svg-triangle-formula" aria-label="Triangle de la fórmula de la densitat m sobre d per V">
            <polygon points="90,12 16,136 164,136" fill="#F8FAFC" stroke="#16303F" stroke-width="2.5" stroke-linejoin="round"/>
            <line x1="53" y1="74" x2="127" y2="74" stroke="#16303F" stroke-width="2"/>
            <line x1="90" y1="74" x2="90" y2="136" stroke="#16303F" stroke-width="2"/>
            <text x="90" y="58" font-size="22" font-weight="700" font-style="italic" fill="#8A5A00" text-anchor="middle">m</text>
            <text x="64" y="116" font-size="22" font-weight="700" font-style="italic" fill="#6D3FB5" text-anchor="middle">d</text>
            <text x="116" y="116" font-size="22" font-weight="700" font-style="italic" fill="#1D6FB8" text-anchor="middle">V</text>
          </svg>
          <div class="formules-aillades">
            <div class="eq-item">
              <span class="eq-math"><em>d</em> = <span class="frac"><span><em>m</em></span><span><em>V</em></span></span></span>
              <span class="eq-desc"><strong>Densitat:</strong> massa de cada unitat de volum (g/cm³ o kg/m³)</span>
            </div>
            <div class="eq-item">
              <span class="eq-math"><em>m</em> = <em>d</em> · <em>V</em></span>
              <span class="eq-desc"><strong>Massa:</strong> densitat multiplicada pel volum (g o kg)</span>
            </div>
            <div class="eq-item">
              <span class="eq-math"><em>V</em> = <span class="frac"><span><em>m</em></span><span><em>d</em></span></span></span>
              <span class="eq-desc"><strong>Volum:</strong> massa dividida per la densitat (cm³ o m³)</span>
            </div>
          </div>
        </div>
        <p class="nota-simbol">Nota de notació (Nivell 3): en física, la densitat també es representa sovint amb la lletra grega <strong><em>ρ</em></strong> (ro).</p>
      </div>

      <div class="targeta-consulta">
        <h3>2. Forces, principi d'Arquimedes i pressió (4t d'ESO)</h3>
        <div class="formules-aillades">
          <div class="eq-item">
            <span class="eq-math"><em>P</em> = <em>m</em> · <em>g</em></span>
            <span class="eq-desc"><strong>Pes (N):</strong> massa en quilograms (kg) per la gravetat (<em>g</em> = 9,8 N/kg a la Terra)</span>
          </div>
          <div class="eq-item">
            <span class="eq-math"><em>E</em> = <em>d</em><sub>L</sub> · <em>g</em> · <em>V</em><sub>L</sub></span>
            <span class="eq-desc"><strong>Empenyiment d'Arquimedes (N):</strong> pes del líquid desplaçat</span>
          </div>
          <div class="eq-item">
            <span class="eq-math"><em>P</em><sub>a</sub> = <em>P</em> − <em>E</em></span>
            <span class="eq-desc"><strong>Pes aparent (N):</strong> lectura del dinamòmetre quan el cos és dins del líquid</span>
          </div>
          <div class="eq-item">
            <span class="eq-math"><span class="frac"><span><em>V</em><sub>sub</sub></span><span><em>V</em></span></span> = <span class="frac"><span><em>d</em><sub>o</sub></span><span><em>d</em><sub>L</sub></span></span></span>
            <span class="eq-desc"><strong>Fracció submergida:</strong> per a un sòlid massís que sura en equilibri (<em>E</em> = <em>P</em>)</span>
          </div>
          <div class="eq-item">
            <span class="eq-math"><em>p</em> = <em>d</em><sub>L</sub> · <em>g</em> · <em>h</em></span>
            <span class="eq-desc"><strong>Pressió hidrostàtica (Pa):</strong> densitat en kg/m³, <em>g</em> en N/kg i profunditat <em>h</em> en m</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderitzaTabUnitats() {
  return `
    <div class="consulta-grid-2">
      <div class="targeta-consulta">
        <h3>Equivalències fonamentals de volum i capacitat</h3>
        <div class="destacat-equivalencia">
          <code>1 dm³ = 1 L = 1000 cm³ = 1000 mL</code>
          <code>1 cm³ = 1 mL</code>
          <code>1 m³ = 1000 dm³ = 1000 L = 1 000 000 cm³</code>
        </div>
        <p>En l'escala de <strong>massa</strong> (kg → hg → dag → g → dg → cg → mg) i en la de <strong>capacitat</strong> (L → dL → cL → mL), cada graó val <strong>10</strong>.</p>
        <p>En l'escala de <strong>volum</strong> (m³ → dm³ → cm³ → mm³), com que té tres dimensions (llarg × ample × alt = 10 × 10 × 10), cada graó val <strong>1000</strong>.</p>
      </div>
      <div class="targeta-consulta">
        <h3>Equivalències de les unitats de densitat</h3>
        <div class="destacat-equivalencia">
          <code>1 g/cm³ = 1 g/mL = 1 kg/L = 1 kg/dm³ = 1000 kg/m³ = 1000 g/L</code>
        </div>
        <p><strong>Conversió per factors (com al llibre):</strong></p>
        <p><code>2,70 g/cm³ · (1 kg / 1000 g) · (1 000 000 cm³ / 1 m³) = 2700 kg/m³</code></p>
      </div>
    </div>
  `;
}

function renderitzaTabDensitats(estat, filtre) {
  const solids = Object.values(MATERIALS).filter(m => m.id !== "aliatge_corona");
  const liquids = Object.values(LIQUIDS);
  const gasos = Object.values(GASOS);

  return `
    <div class="targeta-consulta">
      <div class="fila-entre">
        <h3>Taula de densitats de referència del laboratori (a 20 °C)</h3>
        <div class="pestanyes-curtes">
          ${["tots", "solids", "liquids", "gasos"]
            .map(
              f =>
                `<button type="button" class="pestanya-curta ${filtre === f ? "activa" : ""}" data-filtre-densitat="${f}">${
                  f === "tots" ? "Tots" : f === "solids" ? "Sòlids (g/cm³)" : f === "liquids" ? "Líquids (g/cm³)" : "Gasos (kg/m³ = g/L)"
                }</button>`
            )
            .join("")}
        </div>
      </div>

      <div class="taula-scroll">
        <table class="taula-dades">
          <thead>
            <tr>
              <th>Substància / Material</th>
              <th>Estat</th>
              <th>Valor escolar</th>
              <th>Valor de referència (20 °C)</th>
              <th>Interval habitual</th>
              <th>En aigua dolça (1,00 g/cm³)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${
              filtre === "tots" || filtre === "solids"
                ? solids
                    .map(
                      m => `
                  <tr>
                    <td>
                      <span class="mostra-color" style="background:${m.aspecte.color};border-color:${m.aspecte.contorn}"></span>
                      <strong>${m.nom}</strong>
                    </td>
                    <td>Sòlid</td>
                    <td class="num-tabular"><strong>${formataNombre(m.dEscolar, 2)} g/cm³</strong></td>
                    <td class="num-tabular">${m.dReferencia ? `${formataNombre(m.dReferencia, 3)} g/cm³` : "—"}</td>
                    <td class="num-tabular">${m.interval ? `${formataNombre(m.interval[0], 2)}–${formataNombre(m.interval[1], 2)}` : "—"}</td>
                    <td>${m.dEscolar < 1.0 ? `<span class="badge-sura">Sura (${Math.round(m.dEscolar * 100)} %)</span>` : `<span class="badge-enfonsa">S'enfonsa</span>`}</td>
                    <td class="text-suau">${(m.notes || []).join("; ")}</td>
                  </tr>`
                    )
                    .join("")
                : ""
            }
            ${
              filtre === "tots" || filtre === "liquids"
                ? liquids
                    .map(
                      l => `
                  <tr>
                    <td>
                      <span class="mostra-color" style="background:${l.color}"></span>
                      <strong>${l.nom}</strong>
                    </td>
                    <td>Líquid (${l.familia})</td>
                    <td class="num-tabular"><strong>${formataNombre(l.dEscolar, 2)} g/cm³</strong></td>
                    <td class="num-tabular">${formataNombre(l.dReferencia, 3)} g/cm³</td>
                    <td class="num-tabular">${l.interval ? `${formataNombre(l.interval[0], 2)}–${formataNombre(l.interval[1], 2)}` : "—"}</td>
                    <td>${l.dEscolar < 1.0 ? "Damunt l'aigua" : l.id === "aigua" ? "Referència" : "Sota l'aigua"}</td>
                    <td class="text-suau">${(l.notes || []).join("; ")}</td>
                  </tr>`
                    )
                    .join("")
                : ""
            }
            ${
              filtre === "tots" || filtre === "gasos"
                ? gasos
                    .map(
                      g => `
                  <tr>
                    <td><strong>${g.nom}</strong></td>
                    <td>Gas</td>
                    <td class="num-tabular"><strong>${formataNombre(g.dEscolar, 2)} g/L (kg/m³)</strong></td>
                    <td class="num-tabular">${formataNombre(g.dReferencia, 3)} g/L</td>
                    <td>—</td>
                    <td>${g.dEscolar < 1.2 ? "Puja en l'aire" : g.id === "aire" ? "Aire ambient" : "Cau en l'aire"}</td>
                    <td class="text-suau">${(g.notes || []).join("; ")}</td>
                  </tr>`
                    )
                    .join("")
                : ""
            }
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderitzaTabInstruments() {
  return `
    <div class="consulta-grid-2">
      <div class="targeta-consulta">
        <h3>Instruments del laboratori virtual</h3>
        <table class="taula-dades">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Model</th>
              <th>Rang màxim</th>
              <th>Resolució</th>
            </tr>
          </thead>
          <tbody>
            ${Object.values(INSTRUMENTS)
              .map(
                inst => `
              <tr>
                <td><strong>${inst.nom}</strong></td>
                <td>${inst.model}</td>
                <td class="num-tabular">${formataNombre(inst.rangMax)} ${inst.unitats[0]}</td>
                <td class="num-tabular">${formataNombre(inst.resolucio)} ${inst.unitats[0]}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="targeta-consulta">
        <h3>Recipients graduats i recipients aforats</h3>
        <p><strong>Recipients graduats (proveta, pipeta graduada, bureta):</strong> porten una escala amb moltes divisions i permeten mesurar qualsevol volum dins del seu rang. La <strong>bureta</strong> té una clau de pas a baix per deixar caure líquid gota a gota.</p>
        <p><strong>Recipients aforats (matràs aforat, pipeta aforada):</strong> tenen un coll estret amb una sola marca circular (aforament). Només serveixen per mesurar un únic volum fix (per exemple, 100,0 mL), però ho fan amb molta més exactitud que una proveta.</p>
        <p><strong>Vas de precipitats i erlenmeyer:</strong> les seves marques són només aproximades; serveixen per contenir, dissoldre o escalfar líquids, mai per mesurar volums amb precisió.</p>
      </div>
    </div>
  `;
}

function renderitzaTabGlossari(estat, cerca) {
  const filtrats = GLOSSARI.filter(
    g =>
      !cerca ||
      g.terme.toLowerCase().includes(cerca) ||
      g.es.toLowerCase().includes(cerca) ||
      g.en.toLowerCase().includes(cerca) ||
      g.definicio.toLowerCase().includes(cerca)
  );

  return `
    <div class="targeta-consulta">
      <div class="fila-entre">
        <h3>Glossari científic (català · castellà · anglès)</h3>
        <input type="search" id="input-cerca-glossari" value="${cerca}" placeholder="Cerca un terme (ex. menisc, empenyiment, calat...)" class="input-cerca">
      </div>
      <div class="glossari-grid">
        ${filtrats
          .map(
            g => `
          <article class="fitxa-glossari">
            <div class="fitxa-glossari-cap">
              <h4>${g.terme}</h4>
              <div class="traduccions-glossari">
                <span lang="es" title="Castellà">ES: <em>${g.es}</em></span>
                <span lang="en" title="Anglès">EN: <em>${g.en}</em></span>
              </div>
            </div>
            <p class="glossari-def">${estat.configuracio.lecturaFacil ? g.facil : g.definicio}</p>
            <p class="glossari-facil"><strong>En poques paraules (A2):</strong> ${g.facil}</p>
            <p class="glossari-ex"><strong>Exemple:</strong> ${g.exemple}</p>
          </article>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderitzaTabComFunciona() {
  return `
    <div class="targeta-consulta">
      <h3>Com funciona aquest laboratori: el model físic i les seves simplificacions</h3>
      <p>Tot científic ha de conèixer com funciona el model amb què treballa. En aquest laboratori, cap resultat està pregravat per a una activitat: tot es calcula a partir de les lleis de la física. Perquè les mesures siguin clares a l'ESO, s'apliquen aquestes 14 simplificacions explícites:</p>
      <div class="simplificacions-grid">
        ${SIMPLIFICACIONS.map(
          s => `
          <div class="fitxa-simplificacio">
            <span class="codi-simp">${s.codi}</span>
            <div>
              <strong>${s.titol}</strong>
              <p>${s.descripcio}</p>
            </div>
          </div>`
        ).join("")}
      </div>
    </div>
  `;
}
