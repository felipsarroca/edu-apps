import { MathFunction, AnalysisResult } from "../types";

// services/mathService.ts

export interface ParsedFunction {
  func: (val: number) => number;
  variable: 'x' | 'y';
  isEquation: boolean;
  inequalityType?: '<' | '>' | '<=' | '>=';
}

export interface ParsedInterval {
  variable: 'x' | 'y';
  lowerBound: number;
  upperBound: number;
  lowerInclusive: boolean;
  upperInclusive: boolean;
}


export function analyzeSystem(expressions: string[]): AnalysisResult {
    const parsedExpressions = expressions.map(parseExpression).filter(p => p !== null && p.isEquation && p.variable === 'y') as ParsedFunction[];
    
    if (parsedExpressions.length < 2) {
        return { 
            domainNotes: ["Un sistema necessita almenys dues equacions (y = ...)."],
        };
    }
    
    // Perform special analysis ONLY for 2-equation systems
    if (parsedExpressions.length === 2) {
        const f1 = parsedExpressions[0].func;
        const f2 = parsedExpressions[1].func;
        const verySmallTolerance = 1e-9;

        // Check for infinite solutions (equivalent functions)
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
            return { domainNotes: [], systemSolutionStatus: 'INFINITE_SOLUTIONS' };
        }
    }

    // Find intersection points for all functions in the system
    const intersections: {x: number, y: number}[] = [];
    const range = 100;
    const step = 0.01;
    const yTolerance = 0.02;

    for (let x = -range; x < range; x += step) {
        try {
            const yValues = parsedExpressions.map(p => p.func(x));
            if (yValues.some(y => !isFinite(y))) continue;

            const maxDiff = Math.max(...yValues) - Math.min(...yValues);
            
            if (maxDiff < yTolerance) {
                const avgY = yValues.reduce((a, b) => a + b, 0) / yValues.length;
                if (intersections.every(p => Math.abs(p.x - x) > step * 10)) {
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
            systemSolutionStatus: 'LIMITED_SOLUTIONS',
            intersectionPoints: intersections,
        };
    }

    // No intersections found. If it's a 2-equation system, check for parallel lines.
    if (parsedExpressions.length === 2) {
        const f1 = parsedExpressions[0].func;
        const f2 = parsedExpressions[1].func;
        const diffPoints = [-50, 0, 50];
        const diffs: number[] = [];
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
            const areParallel = avgDiff > yTolerance && diffs.every(d => Math.abs(d - avgDiff) / avgDiff < 0.1);
            if (areParallel) {
                return { domainNotes: [], systemSolutionStatus: 'NO_SOLUTION' };
            }
        }
    }
    
    // Default case: No intersections found, but not determined to be parallel/equivalent
    return {
        domainNotes: [],
        systemSolutionStatus: 'LIMITED_SOLUTIONS',
        intersectionPoints: [],
    };
}


