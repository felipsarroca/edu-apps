
import React from 'react';
import type { Theme } from '../types';
import { THEMES } from '../constants';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const themeIcons: Record<Theme, string> = {
  light: 'fa-sun',
  dark: 'fa-moon',
  chalkboard: 'fa-chalkboard-user',
  'high-contrast': 'fa-circle-half-stroke',
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const themeConfig = THEMES[theme];

  const cycleTheme = () => {
    const themeKeys = Object.keys(THEMES) as Theme[];
    const currentIndex = themeKeys.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className={`p-2 w-10 h-10 flex items-center justify-center rounded-lg shadow-md transition-all duration-300 ${themeConfig.buttonBg} ${themeConfig.buttonHover}`}
      aria-label="Change theme"
    >
      <i className={`fa-solid ${themeIcons[theme]}`}></i>
    </button>
  );
};
