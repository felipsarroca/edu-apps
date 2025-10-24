const DATA_FILES = [
  "data/eq_basic.json",
  "data/eq_intermediate.json",
  "data/eq_advanced.json",
];
const TYPES_URL = "data/reaction_types.json";

const SVG_NS = "http://www.w3.org/2000/svg";

const ELEMENT_COLORS = {
  H: "#fde047",
  O: "#f87171",
  N: "#60a5fa",
  C: "#a5b4fc",
  Na: "#38bdf8",
  Cl: "#fbbf24",
  Ca: "#f59e0b",
  Fe: "#fb923c",
  Al: "#facc15",
  K: "#a855f7",
  S: "#facc15",
  Ag: "#d6d3d1",
  Mn: "#2dd4bf",
  default: "#94a3b8",
};

const ELEMENT_RADII = {
  H: 12,
  O: 16,
  N: 16,
  C: 16,
  Na: 18,
  Cl: 17,
  Ca: 19,
  Fe: 19,
  Al: 18,
  K: 19,
  S: 18,
  Ag: 19,
  default: 16,
};

const STATUS_COPY = {
  balanced: "Fant&agrave;stic! L'equaci&oacute; est&agrave; equilibrada.",
  working:
    "Ajusta els coeficients fins que el nombre d'&agrave;toms coincideixi als dos costats.",
};

function createId() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {}
  return `eq_${Math.random().toString(36).slice(2, 10)}`;
}

const state = {
  equations: [],
  filteredEquations: [],
  currentEquation: null,
  currentCoefficients: [],
  typeLabels: {},
  attempts: 0,
  correct: 0,
  streak: 0,
  showAtoms: true,
  hintsEnabled: true,
};

const STORAGE_KEYS = {\n  stats: "iq_stats_v1",\n  filters: "iq_filters_v1",\n};

function loadStatsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.stats);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data?.attempts === "number") state.attempts = data.attempts;
    if (typeof data?.correct === "number") state.correct = data.correct;
    if (typeof data?.streak === "number") state.streak = data.streak;
  } catch {}
}

function saveStatsToStorage() {
  try {
    const payload = {
      attempts: state.attempts,
      correct: state.correct,
      streak: state.streak,
    };
    localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(payload));
  } catch {}
}







const elements = {
  typeSelect: document.getElementById("reactionType"),
  typeFilters: document.getElementById("typeFilters"),
  difficultyLevel: document.getElementById("difficultyLevel"),
  levelFilters: document.getElementById("levelFilters"),
  newEquationBtn: document.getElementById("newEquationBtn"),
  equationContainer: document.getElementById("equationContainer"),
  equationTitle: document.getElementById("equationTitle"),
  equationDisplay: document.getElementById("equationDisplay"),
  checkBtn: document.getElementById("checkBtn"),
  hintBtn: document.getElementById("hintBtn"),
  solutionBtn: document.getElementById("solutionBtn"),
  resetBtn: document.getElementById("resetBtn"),
  feedback: document.getElementById("feedback"),
  atomPanel: document.getElementById("atomPanel"),
  atomTable: document.getElementById("atomTable"),
  toggleAtoms: document.getElementById("toggleAtoms"),
  toggleHints: document.getElementById("toggleHints"),
  balanceStatus: document.getElementById("balanceStatus"),
  balanceCaption: document.getElementById("balanceCaption"),
  moodBadge: document.getElementById("moodBadge"),
  attemptCount: document.getElementById("attemptCount"),
  correctCount: document.getElementById("correctCount"),
  streakCount: document.getElementById("streakCount"),
  reactantStage: document.getElementById("reactantStage"),
  productStage: document.getElementById("productStage"),
};







const MOLECULE_LIBRARY = {
  H2: createDiatomic("H"),
  O2: createDiatomic("O"),
  N2: createDiatomic("N"),
  Cl2: createDiatomic("Cl"),
  HCl: createDiatomic("H", "Cl"),
  KCl: createDiatomic("K", "Cl"),
  CaO: createDiatomic("Ca", "O"),
  AgCl: createDiatomic("Ag", "Cl"),
  Fe: createSingle("Fe"),
  Na: createSingle("Na"),
  Al: createSingle("Al"),
  H2O: createWater(),
  CO2: createCarbonDioxide(),
  NH3: createAmmonia(),
  C3H8: createPropane(),
  NaCl: createLattice("Na", "Cl"),
  KClO3: createPotassiumChlorate(),
  NaOH: createSodiumHydroxide(),
  H2SO4: createSulfuricAcid(),
  Na2SO4: createSodiumSulfate(),
  NaNO3: createSodiumNitrate(),
  AgNO3: createSilverNitrate(),
  Fe2O3: createIronOxide(),
  CaCO3: createCalciumCarbonate(),
  AlCl3: createAluminiumChloride(),
};

function makeAtom(element, x, y) {
  return { element, x, y };
}

function createMolecule(atoms, bonds = []) {
  return { atoms, bonds };
}

function createSingle(element) {
  return createMolecule([makeAtom(element, 50, 40)]);
}

function createDiatomic(leftElement, rightElement = leftElement) {
  return createMolecule(
    [makeAtom(leftElement, 30, 40), makeAtom(rightElement, 70, 40)],
    [[0, 1]]
  );
}

function createWater() {
  return createMolecule(
    [makeAtom("O", 50, 48), makeAtom("H", 32, 25), makeAtom("H", 68, 25)],
    [
      [0, 1],
      [0, 2],
    ]
  );
}

function createCarbonDioxide() {
  return createMolecule(
    [makeAtom("O", 20, 40), makeAtom("C", 50, 40), makeAtom("O", 80, 40)],
    [
      [0, 1],
      [1, 2],
    ]
  );
}

