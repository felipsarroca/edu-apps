const CONFIG = {
  timeLimit: 10,
  targetScore: 100,
  rankingMode: "appsScript",
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbzvg-w2yHKUGD9VMKPaqdaDIYDL9XhyT214gHtZ-SzdGwHfXQ7njXf2df9oypMPn26u/exec",
};

const state = {
  museum: "prado",
  playerName: "",
  score: 0,
  streak: 0,
  activeType: "title",
  works: [],
  order: [],
  index: 0,
  current: null,
  selectedTitle: null,
  selectedArtist: null,
  timerId: null,
  startTime: null,
  timeLeft: CONFIG.timeLimit,
  locked: false,
};

const els = {
  screenStart: document.getElementById("screen-start"),
  screenGame: document.getElementById("screen-game"),
  screenEnd: document.getElementById("screen-end"),
  playerName: document.getElementById("player-name"),
  segs: document.querySelectorAll(".seg"),
  btnStart: document.getElementById("btn-start"),
  btnDemo: document.getElementById("btn-demo"),
  btnRestart: document.getElementById("btn-restart"),
  btnRanking: document.getElementById("btn-ranking"),
  btnOpenRanking: document.getElementById("btn-open-ranking"),
  btnCloseRanking: document.getElementById("btn-close-ranking"),
  scoreValue: document.getElementById("score-value"),
  streakValue: document.getElementById("streak-value"),
  artImage: document.getElementById("art-image"),
  titleOptions: document.getElementById("title-options"),
  artistOptions: document.getElementById("artist-options"),
  timerBar: document.getElementById("timer-bar"),
  timerText: document.getElementById("timer-text"),
  feedback: document.getElementById("feedback"),
  finalScore: document.getElementById("final-score"),
  finalMessage: document.getElementById("final-message"),
  saveStatus: document.getElementById("save-status"),
  btnStop: document.getElementById("btn-stop"),
  titleBlock: document.getElementById("title-block"),
  artistBlock: document.getElementById("artist-block"),
  rankingModal: document.getElementById("ranking-modal"),
  rankingRows: document.getElementById("ranking-rows"),
  rankingNote: document.getElementById("ranking-note"),
};

const MAX_MUSEUM_RANKING_SCORE = 100;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setScreen(screen) {
  [els.screenStart, els.screenGame, els.screenEnd].forEach((el) => {
    el.classList.remove("active");
  });
  screen.classList.add("active");
  document.body.classList.remove("screen-start", "screen-game", "screen-end");
  if (screen === els.screenStart) document.body.classList.add("screen-start");
  if (screen === els.screenGame) document.body.classList.add("screen-game");
  if (screen === els.screenEnd) document.body.classList.add("screen-end");
}

function setMuseum(museum) {
  state.museum = museum;
  els.segs.forEach((seg) => {
    seg.classList.toggle("active", seg.dataset.museum === museum);
  });
}

async function loadMuseumData(museum) {
  const res = await fetch(`data/${museum}.json`);
  if (!res.ok) {
    throw new Error("No s'ha pogut carregar el JSON");
  }
  return res.json();
}

function updateStatus() {
  els.scoreValue.textContent = state.score;
  els.streakValue.textContent = state.streak;
}

function buildOptions(field, correctValue) {
  const pool = Array.from(new Set(state.works.map((w) => w[field]))).filter(
    (value) => value !== correctValue
  );
  const distractors = shuffle(pool).slice(0, 3);
  return shuffle([correctValue, ...distractors]);
}

function renderOptions(container, options, type) {
  container.innerHTML = "";
  options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = `option-btn option-${index}`;
    btn.type = "button";
    btn.textContent = opt;
    btn.dataset.value = opt;
    btn.dataset.type = type;
    btn.addEventListener("click", () => handleOptionSelect(btn));
    container.appendChild(btn);
  });
}

function startTimer() {
  clearInterval(state.timerId);
  state.startTime = performance.now();
  state.timerId = setInterval(() => {
    const elapsed = (performance.now() - state.startTime) / 1000;
    state.timeLeft = Math.max(0, CONFIG.timeLimit - elapsed);
    const ratio = state.timeLeft / CONFIG.timeLimit;
    els.timerBar.style.setProperty("--timer-scale", ratio);
    els.timerText.textContent = `${state.timeLeft.toFixed(1)} s`;
    els.timerText.classList.toggle("low", state.timeLeft <= 5);

    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      finalizeRound(false, true);
    }
  }, 100);
}

