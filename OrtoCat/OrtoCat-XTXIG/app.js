import {
  UNIFORM_BELIEF,
  estimatedLevel,
  expectedInformationGain,
  masteryPercent,
  normalizeBelief,
  posteriorFor,
} from "../shared/adaptive.js";
import { markSelectedChoice, setupTabs } from "../shared/ui.js";

const state = {
  rules: [],
  words: [],
  homophones: [],
  ruleIndex: 0,
  guidedItems: [],
  randomItems: [],
  reviewItems: [],
  homophoneItems: [],
  guidedSeen: {},
  optionCount: 4,
  stats: loadStats(),
};

const els = {
  backToMenu: document.querySelector("#backToMenu"),
  totalHits: document.querySelector("#totalHits"),
  totalMisses: document.querySelector("#totalMisses"),
  levelLabel: document.querySelector("#levelLabel"),
  ruleCard: document.querySelector("#ruleCard"),
  prevRule: document.querySelector("#prevRule"),
  nextRule: document.querySelector("#nextRule"),
  ruleSelect: document.querySelector("#ruleSelect"),
  ruleSelectPreview: document.querySelector("#ruleSelectPreview"),
  guidedPractice: document.querySelector("#guidedPractice"),
  randomPractice: document.querySelector("#randomPractice"),
  reviewPractice: document.querySelector("#reviewPractice"),
  homophonePractice: document.querySelector("#homophonePractice"),
  adaptiveNote: document.querySelector("#adaptiveNote"),
  reviewNote: document.querySelector("#reviewNote"),
  progressPanel: document.querySelector("#progressPanel"),
  installApp: document.querySelector("#installApp"),
};

let deferredInstallPrompt = null;

init();
setupInstallSupport();

async function init() {
  const [rules, words, homophones] = await Promise.all([
    fetch("data/rules.json?v=review28").then((response) => response.json()),
    fetch("data/words.json?v=review28").then((response) => response.json()),
    fetch("data/homophones.json?v=review28").then((response) => response.json()),
  ]);

  state.rules = rules;
  state.words = words;
  state.homophones = homophones;
  state.optionCount = new Set(words.concat(homophones).map((item) => item.answer)).size;
  ensureRuleStats();
  bindEvents();
  setupTabs();
  renderRuleSelect();
  renderStudy();
  createGuidedSet();
  createRandomSet();
  createReviewSet();
  createHomophoneSet();
  renderStats();
}

function bindEvents() {
  els.backToMenu.addEventListener("click", showCourseMenu);

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  els.prevRule.addEventListener("click", () => {
    state.ruleIndex = (state.ruleIndex - 1 + state.rules.length) % state.rules.length;
    renderStudy();
  });

  els.nextRule.addEventListener("click", () => {
    state.ruleIndex = (state.ruleIndex + 1) % state.rules.length;
    renderStudy();
  });

  els.ruleSelect.addEventListener("change", () => {
    createGuidedSet();
    renderRuleSelectPreview();
  });
  document.querySelector("#checkGuided").addEventListener("click", () => checkSet("guided"));
  document.querySelector("#newGuided").addEventListener("click", createGuidedSet);
  document.querySelector("#nextGuidedRule").addEventListener("click", nextGuidedRule);
  document.querySelector("#checkRandom").addEventListener("click", () => checkSet("random"));
  document.querySelector("#newRandom").addEventListener("click", createRandomSet);
  document.querySelector("#checkReview").addEventListener("click", () => checkSet("review"));
  document.querySelector("#newReview").addEventListener("click", createReviewSet);
  document.querySelector("#checkHomophones").addEventListener("click", () => checkSet("homophones"));
  document.querySelector("#newHomophones").addEventListener("click", createHomophoneSet);
  document.querySelector("#resetSession").addEventListener("click", () => {
    state.stats.sessionHits = 0;
    state.stats.sessionMisses = 0;
    state.stats.beliefs.global = [...UNIFORM_BELIEF];
    state.stats.diagnosticAttempts = 0;
    state.stats.randomHistory = { recentIds: [], seenCounts: {} };
    state.stats.recentMistakes = {};
    saveStats();
    renderStats();
    createRandomSet();
    createReviewSet();
  });
  document.querySelector("#clearProgress").addEventListener("click", () => {
    localStorage.removeItem("ortocat-xtxig-stats");
    state.stats = loadStats();
    ensureRuleStats();
    saveStats();
    renderRuleSelect();
    renderStats();
    createRandomSet();
    createReviewSet();
  });

  els.installApp.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    els.installApp.hidden = true;
  });
}

function showCourseMenu() {
  window.location.href = "../";
}

function setupInstallSupport() {
  const urlParams = new URLSearchParams(window.location.search);
  let shouldAutoInstall = urlParams.has("install");
  if (shouldAutoInstall) {
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    els.installApp.hidden = false;

    if (shouldAutoInstall) {
      shouldAutoInstall = false;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => {
        deferredInstallPrompt = null;
        els.installApp.hidden = true;
      });
    }
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    els.installApp.hidden = true;
  });
}

