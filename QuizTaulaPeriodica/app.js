import { ELEMENTS } from "./elementsData.js";
import { GOOGLE_SCRIPT_URL } from "./config.js";

const SYMBOL_CATALOG = new Set(ELEMENTS.map((element) => element.symbol));

const BASE_POOLS = {
  starter: [
    "H",
    "He",
    "Li",
    "Be",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
    "Na",
    "Mg",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar",
    "K",
    "Ca",
  ],
  core: [
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr",
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe",
  ],
  advanced: [
    "Cs",
    "Ba",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn",
  ],
  rare: [
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fl",
    "Mc",
    "Lv",
    "Ts",
    "Og",
  ],
};

const sanitizePool = (symbols) => [
  ...new Set(symbols.filter((symbol) => SYMBOL_CATALOG.has(symbol))),
];

const DIFFICULTY_CONFIG = {
  "very-easy": {
    label: "Molt fàcil",
    timeLimit: 20,
    symbols: sanitizePool([...BASE_POOLS.starter]),
  },
  easy: {
    label: "Fàcil",
    timeLimit: 17,
    symbols: sanitizePool([
      ...BASE_POOLS.starter,
      ...BASE_POOLS.core.slice(0, 16),
    ]),
  },
  normal: {
    label: "Normal",
    timeLimit: 14,
    symbols: sanitizePool([
      ...BASE_POOLS.starter,
      ...BASE_POOLS.core,
      ...BASE_POOLS.advanced.slice(0, 10),
    ]),
  },
  hard: {
    label: "Difícil",
    timeLimit: 11,
    symbols: sanitizePool([
      ...BASE_POOLS.starter,
      ...BASE_POOLS.core,
      ...BASE_POOLS.advanced,
    ]),
  },
  "very-hard": {
    label: "Molt difícil",
    timeLimit: 9,
    symbols: sanitizePool([
      ...BASE_POOLS.starter,
      ...BASE_POOLS.core,
      ...BASE_POOLS.advanced,
      ...BASE_POOLS.rare,
    ]),
  },
};

const POSITIVE_FEEDBACK = [
  "Fantàstic!",
  "Genial!",
  "Ho has clavat!",
  "Molt bé!",
  "Ets imparable!",
  "Brillant!",
  "Excel·lent!",
  "Segueix així!",
  "Espectacular!",
  "Triomf total!",
];

const NEGATIVE_FEEDBACK = [
  "Ui, aquest no era. Concentra't!",
  "No passa res, torna-hi!",
  "Gira pàgina i continua!",
  "A prop! Reforcem la memòria!",
  "Som-hi, que tu pots!",
];

const TIMEOUT_FEEDBACK = [
  "S'ha esgotat el temps!",
  "Ves per feina!",
  "Se t'ha escapat el rellotge!",
  "El temps vola!",
];

const streakTrack = document.getElementById("streak-track");
const feedbackCard = document.getElementById("feedback-card");
const feedbackMessage = document.getElementById("feedback-message");
const periodicTable = document.getElementById("periodic-table");
const tableOverlay = document.getElementById("table-overlay");
const spotlight = document.getElementById("spotlight");
const targetElementNameEl = document.getElementById("target-element-name");
const statusCard = document.getElementById("status-card");
const streakCard = document.getElementById("streak-card");
const statusPlayer = document.getElementById("status-player");
const statusLevel = document.getElementById("status-level");
const statusTimer = document.getElementById("status-timer");
const statusStreak = document.getElementById("status-streak");
const statusTotal = document.getElementById("status-total");
const startForm = document.getElementById("start-form");
const playerNameInput = document.getElementById("player-name");
const difficultyInput = document.getElementById("difficulty");
const difficultyButtons = document.getElementById("difficulty-buttons");
const startBtn = document.getElementById("start-btn");
const resultModal = document.getElementById("result-modal");
const closeModalBtn = document.getElementById("close-modal");
const sendResultsBtn = document.getElementById("send-results");
const submissionStatus = document.getElementById("submission-status");
const modalText = document.getElementById("modal-text");

const elementTemplate = document.getElementById("element-template");
const elementButtons = new Map();

const storedPlayerName = localStorage.getItem("playerName");
if (storedPlayerName) {
  playerNameInput.value = storedPlayerName;
}

const state = {
  playerName: "",
  difficultyKey: "",
  poolSymbols: [],
  currentElement: null,
  streak: 0,
  timerId: null,
  questionDeadline: null,
  isActive: false,
  lastSymbol: null,
  nextQuestionTimeout: null,
  hasWon: false,
  currentPool: [],
  totalTimerId: null,
  totalStartMs: null,
  totalElapsedMs: 0,
};