function createAmmonia() {
  return createMolecule(
    [
      makeAtom("N", 50, 32),
      makeAtom("H", 30, 60),
      makeAtom("H", 50, 68),
      makeAtom("H", 70, 60),
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
    ]
  );
}

function createPropane() {
  return createMolecule(
    [
      makeAtom("C", 25, 45),
      makeAtom("C", 50, 45),
      makeAtom("C", 75, 45),
      makeAtom("H", 10, 30),
      makeAtom("H", 10, 60),
      makeAtom("H", 25, 20),
      makeAtom("H", 38, 25),
      makeAtom("H", 50, 70),
      makeAtom("H", 75, 20),
      makeAtom("H", 90, 32),
      makeAtom("H", 90, 60),
    ],
    [
      [0, 1],
      [1, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 6],
      [1, 7],
      [2, 8],
      [2, 9],
      [2, 10],
    ]
  );
}

function createLattice(primary, secondary) {
  return createMolecule(
    [
      makeAtom(primary, 30, 30),
      makeAtom(secondary, 30, 60),
      makeAtom(secondary, 70, 30),
      makeAtom(primary, 70, 60),
    ],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
    ]
  );
}

function createPotassiumChlorate() {
  return createMolecule(
    [
      makeAtom("Cl", 50, 40),
      makeAtom("O", 30, 18),
      makeAtom("O", 70, 18),
      makeAtom("O", 50, 65),
      makeAtom("K", 82, 55),
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
    ]
  );
}

function createSodiumHydroxide() {
  return createMolecule(
    [makeAtom("Na", 25, 50), makeAtom("O", 55, 38), makeAtom("H", 75, 55)],
    [
      [0, 1],
      [1, 2],
    ]
  );
}

function createSulfuricAcid() {
  return createMolecule(
    [
      makeAtom("S", 50, 35),
      makeAtom("O", 30, 18),
      makeAtom("O", 70, 18),
      makeAtom("O", 32, 62),
      makeAtom("O", 68, 62),
      makeAtom("H", 30, 78),
      makeAtom("H", 70, 78),
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [3, 5],
      [4, 6],
    ]
  );
}

function createSodiumSulfate() {
  return createMolecule(
    [
      makeAtom("S", 50, 35),
      makeAtom("O", 30, 18),
      makeAtom("O", 70, 18),
      makeAtom("O", 32, 62),
      makeAtom("O", 68, 62),
      makeAtom("Na", 20, 45),
      makeAtom("Na", 80, 45),
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [3, 5],
      [4, 6],
    ]
  );
}

function createSilverNitrate() {
  return createMolecule(
    [
      makeAtom("Ag", 82, 45),
      makeAtom("N", 50, 35),
      makeAtom("O", 30, 20),
      makeAtom("O", 50, 65),
      makeAtom("O", 70, 20),
    ],
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [0, 1],
    ]
  );
}

function createSodiumNitrate() {
  return createMolecule(
    [
      makeAtom("Na", 18, 45),
      makeAtom("N", 50, 35),
      makeAtom("O", 30, 20),
      makeAtom("O", 50, 65),
      makeAtom("O", 70, 20),
    ],
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [0, 1],
    ]
  );
}

function createIronOxide() {
  return createMolecule(
    [
      makeAtom("Fe", 30, 45),
      makeAtom("Fe", 70, 45),
      makeAtom("O", 20, 20),
      makeAtom("O", 80, 20),
      makeAtom("O", 50, 70),
    ],
    [
      [0, 2],
      [0, 4],
      [1, 3],
      [1, 4],
    ]
  );
}

function createCalciumCarbonate() {
  return createMolecule(
    [
      makeAtom("Ca", 50, 50),
      makeAtom("C", 50, 30),
      makeAtom("O", 30, 20),
      makeAtom("O", 70, 20),
      makeAtom("O", 50, 70),
    ],
    [
      [1, 2],
      [1, 3],
      [1, 4],
      [0, 1],
    ]
  );
}

function createAluminiumChloride() {
  return createMolecule(
    [
      makeAtom("Al", 50, 32),
      makeAtom("Cl", 25, 65),
      makeAtom("Cl", 50, 70),
      makeAtom("Cl", 75, 65),
    ],
    [
      [0, 1],
      [0, 2],
      [0, 3],
    ]
  );
}

function getElementColor(element) {
  if (!element) {
    return ELEMENT_COLORS.default;
  }
  const clean = element.replace(/[^A-Za-z]/g, "");
  return ELEMENT_COLORS[clean] || ELEMENT_COLORS.default;
}

function getAtomRadius(element) {
  if (!element) {
    return ELEMENT_RADII.default;
  }
  const clean = element.replace(/[^A-Za-z]/g, "");
  return ELEMENT_RADII[clean] || ELEMENT_RADII.default;
}

function buildGenericMolecule(formula) {
  const counts = parseFormula(formula);
  const entries = Object.entries(counts);
  if (!entries.length) {
    return createSingle(formula);
  }
  const totalAtoms = entries.reduce((total, [, count]) => total + count, 0);
  if (totalAtoms === 0) {
    return createSingle(formula);
  }
  const atoms = [];
  const radius = totalAtoms <= 3 ? 22 : 28;
  let currentIndex = 0;
  entries.forEach(([element, count]) => {
    for (let i = 0; i < count; i += 1) {
      const angle = (currentIndex / totalAtoms) * Math.PI * 2;
      const x = 50 + radius * Math.cos(angle);
      const y = 40 + radius * Math.sin(angle) * 0.75;
      atoms.push(makeAtom(element, x, y));
      currentIndex += 1;
    }
  });
  const bonds = [];
  for (let i = 0; i < atoms.length - 1; i += 1) {
    bonds.push([i, i + 1]);
  }
  return createMolecule(atoms, bonds);
}

