// Functions buildPool, buildChallenge, buildQuestion are loaded from engine.js (global)
// Note: We access them directly from window when needed to ensure engine.js has loaded


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
  try {
    const saved = localStorage.getItem("leshores_profiles");
    state.profiles = saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error("Error loading profiles, resetting", e);
    state.profiles = {};
  }

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

function saveProfile(name) {
  if (!name) return;
  if (!state.profiles[name]) {
    state.profiles[name] = { name, unlockedLevel: 1, points: 0, streak: 0, badges: [] };
  }
  state.profile = state.profiles[name];
  localStorage.setItem("leshores_profiles", JSON.stringify(state.profiles));
  localStorage.setItem("leshores_active", name);
  syncHud();
  renderProfileList();
}

function resetProfile() {
  playerNameInput.value = "";
  state.profile = { name: "", unlockedLevel: 1, points: 0, streak: 0, badges: [] };
  syncHud();
}

function renderProfileList() {
  profileList.innerHTML = "";
  Object.keys(state.profiles).forEach((name) => {
    const pill = document.createElement("div");
    pill.className = "profile-pill" + (state.profile.name === name ? " active" : "");
    pill.textContent = name;
    pill.addEventListener("click", () => {
      state.profile = state.profiles[name];
      localStorage.setItem("leshores_active", name);
      playerNameInput.value = name;
      syncHud();
      renderProfileList();
    });
    profileList.appendChild(pill);
  });
}

function renderLevels() {
  levelsList.innerHTML = "";
  levels.forEach((lv, idx) => {
    const item = document.createElement("div");
    item.className = "level-item" + (idx + 1 > state.profile.unlockedLevel ? " locked" : "");
    const earned = state.profile.badges.includes(lv.rewards?.badgeOnComplete);
    item.innerHTML = `
      <div>
        <strong>${lv.title}</strong>
        <div class="meta">${lv.description}</div>
      </div>
      <div>${earned ? "✅" : idx + 1 <= state.profile.unlockedLevel ? "▶️" : "🔒"}</div>
    `;
    if (idx + 1 <= state.profile.unlockedLevel) {
      item.style.cursor = "pointer";
      item.addEventListener("click", () => startLevel(lv.levelId));
    }
    levelsList.appendChild(item);
  });
}

function renderBadges() {
  badgesGrid.innerHTML = "";
  badges.forEach((b) => {
    const earned = state.profile.badges.includes(b.badgeId);
    const card = document.createElement("div");
    card.className = "badge" + (earned ? " earned" : "");
    card.innerHTML = `
      <div class="icon">${b.icon}</div>
      <div><strong>${b.name}</strong></div>
      <div class="desc">${b.description}</div>
      ${earned ? '<div class="badge-check"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path fill="#fff" d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" fill="none"/></svg></div>' : ""}
    `;
    badgesGrid.appendChild(card);
  });
}

function renderBadgeStrip() {
  badgeStrip.innerHTML = "";
  const levelBadges = badges.filter((b) => {
    const lvNum = parseInt(b.condition.split(":L")[1], 10);
    return lvNum <= state.profile.unlockedLevel;
  });
  levelBadges.forEach((b) => {
    const earned = state.profile.badges.includes(b.badgeId);
    const pill = document.createElement("span");
    pill.className = "badge-pill" + (earned ? " earned" : " reached");
    pill.innerHTML = `${b.icon} ${b.name}`;
    badgeStrip.appendChild(pill);
  });
}

function renderClock(entry, style, container) {
  const size = 375;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;

  let ticksHtml = "";
  if (style.marks === "all") {
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const len = i % 5 === 0 ? 12 : 6;
      const x1 = cx + (r - len) * Math.cos(angle);
      const y1 = cy + (r - len) * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      ticksHtml += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
  } else if (style.marks === "hoursOnly") {
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const len = 12;
      const x1 = cx + (r - len) * Math.cos(angle);
      const y1 = cy + (r - len) * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      ticksHtml += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
  }

  let numsHtml = "";
  if (style.numbers) {
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = cx + (r - 30) * Math.cos(angle);
      const y = cy + (r - 30) * Math.sin(angle) + 6;
      numsHtml += `<text class="num" x="${x}" y="${y}" text-anchor="middle">${i}</text>`;
    }
  }

  const h12 = entry.h % 12;
  const hourAngle = (h12 + entry.m / 60) * 30 - 90;
  const minAngle = entry.m * 6 - 90;
  const hourLen = r * 0.5;
  const minLen = r * 0.75;

  const hx = cx + hourLen * Math.cos(hourAngle * Math.PI / 180);
  const hy = cy + hourLen * Math.sin(hourAngle * Math.PI / 180);
  const mx = cx + minLen * Math.cos(minAngle * Math.PI / 180);
  const my = cy + minLen * Math.sin(minAngle * Math.PI / 180);

  container.innerHTML = `
    <svg class="clock-svg" viewBox="0 0 ${size} ${size}">
      <circle class="clock-face" cx="${cx}" cy="${cy}" r="${r}"/>
      ${ticksHtml}
      ${numsHtml}
      <line class="hand hour" x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}"/>
      <line class="hand minute" x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}"/>
      <circle class="pin" cx="${cx}" cy="${cy}" r="8"/>
    </svg>
  `;
}

