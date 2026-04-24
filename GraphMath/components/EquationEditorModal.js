import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { MathKeyboard } from "./MathKeyboard.js";
import { MathExpression } from "./MathExpression.js";
import { THEMES } from "../constants.js";
import { parseExpression, parseIntervalExpression } from "../services/mathService.js";
const EquationEditorModal = ({ isOpen, onClose, onSave, existingFunction, theme }) => {
  const [expressions, setExpressions] = useState([""]);
  const [domainRestriction, setDomainRestriction] = useState("");
  const [mode, setMode] = useState("single");
  const [focusedInput, setFocusedInput] = useState(0);
  const [activeField, setActiveField] = useState("expression");
  const [isAnimating, setIsAnimating] = useState(false);
  const inputRefs = useRef([]);
  const domainInputRef = useRef(null);
  const themeClasses = THEMES[theme];
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
    } else {
      setIsAnimating(false);
    }
  }, [existingFunction, isOpen]);
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };
  const handleSave = () => {
    const validExpressions = expressions.map((e) => e.trim()).filter((e) => e);
    if (validExpressions.length > 0) {
      const finalType = mode === "system" ? "system" : (() => {
        const expr = validExpressions[0];
        if (parseIntervalExpression(expr)) return "interval";
        const parsed = parseExpression(expr);
        if (parsed && parsed.inequalityType) return "inequality";
        return "equation";
      })();
      onSave({
        expressions: validExpressions,
        type: finalType,
        domainRestriction: finalType === "equation" ? domainRestriction.trim() : void 0
      });
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSave();
    }
  };
  const handleExpressionChange = (index, value) => {
    const newExpressions = [...expressions];
    newExpressions[index] = value;
    setExpressions(newExpressions);
  };
  const addExpression = () => {
    setExpressions([...expressions, ""]);
    setTimeout(() => {
      const newIndex = expressions.length;
      inputRefs.current[newIndex]?.focus();
      setFocusedInput(newIndex);
      setActiveField("expression");
    }, 0);
  };
  const removeExpression = (index) => {
    if (expressions.length > 1) {
      const newExpressions = expressions.filter((_, i) => i !== index);
      setExpressions(newExpressions);
      const newFocusIndex = Math.max(0, index - 1);
      setFocusedInput(newFocusIndex);
      setActiveField("expression");
      inputRefs.current[newFocusIndex]?.focus();
    }
  };
  const handleKeyPress = (value, keyType) => {
    let input;
    let currentText;
    let textUpdater;
    if (activeField === "domain") {
      input = domainInputRef.current;
      currentText = domainRestriction;
      textUpdater = setDomainRestriction;
    } else {
      input = inputRefs.current[focusedInput];
      currentText = expressions[focusedInput];
      textUpdater = (newValue) => handleExpressionChange(focusedInput, newValue);
    }
    if (!input) return;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    let newText = "";
    let newCursorPos = 0;
    switch (keyType) {
      case "backspace":
        if (start > 0 && start === end) {
          newText = currentText.substring(0, start - 1) + currentText.substring(end);
          newCursorPos = start - 1;
        } else {
          newText = currentText.substring(0, start) + currentText.substring(end);
          newCursorPos = start;
        }
        break;
      case "function":
        const functionCall = `${value}()`;
        newText = currentText.substring(0, start) + functionCall + currentText.substring(end);
        newCursorPos = start + value.length + 1;
        break;
      case "insert":
      default:
        newText = currentText.substring(0, start) + value + currentText.substring(end);
        newCursorPos = start + value.length;
        break;
    }
    textUpdater(newText);
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: `fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"}`, children: /* @__PURE__ */ jsxs("div", { className: `rounded-lg shadow-2xl w-full max-w-2xl ${themeClasses.panelBg} border ${themeClasses.border} transition-all duration-200 ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-end items-center mb-2", children: /* @__PURE__ */ jsx("button", { onClick: handleClose, className: `p-1.5 rounded-full -mr-1 -mt-1 border ${themeClasses.border} ${themeClasses.buttonBg} ${themeClasses.buttonHover} shadow-sm`, style: { color: THEMES[theme].accent }, children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-times" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-4 mb-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name: "mode", value: "single", checked: mode === "single", onChange: () => setMode("single"), className: "form-radio", style: { accentColor: THEMES[theme].accent } }),
            "Funci\xF3"
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsx("input", { type: "radio", name: "mode", value: "system", checked: mode === "system", onChange: () => setMode("system"), className: "form-radio", style: { accentColor: THEMES[theme].accent } }),
            "Sistema"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: `text-sm font-semibold ${themeClasses.secondaryText}`, children: "Introdueix aqu\xED la funci\xF3:" }),
          (mode === "single" ? [expressions[0]] : expressions).map((expr, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: (el) => {
                  inputRefs.current[index] = el;
                },
                type: "text",
                value: expr,
                onChange: (e) => handleExpressionChange(index, e.target.value),
                onFocus: () => {
                  setFocusedInput(index);
                  setActiveField("expression");
                },
                onKeyDown: handleKeyDown,
                placeholder: mode === "system" ? `Equaci\xF3 ${index + 1}` : "Ex.: y = x^2 o 2x + 3y = 7",
                className: `w-full p-2.5 text-base font-mono rounded-md border ${themeClasses.border} focus:outline-none focus:ring-2`,
                style: { "--tw-ring-color": THEMES[theme].accent, backgroundColor: theme === "light" ? "#fffaf0" : theme === "dark" ? "#111827" : theme === "chalkboard" ? "#314033" : "#000000" },
              }
            ),
            mode === "system" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => removeExpression(index),
                className: "p-1.5 rounded text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent",
                disabled: expressions.length <= 1,
                children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" })
              }
            )
          ] }, mode === "single" ? 0 : index)),
          mode === "single" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-1", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "domain-restriction", className: `text-sm ${themeClasses.secondaryText}`, children: "Domini restringit (opcional):" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "domain-restriction",
                ref: domainInputRef,
                type: "text",
                value: domainRestriction,
                onChange: (e) => setDomainRestriction(e.target.value),
                onFocus: () => setActiveField("domain"),
                onKeyDown: handleKeyDown,
                placeholder: "ex: -2 < x < 5",
                className: `w-full p-2 text-sm font-mono rounded-md border ${themeClasses.border} ${themeClasses.buttonBg} focus:outline-none focus:ring-2`,
                style: { "--tw-ring-color": THEMES[theme].accent }
              }
            )
          ] })
        ] }),
        mode === "system" && /* @__PURE__ */ jsxs("button", { onClick: addExpression, className: `w-full p-1.5 rounded-md border-dashed border-2 ${themeClasses.border} ${themeClasses.buttonHover}`, children: [
          /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus mr-2" }),
          " Afegir equaci\xF3"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("div", { className: `text-sm font-semibold ${themeClasses.secondaryText}`, children: "Visualitzaci\xF3 pr\xE8via:" }),
          /* @__PURE__ */ jsx("div", { className: `w-full p-2.5 text-xl rounded-md border ${themeClasses.border} min-h-[64px] flex items-center justify-center`, style: { backgroundColor: theme === "light" ? "#eff6ff" : theme === "dark" ? "#1e293b" : theme === "chalkboard" ? "#435446" : "#111111" }, children: expressions.some((expr) => expr.trim()) || domainRestriction.trim() ? /* @__PURE__ */ jsxs("div", { className: "flex items-center flex-wrap justify-center gap-2", children: [
            mode === "system" && expressions.some((expr) => expr.trim()) && /* @__PURE__ */ jsx("span", { className: "text-4xl font-thin mr-1", children: "{" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: (mode === "single" ? [expressions[0]] : expressions).filter((expr) => expr.trim()).map((expr, index) => /* @__PURE__ */ jsx(MathExpression, { expression: expr }, index)) }),
            domainRestriction.trim() && /* @__PURE__ */ jsx("div", { className: `text-xs px-2.5 py-1 rounded-full border ${themeClasses.border} ${themeClasses.secondaryText}`, children: domainRestriction.trim() })
          ] }) : /* @__PURE__ */ jsx("p", { className: `${themeClasses.secondaryText} text-base text-center`, children: "..." }) })
        ] }),
        /* @__PURE__ */ jsx(MathKeyboard, { onKeyPress: handleKeyPress, theme })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `px-4 py-3 border-t ${themeClasses.border} flex justify-end`, children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleSave,
        className: `px-6 py-2 rounded-lg font-semibold transition-colors ${themeClasses.accentButtonClasses}`,
        children: existingFunction ? "Desar canvis" : "Afegir a la gr\xE0fica"
      }
    ) })
  ] }) });
};
export {
  EquationEditorModal
};
