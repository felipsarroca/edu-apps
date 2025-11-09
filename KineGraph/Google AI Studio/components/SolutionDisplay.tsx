
import React from 'react';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface SolutionDisplayProps {
    solution: string | null;
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
    if (!solution) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 pb-2 border-b-2 border-gray-200 flex items-center space-x-2">
                <BrainCircuitIcon className="w-6 h-6 text-sky-600" />
                <span>Solució del Problema</span>
            </h2>
            <div className="prose prose-sm max-w-none mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: solution }} />
        </div>
    );
};
