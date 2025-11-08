
import React from 'react';

interface SolutionDisplayProps {
    explanation: string | null;
}

const parseAndHighlightSolution = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by text surrounded by **
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={index} className="font-bold text-[#10B981]">
                    {part.substring(2, part.length - 2)}
                </strong>
            );
        }
        return part;
    });
};

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ explanation }) => {
    
    if (!explanation) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 pb-2 mb-4 border-b-2 border-gray-200">
                Solució del Problema
            </h2>
            <p className="text-gray-700 text-lg text-left">
                {parseAndHighlightSolution(explanation)}
            </p>
        </div>
    );
};
