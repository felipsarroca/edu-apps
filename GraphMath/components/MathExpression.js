import { jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
const formatSubExpression = (subExpr) => {
  const expr = subExpr.trim();
  if (!expr) return "";
  if (expr.startsWith("(") && expr.endsWith(")")) {
    let depth2 = 0;
    let isWrapped = true;
    for (let i = 0; i < expr.length - 1; i++) {
      if (expr[i] === "(") depth2++;
      else if (expr[i] === ")") depth2--;
      if (depth2 === 0) {
        isWrapped = false;
        break;
      }
    }
    if (isWrapped) {
      return `(${formatSubExpression(expr.slice(1, -1))})`;
    }
  }
  let depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    const char = expr[i];
    if (char === ")") depth++;
    else if (char === "(") depth--;
    else if ((char === "+" || char === "-") && depth === 0) {
      if (i > 0 && !["+", "-", "*", "/"].includes(expr[i - 1].trim())) {
        const left = formatSubExpression(expr.slice(0, i));
        const right = formatSubExpression(expr.slice(i + 1));
        return `${left} ${char} ${right}`;
      }
    }
  }
  depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    const char = expr[i];
    if (char === ")") depth++;
    else if (char === "(") depth--;
    else if (char === "/" && depth === 0) {
      const numerator = formatSubExpression(expr.slice(0, i));
      const denominator = formatSubExpression(expr.slice(i + 1));
      return `\\frac{${numerator}}{${denominator}}`;
    }
  }
  depth = 0;
  for (let i = expr.length - 1; i >= 0; i--) {
    const char = expr[i];
    if (char === ")") depth++;
    else if (char === "(") depth--;
    else if (char === "*" && depth === 0) {
      const left = formatSubExpression(expr.slice(0, i));
      const right = formatSubExpression(expr.slice(i + 1));
      return `${left} \\cdot ${right}`;
    }
  }
  if (expr.startsWith("sqrt(") && expr.endsWith(")")) {
    const content = expr.slice(5, -1);
    return `\\sqrt{${formatSubExpression(content)}}`;
  }
  return expr;
};
const formatExpressionForMathJax = (expr) => {
  let expressionToFormat = expr;
  if (!expressionToFormat || expressionToFormat.trim() === "") return "";
  const texifyOperator = (op) => op.replace(/<=/g, " \\le ").replace(/≤/g, " \\le ").replace(/>=/g, " \\ge ").replace(/≥/g, " \\ge ").replace(/</g, " \\lt ").replace(/>/g, " \\gt ").replace(/=/g, " = ");
  const operatorMatch = expressionToFormat.match(/(<=|>=|≤|≥|<|>|=)/);
  let formatted;
  if (operatorMatch && operatorMatch.index !== void 0 && operatorMatch.index > 0) {
    const op = operatorMatch[0];
    const opIndex = operatorMatch.index;
    let lhs = expressionToFormat.substring(0, opIndex).trim();
    let rhs = expressionToFormat.substring(opIndex + op.length).trim();
    const formattedRhs = formatSubExpression(rhs);
    formatted = `${lhs} ${texifyOperator(op)} ${formattedRhs}`;
  } else {
    const parts = expressionToFormat.split(/(<=|>=|≤|≥|<|>|=)/).filter((p) => p);
    if (parts.length > 1) {
      formatted = parts.map(
        (part, index) => (
          // Odd indices are operators, even are expressions
          index % 2 === 1 ? texifyOperator(part) : formatSubExpression(part)
        )
      ).join("");
    } else {
      formatted = formatSubExpression(expressionToFormat);
    }
  }
  return `\\(${formatted}\\)`;
};
const MathExpression = ({ expression }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      const formatted = formatExpressionForMathJax(expression);
      ref.current.innerHTML = formatted;
      if (window.MathJax && formatted) {
        window.MathJax.typesetPromise();
      }
    }
  }, [expression]);
  return /* @__PURE__ */ jsx("div", { ref });
};
export {
  MathExpression
};