function switchView(viewName) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === viewName);
  });
  if (viewName === "progress") renderProgress();
  if (viewName === "review") createReviewSet();
}

function renderRuleSelect() {
  const currentValue = els.ruleSelect.value;
  els.ruleSelect.innerHTML = state.rules
    .map((rule) => {
      const status = rulePracticeStatus(rule.id);
      const label = status.label ? `${status.mark} ${plainRuleTitle(rule)}` : plainRuleTitle(rule);
      return `<option class="${status.className}" value="${rule.id}">${escapeHtml(label)}</option>`;
    })
    .join("");
  if (currentValue && state.rules.some((rule) => rule.id === currentValue)) {
    els.ruleSelect.value = currentValue;
  }
  renderRuleSelectPreview();
}

function renderRuleSelectPreview() {
  if (!els.ruleSelectPreview) return;
  const rule = ruleById(els.ruleSelect.value) || state.rules[0];
  els.ruleSelectPreview.innerHTML = rule ? highlightRuleText(rule.title, rule.id, rule.letter) : "";
}

function renderStudy() {
  const rule = state.rules[state.ruleIndex];
  els.ruleCard.innerHTML = `
    <div class="rule-meta">
      <span class="badge">${state.ruleIndex + 1} / ${state.rules.length}</span>
      <span class="badge">S'escriu amb ${plainMetaLetter(rule.letter.toUpperCase())}</span>
    </div>
    <h3>${highlightRuleText(rule.title, rule.id, rule.letter)}</h3>
    <p class="rule-text">${highlightRuleText(rule.summary, rule.id, rule.letter)}</p>
    <div>
      <h3>Exemples</h3>
      <ul class="examples">${rule.examples.map((word) => `<li>${highlightWordByRule(word, rule.id)}</li>`).join("")}</ul>
    </div>
    ${rule.exceptions.length ? `
      <div class="exception-box">
        <strong>Excepcions:</strong> ${rule.exceptions.map(escapeHtml).join(", ")}.
      </div>` : ""}
    <div class="section-actions">
      <button class="primary-button" type="button" data-practice-rule="${rule.id}">Practicar aquesta norma</button>
    </div>
  `;

  els.ruleCard.querySelector("[data-practice-rule]").addEventListener("click", (event) => {
    els.ruleSelect.value = event.currentTarget.dataset.practiceRule;
    createGuidedSet();
    switchView("guided");
  });
}

function formatRuleTitle(title) {
  return formatMetaReferences(escapeHtml(title));
}

function plainMetaLetter(letter) {
  return `«${letter}»`;
}

function plainRuleTitle(rule) {
  return formatMetaReferences(escapeHtml(rule.title)).replace(/<[^>]+>/g, "");
}

function createGuidedSet() {
  const ruleId = els.ruleSelect.value || state.rules[0].id;
  const pool = eligibleGuidedWords(ruleId);
  const previous = state.guidedItems.filter((item) => item.ruleId === ruleId);
  const amount = Math.min(5, Math.max(3, pool.length - previous.length || 5));
  state.guidedItems = nextItemsForRule(ruleId, pool, amount);
  renderPractice(els.guidedPractice, state.guidedItems, "guided");
  renderRuleSelectPreview();
}

function nextGuidedRule() {
  const currentIndex = state.rules.findIndex((rule) => rule.id === els.ruleSelect.value);
  const nextIndex = (currentIndex + 1 + state.rules.length) % state.rules.length;
  els.ruleSelect.value = state.rules[nextIndex].id;
  state.ruleIndex = nextIndex;
  createGuidedSet();
}

function createRandomSet() {
  const level = currentLevel();
  const candidates = randomCandidatesForLevel(level);
  const chosen = [];
  const recentLimit = Math.min(24, Math.max(8, Math.floor(candidates.length * 0.35)));
  const recentIds = new Set((state.stats.randomHistory.recentIds || []).slice(-recentLimit));
  let pool = candidates.filter((item) => !recentIds.has(item.id));

  if (pool.length < Math.min(8, candidates.length)) {
    pool = [...candidates];
  }

  while (chosen.length < 8 && pool.length) {
    pool.sort((a, b) => adaptiveWeight(b, chosen) - adaptiveWeight(a, chosen));
    const tied = pool.slice(0, Math.min(8, pool.length));
    const pick = tied[Math.floor(Math.random() * tied.length)];
    chosen.push(pick);
    pool.splice(pool.findIndex((item) => item.id === pick.id), 1);
  }

  state.randomItems = chosen;
  rememberRandomSelection(chosen);
  const exceptionCount = chosen.filter((item) => item.exception).length;
  els.adaptiveNote.textContent = `La tanda s'ha generat amb nivell estimat ${level.label.toLowerCase()} i confiança ${Math.round(level.confidence * 100)} %. La selecció evita repetir paraules recents, prioritza el guany d'informació i afegeix més excepcions quan puja el nivell. Excepcions en aquesta tanda: ${exceptionCount}.`;
  renderPractice(els.randomPractice, state.randomItems, "random");
}