function renderClockOption(entry, style) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;

  let ticksHtml = "";
  if (style.marks === "all") {
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6 - 90) * (Math.PI / 180);
      const len = i % 5 === 0 ? 8 : 4;
      const x1 = cx + (r - len) * Math.cos(angle);
      const y1 = cy + (r - len) * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      ticksHtml += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
  } else if (style.marks === "hoursOnly") {
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const len = 8;
      const x1 = cx + (r - len) * Math.cos(angle);
      const y1 = cy + (r - len) * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      ticksHtml += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }
  }

  let numsHtml = "";
  if (style.numbers) {
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = cx + (r - 20) * Math.cos(angle);
      const y = cy + (r - 20) * Math.sin(angle) + 4;
      numsHtml += `<text class="num" x="${x}" y="${y}" text-anchor="middle" style="font-size:12px">${i}</text>`;
    }
  }

  const h12 = entry.h % 12;
  const hourAngle = (h12 + entry.m / 60) * 30 - 90;
  const minAngle = entry.m * 6 - 90;
  const hourLen = r * 0.5;
  const minLen = r * 0.75;

  const hx = cx + hourLen * Math.cos(hourAngle * Math.PI / 180);
  const hy = cy + hourLen * Math.sin(hourAngle * Math.PI / 180);
  const mx = cx + minLen * Math.cos(minAngle * Math.PI / 180);
  const my = cy + minLen * Math.sin(minAngle * Math.PI / 180);

  return `
    <svg class="clock-svg option-clock" viewBox="0 0 ${size} ${size}">
      <circle class="clock-face" cx="${cx}" cy="${cy}" r="${r}"/>
      ${ticksHtml}
      ${numsHtml}
      <line class="hand hour" x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}"/>
      <line class="hand minute" x1="${cx}" y1="${cy}" x2="${mx}" y2="${my}"/>
      <circle class="pin" cx="${cx}" cy="${cy}" r="5"/>
    </svg>
  `;
}

function startLevel(levelId) {
  const level = levels.find((l) => l.levelId === levelId);
  if (!level) return;
  state.currentLevel = level;
  state.pool = window.buildPool(level, timeBank);
  state.challenge = window.buildChallenge(state.pool, MAX_CORRECT);
  state.currentIndex = 0;
  state.correctCount = 0;
  state.maxStreak = 0;
  state.profile.streak = 0;
  renderBadgeStrip();
  updateProgress();
  go("game");
  showQuestion();
}

