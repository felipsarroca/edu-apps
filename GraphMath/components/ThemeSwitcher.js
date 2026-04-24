import { jsx } from "react/jsx-runtime";
import { THEMES } from "../constants.js";
const themeIcons = {
  light: "fa-sun",
  dark: "fa-moon",
  chalkboard: "fa-chalkboard-user",
  "high-contrast": "fa-circle-half-stroke"
};
const ThemeSwitcher = ({ theme, setTheme }) => {
  const themeConfig = THEMES[theme];
  const cycleTheme = () => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick: cycleTheme,
      className: `p-2 w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 ${themeConfig.buttonBg} ${themeConfig.buttonHover}`,
      "aria-label": "Change theme",
      children: /* @__PURE__ */ jsx("i", { className: `fa-solid ${themeIcons[theme]}` })
    }
  );
};
export {
  ThemeSwitcher
};
