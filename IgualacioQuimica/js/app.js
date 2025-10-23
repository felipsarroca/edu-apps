const DATA_URL = "data/eq_inspeccio.json";

const state = {
  equations: [],
  filteredEquations: [],
  currentEquation: null,
  currentCoefficients: [],
};

const elements = {
  typeSelect: document.getElementById("reactionType"),
  newEquationBtn: document.getElementById("newEquationBtn"),
  equationContainer: document.getElementById("equationContainer"),
  equationTitle: document.getElementById("equationTitle"),
  checkBtn: document.getElementById("checkBtn"),
  hintBtn: document.getElementById("hintBtn"),
  solutionBtn: document.getElementById("solutionBtn"),
  resetBtn: document.getElementById("resetBtn"),
  feedback: document.getElementById("feedback"),
  atomTable: document.getElementById("atomTable"),
};

const TYPE_LABELS = {
  combustio: "Combustió",
  oxidacio: "Oxidació",
  neutralitzacio: "Neutralització",
  descomposicio: "Descomposició",
  sintesi: "Síntesi",
  desplacament_simple: "Desplaçament simple",
  desplacament_doble: "Desplaçament doble",
};

async function loadEquations() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error("No s'ha pogut carregar la base de dades d'equacions.");
  }
  state.equations = await response.json();
  populateTypeOptions();
  applyTypeFilter();
  pickRandomEquation();
}

function populateTypeOptions() {
  const types = new Set(state.equations.map((eq) => eq.tipus));
  elements.typeSelect.innerHTML = '<option value="tots">Tots els tipus</option>';
  Array.from(types)
    .sort()
    .forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = formatTypeLabel(type);
      elements.typeSelect.appendChild(option);
    });
}

function applyTypeFilter() {
  const selected = elements.typeSelect.value;
  state.filteredEquations =
    selected === "tots"
      ? [...state.equations]
      : state.equations.filter((eq) => eq.tipus === selected);
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
  updateAtomTable();
  clearFeedback();
}

function buildDefaultCoefficients(equation) {
  const totalCompounds =
    equation.reactius.length + equation.productes.length;
  return Array(totalCompounds).fill(1);
}

function renderEquation() {
  const { reactius, productes, tipus, explicacio } = state.currentEquation;
  elements.equationContainer.innerHTML = "";
  renderSide(reactius, "reactant", 0);
  const arrow = document.createElement("span");
  arrow.textContent = "→";
  arrow.className = "text-2xl font-semibold text-emerald-400";
  elements.equationContainer.appendChild(arrow);
  renderSide(productes, "producte", reactius.length);
  elements.equationTitle.textContent = [
    formatTypeLabel(tipus),
    explicacio || "",
  ]
    .filter(Boolean)
    .join(" · ");
  typesetFormulas();
}

function renderSide(compounds, side, offset) {
  const sideWrapper = document.createElement("div");
  sideWrapper.className =
    "flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto";

  compounds.forEach((compound, idx) => {
    const globalIndex = offset + idx;
    const block = document.createElement("div");
    block.className =
      "flex items-center gap-2 bg-slate-900/70 rounded-lg px-3 py-2";

    const decrementBtn = document.createElement("button");
    decrementBtn.type = "button";
    decrementBtn.className =
      "w-8 h-8 rounded-md bg-slate-800 hover:bg-slate-700 text-lg leading-none";
    decrementBtn.textContent = "−";
    decrementBtn.addEventListener("click", () => {
      updateCoefficient(globalIndex, Math.max(0, getCoefficient(globalIndex) - 1));
    });

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.value = getCoefficient(globalIndex);
    input.dataset.index = String(globalIndex);
    input.addEventListener("input", () => {
      const value = Number.parseInt(input.value, 10);
      updateCoefficient(globalIndex, Number.isFinite(value) ? value : 0);
    });

    const incrementBtn = document.createElement("button");
    incrementBtn.type = "button";
    incrementBtn.className =
      "w-8 h-8 rounded-md bg-slate-800 hover:bg-slate-700 text-lg leading-none";
    incrementBtn.textContent = "+";
    incrementBtn.addEventListener("click", () => {
      updateCoefficient(globalIndex, getCoefficient(globalIndex) + 1);
    });

    const formulaSpan = document.createElement("span");
    formulaSpan.className = "formula text-lg";
    formulaSpan.innerHTML = formatFormulaHTML(compound);

    if (idx > 0) {
      const plus = document.createElement("span");
      plus.textContent = "+";
      plus.className = "mx-2 text-emerald-300 font-semibold";
      sideWrapper.appendChild(plus);
    }

    block.appendChild(decrementBtn);
    block.appendChild(input);
    block.appendChild(incrementBtn);
    block.appendChild(formulaSpan);
    sideWrapper.appendChild(block);
  });

  elements.equationContainer.appendChild(sideWrapper);
}

function getCoefficient(index) {
  return state.currentCoefficients[index] ?? 0;
}

function updateCoefficient(index, newValue) {
  state.currentCoefficients[index] = Math.max(newValue, 0);
  const input = elements.equationContainer.querySelector(
    `input[data-index="${index}"]`
  );
  if (input) {
    input.value = state.currentCoefficients[index];
  }
  updateAtomTable();
  clearFeedback();
}

function updateAtomTable() {
  if (!state.currentEquation) {
    elements.atomTable.innerHTML = "";
    return;
  }
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
    .replace(/[·]/g, ".")
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
    } else if (char === "+" || char === "-" || char === "·" || char === "−") {
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

function formatFormulaHTML(formula) {
  return formula.replace(/([A-Z][a-z]?)(\d+)/g, (_, element, digits) => {
    return `${element}<sub>${digits}</sub>`;
  });
}

function formatDifference(diff) {
  if (diff === 0) {
    return "0";
  }
  return diff > 0 ? `+${diff}` : `${diff}`;
}

function typesetFormulas() {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise();
  }
}

function clearFeedback() {
  setFeedback("", "neutral");
}

function setFeedback(message, level) {
  const classes = {
    neutral: "text-slate-300",
    success: "text-emerald-300",
    error: "text-rose-300",
    hint: "text-sky-300",
  };
  elements.feedback.textContent = message;
  elements.feedback.className = `text-base font-medium ${classes[level] ?? classes.neutral}`;
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
  setFeedback("Coeficients corregits segons la solució de referència.", "success");
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
  if (isBalanced()) {
    setFeedback("Perfecte! Has equilibrat correctament l'equació.", "success");
  } else {
    setFeedback(
      "Encara hi ha diferències entre reactius i productes. Mira la taula d'àtoms.",
      "error"
    );
  }
}

function formatTypeLabel(type) {
  if (!type) {
    return "Sense classificació";
  }
  if (TYPE_LABELS[type]) {
    return TYPE_LABELS[type];
  }
  return type
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

function attachEventHandlers() {
  elements.typeSelect.addEventListener("change", () => {
    applyTypeFilter();
    pickRandomEquation();
  });
  elements.newEquationBtn.addEventListener("click", pickRandomEquation);
  elements.checkBtn.addEventListener("click", handleCheck);
  elements.hintBtn.addEventListener("click", showHint);
  elements.solutionBtn.addEventListener("click", showSolution);
  elements.resetBtn.addEventListener("click", resetCoefficients);
}

function init() {
  attachEventHandlers();
  loadEquations().catch((error) => {
    console.error(error);
    setFeedback(error.message, "error");
  });
}

init();
