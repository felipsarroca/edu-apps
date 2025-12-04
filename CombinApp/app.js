// CombinApp - lògica principal

const FORMULA_CATALOG = [
  { id: "permutacio_simple", nom: "Permutació simple", expressio: "P_n = n!", descripcio: "Ordenar tots els n elements diferents." },
  { id: "permutacio_amb_repeticio", nom: "Permutació amb repetició", expressio: "PR_n^{a,b,...} = \\dfrac{n!}{a! \\cdot b! \\cdot ...}", descripcio: "Ordenar n elements amb multiplicitats." },
  { id: "variacio_simple", nom: "Variació simple", expressio: "V_{n,m} = \\dfrac{n!}{(n-m)!}", descripcio: "Ordenar m elements triats d'entre n." },
  { id: "variacio_amb_repeticio", nom: "Variació amb repetició", expressio: "VR_{n,m} = n^m", descripcio: "Disposar m elements amb repetició permesa." },
  { id: "combinacio_simple", nom: "Combinació simple", expressio: "C_{n,m} = \\dfrac{n!}{m!\\cdot(n-m)!}", descripcio: "Triar m elements sense ordre ni repetició." },
  { id: "combinacio_amb_repeticio", nom: "Combinació amb repetició", expressio: "CR_{n,m} = \\dfrac{(n+m-1)!}{m!\\cdot(n-1)!}", descripcio: "Triar m elements sense ordre amb repetició." }
];

const HINTS_GENERALS = {
  pas1: ["Pensa si l'ordre canvia el resultat i si pots repetir elements.", "Si agafes tots els elements, marca-ho com a m = n."],
  pas2: ["Ordre i repetició determinen variació/permutació. Sense ordre: combinació."],
  pas3: ["n és el total disponible; m el que col·loques.", "Sense repetició: m no pot superar n."]
};

// Petita col·lecció incrustada per quan el fetch dels JSON falla (ex. obert amb file://)
const EMBEDDED_SAMPLE = [
  {
    id: "S1",
    nivell: "Fàcil ★",
    titol: "Llibres en una lleixa",
    enunciat: "Tens 4 llibres tots diferents i els vols ordenar en una lleixa en línia. Quantes ordres diferents hi ha?",
    ordre: true,
    repeticio: false,
    tots: true,
    n_correcte: 4,
    m_correcte: 4,
    tipus: "permutacio_simple",
    formula_id: "permutacio_simple",
    resultat: 24,
    explicacio_final: "Permutació simple de 4 llibres: 4! = 24.",
    pistes: { pas1: ["Uses tots els llibres?", "Si canvies dos llibres, canvia l'ordre?"], pas2: ["Ordre sí i tots: permutació simple."], pas3: ["n = 4 llibres, m = 4 llocs."] },
    solucions_parcials: { pas1: { ordre: true, repeticio: false, tots: true }, pas2: { tipus: "permutacio_simple", formula_id: "permutacio_simple" }, pas3: { n: 4, m: 4 } }
  },
  {
    id: "S2",
    nivell: "Fàcil ★",
    titol: "Podi de 6 atletes",
    enunciat: "Hi ha 6 atletes i 3 llocs al podi. Quants podis diferents es poden formar sense repetir atletes?",
    ordre: true,
    repeticio: false,
    tots: false,
    n_correcte: 6,
    m_correcte: 3,
    tipus: "variacio_simple",
    formula_id: "variacio_simple",
    resultat: 120,
    explicacio_final: "Variació simple: 6! / 3! = 120 podis.",
    pistes: { pas1: ["Importa l'ordre del podi.", "No es repeteixen atletes."], pas2: ["Ordre sí + sense repetició + no tots: variació simple."], pas3: ["n = 6, m = 3."] },
    solucions_parcials: { pas1: { ordre: true, repeticio: false, tots: false }, pas2: { tipus: "variacio_simple", formula_id: "variacio_simple" }, pas3: { n: 6, m: 3 } }
  },
  {
    id: "S3",
    nivell: "Fàcil ★",
    titol: "Codi de dos dígits",
    enunciat: "Un codi curt té 2 dígits del 0 al 9 i es poden repetir. Quants codis diferents hi ha?",
    ordre: true,
    repeticio: true,
    tots: false,
    n_correcte: 10,
    m_correcte: 2,
    tipus: "variacio_amb_repeticio",
    formula_id: "variacio_amb_repeticio",
    resultat: 100,
    explicacio_final: "Variació amb repetició: 10^2 = 100 codis.",
    pistes: { pas1: ["Es poden repetir dígits.", "L'ordre importa."], pas2: ["Ordre sí + repetició sí: n^m."], pas3: ["n = 10, m = 2."] },
    solucions_parcials: { pas1: { ordre: true, repeticio: true, tots: false }, pas2: { tipus: "variacio_amb_repeticio", formula_id: "variacio_amb_repeticio" }, pas3: { n: 10, m: 2 } }
  },
  {
    id: "S4",
    nivell: "Fàcil ★",
    titol: "Comitè de 2",
    enunciat: "D'entre 5 alumnes es volen triar 2 per fer un petit comitè. Quantes maneres hi ha?",
    ordre: false,
    repeticio: false,
    tots: false,
    n_correcte: 5,
    m_correcte: 2,
    tipus: "combinacio_simple",
    formula_id: "combinacio_simple",
    resultat: 10,
    explicacio_final: "Combinació simple: C(5,2) = 10.",
    pistes: { pas1: ["No importa l'ordre.", "Cap alumne es repeteix."], pas2: ["Sense ordre i sense repetició: combinació simple."], pas3: ["n = 5, m = 2."] },
    solucions_parcials: { pas1: { ordre: false, repeticio: false, tots: false }, pas2: { tipus: "combinacio_simple", formula_id: "combinacio_simple" }, pas3: { n: 5, m: 2 } }
  },
  {
    id: "S5",
    nivell: "Fàcil ★",
    titol: "Gelat de dues boles",
    enunciat: "Hi ha 4 gustos de gelat i vols un cucurutxo de 2 boles sense ordre i amb repetició. Quants gelats diferents hi ha?",
    ordre: false,
    repeticio: true,
    tots: false,
    n_correcte: 4,
    m_correcte: 2,
    tipus: "combinacio_amb_repeticio",
    formula_id: "combinacio_amb_repeticio",
    resultat: 10,
    explicacio_final: "Combinació amb repetició: C(5,2) = 10.",
    pistes: { pas1: ["L'ordre no importa.", "Es poden repetir gustos."], pas2: ["Sense ordre amb repetició: combinació amb repetició."], pas3: ["n = 4, m = 2."] },
    solucions_parcials: { pas1: { ordre: false, repeticio: true, tots: false }, pas2: { tipus: "combinacio_amb_repeticio", formula_id: "combinacio_amb_repeticio" }, pas3: { n: 4, m: 2 } }
  }
];

