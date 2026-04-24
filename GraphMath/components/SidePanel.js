import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { THEMES, COLORS } from "../constants.js";
import { MathExpression } from "./MathExpression.js";
import { analyzeExpression, analyzeSystem } from "../services/mathService.js";
const ColorPicker = ({ selectedColor, onSelect, themeClasses }) => {
  return /* @__PURE__ */ jsx("div", { className: `flex flex-wrap gap-2 p-2 rounded-md ${themeClasses.buttonBg} border ${themeClasses.border}`, children: COLORS.map((color) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onSelect(color),
      className: `w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${selectedColor === color ? `ring-2 ring-offset-2 ${themeClasses.bg} ring-blue-500` : ""}`,
      style: { backgroundColor: color },
      "aria-label": `Select color ${color}`
    },
    color
  )) });
};
const formatDomainString = (domainStr) => {
  if (!domainStr) return "";
  return domainStr.replace(/<=/g, " \u2264 ").replace(/≥/g, " \u2265 ").replace(/</g, " < ").replace(/>/g, " > ").replace(/\s+/g, " ").trim();
};
const AnalysisPanel = ({ func, themeClasses }) => {
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    setIsLoading(true);
    if (func.type === "system") {
      setAnalysisResults([analyzeSystem(func.expressions)]);
    } else {
      setAnalysisResults(func.expressions.map(analyzeExpression));
    }
    setIsLoading(false);
  }, [func]);
  if (isLoading) return /* @__PURE__ */ jsx("p", { className: "p-3", children: "Analitzant..." });
  if (func.type === "system") {
    const result = analysisResults[0];
    if (!result) return null;
    const renderSolution = () => {
      switch (result.systemSolutionStatus) {
        case "INFINITE_SOLUTIONS":
          return /* @__PURE__ */ jsx("p", { children: "El sistema t\xE9 infinites solucions (les funcions s\xF3n equivalents)." });
        case "NO_SOLUTION":
          return /* @__PURE__ */ jsx("p", { children: "El sistema no t\xE9 cap soluci\xF3 (les funcions s\xF3n paral\xB7leles)." });
        case "LIMITED_SOLUTIONS":
        default:
          if (result.intersectionPoints && result.intersectionPoints.length > 0) {
            return /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: result.intersectionPoints.map((p, i) => /* @__PURE__ */ jsx("li", { className: `font-mono p-2 rounded ${themeClasses.bg}`, children: `x = ${p.x.toFixed(2)}, y = ${p.y.toFixed(2)}` }, i)) });
          }
          return /* @__PURE__ */ jsx("p", { children: result.domainNotes.length > 0 ? result.domainNotes[0] : "No s'han trobat solucions a la zona analitzada." });
      }
    };
    return /* @__PURE__ */ jsxs("div", { className: `mt-2 p-3 rounded-md text-sm ${themeClasses.buttonBg} border ${themeClasses.border}`, children: [
      /* @__PURE__ */ jsx("strong", { className: `block mb-2 ${themeClasses.secondaryText}`, children: "Soluci\xF3 del sistema:" }),
      renderSolution()
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: `mt-2 p-3 rounded-md text-sm ${themeClasses.buttonBg} border ${themeClasses.border}`, children: analysisResults.map((result, index) => /* @__PURE__ */ jsxs("div", { className: index > 0 ? "mt-2 pt-2 border-t " + themeClasses.border : "", children: [
    func.expressions.length > 1 && /* @__PURE__ */ jsxs("p", { className: "font-bold", children: [
      "An\xE0lisi per: ",
      /* @__PURE__ */ jsx(MathExpression, { expression: func.expressions[index] })
    ] }),
    /* @__PURE__ */ jsx("strong", { className: themeClasses.secondaryText, children: "Domini:" }),
    func.domainRestriction ? /* @__PURE__ */ jsx("p", { className: `font-mono p-2 rounded text-base ${themeClasses.bg}`, children: formatDomainString(func.domainRestriction) }) : result.domainNotes.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside", children: result.domainNotes.map((note, i) => /* @__PURE__ */ jsx("li", { children: note }, i)) }) : /* @__PURE__ */ jsx("p", { children: "Tots els reals (\u211D)" }),
    func.domainRestriction && result.domainNotes.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("strong", { className: `mt-2 inline-block text-xs ${themeClasses.secondaryText}`, children: "Notes addicionals:" }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-xs", children: result.domainNotes.map((note, i) => /* @__PURE__ */ jsx("li", { children: note }, i)) })
    ] }),
    /* @__PURE__ */ jsx("strong", { className: `mt-2 inline-block ${themeClasses.secondaryText}`, children: "Tall Eix Y:" }),
    /* @__PURE__ */ jsx("p", { children: typeof result.yIntercept === "number" ? result.yIntercept.toFixed(2) : result.yIntercept ?? "N/A" }),
    /* @__PURE__ */ jsx("strong", { className: `mt-2 inline-block ${themeClasses.secondaryText}`, children: "Arrels (Talls Eix X):" }),
    result.xIntercepts && result.xIntercepts.length > 0 ? /* @__PURE__ */ jsx("p", { children: result.xIntercepts.map((r) => r.toFixed(2)).join(", ") }) : /* @__PURE__ */ jsx("p", { children: "No s'han trobat arrels a la zona visible." })
  ] }, index)) });
};
const FunctionItem = ({ func, onEdit, onDelete, onToggleVisibility, onUpdateColor, themeClasses }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const handleColorSelect = (color) => {
    onUpdateColor(func.id, color);
    setIsColorPickerOpen(false);
  };
  const isSystem = func.type === "system";
  return /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg border ${themeClasses.border} ${themeClasses.buttonBg} transition-all duration-200`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onToggleVisibility(func.id),
              className: "flex-shrink-0",
              "aria-label": func.isVisible ? "Hide function" : "Show function",
              children: /* @__PURE__ */ jsx("i", { className: `fa-solid text-xl ${func.isVisible ? "fa-eye text-green-500" : "fa-eye-slash text-slate-400"}` })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsAnalysisOpen(!isAnalysisOpen),
              className: "flex-shrink-0",
              "aria-label": "Show analysis",
              children: /* @__PURE__ */ jsx("i", { className: `fa-solid fa-circle-info text-xl ${isAnalysisOpen ? `text-blue-500` : themeClasses.secondaryText}` })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "truncate text-lg flex items-center", children: [
          isSystem && /* @__PURE__ */ jsx("span", { className: "text-4xl font-thin mr-2", children: "{" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: func.expressions.map((expr, index) => /* @__PURE__ */ jsx(MathExpression, { expression: expr }, index)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0 ml-2", children: [
        /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsColorPickerOpen(!isColorPickerOpen),
            className: "w-6 h-6 rounded-full border-2",
            style: { backgroundColor: func.color, borderColor: func.color },
            "aria-label": "Change color"
          }
        ) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onEdit(func), className: `p-2 w-8 h-8 rounded ${themeClasses.buttonHover}`, "aria-label": "Edit function", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pencil" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(func.id), className: `p-2 w-8 h-8 rounded text-red-500 hover:bg-red-500 hover:text-white`, "aria-label": "Delete function", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
      ] })
    ] }),
    isColorPickerOpen && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(ColorPicker, { selectedColor: func.color, onSelect: handleColorSelect, themeClasses }) }),
    isAnalysisOpen && /* @__PURE__ */ jsx(AnalysisPanel, { func, themeClasses })
  ] });
};
const SidePanel = ({
  isOpen,
  functions,
  onEdit,
  onDelete,
  onToggleVisibility,
  onUpdateColor,
  theme
}) => {
  const themeClasses = THEMES[theme];
  return /* @__PURE__ */ jsx(
    "aside",
    {
      className: `absolute md:relative top-0 right-0 h-full w-full max-w-sm transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? "translate-x-0" : "translate-x-full"} ${themeClasses.sidePanelBg} border-l ${themeClasses.border}`,
      children: /* @__PURE__ */ jsxs("div", { className: "p-4 h-full flex flex-col", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold mb-4 pb-2 border-b-4`, style: { borderColor: themeClasses.accent }, children: "Funcions i sistemes" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-grow flex flex-col", children: [
          functions.length === 0 ? /* @__PURE__ */ jsxs("div", { className: `flex-1 flex flex-col items-center justify-center text-center p-4 rounded-lg border-2 border-dashed ${themeClasses.border} ${themeClasses.secondaryText}`, children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-square-root-variable text-4xl mb-3" }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "No hi ha funcions" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Fes clic a 'Afegir' per comen\xE7ar a graficar." })
          ] }) : /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-3 overflow-y-auto pr-2 -mr-2", children: functions.map((func) => /* @__PURE__ */ jsx(
            FunctionItem,
            {
              func,
              onEdit,
              onDelete,
              onToggleVisibility,
              onUpdateColor,
              themeClasses
            },
            func.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: `flex-shrink-0 mt-4 pt-4 border-t ${themeClasses.border} flex items-center gap-3 text-xs`, children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca",
                target: "_blank",
                rel: "noopener noreferrer",
                "aria-label": "Creative Commons License",
                className: "flex-shrink-0",
                children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: "./vendor/cc-by-nc-sa-88x31.png",
                    alt: "Llic\xE8ncia Creative Commons",
                    className: "h-8 opacity-80"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxs("p", { className: `${themeClasses.secondaryText}`, children: [
                "Aplicaci\xF3 creada per ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://ja.cat/felipsarroca",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "hover:underline",
                    children: "Felip Sarroca"
                  }
                ),
                " amb l'assist\xE8ncia de la IA."
              ] }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: `${themeClasses.secondaryText} hover:underline`,
                  children: "Obra sota llic\xE8ncia CC BY-NC-SA 4.0"
                }
              )
            ] })
          ] })
        ] })
      ] })
    }
  );
};
export {
  SidePanel
};
