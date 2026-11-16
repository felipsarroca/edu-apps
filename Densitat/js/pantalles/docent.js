/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Pantalla de Mode Docent: projector, control del que es veu, generador d'enllaços per a Classroom,
 * solucionari de les 51 investigacions, rúbrica de la situació d'aprenentatge, editor d'activitats
 * i validació Monte Carlo del banc bayesià (07-guia-quadern-i-avaluacio.md §8–§9).
 */

import { INVESTIGACIONS_LLISTA } from "../dades/investigacions/index.js";
import { generaEnllacCompartible } from "../estat/escena-url.js";
import { carregaEscenesDesades, carregaActivitatsDocent } from "../estat/desament.js";
import { generaInformeBayesia, NOMS_NIVELLS } from "../guia/diagnosi.js";
import { formataNombre } from "../fisica/unitats.js";
import { icona } from "../eines/icones.js";

export function renderitzaPantallaDocent(estat, resultatMonteCarlo = null) {
  const cfg = estat.configuracio;
  const enllacInv = generaEnllacCompartible({
    inv: estat.investigacio?.id || "C4",
    nivell: cfg.nivell,
    facil: cfg.lecturaFacil,
    senzills: cfg.nombresSenzills,
    pistes: cfg.pistesActives
  });
  const enllacEscena = generaEnllacCompartible({
    inv: estat.investigacio?.id || "C4",
    nivell: cfg.nivell,
    escena: {
      taula: estat.laboratori.taula,
      ubicacions: estat.laboratori.ubicacions,
      vas: estat.laboratori.vas,
      tanc: estat.laboratori.tanc
    }
  });

  const escenesDesades = carregaEscenesDesades();
  const activitatsDocent = carregaActivitatsDocent();
  const infBayes = generaInformeBayesia(estat.progres.diagnosi.bayesia);

  return `
    <section class="pantalla-docent">
      <header class="docent-cap">
        <div>
          <span class="insignia-bloc">Espai per al professorat (sense contrasenya)</span>
          <h2>${icona("docent")} Mode docent, projector i guia didàctica</h2>
          <p>Configura què veu l'alumnat, projecta a la pissarra digital, comparteix enllaços per Google Classroom i consulta el solucionari.</p>
        </div>
      </header>

      <div class="docent-grid">
        <!-- 1. Controls de projecció i visibilitat -->
        <div class="targeta-consulta">
          <h3>1. Projecció a l'aula i control de visibilitat</h3>
          <div class="docent-toggles">
            <label class="fila-switch">
              <input type="checkbox" data-docent-toggle="projector" ${cfg.projector ? "checked" : ""}>
              <span><strong>Mode projector (pissarra digital):</strong> lletra i escena més grans, sense panells secundaris</span>
            </label>
            <label class="fila-switch">
              <input type="checkbox" data-docent-toggle="analisi" ${estat.laboratori.visibilitat === "analisi" ? "checked" : ""}>
              <span><strong>Mode d'anàlisi:</strong> mostra totes les masses, volums, densitats i materials sense haver de mesurar</span>
            </label>
            <label class="fila-switch">
              <input type="checkbox" data-docent-toggle="amagaResultats" ${cfg.amagaResultats ? "checked" : ""}>
              <span><strong>Atura abans del resultat (recull prediccions a mà alçada):</strong> congela la immersió fins que premis «Mostra resultat»</span>
            </label>
            <label class="fila-switch">
              <input type="checkbox" data-docent-toggle="lecturaFacil" ${cfg.lecturaFacil ? "checked" : ""}>
              <span><strong>Lectura fàcil (nivell lingüístic A2):</strong> enunciats breus i directes per a alumnat nouvingut o NESE</span>
            </label>
            <label class="fila-switch">
              <input type="checkbox" data-docent-toggle="nombresSenzills" ${cfg.nombresSenzills ? "checked" : ""}>
              <span><strong>Nombres senzills (valors escolars):</strong> aigua 1,00 g/cm³ en lloc de 0,998 g/cm³</span>
            </label>
            <label class="fila-switch">
              <input type="checkbox" data-docent-toggle="pistesActives" ${cfg.pistesActives ? "checked" : ""}>
              <span><strong>Pistes activades:</strong> permet que l'alumnat demani pistes graduades en 3 graons</span>
            </label>
          </div>
          <div class="docent-gravetat-fila">
            <label>
              <span>Valor de la gravetat <em>g</em> a la Terra:</span>
              <select id="docent-sel-g">
                <option value="9.8" ${cfg.g === 9.8 ? "selected" : ""}>9,8 N/kg (llibre Science Bits)</option>
                <option value="9.81" ${cfg.g === 9.81 ? "selected" : ""}>9,81 N/kg</option>
                <option value="10" ${cfg.g === 10 ? "selected" : ""}>10 N/kg (càlcul mental)</option>
              </select>
            </label>
          </div>
        </div>

        <!-- 2. Enllaços per a Google Classroom i escenes preparades -->
        <div class="targeta-consulta">
          <h3>2. Enllaços per a Google Classroom i escenes</h3>
          <p class="etiqueta-petita">Quan un alumne entra amb un enllaç que porta el paràmetre de nivell, el nivell li queda fixat.</p>
          <div class="docent-enllac-box">
            <label>Enllaç directe a la investigació activa (${estat.investigacio?.id || "C4"}, Nivell ${cfg.nivell}):</label>
            <div class="fila-input">
              <input type="text" readonly value="${enllacInv}" id="input-enllac-inv">
              <button type="button" class="bt bt-primari bt-petit" data-copia-input="input-enllac-inv">${icona("enllac")} Copia</button>
            </div>
          </div>
          <div class="docent-enllac-box">
            <label>Enllaç a l'escena exacta actual del laboratori:</label>
            <div class="fila-input">
              <input type="text" readonly value="${enllacEscena}" id="input-enllac-escena">
              <button type="button" class="bt bt-secundari bt-petit" data-copia-input="input-enllac-escena">${icona("enllac")} Copia</button>
            </div>
          </div>
          <div class="docent-enllac-box">
            <label>Desa l'escena actual al navegador amb un nom:</label>
            <div class="fila-input">
              <input type="text" id="input-nom-escena" placeholder="Ex. Debat inicial bola vs barca">
              <button type="button" class="bt bt-secundari bt-petit" data-desa-escena="true">Desa escena</button>
            </div>
          </div>
          ${
            escenesDesades.length > 0
              ? `<div class="llista-escenes-desades">
                  ${escenesDesades
                    .map(
                      e => `<button type="button" class="chip-mesura" data-carrega-escena="${e.id}">${e.nom}</button>`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>
      </div>

      <!-- 3. Vista docent del diagnòstic bayesià i validació Monte Carlo -->
      <div class="targeta-consulta">
        <div class="fila-entre">
          <div>
            <h3>3. Vista docent del motor bayesià i validació de separabilitat (Monte Carlo)</h3>
            <p class="etiqueta-petita">Distribució posterior de nivell, probabilitats marginals de cada idea prèvia (prior informatiu 0,25–0,35) i matriu de confusió sota el model.</p>
          </div>
          <button type="button" class="bt bt-secundari bt-petit" data-executa-montecarlo="true">
            Executa validació Monte Carlo (1500 simulacions)
          </button>
        </div>
        <div class="docent-grid">
          <div>
            <p><strong>Nivell estimat (MAP):</strong> ${infBayes.etiquetaNivellDocent} (${Math.round(infBayes.probabilitatNivell * 100)} % · ${infBayes.provisional ? "Provisional" : "Confirmat"})</p>
            <div class="barres-posterior-docent">
              ${infBayes.distribucioPosterior
                .map(
                  (p, i) => `
                <div class="fila-post-bar">
                  <span>${NOMS_NIVELLS[i]}</span>
                  <div class="barra-progres"><div class="barra-progres-omplert" style="width:${Math.round(p * 100)}%"></div></div>
                  <strong class="num-tabular">${Math.round(p * 100)} %</strong>
                </div>`
                )
                .join("")}
            </div>
            <details class="detall-docent">
              <summary>Llista de comprovació docent del contingut (sense tecnicismes)</summary>
              <ul class="llista-punts">
                <li>Aquests errors (IP-01 a IP-20), són errors reals que observes al teu alumnat d'ESO?</li>
                <li>Hi ha alguna pregunta massa fàcil o massa difícil per al curs on l'apliques?</li>
                <li>Les respostes correctes i les explicacions s'ajusten al vocabulari de classe?</li>
                <li>Falta algun cas important del tema de densitat o flotació?</li>
              </ul>
            </details>
          </div>
          <div>
            ${
              resultatMonteCarlo
                ? `<div class="mc-box">
                    <p><strong>Fiabilitat teòrica sota el model (${resultatMonteCarlo.totalSimulacions} respondents sintètics):</strong> Exactitud equilibrada = <strong>${formataNombre(resultatMonteCarlo.exactitudEquilibrada * 100, 1)} %</strong> · Longitud mitjana = ${formataNombre(resultatMonteCarlo.longitudMitjanaSessio, 1)} preguntes · Indeterminats = ${formataNombre(resultatMonteCarlo.taxaIndeterminats * 100, 1)} %</p>
                    <table class="taula-dades">
                      <thead><tr><th>Nivell real \\ Diagnosticat</th><th>Nivell 1</th><th>Nivell 2</th><th>Nivell 3</th><th>Taxa encert</th></tr></thead>
                      <tbody>
                        ${[0, 1, 2]
                          .map(
                            r => `<tr>
                            <td><strong>Nivell ${r + 1}</strong></td>
                            <td>${resultatMonteCarlo.matriuConfusio[r][0]}</td>
                            <td>${resultatMonteCarlo.matriuConfusio[r][1]}</td>
                            <td>${resultatMonteCarlo.matriuConfusio[r][2]}</td>
                            <td><strong>${formataNombre(resultatMonteCarlo.taxesPerNivell[r] * 100, 1)} %</strong></td>
                          </tr>`
                          )
                          .join("")}
                      </tbody>
                    </table>
                  </div>`
                : `<p class="text-suau">Prem «Executa validació Monte Carlo» per verificar al navegador la matriu de confusió i la separabilitat dels tres nivells.</p>`
            }
          </div>
        </div>
      </div>

      <!-- 4. Situació d'aprenentatge i Rúbrica -->
      <div class="targeta-consulta">
        <h3>4. Situació d'aprenentatge (6 sessions): «Per què suren els vaixells?» i rúbrica</h3>
        <p>Seqüència combinada de laboratori virtual i pràctica real amb plastilina, patata, sal i un ou (2n i 4t d'ESO):</p>
        <div class="taula-scroll">
          <table class="taula-dades">
            <thead>
              <tr><th>Dimensió</th><th>Inicial</th><th>Bàsic</th><th>Notable</th><th>Excel·lent</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Comprensió conceptual</strong></td>
                <td>Explica la flotació per la massa o la mida sola</td>
                <td>Fa servir la densitat en objectes massissos</td>
                <td>Compara la densitat de l'objecte amb la del líquid</td>
                <td>Explica els objectes buits amb la densitat mitjana o amb l'empenyiment</td>
              </tr>
              <tr>
                <td><strong>Procediment experimental</strong></td>
                <td>Mesura amb ajuda</td>
                <td>Mesura massa i volum correctament</td>
                <td>Tria l'instrument adequat i controla les variables</td>
                <td>Detecta i corregeix les seves pròpies fonts d'error</td>
              </tr>
              <tr>
                <td><strong>Competència matemàtica</strong></td>
                <td>Calcula amb el marc guiat</td>
                <td>Calcula densitats amb unitats</td>
                <td>Converteix unitats i interpreta la gràfica</td>
                <td>Prediu valors nous a partir de la relació</td>
              </tr>
              <tr>
                <td><strong>Raonament científic</strong></td>
                <td>Prediu sense motiu</td>
                <td>Prediu amb un motiu</td>
                <td>Explica la diferència entre la predicció i el resultat</td>
                <td>Conclou amb les dades i en reconeix els límits</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Solucionari complet de les 51 investigacions -->
      <div class="targeta-consulta">
        <h3>5. Solucionari de les 51 investigacions (blocs A a G)</h3>
        <div class="taula-scroll">
          <table class="taula-dades">
            <thead>
              <tr>
                <th>Codi</th>
                <th>Títol i pregunta</th>
                <th>Nivell · Durada</th>
                <th>Idees i errors</th>
                <th>Valors esperats i conclusió</th>
              </tr>
            </thead>
            <tbody>
              ${INVESTIGACIONS_LLISTA.map(
                inv => `
                <tr>
                  <td><button type="button" class="bt-link" data-obre-inv="${inv.id}"><strong>${inv.id}</strong></button></td>
                  <td><strong>${inv.titol}</strong><br><span class="text-suau">${inv.pregunta}</span></td>
                  <td>N${inv.nivells.join("–")} · ${inv.durada} min</td>
                  <td><code>${(inv.idees || []).join(", ")}</code></td>
                  <td><strong>Dades:</strong> ${inv.valorsEsperats}<br><em>Conclusió:</em> ${inv.conclusio}</td>
                </tr>`
              ).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}
