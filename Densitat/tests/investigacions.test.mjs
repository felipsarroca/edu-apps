/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Proves automàtiques del catàleg d'investigacions (09-arquitectura-tecnica.md §7.1).
 * Comprova que les 51 investigacions dels blocs A a G existeixen, tenen tots els camps,
 * referències vàlides a objectes/líquids/recipients/instruments i versió de lectura fàcil.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { INVESTIGACIONS_LLISTA, INVESTIGACIONS, BLOCS, REPTES, BANC_DIAGNOSTIC_BAYESIA } from "../js/dades/investigacions/index.js";
import { OBJECTES_PRESTATGE } from "../js/dades/objectes.js";
import { LIQUIDS } from "../js/dades/liquids.js";
import { RECIPIENTS } from "../js/dades/recipients.js";
import { INSTRUMENTS } from "../js/dades/instruments.js";

test("El catàleg conté exactament les 51 investigacions dels 7 blocs i les 12 targetes de repte", () => {
  assert.equal(BLOCS.length, 7);
  assert.equal(INVESTIGACIONS_LLISTA.length, 51);
  assert.equal(Object.keys(INVESTIGACIONS).length, 51);
  assert.equal(REPTES.length, 12);
  assert.ok(BANC_DIAGNOSTIC_BAYESIA.length >= 10);

  const perBloc = { A: 8, B: 4, C: 10, D: 8, E: 7, F: 11, G: 3 };
  for (const [b, n] of Object.entries(perBloc)) {
    const compta = INVESTIGACIONS_LLISTA.filter(i => i.bloc === b).length;
    assert.equal(compta, n, `Bloc ${b} ha de tenir ${n} investigacions`);
  }
});

test("Cada investigació té estructura completa, referències vàlides, pistes i lectura fàcil", () => {
  for (const inv of INVESTIGACIONS_LLISTA) {
    assert.ok(inv.id && inv.titol && inv.pregunta && inv.preguntaFacil, `Camps bàsics a ${inv.id}`);
    assert.ok(inv.conclusio && inv.conclusioFacil, `Conclusions a ${inv.id}`);
    assert.ok(Array.isArray(inv.passos) && inv.passos.length >= 4, `Passos a ${inv.id}`);

    // Comprova referències de l'escena
    for (const objId of inv.escena.objectes || []) {
      assert.ok(OBJECTES_PRESTATGE[objId], `Objecte desconegut ${objId} a ${inv.id}`);
    }
    for (const liqId of inv.escena.liquids || []) {
      assert.ok(LIQUIDS[liqId], `Líquid desconegut ${liqId} a ${inv.id}`);
    }
    for (const recId of inv.escena.recipients || []) {
      assert.ok(RECIPIENTS[recId], `Recipient desconegut ${recId} a ${inv.id}`);
    }
    for (const instId of inv.escena.instruments || []) {
      assert.ok(INSTRUMENTS[instId], `Instrument desconegut ${instId} a ${inv.id}`);
    }

    for (const pas of inv.passos) {
      assert.ok(pas.text && pas.facil, `Text i lectura fàcil al pas ${pas.tipus} de ${inv.id}`);
    }
  }
});
