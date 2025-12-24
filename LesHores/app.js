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

// ... (rest of the code remains until loadData)

async function loadData() {
  try {
    const [tb, lv, bd] = await Promise.all([
      fetch("time_bank.json").then((r) => {
        if (!r.ok) throw new Error("Error loading time_bank.json");
        return r.json();
      }),
      fetch("levels.json").then((r) => {
        if (!r.ok) throw new Error("Error loading levels.json");
        return r.json();
      }),
      fetch("badges.json").then((r) => {
        if (!r.ok) throw new Error("Error loading badges.json");
        return r.json();
      }),
    ]);
    timeBank = tb;
    levels = lv;
    badges = bd;
    renderLevels();
    renderBadges();
  } catch (err) {
    console.error("Failed to load game data:", err);
    alert("Hi ha hagut un error carregant les dades del joc. Si us plau, recarrega la pàgina.");
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((err) => console.error("SW registration failed", err));
  });
}
