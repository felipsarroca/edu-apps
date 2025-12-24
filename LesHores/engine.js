// Core logic for building pools, questions, and options.
// Exports are plain functions to wire into UI code.

function shuffle(arr, rng = Math.random) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function randomSample(arr, n, rng = Math.random) {
  if (n >= arr.length) return shuffle(arr, rng);
  return shuffle(arr, rng).slice(0, n);
}

function uniqueById(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      out.push(item);
    }
  }
  return out;
}

function wrapHour(h) {
  return (h + 24) % 24;
}

function filterByTags(entries, filters = {}) {
  const tagsAll = filters.tagsAll || [];
  const tagsAny = filters.tagsAny || [];
  let out = entries.slice();
  if (tagsAll.length > 0) {
    out = out.filter((e) => tagsAll.every((t) => e.tags.includes(t)));
  }
  if (tagsAny.length > 0) {
    out = out.filter((e) => tagsAny.some((t) => e.tags.includes(t)));
  }
  return out;
}

function uniqueByTime(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = `${item.h}:${item.m}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function buildPool(level, timeBank, rng = Math.random) {
  const candidates = filterByTags(timeBank, level.filters);
  const poolSize = level.questionPool?.size || 30;

  if (level.questionPool?.perTag) {
    let pool = [];
    for (const [tag, count] of Object.entries(level.questionPool.perTag)) {
      const tagged = candidates.filter((e) => e.tags.includes(tag));
      pool = pool.concat(randomSample(tagged, count, rng));
    }
    pool = uniqueByTime(uniqueById(pool));
    if (pool.length < poolSize) {
      const remaining = candidates.filter(
        (e) => !pool.some((p) => p.id === e.id) && !pool.some((p) => p.h === e.h && p.m === e.m)
      );
      pool = pool.concat(randomSample(remaining, poolSize - pool.length, rng));
    }
    return uniqueByTime(uniqueById(pool));
  }

  return uniqueByTime(randomSample(candidates, poolSize, rng));
}

function buildChallenge(pool, count = 10, rng = Math.random) {
  return randomSample(pool, count, rng);
}

function optionValue(entry, level, settings = {}) {
  if (level.mode === "textToClock") return entry.id;
  if (level.mode === "say") return entry.catalan;
  return settings.use24h ? entry.digital24 : entry.digital12;
}

function entriesSameMinuteNeighborHour(entry, pool) {
  const h1 = wrapHour(entry.h - 1);
  const h2 = wrapHour(entry.h + 1);
  return pool.filter((e) => e.m === entry.m && (e.h === h1 || e.h === h2));
}

function entriesHourDeltas(entry, pool, deltas) {
  const out = [];
  for (const d of deltas || []) {
    const h1 = wrapHour(entry.h + d);
    const h2 = wrapHour(entry.h - d);
    const sameMinute = pool.filter((e) => e.m === entry.m && (e.h === h1 || e.h === h2));
    out.push(...sameMinute);
  }
  return out;
}

function entriesMinuteDeltas(entry, pool, deltas) {
  const out = [];
  for (const d of deltas || []) {
    const m1 = (entry.m + d) % 60;
    const m2 = (entry.m - d + 60) % 60;
    for (const m of [m1, m2]) {
      const sameHour = pool.filter((e) => e.h === entry.h && e.m === m);
      out.push(...sameHour);
    }
  }
  return out;
}

function entriesQuarterNeighborHour(entry, pool) {
  if (![15, 30, 45].includes(entry.m)) return [];
  return entriesSameMinuteNeighborHour(entry, pool);
}

function textSamePatternNeighborHour(entry, pool) {
  const patternTags = ["en_punt", "mitja", "quarts", "menys"];
  const tag = patternTags.find((t) => entry.tags.includes(t));
  if (!tag) return [];
  const h1 = wrapHour(entry.h - 1);
  const h2 = wrapHour(entry.h + 1);
  return pool.filter((e) => e.tags.includes(tag) && (e.h === h1 || e.h === h2));
}

function textEnPuntVsMitja(entry, pool) {
  if (entry.tags.includes("en_punt")) {
    return pool.filter((e) => e.tags.includes("mitja") && e.h === entry.h);
  }
  if (entry.tags.includes("mitja")) {
    return pool.filter((e) => e.tags.includes("en_punt") && e.h === entry.h);
  }
  return [];
}

function textQuartsMin5Confusion(entry, pool) {
  if (!entry.tags.includes("quarts")) return [];
  const h1 = entry.h;
  return pool.filter((e) => e.tags.includes("quarts") && e.tags.includes("min5") && e.h === h1);
}

function textMenysNeighborHour(entry, pool) {
  if (!entry.tags.includes("menys")) return [];
  return entriesSameMinuteNeighborHour(entry, pool);
}

function textMenysVsQuarts(entry, pool) {
  if (!entry.tags.includes("menys")) return [];
  const h1 = entry.h;
  return pool.filter((e) => e.tags.includes("quarts") && e.h === h1);
}

function buildOptions(entry, level, pool, settings = {}, rng = Math.random, allCandidates = null) {
  const correct = optionValue(entry, level, settings);
  const universe = allCandidates || pool;
  let candidates = [];
  const maxOptions = level.optionsRules?.count || 4;

  if (level.mode === "say") {
    candidates = candidates.concat(textSamePatternNeighborHour(entry, universe));

    const textRules = level.optionsRules?.textDistractors || [];
    if (textRules.includes("en_punt_vs_mitja")) {
      candidates = candidates.concat(textEnPuntVsMitja(entry, universe));
    }
    if (textRules.includes("same_quarter_neighbor_hour")) {
      candidates = candidates.concat(textSamePatternNeighborHour(entry, universe));
    }
    if (textRules.includes("quarts_i_min5_confusion")) {
      candidates = candidates.concat(textQuartsMin5Confusion(entry, universe));
    }
    if (textRules.includes("menys_neighbor_hour")) {
      candidates = candidates.concat(textMenysNeighborHour(entry, universe));
    }
    if (textRules.includes("menys_vs_quarts")) {
      candidates = candidates.concat(textMenysVsQuarts(entry, universe));
    }
  } else {
    const strategy = level.optionsRules?.distractorStrategy || "";
    if (strategy === "same_quarter_neighbor_hour") {
      candidates = candidates.concat(entriesQuarterNeighborHour(entry, universe));
    }
    if (strategy === "neighbor_hour_same_minute") {
      candidates = candidates.concat(entriesSameMinuteNeighborHour(entry, universe));
    }

    candidates = candidates.concat(entriesSameMinuteNeighborHour(entry, universe));
    candidates = candidates.concat(entriesMinuteDeltas(entry, universe, level.optionsRules?.minuteDeltas || []));
    candidates = candidates.concat(entriesHourDeltas(entry, universe, level.optionsRules?.hourDeltas || []));
  }

  candidates = uniqueById(candidates).filter((e) => e.id !== entry.id);
  let optionEntries = randomSample(candidates, maxOptions - 1, rng);

  // Fallback if we don't have enough plausible distractors
  if (optionEntries.length < maxOptions - 1) {
    const remaining = universe.filter((e) => e.id !== entry.id && !optionEntries.some((o) => o.id === e.id));
    const needed = maxOptions - 1 - optionEntries.length;
    optionEntries = optionEntries.concat(randomSample(remaining, needed, rng));
  }

  const optionValues = optionEntries.map((e) => optionValue(e, level, settings));
  const seen = new Set([correct]);
  const uniqueOptions = [correct];

  for (const opt of optionValues) {
    if (uniqueOptions.length >= maxOptions) break;
    if (!seen.has(opt)) {
      uniqueOptions.push(opt);
      seen.add(opt);
    }
  }

  if (uniqueOptions.length < maxOptions) {
    const remaining = shuffle(
      universe.filter((e) => e.id !== entry.id),
      rng
    );
    for (const candidate of remaining) {
      if (uniqueOptions.length >= maxOptions) break;
      const value = optionValue(candidate, level, settings);
      if (!seen.has(value)) {
        uniqueOptions.push(value);
        seen.add(value);
      }
    }
  }

  const options = shuffle(uniqueOptions, rng);
  return options;
}

function buildQuestion(entry, level, pool, settings = {}, rng = Math.random, allCandidates = null) {
  const options = buildOptions(entry, level, pool, settings, rng, allCandidates);
  const correct = optionValue(entry, level, settings);
  return {
    entry,
    prompt: level.mode === "textToClock" ? entry.catalan : entry,
    correct,
    options,
  };
}

function validatePool(level, pool) {
  const expected = level.questionPool?.size || 30;
  return {
    levelId: level.levelId,
    size: pool.length,
    ok: pool.length === expected,
  };
}

// Expose functions globally for non-module usage
window.buildPool = buildPool;
window.buildChallenge = buildChallenge;
window.buildQuestion = buildQuestion;
window.buildOptions = buildOptions;
window.validatePool = validatePool;
window.randomSample = randomSample;
window.shuffle = shuffle;
window.uniqueById = uniqueById;

