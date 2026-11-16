/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Proves automàtiques del motor pedagògic i del diagnòstic adaptatiu bayesià (Fase 4).
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  creaEstatDiagnosiInicial,
  registraEvidenciaIdea,
  probabilitatEncert3PL,
  actualitzaPosteriorNivell,
  seleccionaSeguentItemBayesia,
  responItemDiagnosticBayesia,
  generaInformeBayesia,
  validaSeparabilitatMonteCarlo
} from "../js/guia/diagnosi.js";
import { BANC_DIAGNOSTIC_BAYESIA } from "../js/dades/investigacions/index.js";

test("Transicions deterministes de les idees prèvies: no_observada -> activa -> en_revisio -> superada", () => {
  const diag = creaEstatDiagnosiInicial();
  assert.equal(diag.idees["IP-03"].estat, "no_observada");

  // Evidència d'error -> activa
  registraEvidenciaIdea(diag, { codi: "IP-03", correcta: false, context: "C4_prediu" });
  assert.equal(diag.idees["IP-03"].estat, "activa");

  // Primera resposta correcta -> en_revisio
  registraEvidenciaIdea(diag, { codi: "IP-03", correcta: true, context: "C4_explica" });
  assert.equal(diag.idees["IP-03"].estat, "en_revisio");

  // Segona resposta correcta en un cas d'aplicació (context diferent) -> superada
  registraEvidenciaIdea(diag, {
    codi: "IP-03",
    correcta: true,
    context: "C4_aplica",
    esAplicacio: true
  });
  assert.equal(diag.idees["IP-03"].estat, "superada");

  // Si torna a aparèixer l'error -> torna a activa
  registraEvidenciaIdea(diag, { codi: "IP-03", correcta: false, context: "C5_prediu" });
  assert.equal(diag.idees["IP-03"].estat, "activa");
});

test("Model adaptatiu bayesià: propietats d'invariància, sostre de domini i no irreversibilitat", () => {
  // 1. Sostre de domini <= 0.95
  assert.ok(probabilitatEncert3PL(2, -1, 3) <= 0.95);

  // 2. Fallar la primera pregunta fàcil NO impedeix assolir el nivell superior si després s'encerta tot
  const diag = creaEstatDiagnosiInicial().bayesia;
  const q1 = BANC_DIAGNOSTIC_BAYESIA[0];
  const opcioErr = q1.opcions.find(o => !o.correcta);
  responItemDiagnosticBayesia(diag, q1, opcioErr.id, 0);

  for (let i = 1; i < BANC_DIAGNOSTIC_BAYESIA.length; i++) {
    const q = BANC_DIAGNOSTIC_BAYESIA[i];
    const opcioOk = q.opcions.find(o => o.correcta);
    responItemDiagnosticBayesia(diag, q, opcioOk.id, 0);
  }

  const inf = generaInformeBayesia(diag);
  assert.equal(inf.nivellIndex, 2, "Després d'encertar totes les següents, assoleix el nivell superior (2)");

  // 3. Cap factor es declara «absent_confirmat» sense la mostra mínima d'evidència (2 intents)
  const diagNou = creaEstatDiagnosiInicial().bayesia;
  const infInicial = generaInformeBayesia(diagNou);
  assert.equal(infInicial.fortalesesConfirmades.length, 0);

  // 4. Validació Monte Carlo reproduïble
  const mc = validaSeparabilitatMonteCarlo(200, 20261116);
  assert.ok(mc.exactitudEquilibrada >= 0.72, `Exactitud equilibrada Monte Carlo: ${mc.exactitudEquilibrada}`);
});
