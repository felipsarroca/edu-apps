import test from "node:test";
import assert from "node:assert/strict";
import {
  UNIFORM_BELIEF,
  entropy,
  estimatedLevel,
  masteryPercent,
  posteriorFor,
  probabilityCorrect,
} from "../shared/adaptive.js";

test("el domini inicial és 0 sense intents", () => {
  assert.equal(masteryPercent(UNIFORM_BELIEF, 0), 0);
});

test("un encert desplaça la creença cap als nivells superiors", () => {
  const posterior = posteriorFor(UNIFORM_BELIEF, { difficulty: 2 }, true, 4);
  assert.ok(posterior[2] > posterior[1]);
  assert.ok(posterior[1] > posterior[0]);
  assert.ok(Math.abs(posterior.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
});

test("una fallada desplaça la creença cap al nivell inicial", () => {
  const posterior = posteriorFor(UNIFORM_BELIEF, { difficulty: 2 }, false, 2);
  assert.equal(estimatedLevel(posterior).label, "Inicial");
});

test("l'atzar depèn del nombre real d'opcions", () => {
  const twoChoices = probabilityCorrect(0, { difficulty: 2 }, 2);
  const sixChoices = probabilityCorrect(0, { difficulty: 2 }, 6);
  assert.ok(twoChoices > sixChoices);
});

test("l'entropia uniforme és màxima per a tres nivells", () => {
  assert.ok(Math.abs(entropy(UNIFORM_BELIEF) - Math.log2(3)) < 1e-12);
});