function createMoleculeSprite(formula) {
  const template = MOLECULE_LIBRARY[formula] || buildGenericMolecule(formula);
  const sprite = document.createElement("div");
  sprite.className = "molecule-sprite";
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 80");
  svg.setAttribute("aria-hidden", "true");
  (template.bonds || []).forEach(([from, to]) => {
    const atomA = template.atoms[from];
    const atomB = template.atoms[to];
    if (!atomA || !atomB) {
      return;
    }
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", atomA.x);
    line.setAttribute("y1", atomA.y);
    line.setAttribute("x2", atomB.x);
    line.setAttribute("y2", atomB.y);
    line.setAttribute("class", "bond-line");
    svg.appendChild(line);
  });
  (template.atoms || []).forEach((atom) => {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", atom.x);
    circle.setAttribute("cy", atom.y);
    circle.setAttribute("r", atom.radius ?? getAtomRadius(atom.element));
    circle.setAttribute("fill", atom.color || getElementColor(atom.element));
    circle.setAttribute("class", "atom-dot");
    svg.appendChild(circle);
  });
  sprite.appendChild(svg);
  return sprite;
}







async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`No s'ha pogut carregar el recurs: ${url}`);
  }
  return response.json();
}

async function loadEquations() {
  const typePromise = fetchJSON(TYPES_URL).catch((error) => {
    console.warn("No s'ha pogut carregar el catÃ leg de tipus.", error);
    return [];
  });
  const equationPromises = DATA_FILES.map((url) =>
    fetchJSON(url).catch((error) => {
      console.warn(`No s'ha pogut carregar ${url}`, error);
      return [];
    })
  );

  const [typeData, ...equationLists] = await Promise.all([
    typePromise,
    ...equationPromises,
  ]);

  state.typeLabels = Array.isArray(typeData)
    ? Object.fromEntries(
        typeData.map((entry) => [entry.id, maybeFixMojibake(entry.name || entry.id)])
      )
    : {};

  state.equations = equationLists
    .flat()
    .map((rawEquation) => normalizeEquation(rawEquation))
    .filter((equation) => equation.reactius.length && equation.productes.length);

  if (!state.equations.length) {
    elements.typeSelect.disabled = true;
    setFeedback("No hi ha equacions disponibles. Revisa els arxius de dades.", "error");
    return;
  }

  elements.typeSelect.disabled = false;
  elements.typeSelect.value = "tots";
  if (elements.difficultyLevel) {
    elements.difficultyLevel.value = "tots";
  }

  populateTypeOptions();
  applyTypeFilter();
  pickRandomEquation();
}

function populateTypeOptions() {
  if (!state.equations.length) {
    elements.typeSelect.innerHTML = '<option value="tots">Sense dades</option>';
    return;
  }
  const types = new Set(state.equations.map((eq) => eq.tipus));
  elements.typeSelect.innerHTML = '<option value="tots">Tots els tipus</option>';
  Array.from(types)
    .sort((a, b) => formatTypeLabel(a).localeCompare(formatTypeLabel(b)))
    .forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = formatTypeLabel(type);
      elements.typeSelect.appendChild(option);
    });
}

