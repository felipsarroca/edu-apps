import { ELEMENTS } from "./elementsData.js";
import { GOOGLE_SCRIPT_URL, LEADERBOARD_SHEET_ID, LEADERBOARD_SHEET_GID } from "./config.js";

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

const LEADERBOARD_DISPLAY_LEVELS = [
  { key: "normal", label: "Normal", className: "level-normal", icon: "🌟" },
  { key: "dificil", label: "Difícil", className: "level-dificil", icon: "🔥" },
  { key: "moltdificil", label: "Molt difícil", className: "level-moltdificil", icon: "🚀" },
];
const LEADERBOARD_CACHE_MS = 60_000;
const LEADERBOARD_DATE_FORMAT = new Intl.DateTimeFormat("ca-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const LEADERBOARD_FEED_URL = (() => {
  if (!LEADERBOARD_SHEET_ID) return null;
  const gid = (typeof LEADERBOARD_SHEET_GID === "string" && LEADERBOARD_SHEET_GID.trim()) ? LEADERBOARD_SHEET_GID.trim() : "0";
  return `https://docs.google.com/spreadsheets/d/${LEADERBOARD_SHEET_ID}/gviz/tq?gid=${gid}`;
})();

const sanitizePool = (symbols) => [
  ...new Set(symbols.filter((symbol) => SYMBOL_CATALOG.has(symbol))),
];

const leaderboardJsonpQueue = [];
let gvizSetResponseHooked = false;
let previousGvizSetResponse = null;

function ensureGvizSetResponseHook() {
  if (gvizSetResponseHooked) return;
  gvizSetResponseHooked = true;
  const googleNs = (window.google = window.google || {});
  const visualization = (googleNs.visualization = googleNs.visualization || {});
  const Query = (visualization.Query = visualization.Query || {});
  previousGvizSetResponse = Query.setResponse;
  Query.setResponse = function patchedSetResponse(response) {
    if (leaderboardJsonpQueue.length) {
      const pending = leaderboardJsonpQueue.shift();
      try {
        const entries = extractLeaderboardEntries(response);
        pending.resolve(entries);
      } catch (error) {
        pending.reject(error);
      }
      return;
    }
    if (typeof previousGvizSetResponse === 'function') {
      previousGvizSetResponse(response);
    }
  };
}

async function fetchLeaderboardEntries() {
  if (GOOGLE_SCRIPT_URL) {
    try {
      const url = new URL(GOOGLE_SCRIPT_URL);
      url.searchParams.set('action', 'leaderboard');
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        const payload = await response.json();
        if (Array.isArray(payload?.entries)) {
          return payload.entries;
        }
      }
    } catch (error) {
      console.warn("No s'ha pogut obtenir el rànquing via Apps Script", error);
    }
  }
  return fetchLeaderboardEntriesJsonp();
}

function fetchLeaderboardEntriesJsonp() {
  return new Promise((resolve, reject) => {
    if (!LEADERBOARD_FEED_URL) {
      reject(new Error("No hi ha cap graella configurada per al rànquing."));
      return;
    }

    ensureGvizSetResponseHook();

    const separator = LEADERBOARD_FEED_URL.includes('?') ? '&' : '?';
    const src = `${LEADERBOARD_FEED_URL}${separator}tqx=out:json`;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    let timeoutId;
    let request;
    const cleanup = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      script.remove();
      const index = leaderboardJsonpQueue.indexOf(request);
      if (index !== -1) {
        leaderboardJsonpQueue.splice(index, 1);
      }
    };

    request = {
      resolve: (entries) => {
        cleanup();
        resolve(entries);
      },
      reject: (error) => {
        cleanup();
        reject(error);
      },
      cleanup,
    };

    timeoutId = window.setTimeout(() => {
      request.reject(new Error("La resposta del rànquing ha trigat massa."));
    }, 8000);

    script.onerror = () => {
      request.reject(new Error("No s'ha pogut carregar el rànquing des de Google Sheets."));
    };

    leaderboardJsonpQueue.push(request);
    document.body.appendChild(script);
  });
}

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
const leaderboardModal = document.getElementById("leaderboard-modal");
const openLeaderboardBtn = document.getElementById("open-leaderboard");
const closeLeaderboardBtn = document.getElementById("close-leaderboard");
const leaderboardGrid = document.getElementById("leaderboard-grid");
const leaderboardEmpty = document.getElementById("leaderboard-empty");
const refreshLeaderboardBtn = document.getElementById("refresh-leaderboard");
const refreshLeaderboardDefaultLabel = refreshLeaderboardBtn ? refreshLeaderboardBtn.textContent.trim() : "";
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
const instructionsModal = document.getElementById("instructions-modal");
const openInstructionsBtn = document.getElementById("open-instructions");
const closeInstructionsBtn = document.getElementById("close-instructions");
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
  leaderboard: {
    entries: [],
    lastFetched: null,
  },
  answeredCorrectly: [],
};

