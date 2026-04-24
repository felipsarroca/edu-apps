import { jsx, jsxs } from "react/jsx-runtime";
import { THEMES } from "../constants.js";
const KeyButton = ({ config, onClick }) => {
  const { display, type, span = 1 } = config;
  const colorClasses = {
    number: "bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100",
    variable: "bg-green-200 dark:bg-green-800 border-green-400 dark:border-green-900 hover:bg-green-300 dark:hover:bg-green-700 text-green-900 dark:text-green-100",
    function: "bg-blue-200 dark:bg-blue-800 border-blue-400 dark:border-blue-900 hover:bg-blue-300 dark:hover:bg-blue-700 text-blue-900 dark:text-blue-100",
    operator: "bg-orange-200 dark:bg-orange-800 border-orange-400 dark:border-orange-900 hover:bg-orange-300 dark:hover:bg-orange-700 text-orange-900 dark:text-orange-100",
    control: "bg-red-200 dark:bg-red-700 border-red-400 dark:border-red-800 hover:bg-red-300 dark:hover:bg-red-600 text-red-900 dark:text-red-100"
  };
  const baseClasses = `
    w-full h-10 flex items-center justify-center 
    text-[1.35rem] font-bold rounded-lg 
    border border-black/10
    active:translate-y-px
    transition-all duration-100 ease-in-out
  `;
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: `${baseClasses} ${colorClasses[type] || colorClasses.number} col-span-${span}`,
      style: {
        gridColumn: `span ${span}`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 0 rgba(0,0,0,0.16), 0 1px 2px rgba(0,0,0,0.12)"
      },
      children: display
    }
  );
};
const MathKeyboard = ({ onKeyPress, theme }) => {
  const themeClasses = THEMES[theme];
  const numberKeys = [
    { value: "x", display: "x", type: "variable" },
    { value: "y", display: "y", type: "variable" },
    { value: "backspace", display: "\u232B", type: "control" },
    { value: "7", display: "7", type: "number" },
    { value: "8", display: "8", type: "number" },
    { value: "9", display: "9", type: "number" },
    { value: "4", display: "4", type: "number" },
    { value: "5", display: "5", type: "number" },
    { value: "6", display: "6", type: "number" },
    { value: "1", display: "1", type: "number" },
    { value: "2", display: "2", type: "number" },
    { value: "3", display: "3", type: "number" },
    { value: "0", display: "0", type: "number", span: 2 },
    { value: ".", display: ".", type: "number" }
  ];
  const functionKeys = [
    { value: "sin", display: "sin", type: "function" },
    { value: "cos", display: "cos", type: "function" },
    { value: "tan", display: "tan", type: "function" },
    { value: "log", display: "log", type: "function" },
    { value: "sqrt", display: "\u221A", type: "function" },
    { value: "^", display: /* @__PURE__ */ jsxs("span", { className: "lowercase", children: [
      "x",
      /* @__PURE__ */ jsx("sup", { className: "ml-0.5 text-[0.9rem]", children: "y" })
    ] }), type: "operator" },
    { value: "(", display: "(", type: "operator" },
    { value: ")", display: ")", type: "operator" },
    { value: "PI", display: "\u03C0", type: "variable" },
    { value: "e", display: "e", type: "variable" }
  ];
  const operatorKeys = [
    { value: "/", display: "\xF7", type: "operator" },
    { value: "*", display: "\xD7", type: "operator" },
    { value: "-", display: "-", type: "operator" },
    { value: "+", display: "+", type: "operator" },
    { value: "<", display: "<", type: "operator" },
    { value: ">", display: ">", type: "operator" },
    { value: "<=", display: "\u2264", type: "operator" },
    { value: ">=", display: "\u2265", type: "operator" },
    { value: "=", display: "=", type: "control", span: 2 }
  ];
  const handleKeyPress = (keyConfig) => {
    let keyType = "insert";
    if (keyConfig.type === "function") {
      keyType = "function";
    } else if (keyConfig.value === "backspace") {
      keyType = "backspace";
    }
    onKeyPress(keyConfig.value, keyType);
  };
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col md:flex-row w-full gap-1.5 p-1.5 rounded-lg border ${themeClasses.border} ${themeClasses.buttonBg}`, children: [
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-1.5 w-full md:flex-1", children: numberKeys.map((key) => /* @__PURE__ */ jsx(KeyButton, { config: key, onClick: () => handleKeyPress(key) }, key.value + key.display)) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 w-full md:flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1.5 w-1/2", children: functionKeys.map((key) => /* @__PURE__ */ jsx(KeyButton, { config: key, onClick: () => handleKeyPress(key) }, key.value)) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-1.5 w-1/2", children: operatorKeys.map((key) => /* @__PURE__ */ jsx(KeyButton, { config: key, onClick: () => handleKeyPress(key) }, key.value)) })
    ] })
  ] });
};
export {
  MathKeyboard
};
