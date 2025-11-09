
import React from 'react';
import { Mobile } from '../types';
import { get2DInstantaneousPosition, getInstantaneousKinematics } from '../services/physicsService';
import { COLORS } from '../constants';
import { TargetIcon } from './icons/TargetIcon';
import { GaugeIcon } from './icons/GaugeIcon';
import { RocketIcon } from './icons/RocketIcon';

interface ResultsDisplayProps {
    mobiles: Mobile[];
    animationTime: number;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ mobiles, animationTime }) => {
    return (
        <div className="space-y-6">
             <h2 className="text-xl font-bold text-gray-800 pb-2 border-b-2 border-gray-200">Resultats numèrics</h2>
            {mobiles.map((mobile, index) => {
                const { x, y } = get2DInstantaneousPosition(mobile, animationTime);
                const { v, a } = getInstantaneousKinematics(mobile, animationTime);
                const color = COLORS[index % COLORS.length];
                
                return (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: color }}>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold" style={{ color: color }}>{mobile.nom}</h3>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg">
                             <h4 className="font-semibold text-gray-600 text-sm mb-2">Valors en temps real (t = {animationTime.toFixed(1)}s)</h4>
                             <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <TargetIcon className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>Posició (x,y): <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded">({x.toFixed(2)}, {y.toFixed(2)}) m</span></span>
                                </div>
                                 <div className="flex items-center">
                                    <GaugeIcon className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>Velocitat: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded">{v.toFixed(2)} m/s</span></span>
                                </div>
                                <div className="flex items-center">
                                    <RocketIcon className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>Acceleració: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded">{a.toFixed(2)} m/s²</span></span>
                                </div>
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};