import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { THEMES } from "../constants.js";
// Paletes de les tecles segons el tema
const KEY_STYLES = {
  light: {
    number: { bg: "#ffffff", fg: "#1e293b", border: "#cbd5e1" },
    variable: { bg: "#dcfce7", fg: "#14532d", border: "#86efac" },
    operator: { bg: "#e0f2fe", fg: "#0c4a6e", border: "#7dd3fc" },
    relation: { bg: "#fef3c7", fg: "#78350f", border: "#fcd34d" },
    template: { bg: "#ede9fe", fg: "#4c1d95", border: "#c4b5fd" },
    control: { bg: "#ffe4e6", fg: "#881337", border: "#fda4af" }
  },
  dark: {
    number: { bg: "#334155", fg: "#f8fafc", border: "#475569" },
    variable: { bg: "#14532d", fg: "#dcfce7", border: "#166534" },
    operator: { bg: "#0c4a6e", fg: "#e0f2fe", border: "#075985" },
    relation: { bg: "#78350f", fg: "#fef3c7", border: "#92400e" },
    template: { bg: "#4c1d95", fg: "#ede9fe", border: "#5b21b6" },
    control: { bg: "#881337", fg: "#ffe4e6", border: "#9f1239" }
  }
};
KEY_STYLES.chalkboard = KEY_STYLES.dark;
KEY_STYLES["high-contrast"] = {
  number: { bg: "#000000", fg: "#ffffff", border: "#ffffff" },
  variable: { bg: "#000000", fg: "#7CFC00", border: "#7CFC00" },
  operator: { bg: "#000000", fg: "#00FFFF", border: "#00FFFF" },
  relation: { bg: "#000000", fg: "#FFFF00", border: "#FFFF00" },
  template: { bg: "#000000", fg: "#FF77FF", border: "#FF77FF" },
  control: { bg: "#000000", fg: "#FF6B6B", border: "#FF6B6B" }
};
const V = (t) => /* @__PURE__ */ jsx("span", { className: "font-serif italic", children: t });
const Sup = (base, exp) => /* @__PURE__ */ jsxs("span", { className: "font-serif", children: [
  /* @__PURE__ */ jsx("span", { className: "italic", children: base }),
  /* @__PURE__ */ jsx("sup", { className: "text-[0.7em] ml-px", children: exp })
] });
const FractionIcon = /* @__PURE__ */ jsxs("span", { className: "inline-flex flex-col items-center leading-none text-[0.8em]", children: [
  /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 border border-current rounded-sm" }),
  /* @__PURE__ */ jsx("span", { className: "block w-5 border-t-2 border-current my-0.5" }),
  /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 border border-current rounded-sm" })
] });
const SqrtIcon = /* @__PURE__ */ jsxs("span", { className: "font-serif", children: [
  "√",
  /* @__PURE__ */ jsx("span", { className: "inline-block w-3 h-3 border border-current rounded-sm align-middle ml-px" })
] });
// Cada tecla: { label, type (estil), action, title }
// Accions: { type: "insert", text } | { type: "wrap", before, after } | { type: "fraction" } | left | right | backspace | clear
const ins = (text) => ({ type: "insert", text });
const wrap = (before, after = ")") => ({ type: "wrap", before, after });
const MAIN_LEFT = [
  { label: V("x"), type: "variable", action: ins("x"), title: "Variable x" },
  { label: V("y"), type: "variable", action: ins("y"), title: "Variable y" },
  { label: Sup("x", "2"), type: "template", action: ins("^2"), title: "Al quadrat" },
  { label: Sup("x", "n"), type: "template", action: ins("^"), title: "Potència (escriu després l'exponent)" },
  { label: "(", type: "operator", action: ins("("), title: "Obre parèntesi" },
  { label: ")", type: "operator", action: ins(")"), title: "Tanca parèntesi" },
  { label: SqrtIcon, type: "template", action: wrap("√("), title: "Arrel quadrada" },
  { label: FractionIcon, type: "template", action: { type: "fraction" }, title: "Fracció" },
  { label: "<", type: "relation", action: ins("<"), title: "Menor que" },
  { label: ">", type: "relation", action: ins(">"), title: "Major que" },
  { label: "≤", type: "relation", action: ins("≤"), title: "Menor o igual que" },
  { label: "≥", type: "relation", action: ins("≥"), title: "Major o igual que" },
  { label: "π", type: "variable", action: ins("π"), title: "Nombre pi" },
  { label: "|□|", type: "template", action: wrap("|", "|"), title: "Valor absolut" },
  { label: Sup("x", "3"), type: "template", action: ins("^3"), title: "Al cub" },
  { label: Sup("e", "x"), type: "template", action: wrap("e^("), title: "Exponencial" }
];
const MAIN_RIGHT = [
  { label: "7", type: "number", action: ins("7") },
  { label: "8", type: "number", action: ins("8") },
  { label: "9", type: "number", action: ins("9") },
  { label: "÷", type: "operator", action: ins("/"), title: "Divisió" },
  { label: "4", type: "number", action: ins("4") },
  { label: "5", type: "number", action: ins("5") },
  { label: "6", type: "number", action: ins("6") },
  { label: "×", type: "operator", action: ins("·"), title: "Multiplicació" },
  { label: "1", type: "number", action: ins("1") },
  { label: "2", type: "number", action: ins("2") },
  { label: "3", type: "number", action: ins("3") },
  { label: "−", type: "operator", action: ins("-"), title: "Resta o signe negatiu" },
  { label: "0", type: "number", action: ins("0") },
  { label: ",", type: "number", action: ins(","), title: "Coma decimal" },
  { label: "=", type: "relation", action: ins("="), title: "Igual" },
  { label: "+", type: "operator", action: ins("+"), title: "Suma" }
];
const FUNCTION_KEYS = [
  { label: "sin", type: "template", action: wrap("sin("), title: "Sinus" },
  { label: "cos", type: "template", action: wrap("cos("), title: "Cosinus" },
  { label: "tan", type: "template", action: wrap("tan("), title: "Tangent" },
  { label: "ln", type: "template", action: wrap("ln("), title: "Logaritme neperià" },
  { label: "log", type: "template", action: wrap("log("), title: "Logaritme decimal" },
  { label: /* @__PURE__ */ jsxs("span", { className: "font-serif", children: [
    /* @__PURE__ */ jsx("sup", { className: "text-[0.65em]", children: "3" }),
    "√"
  ] }), type: "template", action: wrap("∛("), title: "Arrel cúbica" },
  { label: V("e"), type: "variable", action: ins("e"), title: "Nombre e" },
  { label: Sup("x", "−1"), type: "template", action: ins("^(-1)"), title: "Invers" }
];
const CONTROL_KEYS = [
  { label: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-left" }), type: "control", action: { type: "left" }, title: "Mou el cursor a l'esquerra" },
  { label: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-right" }), type: "control", action: { type: "right" }, title: "Mou el cursor a la dreta" },
  { label: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-delete-left" }), type: "control", action: { type: "backspace" }, title: "Esborra el caràcter anterior" },
  { label: /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "Buida" }), type: "control", action: { type: "clear" }, title: "Buida el camp" }
];
const KeyButton = ({ config, onPress, palette, small }) => {
  const style = palette[config.type] || palette.number;
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      title: config.title,
      "aria-label": config.title || (typeof config.label === "string" ? config.label : void 0),
      onPointerDown: (e) => e.preventDefault(),
      onClick: () => onPress(config.action),
      className: `w-full ${small ? "h-9 text-base" : "h-11 text-xl"} flex items-center justify-center rounded-lg font-semibold select-none active:translate-y-px transition-all duration-100 hover:brightness-95`,
      style: {
        backgroundColor: style.bg,
        color: style.fg,
        border: `1px solid ${style.border}`,
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.10)"
      },
      children: config.label
    }
  );
};
const MathKeyboard = ({ onKeyPress, theme }) => {
  const themeClasses = THEMES[theme];
  const palette = KEY_STYLES[theme] || KEY_STYLES.light;
  const [showFunctions, setShowFunctions] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: `w-full p-2 rounded-xl border ${themeClasses.border} ${themeClasses.buttonBg} space-y-2`, children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-6 gap-1.5", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onPointerDown: (e) => e.preventDefault(),
          onClick: () => setShowFunctions(!showFunctions),
          className: `col-span-2 h-9 rounded-lg text-sm font-semibold border ${themeClasses.border} ${themeClasses.buttonHover} flex items-center justify-center gap-2`,
          "aria-expanded": showFunctions,
          children: [
            /* @__PURE__ */ jsx("i", { className: `fa-solid ${showFunctions ? "fa-chevron-up" : "fa-chevron-down"} text-xs` }),
            "Més funcions"
          ]
        }
      ),
      CONTROL_KEYS.map((key, i) => /* @__PURE__ */ jsx("div", { className: i === 3 ? "col-span-1" : "", children: /* @__PURE__ */ jsx(KeyButton, { config: key, onPress: onKeyPress, palette, small: true }) }, i))
    ] }),
    showFunctions && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 sm:grid-cols-8 gap-1.5", children: FUNCTION_KEYS.map((key, i) => /* @__PURE__ */ jsx(KeyButton, { config: key, onPress: onKeyPress, palette, small: true }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1.5 flex-1", children: MAIN_LEFT.map((key, i) => /* @__PURE__ */ jsx(KeyButton, { config: key, onPress: onKeyPress, palette }, i)) }),
      /* @__PURE__ */ jsx("div", { className: `hidden sm:block w-px self-stretch ${themeClasses.border} border-l` }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-1.5 flex-1", children: MAIN_RIGHT.map((key, i) => /* @__PURE__ */ jsx(KeyButton, { config: key, onPress: onKeyPress, palette }, i)) })
    ] })
  ] });
};
export {
  MathKeyboard
};
