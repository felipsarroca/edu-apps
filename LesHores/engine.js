/* SPDX-License-Identifier: AGPL-3.0-or-later */
// Motor del joc: tria de preguntes sense repeticions i distractors versemblants.
// Les hores són de rellotge (1-12): el que es veu igual a l'analògic és la mateixa pregunta.

export function shuffle(arr, rng = Math.random) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const wrap12 = (h) => ((((h - 1) % 12) + 12) % 12) + 1;
const wrap60 = (m) => ((m % 60) + 60) % 60;

/** Hores que formen part d'un nivell. */
export function levelItems(level, bank) {
  return bank.filter((e) => level.minutes.includes(e.m) && (!level.text || e[level.text]));
}

/**
 * Baralla de preguntes: no repeteix cap hora fins que s'han vist totes i evita
 * que la mateixa hora (agulla petita) surti en dues preguntes properes.
 */
export function createDeck(items, rng = Math.random) {
  let deck = shuffle(items, rng);
  const recent = [];
  const gapHours = items.length >= 24 ? 2 : 1;

  function pick() {
    if (deck.length === 0) deck = shuffle(items, rng);
    const lastIds = recent.slice(-3).map((e) => e.id);
    const lastHours = recent.slice(-gapHours).map((e) => e.h);
    const tests = [
      (e) => !lastIds.includes(e.id) && !lastHours.includes(e.h),
      (e) => !lastIds.includes(e.id) && e.h !== recent.at(-1)?.h,
      (e) => e.id !== recent.at(-1)?.id,
    ];
    for (const ok of tests) {
      const i = deck.findIndex(ok);
      if (i !== -1) return take(i);
    }
    // Si a la baralla no en queda cap de vàlid, se'n barreja una de nova.
    deck = shuffle(items, rng);
    const i = deck.findIndex(tests[0]);
    return take(i === -1 ? 0 : i);
  }

  function take(i) {
    const [item] = deck.splice(i, 1);
    recent.push(item);
    if (recent.length > 6) recent.shift();
    return item;
  }

  return { next: pick };
}

/** Tres distractors: confusió d'hora, de minuts o d'agulles, i un de variat. */
export function buildOptions(item, level, bank, rng = Math.random) {
  const allowed = new Set(level.optionMinutes || level.minutes);
  const byKey = new Map(bank.map((e) => [`${e.h}:${e.m}`, e]));
  const usable = (e) => e && e.id !== item.id && allowed.has(e.m) && (!level.text || e[level.text]);
  const get = (h, m) => byKey.get(`${wrap12(h)}:${wrap60(m)}`);

  const hourTrap = [get(item.h - 1, item.m), get(item.h + 1, item.m)];
  const minuteTrap = [5, 10, 15, 30].flatMap((d) => [get(item.h, item.m + d), get(item.h, item.m - d)]);
  const swapped = item.m % 5 === 0 ? [get(item.m === 0 ? 12 : item.m / 5, (item.h % 12) * 5)] : [];
  const far = [get(item.h + 2, item.m), get(item.h - 2, item.m), get(item.h + 6, item.m)];

  const groups = [hourTrap, [...minuteTrap, ...swapped], far].map((g) => shuffle(g.filter(usable), rng));
  const chosen = [];
  const add = (e) => {
    if (e && chosen.length < 3 && !chosen.some((c) => c.id === e.id)) chosen.push(e);
  };
  groups.forEach((g) => add(g[0]));
  shuffle(groups.flat(), rng).forEach(add);
  shuffle(bank.filter(usable), rng).forEach(add);

  return shuffle([item, ...chosen], rng);
}