tableOverlay.style.display = "flex";
spotlight.hidden = true;
feedbackCard.hidden = true;
statusCard.hidden = true;
streakCard.hidden = true;

buildPeriodicTable();
prepareStreakTrack();
attachEventListeners();

function buildPeriodicTable() {
  const fragment = document.createDocumentFragment();

  ELEMENTS.forEach((element) => {
    const cell = elementTemplate.content.firstElementChild.cloneNode(true);
    cell.dataset.symbol = element.symbol;
    cell.dataset.atomicNumber = String(element.atomicNumber);
    cell.style.gridColumnStart = String(element.group);
    cell.style.gridRowStart = String(element.period);

    cell.querySelector(".atomic-number").textContent = element.atomicNumber;
    cell.querySelector(".symbol").textContent = element.symbol;
    cell.querySelector(".name").textContent = element.name;

    const categoryClass = categoryToClass(element.category);
    if (categoryClass) {
      cell.classList.add(categoryClass);
    }

    fragment.appendChild(cell);
    elementButtons.set(element.symbol, cell);
  });

  periodicTable.appendChild(fragment);
}

function categoryToClass(rawCategory) {
  if (!rawCategory) return "category-unknown";
  const slug = rawCategory
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug ? `category-${slug}` : "category-unknown";
}

function prepareStreakTrack() {
  streakTrack.innerHTML = "";
  for (let index = 0; index < 10; index += 1) {
    const slot = document.createElement("div");
    slot.textContent = index + 1;
    streakTrack.appendChild(slot);
  }
}

function attachEventListeners() {
  startForm.addEventListener("submit", handleStartGame);
  periodicTable.addEventListener("click", handleElementClick);
  closeModalBtn.addEventListener("click", () => toggleModal(false));
  document.getElementById("close-modal-2").addEventListener("click", () => {
    // Descarta l'enviament i torna a l'inici
    resetToStart();
    toggleModal(false);
  });
  resultModal.addEventListener("click", (event) => {
    if (event.target === resultModal) {
      toggleModal(false);
    }
  });
  sendResultsBtn.addEventListener("click", handleSendResults);
  difficultyButtons.addEventListener("click", handleDifficultyButtonClick);
}

function handleDifficultyButtonClick(event) {
  const button = event.target.closest(".difficulty-btn");
  if (!button) return;

  const difficultyKey = button.dataset.difficulty;
  difficultyInput.value = difficultyKey;

  const buttons = difficultyButtons.querySelectorAll(".difficulty-btn");
  buttons.forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");

  handleDifficultyChange();
}

function handleDifficultyChange() {
  const difficultyKey = difficultyInput.value;
  if (!difficultyKey) {
    elementButtons.forEach((btn) => {
      btn.classList.remove("out-of-pool");
    });
    tableOverlay.style.display = "flex";
    return;
  }

  tableOverlay.style.display = "none";
  const config = DIFFICULTY_CONFIG[difficultyKey];
  const poolSymbols = new Set(config.symbols);

  elementButtons.forEach((btn, symbol) => {
    if (poolSymbols.has(symbol)) {
      btn.classList.remove("out-of-pool");
    } else {
      btn.classList.add("out-of-pool");
    }
  });
}

function handleStartGame(event) {
  event.preventDefault();
  const playerName = playerNameInput.value.trim();
  const difficultyKey = difficultyInput.value;

  if (!playerName || !difficultyKey) {
    feedbackCard.hidden = false;
    feedbackCard.classList.remove("positive", "negative");
    feedbackCard.classList.add("neutral");
    feedbackMessage.textContent = "Cal indicar el nom i el nivell abans de començar.";
    return;
  }

  const config = DIFFICULTY_CONFIG[difficultyKey];

  state.playerName = playerName;
  localStorage.setItem("playerName", playerName);
  state.difficultyKey = difficultyKey;
  state.poolSymbols = [...config.symbols];
  state.currentPool = [...state.poolSymbols];
  state.streak = 0;
  state.lastSymbol = null;
  state.hasWon = false;

  elementButtons.forEach((btn) =>
    btn.classList.remove("target", "correct", "incorrect")
  );

  updateStatusPanel();
  prepareStreakTrack();
  updateStreakVisual();
  setFeedback("Endavant, tria l'element correcte!", "neutral");

  statusCard.hidden = false;
  streakCard.hidden = false;
  feedbackCard.hidden = false;
  spotlight.hidden = false;
  tableOverlay.style.display = "none";

  startBtn.textContent = "Reinicia el repte";

  state.isActive = true;

  clearTimers();
  stopTotalTimer();
  startTotalTimer();
  scheduleNextQuestion(120);
}

