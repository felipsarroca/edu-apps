const SYMBOL_REPLACEMENTS = {
  '≥': '>=',
  '≤': '<=',
  '≠': '!=',
};

const normalizeSymbols = (value) =>
  value.replace(/[≥≤≠]/g, (symbol) => SYMBOL_REPLACEMENTS[symbol] ?? symbol);

const normalizeAbsolute = (value) => value.replace(/\|([^|]+)\|/g, 'abs($1)');

const collapseWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const hasVariable = (segment, variable) =>
  new RegExp(`^${variable}$`, 'i').test(segment.trim());

const createResult = ({
  variable,
  operator,
  orientation,
  inclusive,
  expression,
  display,
}) => ({
  variable,
  operator,
  orientation,
  inclusive,
  expression,
  display,
});

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

  if (comparatorMatches.length > 1) {
    throw new Error(
      'De moment només es permet una desigualtat simple (ex: y ≥ x^2).',
    );
  }

  const operatorRaw = comparatorMatches[0];
  const [leftRaw, rightRaw] = normalized.split(operatorRaw);
  const left = leftRaw.trim();
  const right = rightRaw?.trim() ?? '';

  if (!left || !right) {
    throw new Error('Falten termes a la desigualtat.');
  }

  const operator = operatorRaw;
  const inclusive = operator.includes('=');

  // Casos amb y
  if (hasVariable(left, 'y') && !/y/i.test(right)) {
    const orientation = operator === '>=' || operator === '>' ? 'above' : 'below';
    return createResult({
      variable: 'y',
      operator,
      orientation,
      inclusive,
      expression: right,
      display: original,
    });
  }

  if (hasVariable(right, 'y') && !/y/i.test(left)) {
    const orientation =
      operator === '<=' || operator === '<' ? 'above' : 'below';
    const normalizedOperator =
      operator === '<='
        ? '>='
        : operator === '<'
        ? '>'
        : operator === '>='
        ? '<='
        : '<';
    return createResult({
      variable: 'y',
      operator: normalizedOperator,
      orientation,
      inclusive,
      expression: left,
      display: original,
    });
  }

  throw new Error('Format no suportat. Escriu-la com ara “y ≥ x^2”.');
};
