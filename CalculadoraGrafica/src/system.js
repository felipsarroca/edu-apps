import { normalizeMathInput, parseInequality } from './parser.js';

const { math } = window;

const TOLERANCE = 1e-6;

const evaluateDiff = (compiled, x, y) => {
  try {
    const value = compiled.evaluate({ x, y });
    if (!Number.isFinite(value)) {
      return null;
    }
    return Number(value);
  } catch (error) {
    return null;
  }
};

const isApproximatelyZero = (value, tolerance = TOLERANCE) =>
  Number.isFinite(value) && Math.abs(value) <= tolerance;

const analyseLinearCoefficients = (compiled) => {
  const f00 = evaluateDiff(compiled, 0, 0);
  const f10 = evaluateDiff(compiled, 1, 0);
  const f20 = evaluateDiff(compiled, 2, 0);
  const f01 = evaluateDiff(compiled, 0, 1);
  const f02 = evaluateDiff(compiled, 0, 2);
  const f11 = evaluateDiff(compiled, 1, 1);

  if (
    [f00, f10, f20, f01, f02, f11].some((value) => value === null)
  ) {
    return { isLinear: false };
  }

  const a1 = f10 - f00;
  const a2 = f20 - f10;
  const b1 = f01 - f00;
  const b2 = f02 - f01;
  const cross = f11 - f10 - f01 + f00;

  if (
    Math.abs(a1 - a2) > TOLERANCE ||
    Math.abs(b1 - b2) > TOLERANCE ||
    Math.abs(cross) > TOLERANCE
  ) {
    return { isLinear: false };
  }

  return {
    isLinear: true,
    coefficients: {
      a: a1,
      b: b1,
      c: f00,
    },
  };
};

export const parseEquation = (rawInput) => {
  const original = rawInput.trim();
  if (!original) {
    throw new Error('Línia buida.');
  }

  const normalized = normalizeMathInput(original);

  if (/(<=|>=|<|>)/.test(normalized)) {
    return null;
  }

  if (!normalized.includes('=')) {
    return null;
  }

  const [leftRaw, rightRaw] = normalized.split('=');
  const left = leftRaw.trim();
  const right = rightRaw.trim();
  if (!left || !right) {
    throw new Error('Equació incompleta.');
  }

  const diffExpression = `${left} - (${right})`;

  let compiled;
  try {
    compiled = math.compile(diffExpression);
    compiled.evaluate({ x: 0, y: 0 });
  } catch (error) {
    throw new Error('No s’ha pogut interpretar aquesta equació.');
  }

  const linearInfo = analyseLinearCoefficients(compiled);

  return {
    type: 'equation',
    display: original,
    normalized,
    diffExpression,
    compiled,
    isLinear: linearInfo.isLinear,
    coefficients: linearInfo.coefficients ?? null,
  };
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return String(value);
  }
  if (Number.isInteger(value)) {
    return value.toString();
  }
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 0.001 || abs >= 1000)) {
    return value.toExponential(2);
  }
  return value.toFixed(4).replace(/\.?0+$/, '');
};

const solveLinear2x2 = (eq1, eq2) => {
  const { a: a1, b: b1, c: c1 } = eq1.coefficients;
  const { a: a2, b: b2, c: c2 } = eq2.coefficients;

  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) <= TOLERANCE) {
    return { status: 'parallel' };
  }

  const x = (c2 * b1 - c1 * b2) / det;
  const y = (a2 * c1 - a1 * c2) / det;

  return { status: 'unique', solution: { x, y } };
};

const buildLinearSystemSummary = (solutionData, equations) => {
  if (solutionData.status === 'parallel') {
    return {
      summary:
        'Sistema sense solució única: les rectes són paral·leles o coincidents.',
      results: [
        {
          label: 'Observació',
          description:
            'Les equacions analitzades no tenen un punt d’intersecció únic.',
        },
      ],
    };
  }

  const { x, y } = solutionData.solution;
  const pointText = `(${formatNumber(x)}, ${formatNumber(y)})`;

  return {
    summary: 'Sistema lineal amb una única solució.',
    results: [
      {
        label: 'Punt d’intersecció',
        description: pointText,
      },
      ...equations.map((equation, index) => ({
        label: `Equació ${index + 1}`,
        description: equation.display,
      })),
    ],
    solution: { x, y },
  };
};

export const analyseSystem = (parsedEntries) => {
  const equations = parsedEntries.filter(
    (entry) => entry.type === 'equation',
  );
  const inequalities = parsedEntries.filter(
    (entry) => entry.type === 'inequality',
  );

  if (equations.length === 2 && equations.every((eq) => eq.isLinear)) {
    const solutionData = solveLinear2x2(equations[0], equations[1]);
    const summaryInfo = buildLinearSystemSummary(solutionData, equations);
    return {
      ...summaryInfo,
      mode: 'linear-equations',
    };
  }

  if (inequalities.length > 0) {
    return {
      summary:
        'Sistema que inclou inequacions: caldrà representar la intersecció de zones a la gràfica.',
      results: inequalities.map((entry, index) => ({
        label: `Inequació ${index + 1}`,
        description: entry.display,
      })),
      mode: 'inequalities',
    };
  }

  return {
    summary:
      'Resolució simbòlica pendent per a aquest tipus de sistema. Es recomana analitzar-lo de manera gràfica.',
    results: parsedEntries.map((entry, index) => ({
      label: `Entrada ${index + 1}`,
      description: entry.display,
    })),
    mode: 'unsupported',
  };
};

export const parseSystemEntry = (expression) => {
  const attemptEquation = parseEquation(expression);
  if (attemptEquation) {
    return attemptEquation;
  }

  try {
    const inequality = parseInequality(expression);
    return {
      type: 'inequality',
      display: expression.trim(),
      inequality,
    };
  } catch (error) {
    throw new Error(
      `No s’ha pogut interpretar "${expression}". Escriu una equació o inequació vàlida.`,
    );
  }
};

export const summarizeSystemEntries = (parsedEntries) =>
  parsedEntries.map((entry) => {
    if (entry.type === 'equation') {
      return {
        type: 'equation',
        display: entry.display,
        isLinear: entry.isLinear,
        coefficients: entry.coefficients
          ? { ...entry.coefficients }
          : null,
        diffExpression: entry.diffExpression,
      };
    }

    if (entry.type === 'inequality') {
      const { inequality } = entry;
      const sanitized = {
        type: inequality.type,
        variable: inequality.variable,
        operator: inequality.operator,
        inclusive: inequality.inclusive,
        orientation: inequality.orientation,
        expression: inequality.expression,
        value: inequality.value,
      };
      if (inequality.range) {
        sanitized.range = {
          lower: inequality.range.lower
            ? {
                value: inequality.range.lower.value,
                inclusive: inequality.range.lower.inclusive,
              }
            : null,
          upper: inequality.range.upper
            ? {
                value: inequality.range.upper.value,
                inclusive: inequality.range.upper.inclusive,
              }
            : null,
        };
      }
      return {
        type: 'inequality',
        display: entry.display,
        inequality: sanitized,
      };
    }

    return {
      type: entry.type,
      display: entry.display,
    };
  });