function escapeHTML(s) {
  if (!s && s !== 0) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function maybeFixMojibake(str) {
  if (typeof str !== "string") return str ?? "";
  if (!/[ÃƒÃ‚]/.test(str)) return str;
  try {
    const bytes = Uint8Array.from([...str].map((c) => c.charCodeAt(0) & 0xff));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded;
  } catch {
    return str;
  }
}

function normalizeEquation(entry) {
  if (!entry || typeof entry !== "object") {
    return {
      id: createId(),
      reactius: [],
      productes: [],
      coeficients: [],
      tipus: "sense_tipus",
      explicacio: "",
      nivell: 1,
    };
  }
  const reactants = Array.isArray(entry.reactants)
    ? entry.reactants
    : Array.isArray(entry.reactius)
    ? entry.reactius
    : [];
  const products = Array.isArray(entry.products)
    ? entry.products
    : Array.isArray(entry.productes)
    ? entry.productes
    : [];
  const coefficients = Array.isArray(entry.coefficients)
    ? entry.coefficients.map((value) => Number.parseInt(value, 10))
    : Array.isArray(entry.coeficients)
    ? entry.coeficients.map((value) => Number.parseInt(value, 10))
    : [];
  const type = entry.type || entry.tipus || "sense_tipus";
  const explanation = maybeFixMojibake(entry.explanation || entry.explicacio || "");
  const level = Number.parseInt(entry.level ?? entry.nivell ?? 1, 10);
  return {
    ...entry,
    id: entry.id || createId(),
    reactants,
    reactius: reactants,
    products,
    productes: products,
    coefficients,
    coeficients: coefficients,
    type,
    tipus: type,
    explanation,
    explicacio: explanation,
    level,
    nivell: level,
  };
}

function applyTypeFilter() {
  const selectedType = elements.typeSelect.value;
  const selectedLevel = elements.difficultyLevel?.value || "tots";
  state.filteredEquations = state.equations.filter((eq) => {
    const okType = selectedType === "tots" || eq.tipus === selectedType;
    const okLevel = selectedLevel === "tots" || String(eq.nivell) === String(selectedLevel);
    return okType && okLevel;
  });
  state.filteredEquations.sort((a, b) => {
    if (a.nivell !== b.nivell) {
      return a.nivell - b.nivell;
    }
    return a.id.localeCompare(b.id);
  });
}

function pickRandomEquation() {
  if (!state.filteredEquations.length) {
    setFeedback(
      "No hi ha equacions disponibles per al filtre seleccionat.",
      "error"
    );
    return;
  }
  const index = Math.floor(Math.random() * state.filteredEquations.length);
  state.currentEquation = state.filteredEquations[index];
  state.currentCoefficients = buildDefaultCoefficients(state.currentEquation);
  renderEquation();
  clearFeedback();
}

function buildDefaultCoefficients(equation) {
  const totalCompounds =
    equation.reactius.length + equation.productes.length;
  return Array(totalCompounds).fill(1);
}

function renderEquation() {
  if (!state.currentEquation) {
    elements.equationContainer.innerHTML = "";
    elements.equationDisplay.innerHTML = "";
    elements.equationTitle.textContent = "";
    if (elements.reactantStage) {
      elements.reactantStage.innerHTML = "";
    }
    if (elements.productStage) {
      elements.productStage.innerHTML = "";
    }
    updateBalanceIndicator(false);
    return;
  }
  const { reactius, productes, tipus, explicacio } = state.currentEquation;
  elements.equationContainer.innerHTML = "";

  const reactantSide = buildEquationSide(reactius, "reactants", 0);
  const reactantColumn = document.createElement("div");
  reactantColumn.className = "equation-column";
  reactantColumn.appendChild(reactantSide);

  const arrow = document.createElement("div");
  arrow.className = "equation-arrow";
  arrow.innerHTML = "&rarr;";

  const productSide = buildEquationSide(productes, "products", reactius.length);
  const productColumn = document.createElement("div");
  productColumn.className = "equation-column";
  productColumn.appendChild(productSide);

  elements.equationContainer.append(reactantColumn, arrow, productColumn);

  const titleType = `<span class="type-chip">${escapeHTML(formatTypeLabel(tipus))}</span>`;
  const titleDesc = explicacio ? `<span class="reaction-desc">${escapeHTML(maybeFixMojibake(explicacio))}</span>` : "";
  elements.equationTitle.innerHTML = [titleType, titleDesc].filter(Boolean).join(" \u2013 ");

  renderStages();
  updateEquationDisplay();
  updateAtomTable();
  typesetFormulas();
}

function buildEquationSide(compounds, role, offset) {
  const sideWrapper = document.createElement("div");
  sideWrapper.className = `equation-side ${role}`;
  sideWrapper.setAttribute(
    "data-title",
    role === "reactants" ? "Reactius" : "Productes"
  );

  compounds.forEach((compound, idx) => {
    const globalIndex = offset + idx;
    const card = document.createElement("div");
    card.className = "compound-card";

    const controls = document.createElement("div");
    controls.className = "coef-panel";

    const decrementBtn = document.createElement("button");
    decrementBtn.type = "button";
    decrementBtn.className = "coef-button minus";
    decrementBtn.setAttribute(
      "aria-label",
      `Disminueix el coeficient de ${compound}`
    );
    decrementBtn.textContent = "-";
    decrementBtn.addEventListener("click", () => {
      updateCoefficient(globalIndex, Math.max(0, getCoefficient(globalIndex) - 1));
    });

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.value = getCoefficient(globalIndex);
    input.dataset.index = String(globalIndex);
    input.className = "coef-input";
    input.addEventListener("input", () => {
      const value = Number.parseInt(input.value, 10);
      updateCoefficient(globalIndex, Number.isFinite(value) ? value : 0);
    });

    const incrementBtn = document.createElement("button");
    incrementBtn.type = "button";
    incrementBtn.className = "coef-button plus";
    incrementBtn.setAttribute(
      "aria-label",
      `Augmenta el coeficient de ${compound}`
    );
    incrementBtn.textContent = "+";
    incrementBtn.addEventListener("click", () => {
      updateCoefficient(globalIndex, getCoefficient(globalIndex) + 1);
    });

    controls.append(decrementBtn, input, incrementBtn);

    const formulaSpan = document.createElement("span");
    formulaSpan.className = "compound-formula";
    formulaSpan.innerHTML = renderFormulaHTML(compound);

    card.append(controls, formulaSpan);
    sideWrapper.appendChild(card);
  });

  return sideWrapper;
}

function renderStages() {
  if (!elements.reactantStage || !elements.productStage) {
    return;
  }
  if (!state.currentEquation) {
    elements.reactantStage.innerHTML = "";
    elements.productStage.innerHTML = "";
    return;
  }
  const { reactius, productes } = state.currentEquation;
  renderStage(elements.reactantStage, reactius, 0);
  renderStage(elements.productStage, productes, reactius.length);
}

function renderStage(container, compounds, offset) {
  container.innerHTML = "";
  compounds.forEach((compound, idx) => {
    const globalIndex = offset + idx;
    const coefficient = state.currentCoefficients[globalIndex] ?? 0;
    const group = document.createElement("div");
    group.className = "molecule-group";

    const bucket = document.createElement("div");
    bucket.className = "molecule-bucket";

    if (coefficient <= 0) {
      const sprite = createMoleculeSprite(compound);
      sprite.classList.add("ghost");
      bucket.appendChild(sprite);
      const countBadge = document.createElement("div");
      countBadge.className = "molecule-count-badge ghost";
      countBadge.textContent = "\u00d70";
      bucket.appendChild(countBadge);
    } else {
      const visible = Math.min(coefficient, 12);
      for (let i = 0; i < visible; i += 1) {
        const sprite = createMoleculeSprite(compound);
        if (visible > 6 && i >= 6) {
          sprite.classList.add("is-compact");
        }
        if (visible > 9 && i >= 9) {
          sprite.classList.add("is-mini");
        }
        bucket.appendChild(sprite);
      }
      if (coefficient > visible) {
        const countBadge = document.createElement("div");
        countBadge.className = "molecule-count-badge";
        countBadge.textContent = `\u00d7${coefficient}`;
        bucket.appendChild(countBadge);
      }
    }

    const label = document.createElement("span");
    label.className = "molecule-label";
    label.innerHTML = renderFormulaHTML(compound);

    group.append(bucket, label);
    container.appendChild(group);
  });
}

function updateEquationDisplay() {

  if (!state.currentEquation) {

    elements.equationDisplay.innerHTML = "";

    return;

  }

  const { reactius, productes } = state.currentEquation;

  const coefficients = state.currentCoefficients;

  const reactantTerms = reactius.map((compound, idx) =>

    buildEquationTerm(coefficients[idx], compound)

  );

  const productTerms = productes.map((compound, idx) =>

    buildEquationTerm(coefficients[reactius.length + idx], compound)

  );



  const reactantString = reactantTerms.join(" + ");

  const productString = productTerms.join(" + ");

  const equationString = `$${reactantString} \\rightarrow ${productString}$`;



  elements.equationDisplay.textContent = equationString;

  typesetFormulas();

}



function buildEquationTerm(coefficient, formula) {

  const value = Number.isFinite(coefficient) ? Math.max(coefficient, 0) : 0;

  const displayValue = Math.trunc(value);

  const formulaTeX = renderFormulaTeX(formula);

  const styledCoefficient = `\\color{blue}{\\mathbf{${displayValue}}}`;
  const smallerFormula = `\\style{font-size:70%}{${formulaTeX}}`;
  return `${styledCoefficient}\\, ${smallerFormula}`;

}

function getCoefficient(index) {
  return state.currentCoefficients[index] ?? 0;
}

function updateCoefficient(index, newValue) {
  const safeValue = Number.isFinite(newValue) ? newValue : 0;
  state.currentCoefficients[index] = Math.max(safeValue, 0);
  const input = elements.equationContainer.querySelector(
    `input[data-index="${index}"]`
  );
  if (input) {
    input.value = state.currentCoefficients[index];
  }
  renderStages();
  updateEquationDisplay();
  updateAtomTable();
  clearFeedback();
  typesetFormulas();
}

function updateAtomTable() {
  if (!state.currentEquation) {
    elements.atomTable.innerHTML = "";
    updateBalanceIndicator(false);
    return;
  }
  applyAtomPanelVisibility();
  const { reactius, productes } = state.currentEquation;
  const { leftCounts, rightCounts } = calculateAtomBalance(
    reactius,
    productes,
    state.currentCoefficients
  );
  const allElements = new Set([
    ...Object.keys(leftCounts),
    ...Object.keys(rightCounts),
  ]);
  const rows = [];
  allElements.forEach((symbol) => {
    const leftValue = leftCounts[symbol] ?? 0;
    const rightValue = rightCounts[symbol] ?? 0;
    const diff = leftValue - rightValue;
    const diffClass =
      diff === 0
        ? "text-emerald-300"
        : diff > 0
        ? "text-rose-300"
        : "text-sky-300";
    rows.push(`
      <tr>
        <td class="px-3 py-2 font-mono">${symbol}</td>
        <td class="px-3 py-2">${leftValue}</td>
        <td class="px-3 py-2">${rightValue}</td>
        <td class="px-3 py-2 font-semibold ${diffClass}">${formatDifference(diff)}</td>
      </tr>
    `);
  });
  elements.atomTable.innerHTML = rows.join("");
  const hasPositive = state.currentCoefficients.some((value) => value > 0);
  const balanced = hasPositive && areCountsBalanced(leftCounts, rightCounts);
  updateBalanceIndicator(balanced);
}

function calculateAtomBalance(reactants, products, coefficients) {
  const leftCounts = {};
  const rightCounts = {};
  const reactantCoefficients = coefficients.slice(0, reactants.length);
  const productCoefficients = coefficients.slice(reactants.length);

  reactants.forEach((formula, idx) => {
    const count = reactantCoefficients[idx] ?? 0;
    const atoms = parseFormula(formula);
    scaleAndAdd(atoms, count, leftCounts);
  });

  products.forEach((formula, idx) => {
    const count = productCoefficients[idx] ?? 0;
    const atoms = parseFormula(formula);
    scaleAndAdd(atoms, count, rightCounts);
  });

  return { leftCounts, rightCounts };
}

function parseFormula(formula) {
  const sanitized = formula
    .trim()
    .replace(/\s+/g, "")
    .replace(/[\u00b7]/g, ".")
    .replace(/\((aq|s|l|g)\)$/i, "");

  const parts = sanitized.split(".");
  return parts.reduce((acc, part) => {
    if (!part) {
      return acc;
    }
    const contribution = parseSingleFormulaPart(part);
    mergeCounts(acc, contribution);
    return acc;
  }, {});
}

function parseSingleFormulaPart(part) {
  if (!part) {
    return {};
  }
  let body = part;
  let multiplier = 1;
  const leading = body.match(/^(\d+)(.*)$/);
  if (leading && leading[2]) {
    multiplier = Number.parseInt(leading[1], 10);
    body = leading[2];
  }

  let index = 0;
  const stack = [{}];

  function readNumber() {
    let number = "";
    while (index < body.length && /[0-9]/.test(body[index])) {
      number += body[index];
      index += 1;
    }
    return number ? Number.parseInt(number, 10) : 1;
  }

  function readElement() {
    let symbol = body[index];
    index += 1;
    while (index < body.length && /[a-z]/.test(body[index])) {
      symbol += body[index];
      index += 1;
    }
    return symbol;
  }

  function currentTarget() {
    return stack[stack.length - 1];
  }

  while (index < body.length) {
    const char = body[index];
    if (char === "(" || char === "[") {
      index += 1;
      stack.push({});
    } else if (char === ")" || char === "]") {
      index += 1;
      const factor = readNumber();
      const group = stack.pop();
      const target = currentTarget();
      const multiplierValue = factor || 1;
      Object.entries(group).forEach(([element, count]) => {
        target[element] = (target[element] ?? 0) + count * multiplierValue;
      });
    } else if (/[A-Z]/.test(char)) {
      const element = readElement();
      const amount = readNumber();
      const target = currentTarget();
      target[element] = (target[element] ?? 0) + (amount || 1);
    } else if (char === "+" || char === "-" || char === "\u00b7" || char === "\u2212") {
      index += 1;
    } else if (char === "^" || char === "{" || char === "}") {
      index += 1;
    } else {
      index += 1;
    }
  }

  const result = stack.reduce((acc, group) => {
    mergeCounts(acc, group);
    return acc;
  }, {});
  return scaleCounts(result, multiplier);
}

function scaleCounts(counts, factor) {
  const scaled = {};
  Object.entries(counts).forEach(([element, value]) => {
    scaled[element] = value * factor;
  });
  return scaled;
}

function scaleAndAdd(atoms, factor, target) {
  Object.entries(atoms).forEach(([element, count]) => {
    const scaled = count * factor;
    target[element] = (target[element] ?? 0) + scaled;
  });
}

function mergeCounts(target, source) {
  Object.entries(source).forEach(([element, value]) => {
    target[element] = (target[element] ?? 0) + value;
  });
}

// Enhanced formula rendering helpers (HTML and TeX)
function renderFormulaHTML(formula) {
  if (!formula) return "";
  let f = String(formula);
  // Prepass: trailing charge without caret (e.g., Fe2+ -> Fe^2+)
  f = f.replace(/([A-Za-z\)\]]+)(\d+[+-])$/g, '$1^$2');
  // Caret charge notation like ^2- or ^+
  f = f.replace(/\^([0-9]*[+-])/g, '<sup>$1</sup>');
  // Element subscripts: H2 -> H<sub>2</sub>
  f = f.replace(/([A-Z][a-z]?)(\d+)/g, (_, element, digits) => `${element}<sub>${digits}</sub>`);
  // Group subscripts: (OH)2 -> (OH)<sub>2</sub>
  f = f.replace(/\)(\d+)/g, ')<sub>$1</sub>');
  // Trailing charge like Fe2+ or + at end
  const chargeMatch = f.match(/(?:\d+[+-]|[+-])$/);
  if (chargeMatch) {
    f = f.slice(0, -chargeMatch[0].length) + `<sup>${chargeMatch[0]}</sup>`;
  }
  return f;
}