function startRound() {
  state.selectedTitle = null;
  state.selectedArtist = null;
  state.locked = false;
  els.feedback.textContent = "";
  els.feedback.classList.remove("good", "bad");
  state.activeType = Math.random() < 0.5 ? "title" : "artist";

  if (state.index >= state.order.length) {
    state.order = shuffle(state.works);
    state.index = 0;
  }

  state.current = state.order[state.index];
  state.index += 1;

  els.artImage.src = `assets/${state.museum}/${state.current.image}`;
  els.artImage.alt = `${state.current.title} - ${state.current.artist}`;
  els.artImage.classList.toggle("art-prado", state.museum === "prado");
  els.artImage.classList.toggle("art-reina", state.museum === "reina");

  const titleOptions = buildOptions("title", state.current.title);
  const artistOptions = buildOptions("artist", state.current.artist);

  if (state.activeType === "title") {
    els.titleBlock.classList.remove("hidden");
    els.artistBlock.classList.add("hidden");
    renderOptions(els.titleOptions, titleOptions, "title");
  } else {
    els.artistBlock.classList.remove("hidden");
    els.titleBlock.classList.add("hidden");
    renderOptions(els.artistOptions, artistOptions, "artist");
  }

  updateStatus();
  startTimer();
}

function handleOptionSelect(button) {
  if (state.locked) return;

  const { type, value } = button.dataset;
  if (type !== state.activeType) return;
  const container = type === "title" ? els.titleOptions : els.artistOptions;
  container.querySelectorAll(".option-btn").forEach((btn) => btn.classList.remove("selected"));
  button.classList.add("selected");

  if (type === "title") {
    state.selectedTitle = value;
  } else {
    state.selectedArtist = value;
  }

  finalizeRound(true, false);
}

function finalizeRound(isAnswered, isTimeout) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timerId);

  const elapsed = (performance.now() - state.startTime) / 1000;
  const correctTitle = state.selectedTitle === state.current.title;
  const correctArtist = state.selectedArtist === state.current.artist;
  const isCorrect = state.activeType === "title" ? correctTitle : correctArtist;

  revealAnswers(isCorrect);

  if (isCorrect) {
    let gained = 1;
    if (elapsed <= 2) {
      gained = 3;
    } else if (elapsed < 4) {
      gained = 2;
    }
    state.score += gained;
    state.streak += 1;
    els.feedback.innerHTML = `Correcte! <span class=\"delta\">+${gained} punts</span>`;
    els.feedback.classList.add("good");
  } else {
    state.streak = 0;
    state.score = Math.max(0, state.score - 1);
    els.feedback.innerHTML = isTimeout
      ? `Temps esgotat <span class=\"delta\">-1 punt</span>`
      : `Resposta incorrecta <span class=\"delta\">-1 punt</span>`;
    els.feedback.classList.add("bad");
  }

  updateStatus();

  if (state.score >= CONFIG.targetScore) {
    setTimeout(() => finishGame(), 900);
    return;
  }

  setTimeout(() => startRound(), 1400);
}

function revealAnswers(isCorrect) {
  if (state.activeType === "title") {
    highlightOptions(els.titleOptions, state.current.title, isCorrect);
  } else {
    highlightOptions(els.artistOptions, state.current.artist, isCorrect);
  }
}

function highlightOptions(container, correctValue, isCorrect) {
  container.querySelectorAll(".option-btn").forEach((btn) => {
    if (btn.dataset.value === correctValue) {
      btn.classList.add("correct");
    } else if (!isCorrect && btn.classList.contains("selected")) {
      btn.classList.add("wrong");
    }
    btn.disabled = true;
  });
}

function resetGame() {
  state.score = 0;
  state.streak = 0;
  state.index = 0;
  state.order = shuffle(state.works);
}

function finishGame(reason = "end") {
  clearInterval(state.timerId);
  els.finalScore.textContent = state.score;
  if (els.finalMessage) {
    els.finalMessage.textContent = "Has obtingut un total de...";
  }
  if (els.saveStatus) {
    els.saveStatus.classList.remove("done", "error");
    els.saveStatus.classList.add("hidden");
    els.saveStatus.setAttribute("hidden", "hidden");
  }
  setScreen(els.screenEnd);
  const shouldSave = state.score >= 25;
  if (els.saveStatus) {
    if (shouldSave) {
      els.saveStatus.classList.remove("hidden");
      els.saveStatus.removeAttribute("hidden");
      els.saveStatus.style.display = "inline-flex";
      els.saveStatus.querySelector(".save-text").textContent = "Enregistrant el teu resultat...";
    } else {
      els.saveStatus.classList.add("hidden");
      els.saveStatus.setAttribute("hidden", "hidden");
      els.saveStatus.style.display = "none";
      return;
    }
  }
  saveScore(state.museum, state.playerName, state.score).then((ok) => {
    if (!els.saveStatus || !shouldSave) return;
    els.saveStatus.classList.remove("error");
    if (ok) {
      els.saveStatus.classList.add("done");
      els.saveStatus.querySelector(".save-text").textContent = "Resultat enregistrat";
    } else {
      els.saveStatus.classList.add("error");
      els.saveStatus.querySelector(".save-text").textContent = "No s'ha pogut enregistrar";
    }
  });
}

