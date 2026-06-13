export const UNIFORM_BELIEF = [1 / 3, 1 / 3, 1 / 3];

export function normalizeBelief(value) {
  if (!Array.isArray(value) || value.length !== 3) return [...UNIFORM_BELIEF];
  const clean = value.map((entry) => Number(entry));
  const total = clean.reduce((sum, entry) => sum + entry, 0);
  if (!clean.every(Number.isFinite) || total <= 0) return [...UNIFORM_BELIEF];
  return clean.map((entry) => entry / total);
}

export function posteriorFor(priorValue, item, isCorrect, optionCount) {
  const prior = normalizeBelief(priorValue);
  const likelihoods = prior.map((_, index) => {
    const pHit = probabilityCorrect(index, item, optionCount);
    return isCorrect ? pHit : 1 - pHit;
  });
  const raw = prior.map((probability, index) => probability * likelihoods[index]);
  const total = raw.reduce((sum, value) => sum + value, 0) || 1;
  return raw.map((value) => value / total);
}

export function probabilityCorrect(levelIndex, item, optionCount) {
  const theta = [-1, 0, 1][levelIndex];
  const bq = difficultyToB(item.difficulty || 1);
  const a = 1.5;
  const choices = Math.max(2, Number(item.optionCount || optionCount || 2));
  const c = 1 / choices;
  return c + (1 - c) / (1 + Math.exp(-a * (theta - bq)));
}

export function difficultyToB(difficulty) {
  return { 1: -0.75, 2: 0, 3: 0.75 }[difficulty] ?? 0;
}

export function expectedInformationGain(prior, item, optionCount) {
  const pCorrect = marginalCorrect(prior, item, optionCount);
  const posteriorHit = posteriorFor(prior, item, true, optionCount);
  const posteriorMiss = posteriorFor(prior, item, false, optionCount);
  return entropy(prior) - (
    pCorrect * entropy(posteriorHit) +
    (1 - pCorrect) * entropy(posteriorMiss)
  );
}

export function marginalCorrect(priorValue, item, optionCount) {
  const prior = normalizeBelief(priorValue);
  return prior.reduce(
    (sum, probability, index) =>
      sum + probability * probabilityCorrect(index, item, optionCount),
    0
  );
}

export function entropy(distributionValue) {
  const distribution = normalizeBelief(distributionValue);
  return -distribution.reduce((sum, probability) => {
    if (probability <= 0) return sum;
    return sum + probability * Math.log2(probability);
  }, 0);
}

export function estimatedLevel(beliefValue) {
  const belief = normalizeBelief(beliefValue);
  const bestIndex = belief.indexOf(Math.max(...belief));
  const levels = [
    { label: "Inicial", maxDifficulty: 1 },
    { label: "Intermedi", maxDifficulty: 2 },
    { label: "Avançat", maxDifficulty: 3 },
  ];
  return {
    ...levels[bestIndex],
    confidence: belief[bestIndex],
    entropy: entropy(belief),
  };
}

export function masteryPercent(beliefValue, attempts) {
  if (!attempts) return 0;
  const belief = normalizeBelief(beliefValue);
  return Math.round((belief[1] * 0.5 + belief[2]) * 100);
}