function renderFormulaTeX(formula) {
  if (!formula) return "";
  let f = String(formula);
  // Prepass: trailing charge without caret (e.g., Fe2+ -> Fe^2+)
  f = f.replace(/([A-Za-z\)\]]+)(\d+[+-])$/g, '$1^$2');
  // Caret charge: ^2-  -> ^{2-}, ^+ -> ^{+}
  f = f.replace(/\^([0-9]*[+-])/g, '^{$1}');
  // Element subscripts: H2 -> H_{2}
  f = f.replace(/([A-Z][a-z]?)(\d+)/g, '$1_{$2}');
  // Group subscripts: (OH)2 -> (OH)_{2}
  f = f.replace(/\)(\d+)/g, ')_{$1}');
  // Trailing charge at end
  const chargeMatch = f.match(/(?:\d+[+-]|[+-])$/);
  if (chargeMatch) {
    f = f.slice(0, -chargeMatch[0].length) + `^{${chargeMatch[0]}}`;
  }
  return f;
}

function formatFormulaHTML(formula) {
  return formula.replace(/([A-Z][a-z]?)(\d+)/g, (_, element, digits) => {
    return `${element}<sub>${digits}</sub>`;
  });
}

function formatFormulaTeX(formula) {
  return formula.replace(/([A-Z][a-z]?)(\d+)/g, (_, element, digits) => {
    return `${element}_{${digits}}`;
  });
}

