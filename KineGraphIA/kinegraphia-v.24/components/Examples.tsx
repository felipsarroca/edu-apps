import React from 'react';
import { Example } from '../types';
import { EXAMPLES_BY_CATEGORY } from '../constants';

interface ExamplesProps {
    onLoadExample: (example: Example) => void;
}

const CATEGORIES = [
    { key: 'UN_MOBIL', label: '🚗 Un mòbil (MRU/MRUA)', examples: EXAMPLES_BY_CATEGORY.UN_MOBIL },
    { key: 'DOS_MOBILS', label: '🚆 Dos mòbils (Trobada/Persecució)', examples: EXAMPLES_BY_CATEGORY.DOS_MOBILS },
    { key: 'CAIGUDA_LLIURE', label: '🍎 Caiguda Lliure / Tir Vertical', examples: EXAMPLES_BY_CATEGORY.CAIGUDA_LLIURE },
    { key: 'TIR_PARABOLIC', label: '☄️ Tir Parabòlic', examples: EXAMPLES_BY_CATEGORY.TIR_PARABOLIC }
];

export const Examples: React.FC<ExamplesProps> = ({ onLoadExample }) => {
    
    const handleLoadRandomExample = (examples: Example[]) => {
        if (examples.length === 0) return;
        const randomIndex = Math.floor(Math.random() * examples.length);
        onLoadExample(examples[randomIndex]);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-700 mb-2">O prova un exemple</h3>
            <div className="flex flex-col space-y-2">
                {CATEGORIES.map(category => (
                    <button 
                        key={category.key}
                        onClick={() => handleLoadRandomExample(category.examples)} 
                        className="w-full text-left bg-white p-2 border rounded-md hover:bg-gray-100 transition-colors duration-200 text-sm"
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