function createReviewSet() {
  const candidates = reviewCandidates();
  state.reviewItems = sampleWeightedByErrors(candidates, 8);

  if (!state.reviewItems.length) {
    els.reviewNote.textContent = "Encara no hi ha errors desats. Quan fallis alguna paraula, apareixerà aquí per repassar-la.";
    els.reviewPractice.innerHTML = `<article class="empty-state">Completa alguna pràctica i torna a aquesta pestanya per reforçar els errors.</article>`;
    return;
  }

  const totalMistakes = candidates.reduce((sum, item) => sum + (state.stats.errorItems[item.id] || 0), 0);
  els.reviewNote.textContent = `Repàs generat a partir dels teus errors desats. Hi ha ${candidates.length} elements pendents i ${totalMistakes} errors acumulats.`;
  renderPractice(els.reviewPractice, state.reviewItems, "review");
}

function createHomophoneSet() {
  state.homophoneItems = sample(state.homophones, 6);
  renderPractice(els.homophonePractice, state.homophoneItems, "homophones", true);
}

function renderPractice(container, items, mode, isSentence = false) {
  container.innerHTML = items.map((item) => questionTemplate(item, mode, isSentence || Boolean(item.sentence))).join("");
  container.querySelectorAll("[data-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".question-card");
      setAnswer(card.querySelector(".blank"), button.dataset.pick);
      markSelectedChoice(button);
    });
    button.setAttribute("aria-pressed", "false");
  });
}

function questionTemplate(item, mode, isSentence) {
  const prompt = promptForItem(item, isSentence);
  const promptClass = isSentence ? "word-prompt sentence-prompt" : "word-prompt";
  return `
    <article class="question-card" data-mode="${mode}" data-id="${item.id}">
      <div class="${promptClass}">${renderMasked(prompt, item, isSentence)}</div>
      ${!isSentence && item.hint ? `<div class="word-hint">${escapeHtml(item.hint)}</div>` : ""}
      <div class="mini-actions" aria-label="Tria x, ix, tx o ig">
        <button class="pick-button pick-x" type="button" data-pick="x">X</button>
        <button class="pick-button pick-ix" type="button" data-pick="ix">IX</button>
        <button class="pick-button pick-tx" type="button" data-pick="tx">TX</button>
        <button class="pick-button pick-ig" type="button" data-pick="ig">IG</button>
      </div>
      <div class="feedback" aria-live="polite"></div>
    </article>
  `;
}

function promptForItem(item, isSentence = false) {
  if (isSentence) return item.sentence;
  return item.masked;
}

function renderMasked(text, item, isSentence = false) {
  const displayCase = shouldUseUppercase(text, isSentence) ? "upper" : "lower";
  const aria = `casella buida: tria ${displayCase === "upper" ? "X, IX, TX o IG majúscula" : "x, ix, tx o ig minúscula"}`;
  const blank = `<span class="blank" data-answer="" data-case="${displayCase}" aria-label="${aria}"><span class="blank-placeholder" aria-hidden="true">${displayCase === "upper" ? "TX" : "tx"}</span></span>`;

  if (!isSentence) {
    return escapeHtml(text).replace("_", blank);
  }

  return escapeHtml(text).replace(/(\S*_\S*)/, (word) => {
    const parts = word.split("_");
    return `<span class="masked-word">${parts[0]}${blank}${parts.slice(1).join("_")}</span>`;
  });
}

function setAnswer(blank, letter) {
  if (!["x", "ix", "tx", "ig"].includes(letter)) return;
  blank.dataset.answer = letter;
  blank.innerHTML = "";
  blank.textContent = blank.dataset.case === "upper" ? letter.toUpperCase() : letter;
  blank.classList.toggle("is-x", letter === "x");
  blank.classList.toggle("is-ix", letter === "ix");
  blank.classList.toggle("is-tx", letter === "tx");
  blank.classList.toggle("is-ig", letter === "ig");
  blank.classList.remove("is-over");
}

