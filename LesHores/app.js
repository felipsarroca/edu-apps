import {
  buildPool,
  buildChallenge,
  buildQuestion,
} from "./engine.js";

const screens = document.querySelectorAll(".screen");
const playerNameInput = document.getElementById("playerName");
const saveProfileBtn = document.getElementById("saveProfile");
const continueBtn = document.getElementById("continueBtn");
const newBtn = document.getElementById("newBtn");
const profileList = document.getElementById("profileList");
const levelsList = document.getElementById("levelsList");
const badgesGrid = document.getElementById("badgesGrid");
const clockContainer = document.getElementById("clockContainer");
const clockWrap = document.querySelector(".clock-wrap");
const optionsWrap = document.getElementById("optionsWrap");
const questionRepeat = document.getElementById("questionRepeat");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const hudName = document.getElementById("hudName");
const hudLevel = document.getElementById("hudLevel");
const hudPoints = document.getElementById("hudPoints");
const hudStreak = document.getElementById("hudStreak");
const soundOn = document.getElementById("soundOn");
const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const infoClose = document.getElementById("infoClose");
const playBtn = document.getElementById("playBtn");
const themeButtons = document.querySelectorAll("[data-theme]");
const screenButtons = document.querySelectorAll("[data-screenmode]");
const badgeStrip = document.getElementById("badgeStrip");
const levelModal = document.getElementById("levelModal");
const modalBadge = document.getElementById("modalBadge");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalNext = document.getElementById("modalNext");
const modalLevels = document.getElementById("modalLevels");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const confettiCanvas = document.getElementById("confettiCanvas");
const winSound = document.getElementById("winSound");

let timeBank = [];
let levels = [];
let badges = [];

const MAX_CORRECT = 10;

let state = {
  profiles: {},
  profile: { name: "", unlockedLevel: 1, points: 0, streak: 0, badges: [] },
  currentLevel: null,
  pool: [],
  challenge: [],
  currentIndex: 0,
  correctCount: 0,
  maxStreak: 0,
  currentEntryId: null,
  lastEntryId: null,
};

function go(screenId) {
  screens.forEach((s) => s.classList.remove("active"));
  document.querySelector(`[data-screen="${screenId}"]`).classList.add("active");
  if (screenId !== "game") {
    syncHud();
  }
}

function syncHud() {
  hudName.textContent = state.profile.name || "Sense perfil";
  hudLevel.textContent = `Nivell ${state.profile.unlockedLevel || 1}`;
  hudPoints.textContent = state.profile.points || 0;
  hudStreak.textContent = state.profile.streak || 0;
}

function loadProfiles() {
  const saved = localStorage.getItem("leshores_profiles");
  state.profiles = saved ? JSON.parse(saved) : {};
  if (state.profiles[""]) {
    delete state.profiles[""];
  }
  const active = localStorage.getItem("leshores_active");
  if (active && state.profiles[active]) {
    state.profile = state.profiles[active];
  } else {
    const first = Object.keys(state.profiles)[0];
    if (first) state.profile = state.profiles[first];
  }
  playerNameInput.value = state.profile.name || "";
  if (state.profile.name) {
    localStorage.setItem("leshores_active", state.profile.name);
  }
  syncHud();
  renderProfileList();
}

function persistProfiles() {
  localStorage.setItem("leshores_profiles", JSON.stringify(state.profiles));
  localStorage.setItem("leshores_active", state.profile.name);
}

function saveProfile(name) {
  const clean = (name || "").trim();
  if (!clean) return;
  if (!state.profiles[clean]) {
    state.profiles[clean] = { name: clean, unlockedLevel: 1, points: 0, streak: 0, badges: [] };
  }
  state.profile = state.profiles[clean];
  syncHud();
  persistProfiles();
  renderProfileList();
}

function resetProfile() {
  state.profile = { name: "", unlockedLevel: 1, points: 0, streak: 0, badges: [] };
  playerNameInput.value = "";
  localStorage.removeItem("leshores_active");
  syncHud();
  renderProfileList();
}