function scheduleNextQuestion(delay = 1000) {
  clearTimeout(state.nextQuestionTimeout);
  state.nextQuestionTimeout = setTimeout(() => {
    if (!state.isActive) return;
    loadNextQuestion();
  }, delay);
}

function loadNextQuestion() {
  if (state.currentPool.length === 0) {
    state.currentPool = [...state.poolSymbols];
  }

  const randomIndex = Math.floor(Math.random() * state.currentPool.length);
  const nextSymbol = state.currentPool.splice(randomIndex, 1)[0];

  const nextElement = ELEMENTS.find((element) => element.symbol === nextSymbol);

  state.currentElement = nextElement;

  highlightCurrentTarget();

  targetElementNameEl.textContent = nextElement.name;
  updateTimerDisplay(DIFFICULTY_CONFIG[state.difficultyKey].timeLimit * 1000);
  startQuestionTimer(DIFFICULTY_CONFIG[state.difficultyKey].timeLimit);
}

function handleElementClick(event) {
  const button = event.target.closest(".element-cell");
  if (!button || !state.isActive || !state.currentElement) {
    return;
  }

  const selectedSymbol = button.dataset.symbol;
  processAnswer(selectedSymbol, button);
}

function processAnswer(selectedSymbol, button) {
  clearTimers();

  const isCorrect = selectedSymbol === state.currentElement.symbol;

  if (isCorrect) {
    flashButton(button, "correct");
    state.streak += 1;
    updateStreakVisual();
    setFeedback(randomFromArray(POSITIVE_FEEDBACK), "positive");

    if (state.streak >= 10) {
      handleVictory();
      return;
    }

    scheduleNextQuestion(900);
  } else {
    flashButton(button, "incorrect");
    flashCorrectElement();
    state.streak = 0;
    state.currentPool = [...state.poolSymbols];
    updateStreakVisual();
    setFeedback(randomFromArray(NEGATIVE_FEEDBACK), "negative");
    scheduleNextQuestion(1300);
  }
}

function flashButton(button, mode) {
  button.classList.remove("correct", "incorrect");
  button.classList.add(mode);
  setTimeout(() => {
    button.classList.remove(mode);
  }, 750);
}

function flashCorrectElement() {
  const targetButton = elementButtons.get(state.currentElement.symbol);
  if (!targetButton) return;
}

function highlightCurrentTarget() {
  elementButtons.forEach((btn) => btn.classList.remove("target"));
}

