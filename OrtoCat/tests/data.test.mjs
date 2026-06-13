import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("totes les bases de dades compleixen l'esquema i la cobertura", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-data.mjs"], {
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