function renderProfileList() {
  profileList.innerHTML = "";
  Object.keys(state.profiles).forEach((name) => {
    const pill = document.createElement("div");
    pill.className = `profile-pill${state.profile.name === name ? " active" : ""}`;
    pill.textContent = name;
    pill.addEventListener("click", () => {
      state.profile = state.profiles[name];
      syncHud();
      persistProfiles();
      renderLevels();
      renderBadges();
      renderBadgeStrip();
      renderProfileList();
    });
    profileList.appendChild(pill);
  });
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

function renderClock(entry, style = { numbers: true, marks: "all" }, extraClass = "") {
  const radius = 100;
  const center = 120;
  const hourAngle = (entry.h % 12) * 30 + entry.m * 0.5;
  const minuteAngle = entry.m * 6;
  const className = extraClass ? `clock-svg ${extraClass}` : "clock-svg";

  const numbers = style.numbers
    ? Array.from({ length: 12 }).map((_, i) => {
        const angle = (i + 1) * 30;
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = center + Math.cos(rad) * 80;
        const y = center + Math.sin(rad) * 80;
        return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="num">${i + 1}</text>`;
      }).join("")
    : "";

  const marks = style.marks === "none" ? "" : Array.from({ length: 60 }).map((_, i) => {
    if (style.marks === "hoursOnly" && i % 5 !== 0) return "";
    const angle = i * 6;
    const rad = ((angle - 90) * Math.PI) / 180;
    const x1 = center + Math.cos(rad) * 92;
    const y1 = center + Math.sin(rad) * 92;
    const x2 = center + Math.cos(rad) * (i % 5 === 0 ? 82 : 88);
    const y2 = center + Math.sin(rad) * (i % 5 === 0 ? 82 : 88);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="tick"/>`;
  }).join("");

  return `
    <svg class="${className}" viewBox="0 0 240 240">
      <circle cx="${center}" cy="${center}" r="${radius}" class="clock-face"></circle>
      ${marks}
      ${numbers}
      <line x1="${center}" y1="${center}" x2="${center}" y2="${center - 50}" class="hand hour" transform="rotate(${hourAngle} ${center} ${center})"/>
      <line x1="${center}" y1="${center}" x2="${center}" y2="${center - 75}" class="hand minute" transform="rotate(${minuteAngle} ${center} ${center})"/>
      <circle cx="${center}" cy="${center}" r="4" class="pin"/>
    </svg>
  `;
}

function renderOptions(question, level) {
  optionsWrap.innerHTML = "";
  question.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    if (level.mode === "textToClock") {
      const entry = timeBank.find((e) => e.id === opt);
      btn.innerHTML = renderClock(entry, level.clockStyle, "option-clock");
    } else {
      if (typeof opt === "string" && /[a-zà-ÿ]/i.test(opt)) {
        btn.classList.add("option-text");
      }
      btn.textContent = opt;
    }
    btn.addEventListener("click", () => handleAnswer(btn, opt, question.correct));
    optionsWrap.appendChild(btn);
  });
}

function handleAnswer(btn, optionValue, correctValue) {
  const allButtons = optionsWrap.querySelectorAll(".option-btn");
  allButtons.forEach((b) => b.disabled = true);

  if (optionValue === correctValue) {
    btn.classList.add("correct");
    feedback.textContent = "Correcte!";
    state.profile.points += 10;
    state.profile.streak += 1;
    state.correctCount += 1;
    state.maxStreak = Math.max(state.maxStreak, state.profile.streak);
    state.lastEntryId = state.currentEntryId;

    hudPoints.textContent = state.profile.points;
    hudStreak.textContent = state.profile.streak;
    state.profiles[state.profile.name] = state.profile;
    persistProfiles();

    const progressCount = Math.min(state.correctCount, MAX_CORRECT);
    progressFill.style.width = `${(progressCount / MAX_CORRECT) * 100}%`;
    progressText.textContent = `${progressCount}/${MAX_CORRECT} encerts`;

    if (state.correctCount >= MAX_CORRECT && state.maxStreak >= 5) {
      setTimeout(() => finishLevel(), 400);
      return;
    }
    if (state.correctCount >= MAX_CORRECT && state.maxStreak < 5) {
      setTimeout(() => showRetryModal(), 400);
      return;
    }

    setTimeout(() => {
      nextQuestion();
    }, 700);
    return;
  }

  btn.classList.add("wrong");
  feedback.textContent = "Ops... Torna-ho a provar!";
  state.profile.streak = 0;
  hudStreak.textContent = state.profile.streak;
  state.profiles[state.profile.name] = state.profile;
  persistProfiles();

  setTimeout(() => {
    allButtons.forEach((b) => {
      b.disabled = false;
      b.classList.remove("wrong");
    });
  }, 600);
}