function randomFromArray(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateStreakVisual() {
  const slots = [...streakTrack.children];
  slots.forEach((slot, index) => {
    const isFilled = index < state.streak;
    slot.classList.toggle("filled", isFilled);
    if (isFilled) {
      slot.dataset.streakLevel = index + 1;
    } else {
      delete slot.dataset.streakLevel;
    }
  });
}

function setFeedback(message, tone = "neutral") {
  feedbackCard.hidden = false;
  feedbackCard.classList.remove("positive", "negative", "neutral");
  feedbackCard.classList.add(tone);
  feedbackMessage.textContent = message;
}

function updateStatusPanel() {
  const config = DIFFICULTY_CONFIG[state.difficultyKey];
  statusPlayer.textContent = state.playerName;
  statusLevel.textContent = config.label;
  if (statusTotal) statusTotal.textContent = "00:00";
  updateTimerDisplay(config.timeLimit * 1000);
}

function startQuestionTimer(seconds) {
  state.questionDeadline = Date.now() + seconds * 1000;
  updateTimerDisplay(seconds * 1000);
  state.timerId = setInterval(() => {
    const remaining = state.questionDeadline - Date.now();
    if (remaining <= 0) {
      clearTimers();
      handleTimeout();
    } else {
      updateTimerDisplay(remaining);
    }
  }, 100);
}

function updateTimerDisplay(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  statusTimer.textContent = `${minutes}:${seconds}`;
}

function handleTimeout() {
  if (!state.isActive) return;
  state.streak = 0;
  updateStreakVisual();
  setFeedback(randomFromArray(TIMEOUT_FEEDBACK), "negative");
  flashCorrectElement();
  scheduleNextQuestion(1300);
}

function handleVictory() {
  state.isActive = false;
  state.hasWon = true;
  clearTimers();
  stopTotalTimer();
  elementButtons.forEach((btn) => btn.classList.remove("target"));
  setFeedback("Partida completada!", "positive");
  statusTimer.textContent = "00:00";
  submissionStatus.textContent = "";
  submissionStatus.classList.remove("success", "error");
  sendResultsBtn.disabled = false;

  const allowSend = ["normal", "hard", "very-hard"].includes(state.difficultyKey);
  if (allowSend) {
    if (modalText) {
      modalText.textContent = "Has completat el repte amb 10 encerts seguits. Vols enviar el teu resultat?";
    }
    sendResultsBtn.hidden = false;
    const discardBtn = document.getElementById("close-modal-2");
    if (discardBtn) discardBtn.textContent = "No, gr�cies";
  } else {
    if (modalText) {
      modalText.textContent = "Has completat el repte amb 10 encerts seguits.";
    }
    sendResultsBtn.hidden = true;
    const discardBtn = document.getElementById("close-modal-2");
    if (discardBtn) discardBtn.textContent = "Torna a l'inici";
  }

  toggleModal(true);
}

function toggleModal(show) {
  resultModal.hidden = !show;
}

// --- ENVIAMENT DE RESULTATS (CORS, request robusta) ---
function handleSendResults() {
  if (!state.hasWon) return;

  if (!GOOGLE_SCRIPT_URL) {
    submissionStatus.textContent =
      "Configura la URL de Google Apps Script al fitxer config.js.";
    submissionStatus.classList.remove("success");
    submissionStatus.classList.add("error");
    return;
  }

  sendResultsBtn.disabled = true;
  submissionStatus.textContent = "Enviant resultats...";
  submissionStatus.classList.remove("success", "error");

  // Canviem a FormData per evitar problemes de CORS
  const formData = new FormData();
  formData.append('nom', state.playerName);
  formData.append('puntuacio', state.streak);
  formData.append('nivell', DIFFICULTY_CONFIG[state.difficultyKey].label);
  formData.append('temps', formatMMSS(state.totalElapsedMs || 0));

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // Tornem a no-cors, que amb FormData és més fiable
    body: formData,
  })
    .then(() => {
      // Amb no-cors, no podem confirmar, però mostrem un missatge optimista
      submissionStatus.textContent = "Resultats enviats correctament.";
      submissionStatus.classList.remove("error");
      submissionStatus.classList.add("success");
      setTimeout(() => {
        resetToStart();
        toggleModal(false);
      }, 1200);
    })
    .catch((error) => {
      submissionStatus.textContent = `No s'ha pogut enviar: ${error?.message || error}`;
      submissionStatus.classList.remove("success");
      submissionStatus.classList.add("error");
      sendResultsBtn.disabled = false;
    });
}

function clearTimers() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  if (state.nextQuestionTimeout) {
    clearTimeout(state.nextQuestionTimeout);
    state.nextQuestionTimeout = null;
  }
}

window.addEventListener("beforeunload", clearTimers);

// --- Tornar a l'inici per rejugar ---
function resetToStart() {
  stopTotalTimer();
  state.playerName = playerNameInput.value.trim();
  state.difficultyKey = "";
  state.poolSymbols = [];
  state.currentElement = null;
  state.streak = 0;
  state.timerId = null;
  state.questionDeadline = null;
  state.isActive = false;
  state.lastSymbol = null;
  state.nextQuestionTimeout = null;
  state.hasWon = false;
  state.currentPool = [];

  // UI
  statusCard.hidden = true;
  streakCard.hidden = true;
  feedbackCard.hidden = true;
  spotlight.hidden = true;
  tableOverlay.style.display = "flex";
  statusTimer.textContent = "00:00";
  if (statusTotal) statusTotal.textContent = "00:00";
  startBtn.textContent = "Comenca el repte";

  // Neteja seleccio del nivell
  difficultyInput.value = "";
  const buttons = difficultyButtons.querySelectorAll(".difficulty-btn");
  buttons.forEach((btn) => btn.classList.remove("selected"));

  // Rehabilita taula
  elementButtons.forEach((btn) =>
    btn.classList.remove("target", "correct", "incorrect", "out-of-pool")
  );

  // Reinicia ratxa visual
  prepareStreakTrack();
}

// --- Cron�metre total ---
function startTotalTimer() {
  state.totalStartMs = Date.now();
  state.totalElapsedMs = 0;
  updateTotalTimerDisplay(0);
  stopTotalTimer();
  state.totalTimerId = setInterval(() => {
    const elapsed = Date.now() - state.totalStartMs;
    state.totalElapsedMs = elapsed;
    updateTotalTimerDisplay(elapsed);
  }, 100);
}

function stopTotalTimer() {
  if (state.totalTimerId) {
    clearInterval(state.totalTimerId);
    state.totalTimerId = null;
  }
}

function updateTotalTimerDisplay(ms) {
  if (statusTotal) {
    statusTotal.textContent = formatMMSS(ms);
  }
}

function formatMMSS(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