const PROBLEM_FILES = [
  { path: "problems-facil.json", etiqueta: "Fàcil ★" },
  { path: "problems-mitja.json", etiqueta: "Mitjà ★★" },
  { path: "problems-dificil.json", etiqueta: "Difícil ★★★" }
];

let PROBLEMS = [];

const state = {
  currentScreen: "screen-mode-selection",
  mode: null,
  selectedProblem: null,
  problemsLoaded: false,
  userAnswers: {
    ordre: null,
    repeticio: null,
    tots: null,
    tipus: null,
    formula_id: null,
    n: null,
    m: null,
    multiplicitats: []
  },
  computedResult: null,
  errors: []
};

const elements = {
  screens: document.querySelectorAll(".screen"),
  levelFilter: document.getElementById("level-filter"),
  problemSelect: document.getElementById("problem-select"),
  problemStatement: document.getElementById("problem-statement"),
  contextTitle: document.getElementById("context-title"),
  contextEnunciat: document.getElementById("context-enunciat"),
  contextMeta: document.getElementById("context-meta"),
  contextIcon: document.getElementById("context-icon"),
  contextPanel: document.getElementById("context-panel"),
  classificationQuestions: document.getElementById("classification-questions"),
  typeFormulaSelection: document.getElementById("type-formula-selection"),
  nmInputs: document.getElementById("n-m-inputs"),
  calculationResults: document.getElementById("calculation-results"),
  toast: document.getElementById("toast"),
  progressBadges: document.querySelectorAll("[data-step-id]")
};

function logError(message) {
  state.errors.unshift({ message, timestamp: new Date().toLocaleTimeString() });
  state.errors = state.errors.slice(0, 5);
}

function renderErrors() {}
function updateValidationSummary() {}

const SCREEN_TO_STEP = {
  "screen-mode-selection": "mode",
  "screen-problem-picker": "problema",
  "screen-step-1": "tipus",
  "screen-step-2": "formula",
  "screen-step-3": "dades",
  "screen-step-4": "calcul"
};

function setContextContent(title, enunciat, metaHtml = "") {
  if (elements.contextTitle) elements.contextTitle.textContent = title || "Combinatòria";
  if (elements.contextEnunciat) elements.contextEnunciat.textContent = enunciat || "Selecciona un problema per veure l'enunciat.";
  if (elements.contextMeta) elements.contextMeta.innerHTML = metaHtml;
  if (elements.contextIcon) {
    const firstLetter = (title || "?").charAt(0).toUpperCase();
    elements.contextIcon.textContent = firstLetter;
  }
}

function setContextHome() {
  setContextContent("Enunciat", "Selecciona el mode i un problema per veure'l a la vista.", "");
}

function setContextFromProblem(problem) {
  if (!problem) return setContextHome();
  setContextContent(problem.titol, problem.enunciat, "");
}

function setContextFreeMode() {
  setContextContent("Calculadora guiada", "Introdueix n, m i condicions. El sistema comprova coherència.", "");
}

function resetUserAnswers() {
  state.userAnswers = { ordre: null, repeticio: null, tots: null, tipus: null, formula_id: null, n: null, m: null, multiplicitats: [] };
}

function resetState() {
  resetUserAnswers();
  state.currentScreen = "screen-mode-selection";
  state.mode = null;
  state.selectedProblem = null;
  state.computedResult = null;
  setContextHome();
  navigateTo("screen-mode-selection");
}

function navigateTo(screenId) {
  state.currentScreen = screenId;
  elements.screens.forEach((screen) => screen.classList.toggle("active", screen.id === screenId));
  document.getElementById("main-content").scrollTop = 0;
  updateProgress();
  updateContextVisibility();
  updateClassificationVisual();
}

function updateProgress() {
  const currentStep = SCREEN_TO_STEP[state.currentScreen] || "mode";
  elements.progressBadges.forEach((badge) => {
    const stepId = badge.dataset.stepId;
    badge.classList.toggle("current", stepId === currentStep);
    badge.classList.toggle("done", isStepDone(stepId));
    badge.classList.toggle("clickable", stepId !== currentStep && isStepDone(currentStep));
  });
}

function isStepDone(stepId) {
  switch (stepId) {
    case "mode":
      return state.mode !== null;
    case "problema":
      return state.mode === "B" || !!state.selectedProblem;
    case "tipus":
      return state.userAnswers.ordre !== null && state.userAnswers.repeticio !== null && state.userAnswers.tots !== null;
    case "formula":
      return isStepDone("tipus") && state.userAnswers.formula_id !== null;
    case "dades":
      return isStepDone("formula") && state.userAnswers.n !== null && state.userAnswers.m !== null;
    case "calcul":
      return isStepDone("dades") && state.computedResult !== null;
    default:
      return false;
  }
}

function updateSummaryChips() {
  return;
  if (!elements.summaryChips) return;
  /*
    ordre === null ? "ordre: ?" : ordre ? "ordre: sí" : "ordre: no",
    repeticio === null ? "repetició: ?" : repeticio ? "repetició: sí" : "repetició: no",
    tots === null ? "tots: ?" : tots ? "tots els elements" : "només alguns",
    n !== null ? `n = ${n}` : "n = ?",
    m !== null ? `m = ${m}` : "m = ?",
    tipus ? tipus.replace(/_/g, " ") : "tipus: pendent"
  ];
  let pathText =
    ordre === null || repeticio === null || tots === null
      ? "Respon les tres preguntes per veure la ruta."
      : `${ordre ? "Ordre s?" : "Ordre no"} → ${repeticio ? "Repetici? s?" : "Sense repetici?"} → ${tots ? "m = n" : "m < n"}`;
  */
}