function nextQuestion() {
  const level = state.currentLevel;
  if (!level) return;

  if (state.currentIndex >= state.challenge.length) {
    state.challenge = buildChallenge(state.pool, state.pool.length, Math.random);
    state.currentIndex = 0;
  }

  let entry = state.challenge[state.currentIndex];
  if (state.lastEntryId && entry.id === state.lastEntryId) {
    const altIndex = state.challenge.findIndex(
      (e, idx) => idx > state.currentIndex && e.id !== state.lastEntryId
    );
    if (altIndex !== -1) {
      const tmp = state.challenge[state.currentIndex];
      state.challenge[state.currentIndex] = state.challenge[altIndex];
      state.challenge[altIndex] = tmp;
      entry = state.challenge[state.currentIndex];
    } else {
      state.challenge = buildChallenge(state.pool, state.pool.length, Math.random);
      state.currentIndex = 0;
      const swapIndex = state.challenge.findIndex((e) => e.id !== state.lastEntryId);
      if (swapIndex !== -1) {
        const tmp = state.challenge[0];
        state.challenge[0] = state.challenge[swapIndex];
        state.challenge[swapIndex] = tmp;
      }
      entry = state.challenge[state.currentIndex];
    }
  }
  state.currentEntryId = entry.id;
  const candidates = filterByTags(timeBank, level.filters);
  const levelNum = parseInt(level.levelId.slice(1), 10);
  const hideRepeatOnMobile = levelNum === 11 || levelNum === 12;
  document.body.classList.toggle("hide-question-repeat", hideRepeatOnMobile);
  const use24h = levelNum >= 5;
  const question = buildQuestion(entry, level, state.pool, { use24h }, Math.random, candidates);

  hudLevel.textContent = `Nivell ${levelNum}`;
  feedback.textContent = "";
  optionsWrap.innerHTML = "";

  if (level.mode === "textToClock") {
    clockContainer.classList.add("text-question");
    if (clockWrap) clockWrap.classList.add("compact");
    clockContainer.innerHTML = `<div class="clock-title">Llegeix i tria el rellotge correcte</div>
      <div class="question-text">${entry.catalan}</div>`;
    if (questionRepeat) {
      questionRepeat.textContent = entry.catalan;
      questionRepeat.classList.add("active");
    }
  } else {
    clockContainer.classList.remove("text-question");
    if (clockWrap) clockWrap.classList.remove("compact");
    clockContainer.innerHTML = renderClock(entry, level.clockStyle);
    if (questionRepeat) {
      questionRepeat.textContent = "";
      questionRepeat.classList.remove("active");
    }
  }

  renderOptions(question, level);
  state.currentIndex += 1;
}

function showRetryModal() {
  const level = state.currentLevel;
  if (!level) return;

  const levelNum = parseInt(level.levelId.slice(1), 10);
  modalBadge.textContent = "\u{1F44F}";
  modalTitle.textContent = `Has fet 10 encerts al nivell ${levelNum}!`;
  modalText.textContent = "Per passar cal una ratxa minima de 5 encerts seguits. Torna-ho a intentar.";
  modalNext.textContent = "Repetir nivell";
  modalNext.style.display = "";
  modalLevels.textContent = "Torna a nivells";
  levelModal.classList.add("active");

  modalNext.onclick = () => {
    levelModal.classList.remove("active");
    startLevel(level.levelId);
  };
  modalLevels.onclick = () => {
    levelModal.classList.remove("active");
    renderLevels();
    renderBadges();
    if (nextLevelExists) {
      go("levels");
    } else {
      go("home");
    }
  };
}

