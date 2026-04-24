import { jsx, jsxs } from "react/jsx-runtime";
import { ThemeSwitcher } from "./ThemeSwitcher.js";
import { THEMES } from "../constants.js";
const Header = ({ theme, setTheme, onAddClick, onToggleSidePanel, isSidePanelOpen, onInfoClick, onDownloadClick }) => {
  const themeClasses = THEMES[theme];
  return /* @__PURE__ */ jsxs("header", { className: `flex items-center justify-between p-3 border-b ${themeClasses.border} ${themeClasses.headerBg} flex-shrink-0 z-10`, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onToggleSidePanel,
          className: `p-3 w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${themeClasses.buttonBg} ${themeClasses.buttonHover}`,
          "aria-label": isSidePanelOpen ? "Close side panel" : "Open side panel",
          children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${isSidePanelOpen ? "fa-chevron-left" : "fa-bars"}` })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("i", { className: `fa-solid fa-chart-line text-5xl drop-shadow-lg`, style: { color: themeClasses.accent } }),
        /* @__PURE__ */ jsx("h1", { className: `text-4xl font-bold font-serif hidden sm:block bg-clip-text text-transparent bg-gradient-to-r ${themeClasses.headerGradient}`, children: "Graficadora de funcions" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onAddClick,
          className: `p-3 px-5 rounded-full shadow-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:-translate-y-px flex items-center gap-2 ${themeClasses.accentButtonClasses}`,
          children: [
            /* @__PURE__ */ jsx("i", { className: "fa-solid fa-plus" }),
            /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Afegir" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onDownloadClick,
          className: `p-3 w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${themeClasses.buttonBg} ${themeClasses.buttonHover}`,
          "aria-label": "Download graph as image",
          children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-floppy-disk text-2xl", style: { color: themeClasses.accent } })
        }
      ),
      /* @__PURE__ */ jsx(ThemeSwitcher, { theme, setTheme }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onInfoClick,
          className: `p-3 w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${themeClasses.buttonBg} ${themeClasses.buttonHover}`,
          "aria-label": "Show application information",
          children: /* @__PURE__ */ jsx("i", { className: "fa-solid fa-circle-info text-xl" })
        }
      )
    ] })
  ] });
};
export {
  Header
};