function updateContextVisibility() {
  const show = state.mode === "A" && state.currentScreen !== "screen-mode-selection";
  if (elements.contextPanel) elements.contextPanel.classList.toggle("hidden", !show);
}

function formatTypeLabel(typeId) {
  const entry = FORMULA_CATALOG.find((f) => f.id === typeId);
  return entry ? entry.nom : typeId || "";
}

function updateClassificationVisual() {
  const container = document.getElementById("classification-visual");
  if (!container) return;
  const { ordre, repeticio, tots } = state.userAnswers;
  const type = deduceTypeFromClassification();
  const typeEntry = type ? FORMULA_CATALOG.find((f) => f.id === type) : null;
  return renderClassificationMatrixTable(container, ordre, repeticio, tots, type, typeEntry);
}

function renderClassificationMatrix(container, ordre, repeticio, tots, type, typeEntry) {
  const nodes = [
    {
      label: "Ordre",
      value: ordre === null ? "Pendent" : ordre ? "Importa l'ordre" : "No importa l'ordre",
      state: ordre === null ? "pending" : "done"
    },
    {
      label: "Repetició",
      value: repeticio === null ? "Pendent" : repeticio ? "Hi ha repetició" : "Sense repetició",
      state: repeticio === null ? "pending" : "done"
    },
    {
      label: "Agafes tots?",
      value: tots === null ? "Pendent" : tots ? "m = n (tots)" : "Només alguns",
      state: tots === null ? "pending" : "done"
    }
  ];

  let pathText =
    ordre === null || repeticio === null || tots === null
      ? "Respon les tres preguntes per veure la ruta."
      : `${ordre ? "Ordre s?" : "Ordre no"} → ${repeticio ? "Repetici? s?" : "Sense repetici?"} → ${tots ? "m = n" : "m < n"}`;

  // Normalitza el text del camí per evitar codificacions rares
  pathText = ordre === null || repeticio === null || tots === null
    ? "Respon les tres preguntes per veure la ruta."
    : `${ordre ? "Ordre si" : "Ordre no"} -> ${repeticio ? "Repeticio si" : "Sense repeticio"} -> ${tots ? "m = n" : "m < n"}`;

  container.innerHTML = `
    <h3>Mapa de classificació</h3>
    <p class="microcopy">Es pinta a mesura que respons.</p>
    <div class="flow-grid">
      ${nodes
        .map((n) => `<div class="flow-node ${n.state}"><span class="status-dot"></span><p class="eyebrow">${n.label}</p><strong>${n.value}</strong></div>`)
        .join("")}
    </div>
    <div class="flow-path">${pathText}</div>
    <div class="flow-footer ${type ? "complete" : ""}">
      <p class="eyebrow">Tipus suggerit</p>
      <div class="flow-type">${type ? formatTypeLabel(type) : "Respon totes les preguntes"}</div>
      <p class="microcopy">${type ? typeEntry?.descripcio || "" : "Quan responguis, es destacarà el tipus que toca."}</p>
    </div>
  `;
}

// Nova versio basada en taula de doble entrada
function renderClassificationMatrixTable(container, ordre, repeticio, tots, type, typeEntry) {
  const columnDefs = [
    { key: "ordre_si_tots_si", ordre: true, tots: true, label: "S\u00cd", sub: "S\u00cd" },
    { key: "ordre_si_tots_no", ordre: true, tots: false, label: "S\u00cd", sub: "No" },
    { key: "ordre_no", ordre: false, tots: null, label: "No", sub: "" }
  ];

  const rowDefs = [
    { label: "S\u00cd", repeticio: true },
    { label: "No", repeticio: false }
  ];

  const cellLookup = (ordreVal, repeticioVal, mEqualsN) => {
    if (ordreVal) {
      if (repeticioVal && mEqualsN === true) return { main: "PR", sub: "Permutació amb repetició" };
      if (repeticioVal && mEqualsN === false) return { main: "VR", sub: "Variació amb repetició" };
      if (!repeticioVal && mEqualsN === true) return { main: "P", sub: "Permutació simple" };
      if (!repeticioVal && mEqualsN === false) return { main: "V", sub: "Variació simple" };
    }
    if (repeticioVal) return { main: "CR", sub: "Combinació amb repetició" };
    return { main: "C", sub: "Combinació simple" };
  };

  const answeredOrder = ordre !== null;
  const answeredRep = repeticio !== null;
  const answeredTots = tots !== null;

  const highlightClassForCell = (cellOrdre, cellRepeticio, cellTots) => {
    let highlight = false;
    let intensity = "soft";

    if (answeredOrder && answeredRep) {
      highlight = cellOrdre === ordre && cellRepeticio === repeticio;
      intensity = "strong";
    } else if (answeredOrder || answeredRep) {
      highlight = (answeredOrder && cellOrdre === ordre) || (answeredRep && cellRepeticio === repeticio);
    }

    if (answeredTots && cellOrdre) {
      highlight = highlight && cellTots === tots;
    }

    if (!highlight) return "";
    const classes = ["active-cell"];
    if (intensity === "strong") classes.push("strong");
    if (answeredTots && cellOrdre) classes.push("filtered-by-m");
    return classes.join(" ");
  };

  const columnClass = (col) => {
    if (answeredOrder && col.ordre === ordre) return "active-col";
    return "";
  };

  const rowClass = (row) => {
    if (answeredRep && row.repeticio === repeticio) return "row-highlight";
    return "";
  };

  const pathText =
    ordre === null || repeticio === null || tots === null
      ? "Respon les tres preguntes per veure la ruta."
      : `${ordre ? "Ordre sí" : "Ordre no"} -> ${repeticio ? "Repetició sí" : "Sense repetició"} -> ${tots ? "m = n" : "m < n"}`;

  container.innerHTML = `
    <h3>Mapa de classificació</h3>
    <p class="microcopy">Es pinta a mesura que respons.</p>
    <table class="flow-table classification-table">
      <thead>
        <tr class="super-head">
          <th class="empty-cell" rowspan="3"></th>
          <th class="empty-cell" rowspan="3"></th>
          <th colspan="3">Importa l'ordre?</th>
        </tr>
        <tr class="mid-head">
          <th colspan="2">S\u00cd</th>
          <th rowspan="2">No</th>
        </tr>
        <tr class="sub-head">
          <th>S\u00cd s'agafen tots</th>
          <th>No s'agafen tots</th>
        </tr>
      </thead>
      <tbody>
        ${rowDefs
          .map((row, idx) => {
            const cells = columnDefs
              .map((col) => {
                const cell = cellLookup(col.ordre, row.repeticio, col.tots);
                const highlight = highlightClassForCell(col.ordre, row.repeticio, col.tots);
                return `<td class="${highlight} ${columnClass(col)}" data-ordre="${col.ordre}" data-repeticio="${row.repeticio}" data-tots="${col.tots}">
                  <div class="cell-main">${cell.main}</div>
                  ${cell.sub ? `<div class="cell-sub">${cell.sub}</div>` : ""}
                </td>`;
              })
              .join("");
            const questionCell = idx === 0 ? `<th class="row-question-cell" rowspan="${rowDefs.length}">Hi ha repetició?</th>` : "";
            const leftHeader = `<th class="row-label ${rowClass(row)}">${row.label}</th>`;
            return `<tr data-repeticio="${row.repeticio}">${questionCell}${leftHeader}${cells}</tr>`;
          })
          .join("")}
      </tbody>
    </table>
    <div class="flow-footer ${type ? "complete" : ""}">
      <p class="eyebrow">Tipus suggerit</p>
      <div class="flow-type">${type ? formatTypeLabel(type) : "Respon totes les preguntes"}</div>
      <p class="microcopy">${type ? typeEntry?.descripcio || "" : "Quan responguis, es destacara el tipus que toca."}</p>
    </div>
  `;
}