function finishLevel() {
  const level = state.currentLevel;
  const passedStreak = state.maxStreak >= 5;
  const passedCorrect = state.correctCount >= MAX_CORRECT;
  if (!passedStreak || !passedCorrect) return;
  const wonBadge = true;

  if (wonBadge && !state.profile.badges.includes(level.rewards.badgeOnComplete)) {
    state.profile.badges.push(level.rewards.badgeOnComplete);
  }
  const levelNum = parseInt(level.levelId.slice(1), 10);
  const badgeInfo = badges.find((b) => b.badgeId === level.rewards.badgeOnComplete);
  const nextLevelNum = levelNum + 1;
  const nextLevelId = `L${nextLevelNum}`;
  const nextLevelExists = levels.some((l) => l.levelId === nextLevelId);

  if (nextLevelExists && state.profile.unlockedLevel < levelNum + 1) {
    state.profile.unlockedLevel += 1;
  } else {
    state.profile.unlockedLevel = Math.max(state.profile.unlockedLevel, levelNum);
  }
  state.profiles[state.profile.name] = state.profile;
  persistProfiles();

  modalBadge.textContent = badgeInfo ? badgeInfo.icon : "\u{1F3C5}";
  modalTitle.textContent = `Nivell ${levelNum} superat!`;
  modalText.textContent = nextLevelExists
    ? "Nova insígnia! Vols intentar la següent?"
    : "Has completat tots els nivells!";
  modalNext.textContent = "Següent nivell";
  if (nextLevelExists) {
    modalNext.style.display = "";
    modalLevels.textContent = "Torna a nivells";
  } else {
    modalNext.style.display = "none";
    modalLevels.textContent = "Tornar";
  }
  levelModal.classList.add("active");
  startConfetti();
  if (winSound && soundOn.checked) {
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
  }

  modalNext.onclick = () => {
    levelModal.classList.remove("active");
    if (nextLevelExists) startLevel(nextLevelId);
    else go("levels");
  };
  modalLevels.onclick = () => {
    levelModal.classList.remove("active");
    renderLevels();
    renderBadges();
    go("levels");
  };
}

function startLevel(levelId) {
  if (!state.profile.name) {
    go("home");
    playerNameInput.focus();
    return;
  }
  const level = levels.find((l) => l.levelId === levelId);
  state.currentLevel = level;
  state.pool = buildPool(level, timeBank, Math.random);
  state.challenge = buildChallenge(state.pool, state.pool.length, Math.random);
  state.currentIndex = 0;
  state.correctCount = 0;
  state.maxStreak = 0;
  hudName.textContent = state.profile.name || "Jugador";
  hudPoints.textContent = state.profile.points;
  hudStreak.textContent = state.profile.streak;
  const levelNum = parseInt(level.levelId.slice(1), 10);
  hudLevel.textContent = `Nivell ${levelNum}`;
  progressFill.style.width = "0%";
  progressText.textContent = `0/${MAX_CORRECT} encerts`;
  renderBadgeStrip(levelNum);
  go("game");
  nextQuestion();
}

function renderLevels() {
  levelsList.innerHTML = "";
  levels.forEach((level) => {
    const num = parseInt(level.levelId.slice(1), 10);
    const locked = num > state.profile.unlockedLevel;
    const item = document.createElement("div");
    item.className = `level-item ${locked ? "locked" : ""}`;
    item.innerHTML = `
      <div>
        <strong>Nivell ${num}</strong> - ${level.title}
        <div class="meta">${level.description}</div>
      </div>
      <button class="btn ${locked ? "ghost" : "primary"}" ${locked ? "disabled" : ""}>
        ${locked ? "Bloquejat" : "Jugar"}
      </button>
    `;
    const btn = item.querySelector("button");
    btn.addEventListener("click", () => startLevel(level.levelId));
    levelsList.appendChild(item);
  });
}

function renderBadges() {
  badgesGrid.innerHTML = "";
  const displayLevel = state.profile.unlockedLevel || 1;
  badges.forEach((badge, index) => {
    const levelNum = index + 1;
    const earned = state.profile.badges.includes(badge.badgeId);
    const card = document.createElement("div");
    const reached = levelNum <= displayLevel;
    card.className = `badge${reached ? " reached" : ""}${earned ? " earned" : ""}`;
    const statusIcon = earned
      ? `<span class="badge-check" aria-label="Aconseguida" title="Aconseguida">
          <svg viewBox="0 0 24 24" role="img">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M7 12.5l3 3 7-7"></path>
          </svg>
        </span>`
      : "";
    card.innerHTML = `
      ${statusIcon}
      <div class="icon">${badge.icon}</div>
      <div><strong>${badge.name}</strong></div>
      <div class="desc">${badge.description}</div>
    `;
    badgesGrid.appendChild(card);
  });
}

