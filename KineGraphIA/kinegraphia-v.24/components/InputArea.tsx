
import React from 'react';

interface InputAreaProps {
    problemStatement: string;
    setProblemStatement: (value: string) => void;
    onAnalyze: () => void;
    isLoading: boolean;
    cooldown: number;
}

export const InputArea: React.FC<InputAreaProps> = ({ problemStatement, setProblemStatement, onAnalyze, isLoading, cooldown }) => {
    const isDisabled = isLoading || cooldown > 0;

    const getButtonText = () => {
        if (isLoading) return 'Analitzant...';
        if (cooldown > 0) return `Espera ${cooldown}s...`;
        return 'Analitza amb IA';
    };

    return (
        <div className="flex flex-col space-y-4">
            <label htmlFor="problem-statement" className="text-lg font-semibold text-gray-700">
                Enunciat del problema
            </label>
            <textarea
                id="problem-statement"
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0C7B93] focus:border-transparent transition duration-300"
                placeholder="Escriu aquí l'enunciat del problema..."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                disabled={isLoading}
            />
            <button
                onClick={onAnalyze}
                disabled={isDisabled}
                className="w-full md:w-auto self-end bg-[#0C7B93] text-white font-bold py-2 px-6 rounded-lg hover:bg-[#085a6e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C7B93] disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 duration-300 flex items-center justify-center space-x-2"
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                <span>{getButtonText()}</span>
            </button>
        </div>
    );
};
