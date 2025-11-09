import React, { useState, useMemo } from 'react';
import { MovementType, Problem } from '../types';
import { PROBLEMS } from '../services/problems';

interface ProblemSelectorProps {
    onLoadProblem: (problem: Problem) => void;
}

export const ProblemSelector: React.FC<ProblemSelectorProps> = ({ onLoadProblem }) => {
    const [numMobilesFilter, setNumMobilesFilter] = useState<string>('any');
    const [selectedTypes, setSelectedTypes] = useState<MovementType[]>([]);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

    const handleTypeChange = (type: MovementType) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    const filteredProblems = useMemo(() => {
        return PROBLEMS.filter(p => {
            const numMatch = numMobilesFilter === 'any' || p.numMobiles === parseInt(numMobilesFilter, 10);
            const typeMatch = selectedTypes.length === 0 || selectedTypes.every(st => p.tags.includes(st));
            return numMatch && typeMatch;
        });
    }, [numMobilesFilter, selectedTypes]);

    const handleNewProblem = () => {
        if (filteredProblems.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredProblems.length);
            setCurrentProblem(filteredProblems[randomIndex]);
        } else {
            setCurrentProblem(null);
            alert("No s'han trobat problemes amb aquests filtres.");
        }
    };

    return (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-4 h-full flex flex-col">
            <h3 className="text-lg font-bold text-sky-700 border-b-2 border-gray-200 pb-1">Cercador de problemes</h3>
            
            <div className="space-y-3">
                <div>
                    <label htmlFor="numMobilesFilter" className="block text-sm font-medium text-gray-700">Nombre de mòbils</label>
                    <select
                        id="numMobilesFilter"
                        value={numMobilesFilter}
                        onChange={(e) => setNumMobilesFilter(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
                    >
                        <option value="any">Qualsevol</option>
                        <option value="1">1 Mòbil</option>
                        <option value="2">2 Mòbils</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipus de moviment (combinats)</label>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.values(MovementType).map(type => (
                            <div key={type} className="flex items-center">
                                <input
                                    id={`type-${type}`}
                                    type="checkbox"
                                    checked={selectedTypes.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                />
                                <label htmlFor={`type-${type}`} className="ml-2 block text-sm text-gray-900">{type}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleNewProblem}
                className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300"
            >
                Nou problema
            </button>

            {currentProblem && (
                <div className="flex-grow flex flex-col justify-between bg-white border border-gray-200 rounded-md p-3 min-h-[150px]">
                    <div>
                        <h4 className="font-semibold text-gray-800">Enunciat:</h4>
                        <p className="text-sm text-gray-600 mt-1">{currentProblem.statement}</p>
                    </div>
                    <button
                        onClick={() => onLoadProblem(currentProblem)}
                        className="w-full mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                    >
                        Carrega el problema
                    </button>
                </div>
            )}
        </div>
    );
};