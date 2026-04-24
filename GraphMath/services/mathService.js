function analyzeSystem(expressions) {
  const parsedExpressions = expressions.map(parseExpression).filter((p) => p !== null && p.isEquation && p.variable === "y" && typeof p.func === "function");
  if (parsedExpressions.length < 2) {
    return {
      domainNotes: ["Un sistema necessita almenys dues equacions (y = ...)."]
    };
  }
  if (parsedExpressions.length === 2) {
    const f1 = parsedExpressions[0].func;
    const f2 = parsedExpressions[1].func;
    const verySmallTolerance = 1e-9;
    const testPoints = [-10, 0, 10, 7.5];
    let areEquivalent = true;
    for (const x of testPoints) {
      try {
        const y1 = f1(x);
        const y2 = f2(x);
        if (!isFinite(y1) || !isFinite(y2) || Math.abs(y1 - y2) > verySmallTolerance) {
          areEquivalent = false;
          break;
        }
      } catch (e) {
        areEquivalent = false;
        break;
      }
    }
    if (areEquivalent) {
      return { domainNotes: [], systemSolutionStatus: "INFINITE_SOLUTIONS" };
    }
  }
  const intersections = [];
  const range = 100;
  const step = 0.01;
  const yTolerance = 0.02;
  for (let x = -range; x < range; x += step) {
    try {
      const yValues = parsedExpressions.map((p) => p.func(x));
      if (yValues.some((y) => !isFinite(y))) continue;
      const maxDiff = Math.max(...yValues) - Math.min(...yValues);
      if (maxDiff < yTolerance) {
        const avgY = yValues.reduce((a, b) => a + b, 0) / yValues.length;
        if (intersections.every((p) => Math.abs(p.x - x) > step * 10)) {
          intersections.push({ x, y: avgY });
        }
      }
    } catch (e) {
      continue;
    }
  }
  if (intersections.length > 0) {
    return {
      domainNotes: [],
      systemSolutionStatus: "LIMITED_SOLUTIONS",
      intersectionPoints: intersections
    };
  }
  if (parsedExpressions.length === 2) {
    const f1 = parsedExpressions[0].func;
    const f2 = parsedExpressions[1].func;
    const diffPoints = [-50, 0, 50];
    const diffs = [];
    let isValidForParallelCheck = true;
    for (const x of diffPoints) {
      try {
        const y1 = f1(x);
        const y2 = f2(x);
        if (!isFinite(y1) || !isFinite(y2)) {
          isValidForParallelCheck = false;
          break;
        }
        diffs.push(Math.abs(y1 - y2));
      } catch (e) {
        isValidForParallelCheck = false;
        break;
      }
    }
    if (isValidForParallelCheck && diffs.length === diffPoints.length) {
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const areParallel = avgDiff > yTolerance && diffs.every((d) => Math.abs(d - avgDiff) / avgDiff < 0.1);
      if (areParallel) {
        return { domainNotes: [], systemSolutionStatus: "NO_SOLUTION" };
      }
    }
  }
  return {
    domainNotes: [],
    systemSolutionStatus: "LIMITED_SOLUTIONS",
    intersectionPoints: []
  };
}
function analyzeExpression(expression) {
  const notes = /* @__PURE__ */ new Set();
  if (/\bsqrt\s*\(/.test(expression)) {
    notes.add("L'expressi\xF3 dins de l'arrel quadrada (`sqrt`) ha de ser \u2265 0.");
  }
  if (/\blog\s*\(/.test(expression)) {
    notes.add("L'argument del logaritme (`log`) ha de ser > 0.");
  }
  if (/\btan\s*\(/.test(expression)) {
    notes.add("L'argument de la tangent (`tan`) no pot ser \u03C0/2 + n\xB7\u03C0.");
  }
  const result = {
    domainNotes: Array.from(notes)
  };
  const parsed = parseExpression(expression);
  if (parsed && parsed.variable === "y" && typeof parsed.func === "function") {
    const yAtZero = parsed.func(0);
    if (isFinite(yAtZero)) {
      result.yIntercept = yAtZero;
    } else {
      result.yIntercept = "No definit en x=0";
    }
    const roots = [];
    const step = 0.01;
    const range = 100;
    let lastY = parsed.func(-range);
    for (let x = -range + step; x <= range; x += step) {
      const currentY = parsed.func(x);
      if (isFinite(lastY) && isFinite(currentY)) {
        if (lastY * currentY < 0) {
          const root = x - step / 2;
          if (roots.every((r) => Math.abs(r - root) > step * 2)) {
            roots.push(root);
          }
        }
      }
      lastY = currentY;
    }
    result.xIntercepts = roots;
  }
  return result;
}
function prepareForFunction(expr) {
  let prepared = expr.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "(($1)/($2))").replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)").replace(/\\cdot/g, "*").replace(/\\pi/g, "PI");
  prepared = prepared.replace(/\^/g, "**");
  prepared = prepared.replace(/(\d)([a-zA-Z(])/g, "$1*$2");
  prepared = prepared.replace(/\)([a-zA-Z(])/g, ")*$1");
  prepared = prepared.replace(/\b([a-zA-Z_]+)\(/g, (match, p1) => {
    const mathFuncs2 = ["sin", "cos", "tan", "log", "sqrt", "abs", "pow", "exp", "ceil", "floor", "round"];
    if (mathFuncs2.includes(p1.toLowerCase())) {
      return match;
    }
    return `${p1}*(`;
  });
  const mathFuncs = ["sin", "cos", "tan", "log", "sqrt", "abs", "pow", "exp", "ceil", "floor", "round"];
  mathFuncs.forEach((func) => {
    const regex = new RegExp(`(?<!Math\\.)${`\\b${func}\\b`}`, "gi");
    prepared = prepared.replace(regex, `Math.${func}`);
  });
  prepared = prepared.replace(/\bPI\b/gi, "Math.PI");
  prepared = prepared.replace(/\be\b/g, "Math.E");
  return prepared;
}
function parseLinearValue(value) {
  if (value === "" || value === "+") return 1;
  if (value === "-") return -1;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}
function parseLinearExpression(expression) {
  const compact = expression.trim().replace(/\s+/g, "").replace(/[−–]/g, "-");
  if (!compact) return null;
  const normalized = /^[+-]/.test(compact) ? compact : `+${compact}`;
  const terms = normalized.match(/[+-][^+-]+/g);
  if (!terms) return null;
  let x = 0;
  let y = 0;
  let constant = 0;
  for (const term of terms) {
    const hasX = term.includes("x");
    const hasY = term.includes("y");
    if (hasX && hasY) return null;
    if (hasX) {
      const coefficient = parseLinearValue(term.replace("x", ""));
      if (!Number.isFinite(coefficient)) return null;
      x += coefficient;
      continue;
    }
    if (hasY) {
      const coefficient = parseLinearValue(term.replace("y", ""));
      if (!Number.isFinite(coefficient)) return null;
      y += coefficient;
      continue;
    }
    const numeric = Number(term);
    if (!Number.isFinite(numeric)) return null;
    constant += numeric;
  }
  return { x, y, constant };
}
function parseImplicitLinearEquation(expression) {
  const parts = expression.split("=");
  if (parts.length !== 2) return null;
  const left = parseLinearExpression(parts[0]);
  const right = parseLinearExpression(parts[1]);
  if (!left || !right) return null;
  const a = left.x - right.x;
  const b = left.y - right.y;
  const c = right.constant - left.constant;
  if (Math.abs(a) < 1e-12 && Math.abs(b) < 1e-12) return null;
  return { a, b, c };
}
function parseIntervalExpression(expression) {
  const trimmed = expression.trim().replace(/≤/g, "<=").replace(/≥/g, ">=");
  let match = trimmed.match(/^(.*?)\s*(<=|<)\s*([xy])\s*(<=|<)\s*(.*?)$/i);
  if (match) {
    const [, lowerStr, lowerOp, variable, upperOp, upperStr] = match;
    try {
      const lowerBound = new Function(`with(Math){return ${prepareForFunction(lowerStr)}}`)();
      const upperBound = new Function(`with(Math){return ${prepareForFunction(upperStr)}}`)();
      if (typeof lowerBound !== "number" || typeof upperBound !== "number" || !isFinite(lowerBound) || !isFinite(upperBound)) return null;
      return {
        variable: variable.toLowerCase(),
        lowerBound,
        upperBound,
        lowerInclusive: lowerOp === "<=",
        upperInclusive: upperOp === "<="
      };
    } catch (e) {
      return null;
    }
  }
  match = trimmed.match(/^(.*?)\s*(>=|>)\s*([xy])\s*(>=|>)\s*(.*?)$/i);
  if (match) {
    const [, upperStr, upperOp, variable, lowerOp, lowerStr] = match;
    try {
      const lowerBound = new Function(`with(Math){return ${prepareForFunction(lowerStr)}}`)();
      const upperBound = new Function(`with(Math){return ${prepareForFunction(upperStr)}}`)();
      if (typeof lowerBound !== "number" || typeof upperBound !== "number" || !isFinite(lowerBound) || !isFinite(upperBound)) return null;
      return {
        variable: variable.toLowerCase(),
        lowerBound,
        upperBound,
        lowerInclusive: lowerOp === ">=",
        upperInclusive: upperOp === ">="
      };
    } catch (e) {
      return null;
    }
  }
  match = trimmed.match(/^([xy])\s*(>=|>|<=|<)\s*(.*)$/i);
  if (match) {
    const [, variable, op, valueStr] = match;
    try {
      const value = new Function(`with(Math){return ${prepareForFunction(valueStr)}}`)();
      if (typeof value !== "number" || !isFinite(value)) return null;
      const result = {
        variable: variable.toLowerCase(),
        lowerBound: -Infinity,
        upperBound: Infinity,
        lowerInclusive: false,
        upperInclusive: false
      };
      if (op === ">" || op === ">=") {
        result.lowerBound = value;
        result.lowerInclusive = op === ">=";
      } else {
        result.upperBound = value;
        result.upperInclusive = op === "<=";
      }
      return result;
    } catch (e) {
      return null;
    }
  }
  match = trimmed.match(/^(.*?)\s*(>=|>|<=|<)\s*([xy])$/i);
  if (match) {
    const [, valueStr, op, variable] = match;
    try {
      const value = new Function(`with(Math){return ${prepareForFunction(valueStr)}}`)();
      if (typeof value !== "number" || !isFinite(value)) return null;
      const result = {
        variable: variable.toLowerCase(),
        lowerBound: -Infinity,
        upperBound: Infinity,
        lowerInclusive: false,
        upperInclusive: false
      };
      if (op === "<" || op === "<=") {
        result.lowerBound = value;
        result.lowerInclusive = op === "<=";
      } else {
        result.upperBound = value;
        result.upperInclusive = op === ">=";
      }
      return result;
    } catch (e) {
      return null;
    }
  }
  return null;
}
function parseExpression(expression) {
  try {
    const trimmedExpression = expression.trim();
    if (!trimmedExpression) return null;
    const implicitLinear = parseImplicitLinearEquation(trimmedExpression);
    if (implicitLinear) {
      return {
        isEquation: true,
        variable: implicitLinear.b !== 0 ? "y" : "x",
        inequalityType: void 0,
        implicitType: "linear",
        coefficients: implicitLinear
      };
    }
    const operatorMatch = trimmedExpression.match(/([<>=≤≥]+)/);
    if (!operatorMatch || operatorMatch.index === 0) return null;
    const operator = operatorMatch[0];
    const operatorIndex = operatorMatch.index;
    let variableStr = trimmedExpression.substring(0, operatorIndex).trim();
    let exprStr = trimmedExpression.substring(operatorIndex + operator.length).trim();
    if (["x", "y"].indexOf(variableStr) === -1 && ["x", "y"].indexOf(exprStr) !== -1) {
      [variableStr, exprStr] = [exprStr, variableStr];
    }
    if (variableStr !== "x" && variableStr !== "y") {
      return null;
    }
    const variable = variableStr;
    const otherVar = variable === "x" ? "y" : "x";
    let isEquation = false;
    let inequalityType = void 0;
    switch (operator) {
      case "=":
      case "==":
        isEquation = true;
        break;
      case "<":
        inequalityType = "<";
        break;
      case ">":
        inequalityType = ">";
        break;
      case "<=":
      case "\u2264":
        inequalityType = "<=";
        break;
      case ">=":
      case "\u2265":
        inequalityType = ">=";
        break;
      default:
        return null;
    }
    const preparedExpr = prepareForFunction(exprStr);
    if (preparedExpr.trim() === "" || /[*/+-]$/.test(preparedExpr.trim()) || preparedExpr.trim().endsWith("**")) {
      return null;
    }
    const funcBody = `
      try {
        with(Math) {
          return ${preparedExpr};
        }
      } catch (e) {
        return NaN;
      }
    `;
    const func = new Function(otherVar, funcBody);
    const testResult = func(1);
    if (typeof testResult !== "number") {
      return null;
    }
    return {
      func,
      variable,
      isEquation,
      inequalityType,
      implicitType: null,
      coefficients: null
    };
  } catch (e) {
    return null;
  }
}
export {
  analyzeExpression,
  analyzeSystem,
  parseExpression,
  parseIntervalExpression
};
