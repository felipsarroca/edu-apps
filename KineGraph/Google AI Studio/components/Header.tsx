
import React from 'react';
import { PhysicsGraphIcon } from './icons/PhysicsGraphIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';

interface HeaderProps {
    onShowHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHelp }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 text-[#0C7B93]">
                       <PhysicsGraphIcon />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#0C7B93]">
                            KineGraph
                        </h1>
                        <p className="text-sm text-gray-500 hidden md:block">
                           Visualitza i resol problemes de cinemàtica.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onShowHelp}
                    className="flex items-center space-x-2 bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold py-2 px-5 rounded-full hover:from-sky-600 hover:to-sky-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-sky-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    title="Mostra les instruccions d'ús"
                >
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                    <span className="hidden md:inline">Instruccions</span>
                </button>
            </div>
        </header>
    );
};