tableOverlay.style.display = "flex";
spotlight.hidden = true;
feedbackCard.hidden = true;
statusCard.hidden = true;
streakCard.hidden = true;

buildPeriodicTable();
prepareStreakTrack();
attachEventListeners();
loadLeaderboard({ silent: true });

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
  if (openInstructionsBtn) {
    openInstructionsBtn.addEventListener("click", () => {
      toggleInstructions(true);
    });
  }
  if (closeInstructionsBtn) {
    closeInstructionsBtn.addEventListener("click", () => toggleInstructions(false));
  }
  if (instructionsModal) {
    instructionsModal.addEventListener("click", (event) => {
      if (event.target === instructionsModal) {
        toggleInstructions(false);
      }
    });
  }
  if (openLeaderboardBtn) {
    openLeaderboardBtn.addEventListener("click", () => {
      toggleLeaderboard(true);
      void loadLeaderboard({ silent: false });
    });
  }
  if (closeLeaderboardBtn) {
    closeLeaderboardBtn.addEventListener("click", () => toggleLeaderboard(false));
  }
  if (leaderboardModal) {
    leaderboardModal.addEventListener("click", (event) => {
      if (event.target === leaderboardModal) {
        toggleLeaderboard(false);
      }
    });
  }
  if (refreshLeaderboardBtn) {
    refreshLeaderboardBtn.addEventListener("click", () => {
      void loadLeaderboard({ force: true });
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!resultModal.hidden) toggleModal(false);
      if (instructionsModal && !instructionsModal.hidden) {
        toggleInstructions(false);
      }
      if (leaderboardModal && !leaderboardModal.hidden) {
        toggleLeaderboard(false);
      }
    }
  });
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
  state.answeredCorrectly = [];
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
  if (state.answeredCorrectly.includes(selectedSymbol)) {
    return; // Ja s'ha respost correctament, ignora clics posteriors
  }
  clearTimers();

  const isCorrect = selectedSymbol === state.currentElement.symbol;

  if (isCorrect) {
    state.answeredCorrectly.push(selectedSymbol); // Registra l'encert
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
    if (discardBtn) discardBtn.textContent = "No, gràcies";
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

function toggleInstructions(show) {
  if (!instructionsModal) return;
  instructionsModal.hidden = !show;
  if (show) {
    if (closeInstructionsBtn) {
      closeInstructionsBtn.focus();
    }
  } else if (openInstructionsBtn) {
    openInstructionsBtn.focus();
  }
}

function toggleLeaderboard(show) {
  if (!leaderboardModal) return;
  leaderboardModal.hidden = !show;
  if (show) {
    if (closeLeaderboardBtn) {
      closeLeaderboardBtn.focus();
    }
  } else if (openLeaderboardBtn) {
    openLeaderboardBtn.focus();
  }
}

async function loadLeaderboard({ silent = false, force = false } = {}) {
  if (!leaderboardGrid) return;

  const hasSheetSource = Boolean(LEADERBOARD_FEED_URL);
  const hasScriptSource = Boolean(GOOGLE_SCRIPT_URL);
  if (!hasSheetSource && !hasScriptSource) {
    renderLeaderboard([]);
    if (leaderboardEmpty) {
      leaderboardEmpty.hidden = false;
      leaderboardEmpty.textContent = "Configura la graella de rànquing al fitxer config.js.";
    }
    if (refreshLeaderboardBtn) {
      refreshLeaderboardBtn.disabled = true;
      refreshLeaderboardBtn.textContent = refreshLeaderboardDefaultLabel || "Actualitza";
      refreshLeaderboardBtn.removeAttribute('aria-busy');
    }
    return;
  }

  const now = Date.now();
  if (!force && state.leaderboard.entries.length && state.leaderboard.lastFetched && now - state.leaderboard.lastFetched < LEADERBOARD_CACHE_MS) {
    renderLeaderboard(state.leaderboard.entries);
    return;
  }

  if (refreshLeaderboardBtn) {
    refreshLeaderboardBtn.disabled = true;
    refreshLeaderboardBtn.textContent = "Actualitzant...";
    refreshLeaderboardBtn.setAttribute('aria-busy', 'true');
  }

  if (!silent) {
    leaderboardGrid.innerHTML = "";
    if (leaderboardEmpty) {
      leaderboardEmpty.hidden = false;
      leaderboardEmpty.textContent = "Carregant rànquing...";
    }
  }
  leaderboardGrid.setAttribute('aria-busy', 'true');

  try {
    const entries = await fetchLeaderboardEntries();

    state.leaderboard.entries = entries;
    state.leaderboard.lastFetched = now;

    renderLeaderboard(entries);
  } catch (error) {
    console.error("Error carregant el rànquing", error);
    renderLeaderboard([]);
    if (leaderboardEmpty) {
      leaderboardEmpty.hidden = false;
      leaderboardEmpty.textContent = `No s'ha pogut carregar el rànquing (${error?.message || error}).`;
    }
  } finally {
    leaderboardGrid.removeAttribute('aria-busy');
    if (refreshLeaderboardBtn) {
      refreshLeaderboardBtn.disabled = false;
      refreshLeaderboardBtn.textContent = refreshLeaderboardDefaultLabel || "Actualitza";
      refreshLeaderboardBtn.removeAttribute('aria-busy');
    }
  }
}

function extractLeaderboardEntries(rawInput) {
  let payload;
  if (typeof rawInput === "string") {
    if (!rawInput.trim()) {
      return [];
    }
    const match = rawInput.match(/google\.visualization\.Query.setResponse\((.*)\);?/s);
    if (!match) {
      throw new Error('Format inesperat de la resposta de Google Sheets.');
    }
    payload = JSON.parse(match[1]);
  } else if (rawInput && typeof rawInput === "object") {
    payload = rawInput;
  } else {
    return [];
  }

  const rows = payload?.table?.rows ?? [];
  return rows
    .map((row) => row?.c ?? [])
    .map((cells) => ({
      dataISO: parseGvizDateCell(cells[0]),
      nom: getCellString(cells[1]),
      puntuacio: getCellNumber(cells[2]),
      nivell: getCellString(cells[3]),
      temps: getCellString(cells[4]),
    }))
    .filter((entry) => entry.nom || entry.nivell || entry.temps);
}

function getCellString(cell) {
  if (!cell) return '';
  if (typeof cell.f === 'string' && cell.f.trim()) return cell.f.trim();
  const value = cell.v;
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return String(value ?? '');
}

function getCellNumber(cell) {
  const str = getCellString(cell);
  const parsed = Number(str.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseGvizDateCell(cell) {
  if (!cell) return null;
  const raw = cell.v ?? cell.f;
  if (raw == null) return null;
  if (typeof raw === 'string') {
    if (raw.startsWith('Date(') && raw.endsWith(')')) {
      const parts = raw.slice(5, -1).split(',').map((part) => Number.parseInt(part.trim(), 10));
      if (parts.length >= 3 && parts.every((num) => Number.isFinite(num))) {
        return new Date(parts[0], parts[1], parts[2], parts[3] || 0, parts[4] || 0, parts[5] || 0).toISOString();
      }
    }
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
    return raw;
  }
  if (typeof raw === 'object' && raw !== null && Number.isFinite(raw.year)) {
    return new Date(raw.year, raw.month ?? 0, raw.day ?? 1, raw.hour ?? 0, raw.minute ?? 0, raw.second ?? 0).toISOString();
  }
  return null;
}

function normalizeLevelKey(value) {
  if (!value) return '';
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function renderLeaderboard(entries) {
  if (!leaderboardGrid) return;

  leaderboardGrid.innerHTML = "";
  if (leaderboardEmpty) {
    leaderboardEmpty.hidden = true;
    leaderboardEmpty.textContent = "";
  }

  let totalRendered = 0;
  const knownLevels = new Set(LEADERBOARD_DISPLAY_LEVELS.map((level) => level.key));
  const normalizedEntries = Array.isArray(entries)
    ? entries
        .map((entry) => {
          const levelLabel = (entry.level ?? entry.nivell ?? entry.label ?? '').trim();
          const levelKey = normalizeLevelKey(levelLabel);
          const name = (entry.name ?? entry.nom ?? '').trim() || 'Anònim';
          let score = Number(entry.score ?? entry.puntuacio ?? entry.punts ?? 0);
          if (!Number.isFinite(score)) score = 0;
          const timeRaw = (entry.time ?? entry.temps ?? '').trim();
          const time = timeRaw || '--:--';
          const timeMs = parseLeaderboardTime(time);
          const dateValue = entry.dataISO ?? entry.dateISO ?? entry.dataIso ?? entry.data ?? entry.date ?? null;
          const parsedDateMs = dateValue ? Date.parse(dateValue) : Number.POSITIVE_INFINITY;
          const dateMs = Number.isNaN(parsedDateMs) ? Number.POSITIVE_INFINITY : parsedDateMs;

          return {
            name,
            score,
            levelKey,
            time,
            timeMs,
            dateText: formatLeaderboardDate(dateValue),
            dateMs,
          };
        })
        .filter((entry) => knownLevels.has(entry.levelKey))
    : [];

  LEADERBOARD_DISPLAY_LEVELS.forEach(({ key, label, className, icon }) => {
    const column = document.createElement('div');
    column.className = `leaderboard-column ${className}`;

    const header = document.createElement('div');
    header.className = 'leaderboard-column-header';

    const iconEl = document.createElement('span');
    iconEl.className = 'level-icon';
    iconEl.textContent = icon;
    header.appendChild(iconEl);

    const badge = document.createElement('span');
    badge.className = 'level-badge';
    badge.textContent = label;
    header.appendChild(badge);

    column.appendChild(header);

    const levelEntries = normalizedEntries
      .filter((entry) => entry.levelKey === key)
      .sort((a, b) => {
        if (a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
        if (b.score !== a.score) return b.score - a.score;
        if (a.dateMs !== b.dateMs) return a.dateMs - b.dateMs;
        return a.name.localeCompare(b.name, 'ca', { sensitivity: 'base' });
      })
      .slice(0, 5);

    if (levelEntries.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'leaderboard-column-empty';
      empty.textContent = 'Encara no hi ha registres en aquest nivell.';
      column.appendChild(empty);
    } else {
      const listEl = document.createElement('ol');
      listEl.className = 'leaderboard-list';

      levelEntries.forEach((entry, index) => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';

        const badgeEl = document.createElement('span');
        badgeEl.className = 'rank-badge';
        badgeEl.textContent = `#${index + 1}`;
        item.appendChild(badgeEl);

        const wrapper = document.createElement('div');
        wrapper.className = 'leaderboard-entry';

        const nameEl = document.createElement('strong');
        nameEl.textContent = entry.name;
        wrapper.appendChild(nameEl);

        const meta = document.createElement('div');
        meta.className = 'leaderboard-meta';

        const timeBlock = document.createElement('span');
        timeBlock.className = 'leaderboard-meta-block leaderboard-meta-time';

        const timeIcon = document.createElement('span');
        timeIcon.className = 'leaderboard-meta-icon';
        timeIcon.setAttribute('aria-hidden', 'true');
        timeIcon.textContent = '⏳';
        timeBlock.appendChild(timeIcon);

        const timeLabel = document.createElement('span');
        timeLabel.className = 'sr-only';
        timeLabel.textContent = 'Temps';
        timeBlock.appendChild(timeLabel);

        const timeValue = document.createElement('strong');
        timeValue.className = 'leaderboard-time-value';
        timeValue.textContent = entry.time;
        timeBlock.appendChild(timeValue);

        const dateBlock = document.createElement('span');
        dateBlock.className = 'leaderboard-meta-block leaderboard-meta-date';

        const dateIcon = document.createElement('span');
        dateIcon.className = 'leaderboard-meta-icon';
        dateIcon.setAttribute('aria-hidden', 'true');
        dateIcon.textContent = '📅';
        dateBlock.appendChild(dateIcon);

        const dateLabel = document.createElement('span');
        dateLabel.className = 'sr-only';
        dateLabel.textContent = 'Data';
        dateBlock.appendChild(dateLabel);

        const dateValue = document.createElement('span');
        dateValue.className = 'leaderboard-date-value';
        dateValue.textContent = entry.dateText;
        dateBlock.appendChild(dateValue);

        meta.appendChild(timeBlock);
        meta.appendChild(dateBlock);
        wrapper.appendChild(meta);

        item.appendChild(wrapper);
        listEl.appendChild(item);
      });

      column.appendChild(listEl);
      totalRendered += levelEntries.length;
    }

    leaderboardGrid.appendChild(column);
  });

  if (leaderboardEmpty) {
    if (totalRendered === 0) {
      leaderboardEmpty.hidden = false;
      leaderboardEmpty.textContent = 'Encara no hi ha registres disponibles.';
    } else {
      leaderboardEmpty.hidden = true;
      leaderboardEmpty.textContent = '';
    }
  }
}

function parseLeaderboardTime(value) {
  if (typeof value !== "string") return Number.POSITIVE_INFINITY;
  const trimmed = value.trim();
  if (!trimmed) return Number.POSITIVE_INFINITY;
  const parts = trimmed.split(':').map((part) => part.trim());
  if (parts.length === 2) {
    const minutes = Number.parseInt(parts[0], 10);
    const seconds = Number.parseInt(parts[1], 10);
    if (Number.isNaN(minutes) || Number.isNaN(seconds)) return Number.POSITIVE_INFINITY;
    return (minutes * 60 + seconds) * 1_000;
  }
  if (parts.length === 3) {
    const hours = Number.parseInt(parts[0], 10);
    const minutes = Number.parseInt(parts[1], 10);
    const seconds = Number.parseInt(parts[2], 10);
    if ([hours, minutes, seconds].some((num) => Number.isNaN(num))) {
      return Number.POSITIVE_INFINITY;
    }
    return (hours * 3_600 + minutes * 60 + seconds) * 1_000;
  }
  return Number.POSITIVE_INFINITY;
}

function formatLeaderboardDate(rawValue) {
  if (!rawValue) return "Data desconeguda";
  const date = rawValue instanceof Date ? rawValue : new Date(rawValue);
  if (Number.isNaN(date.getTime())) return "Data desconeguda";
  return LEADERBOARD_DATE_FORMAT.format(date);
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
      loadLeaderboard({ force: true, silent: true }).catch((error) => {
        console.error("No s'ha pogut refrescar el rànquing", error);
      });
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