function getLocalRankingKey(museum) {
  return `ranking_${museum}`;
}

function getLocalMuseumScore(museum, playerName) {
  if (!playerName) return 0;
  const key = playerName.trim().toLowerCase();
  return clampMuseumRankingScore(localStorage.getItem(`score_${museum}_${key}`) || 0);
}

function setLocalMuseumScore(museum, playerName, score) {
  if (!playerName) return;
  const key = playerName.trim().toLowerCase();
  localStorage.setItem(`score_${museum}_${key}`, String(clampMuseumRankingScore(score)));
}

function saveScoreLocal(museum, playerName, score) {
  if (!playerName) return;
  const normalizedScore = clampMuseumRankingScore(score);
  const key = getLocalRankingKey(museum);
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  const existing = data.find((item) => item.name.toLowerCase() === playerName.toLowerCase());

  if (existing) {
    if (normalizedScore > clampMuseumRankingScore(existing.score)) {
      existing.score = normalizedScore;
      existing.date = new Date().toISOString();
    }
  } else {
    data.push({ name: playerName, score: normalizedScore, date: new Date().toISOString() });
  }

  data.sort(compareMuseumEntries);
  localStorage.setItem(key, JSON.stringify(data.slice(0, 50)));
}

function getTopLocal(museum, limit = 10) {
  const key = getLocalRankingKey(museum);
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  return data.slice(0, limit);
}

function getAllLocal(museum) {
  const key = getLocalRankingKey(museum);
  return JSON.parse(localStorage.getItem(key) || "[]");
}

async function saveScore(museum, playerName, score) {
  if (!playerName) return false;
  setLocalMuseumScore(museum, playerName, score);
  const prado = getLocalMuseumScore("prado", playerName);
  const reina = getLocalMuseumScore("reina", playerName);

  if (CONFIG.rankingMode === "appsScript" && CONFIG.appsScriptUrl) {
    try {
      await fetch(CONFIG.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        mode: "no-cors",
        body: JSON.stringify({
          museum,
          playerName,
          prado,
          reina,
          clientTimestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  } else {
    saveScoreLocal(museum, playerName, score);
    return true;
  }
}

async function loadRanking() {
  if (CONFIG.rankingMode === "appsScript" && CONFIG.appsScriptUrl) {
    try {
      const res = await fetch(`${CONFIG.appsScriptUrl}?action=top10`);
      const data = await res.json();
      if (data.top) {
        renderRankingFromTop(data.top);
      } else {
        renderRanking(data.prado || [], data.reina || []);
      }
      els.rankingNote.textContent = "";
      return;
    } catch (err) {
      console.error(err);
    }
  }

  renderRanking(getAllLocal("prado"), getAllLocal("reina"));
  els.rankingNote.textContent = "";
}

function renderRankingFromTop(top) {
  const rows = top.map((row) => ({
    name: row.name,
    prado: clampMuseumRankingScore(row.prado || 0),
    reina: clampMuseumRankingScore(row.reina || 0),
    totalDate: row.totalDate || row.date || null,
    pradoDate: row.pradoDate || null,
    reinaDate: row.reinaDate || null,
  }));

  rows.forEach((row) => {
    row.total = row.prado + row.reina;
    row.achievementTs = getRankingAchievementTs(row);
  });
  rows.sort(compareRankingRows);

  els.rankingRows.innerHTML = "";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "ranking-empty";
    empty.innerHTML = `
      <div class="empty-icon">🏛️</div>
      Encara no hi ha dades
    `;
    els.rankingRows.appendChild(empty);
    return;
  }

  rows.slice(0, 50).forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "ranking-row";
    const medal = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
    const medalBadge = medal
      ? `<span class="medal ${medal}">${index + 1}</span>`
      : "";
    item.innerHTML = `
      <div class="rank-cell">${index + 1}</div>
      <div class="rank-name">${medalBadge}<span>${row.name}</span></div>
      <div class="rank-score">${formatScore(row.prado, MAX_MUSEUM_RANKING_SCORE)}</div>
      <div class="rank-score">${formatScore(row.reina, MAX_MUSEUM_RANKING_SCORE)}</div>
      <div class="rank-score">${formatScore(row.total, MAX_MUSEUM_RANKING_SCORE * 2)}</div>
    `;
    els.rankingRows.appendChild(item);
  });
}

function renderRanking(prado, reina) {
  const map = new Map();
  const add = (list, museum) => {
    list.forEach((item) => {
      const key = item.name.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: item.name.trim(),
          prado: 0,
          reina: 0,
          pradoDate: null,
          reinaDate: null,
        });
      }
      map.get(key)[museum] = clampMuseumRankingScore(item.score);
      map.get(key)[`${museum}Date`] = item.date || null;
    });
  };

  add(prado, "prado");
  add(reina, "reina");

  const rows = Array.from(map.values()).map((row) => ({
    ...row,
    total: row.prado + row.reina,
    achievementTs: getRankingAchievementTs(row),
  }));

  rows.sort(compareRankingRows);

  els.rankingRows.innerHTML = "";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "ranking-empty";
    empty.innerHTML = `
      <div class="empty-icon">🏛️</div>
      Encara no hi ha dades
    `;
    els.rankingRows.appendChild(empty);
    return;
  }

  rows.slice(0, 50).forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "ranking-row";
    const medal = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
    const medalBadge = medal
      ? `<span class="medal ${medal}">${index + 1}</span>`
      : "";
    item.innerHTML = `
      <div class="rank-cell">${index + 1}</div>
      <div class="rank-name">${medalBadge}<span>${row.name}</span></div>
      <div class="rank-score">${formatScore(row.prado, MAX_MUSEUM_RANKING_SCORE)}</div>
      <div class="rank-score">${formatScore(row.reina, MAX_MUSEUM_RANKING_SCORE)}</div>
      <div class="rank-score">${formatScore(row.total, MAX_MUSEUM_RANKING_SCORE * 2)}</div>
    `;
    els.rankingRows.appendChild(item);
  });
}

