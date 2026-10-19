import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { THEMES } from "../constants.js";
const Y_SCALES = [0.01, 0.1, 0.2, 0.5, 1, 2, 5, 10];
const formatScale = (v) => String(v).replace(".", ",");
// Menú per mostrar o amagar elements de la gràfica i canviar l'escala de l'eix Y
const ViewMenu = ({ theme, viewConfig, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const themeClasses = THEMES[theme];
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);
  const toggle = (key, label) => /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${themeClasses.buttonHover}`, children: [
    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: viewConfig[key] !== false, onChange: (e) => onChange({ [key]: e.target.checked }), style: { accentColor: themeClasses.accent } }),
    label
  ] });
  const yScale = viewConfig.yScale || 1;
  const options = Y_SCALES.includes(yScale) ? Y_SCALES : [...Y_SCALES, yScale].sort((a, b) => a - b);
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setOpen(!open),
        className: `p-2 w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 ${themeClasses.buttonBg} ${themeClasses.buttonHover}`,
        "aria-label": "Opcions de vista",
        "aria-expanded": open,
        title: "Vista",
        children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-sliders" })
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: `absolute right-0 mt-2 w-60 p-2 rounded-lg shadow-xl border z-40 text-sm ${themeClasses.border} ${themeClasses.sidePanelBg} ${themeClasses.text}`, children: [
      /* @__PURE__ */ jsx("p", { className: `px-2 pb-1 text-xs font-semibold uppercase tracking-wide ${themeClasses.secondaryText}`, children: "Mostra" }),
      toggle("grid", "Quadrícula"),
      toggle("labels", "Nombres dels eixos"),
      toggle("points", "Etiquetes dels punts"),
      /* @__PURE__ */ jsx("p", { className: `px-2 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide border-t mt-1 ${themeClasses.border} ${themeClasses.secondaryText}`, children: "Escala de l'eix Y" }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 px-2", children: options.map((v) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onChange({ yScale: v }),
          className: `px-2 py-0.5 rounded-full border text-xs ${themeClasses.border} ${v === yScale ? themeClasses.accentButtonClasses : themeClasses.buttonHover}`,
          children: ["×", formatScale(v)]
        },
        v
      )) }),
      /* @__PURE__ */ jsx("p", { className: `px-2 pt-1 text-xs ${themeClasses.secondaryText}`, children: "×10: cada unitat de l'eix Y ocupa 10 vegades més. ×0,1: útil per a funcions que creixen molt, com y = 100x." })
    ] })
  ] });
};
export {
  ViewMenu
};
