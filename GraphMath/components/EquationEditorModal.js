import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { MathKeyboard } from "./MathKeyboard.js";
import { MathExpression } from "./MathExpression.js";
import { THEMES, getExpressionColor } from "../constants.js";
import { prepareExpression, parseIntervalExpression, splitInlineDomain } from "../services/mathService.js";
import { getParameters } from "../services/parser.js";
const FUNCTION_EXAMPLES = ["y = 2x + 1", "y = x² − 4", "x² − 5x + 6 = 0", "2x − 4 > 0", "x² + y² = 9", "y > x − 2"];
const SYSTEM_EXAMPLES = [["2x + 3y = 7", "x − y = 1"], ["y = x²", "y = x + 2"], ["x² + y² = 25", "y = x + 1"]];
const describeKind = (prep, text) => {
  if (!prep.ok) return null;
  const names = getParameters(text);
  const base = describeBaseKind(prep);
  return names.length ? `${base} Paràmetres: ${names.join(", ")} (apareixeran lliscadors al panell).` : base;
};
const describeBaseKind = (prep) => {
  const strict = prep.relation !== "=";
  switch (prep.kind) {
    case "explicitY":
      return strict ? "Inequació amb dues incògnites: es pintarà la regió solució." : "Funció: es dibuixarà la seva gràfica.";
    case "explicitX":
      return strict ? "Inequació: es pintarà la regió solució." : "Corba de la forma x = g(y).";
    case "equationX":
      return "Equació amb una incògnita: es marcaran les solucions sobre l'eix X.";
    case "inequalityX":
      return "Inequació amb una incògnita: es marcarà l'interval solució sobre l'eix X.";
    case "implicit":
      return strict ? "Inequació: es pintarà la regió solució." : "Corba (per exemple, una circumferència).";
    case "interval":
      return "Interval: es pintarà la franja corresponent.";
    default:
      return null;
  }
};
const EquationEditorModal = ({ isOpen, onClose, onSave, existingFunction, nextColor, theme }) => {
  const [expressions, setExpressions] = useState([""]);
  const [domainRestriction, setDomainRestriction] = useState("");
  const [mode, setMode] = useState("single");
  const [focusedInput, setFocusedInput] = useState(0);
  const [activeField, setActiveField] = useState("expression");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const inputRefs = useRef([]);
  const domainInputRef = useRef(null);
  const themeClasses = THEMES[theme];
  const colorSource = existingFunction || { color: nextColor };
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      if (existingFunction) {
        setExpressions(existingFunction.expressions);
        setDomainRestriction(existingFunction.domainRestriction || "");
        setMode(existingFunction.expressions.length > 1 || existingFunction.type === "system" ? "system" : "single");
      } else {
        setExpressions([""]);
        setDomainRestriction("");
        setMode("single");
      }
      setFocusedInput(0);
      setActiveField("expression");
      setShowErrors(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } else {
      setIsAnimating(false);
    }
  }, [existingFunction, isOpen]);
  // Domini escrit a la mateixa línia: "y = x², −2 < x < 2"
  const inline = mode === "single" ? splitInlineDomain(expressions[0] ?? "") : { expr: "", domain: "" };
  const visibleExpressions = mode === "single" ? [inline.domain ? inline.expr : expressions[0] ?? ""] : expressions;
  const preps = visibleExpressions.map((e) => e.trim() ? prepareExpression(e, { inSystem: mode === "system" }) : null);
  const showDomain = mode === "single" && !!preps[0] && preps[0].ok && preps[0].kind === "explicitY" && preps[0].relation === "=";
  const effectiveDomain = inline.domain || domainRestriction;
  const domainValid = !showDomain || !effectiveDomain.trim() || !!parseIntervalExpression(effectiveDomain);
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };
  const handleSave = () => {
    const validExpressions = visibleExpressions.map((e) => e.trim()).filter((e) => e);
    const hasErrors = preps.some((p) => p && !p.ok) || !domainValid;
    if (validExpressions.length === 0 || hasErrors || mode === "system" && validExpressions.length < 2) {
      setShowErrors(true);
      return;
    }
    const finalType = mode === "system" ? "system" : (() => {
      const prep = prepareExpression(validExpressions[0]);
      if (prep.kind === "interval") return "interval";
      if (prep.relation !== "=") return "inequality";
      return "equation";
    })();
    onSave({
      expressions: validExpressions,
      type: finalType,
      domainRestriction: showDomain ? effectiveDomain.trim() : void 0
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    } else if (event.key === "Escape") {
      handleClose();
    }
  };
  const handleExpressionChange = (index, value) => {
    setExpressions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };
  const focusExpression = (index) => {
    setTimeout(() => {
      inputRefs.current[index]?.focus();
      setFocusedInput(index);
      setActiveField("expression");
    }, 0);
  };
  const addExpression = () => {
    const newIndex = expressions.length;
    setExpressions([...expressions, ""]);
    focusExpression(newIndex);
  };
  const removeExpression = (index) => {
    if (expressions.length > 1) {
      setExpressions(expressions.filter((_, i) => i !== index));
      focusExpression(Math.max(0, index - 1));
    }
  };
  const changeMode = (newMode) => {
    setMode(newMode);
    if (newMode === "system" && expressions.length < 2) setExpressions([expressions[0] ?? "", ""]);
    focusExpression(0);
  };
  const loadExample = (example) => {
    if (Array.isArray(example)) {
      setMode("system");
      setExpressions(example);
    } else {
      setMode("single");
      setExpressions([example]);
    }
    setShowErrors(false);
    focusExpression(0);
  };
  const handleKeyPress = (action) => {
    let input;
    let currentText;
    let textUpdater;
    if (activeField === "domain") {
      input = domainInputRef.current;
      currentText = domainRestriction;
      textUpdater = setDomainRestriction;
    } else {
      input = inputRefs.current[focusedInput];
      currentText = expressions[focusedInput] ?? "";
      textUpdater = (newValue) => handleExpressionChange(focusedInput, newValue);
    }
    if (!input) return;
    const start = input.selectionStart ?? currentText.length;
    const end = input.selectionEnd ?? currentText.length;
    const selected = currentText.substring(start, end);
    const before = currentText.substring(0, start);
    const after = currentText.substring(end);
    let newText = currentText;
    let newCursorPos = start;
    switch (action.type) {
      case "left":
        newCursorPos = Math.max(0, start === end ? start - 1 : start);
        break;
      case "right":
        newCursorPos = Math.min(currentText.length, start === end ? end + 1 : end);
        break;
      case "clear":
        newText = "";
        newCursorPos = 0;
        break;
      case "backspace": {
        if (start !== end) {
          newText = before + after;
          newCursorPos = start;
          break;
        }
        if (start === 0) break;
        // Esborra d'un cop el nom d'una funció ("sin(", "√(") i el parèntesi buit que la tanca
        const fnMatch = before.match(/(sin|cos|tan|ln|log|sqrt|cbrt|abs|exp|√|∛|e\^)\($/);
        let cut = fnMatch ? fnMatch[0].length : 1;
        let extra = 0;
        if (before.endsWith("(") && after.startsWith(")")) extra = 1;
        if (!fnMatch && before.endsWith(" ") && start > 1) cut = 2;
        newText = before.slice(0, before.length - cut) + after.slice(extra);
        newCursorPos = start - cut;
        break;
      }
      case "wrap":
        newText = before + action.before + selected + action.after + after;
        newCursorPos = selected ? start + action.before.length + selected.length + action.after.length : start + action.before.length;
        break;
      case "fraction":
        if (selected) {
          newText = `${before}(${selected})/()${after}`;
          newCursorPos = start + selected.length + 4;
        } else {
          newText = `${before}()/()${after}`;
          newCursorPos = start + 1;
        }
        break;
      case "insert":
      default:
        newText = before + action.text + after;
        newCursorPos = start + action.text.length;
        break;
    }
    if (newText !== currentText) textUpdater(newText);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  if (!isOpen) return null;
  const inputBg = theme === "light" ? "#fffaf0" : theme === "dark" ? "#111827" : theme === "chalkboard" ? "#314033" : "#000000";
  const statusLine = (prep, text, index) => {
    if (!text.trim()) {
      if (showErrors && (mode === "single" || index < 2)) return /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500 mt-1", children: "Aquest camp és buit." });
      return null;
    }
    if (!prep) return null;
    if (!prep.ok) {
      return /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-500 mt-1 flex items-start gap-1.5", children: [
        /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-exclamation mt-0.5" }),
        prep.error
      ] });
    }
    return /* @__PURE__ */ jsxs("p", { className: `text-sm mt-1 flex items-start gap-1.5 ${themeClasses.secondaryText}`, children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-check text-green-500 mt-0.5" }),
      describeKind(prep, visibleExpressions[index] || "")
    ] });
  };
  return /* @__PURE__ */ jsx("div", { className: `fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"}`, onKeyDown: (e) => e.key === "Escape" && handleClose(), children: /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-2xl w-full max-w-2xl max-h-[96vh] flex flex-col ${themeClasses.panelBg} border ${themeClasses.border} transition-all duration-200 ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between px-4 py-3 border-b ${themeClasses.border}`, children: [
      /* @__PURE__ */ jsx("div", { className: `inline-flex rounded-full p-1 border ${themeClasses.border} ${themeClasses.buttonBg}`, role: "tablist", children: [["single", "fa-chart-line", "Funció o equació"], ["system", "fa-layer-group", "Sistema"]].map(([value, icon, label]) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": mode === value,
          onClick: () => changeMode(value),
          className: `px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors ${mode === value ? themeClasses.accentButtonClasses : themeClasses.buttonHover}`,
          children: [
            /* @__PURE__ */ jsx("i", { className: `fa-solid ${icon}` }),
            label
          ]
        },
        value
      )) }),
      /* @__PURE__ */ jsx("button", { onClick: handleClose, className: `w-9 h-9 rounded-full border ${themeClasses.border} ${themeClasses.buttonBg} ${themeClasses.buttonHover} shadow-sm`, style: { color: themeClasses.accent }, "aria-label": "Tanca", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-times" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3 overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        visibleExpressions.map((expr, index) => {
          const color = getExpressionColor(colorSource, index);
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              mode === "system" && /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-7 h-7 rounded-full text-white text-sm font-bold flex items-center justify-center shadow", style: { backgroundColor: color }, children: index + 1 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: (el) => {
                    inputRefs.current[index] = el;
                  },
                  type: "text",
                  value: mode === "single" ? expressions[0] ?? "" : expr,
                  autoComplete: "off",
                  autoCapitalize: "off",
                  spellCheck: false,
                  onChange: (e) => handleExpressionChange(index, e.target.value),
                  onFocus: () => {
                    setFocusedInput(index);
                    setActiveField("expression");
                  },
                  onKeyDown: handleKeyDown,
                  placeholder: mode === "system" ? `Equació ${index + 1}` : "Ex.: y = x^2 − 4   o   x^2 − 5x + 6 = 0",
                  className: `w-full p-2.5 text-lg font-mono rounded-lg border-2 focus:outline-none focus:ring-2`,
                  style: { "--tw-ring-color": mode === "system" ? color : themeClasses.accent, backgroundColor: inputBg, borderColor: mode === "system" ? color : focusedInput === index && activeField === "expression" ? themeClasses.accent : "transparent" }
                }
              ),
              mode === "system" && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removeExpression(index),
                  className: "p-2 rounded text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-red-500",
                  disabled: expressions.length <= 2,
                  "aria-label": `Elimina l'equació ${index + 1}`,
                  children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: mode === "system" ? "ml-9" : "", children: statusLine(preps[index], expr, index) })
          ] }, mode === "single" ? "single" : index);
        }),
        mode === "system" && /* @__PURE__ */ jsxs("button", { type: "button", onClick: addExpression, className: `w-full p-1.5 rounded-lg border-dashed border-2 text-sm ${themeClasses.border} ${themeClasses.buttonHover}`, children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
          "Afegeix una equació"
        ] }),
        showDomain && !inline.domain && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "domain-restriction", className: `text-sm whitespace-nowrap ${themeClasses.secondaryText}`, children: "Domini (opcional):" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "domain-restriction",
              ref: domainInputRef,
              type: "text",
              value: domainRestriction,
              autoComplete: "off",
              onChange: (e) => setDomainRestriction(e.target.value),
              onFocus: () => setActiveField("domain"),
              onKeyDown: handleKeyDown,
              placeholder: "ex.: -2 < x ≤ 5   o   x ≥ 0",
              className: `w-full p-2 text-sm font-mono rounded-md border ${domainValid ? themeClasses.border : "border-red-500"} ${themeClasses.buttonBg} focus:outline-none focus:ring-2`,
              style: { "--tw-ring-color": themeClasses.accent }
            }
          )
        ] }),
        !domainValid && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: "Escriu el domini com un interval: -2 < x < 5, x ≥ 0..." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `w-full p-3 text-xl rounded-lg border ${themeClasses.border} min-h-[64px] flex items-center justify-center`, style: { backgroundColor: theme === "light" ? "#eff6ff" : theme === "dark" ? "#1e293b" : theme === "chalkboard" ? "#435446" : "#111111" }, children: visibleExpressions.some((expr) => expr.trim()) ? /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap justify-center gap-2", children: [
        mode === "system" && /* @__PURE__ */ jsx("span", { className: "text-5xl font-thin mr-1 leading-none", children: "{" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: visibleExpressions.map((expr, index) => expr.trim() ? /* @__PURE__ */ jsx(MathExpression, { expression: expr, color: mode === "system" ? getExpressionColor(colorSource, index) : void 0 }, index) : null) }),
        effectiveDomain.trim() && showDomain && /* @__PURE__ */ jsxs("div", { className: `text-xs px-2.5 py-1 rounded-full border ${domainValid ? themeClasses.border : "border-red-500 text-red-500"} ${domainValid ? themeClasses.secondaryText : ""}`, children: ["Domini: ", effectiveDomain.trim(), domainValid ? "" : " (no és vàlid)"] })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: `text-sm ${themeClasses.secondaryText} w-full text-center mb-1`, children: "Prova un exemple:" }),
        (mode === "system" ? SYSTEM_EXAMPLES : FUNCTION_EXAMPLES).map((ex, i) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => loadExample(ex),
            className: `text-sm font-mono px-2.5 py-1 rounded-full border ${themeClasses.border} ${themeClasses.buttonBg} ${themeClasses.buttonHover}`,
            children: Array.isArray(ex) ? `{ ${ex.join(" ;  ")} }` : ex
          },
          i
        ))
      ] }) }),
      /* @__PURE__ */ jsx(MathKeyboard, { onKeyPress: handleKeyPress, theme })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `px-4 py-3 border-t ${themeClasses.border} flex items-center justify-between gap-3`, children: [
      /* @__PURE__ */ jsx("p", { className: `text-xs ${themeClasses.secondaryText} hidden sm:block`, children: "També pots escriure amb el teclat de l'ordinador: x^2, sqrt(x), 2x, 1/2..." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleSave,
          className: `px-6 py-2 rounded-lg font-semibold transition-colors ml-auto ${themeClasses.accentButtonClasses}`,
          children: existingFunction ? "Desa els canvis" : "Afegeix a la gràfica"
        }
      )
    ] })
  ] }) });
};
export {
  EquationEditorModal
};
