import React from 'react';
import { XIcon } from './icons/XIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface HelpModalProps {
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label="Tanca les instruccions"
                >
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-sky-700 mb-4">Instruccions d'ús</h2>
                <p className="text-gray-600 mb-6">
                    Aquesta aplicació té dues maneres principals d'utilitzar-se. Tria la que millor s'adapti a les teves necessitats:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Manual Configuration */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <CalculatorIcon className="w-8 h-8 text-sky-600 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-gray-800">1. Configuració manual</h3>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li><strong>Utilitza el panell esquerre</strong> per crear el teu propi problema.</li>
                            <li><strong>Afegeix els mòbils</strong> que necessitis (fins a 3).</li>
                            <li><strong>Omple les dades</strong> conegudes per a cada fase del moviment.</li>
                            <li><strong>Prem "Calcular"</strong> per resoldre les incògnites i veure els resultats.</li>
                             <li><strong>Prem "Reiniciar"</strong> per començar de nou.</li>
                        </ol>
                    </div>

                    {/* Problem Finder */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                         <div className="flex items-center space-x-3 mb-3">
                            <BrainCircuitIcon className="w-8 h-8 text-sky-600 flex-shrink-0" />
                            <h3 className="text-lg font-semibold text-gray-800">2. Cercador de problemes</h3>
                        </div>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                           <li><strong>Utilitza el panell dret</strong> per explorar problemes.</li>
                            <li><strong>Filtra</strong> per nombre de mòbils o tipus de moviment.</li>
                            <li><strong>Fes clic a "Nou problema"</strong> per generar un enunciat a l'atzar.</li>
                            <li><strong>Prem "Carrega el problema"</strong> per veure'l resolt a l'instant.</li>
                        </ol>
                    </div>
                </div>
                 <div className="mt-6 text-center">
                    <button 
                        onClick={onClose}
                        className="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300"
                    >
                        Entès!
                    </button>
                </div>
                <style>{`
                    @keyframes fade-in {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in {
                        animation: fade-in 0.2s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};