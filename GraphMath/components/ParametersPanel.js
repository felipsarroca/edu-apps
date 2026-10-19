import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
const formatValue = (v) => Number(v.toFixed(2)).toString().replace(".", ",").replace("-", "−");
// Lliscadors per als paràmetres (a, b, c...) que apareixen a les expressions
const ParameterRow = ({ name, config, onChange, isAnimating, onToggleAnimation, themeClasses }) => {
  const [showRange, setShowRange] = useState(false);
  const { value, min, max, step } = config;
  const numberInput = (field, label) => /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1", children: [
    label,
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "number",
        value: config[field],
        step: "any",
        onChange: (e) => {
          const v = Number(e.target.value.replace(",", "."));
          if (Number.isFinite(v)) onChange(name, { [field]: v });
        },
        className: `w-16 px-1 py-0.5 rounded border ${themeClasses.border} ${themeClasses.bg}`
      }
    )
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "py-1.5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "font-serif italic font-bold text-lg w-5 text-center", children: name }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min,
          max,
          step,
          value,
          onChange: (e) => onChange(name, { value: Number(e.target.value) }),
          className: "flex-1 min-w-0",
          style: { accentColor: themeClasses.accent },
          "aria-label": `Valor del paràmetre ${name}`
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "font-mono text-sm w-12 text-right", children: formatValue(value) }),
      /* @__PURE__ */ jsx("button", { onClick: () => onToggleAnimation(name), className: `w-7 h-7 rounded-full ${themeClasses.buttonHover}`, title: isAnimating ? "Atura l'animació" : "Anima el paràmetre", "aria-label": isAnimating ? "Atura l'animació" : "Anima el paràmetre", children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${isAnimating ? "fa-pause" : "fa-play"} text-xs` }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => setShowRange(!showRange), className: `w-7 h-7 rounded-full ${themeClasses.buttonHover}`, title: "Interval i pas", "aria-label": "Interval i pas", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-gear text-xs" }) })
    ] }),
    showRange && /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap gap-3 mt-1 ml-7 text-xs ${themeClasses.secondaryText}`, children: [
      numberInput("min", "Mín."),
      numberInput("max", "Màx."),
      numberInput("step", "Pas")
    ] })
  ] });
};
const ParametersPanel = ({ names, params, onChange, animating, onToggleAnimation, themeClasses }) => {
  if (!names.length) return null;
  return /* @__PURE__ */ jsxs("div", { className: `mb-3 p-3 rounded-lg border ${themeClasses.border} ${themeClasses.buttonBg}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-2 ${themeClasses.secondaryText}`, children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-sliders" }),
      "Paràmetres"
    ] }),
    names.map((name) => /* @__PURE__ */ jsx(ParameterRow, { name, config: params[name], onChange, isAnimating: animating === name, onToggleAnimation, themeClasses }, name))
  ] });
};
export {
  ParametersPanel
};
