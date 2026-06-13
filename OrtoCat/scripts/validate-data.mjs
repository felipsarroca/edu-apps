import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules = fs.readdirSync(root).filter((name) => name.startsWith("OrtoCat-"));
const errors = [];

function report(moduleName, message) {
  errors.push(`${moduleName}: ${message}`);
}

for (const moduleName of modules) {
  const dataDir = path.join(root, moduleName, "data");
  const rules = JSON.parse(fs.readFileSync(path.join(dataDir, "rules.json"), "utf8"));
  const words = JSON.parse(fs.readFileSync(path.join(dataDir, "words.json"), "utf8"));
  const contrasts = JSON.parse(fs.readFileSync(path.join(dataDir, "homophones.json"), "utf8"));
  const ruleIds = new Set(rules.map((rule) => rule.id));
  const ids = new Set();
  const normalizedWords = new Map();

  for (const item of words.concat(contrasts)) {
    if (!item.id || ids.has(item.id)) report(moduleName, `identificador duplicat o buit: ${item.id}`);
    ids.add(item.id);
    if (!item.answer) report(moduleName, `${item.id} no té resposta`);
  }

  for (const word of words) {
    const normalizedWord = `${word.ruleId}:${word.word.toLocaleLowerCase("ca")}`;
    if (normalizedWords.has(normalizedWord)) {
      report(moduleName, `${word.id} duplica la paraula de ${normalizedWords.get(normalizedWord)} dins la mateixa norma: ${word.word}`);
    } else {
      normalizedWords.set(normalizedWord, word.id);
    }
    if (!ruleIds.has(word.ruleId)) report(moduleName, `${word.id} referencia una norma inexistent`);
    if (![1, 2, 3].includes(word.difficulty)) report(moduleName, `${word.id} té dificultat invàlida`);
    if ((word.masked.match(/_/g) || []).length !== 1) report(moduleName, `${word.id} ha de tenir un únic buit`);
    if (word.masked.replace("_", word.answer).toLocaleLowerCase("ca") !== word.word.toLocaleLowerCase("ca")) {
      report(moduleName, `${word.id} no reconstrueix la paraula ${word.word}`);
    }
  }

  for (const contrast of contrasts) {
    if ((contrast.sentence.match(/_/g) || []).length !== 1) report(moduleName, `${contrast.id} ha de tenir un únic buit`);
    if (!contrast.word || !contrast.explanation) report(moduleName, `${contrast.id} necessita paraula i explicació`);
  }

  for (const rule of rules) {
    const ruleWords = words.filter((word) => word.ruleId === rule.id);
    if (ruleWords.length < 15) report(moduleName, `${rule.id} té menys de 15 paraules`);
    for (const example of rule.examples) {
      if (!ruleWords.some((word) => word.word.toLocaleLowerCase("ca") === example.toLocaleLowerCase("ca"))) {
        report(moduleName, `l'exemple ${example} de ${rule.id} no és practicable`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Dades correctes: ${modules.length} mòduls validats.`);
}