function updateProgress() {
  const pct = (state.correctCount / MAX_CORRECT) * 100;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${state.correctCount}/${MAX_CORRECT} encerts`;
}

function showQuestion() {
  if (state.currentIndex >= state.challenge.length) {
    checkLevelComplete();
    return;
  }
  const entry = state.challenge[state.currentIndex];
  const level = state.currentLevel;
  const question = window.buildQuestion(entry, level, state.pool, {}, Math.random, timeBank);

  state.currentEntryId = entry.id;

  if (level.mode === "textToClock") {
    clockContainer.classList.add("text-question");
    clockWrap.classList.add("compact");
    clockContainer.innerHTML = `
      <div class="clock-title">Quina hora és?</div>
      <div class="question-text">${question.prompt}</div>
    `;
    questionRepeat.style.display = "none";
  } else {
    clockContainer.classList.remove("text-question");
    clockWrap.classList.remove("compact");
    renderClock(entry, level.clockStyle, clockContainer);
    if (level.mode === "say") {
      questionRepeat.textContent = `Quina hora és?`;
      questionRepeat.style.display = "block";
    } else {
      questionRepeat.style.display = "none";
    }
  }

  optionsWrap.innerHTML = "";
  question.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (level.mode === "say" ? " option-text" : "");

    if (level.mode === "textToClock") {
      const optEntry = timeBank.find((e) => e.id === opt);
      if (optEntry) {
        btn.innerHTML = renderClockOption(optEntry, level.clockStyle);
      } else {
        btn.textContent = opt;
      }
    } else {
      btn.textContent = opt;
    }

    btn.dataset.value = opt;
    btn.addEventListener("click", () => handleAnswer(btn, opt, question.correct));
    optionsWrap.appendChild(btn);
  });

  feedback.textContent = "";
}

function handleAnswer(btn, selected, correct) {
  const isCorrect = selected === correct;
  document.querySelectorAll(".option-btn").forEach((b) => {
    b.disabled = true;
    if (b.dataset.value === correct) b.classList.add("correct");
    if (b.dataset.value === selected && !isCorrect) b.classList.add("wrong");
  });

  if (isCorrect) {
    state.correctCount++;
    state.profile.streak++;
    if (state.profile.streak > state.maxStreak) state.maxStreak = state.profile.streak;
    state.profile.points += state.currentLevel.rewards?.basePoints || 10;
    feedback.textContent = "✅ Correcte!";
    feedback.style.color = "#22c55e";
  } else {
    state.profile.streak = 0;
    feedback.textContent = "❌ Ops...";
    feedback.style.color = "#ef4444";
  }

  syncHud();
  saveProfiles();
  updateProgress();

  setTimeout(() => {
    state.currentIndex++;
    showQuestion();
  }, 1200);
}

function saveProfiles() {
  state.profiles[state.profile.name] = state.profile;
  localStorage.setItem("leshores_profiles", JSON.stringify(state.profiles));
}

function checkLevelComplete() {
  const level = state.currentLevel;
  const accuracy = state.correctCount / MAX_CORRECT;
  const passed = accuracy >= (level.winCondition?.minAccuracy || 0.8) && state.maxStreak >= 5;

  if (passed) {
    const badgeId = level.rewards?.badgeOnComplete;
    if (badgeId && !state.profile.badges.includes(badgeId)) {
      state.profile.badges.push(badgeId);
    }
    const lvNum = parseInt(level.levelId.replace("L", ""), 10);
    if (lvNum >= state.profile.unlockedLevel && lvNum < levels.length) {
      state.profile.unlockedLevel = lvNum + 1;
    }
    saveProfiles();
    showLevelCompleteModal(true, badgeId);
  } else {
    showLevelCompleteModal(false, null);
  }
}

function showLevelCompleteModal(passed, badgeId) {
  if (passed) {
    const badge = badges.find((b) => b.badgeId === badgeId);
    modalBadge.textContent = badge?.icon || "🏆";
    modalTitle.textContent = "Nivell superat!";
    modalText.textContent = badge ? `Has guanyat: ${badge.name}` : "Has desbloquejat el següent nivell.";
    if (soundOn.checked && winSound) {
      winSound.currentTime = 0;
      winSound.play().catch(() => { });
    }
    startConfetti();
  } else {
    modalBadge.textContent = "🔄";
    modalTitle.textContent = "Torna-ho a provar";
    modalText.textContent = "Necessites més encerts o una ratxa de 5 per passar.";
  }
  levelModal.classList.add("active");
}

if (modalNext) {
  modalNext.addEventListener("click", () => {
    levelModal.classList.remove("active");
    const nextLevelId = `L${state.profile.unlockedLevel}`;
    startLevel(nextLevelId);
  });
}

if (modalLevels) {
  modalLevels.addEventListener("click", () => {
    levelModal.classList.remove("active");
    renderLevels();
    go("levels");
  });
}



function loadJSON(url) {
  return new Promise((resolve, reject) => {
    // Try fetch first (works on http/https)
    if (window.location.protocol !== "file:") {
      fetch(url)
        .then(r => {
          if (!r.ok) throw new Error(`Error loading ${url}`);
          return r.json();
        })
        .then(resolve)
        .catch(reject);
    } else {
      // Use XMLHttpRequest for file:// protocol
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 0 || xhr.status === 200) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error(`Error parsing ${url}: ${e.message}`));
            }
          } else {
            reject(new Error(`Error loading ${url}`));
          }
        }
      };
      xhr.onerror = () => reject(new Error(`Network error loading ${url}`));
      xhr.send();
    }
  });
}

async function loadData() {
  try {
    const [tb, lv, bd] = await Promise.all([
      loadJSON("time_bank.json"),
      loadJSON("levels.json"),
      loadJSON("badges.json"),
    ]);
    timeBank = tb;
    levels = lv;
    badges = bd;
    renderLevels();
    renderBadges();
  } catch (err) {
    console.error("Failed to load game data:", err);
    // Show a more helpful message for file:// protocol
    if (window.location.protocol === "file:") {
      console.warn("Hint: The app works better when served via a local server. Try using 'npx http-server' or the Live Server extension in VS Code.");
    }
    alert("Hi ha hagut un error carregant les dades del joc. Prova a obrir l'app amb un servidor local (Live Server, http-server, etc.).");
  }
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

if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.error("SW registration failed", err));
  });
}

