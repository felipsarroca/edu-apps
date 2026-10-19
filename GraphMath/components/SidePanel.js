import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { THEMES, COLORS, getExpressionColor } from "../constants.js";
import { MathExpression } from "./MathExpression.js";
import { ParametersPanel } from "./ParametersPanel.js";
import { analyzeExpression, analyzeSystem, formatNumber, formatPoint } from "../services/mathService.js";
const SUBSCRIPTS = "₁₂₃₄₅₆₇₈₉";
const ColorPicker = ({ selectedColor, onSelect, themeClasses }) => {
  return /* @__PURE__ */ jsx("div", { className: `flex flex-wrap gap-2 p-2 rounded-md ${themeClasses.buttonBg} border ${themeClasses.border}`, children: COLORS.map((color) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => onSelect(color),
      className: `w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${selectedColor === color ? `ring-2 ring-offset-2 ${themeClasses.bg} ring-blue-500` : ""}`,
      style: { backgroundColor: color },
      "aria-label": `Tria el color ${color}`
    },
    color
  )) });
};
const formatDomainString = (domainStr) => {
  if (!domainStr) return "";
  return domainStr.replace(/<=/g, " ≤ ").replace(/>=/g, " ≥ ").replace(/</g, " < ").replace(/>/g, " > ").replace(/\s+/g, " ").trim();
};
// Fila d'informació. Si té "mark", inclou un botó per destacar l'element a la gràfica
const Row = ({ label, children, themeClasses, mark }) => /* @__PURE__ */ jsxs("div", { className: "py-1", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: `block text-xs font-semibold uppercase tracking-wide ${themeClasses.secondaryText}`, children: label }),
    mark && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: mark.onToggle,
        className: `flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${mark.active ? "text-white" : `${themeClasses.border} ${themeClasses.buttonHover} ${themeClasses.secondaryText}`}`,
        style: mark.active ? { backgroundColor: mark.color, borderColor: mark.color } : void 0,
        title: mark.active ? "Amaga-ho de la gràfica" : "Mostra-ho a la gràfica",
        "aria-pressed": mark.active,
        children: [
          /* @__PURE__ */ jsx("i", { className: `fa-solid ${mark.active ? "fa-eye" : "fa-location-dot"}` }),
          mark.active ? "A la gràfica" : "Mostra"
        ]
      }
    )
  ] }),
  /* @__PURE__ */ jsx("div", { className: "text-base", children })
] });
const Explanation = ({ text, themeClasses }) => text ? /* @__PURE__ */ jsxs("p", { className: `text-sm mt-2 flex gap-2 items-start ${themeClasses.secondaryText}`, children: [
  /* @__PURE__ */ jsx("i", { className: "fa-solid fa-lightbulb text-amber-400 mt-0.5" }),
  text
] }) : null;
const Pill = ({ children, themeClasses, color }) => /* @__PURE__ */ jsx("span", { className: `inline-block font-mono text-sm px-2 py-0.5 rounded-md mr-1.5 mb-1 border ${themeClasses.border} ${themeClasses.bg}`, style: color ? { borderColor: color } : void 0, children });
const listRoots = (roots) => {
  if (roots.length <= 8) return { shown: roots, more: false };
  return { shown: roots.filter((r) => Math.abs(r) <= 10).slice(0, 12), more: true };
};
const rootName = (count, i) => count > 1 ? `x${SUBSCRIPTS[i] || ""}` : "x";
// Resum curt de la solució, sempre visible sota l'equació o el sistema
const solutionSummary = (func) => {
  if (func.type === "system") {
    const r = analyzeSystem(func.expressions);
    if (r.systemSolutionStatus === "INFINITE_SOLUTIONS") return "Infinites solucions";
    if (r.systemSolutionStatus === "NO_SOLUTION") return "Sense solució";
    if (r.systemSolutionStatus === "INEQUALITIES") return "Solució: regió comuna";
    if (r.intersectionPoints?.length) return `Solució: ${r.intersectionPoints.slice(0, 4).map((p) => formatPoint(p)).join("  ")}${r.intersectionPoints.length > 4 ? " …" : ""}`;
    return null;
  }
  const a = analyzeExpression(func.expressions[0]);
  if (a.kind === "equationX") {
    if (a.identity) return "Qualsevol nombre és solució";
    if (!a.solutions.length) return "Sense solució real";
    if (a.periodic) return `x = …, ${a.periodic.sample.map((x) => formatNumber(x)).join(", ")}, …`;
    const { shown, more } = listRoots(a.solutions);
    return shown.map((x, i) => `${rootName(a.solutions.length, i)} = ${formatNumber(x)}`).join(",  ") + (more ? " …" : "");
  }
  if (a.kind === "inequalityX") return `Solució: ${a.solutionText}`;
  return null;
};
const RootList = ({ roots, exact, label, themeClasses, color, periodic }) => {
  if (periodic) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap items-center", children: [
        /* @__PURE__ */ jsx("span", { className: "mr-1.5 mb-1", children: "…" }),
        periodic.sample.map((x, i) => /* @__PURE__ */ jsx(Pill, { themeClasses, color, children: label(x, i) }, i)),
        /* @__PURE__ */ jsx("span", { className: "mb-1", children: "…" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: `block text-sm mt-1`, children: ["Forma general: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: periodic.general })] })
    ] });
  }
  const { shown, more } = listRoots(roots);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mt-1", children: shown.map((x, i) => /* @__PURE__ */ jsx(Pill, { themeClasses, color, children: label(x, i) }, i)) }),
    more && /* @__PURE__ */ jsx("span", { className: `text-xs ${themeClasses.secondaryText}`, children: "N'hi ha més: es mostren només les de l'interval [−10, 10]." }),
    exact && /* @__PURE__ */ jsxs("span", { className: `block text-xs mt-1 ${themeClasses.secondaryText}`, children: ["Valor exacte: ", exact.join(", ")] })
  ] });
};
const AnalysisPanel = ({ func, themeClasses, onToggleMark }) => {
  const mark = (key) => ({ active: !!(func.marks && func.marks[key]), onToggle: () => onToggleMark(func.id, key), color: func.color });
  const box = `mt-2 p-3 rounded-md text-sm ${themeClasses.buttonBg} border ${themeClasses.border}`;
  if (func.type === "system") {
    const result = analyzeSystem(func.expressions);
    const points = result.intersectionPoints || [];
    return /* @__PURE__ */ jsxs("div", { className: box, children: [
      result.domainNotes.map((n, i) => /* @__PURE__ */ jsx("p", { className: "text-red-500", children: n }, i)),
      result.classification && /* @__PURE__ */ jsx("p", { className: "mb-2", children: result.classification }),
      result.systemSolutionStatus === "INEQUALITIES" && /* @__PURE__ */ jsx("p", { children: "Sistema d'inequacions: la solució és la zona on se superposen totes les regions pintades." }),
      points.length > 0 && /* @__PURE__ */ jsx(Row, { label: points.length === 1 ? "Solució" : "Solucions", themeClasses, children: /* @__PURE__ */ jsx("ul", { className: "space-y-1 mt-1", children: points.map((p, i) => /* @__PURE__ */ jsxs("li", { className: `font-mono px-2 py-1 rounded flex flex-wrap justify-between gap-x-3 ${themeClasses.bg}`, children: [
        /* @__PURE__ */ jsx("span", { children: `x = ${formatNumber(p.x)},  y = ${formatNumber(p.y)}` }),
        /* @__PURE__ */ jsxs("span", { className: themeClasses.secondaryText, children: ["Punt ", formatPoint(p)] })
      ] }, i)) }) }),
      points.length > 0 && !result.linear && /* @__PURE__ */ jsx("p", { className: `text-xs mt-2 ${themeClasses.secondaryText}`, children: "Valors calculats numèricament (arrodonits a dues xifres decimals quan no són exactes)." })
    ] });
  }
  const a = analyzeExpression(func.expressions[0]);
  if (!a.ok) return /* @__PURE__ */ jsx("div", { className: `${box} text-red-500`, children: a.error });
  const FACT_MARKS = { "Vèrtex": "vertex", "Eix de simetria": "axis" };
  const facts = a.facts.map((f, i) => /* @__PURE__ */ jsx(Row, { label: f.label, themeClasses, mark: a.kind === "explicitY" && FACT_MARKS[f.label] ? mark(FACT_MARKS[f.label]) : void 0, children: f.value }, `f${i}`));
  let body;
  if (a.kind === "explicitY" && a.domain !== void 0) {
    body = [
      ...facts,
      /* @__PURE__ */ jsxs(Row, { label: "Domini", themeClasses, children: [
        func.domainRestriction ? `Restringit: ${formatDomainString(func.domainRestriction)}` : a.domain,
        a.domainNotes.map((n, i) => /* @__PURE__ */ jsx("span", { className: `block text-xs ${themeClasses.secondaryText}`, children: n }, i))
      ] }, "dom"),
      /* @__PURE__ */ jsx(Row, { label: "Tall amb l'eix Y", themeClasses, mark: typeof a.yIntercept === "number" ? mark("yIntercept") : void 0, children: typeof a.yIntercept === "number" ? formatPoint({ x: 0, y: a.yIntercept }) : a.yIntercept }, "y0"),
      /* @__PURE__ */ jsx(Row, { label: "Talls amb l'eix X (arrels)", themeClasses, mark: a.xIntercepts.length ? mark("xIntercepts") : void 0, children: a.onXAxis ? "La gràfica coincideix amb l'eix X." : a.xIntercepts.length ? /* @__PURE__ */ jsx(RootList, { roots: a.xIntercepts, exact: a.exactRoots, periodic: a.periodic, themeClasses, label: (x) => formatPoint({ x, y: 0 }) }) : "No en té (no talla l'eix X)." }, "xi"),
      a.extrema && a.extrema.length > 0 && /* @__PURE__ */ jsx(Row, { label: "Màxims i mínims relatius", themeClasses, mark: mark("extrema"), children: /* @__PURE__ */ jsxs("div", { className: "mt-1", children: [
        listRoots(a.extrema.map((e) => e.x)).shown.map((x, i) => {
          const e = a.extrema.find((ex) => ex.x === x);
          return /* @__PURE__ */ jsx(Pill, { themeClasses, children: `${e.type === "max" ? "Màx" : "Mín"} ${formatPoint(e)}` }, i);
        }),
        a.extrema.length > 8 && /* @__PURE__ */ jsx("span", { children: "…" })
      ] }) }, "ext"),
      a.monotony && /* @__PURE__ */ jsxs(Row, { label: "Creixement", themeClasses, children: [
        /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: [/* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-trend-up text-green-500 mr-1.5" }), "Creixent: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: a.monotony.increasing })] }),
        /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: [/* @__PURE__ */ jsx("i", { className: "fa-solid fa-arrow-trend-down text-red-500 mr-1.5" }), "Decreixent: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: a.monotony.decreasing })] })
      ] }, "mon"),
      a.sign && /* @__PURE__ */ jsxs(Row, { label: "Signe", themeClasses, children: [
        /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: ["f(x) > 0: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: a.sign.positive })] }),
        /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: ["f(x) < 0: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: a.sign.negative })] })
      ] }, "sign"),
      a.asymptotes && (a.asymptotes.vertical.length > 0 || a.asymptotes.horizontal.length > 0) && /* @__PURE__ */ jsxs(Row, { label: "Asímptotes", themeClasses, mark: mark("asymptotes"), children: [
        a.asymptotes.vertical.length > 0 && /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: ["Verticals: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: a.asymptotes.vertical.map((x) => `x = ${formatNumber(x)}`).join(",  ") })] }),
        a.asymptotes.horizontal.map((h, i) => /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: ["Horitzontal: ", /* @__PURE__ */ jsx("span", { className: "font-mono", children: `y = ${formatNumber(h.y)}` }), ` (quan ${h.where})`] }, i))
      ] }, "asy"),
      a.holes && a.holes.length > 0 && /* @__PURE__ */ jsx(Row, { label: "Discontinuïtat evitable", themeClasses, children: a.holes.map((h, i) => /* @__PURE__ */ jsxs("span", { className: "block text-sm", children: [`A x = ${formatNumber(h.x)} la funció no existeix: la gràfica hi té un forat al punt `, /* @__PURE__ */ jsx("span", { className: "font-mono", children: formatPoint(h) }), "."] }, i)) }, "holes"),
      /* @__PURE__ */ jsx(Explanation, { text: a.explanation, themeClasses }, "exp")
    ];
  } else if (a.kind === "equationX") {
    body = [
      ...facts,
      /* @__PURE__ */ jsx(Row, { label: a.solutions.length === 1 ? "Solució" : "Solucions", themeClasses, children: a.identity ? "Qualsevol nombre és solució (identitat)." : a.solutions.length ? /* @__PURE__ */ jsx(RootList, { roots: a.solutions, exact: a.exactRoots, periodic: a.periodic, themeClasses, color: func.color, label: (x, i) => `${rootName(a.solutions.length, i)} = ${formatNumber(x)}` }) : "No té cap solució real." }, "sol"),
      /* @__PURE__ */ jsx(Explanation, { text: a.explanation, themeClasses }, "exp"),
      /* @__PURE__ */ jsx("p", { className: `text-xs mt-2 ${themeClasses.secondaryText}`, children: "A la gràfica es dibuixa y = (primer membre − segon membre). Les solucions són els punts on aquesta corba talla l'eix X." }, "aux")
    ];
  } else if (a.kind === "inequalityX") {
    body = [
      /* @__PURE__ */ jsx(Row, { label: "Solució", themeClasses, children: /* @__PURE__ */ jsx("span", { className: "font-mono", children: a.solutionText }) }, "sol"),
      a.solutions.length > 0 && /* @__PURE__ */ jsx(Row, { label: "Valors frontera", themeClasses, children: a.solutions.map((x) => formatNumber(x)).join(",  ") }, "b"),
      /* @__PURE__ */ jsx(Explanation, { text: a.explanation, themeClasses }, "exp"),
      /* @__PURE__ */ jsx("p", { className: `text-xs mt-2 ${themeClasses.secondaryText}`, children: "La franja pintada i el tram gruixut sobre l'eix X indiquen els valors de x que compleixen la inequació. Punt ple: inclòs; punt buit: no inclòs." }, "aux")
    ];
  } else {
    body = facts.length ? facts : [/* @__PURE__ */ jsx("p", { children: "Expressió representada correctament." }, "ok")];
  }
  return /* @__PURE__ */ jsx("div", { className: box, children: body });
};
const FunctionItem = ({ func, onEdit, onDelete, onToggleVisibility, onUpdateColor, onToggleMark, themeClasses }) => {
  const [colorTarget, setColorTarget] = useState(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const handleColorSelect = (color) => {
    onUpdateColor(func.id, color, colorTarget);
    setColorTarget(null);
  };
  const isSystem = func.type === "system";
  const summary = solutionSummary(func);
  const colorDot = (index) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => setColorTarget(colorTarget === index ? null : index),
      className: "w-5 h-5 rounded-full border-2 border-white flex-shrink-0",
      style: { backgroundColor: getExpressionColor(func, index), boxShadow: "0 0 0 1px rgba(0,0,0,0.25)" },
      title: "Canvia el color",
      "aria-label": "Canvia el color"
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg border ${themeClasses.border} ${themeClasses.buttonBg} transition-all duration-200 ${func.isVisible ? "" : "opacity-60"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => onToggleVisibility(func.id), className: "flex-shrink-0", "aria-label": func.isVisible ? "Amaga" : "Mostra", title: func.isVisible ? "Amaga" : "Mostra", children: /* @__PURE__ */ jsx("i", { className: `fa-solid text-xl ${func.isVisible ? "fa-eye text-green-500" : "fa-eye-slash text-slate-400"}` }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setIsAnalysisOpen(!isAnalysisOpen), className: "flex-shrink-0", "aria-label": "Informació", title: "Informació", children: /* @__PURE__ */ jsx("i", { className: `fa-solid fa-circle-info text-xl ${isAnalysisOpen ? "text-blue-500" : themeClasses.secondaryText}` }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 text-lg flex items-center overflow-x-auto overflow-y-hidden", children: [
          isSystem && /* @__PURE__ */ jsx("span", { className: "text-4xl font-thin mr-2 leading-none", children: "{" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1", children: func.expressions.map((expr, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            isSystem && colorDot(index),
            /* @__PURE__ */ jsx(MathExpression, { expression: expr, color: isSystem ? getExpressionColor(func, index) : void 0 })
          ] }, index)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
        !isSystem && colorDot(0),
        /* @__PURE__ */ jsx("button", { onClick: () => onEdit(func), className: `p-2 w-8 h-8 rounded ${themeClasses.buttonHover}`, "aria-label": "Edita", title: "Edita", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-pencil" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(func.id), className: "p-2 w-8 h-8 rounded text-red-500 hover:bg-red-500 hover:text-white", "aria-label": "Elimina", title: "Elimina", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-trash" }) })
      ] })
    ] }),
    summary && /* @__PURE__ */ jsxs("div", { className: `mt-2 ml-9 text-sm font-semibold font-mono px-2 py-1 rounded-md inline-flex items-center gap-2 ${themeClasses.bg}`, children: [
      /* @__PURE__ */ jsx("i", { className: "fa-solid fa-bullseye text-xs opacity-70" }),
      summary
    ] }),
    func.domainRestriction && func.type !== "system" && /* @__PURE__ */ jsx("div", { className: `mt-2 ml-9 text-xs font-mono px-2 py-1 rounded-md inline-block ${themeClasses.bg} ${themeClasses.secondaryText}`, children: `Domini: ${formatDomainString(func.domainRestriction)}` }),
    colorTarget !== null && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(ColorPicker, { selectedColor: getExpressionColor(func, colorTarget), onSelect: handleColorSelect, themeClasses }) }),
    isAnalysisOpen && /* @__PURE__ */ jsx(AnalysisPanel, { func, themeClasses, onToggleMark })
  ] });
};
const SidePanel = ({
  isOpen,
  functions,
  onEdit,
  onDelete,
  onToggleVisibility,
  onUpdateColor,
  onToggleMark,
  onClose,
  paramNames = [],
  params = {},
  onParamChange,
  animating,
  onToggleAnimation,
  theme
}) => {
  const themeClasses = THEMES[theme];
  return /* @__PURE__ */ jsx(
    "aside",
    {
      className: `absolute md:relative top-0 right-0 h-full w-full max-w-sm transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? "translate-x-0" : "translate-x-full"} ${themeClasses.sidePanelBg} border-l ${themeClasses.border}`,
      children: /* @__PURE__ */ jsxs("div", { className: "p-4 h-full flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 pb-2 border-b-4", style: { borderColor: themeClasses.accent }, children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Funcions i sistemes" }),
          onClose && /* @__PURE__ */ jsx("button", { onClick: onClose, className: `md:hidden w-9 h-9 rounded-full ${themeClasses.buttonHover}`, "aria-label": "Tanca el panell", children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-times" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-grow flex flex-col min-h-0", children: [
          /* @__PURE__ */ jsx(ParametersPanel, { names: paramNames, params, onChange: onParamChange, animating, onToggleAnimation, themeClasses }),
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
              onToggleMark,
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