async function loadAllProblems() {
  if (state.problemsLoaded) return PROBLEMS;
  if (window.location.protocol === "file:") {
    PROBLEMS = EMBEDDED_SAMPLE;
    state.problemsLoaded = true;
    return PROBLEMS;
  }
  try {
    const results = await Promise.all(
      PROBLEM_FILES.map(async (file) => {
        const res = await fetch(file.path);
        if (!res.ok) throw new Error(`No s'ha pogut carregar ${file.path}`);
        const data = await res.json();
        return data.map((p) => ({ ...p, nivell: p.nivell || file.etiqueta }));
      })
    );
    PROBLEMS = results.flat();
    state.problemsLoaded = true;
  } catch (err) {
    console.error(err);
    showToast("No s'han pogut carregar els problemes (fitxers JSON). Es mostra un conjunt de mostra.", "alert");
    PROBLEMS = EMBEDDED_SAMPLE;
  }
  return PROBLEMS;
}

function populateProblemOptions() {
  const filter = elements.levelFilter.value;
  const filtered = filter ? PROBLEMS.filter((p) => p.nivell === filter) : PROBLEMS;
  elements.problemSelect.innerHTML = filtered.map((p) => `<option value="${p.id}">${p.titol} (${p.nivell})</option>`).join("");
}

function renderProblemPicker() {
  const levels = ["Tots", ...new Set(PROBLEMS.map((p) => p.nivell))];
  elements.levelFilter.innerHTML = levels.map((l) => `<option value="${l === "Tots" ? "" : l}">${l}</option>`).join("");
  populateProblemOptions();
  updateProblemStatement();
}

function updateProblemStatement() {
  const problem = PROBLEMS.find((p) => p.id == elements.problemSelect.value);
  elements.problemStatement.textContent = problem?.enunciat || (PROBLEMS.length ? "Cap problema trobat en aquesta selecció." : "Encara no s'han carregat problemes.");
  if (problem) setContextFromProblem(problem);
}

function renderStep1_legacy() {
  const questions = [
    { key: "ordre", title: "Importa l'ordre?", options: [{ label: "Sí", value: true }, { label: "No", value: false }] },
    { key: "repeticio", title: "Es poden repetir elements?", options: [{ label: "Sí", value: true }, { label: "No", value: false }] },
    { key: "tots", title: "S'agafen tots els elements?", options: [{ label: "Tots (m = n)", value: true }, { label: "Només alguns (m < n)", value: false }] }
  ];
  elements.classificationQuestions.innerHTML = questions
    .map(
      (q, idx) => `
      <div class="question card accent-${(idx % 5) + 1}" data-question-key="${q.key}">
        <div class="question-header"><h3>${q.title}</h3></div>
        <div class="options">${q.options
          .map((opt) => {
            const selected = state.userAnswers[q.key] === opt.value ? "selected" : "";
            return `<button class="option ${selected}" data-value="${opt.value}" tabindex="0">${opt.label}</button>`;
          })
          .join("")}</div>
      </div>`
    )
    .join("");
  applySelectionsStep1();
  updateClassificationVisual();
}

function applySelectionsStep1() {
  const { ordre, repeticio, tots } = state.userAnswers;
  const values = { ordre, repeticio, tots };
  elements.classificationQuestions.querySelectorAll(".question").forEach((q) => {
    const key = q.dataset.questionKey;
    q.querySelectorAll(".option").forEach((opt) => {
      const value = opt.dataset.value === "true";
      opt.classList.toggle("selected", values[key] === value);
    });
  });
  updateClassificationVisual();
}

function renderStep2() {
  elements.typeFormulaSelection.innerHTML = `
    <div class="formula-grid">
      ${FORMULA_CATALOG.map((f, idx) => {
        const selected = state.userAnswers.formula_id === f.id;
        return `
          <div class="card formula-card accent-${(idx % 5) + 1} ${selected ? "selected" : ""}" data-value="${f.id}" tabindex="0">
            <div class="katex-inline formula-shell">${katex.renderToString(f.expressio)}</div>
            <p class="formula-desc">${f.descripcio}</p>
          </div>`;
      }).join("")}
    </div>`;
}