function checkSet(mode) {
  const map = {
    guided: { items: state.guidedItems, selector: "#guidedPractice" },
    random: { items: state.randomItems, selector: "#randomPractice" },
    review: { items: state.reviewItems, selector: "#reviewPractice" },
    homophones: { items: state.homophoneItems, selector: "#homophonePractice" },
  };
  const current = map[mode];

  let checkedCards = 0;
  const cards = document.querySelectorAll(`${current.selector} .question-card`);

  cards.forEach((card) => {
    if (card.dataset.checked === "true") return;
    const item = current.items.find((entry) => entry.id === card.dataset.id);
    const selected = card.querySelector(".blank").dataset.answer;
    const feedback = card.querySelector(".feedback");
    if (!selected) {
      feedback.innerHTML = "<strong>Falta respondre.</strong> Tria X, IX, TX o IG abans de corregir aquesta paraula.";
      return;
    }
    const isCorrect = normalizeAnswer(selected) === normalizeAnswer(item.answer);
    card.dataset.checked = "true";
    card.dataset.correct = String(isCorrect);
    card.querySelectorAll("[data-pick]").forEach((button) => {
      button.disabled = true;
    });
    checkedCards += 1;
    card.classList.toggle("is-correct", isCorrect);
    card.classList.toggle("is-wrong", !isCorrect);
    card.querySelector(".word-prompt").innerHTML = renderSolvedPrompt(item, mode === "homophones" || Boolean(item.sentence), isCorrect ? "" : selected);

    updateAttempt(item, isCorrect, mode);
    feedback.innerHTML = isCorrect
      ? `<strong>Correcte.</strong> ${explainItem(item)}`
      : `<strong>Error.</strong> La resposta correcta és ${displayLetterForItem(item)}: ${explainItem(item)}`;
  });

  saveStats();
  const allChecked = cards.length > 0 && [...cards].every((card) => card.dataset.checked === "true");
  if (mode === "guided" && checkedCards > 0 && allChecked) {
    const ruleId = current.items[0]?.ruleId;
    if (ruleId) {
      const setMisses = [...cards].filter((card) => card.dataset.correct === "false").length;
      state.stats.rulePractice[ruleId] = {
        completed: true,
        misses: setMisses,
        total: cards.length,
        updatedAt: new Date().toISOString(),
      };
      saveStats();
      renderRuleSelect();
    }
  }
  renderStats();
  if (mode === "progress") renderProgress();
}

function isWordInitialBlank(text) {
  const index = text.indexOf("_");
  if (index <= 0) return true;
  return !/\p{L}/u.test(text[index - 1]);
}

