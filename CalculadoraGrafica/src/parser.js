const SYMBOL_REPLACEMENTS = {
  '≥': '>=',
  '≤': '<=',
  '≠': '!=',
};

const DOUBLE_PATTERN = /^(.+?)(<=|>=|<|>)(.+?)(<=|>=|<|>)(.+)$/;

const mathInstance =
  (typeof window !== 'undefined' && window.math) ||
  (typeof globalThis !== 'undefined' && globalThis.math) ||
  null;

const normalizeSymbols = (value) =>
  value.replace(/[≥≤≠]/g, (symbol) => SYMBOL_REPLACEMENTS[symbol] ?? symbol);

const normalizeAbsolute = (value) => value.replace(/\|([^|]+)\|/g, 'abs($1)');

const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const hasVariable = (segment, variable) =>
  new RegExp(`^${variable}$`, 'i').test(segment.trim());

const invertOperator = (operator) => {
  switch (operator) {
    case '<':
      return '>';
    case '>':
      return '<';
    case '<=':
      return '>=';
    case '>=':
      return '<=';
    default:
      return operator;
  }
};

const getOrientation = (variable, operator) => {
  if (variable === 'y') {
    return operator === '>' || operator === '>=' ? 'above' : 'below';
  }
  return operator === '>' || operator === '>=' ? 'right' : 'left';
};

const evaluateNumericExpression = (expression) => {
  if (!mathInstance) {
    const value = Number(expression);
    if (!Number.isFinite(value)) {
      throw new Error(`No es pot avaluar "${expression}" com a nombre.`);
    }
    return value;
  }

  let value;
  try {
    value = mathInstance.evaluate(expression);
  } catch (error) {
    throw new Error(`No es pot avaluar "${expression}" com a nombre.`);
  }

  if (!Number.isFinite(value)) {
    throw new Error(`"${expression}" no genera un valor numèric finit.`);
  }
  return Number(value);
};

const parseSingleInequality = (leftRaw, operatorRaw, rightRaw, original) => {
  const left = leftRaw.trim();
  const right = rightRaw.trim();

  const leftIsY = hasVariable(left, 'y');
  const rightIsY = hasVariable(right, 'y');
  const leftIsX = hasVariable(left, 'x');
  const rightIsX = hasVariable(right, 'x');

  const variable = (() => {
    if (leftIsY || rightIsY) {
      return 'y';
    }
    if (leftIsX || rightIsX) {
      return 'x';
    }
    return null;
  })();

  if (!variable) {
    return null;
  }

  const variableOnLeft = variable === 'y' ? leftIsY : leftIsX;
  const variableOnRight = variable === 'y' ? rightIsY : rightIsX;

  if (variableOnLeft && variableOnRight) {
    throw new Error('Només es permet una variable per inequació.');
  }

  let normalizedOperator = operatorRaw;
  let expression = '';

  if (variableOnLeft) {
    expression = right;
  } else if (variableOnRight) {
    normalizedOperator = invertOperator(operatorRaw);
    expression = left;
  } else {
    return null;
  }

  const orientation = getOrientation(variable, normalizedOperator);
  const inclusive = normalizedOperator.includes('=');

  return {
    type: 'single',
    variable,
    operator: normalizedOperator,
    inclusive,
    orientation,
    expression: expression.trim(),
    display: original,
  };
};

const buildRangeFromComparisons = (first, second, original) => {
  if (!first || !second) {
    throw new Error('No s’ha pogut interpretar la desigualtat composta.');
  }

  if (first.variable !== second.variable) {
    throw new Error('Les dues desigualtats han de fer referència a la mateixa variable.');
  }

  const variable = first.variable;

  const result = {
    type: 'double',
    variable,
    display: original,
    range: {},
  };

  const assignBound = (part) => {
    const isLower =
      part.orientation === 'above' || part.orientation === 'right';
    const isUpper =
      part.orientation === 'below' || part.orientation === 'left';

    const value = evaluateNumericExpression(part.expression);
    const bound = {
      raw: part.expression,
      value,
      inclusive:
        (isLower && (part.operator === '>=')) ||
        (isUpper && (part.operator === '<=')),
      operator: isLower
        ? part.operator === '>='
          ? '>='
          : '>'
        : part.operator === '<='
        ? '<='
        : '<',
    };

    if (isLower) {
      result.range.lower = bound;
    } else if (isUpper) {
      result.range.upper = bound;
    }
  };

  assignBound(first);
  assignBound(second);

  if (!result.range.lower || !result.range.upper) {
    throw new Error('No s’ha pogut deduir el rang de la desigualtat composta.');
  }

  if (result.range.lower.value > result.range.upper.value) {
    throw new Error('El límit inferior és superior al límit superior. Revisa la desigualtat.');
  }

  return result;
};

export const normalizeMathInput = (raw) =>
  normalizeAbsolute(normalizeSymbols(raw));

export const parseInequality = (rawInput) => {
  if (typeof rawInput !== 'string') {
    throw new Error('L’inequació ha d’ésser una cadena de text.');
  }

  const original = rawInput.trim();
  if (original.length === 0) {
    throw new Error('Cal introduir una inequació.');
  }

  const normalized = collapseWhitespace(normalizeMathInput(original));
  const comparatorMatches = normalized.match(/(<=|>=|<|>)/g);

  if (!comparatorMatches || comparatorMatches.length === 0) {
    throw new Error('No s’ha trobat cap operador de desigualtat.');
  }

  if (comparatorMatches.length === 2) {
    const doubleMatch = normalized.match(DOUBLE_PATTERN);
    if (!doubleMatch) {
      throw new Error('Format no suportat per a desigualtats compostes.');
    }

    const [, leftRaw, operatorLeft, middleRaw, operatorRight, rightRaw] =
      doubleMatch;

    const first = parseSingleInequality(
      leftRaw,
      operatorLeft,
      middleRaw,
      original,
    );
    const second = parseSingleInequality(
      middleRaw,
      operatorRight,
      rightRaw,
      original,
    );

    const combined = buildRangeFromComparisons(first, second, original);

    if (combined.variable === 'y') {
      return combined;
    }

    if (combined.variable === 'x') {
      return combined;
    }

    throw new Error('Només s’admeten desigualtats en x o y.');
  }

  if (comparatorMatches.length > 2) {
    throw new Error(
      'De moment només es permeten una o dues desigualtats en la mateixa expressió.',
    );
  }

  const operatorRaw = comparatorMatches[0];
  const [leftRaw, rightRaw] = normalized.split(operatorRaw);

  const single = parseSingleInequality(leftRaw, operatorRaw, rightRaw, original);
  if (!single) {
    throw new Error('Format no suportat. Escriu-la com ara “y ≥ x^2”.');
  }

  if (single.variable === 'x') {
    single.value = evaluateNumericExpression(single.expression);
  }

  return single;
};