function formatDifference(diff) {
  if (diff === 0) {
    return "0";
  }
  return diff > 0 ? `+${diff}` : `${diff}`;
}

function areCountsBalanced(leftCounts, rightCounts) {
  const allElements = new Set([
    ...Object.keys(leftCounts),
    ...Object.keys(rightCounts),
  ]);
  for (const element of allElements) {
    if ((leftCounts[element] ?? 0) !== (rightCounts[element] ?? 0)) {
      return false;
    }
  }
  return true;
}

let __typesetAttempts = 0;
function typesetFormulas() {
  const mj = window.MathJax;
  if (mj && typeof mj.typesetPromise === "function") {
    __typesetAttempts = 0;
    mj.typesetPromise();
  } else if (__typesetAttempts < 20) {
    __typesetAttempts += 1;
    setTimeout(typesetFormulas, 100);
  }
}

function clearFeedback() {
  setFeedback("", "neutral");
}

function setFeedback(message, level) {
  const variantClasses = {
    neutral: "neutral",
    success: "success",
    error: "error",
    hint: "hint",
  };
  elements.feedback.textContent = message;
  const variant = variantClasses[level] ?? variantClasses.neutral;
  elements.feedback.className = `feedback-msg ${variant}`;
}

function collectUserCoefficients() {
  return Array.from(
    elements.equationContainer.querySelectorAll("input[type='number']")
  ).map((input) => Number.parseInt(input.value, 10) || 0);
}

function isBalanced() {
  const { reactius, productes } = state.currentEquation;
  const userCoefficients = collectUserCoefficients();
  const { leftCounts, rightCounts } = calculateAtomBalance(
    reactius,
    productes,
    userCoefficients
  );
  const allElements = new Set([
    ...Object.keys(leftCounts),
    ...Object.keys(rightCounts),
  ]);
  for (const element of allElements) {
    if ((leftCounts[element] ?? 0) !== (rightCounts[element] ?? 0)) {
      return false;
    }
  }
  return userCoefficients.some((value) => value > 0);
}