function clampMuseumRankingScore(value) {
  const numericValue = Number(value || 0);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.max(0, Math.min(MAX_MUSEUM_RANKING_SCORE, numericValue));
}

function toTimestamp(value) {
  if (!value) return Number.POSITIVE_INFINITY;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

function getRankingAchievementTs(row) {
  const explicitTotalTs = toTimestamp(row.totalDate);
  if (explicitTotalTs !== Number.POSITIVE_INFINITY) return explicitTotalTs;

  const museumTimestamps = [toTimestamp(row.pradoDate), toTimestamp(row.reinaDate)]
    .filter((timestamp) => timestamp !== Number.POSITIVE_INFINITY);

  if (!museumTimestamps.length) return Number.POSITIVE_INFINITY;
  return Math.max(...museumTimestamps);
}

function compareRankingRows(a, b) {
  if (b.total !== a.total) return b.total - a.total;
  if (a.achievementTs !== b.achievementTs) return a.achievementTs - b.achievementTs;
  return a.name.localeCompare(b.name, "ca");
}

function compareMuseumEntries(a, b) {
  const scoreDiff = clampMuseumRankingScore(b.score) - clampMuseumRankingScore(a.score);
  if (scoreDiff !== 0) return scoreDiff;
  const dateDiff = toTimestamp(a.date) - toTimestamp(b.date);
  if (dateDiff !== 0) return dateDiff;
  return a.name.localeCompare(b.name, "ca");
}

function formatScore(value, highlightValue) {
  if (value === highlightValue) {
    const cls = highlightValue === 200 ? "rank-200" : "rank-100";
    return `<span class="${cls}">${value}</span>`;
  }
  return value;
}

function openRanking() {
  loadRanking();
  els.rankingModal.showModal();
}

function init() {
  setMuseum("prado");
  setScreen(els.screenStart);
  const savedName = localStorage.getItem("playerName");
  if (savedName) {
    els.playerName.value = savedName;
    state.playerName = savedName;
  }

  els.segs.forEach((seg) => {
    seg.addEventListener("click", () => setMuseum(seg.dataset.museum));
  });

  els.btnStart.addEventListener("click", async () => {
    state.playerName = els.playerName.value.trim();
    if (state.playerName) {
      localStorage.setItem("playerName", state.playerName);
    }
    try {
      state.works = await loadMuseumData(state.museum);
    } catch (err) {
      alert("No s'han pogut carregar les dades.");
      return;
    }
    resetGame();
    updateStatus();
    setScreen(els.screenGame);
    startRound();
  });

  els.btnDemo.addEventListener("click", openRanking);
  if (els.btnOpenRanking) {
    els.btnOpenRanking.addEventListener("click", openRanking);
  }
  els.btnRanking.addEventListener("click", openRanking);
  els.btnCloseRanking.addEventListener("click", () => els.rankingModal.close());
  if (els.btnStop) {
    els.btnStop.addEventListener("click", () => finishGame("stopped"));
  }

  els.btnRestart.addEventListener("click", () => {
    setScreen(els.screenStart);
  });
}

init();

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