function shouldUseUppercase(text, isSentence) {
  const index = text.indexOf("_");
  if (index < 0) return false;
  if (!isSentence) return isWordInitialBlank(text);
  const prefix = text.slice(0, index).replace(/[¿¡"'“”‘’(\[\{]/g, "").trim();
  return prefix.length === 0;
}

function normalizeAnswer(value) {
  return String(value || "").trim().toLocaleLowerCase("ca");
}

function displayChoice(value, item) {
  const prompt = promptForItem(item, Boolean(item.sentence));
  const normalized = normalizeAnswer(value);
  return shouldUseUppercase(prompt, Boolean(item.sentence)) ? normalized.toUpperCase() : normalized;
}

function displayLetterForItem(item) {
  const prompt = promptForItem(item, Boolean(item.sentence));
  return shouldUseUppercase(prompt, Boolean(item.sentence)) ? item.answer.toUpperCase() : item.answer;
}

function renderSolvedPrompt(item, isSentence, selected = "") {
  if (selected) return renderSelectedPrompt(item, isSentence, selected);
  const prompt = promptForItem(item, isSentence);
  const solved = prompt.replace("_", displayLetterForItem(item));
  if (isSentence) {
    return highlightNorm(solved, item.ruleId || "homophones", item.word);
  }
  return highlightNorm(solved, item.ruleId);
}

function renderSelectedPrompt(item, isSentence, selected) {
  const prompt = promptForItem(item, isSentence);
  const letter = `<span class="wrong-choice">${escapeHtml(displayChoice(selected, item))}</span>`;
  if (!isSentence) return escapeHtml(prompt).replace("_", letter);
  return escapeHtml(prompt).replace(/(\S*_\S*)/, (word) => word.replace("_", letter));
}

function formatMetaLetter(letter) {
  return `<strong class="meta-word">«${letter}»</strong>`;
}

function formatMetaReferences(html) {
  return html
    .replace(/davant e i i/gi, () => `davant ${formatMetaLetter("e")} i ${formatMetaLetter("i")}`)
    .replace(/davant e o i/gi, () => `davant ${formatMetaLetter("e")} o ${formatMetaLetter("i")}`)
    .replace(/davant a, o i u/gi, () => `davant ${formatMetaLetter("a")}, ${formatMetaLetter("o")} i ${formatMetaLetter("u")}`)
    .replace(/davant a, o, u/gi, () => `davant ${formatMetaLetter("a")}, ${formatMetaLetter("o")}, ${formatMetaLetter("u")}`)
    .replace(/després de m i de n/gi, () => `després de ${formatMetaLetter("m")} i de ${formatMetaLetter("n")}`)
}

function ruleLetterClass(value) {
  return value
    .toLowerCase()
    .replaceAll("·", "-")
    .replaceAll("ç", "c-trencada")
    .replace(/[^a-z0-9-]/g, "-");
}

function isStudiedGrapheme(value) {
  return ["b", "v", "g", "j", "tg", "tj", "l", "ll", "l·l", "x", "ix", "tx", "ig", "s", "ss", "c", "ç", "z", "sc"].includes(value.toLowerCase());
}

function formatRuleTextMatch(match) {
  if (isStudiedGrapheme(match)) {
    return `<strong class="rule-letter rule-letter-${ruleLetterClass(match)}">${match}</strong>`;
  }
  return `<strong class="norm-chip">${match}</strong>`;
}
function protectMetaWords(html) {
  const protectedWords = [];
  const text = html.replace(/«([^»]+)»/g, (_, word) => {
    const token = `%%${protectedWords.length}%%`;
    protectedWords.push({ token, html: `<strong class="meta-word">«${word}»</strong>` });
    return token;
  });
  return { text, protectedWords };
}

function restoreMetaWords(html, protectedWords) {
  return protectedWords.reduce((current, item) => current.replace(item.token, item.html), html);
}

function highlightRuleText(text, ruleId, letter = "") {
  const meta = protectMetaWords(escapeHtml(text));
  let html = meta.text;
  const exampleHighlights = protectedHtmlHighlights(ruleExampleHighlights(ruleId));
  html = protectExactHtmlMatches(html, exampleHighlights);
  const replacements = {
    "x-inicial": ["x", "xa", "xe", "xi", "xo", "xu"],
    "ix": ["ix", "-aix", "-eix", "-oix"],
    "x-cs-gz": ["x", "taxi", "examen", "exercici"],
    "tx": ["tx", "cotxe", "despatx"],
    "ig-final": ["ig", "maig", "raig", "passeig"],
  };
  const parts = replacements[ruleId] || [];
  if (!parts.length && letter && !letter.includes("/")) {
    const escapedLetter = escapeHtml(letter);
    html = html.replace(
      new RegExp(`(?<![\\p{L}\\p{M}'\u2019&])${escapedLetter}(?![\\p{L}\\p{M}'\u2019&])`, "giu"),
      (match) => `<strong class="rule-letter rule-letter-${ruleLetterClass(match)}">${match}</strong>`
    );
  }
  if (parts.length) {
    const alternatives = parts
      .map((part) => {
        const escaped = escapeRegExp(escapeHtml(part));
        return part.includes("-") || /[^\x00-\x7F]/.test(part) ? escaped : `(?<![\\p{L}\\p{M}'\u2019&])${escaped}(?![\\p{L}\\p{M}'\u2019&])`;
      })
      .sort((a, b) => b.length - a.length);
    html = html.replace(new RegExp(alternatives.join("|"), "giu"), formatRuleTextMatch);
  }
  html = formatMetaReferences(html);
  html = restoreProtectedHtml(html, exampleHighlights);
  return restoreMetaWords(html, meta.protectedWords);
}

function highlightNorm(text, ruleId, targetWord = "") {
  const escaped = escapeHtml(text);
  if (targetWord) {
    return escaped.replace(
      new RegExp(escapeRegExp(escapeHtml(targetWord)), "i"),
      (match) => highlightWordByRule(match, ruleId)
    );
  }

  return escaped.replace(/[\p{L}\p{M}\u00b7]+/gu, (word) => highlightWordByRule(word, ruleId));
}

function protectedHtmlHighlights(highlights) {
  return highlights.map((item, index) => ({ ...item, token: `%%HIGHLIGHT${index}%%` }));
}

function protectExactHtmlMatches(html, highlights) {
  return highlights.reduce((current, item) => {
    const pattern = new RegExp(`(?<![\p{L}\p{M}\u00b7])${escapeRegExp(item.text)}(?![\p{L}\p{M}\u00b7])`, "giu");
    return current.replace(pattern, item.token);
  }, html);
}

function restoreProtectedHtml(html, highlights) {
  return highlights.reduce((current, item) => current.replaceAll(item.token, item.html), html);
}

function itemForWord(word, ruleId = "") {
  const lowerWord = word.toLocaleLowerCase("ca");
  return state.words.find((item) =>
    item.word.toLocaleLowerCase("ca") === lowerWord && (!ruleId || item.ruleId === ruleId)
  ) || state.words.find((item) => item.word.toLocaleLowerCase("ca") === lowerWord);
}

function highlightItemWord(word, item) {
  if (!item?.masked || !item?.answer) return null;
  const answerIndex = item.masked.indexOf("_");
  if (answerIndex < 0) return null;
  const answerLength = item.answer.length;
  const before = escapeHtml(word.slice(0, answerIndex));
  const marked = escapeHtml(word.slice(answerIndex, answerIndex + answerLength));
  const after = escapeHtml(word.slice(answerIndex + answerLength));
  return `<span class="highlighted-word">${before}<span class="norm-highlight rule-letter-${ruleLetterClass(item.answer)}">${marked}</span>${after}</span>`;
}

function highlightWordByRule(word, ruleId) {
  const item = itemForWord(word, ruleId);
  const highlighted = highlightItemWord(word, item);
  if (highlighted) return highlighted;
  return highlightByPattern(word, ruleId);
}

function ruleExampleHighlights(ruleId) {
  const rule = ruleById(ruleId);
  if (!rule) return [];
  return rule.examples.map((word) => ({
    text: escapeHtml(word),
    html: highlightWordByRule(word, ruleId),
  }));
}

function highlightByPattern(text, ruleId) {
  const rules = {
    "x-inicial": /x/gi,
    "ix": /ix/gi,
    "x-cs-gz": /x/gi,
    "tx": /tx/gi,
    "ig-final": /ig$/gi,
    "homophones": /(tx|ix|ig|x)/gi,
  };
  const pattern = rules[ruleId] || Object.values(rules)[0];
  return escapeHtml(text).replace(/[\p{L}\p{M}\u00b7]+/gu, (word) => {
    pattern.lastIndex = 0;
    if (!pattern.test(word)) return word;
    pattern.lastIndex = 0;
    return `<span class="highlighted-word">${word.replace(pattern, (match) => `<span class="norm-highlight rule-letter-${ruleLetterClass(match)}">${match}</span>`)}</span>`;
  });
}

function explainItem(item) {
  if (item.explanation) return highlightNorm(item.explanation, item.ruleId || "homophones", item.word || "");
  const rule = ruleById(item.ruleId);
  const exception = item.exception ? " És una excepció que convé memoritzar." : "";
  return `${highlightRuleText(rule.summary, rule.id, rule.letter)}${escapeHtml(exception)}`;
}

function updateAttempt(item, isCorrect, mode) {
  state.stats.totalHits += isCorrect ? 1 : 0;
  state.stats.totalMisses += isCorrect ? 0 : 1;
  state.stats.sessionHits += isCorrect ? 1 : 0;
  state.stats.sessionMisses += isCorrect ? 0 : 1;

  const statKey = item.ruleId || "homophones";
  if (!state.stats.rules[statKey]) state.stats.rules[statKey] = { alpha: 1, beta: 1, hits: 0, misses: 0, attempts: 0 };
  const ruleStat = state.stats.rules[statKey];
  ruleStat.alpha += isCorrect ? 1 : 0;
  ruleStat.beta += isCorrect ? 0 : 1;
  ruleStat.hits += isCorrect ? 1 : 0;
  ruleStat.misses += isCorrect ? 0 : 1;
  ruleStat.attempts = (ruleStat.attempts || 0) + 1;

  if (!isCorrect) {
    const key = item.word || item.id;
    state.stats.errors[key] = (state.stats.errors[key] || 0) + 1;
    state.stats.errorItems[item.id] = (state.stats.errorItems[item.id] || 0) + 1;
    state.stats.errorRecovery[item.id] = 0;
  } else if (mode === "review" && state.stats.errorItems[item.id]) {
    const streak = (state.stats.errorRecovery[item.id] || 0) + 1;
    state.stats.errorRecovery[item.id] = streak;
    if (streak >= 2) {
      const key = item.word || item.id;
      delete state.stats.errorItems[item.id];
      delete state.stats.errorRecovery[item.id];
      delete state.stats.errors[key];
      delete state.stats.recentMistakes[item.id];
    }
  }

  if (mode === "random" && !isCorrect && item.id) {
    state.stats.recentMistakes[item.id] = (state.stats.recentMistakes[item.id] || 0) + 2;
  }

  if (mode === "random") {
    state.stats.diagnosticAttempts += 1;
    updateBayes("global", item, isCorrect);
    updateBayes(statKey, item, isCorrect);
  } else if (mode === "guided") {
    updateBayes(statKey, item, isCorrect);
  } else if (mode === "homophones") {
    updateBayes("homophones", { ...item, difficulty: item.difficulty || 2 }, isCorrect);
  }
}

function adaptiveWeight(item, alreadyChosen = []) {
  const belief = getBelief(item.ruleId);
  const level = currentLevel();
  const history = state.stats.randomHistory || { recentIds: [], seenCounts: {} };
  const infoGain = expectedInformationGain(belief, item, state.optionCount);
  const repeatedConceptPenalty = alreadyChosen.filter((chosen) => chosen.ruleId === item.ruleId).length * 0.08;
  const mistakeBoost = state.stats.recentMistakes[item.id] || 0;
  const exceptionBoost = item.exception ? exceptionBoostForLevel(level) : 0;
  const seenCount = history.seenCounts[item.id] || 0;
  const recentIndex = history.recentIds.lastIndexOf(item.id);
  const recencyPenalty = recentIndex === -1 ? 0 : ((recentIndex + 1) / Math.max(1, history.recentIds.length)) * 0.45;
  const exposurePenalty = Math.min(seenCount, 8) * 0.07;
  return infoGain + mistakeBoost + exceptionBoost - repeatedConceptPenalty - recencyPenalty - exposurePenalty + Math.random() * 0.16;
}

function currentLevel() {
  return estimatedLevel(getBelief("global"));
}

function renderStats() {
  const level = currentLevel();
  els.totalHits.textContent = state.stats.totalHits;
  els.totalMisses.textContent = state.stats.totalMisses;
  els.levelLabel.textContent = state.stats.diagnosticAttempts ? level.label : "Per determinar";
}

function renderProgress() {
  const globalLevel = currentLevel();
  const rows = state.rules.map((rule) => {
    const stat = state.stats.rules[rule.id] || { alpha: 1, beta: 1, hits: 0, misses: 0 };
    const belief = getBelief(rule.id);
    const mastery = masteryPercent(belief, stat.attempts || stat.hits + stat.misses);
    const confidence = Math.round(Math.max(...belief) * 100);
    return `
      <div class="progress-row">
        <strong>${highlightRuleText(rule.title, rule.id, rule.letter)}</strong>
        <div class="meter" aria-label="Domini ${mastery}%"><span style="width: ${mastery}%"></span></div>
        <span>${stat.hits} ac. / ${stat.misses} err. · ${confidence}% conf.</span>
      </div>
    `;
  }).join("");

  const commonErrors = Object.entries(state.stats.errors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => `<li><strong>${escapeHtml(word)}</strong>: ${count} error${count === 1 ? "" : "es"}</li>`)
    .join("");

  els.progressPanel.innerHTML = `
    <h3>Diagnòstic global</h3>
    <p>Nivell diagnòstic: <strong>${state.stats.diagnosticAttempts ? globalLevel.label : "Encara no estimat"}</strong>. Confiança: <strong>${state.stats.diagnosticAttempts ? `${Math.round(globalLevel.confidence * 100)} %` : "sense evidència"}</strong>. ${state.stats.diagnosticAttempts ? `Incertesa: <strong>${globalLevel.entropy.toFixed(2)}</strong>. ${globalLevel.confidence >= 0.8 ? "El resultat és força estable." : "El resultat encara és provisional: convé completar més pràctica aleatòria."}` : "Completa una tanda de pràctica aleatòria per iniciar el diagnòstic."}</p>
    <h3>Domini per norma</h3>
    ${rows}
    <h3>Errors més freqüents</h3>
    ${commonErrors ? `<ul>${commonErrors}</ul>` : "<p>Encara no hi ha errors registrats.</p>"}
  `;
}

function ensureRuleStats() {
  state.rules.forEach((rule) => {
    if (!state.stats.rules[rule.id]) {
      state.stats.rules[rule.id] = { alpha: 1, beta: 1, hits: 0, misses: 0 };
    }
    if (!state.stats.beliefs[rule.id]) state.stats.beliefs[rule.id] = [1 / 3, 1 / 3, 1 / 3];
  });
  if (!state.stats.rules.homophones) {
    state.stats.rules.homophones = { alpha: 1, beta: 1, hits: 0, misses: 0 };
  }
  if (!state.stats.beliefs.global) state.stats.beliefs.global = [...UNIFORM_BELIEF];
  if (!state.stats.beliefs.homophones) state.stats.beliefs.homophones = [...UNIFORM_BELIEF];
  if (!state.stats.randomHistory) state.stats.randomHistory = { recentIds: [], seenCounts: {} };
  if (!Array.isArray(state.stats.randomHistory.recentIds)) state.stats.randomHistory.recentIds = [];
  if (!state.stats.randomHistory.seenCounts) state.stats.randomHistory.seenCounts = {};
}

function loadStats() {
  const fallback = {
    totalHits: 0,
    totalMisses: 0,
    sessionHits: 0,
    sessionMisses: 0,
    rules: {},
    beliefs: {},
    rulePractice: {},
    errors: {},
    errorItems: {},
    errorRecovery: {},
    recentMistakes: {},
    diagnosticAttempts: 0,
    randomHistory: { recentIds: [], seenCounts: {} },
  };
  try {
    return migrateStats(JSON.parse(localStorage.getItem("ortocat-xtxig-stats")), fallback);
  } catch {
    return fallback;
  }
}

function migrateStats(stored, fallback) {
  return {
    ...fallback,
    ...(stored || {}),
    rules: { ...fallback.rules, ...(stored?.rules || {}) },
    beliefs: { ...fallback.beliefs, ...(stored?.beliefs || {}) },
    rulePractice: { ...fallback.rulePractice, ...(stored?.rulePractice || {}) },
    errors: { ...fallback.errors, ...(stored?.errors || {}) },
    errorItems: { ...fallback.errorItems, ...(stored?.errorItems || {}) },
    errorRecovery: { ...fallback.errorRecovery, ...(stored?.errorRecovery || {}) },
    recentMistakes: { ...fallback.recentMistakes, ...(stored?.recentMistakes || {}) },
    randomHistory: {
      recentIds: stored?.randomHistory?.recentIds || [],
      seenCounts: stored?.randomHistory?.seenCounts || {},
    },
  };
}

function eligibleGuidedWords(ruleId) {
  const level = currentLevel();
  const pool = state.words.filter((word) => word.ruleId === ruleId);
  const ordinary = pool.filter((word) => !word.exception);
  const exceptions = pool.filter((word) => word.exception);
  if (level.label === "Inicial" && ordinary.length >= 5) return ordinary;
  if (level.label === "Intermedi" && ordinary.length >= 5) return ordinary.concat(sample(exceptions, 1));
  return pool;
}

function randomCandidatesForLevel(level) {
  const ordinary = state.words.filter((word) => !word.exception && word.difficulty <= level.maxDifficulty);
  const exceptions = state.words.filter((word) => word.exception);
  const mistakenExceptions = exceptions.filter((word) => state.stats.recentMistakes[word.id] || state.stats.errorItems[word.id]);

  if (level.label === "Inicial") return ordinary.concat(mistakenExceptions);
  if (level.label === "Intermedi") return ordinary.concat(sample(exceptions, 10), mistakenExceptions);
  return ordinary.concat(exceptions);
}

function rememberRandomSelection(items) {
  const history = state.stats.randomHistory;
  const maxRecent = Math.min(60, Math.max(24, state.words.length));
  items.forEach((item) => {
    history.seenCounts[item.id] = (history.seenCounts[item.id] || 0) + 1;
    history.recentIds.push(item.id);
  });
  history.recentIds = history.recentIds.slice(-maxRecent);
  saveStats();
}

function exceptionBoostForLevel(level) {
  if (level.label === "Inicial") return -0.2;
  if (level.label === "Intermedi") return 0.08;
  return 0.28;
}

function reviewCandidates() {
  const allItems = state.words.concat(state.homophones.map((item) => ({ ...item, ruleId: item.ruleId || "homophones" })));
  return allItems
    .filter((item) => state.stats.errorItems[item.id])
    .sort((a, b) => state.stats.errorItems[b.id] - state.stats.errorItems[a.id]);
}

function sampleWeightedByErrors(items, amount) {
  const pool = [...items];
  const chosen = [];
  while (pool.length && chosen.length < amount) {
    pool.sort((a, b) => (state.stats.errorItems[b.id] || 0) - (state.stats.errorItems[a.id] || 0) + Math.random() * 0.2);
    const pickIndex = Math.floor(Math.random() * Math.min(3, pool.length));
    chosen.push(pool.splice(pickIndex, 1)[0]);
  }
  return chosen;
}

function nextItemsForRule(ruleId, pool, amount) {
  if (!state.guidedSeen[ruleId]) state.guidedSeen[ruleId] = [];
  const currentIds = new Set(state.guidedItems.filter((item) => item.ruleId === ruleId).map((item) => item.id));
  let unseen = pool.filter((word) => !state.guidedSeen[ruleId].includes(word.id) && !currentIds.has(word.id));
  const targetAmount = Math.min(amount, pool.length);

  if (unseen.length < targetAmount) {
    state.guidedSeen[ruleId] = [];
    unseen = pool.filter((word) => !currentIds.has(word.id));
  }

  let chosen = sample(unseen, targetAmount);
  if (chosen.length < targetAmount) {
    const chosenIds = new Set(chosen.map((word) => word.id));
    chosen = chosen.concat(sample(pool.filter((word) => !chosenIds.has(word.id) && !currentIds.has(word.id)), targetAmount - chosen.length));
  }
  if (chosen.length < targetAmount) {
    const chosenIds = new Set(chosen.map((word) => word.id));
    chosen = chosen.concat(sample(pool.filter((word) => !chosenIds.has(word.id)), targetAmount - chosen.length));
  }

  state.guidedSeen[ruleId].push(...chosen.map((word) => word.id));
  return chosen;
}

function rulePracticeStatus(ruleId) {
  const result = state.stats.rulePractice[ruleId];
  if (!result?.completed) return { className: "", label: "", mark: "" };
  if (result.misses === 0) return { className: "rule-ok", label: "sense errors", mark: "✓" };
  if (result.misses <= 2) return { className: "rule-mid", label: "1-2 errors", mark: "●" };
  return { className: "rule-low", label: "més de 2 errors", mark: "▲" };
}

function getBelief(key) {
  return normalizeBelief(state.stats.beliefs[key]);
}

function updateBayes(key, item, isCorrect) {
  const prior = getBelief(key);
  const posterior = posteriorFor(prior, item, isCorrect, state.optionCount);
  state.stats.beliefs[key] = posterior;
}

function saveStats() {
  localStorage.setItem("ortocat-xtxig-stats", JSON.stringify(state.stats));
}

function ruleById(ruleId) {
  return state.rules.find((rule) => rule.id === ruleId);
}

function sample(items, amount) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, amount);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