function showHint() {
  if (!state.hintsEnabled) {
    setFeedback(
      "Les pistes estan desactivades. Activa-les al panell lateral.",
      "neutral"
    );
    return;
  }
  const { reactius, productes } = state.currentEquation;
  const userCoefficients = collectUserCoefficients();
  const { leftCounts, rightCounts } = calculateAtomBalance(
    reactius,
    productes,
    userCoefficients
  );
  let worstElement = null;
  let largestGap = 0;
  Object.keys({ ...leftCounts, ...rightCounts }).forEach((element) => {
    const diff = Math.abs((leftCounts[element] ?? 0) - (rightCounts[element] ?? 0));
    if (diff > largestGap) {
      largestGap = diff;
      worstElement = element;
    }
  });
  if (!worstElement || largestGap === 0) {
    setFeedback("Ja ho tens equilibrat! Repassa i comprova per confirmar-ho.", "hint");
    return;
  }
  const reactantSide = reactius.find((comp) => parseFormula(comp)[worstElement]);
  const productSide = productes.find((comp) => parseFormula(comp)[worstElement]);
  setFeedback(
    `Revisa l'element ${worstElement}. Mira el compost ${
      leftCounts[worstElement] > rightCounts[worstElement]
        ? productSide
        : reactantSide
    } per compensar.`,
    "hint"
  );
}

function showSolution() {
  const solution = state.currentEquation.coeficients || [];
  solution.forEach((value, index) => updateCoefficient(index, value));
  updateAtomTable();
  setFeedback(
    "Coeficients corregits segons la soluci\u00f3 de refer\u00e8ncia.",
    "success"
  );
}

function resetCoefficients() {
  if (!state.currentEquation) {
    return;
  }
  const total =
    state.currentEquation.reactius.length +
    state.currentEquation.productes.length;
  state.currentCoefficients = Array(total).fill(1);
  renderEquation();
  updateAtomTable();
  clearFeedback();
}

function handleCheck() {
  const balanced = isBalanced();
  state.attempts += 1;
  if (balanced) {
    state.correct += 1;
    state.streak += 1;
    setFeedback(
      "Perfecte! Has equilibrat correctament l'equaci\u00f3.",
      "success"
    );
  } else {
    state.streak = 0;
    setFeedback(
      "Encara hi ha difer\u00e8ncies entre reactius i productes. Mira la taula d'\u00e0toms.",
      "error"
    );
  }
  updateScoreboard();
  updateBalanceIndicator(balanced);
}