function renderBadgeStrip(displayLevel = null) {
  badgeStrip.innerHTML = "";
  const levelToShow = displayLevel || state.profile.unlockedLevel || 1;
  badges.forEach((badge, index) => {
    const levelNum = index + 1;
    const earned = state.profile.badges.includes(badge.badgeId);
    const pill = document.createElement("div");
    const reached = levelNum <= levelToShow;
    pill.className = `badge-pill${reached ? " reached" : ""}${earned ? " earned" : ""}`;
    pill.textContent = `${badge.icon} ${badge.name}`;
    badgeStrip.appendChild(pill);
  });
}

async function loadData() {
  const [tb, lv, bd] = await Promise.all([
    fetch("time_bank.json").then((r) => r.json()),
    fetch("levels.json").then((r) => r.json()),
    fetch("badges.json").then((r) => r.json()),
  ]);
  timeBank = tb;
  levels = lv;
  badges = bd;
  renderLevels();
  renderBadges();
}

document.querySelectorAll("[data-go]").forEach((btn) => {
  btn.addEventListener("click", () => go(btn.dataset.go));
});

saveProfileBtn.addEventListener("click", () => saveProfile(playerNameInput.value.trim()));
continueBtn.addEventListener("click", () => {
  if (!state.profile.name) {
    playerNameInput.focus();
    return;
  }
  go("levels");
});
newBtn.addEventListener("click", () => resetProfile());
if (nextBtn) nextBtn.addEventListener("click", () => nextQuestion());

loadProfiles();
const dataReady = loadData();
if (nextBtn) {
  nextBtn.classList.add("ghost");
  nextBtn.style.opacity = "0.6";
}

soundOn.addEventListener("change", () => {
  localStorage.setItem("leshores_sound", soundOn.checked ? "1" : "0");
});

const savedSound = localStorage.getItem("leshores_sound");
if (savedSound) soundOn.checked = savedSound === "1";

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    themeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.body.dataset.theme = btn.dataset.theme;
    localStorage.setItem("leshores_theme", btn.dataset.theme);
  });
});

screenButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    screenButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.body.dataset.screenmode = btn.dataset.screenmode;
    localStorage.setItem("leshores_screenmode", btn.dataset.screenmode);
  });
});

const savedTheme = localStorage.getItem("leshores_theme") || "light";
document.body.dataset.theme = savedTheme;
themeButtons.forEach((b) => b.classList.toggle("active", b.dataset.theme === savedTheme));

const savedScreen = localStorage.getItem("leshores_screenmode") || "desktop";
document.body.dataset.screenmode = savedScreen;
screenButtons.forEach((b) => b.classList.toggle("active", b.dataset.screenmode === savedScreen));

if (infoBtn && infoModal) {
  infoBtn.addEventListener("click", () => infoModal.classList.add("active"));
}
if (infoClose && infoModal) {
  infoClose.addEventListener("click", () => infoModal.classList.remove("active"));
}

if (playBtn) {
  playBtn.addEventListener("click", async () => {
    await dataReady;
    if (!state.profile.name) {
      go("home");
      return;
    }
    const targetLevel = `L${state.profile.unlockedLevel || 1}`;
    startLevel(targetLevel);
  });
}

let confettiTimer = null;
function startConfetti() {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext("2d");
  const colors = ["#ff4b5c", "#34d399", "#5a78ff", "#ffb703", "#ffd1eb"];

  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize, { once: true });

  const pieces = Array.from({ length: 140 }).map(() => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height,
    r: 3 + Math.random() * 4,
    c: colors[Math.floor(Math.random() * colors.length)],
    v: 1 + Math.random() * 3,
    w: -1 + Math.random() * 2,
  }));

  const start = performance.now();
  function draw(now) {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach((p) => {
      p.y += p.v;
      p.x += p.w;
      if (p.y > confettiCanvas.height) p.y = -10;
      if (p.x > confettiCanvas.width) p.x = 0;
      if (p.x < 0) p.x = confettiCanvas.width;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (now - start < 1800) {
      confettiTimer = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
  if (confettiTimer) cancelAnimationFrame(confettiTimer);
  confettiTimer = requestAnimationFrame(draw);
}

function stopPendingLoad() {
  if (document.readyState !== "complete") {
    window.stop();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(stopPendingLoad, 6000);
});
