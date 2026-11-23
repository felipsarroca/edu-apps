/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { levelItems, createDeck, buildOptions } from "./engine.js?v=4";

const $ = (id) => document.getElementById(id);
const el = {
  playerName: $("playerName"), profileForm: $("profileForm"), profileList: $("profileList"),
  profileHint: $("profileHint"), newBtn: $("newBtn"), playBtn: $("playBtn"),
  levelsList: $("levelsList"), badgesGrid: $("badgesGrid"),
  hudName: $("hudName"), hudLevel: $("hudLevel"), hudPoints: $("hudPoints"), hudBadges: $("hudBadges"),
  gameTitle: $("gameTitle"), gameBadge: $("gameBadge"), gamePoints: $("gamePoints"), gameStreak: $("gameStreak"),
  progressBar: $("progressBar"), progressFill: $("progressFill"), progressText: $("progressText"),
  gameArea: $("gameArea"), promptCard: $("promptCard"), optionsWrap: $("optionsWrap"), feedback: $("feedback"),
  levelModal: $("levelModal"), modalBadge: $("modalBadge"), modalTitle: $("modalTitle"), modalText: $("modalText"),
  modalNext: $("modalNext"), modalLevels: $("modalLevels"), confetti: $("confettiCanvas"),
  infoBtn: $("infoBtn"), infoModal: $("infoModal"), infoClose: $("infoClose"),
};

// ---------- Emmagatzematge segur ----------
const store = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* sense emmagatzematge */ } },
  remove(key) { try { localStorage.removeItem(key); } catch { /* sense emmagatzematge */ } },
};

// ---------- Estat ----------
let bank = [];
let levels = [];
let badges = [];

const emptyProfile = () => ({ name: "", unlockedLevel: 1, points: 0, badges: [], bestStreak: 0 });

const state = {
  profiles: {},
  profile: emptyProfile(),
  level: null,
  deck: null,
  question: null,
  correct: 0,
  streak: 0,
  maxStreak: 0,
  missedThis: false,
  busy: false,
};

const levelNum = (level) => parseInt(level.levelId.slice(1), 10);
const badgeOf = (level) => badges.find((b) => b.badgeId === level.badge);

// ---------- Navegació ----------
function go(screen) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.dataset.screen === screen));
  document.body.dataset.screen = screen;
  if (screen === "levels") renderLevels();
  if (screen === "badges") renderBadges();
  if (screen !== "game") syncHud();
  window.scrollTo(0, 0);
}

function syncHud() {
  const p = state.profile;
  el.hudName.textContent = p.name || "Sense perfil";
  el.hudLevel.textContent = `Nivell ${p.unlockedLevel || 1}`;
  el.hudPoints.textContent = p.points || 0;
  el.hudBadges.textContent = `${p.badges.length}/${badges.length || 12}`;
}

// ---------- Perfils ----------
function loadProfiles() {
  try { state.profiles = JSON.parse(store.get("leshores_profiles") || "{}") || {}; } catch { state.profiles = {}; }
  delete state.profiles[""];
  for (const [name, p] of Object.entries(state.profiles)) {
    state.profiles[name] = { ...emptyProfile(), ...p, name, badges: Array.isArray(p.badges) ? p.badges : [] };
  }
  const active = store.get("leshores_active");
  if (active && state.profiles[active]) state.profile = state.profiles[active];
  el.playerName.value = state.profile.name;
  renderProfileList();
  syncHud();
}

function persist() {
  if (state.profile.name) state.profiles[state.profile.name] = state.profile;
  store.set("leshores_profiles", JSON.stringify(state.profiles));
  if (state.profile.name) store.set("leshores_active", state.profile.name);
}

function selectProfile(name) {
  const clean = (name || "").trim().slice(0, 24);
  if (!clean) return;
  if (!state.profiles[clean]) state.profiles[clean] = { ...emptyProfile(), name: clean };
  state.profile = state.profiles[clean];
  el.playerName.value = clean;
  el.profileHint.hidden = true;
  persist();
  renderProfileList();
  syncHud();
}

function renderProfileList() {
  el.profileList.innerHTML = "";
  Object.keys(state.profiles).forEach((name) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = `profile-pill${state.profile.name === name ? " active" : ""}`;
    pill.textContent = name;
    pill.addEventListener("click", () => selectProfile(name));
    el.profileList.appendChild(pill);
  });
}

function needProfile() {
  if (state.profile.name) return false;
  go("home");
  el.profileHint.hidden = false;
  el.playerName.focus();
  return true;
}