function formatTypeLabel(type) {
  if (!type) {
    return "Sense classificaci\u00f3";
  }
  if (state.typeLabels[type]) {
    return maybeFixMojibake(state.typeLabels[type]);
  }
  return type
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

function updateBalanceIndicator(isBalanced) {
  if (!elements.balanceStatus) {
    return;
  }
  elements.balanceStatus.textContent = isBalanced
    ? "Equilibrada"
    : "No equilibrada";
  elements.balanceStatus.classList.toggle("balanced", isBalanced);
  elements.balanceStatus.classList.toggle("not-balanced", !isBalanced);

  if (elements.moodBadge) {
    elements.moodBadge.textContent = isBalanced ? "\u{1F60A}" : "\u{1F914}";
    elements.moodBadge.classList.toggle("balanced", isBalanced);
    elements.moodBadge.classList.toggle("not-balanced", !isBalanced);
  }
  if (elements.balanceCaption) {
    elements.balanceCaption.innerHTML = isBalanced
      ? STATUS_COPY.balanced
      : STATUS_COPY.working;
  }
}

function updateScoreboard() {
  if (elements.attemptCount) {
    elements.attemptCount.textContent = String(state.attempts);
  }
  if (elements.correctCount) {
    elements.correctCount.textContent = String(state.correct);
  }
  if (elements.streakCount) {
    elements.streakCount.textContent = String(state.streak);
  }
  saveStatsToStorage();
}

function applyAtomPanelVisibility() {
  if (!elements.atomPanel) {
    return;
  }
  if (state.showAtoms) {
    elements.atomPanel.classList.remove("hidden-panel");
  } else {
    elements.atomPanel.classList.add("hidden-panel");
  }
}

function attachEventHandlers() {
  if (elements.typeSelect) {
    elements.typeSelect.addEventListener("change", () => {
      applyTypeFilter();
      pickRandomEquation();
    });
  }
  if (elements.difficultyLevel) {
    elements.difficultyLevel.addEventListener("change", () => {
      applyTypeFilter();
      pickRandomEquation();
    });
  }
  elements.newEquationBtn?.addEventListener("click", pickRandomEquation);
  elements.checkBtn?.addEventListener("click", handleCheck);
  elements.hintBtn?.addEventListener("click", showHint);
  elements.solutionBtn?.addEventListener("click", showSolution);
  elements.resetBtn?.addEventListener("click", resetCoefficients);

  elements.toggleAtoms?.addEventListener("change", (event) => {
    state.showAtoms = Boolean(event.target.checked);
    applyAtomPanelVisibility();
  });
  elements.toggleHints?.addEventListener("change", (event) => {
    state.hintsEnabled = Boolean(event.target.checked);
    if (!state.hintsEnabled) {
      setFeedback(
        "Les pistes estan desactivades. Activa-les al panell lateral.",
        "neutral"
      );
    } else {
      clearFeedback();
    }
  });
}

function init() {
  attachEventHandlers();
  loadStatsFromStorage();
  if (elements.toggleAtoms) {
    elements.toggleAtoms.checked = state.showAtoms;
  }
  if (elements.toggleHints) {
    elements.toggleHints.checked = state.hintsEnabled;
  }
  applyAtomPanelVisibility();
  updateScoreboard();
  updateBalanceIndicator(false);
  loadEquations().catch((error) => {
    console.error(error);
    setFeedback(error.message, "error");
  });
}

init();


// UI enhancements: multi-select filters and level under type
(function enhanceUI() {
  function ensureFilterGroup(id, afterNode) {
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement('div');
      node.id = id;
      node.className = 'filter-group';
      const parent = afterNode?.parentElement;
      if (parent) parent.insertAdjacentElement('afterend', node);
    }
    return node;
  }

  const originalPopulate = populateTypeOptions;
  if (typeof originalPopulate === 'function') {
    populateTypeOptions = function patchedPopulateTypeOptions() {
      originalPopulate();
      try {
        const types = Array.from(new Set(state.equations.map((eq) => eq.tipus)))
          .sort((a, b) => formatTypeLabel(a).localeCompare(formatTypeLabel(b)));
        const typeBox = ensureFilterGroup('typeFilters', elements.typeSelect);
        typeBox.innerHTML = '';
        types.forEach((type) => {
          const label = document.createElement('label');
          label.className = 'filter-check';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.value = type;
          input.checked = true;
          const span = document.createElement('span');
          span.textContent = formatTypeLabel(type);
          label.append(input, span);
          typeBox.appendChild(label);
        });
        typeBox.addEventListener('change', () => { applyTypeFilter(); pickRandomEquation(); });
      } catch {}
      try {
        const levelBox = ensureFilterGroup('levelFilters', elements.difficultyLevel);
        levelBox.innerHTML = '';
        [1, 2, 3].forEach((lvl) => {
          const label = document.createElement('label');
          label.className = 'filter-check';
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.value = String(lvl);
          input.checked = true;
          const span = document.createElement('span');
          span.innerHTML = `<span class="level-chip l${lvl}">${lvl===1?"Nivell fàcil":(lvl===2?"Nivell intermedi":"Nivell avançat")}</span>`;
          label.append(input, span);
          levelBox.appendChild(label);
        });
        levelBox.addEventListener('change', () => { applyTypeFilter(); pickRandomEquation(); });
      } catch {}
    };
  }

  const originalApply = applyTypeFilter;
  if (typeof originalApply === 'function') {
    applyTypeFilter = function patchedApplyTypeFilter() {
      const typeChecks = document.querySelectorAll('#typeFilters input[type="checkbox"]:checked');
      const levelChecks = document.querySelectorAll('#levelFilters input[type="checkbox"]:checked');
      if (!typeChecks.length && !levelChecks.length) {
        return originalApply();
      }
      const selectedTypes = Array.from(typeChecks).map((i) => i.value);
      const selectedLevels = Array.from(levelChecks).map((i) => String(i.value));
      state.filteredEquations = state.equations.filter((eq) => {
        const okType = !selectedTypes.length || selectedTypes.includes(eq.tipus);
        const okLevel = !selectedLevels.length || selectedLevels.includes(String(eq.nivell));
        return okType && okLevel;
      });
      state.filteredEquations.sort((a, b) => (a.nivell !== b.nivell ? a.nivell - b.nivell : a.id.localeCompare(b.id)));
    };
  }

  const originalRender = renderEquation;
  if (typeof originalRender === 'function') {
    renderEquation = function patchedRenderEquation() {
      originalRender();
      try {
        const eq = state.currentEquation;
        if (!eq || !elements.equationTitle) return;
        const titleType = `<span class="type-chip">${escapeHTML(formatTypeLabel(eq.tipus))}</span>`;
        const lvl = Number.isFinite(eq.nivell) ? eq.nivell : 1;
        const titleLevel = `<span class="level-chip l${lvl}">${lvl===1?"Nivell fàcil":(lvl===2?"Nivell intermedi":"Nivell avançat")}</span>`;
        const titleDesc = eq.explicacio ? `<span class="reaction-desc">${escapeHTML(maybeFixMojibake(eq.explicacio))}</span>` : '';
        elements.equationTitle.innerHTML = `${titleType}${titleDesc ? ' \u2013 ' + titleDesc : ''}<br>${titleLevel}`;
      } catch {}
    };
  }
})();

// Dropdown toggles for multi-selects
(function setupMultiSelects(){
  function setup(idBtn, idBox){
    const btn = document.getElementById(idBtn);
    const wrap = document.getElementById(idBox)?.closest('.multi-select');
    if(!btn || !wrap) return;
    btn.addEventListener('click', ()=>{
      wrap.classList.toggle('open');
    });
    document.addEventListener('click', (e)=>{
      if(!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  }
  setup('typeDropdownBtn','typeFilters');
  setup('levelDropdownBtn','levelFilters');
})();

// Update dropdown labels with current selection
(function labelUpdates(){
  function updateLabel(containerId, btnId, allText){
    const box = document.getElementById(containerId);
    const btn = document.getElementById(btnId);
    if(!box || !btn) return;
    const checked = box.querySelectorAll("input[type='checkbox']:checked");
    if(!checked.length){ btn.textContent = allText; return; }
    if(checked.length > 3){ btn.textContent = `${checked.length} seleccionats`; return; }
    btn.textContent = Array.from(checked).map(i=>i.nextElementSibling?.textContent||i.value).join(', ');
  }
  document.addEventListener('change', (e)=>{
    if(e.target && e.target.matches('#typeFilters input[type="checkbox"], #levelFilters input[type="checkbox"]')){
      updateLabel('typeFilters','typeDropdownBtn','Tots els tipus');
      updateLabel('levelFilters','levelDropdownBtn','Tots els nivells');
    }
  });
})();





function saveFiltersToStorage(types, levels) {
  try {
    const payload = { types: Array.from(new Set(types || [])), levels: Array.from(new Set(levels || [])) };
    localStorage.setItem(STORAGE_KEYS.filters, JSON.stringify(payload));
  } catch {}
}

function loadFiltersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.filters);
    if (!raw) return { types: [], levels: [] };
    const data = JSON.parse(raw);
    return {
      types: Array.isArray(data?.types) ? data.types : [],
      levels: Array.isArray(data?.levels) ? data.levels : [],
    };
  } catch { return { types: [], levels: [] }; }
}
