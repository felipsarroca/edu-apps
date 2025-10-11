import React, { useEffect, useRef } from 'react';

interface MathExpressionProps {
  expression: string;
}

/**
 * A recursive descent parser to convert a mathematical expression string
 * into a LaTeX string, correctly handling operator precedence for fractions.
 */
const formatSubExpression = (subExpr: string): string => {
    const expr = subExpr.trim();

    // Base case: if the expression is empty, return empty string.
    if (!expr) return '';

    // Handle parentheses: if the whole expression is wrapped in parentheses,
    // parse the inner content and wrap it back.
    if (expr.startsWith('(') && expr.endsWith(')')) {
        let depth = 0;
        let isWrapped = true;
        // Check if the parentheses actually wrap the entire expression
        for (let i = 0; i < expr.length - 1; i++) {
            if (expr[i] === '(') depth++;
            else if (expr[i] === ')') depth--;
            if (depth === 0) {
                isWrapped = false;
                break;
            }
        }
        if (isWrapped) {
            return `(${formatSubExpression(expr.slice(1, -1))})`;
        }
    }

    // Lowest precedence: Addition and Subtraction.
    // We parse from right to left to respect left-associativity.
    let depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if ((char === '+' || char === '-') && depth === 0) {
            // Check if it's a binary operator, not a unary minus/plus at the start or after another operator.
            if (i > 0 && !['+', '-', '*', '/'].includes(expr[i - 1].trim())) {
                const left = formatSubExpression(expr.slice(0, i));
                const right = formatSubExpression(expr.slice(i + 1));
                return `${left} ${char} ${right}`;
            }
        }
    }

    // Medium precedence: Multiplication and Division.
    depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if (char === '/' && depth === 0) {
            const numerator = formatSubExpression(expr.slice(0, i));
            const denominator = formatSubExpression(expr.slice(i + 1));
            return `\\frac{${numerator}}{${denominator}}`;
        }
    }
    
    depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];
        if (char === ')') depth++;
        else if (char === '(') depth--;
        else if (char === '*' && depth === 0) {
            const left = formatSubExpression(expr.slice(0, i));
            const right = formatSubExpression(expr.slice(i + 1));
            return `${left} \\cdot ${right}`;
        }
    }

    // High precedence: Functions like sqrt.
    if (expr.startsWith('sqrt(') && expr.endsWith(')')) {
      const content = expr.slice(5, -1);
      return `\\sqrt{${formatSubExpression(content)}}`;
    }
    
    // If no operators found, it's a literal (number or variable).
    return expr;
};


const formatExpressionForMathJax = (expr: string): string => {
  let expressionToFormat = expr;
  if (!expressionToFormat || expressionToFormat.trim() === '') return '';

  // Helper to convert operators to TeX
  const texifyOperator = (op: string) => op
    .replace(/<=/g, ' \\le ')
    .replace(/≤/g, ' \\le ')
    .replace(/>=/g, ' \\ge ')
    .replace(/≥/g, ' \\ge ')
    .replace(/</g, ' \\lt ')
    .replace(/>/g, ' \\gt ')
    .replace(/=/g, ' = ');

  // Find the first main relational operator to correctly split LHS and RHS.
  // The regex needs to match multi-character operators first to avoid splitting them.
  const operatorMatch = expressionToFormat.match(/(<=|>=|≤|≥|<|>|=)/);

  let formatted;
  if (operatorMatch && operatorMatch.index !== undefined && operatorMatch.index > 0) {
    const op = operatorMatch[0];
    const opIndex = operatorMatch.index;

    let lhs = expressionToFormat.substring(0, opIndex).trim();
    let rhs = expressionToFormat.substring(opIndex + op.length).trim();
    
    const formattedRhs = formatSubExpression(rhs);
    formatted = `${lhs} ${texifyOperator(op)} ${formattedRhs}`;
  } else {
    // No central operator found (e.g., an interval part like "x < 4").
    // Split by operators to format all parts of the expression.
    // The regex here also needs to be fixed to handle multi-character operators.
    const parts = expressionToFormat.split(/(<=|>=|≤|≥|<|>|=)/).filter(p => p);
    if (parts.length > 1) {
        formatted = parts.map((part, index) => 
            // Odd indices are operators, even are expressions
            index % 2 === 1 ? texifyOperator(part) : formatSubExpression(part)
        ).join('');
    } else {
       // Only one part, format it directly
       formatted = formatSubExpression(expressionToFormat);
    }
  }

  return `\\(${formatted}\\)`;
};


export const MathExpression: React.FC<MathExpressionProps> = ({ expression }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const formatted = formatExpressionForMathJax(expression);
      ref.current.innerHTML = formatted;
      if (window.MathJax && formatted) {
        window.MathJax.typesetPromise();
      }
    }
  }, [expression]);

  return <div ref={ref} />;
};