function renderStep3() {
  const showMultiplicitats = state.userAnswers.tipus === "permutacio_amb_repeticio";
  const { n, m, multiplicitats, tots } = state.userAnswers;
  const mEsN = tots === true;
  const mValue = mEsN ? n ?? "" : m ?? "";
  elements.nmInputs.innerHTML = `
    <div class="card accent-2">
      <div class="form-group nm-group"><label for="input-n">Valor de n (total d'elements)</label><input type="number" class="nm-input" id="input-n" min="0" max="999" inputmode="numeric" value="${n ?? ""}"></div>
      <div class="form-group nm-group"><label for="input-m">Valor de m (elements a agrupar)</label><input type="number" class="nm-input" id="input-m" min="0" max="999" inputmode="numeric" value="${mValue ?? ""}" ${mEsN ? "disabled" : ""}></div>
      ${mEsN ? `<p class="nm-note">Com que en aquest cas m = n, només cal informar n. La casella de m queda bloquejada.</p>` : ""}
      ${
        showMultiplicitats
          ? `<div class="form-group"><label for="input-multiplicitats">Multiplicitats (ex: 2,1,1)</label><input type="text" id="input-multiplicitats" value="${(multiplicitats || []).join(",")}"><small>Han de sumar n.</small></div>`
          : ""
      }
    </div>`;

  const nInput = document.getElementById("input-n");
  const mInput = document.getElementById("input-m");
  if (nInput && mInput && mEsN) {
    mInput.value = nInput.value;
    nInput.addEventListener("input", () => {
      mInput.value = nInput.value;
    });
  }
}

function renderStep4() {
  const formula = FORMULA_CATALOG.find((f) => f.id === state.userAnswers.formula_id);
  const { n, m, multiplicitats } = state.userAnswers;
  if (!formula || n === null || m === null) {
    elements.calculationResults.innerHTML = "<p>Falten dades per calcular.</p>";
    return;
  }
  const { result, substitution, development } = calculate(state.userAnswers.formula_id, n, m, multiplicitats);
  const developmentParts = splitDevelopmentLatex(development);
  state.computedResult = result;
  const expected = state.mode === "A" ? state.selectedProblem?.resultat : null;
  const correcte = expected !== null && expected !== undefined ? result === BigInt(expected) : null;
  const explicacio = state.mode === "A" && state.selectedProblem?.explicacio_final
    ? state.selectedProblem.explicacio_final
    : buildNaturalExplanation(n, m, formula.nom, result);
  elements.calculationResults.innerHTML = `
    <div class="card accent-3"><h3>Fórmula aplicada</h3><div class="katex-display">${katex.renderToString(formula.expressio, { displayMode: true })}</div><p>${formula.descripcio}</p></div>
    <div class="card accent-4"><h3>Substitució</h3><div class="katex-display">${katex.renderToString(substitution, { displayMode: true })}</div></div>
    <div class="card accent-1"><h3>Desenvolupament</h3>${
      developmentParts
        .map((part, idx) => `<div class="katex-display development-part" data-chunk="${idx}">${renderLatexSafely(part)}</div>`)
        .join("")
    }</div>
    <div class="card accent-2 result-card"><div><p class="eyebrow">Resultat</p><div class="result-number">${result.toString()}</div></div>${correcte !== null ? `<div class="pill ${correcte ? "ok" : "alert"}">${correcte ? "Coincideix amb la solució" : "No coincideix"}</div>` : ""}</div>
    <div class="card accent-5 explanation"><h3>Resposta final</h3><p>${explicacio}</p></div>`;
}

function deduceTypeFromClassification() {
  const { ordre, repeticio, tots } = state.userAnswers;
  if (ordre === null || repeticio === null || tots === null) return null;
  if (ordre) {
    if (tots) return repeticio ? "permutacio_amb_repeticio" : "permutacio_simple";
    return repeticio ? "variacio_amb_repeticio" : "variacio_simple";
  }
  return repeticio ? "combinacio_amb_repeticio" : "combinacio_simple";
}

function factorial(num) {
  if (num < 0) return BigInt(0);
  let res = BigInt(1);
  for (let i = 2; i <= num; i++) res *= BigInt(i);
  return res;
}

function factorialExpansionLatex(num) {
  if (num === 0 || num === 1) return "1";
  const terms = [];
  const maxTerms = num <= 10 ? num : 6;
  for (let i = num; i >= 1 && terms.length < maxTerms; i--) {
    terms.push(i);
  }
  if (num > maxTerms) terms.push("\\cdots \\times 1");
  return terms.join(" \\times ");
}

function powerExpansionLatex(base, exponent) {
  if (exponent <= 1) return `${base}`;
  if (exponent <= 6) return Array(exponent).fill(base).join(" \\times ");
  return `${base} \\times ${base} \\times ${base} \\times \\cdots \\text{ (${exponent} cops)}`;
}

function splitDevelopmentLatex(development) {
  const maxLen = 140;
  if (!development || development.length <= maxLen) return [development];
  const separator = " = ";
  if (!development.includes(separator)) return [development];
  const parts = development.split(separator);
  let first = parts[0];
  let splitIndex = null;
  for (let i = 1; i < parts.length; i++) {
    const candidate = `${first}${separator}${parts[i]}`;
    if (candidate.length > maxLen) {
      splitIndex = i;
      break;
    }
    first = candidate;
  }
  if (splitIndex === null) return [development];
  const firstPart = parts.slice(0, splitIndex).join(separator);
  const secondPart = `= ${parts.slice(splitIndex).join(separator)}`;
  return [firstPart, secondPart];
}

function renderLatexSafely(latex) {
  if (latex === undefined || latex === null) return "";
  try {
    return katex.renderToString(latex, { displayMode: true });
  } catch (error) {
    console.error("Error renderitzant KaTeX:", error);
    return String(latex);
  }
}

function formatBigInt(bi) {
  return bi.toString();
}

