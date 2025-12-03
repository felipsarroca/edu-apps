import React from 'react';
import { PhysicsGraphIcon } from './icons/PhysicsGraphIcon';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 text-[#0C7B93]">
                       <PhysicsGraphIcon />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#0C7B93]">
                            KineGraph<span className="text-[#10B981]">IA</span>
                        </h1>
                        <p className="text-sm text-gray-500 hidden md:block">
                            La cinemàtica, explicada per la intel·ligència artificial.
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};