// ---------- Rellotge ----------
function clockSvg(item, style = { numbers: true, marks: "all" }, extraClass = "") {
  const c = 120;
  const hourAngle = (item.h % 12) * 30 + item.m * 0.5;
  const minuteAngle = item.m * 6;
  const point = (deg, r) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [(c + Math.cos(rad) * r).toFixed(2), (c + Math.sin(rad) * r).toFixed(2)];
  };
  let marks = "";
  if (style.marks !== "none") {
    for (let i = 0; i < 60; i += 1) {
      const major = i % 5 === 0;
      if (style.marks === "hoursOnly" && !major) continue;
      const [x1, y1] = point(i * 6, 96);
      const [x2, y2] = point(i * 6, major ? 84 : 90);
      marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="tick${major ? " major" : ""}"/>`;
    }
  }
  let numbers = "";
  if (style.numbers) {
    for (let i = 1; i <= 12; i += 1) {
      const [x, y] = point(i * 30, 71);
      numbers += `<text x="${x}" y="${y}" class="num">${i}</text>`;
    }
  }
  return `<svg class="clock-svg ${extraClass}" viewBox="0 0 240 240" role="img" aria-label="Rellotge">
    <circle cx="${c}" cy="${c}" r="106" class="clock-face"/>
    ${marks}${numbers}
    <line x1="${c}" y1="${c}" x2="${c}" y2="${c - 52}" class="hand hour" transform="rotate(${hourAngle} ${c} ${c})"/>
    <line x1="${c}" y1="${c}" x2="${c}" y2="${c - 80}" class="hand minute" transform="rotate(${minuteAngle} ${c} ${c})"/>
    <circle cx="${c}" cy="${c}" r="5" class="pin"/>
  </svg>`;
}

const phrase = (item, level) => {
  const t = item[level.text || "quarts"];
  return t.charAt(0).toUpperCase() + t.slice(1);
};

// ---------- Joc ----------
function startLevel(levelId) {
  if (needProfile()) return;
  const level = levels.find((l) => l.levelId === levelId) || levels[0];
  state.level = level;
  state.deck = createDeck(levelItems(level, bank));
  state.correct = 0;
  state.streak = 0;
  state.maxStreak = 0;

  const badge = badgeOf(level);
  el.gameBadge.textContent = badge ? badge.icon : "";
  el.gameBadge.classList.toggle("earned", !!badge && state.profile.badges.includes(badge.badgeId));
  el.gameBadge.title = badge ? `Insígnia: ${badge.name}` : "";
  el.gameTitle.textContent = `Nivell ${levelNum(level)} · ${level.title}`;
  el.gameArea.dataset.mode = level.mode;
  el.progressBar.setAttribute("aria-valuemax", level.goal.correct);
  updateGameHud();
  go("game");
  nextQuestion();
}

function updateGameHud() {
  const goal = state.level.goal.correct;
  const done = Math.min(state.correct, goal);
  el.progressFill.style.width = `${(done / goal) * 100}%`;
  el.progressText.textContent = `${done}/${goal}`;
  el.progressBar.setAttribute("aria-valuenow", done);
  el.gamePoints.textContent = state.profile.points;
  el.gameStreak.textContent = state.streak;
  el.gameStreak.parentElement.classList.toggle("hot", state.streak >= state.level.goal.streak);
}

function nextQuestion() {
  const level = state.level;
  const item = state.deck.next();
  state.question = { item, options: buildOptions(item, level, bank) };
  state.missedThis = false;
  state.busy = false;
  el.feedback.textContent = "";
  el.feedback.className = "feedback";

  if (level.mode === "textToClock") {
    el.promptCard.innerHTML = `<div class="prompt-label">Tria el rellotge que marca</div>
      <div class="prompt-text">${phrase(item, level)}</div>`;
  } else {
    el.promptCard.innerHTML = clockSvg(item, level.clockStyle);
  }

  el.optionsWrap.innerHTML = "";
  state.question.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.id = opt.id;
    if (level.mode === "textToClock") {
      btn.classList.add("option-clock");
      btn.innerHTML = clockSvg(opt, level.clockStyle);
      btn.setAttribute("aria-label", `Opció ${i + 1}`);
    } else if (level.mode === "say") {
      btn.classList.add("option-text");
      btn.textContent = phrase(opt, level);
    } else {
      btn.textContent = opt.digital;
    }
    btn.addEventListener("click", () => answer(btn, opt));
    el.optionsWrap.appendChild(btn);
  });
}

function answer(btn, opt) {
  if (state.busy || btn.disabled) return;
  const { item } = state.question;
  const level = state.level;

  if (opt.id === item.id) {
    state.busy = true;
    btn.classList.add("correct");
    el.optionsWrap.querySelectorAll(".option-btn").forEach((b) => (b.disabled = true));
    state.correct += 1;
    state.streak += 1;
    state.profile.points += level.points;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    state.profile.bestStreak = Math.max(state.profile.bestStreak || 0, state.maxStreak);
    showFeedback(state.missedThis ? "Ara sí!" : `Correcte! +${level.points}`, "ok");
    sound(state.missedThis ? "soft" : "ok");
    persist();
    updateGameHud();

    if (state.correct >= level.goal.correct) {
      setTimeout(() => (state.maxStreak >= level.goal.streak ? finishLevel() : showRetry()), 650);
    } else {
      setTimeout(nextQuestion, 850);
    }
    return;
  }

  state.missedThis = true;
  state.streak = 0;
  btn.classList.add("wrong");
  btn.disabled = true;
  showFeedback("Gairebé! Torna-ho a provar.", "ko");
  sound("ko");
  updateGameHud();
}

function showFeedback(text, kind) {
  el.feedback.textContent = text;
  el.feedback.className = `feedback show ${kind}`;
}

// ---------- Final de nivell ----------
function openModal({ icon, title, text, nextLabel, onNext, levelsLabel = "Torna als nivells" }) {
  el.modalBadge.textContent = icon;
  el.modalTitle.textContent = title;
  el.modalText.textContent = text;
  el.modalNext.hidden = !onNext;
  el.modalNext.textContent = nextLabel || "";
  el.modalLevels.textContent = levelsLabel;
  el.modalNext.onclick = () => { closeModal(el.levelModal); onNext(); };
  el.modalLevels.onclick = () => { closeModal(el.levelModal); go("levels"); };
  el.levelModal.classList.add("active");
  (onNext ? el.modalNext : el.modalLevels).focus();
}

function closeModal(modal) {
  modal.classList.remove("active");
}

function showRetry() {
  const level = state.level;
  openModal({
    icon: "💪",
    title: `${level.goal.correct} encerts al nivell ${levelNum(level)}!`,
    text: `Per superar-lo cal fer ${level.goal.streak} encerts seguits sense errades. La teva millor ratxa ha estat de ${state.maxStreak}. Torna-ho a provar!`,
    nextLabel: "Repeteix el nivell",
    onNext: () => startLevel(level.levelId),
  });
}

function finishLevel() {
  const level = state.level;
  const num = levelNum(level);
  const badge = badgeOf(level);
  const isNew = badge && !state.profile.badges.includes(badge.badgeId);
  if (isNew) state.profile.badges.push(badge.badgeId);
  const next = levels.find((l) => levelNum(l) === num + 1);
  if (next) state.profile.unlockedLevel = Math.max(state.profile.unlockedLevel, num + 1);
  persist();

  openModal({
    icon: badge ? badge.icon : "🏅",
    title: `Nivell ${num} superat!`,
    text: next
      ? `${isNew ? `Nova insígnia: «${badge.name}». ` : ""}Vols provar el nivell ${num + 1}?`
      : "Has completat tots els nivells. Ets un mestre del rellotge!",
    nextLabel: next ? "Següent nivell" : "",
    onNext: next ? () => startLevel(next.levelId) : null,
  });
  startConfetti();
  sound("win");
}

// ---------- Nivells i insígnies ----------
function renderLevels() {
  el.levelsList.innerHTML = "";
  levels.forEach((level) => {
    const num = levelNum(level);
    const locked = num > state.profile.unlockedLevel;
    const badge = badgeOf(level);
    const earned = badge && state.profile.badges.includes(badge.badgeId);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `level-item${locked ? " locked" : ""}${earned ? " done" : ""}`;
    btn.disabled = locked;
    btn.innerHTML = `
      <span class="level-num">${num}</span>
      <span class="level-body">
        <strong>${level.title}</strong>
        <span class="meta">${level.description}</span>
      </span>
      <span class="level-state" aria-hidden="true">${locked
        ? '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'
        : earned ? `<span class="level-badge">${badge.icon}</span>` : '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" class="fill"/></svg>'}</span>`;
    btn.setAttribute("aria-label", `Nivell ${num}: ${level.title}${locked ? " (bloquejat)" : earned ? " (superat)" : ""}`);
    btn.addEventListener("click", () => startLevel(level.levelId));
    el.levelsList.appendChild(btn);
  });
}

function renderBadges() {
  el.badgesGrid.innerHTML = "";
  badges.forEach((badge, i) => {
    const earned = state.profile.badges.includes(badge.badgeId);
    const card = document.createElement("div");
    card.className = `badge${earned ? " earned" : ""}`;
    card.innerHTML = `
      <div class="icon" aria-hidden="true">${badge.icon}</div>
      <div class="badge-text"><strong>${badge.name}</strong>
      <span class="desc">${earned ? badge.description : `Supera el nivell ${i + 1}`}</span></div>`;
    el.badgesGrid.appendChild(card);
  });
}

// ---------- So (Web Audio, sense fitxers) ----------
let audioCtx = null;
function sound(kind) {
  if (store.get("leshores_sound") === "0") return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = { ok: [660, 880], soft: [520], ko: [220, 180], win: [523, 659, 784, 1047] }[kind] || [];
    notes.forEach((f, i) => {
      const t = audioCtx.currentTime + i * (kind === "win" ? 0.13 : 0.09);
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = kind === "ko" ? "triangle" : "sine";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch { /* sense àudio */ }
}

// ---------- Confeti ----------
let confettiFrame = null;
function startConfetti() {
  const canvas = el.confetti;
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ["#ff4b5c", "#34d399", "#5a78ff", "#ffb703", "#ff8fc7"];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * -canvas.height,
    r: 3 + Math.random() * 4, c: colors[Math.floor(Math.random() * colors.length)],
    v: 2 + Math.random() * 3, w: -1 + Math.random() * 2,
  }));
  const start = performance.now();
  cancelAnimationFrame(confettiFrame);
  (function draw(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.v; p.x += p.w;
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    });
    if (now - start < 2200) confettiFrame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })(start);
}

// ---------- Opcions ----------
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll("[data-theme-btn]").forEach((b) => b.classList.toggle("active", b.dataset.themeBtn === theme));
}
function applySound(on) {
  document.querySelectorAll("[data-sound]").forEach((b) => b.classList.toggle("active", b.dataset.sound === (on ? "1" : "0")));
}

document.querySelectorAll("[data-theme-btn]").forEach((b) => b.addEventListener("click", () => {
  store.set("leshores_theme", b.dataset.themeBtn);
  applyTheme(b.dataset.themeBtn);
}));
document.querySelectorAll("[data-sound]").forEach((b) => b.addEventListener("click", () => {
  store.set("leshores_sound", b.dataset.sound);
  applySound(b.dataset.sound === "1");
  if (b.dataset.sound === "1") sound("ok");
}));

// ---------- Esdeveniments ----------
document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
el.profileForm.addEventListener("submit", (e) => { e.preventDefault(); selectProfile(el.playerName.value); });
el.newBtn.addEventListener("click", () => {
  state.profile = emptyProfile();
  el.playerName.value = "";
  store.remove("leshores_active");
  renderProfileList();
  syncHud();
  el.playerName.focus();
});
el.infoBtn.addEventListener("click", () => { el.infoModal.classList.add("active"); el.infoClose.focus(); });
el.infoClose.addEventListener("click", () => closeModal(el.infoModal));
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (el.infoModal.classList.contains("active")) closeModal(el.infoModal);
});

// El peu és fix: el contingut li reserva exactament la seva alçada.
const footer = document.querySelector(".felip-app-footer");
const setFooterHeight = () => document.documentElement.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
if (footer) {
  setFooterHeight();
  if ("ResizeObserver" in window) new ResizeObserver(setFooterHeight).observe(footer);
}

// ---------- Arrencada ----------
applyTheme(store.get("leshores_theme") || "light");
applySound(store.get("leshores_sound") !== "0");
loadProfiles();

const ready = Promise.all(
  ["time_bank.json", "levels.json", "badges.json"].map((f) => fetch(`${f}?v=4`).then((r) => r.json()))
).then(([tb, lv, bd]) => {
  bank = tb;
  levels = lv;
  badges = bd;
  syncHud();
}).catch(() => {
  document.querySelector(".profile-card").insertAdjacentHTML("beforeend",
    '<p class="hint error">No s\'han pogut carregar les dades. Torna a carregar la pàgina.</p>');
});

el.playBtn.addEventListener("click", async () => {
  await ready;
  if (needProfile()) return;
  const target = Math.min(state.profile.unlockedLevel || 1, levels.length);
  startLevel(`L${target}`);
});

// Accés directe per a proves: index.html#L5 obre aquest nivell si està desbloquejat.
ready.then(() => {
  const m = location.hash.match(/^#L(\d+)$/);
  if (m && state.profile.name && Number(m[1]) <= state.profile.unlockedLevel) startLevel(`L${m[1]}`);
});
