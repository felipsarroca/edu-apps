import { jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import { relationToTex } from "../services/parser.js";
const escapeHtml = (text) => text.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// Mostra una expressió amb MathJax. Si no es pot interpretar, mostra el text tal com s'ha escrit.
const MathExpression = ({ expression, color, className = "" }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let tex = null;
    try {
      tex = expression && expression.trim() ? relationToTex(expression) : null;
    } catch (e) {
      tex = null;
    }
    if (!tex) {
      el.innerHTML = `<span class="font-mono">${escapeHtml(expression || "")}</span>`;
      return;
    }
    el.innerHTML = `\\(${tex}\\)`;
    let cancelled = false;
    const typeset = () => {
      if (cancelled || !window.MathJax?.typesetPromise) return;
      window.MathJax.typesetClear?.([el]);
      window.MathJax.typesetPromise([el]).catch(() => {
      });
    };
    if (window.MathJax?.startup?.promise) window.MathJax.startup.promise.then(typeset);
    else setTimeout(typeset, 300);
    return () => {
      cancelled = true;
    };
  }, [expression]);
  return /* @__PURE__ */ jsx("div", { ref, className, style: color ? { color } : void 0 });
};
export {
  MathExpression
};
