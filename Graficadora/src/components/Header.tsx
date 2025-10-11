import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import type { Theme } from '../types';
import { THEMES } from '../constants';

interface HeaderProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onAddClick: () => void;
    onToggleSidePanel: () => void;
    isSidePanelOpen: boolean;
    onInfoClick: () => void;
    onDownloadClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, onAddClick, onToggleSidePanel, isSidePanelOpen, onInfoClick, onDownloadClick }) => {
    const themeClasses = THEMES[theme];

    return (
        <header className={`flex items-center justify-between p-3 border-b ${themeClasses.border} ${themeClasses.headerBg} flex-shrink-0 z-10`}>
            <div className="flex items-center gap-4">
                 <button
                    onClick={onToggleSidePanel}
                    className={`p-3 w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${themeClasses.buttonBg} ${themeClasses.buttonHover}`}
                    aria-label={isSidePanelOpen ? "Close side panel" : "Open side panel"}
                >
                    <i className={`fa-solid ${isSidePanelOpen ? 'fa-chevron-left' : 'fa-bars'}`}></i>
                </button>
                <div className="flex items-center gap-4">
                    <i className={`fa-solid fa-chart-line text-5xl drop-shadow-lg`} style={{color: themeClasses.accent}}></i>
                    <h1 className={`text-4xl font-bold font-serif hidden sm:block bg-clip-text text-transparent bg-gradient-to-r ${themeClasses.headerGradient}`}>
                        Graficadora de funcions
                    </h1>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button
                    onClick={onAddClick}
                    className={`p-3 px-5 rounded-full shadow-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:-translate-y-px flex items-center gap-2 ${themeClasses.accentButtonClasses}`}
                >
                    <i className="fa-solid fa-plus"></i>
                    <span className="hidden md:inline">Afegir</span>
                </button>
                <button
                    onClick={onDownloadClick}
                    className={`p-3 w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${themeClasses.buttonBg} ${themeClasses.buttonHover}`}
                    aria-label="Download graph as image"
                >
                    <i className="fa-solid fa-floppy-disk text-2xl" style={{ color: themeClasses.accent }}></i>
                </button>
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
                 <button
                    onClick={onInfoClick}
                    className={`p-3 w-12 h-12 rounded-full shadow-md transition-all duration-300 flex items-center justify-center ${themeClasses.buttonBg} ${themeClasses.buttonHover}`}
                    aria-label="Show application information"
                >
                    <i className="fa-solid fa-circle-info text-xl"></i>
                </button>
            </div>
        </header>
    );
};