function gcd(a, b) {
  let x = Math.abs(Number(a));
  let y = Math.abs(Number(b));
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function factorialTerms(num) {
  if (num <= 1) return [1];
  const terms = [];
  for (let i = num; i >= 1; i--) terms.push(i);
  return terms;
}

function buildFractionTerms(formulaId, n, m, multiplicitats = []) {
  switch (formulaId) {
    case "permutacio_simple":
      return { numerator: factorialTerms(n), denominator: [] };
    case "permutacio_amb_repeticio":
      return {
        numerator: factorialTerms(n),
        denominator: multiplicitats.flatMap((v) => factorialTerms(parseInt(v, 10) || 0))
      };
    case "variacio_simple":
      return { numerator: factorialTerms(n), denominator: factorialTerms(n - m) };
    case "combinacio_simple":
      return {
        numerator: factorialTerms(n),
        denominator: [...factorialTerms(m), ...factorialTerms(n - m)]
      };
    case "combinacio_amb_repeticio":
      return {
        numerator: factorialTerms(n + m - 1),
        denominator: [...factorialTerms(m), ...factorialTerms(n - 1)]
      };
    default:
      return null;
  }
}

function performCancellation(numeratorTerms, denominatorTerms) {
  const numerator = numeratorTerms.map((value) => ({ original: value, remainder: value }));
  const denominator = denominatorTerms.map((value) => ({ original: value, remainder: value }));

  for (const dTerm of denominator) {
    let remaining = dTerm.remainder;
    for (const nTerm of numerator) {
      if (remaining === 1) break;
      if (nTerm.remainder === 1) continue;
      const factor = gcd(nTerm.remainder, remaining);
      if (factor > 1) {
        nTerm.remainder = nTerm.remainder / factor;
        remaining = remaining / factor;
      }
    }
    dTerm.remainder = remaining;
  }

  return { numerator, denominator };
}

function latexProduct(terms) {
  return terms.length ? terms.join(" \\cdot ") : "1";
}

function buildCancellationLatex(formulaId, n, m, multiplicitats) {
  const fraction = buildFractionTerms(formulaId, n, m, multiplicitats);
  if (!fraction || !fraction.denominator?.length) return null;
  const totalTerms = (fraction.numerator?.length || 0) + (fraction.denominator?.length || 0);
  if (totalTerms > 80) return null;

  const { numerator, denominator } = performCancellation(fraction.numerator, fraction.denominator);
  const termToLatex = (term) => {
    if (term.remainder === term.original) return `${term.original}`;
    if (term.remainder === 1) return `\\cancel{${term.original}}`;
    return `\\cancel{${term.original}}\\,{${term.remainder}}`;
  };
  const numLatex = numerator.map(termToLatex).join(" \\cdot ") || "1";
  const denLatex = denominator.map(termToLatex).join(" \\cdot ") || "1";
  const simplifiedNum = numerator.filter((t) => t.remainder > 1).map((t) => t.remainder);
  const simplifiedDen = denominator.filter((t) => t.remainder > 1).map((t) => t.remainder);
  const simplifiedLatex = simplifiedDen.length
    ? `\\dfrac{${latexProduct(simplifiedNum)}}{${latexProduct(simplifiedDen)}}`
    : latexProduct(simplifiedNum);

  return {
    cancelled: `\\dfrac{${numLatex}}{${denLatex}}`,
    simplified: simplifiedLatex
  };
}

function calculate(formulaId, n, m, multiplicitats = []) {
  let result = BigInt(0);
  let substitution = "";
  let development = "";
  switch (formulaId) {
    case "permutacio_simple":
      result = factorial(n);
      substitution = `P_{${n}} = ${n}!`;
      development = `${n}! = ${factorialExpansionLatex(n)} = ${formatBigInt(result)}`;
      break;
    case "permutacio_amb_repeticio": {
      const product = multiplicitats.reduce((acc, val) => acc * factorial(parseInt(val, 10)), BigInt(1));
      result = factorial(n) / (product || BigInt(1));
      substitution = `PR_{${n}}^{${multiplicitats.join(",")}} = \\dfrac{${n}!}{${multiplicitats.map((v) => `${v}!`).join(" \\cdot ") || "1"}}`;
      const denominatorExpanded = multiplicitats.length
        ? multiplicitats.map((v) => `(${factorialExpansionLatex(parseInt(v, 10))})`).join(" \\cdot ")
        : "1";
      const cancellation = buildCancellationLatex(formulaId, n, m, multiplicitats);
      const cancelPart = cancellation ? ` = ${cancellation.cancelled} = ${cancellation.simplified}` : "";
      development = `\\dfrac{${n}!}{${multiplicitats.map((v) => `${v}!`).join(" \\cdot ") || "1"}} = \\dfrac{${factorialExpansionLatex(n)}}{${denominatorExpanded}}${cancelPart} = \\dfrac{${formatBigInt(factorial(n))}}{${formatBigInt(product)}} = ${formatBigInt(result)}`;
      break;
    }
    case "variacio_simple":
      result = n >= m ? factorial(n) / factorial(n - m) : BigInt(0);
      substitution = `V_{${n},${m}} = \\dfrac{${n}!}{(${n}-${m})!}`;
      const cancellationV = buildCancellationLatex(formulaId, n, m, multiplicitats);
      const cancelPartV = cancellationV ? ` = ${cancellationV.cancelled} = ${cancellationV.simplified}` : "";
      development = `\\dfrac{${n}!}{(${n}-${m})!} = \\dfrac{${factorialExpansionLatex(n)}}{${factorialExpansionLatex(n - m)}}${cancelPartV} = \\dfrac{${formatBigInt(factorial(n))}}{${formatBigInt(factorial(n - m))}} = ${formatBigInt(result)}`;
      break;
    case "variacio_amb_repeticio":
      result = BigInt(n) ** BigInt(m);
      substitution = `VR_{${n},${m}} = ${n}^{${m}}`;
      development = `${n}^{${m}} = ${powerExpansionLatex(n, m)} = ${formatBigInt(result)}`;
      break;
    case "combinacio_simple":
      result = factorial(n) / (factorial(m) * factorial(n - m));
      substitution = `C_{${n},${m}} = \\dfrac{${n}!}{${m}! \\cdot (${n}-${m})!}`;
      const cancellationC = buildCancellationLatex(formulaId, n, m, multiplicitats);
      const cancelPartC = cancellationC ? ` = ${cancellationC.cancelled} = ${cancellationC.simplified}` : "";
      development = `\\dfrac{${n}!}{${m}! \\cdot (${n}-${m})!} = \\dfrac{${factorialExpansionLatex(n)}}{(${factorialExpansionLatex(m)}) \\cdot (${factorialExpansionLatex(n - m)})}${cancelPartC} = \\dfrac{${formatBigInt(factorial(n))}}{${formatBigInt(factorial(m))} \\cdot ${formatBigInt(factorial(n - m))}} = ${formatBigInt(result)}`;
      break;
    case "combinacio_amb_repeticio":
      result = factorial(n + m - 1) / (factorial(m) * factorial(n - 1));
      substitution = `CR_{${n},${m}} = \\dfrac{(${n}+${m}-1)!}{${m}! \\cdot (${n}-1)!}`;
      const cancellationCR = buildCancellationLatex(formulaId, n, m, multiplicitats);
      const cancelPartCR = cancellationCR ? ` = ${cancellationCR.cancelled} = ${cancellationCR.simplified}` : "";
      development = `\\dfrac{(${n}+${m}-1)!}{${m}! \\cdot (${n}-1)!} = \\dfrac{${factorialExpansionLatex(n + m - 1)}}{(${factorialExpansionLatex(m)}) \\cdot (${factorialExpansionLatex(n - 1)})}${cancelPartCR} = \\dfrac{${formatBigInt(factorial(n + m - 1))}}{${formatBigInt(factorial(m))} \\cdot ${formatBigInt(factorial(n - 1))}} = ${formatBigInt(result)}`;
      break;
  }
  return { result, substitution, development };
}

function buildNaturalExplanation(n, m, tipus, result) {
  const { ordre, repeticio, tots } = state.userAnswers;
  const fraseBase = ordre ? "L'ordre importa" : "L'ordre no importa";
  const fraseRep = repeticio ? "es permet repetir elements" : "no es repeteixen elements";
  const fraseTots = tots ? "es fan servir tots els elements" : "només se'n prenen alguns";
  const resultat = result ? `Hi ha ${formatBigInt(result)} resultats possibles.` : "";
  return [`Treballem amb n = ${n} i m = ${m}.`, `${fraseBase}, ${fraseRep} i ${fraseTots}.`, `Això correspon a: ${tipus}.`, resultat]
    .filter(Boolean)
    .join(" ");
}


function showHint(step) {
  const problem = state.selectedProblem;
  const hints = (state.mode === "A" && problem?.pistes?.[`pas${step}`]) || HINTS_GENERALS[`pas${step}`] || ["No hi ha pistes."];
  alert(hints.join("\n"));
}

function solveStep(step) {
  if (state.mode !== "A" || !state.selectedProblem) return alert("Solució automàtica només en Mode A.");
  const sol = state.selectedProblem.solucions_parcials;
  switch (step) {
    case 1:
      state.userAnswers = { ...state.userAnswers, ...sol.pas1 };
      renderStep1();
      break;
    case 2:
      state.userAnswers.tipus = sol.pas2.tipus;
      state.userAnswers.formula_id = sol.pas2.formula_id;
      renderStep2();
      break;
    case 3:
      state.userAnswers.n = sol.pas3.n;
      state.userAnswers.m = sol.pas3.m;
      if (state.selectedProblem.multiplicitats) state.userAnswers.multiplicitats = state.selectedProblem.multiplicitats;
      renderStep3();
      const nInput = document.getElementById("input-n");
      const mInput = document.getElementById("input-m");
      if (nInput) nInput.value = sol.pas3.n;
      if (mInput) mInput.value = sol.pas3.m;
      if (state.selectedProblem.multiplicitats) {
        const mult = document.getElementById("input-multiplicitats");
        if (mult) mult.value = state.selectedProblem.multiplicitats.join(",");
      }
      break;
  }
}

function validateStep1() {
  const { ordre, repeticio, tots } = state.userAnswers;
  if ([ordre, repeticio, tots].includes(null)) {
    logError("Falten respostes al pas 1.");
    showToast("Respon totes les preguntes.", "alert");
    updateValidationSummary();
    return false;
  }
  if (state.mode === "A" && state.selectedProblem) {
    const { ordre: o, repeticio: r, tots: t } = state.selectedProblem.solucions_parcials.pas1;
    if (ordre !== o || repeticio !== r || tots !== t) {
      logError("Classificació incorrecta al pas 1.");
      showToast("Classificació incorrecta.", "alert");
      updateValidationSummary();
      return false;
    }
  }
  updateValidationSummary();
  return true;
}

function validateStep2() {
  const { tipus, formula_id } = state.userAnswers;
  if (!tipus || !formula_id) {
    logError("Falta triar tipus o fórmula al pas 2.");
    showToast("Selecciona tipus i fórmula.", "alert");
    updateValidationSummary();
    return false;
  }
  const coherent = deduceTypeFromClassification();
  if (coherent && coherent !== tipus) {
    logError("Tipus no encaixa amb la classificació del pas 1.");
    showToast("No encaixa amb el pas 1.", "alert");
    updateValidationSummary();
    return false;
  }
  if (state.mode === "A" && state.selectedProblem) {
    const { tipus: t, formula_id: f } = state.selectedProblem.solucions_parcials.pas2;
    if (tipus !== t || formula_id !== f) {
      logError("Tipus/fórmula incorrectes segons l'enunciat.");
      showToast("Tipus/fórmula incorrectes.", "alert");
      updateValidationSummary();
      return false;
    }
  }
  updateValidationSummary();
  return true;
}

function validateStep3() {
  const isMn = state.userAnswers.tots === true;
  const nVal = parseInt(document.getElementById("input-n").value, 10);
  const mField = document.getElementById("input-m");
  const mRaw = mField ? mField.value : "";
  const mVal = isMn ? nVal : parseInt(mRaw, 10);

  if (Number.isNaN(nVal) || (!isMn && Number.isNaN(mVal))) {
    logError("Falten valors de n o m al pas 3.");
    showToast(isMn ? "Omple n." : "Omple n i m.", "alert");
    updateValidationSummary();
    return false;
  }

  state.userAnswers.n = nVal;
  state.userAnswers.m = mVal;
  if (isMn && mField) mField.value = nVal;

  if (state.userAnswers.tipus === "permutacio_amb_repeticio") {
    const multInput = document.getElementById("input-multiplicitats");
    const values = (multInput?.value || "")
      .split(",")
      .map((v) => parseInt(v.trim(), 10))
      .filter((v) => !Number.isNaN(v));
    state.userAnswers.multiplicitats = values;
    const suma = values.reduce((a, b) => a + b, 0);
    if (suma !== nVal) {
      logError("Multiplicitats no sumen n.");
      showToast("Les multiplicitats han de sumar n.", "alert");
      updateValidationSummary();
      return false;
    }
  }
  if (!state.userAnswers.repeticio && mVal > nVal) {
    logError("m no pot superar n sense repetició.");
    showToast("Sense repetició, m ≤ n.", "alert");
    updateValidationSummary();
    return false;
  }
  if (state.userAnswers.tots && mVal !== nVal) {
    logError("Has indicat m = n però els valors no coincideixen.");
    showToast("Has indicat m = n.", "alert");
    updateValidationSummary();
    return false;
  }
  if (state.mode === "A" && state.selectedProblem) {
    const { n: nc, m: mc } = state.selectedProblem.solucions_parcials.pas3;
    if (nVal !== nc || mVal !== mc) {
      logError("n o m no coincideixen amb el problema.");
      showToast("n o m no coincideixen.", "alert");
      updateValidationSummary();
      return false;
    }
  }
  updateValidationSummary();
  return true;
}

// Render de classificació amb opcions Sí/No
function renderStep1() {
  const questions = [
    { key: "ordre", title: "Importa l'ordre?", options: [{ label: "Sí", value: true }, { label: "No", value: false }] },
    { key: "repeticio", title: "Es poden repetir elements?", options: [{ label: "Sí", value: true }, { label: "No", value: false }] },
    { key: "tots", title: "S'agafen tots els elements?", options: [{ label: "Sí", value: true }, { label: "No", value: false }] }
  ];
  elements.classificationQuestions.innerHTML = questions
    .map(
      (q, idx) => `
      <div class="question card accent-${(idx % 5) + 1}" data-question-key="${q.key}">
        <div class="question-header"><h3>${q.title}</h3></div>
        <div class="options">${q.options
          .map((opt) => {
            const selected = state.userAnswers[q.key] === opt.value ? "selected" : "";
            return `<button class="option ${selected}" data-value="${opt.value}" tabindex="0">${opt.label}</button>`;
          })
          .join("")}</div>
      </div>`
    )
    .join("");
  applySelectionsStep1();
  updateClassificationVisual();
}

function showToast(message, variant = "info") {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.className = `toast ${variant}`;
  elements.toast.classList.add("visible");
  setTimeout(() => elements.toast.classList.remove("visible"), 3500);
}

function setupEventListeners() {
  document.getElementById("btn-mode-a").addEventListener("click", async () => {
    state.mode = "A";
    resetUserAnswers();
    await loadAllProblems();
    if (!PROBLEMS.length) {
      showToast("No s'han carregat problemes: revisa els JSON o serveix l'app amb un servidor local.", "alert");
    }
    renderProblemPicker();
    setContextHome();
    navigateTo("screen-problem-picker");
  });

  document.getElementById("btn-mode-b").addEventListener("click", () => {
    state.mode = "B";
    resetUserAnswers();
    renderStep1();
    setContextFreeMode();
    navigateTo("screen-step-1");
  });

  document.getElementById("level-filter")?.addEventListener("change", () => {
    populateProblemOptions();
    updateProblemStatement();
  });
  document.getElementById("problem-select")?.addEventListener("change", updateProblemStatement);

  document.getElementById("btn-start-problem")?.addEventListener("click", () => {
    const problemId = elements.problemSelect.value;
    state.selectedProblem = PROBLEMS.find((p) => String(p.id) === String(problemId));
    if (!state.selectedProblem) return showToast("Selecciona un problema.", "alert");
    resetUserAnswers();
    renderStep1();
    setContextFromProblem(state.selectedProblem);
    navigateTo("screen-step-1");
  });

  document.querySelectorAll(".btn-back").forEach((btn) => {
    btn.addEventListener("click", () => {
      switch (state.currentScreen) {
        case "screen-problem-picker":
          navigateTo("screen-mode-selection");
          break;
        case "screen-step-1":
          navigateTo(state.mode === "A" ? "screen-problem-picker" : "screen-mode-selection");
          break;
        case "screen-step-2":
          navigateTo("screen-step-1");
          break;
        case "screen-step-3":
          navigateTo("screen-step-2");
          break;
        case "screen-step-4":
          navigateTo("screen-step-3");
          break;
      }
    });
  });

  elements.classificationQuestions.addEventListener("click", (e) => {
    if (e.target.classList.contains("option")) {
      const key = e.target.closest(".question").dataset.questionKey;
      const value = e.target.dataset.value === "true";
      state.userAnswers[key] = value;
      e.target.closest(".options").querySelectorAll(".option").forEach((opt) => opt.classList.remove("selected"));
      e.target.classList.add("selected");
      updateClassificationVisual();
    }
  });

  document.getElementById("btn-step-1-next")?.addEventListener("click", () => {
    if (!validateStep1()) return;
    renderStep2();
    navigateTo("screen-step-2");
  });

  elements.typeFormulaSelection.addEventListener("click", (e) => {
    const card = e.target.closest(".formula-card");
    if (!card) return;
    const value = card.dataset.value;
    state.userAnswers.tipus = value;
    state.userAnswers.formula_id = value;
    renderStep2();
    updateValidationSummary();
  });

  document.getElementById("btn-step-2-next")?.addEventListener("click", () => {
    if (!validateStep2()) return;
    renderStep3();
    navigateTo("screen-step-3");
  });

  document.getElementById("btn-step-3-next")?.addEventListener("click", () => {
    if (!validateStep3()) return;
    renderStep4();
    navigateTo("screen-step-4");
  });

  document.querySelectorAll(".btn-hint").forEach((btn) => btn.addEventListener("click", () => showHint(state.currentScreen.split("-")[2])));
  document.querySelectorAll(".btn-solve-step").forEach((btn) => btn.addEventListener("click", () => solveStep(parseInt(state.currentScreen.split("-")[2], 10))));

  document.getElementById("btn-restart")?.addEventListener("click", resetState);

  const stepOrder = ["mode", "problema", "tipus", "formula", "dades", "calcul"];
  const targetScreens = {
    mode: "screen-mode-selection",
    problema: "screen-problem-picker",
    tipus: "screen-step-1",
    formula: "screen-step-2",
    dades: "screen-step-3",
    calcul: "screen-step-4"
  };
  elements.progressBadges.forEach((badge) => {
    badge.addEventListener("click", () => {
      const step = badge.dataset.stepId;
      const current = SCREEN_TO_STEP[state.currentScreen];
      const canGo = stepOrder.indexOf(step) <= stepOrder.indexOf(current);
      if (!canGo) return;
      navigateTo(targetScreens[step]);
    });
  });

  ["classificationQuestions", "typeFormulaSelection"].forEach((id) => {
    const container = elements[id];
    container?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const target = e.target;
        if (target.classList.contains("option") || target.classList.contains("formula-card")) {
          target.click();
          e.preventDefault();
        }
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  setContextHome();
  navigateTo("screen-mode-selection");
  updateValidationSummary();
  renderErrors();
});