export function analyzeExpression(expression: string): AnalysisResult {
  const notes: Set<string> = new Set();
  
  if (expression.includes('/')) {
    notes.add("El denominador no pot ser 0.");
  }
  
  if (/\bsqrt\s*\(/.test(expression)) {
    notes.add("L'expressio dins de l'arrel quadrada (`sqrt`) ha de ser >= 0.");
  }
  
  if (/\blog\s*\(/.test(expression)) {
    notes.add("L'argument del logaritme (`log`) ha de ser > 0.");
  }
  
  if (/\btan\s*\(/.test(expression)) {
    notes.add("L'argument de la tangent (`tan`) no pot ser pi/2 + n*pi.");
  }

  const result: AnalysisResult = {
    domainNotes: Array.from(notes),
  };
  
  const parsed = parseExpression(expression);

  if (parsed && parsed.variable === 'y') {
    // Y-Intercept (f(0))
    const yAtZero = parsed.func(0);
    if (isFinite(yAtZero)) {
      result.yIntercept = yAtZero;
    } else {
      result.yIntercept = "No definit en x=0";
    }

    // X-Intercepts (Roots) - Numerical search
    const roots: number[] = [];
    const step = 0.01;
    const range = 100; // Search from -100 to 100
    let lastY = parsed.func(-range);

    for (let x = -range + step; x <= range; x += step) {
      const currentY = parsed.func(x);
      if (isFinite(lastY) && isFinite(currentY)) {
        // Check for sign change, indicating a root
        if (lastY * currentY < 0) {
           // Simple approximation
           const root = x - step / 2;
           // Avoid adding duplicates if very close
           if (roots.every(r => Math.abs(r - root) > step * 2)) {
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


function prepareForFunction(expr: string): string {
    // Convert common LaTeX commands to a format the JS engine can understand.
    // Note: This is a simple replacement and doesn't support complex nested structures.
    // Users can use parentheses for clarity in complex cases, e.g., \frac{1}{(x+1)}.
    let prepared = expr
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '(($1)/($2))') // \frac{a}{b} -> ((a)/(b))
      .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')              // \sqrt{a} -> sqrt(a)
      .replace(/\\cdot/g, '*')                                 // \cdot -> *
      .replace(/\\pi/g, 'PI');                                  // \pi -> PI (which is later converted to Math.PI)

    // Handle powers
    prepared = prepared.replace(/\^/g, '**');

    // Handle implicit multiplication
    // e.g., 2x -> 2*x, (x+1)(x+1) -> (x+1)*(x+1), 3( -> 3*(, x( -> x*(
    prepared = prepared.replace(/(\d)([a-zA-Z(])/g, '$1*$2'); 
    prepared = prepared.replace(/\)([a-zA-Z(])/g, ')*$1'); 
    // FIX: Correctly handle implicit multiplication for function calls.
    // The previous regex /([a-zA-Z])\(/ was faulty, as it would match the 't' in 'sqrt('
    // and incorrectly convert it to 'sqrt*(', causing a syntax error.
    // This new regex matches a full word boundary, ensuring that known function names
    // are not treated as implicit multiplication.
    prepared = prepared.replace(/\b([a-zA-Z_]+)\(/g, (match, p1) => {
        const mathFuncs = ['sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'pow', 'exp', 'ceil', 'floor', 'round'];
        if (mathFuncs.includes(p1.toLowerCase())) {
            return match; // It's a known function, return as is (e.g., "sqrt(")
        }
        return `${p1}*(`; // It's a variable or custom function, assume implicit multiplication (e.g., "x(")
    });

    // Add Math. for functions and PI/E constants
    const mathFuncs = ['sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'pow', 'exp', 'ceil', 'floor', 'round'];
    mathFuncs.forEach(func => {
        // Use negative lookbehind `(?<!Math\.)` to avoid replacing `sqrt` in `Math.sqrt`
        const regex = new RegExp(`(?<!Math\\.)${`\\b${func}\\b`}`, 'gi');
        prepared = prepared.replace(regex, `Math.${func}`);
    });
    prepared = prepared.replace(/\bPI\b/gi, 'Math.PI');
    prepared = prepared.replace(/\be\b/g, 'Math.E');
    return prepared;
}

export function parseIntervalExpression(expression: string): ParsedInterval | null {
    const trimmed = expression
        .trim()
        .replace(/\u2264|\u2A7D/g, '<=')
        .replace(/\u2265|\u2A7E/g, '>=');
    
    // Case 1: 2 < x < 4
    let match = trimmed.match(/^(.*?)\s*(<=|<)\s*([xy])\s*(<=|<)\s*(.*?)$/i);
    if (match) {
        const [, lowerStr, lowerOp, variable, upperOp, upperStr] = match;
        try {
            const lowerBound = new Function(`with(Math){return ${prepareForFunction(lowerStr)}}`)();
            const upperBound = new Function(`with(Math){return ${prepareForFunction(upperStr)}}`)();

            if (typeof lowerBound !== 'number' || typeof upperBound !== 'number' || !isFinite(lowerBound) || !isFinite(upperBound)) return null;

            return {
                variable: variable.toLowerCase() as 'x' | 'y',
                lowerBound,
                upperBound,
                lowerInclusive: lowerOp === '<=',
                upperInclusive: upperOp === '<=',
            };
        } catch (e) { return null; }
    }

    // Case 2: 4 > x > 2
    match = trimmed.match(/^(.*?)\s*(>=|>)\s*([xy])\s*(>=|>)\s*(.*?)$/i);
    if (match) {
        const [, upperStr, upperOp, variable, lowerOp, lowerStr] = match; // Swapped
         try {
            const lowerBound = new Function(`with(Math){return ${prepareForFunction(lowerStr)}}`)();
            const upperBound = new Function(`with(Math){return ${prepareForFunction(upperStr)}}`)();

            if (typeof lowerBound !== 'number' || typeof upperBound !== 'number' || !isFinite(lowerBound) || !isFinite(upperBound)) return null;
            
            return {
                variable: variable.toLowerCase() as 'x' | 'y',
                lowerBound,
                upperBound,
                lowerInclusive: lowerOp === '>=',
                upperInclusive: upperOp === '>=',
            };
        } catch (e) { return null; }
    }
    
    // Case 3: Single inequality like x > 4
    match = trimmed.match(/^([xy])\s*(>=|>|<=|<)\s*(.*)$/i);
    if (match) {
        const [, variable, op, valueStr] = match;
        try {
            const value = new Function(`with(Math){return ${prepareForFunction(valueStr)}}`)();
            if (typeof value !== 'number' || !isFinite(value)) return null;

            const result: ParsedInterval = {
                variable: variable.toLowerCase() as 'x' | 'y',
                lowerBound: -Infinity,
                upperBound: Infinity,
                lowerInclusive: false,
                upperInclusive: false,
            };

            if (op === '>' || op === '>=') {
                result.lowerBound = value;
                result.lowerInclusive = (op === '>=');
            } else { // '<' or '<='
                result.upperBound = value;
                result.upperInclusive = (op === '<=');
            }
            return result;
        } catch (e) { return null; }
    }

    // Case 4: Single inequality like 4 < x
    match = trimmed.match(/^(.*?)\s*(>=|>|<=|<)\s*([xy])$/i);
    if (match) {
        const [, valueStr, op, variable] = match;
        try {
            const value = new Function(`with(Math){return ${prepareForFunction(valueStr)}}`)();
            if (typeof value !== 'number' || !isFinite(value)) return null;

            const result: ParsedInterval = {
                variable: variable.toLowerCase() as 'x' | 'y',
                lowerBound: -Infinity,
                upperBound: Infinity,
                lowerInclusive: false,
                upperInclusive: false,
            };
            
            if (op === '<' || op === '<=') {
                result.lowerBound = value;
                result.lowerInclusive = (op === '<=');
            } else { // '>' or '>='
                result.upperBound = value;
                result.upperInclusive = (op === '>=');
            }
            return result;
        } catch (e) { return null; }
    }


    return null;
}

export function parseExpression(expression: string): ParsedFunction | null {
  try {
    const trimmedExpression = expression.trim();
    if (!trimmedExpression) return null;

    const operatorMatch = trimmedExpression.match(/<=|>=|==|=|<|>/);
    if (!operatorMatch || operatorMatch.index === 0) return null;
    
    const operator = operatorMatch[0];
    const operatorIndex = operatorMatch.index!;
    
    let variableStr = trimmedExpression.substring(0, operatorIndex).trim();
    let exprStr = trimmedExpression.substring(operatorIndex + operator.length).trim();

    if (['x', 'y'].indexOf(variableStr) === -1 && ['x', 'y'].indexOf(exprStr) !== -1) {
        [variableStr, exprStr] = [exprStr, variableStr];
    }

    if (variableStr !== 'x' && variableStr !== 'y') {
      return null;
    }
    const variable: 'x' | 'y' = variableStr;
    const otherVar = variable === 'x' ? 'y' : 'x';
    
    let isEquation = false;
    let inequalityType: ParsedFunction['inequalityType'] | undefined = undefined;

    switch (operator) {
        case '=':
        case '==':
            isEquation = true;
            break;
        case '<':
            inequalityType = '<';
            break;
        case '>':
            inequalityType = '>';
            break;
        case '<=':
            inequalityType = '<=';
            break;
        case '>=':
            inequalityType = '>=';
            break;
        default:
            return null;
    }

    const preparedExpr = prepareForFunction(exprStr);
    
    // Don't try to parse if expression is empty or ends with an operator (e.g., user is typing "x^")
    if (preparedExpr.trim() === '' || /[*/+-]$/.test(preparedExpr.trim()) || preparedExpr.trim().endsWith('**')) {
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

    const func = new Function(otherVar, funcBody) as (val: number) => number;
    
    const testResult = func(1);
    if (typeof testResult !== 'number') {
        return null;
    }

    return {
        func,
        variable,
        isEquation,
        inequalityType,
    };

  } catch (e) {
    // Silent fail, as this can happen frequently while user is typing.
    return null;
  }
}
