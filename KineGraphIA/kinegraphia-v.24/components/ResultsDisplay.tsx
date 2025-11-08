
import React, { useMemo } from 'react';
import { Mobile, MovementType, KeyPoints } from '../types';
import { calculateInstantaneousValues, calculateKeyMovementPoints } from '../services/physicsService';
import { COLORS } from '../constants';
import { TargetIcon } from './icons/TargetIcon';
import { GaugeIcon } from './icons/GaugeIcon';
import { RocketIcon } from './icons/RocketIcon';
import { ClockIcon } from './icons/ClockIcon';
import { AngleIcon } from './icons/AngleIcon';
import { ArrowUpCircleIcon } from './icons/ArrowUpCircleIcon';
import { ArrowDownCircleIcon } from './icons/ArrowDownCircleIcon';
import { ZapIcon } from './icons/ZapIcon';

interface ResultsDisplayProps {
    mobiles: Mobile[];
    animationTime: number;
}

interface ParameterItemProps {
    label: string;
    value: string;
    unit: string;
    isExplicit?: boolean;
    icon: React.ReactNode;
    highlightColor?: string;
}

const ParameterItem: React.FC<ParameterItemProps> = ({ label, value, unit, isExplicit, icon, highlightColor }) => {
    const valueClasses = isExplicit ? "font-bold" : "text-gray-700";
    
    return (
        <li className="flex items-center">
            {icon}
            <span>{label}:</span>
            <span 
                className={`ml-auto ${valueClasses}`}
                style={isExplicit ? { color: highlightColor } : {}}
            >
                {value} {unit}
            </span>
        </li>
    );
};

const getEquation = (mobile: Mobile, type: 's' | 'v'): string => {
    const { s0, v0, a, tipus } = mobile;
    const g = 9.8;
    const finalA = (tipus === MovementType.CaigudaLliure || tipus === MovementType.TirVertical || tipus === MovementType.TirParabolic) ? -g : a;

    if (type === 's') {
        let equation = `${s0}`;
        if (v0 !== 0) equation += v0 > 0 ? ` + ${v0}t` : ` - ${Math.abs(v0)}t`;
        if (finalA !== 0) {
            const term = 0.5 * finalA;
            equation += term > 0 ? ` + ${term}t²` : ` - ${Math.abs(term)}t²`;
        }
        return `s(t) = ${equation}`;
    } else { // 'v'
        let equation = `${v0}`;
        if (finalA !== 0) {
            equation += finalA > 0 ? ` + ${finalA}t` : ` - ${Math.abs(finalA)}t`;
        }
        return `v(t) = ${equation}`;
    }
}

const KeyPointsDisplay: React.FC<{ mobile: Mobile }> = ({ mobile }) => {
    const keyPoints = useMemo(() => calculateKeyMovementPoints(mobile), [mobile]);

    if (Object.keys(keyPoints).length === 0) return null;

    return (
        <div className="mt-4">
            <h4 className="font-semibold text-gray-600 text-sm mb-2">Punts Clau del Moviment</h4>
            <ul className="space-y-2 text-sm text-gray-700">
                {keyPoints.apexTime !== undefined && keyPoints.maxHeight !== undefined && (
                    <>
                        <ParameterItem 
                            label="Temps a l'altura màxima"
                            value={keyPoints.apexTime.toFixed(2)} 
                            unit="s" 
                            icon={<ClockIcon className="w-4 h-4 mr-2 text-gray-500" />}
                        />
                         <ParameterItem 
                            label="Altura màxima"
                            value={keyPoints.maxHeight.toFixed(2)} 
                            unit="m" 
                            icon={<ArrowUpCircleIcon className="w-4 h-4 mr-2 text-gray-500" />}
                        />
                    </>
                )}
                {keyPoints.impactTime !== undefined && keyPoints.impactVelocity !== undefined && (
                    <>
                        <ParameterItem 
                            label="Temps d'impacte"
                            value={keyPoints.impactTime.toFixed(2)} 
                            unit="s" 
                            icon={<ClockIcon className="w-4 h-4 mr-2 text-gray-500" />}
                        />
                         <ParameterItem 
                            label="Velocitat d'impacte"
                            value={keyPoints.impactVelocity.toFixed(2)} 
                            unit="m/s" 
                            icon={<ArrowDownCircleIcon className="w-4 h-4 mr-2 text-gray-500" />}
                        />
                    </>
                )}
            </ul>
        </div>
    );
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ mobiles, animationTime }) => {
    const collisionEvents = useMemo(() => {
        const events: { time: number; position: number; mobiles: string[] }[] = [];
        const stopTimeMap = new Map<number, Mobile[]>();
        
        mobiles.forEach(m => {
            if (m.stopTime) {
                const time = parseFloat(m.stopTime.toPrecision(4));
                if (!stopTimeMap.has(time)) {
                    stopTimeMap.set(time, []);
                }
                stopTimeMap.get(time)!.push(m);
            }
        });

        for (const [time, collidedMobiles] of stopTimeMap.entries()) {
            if (collidedMobiles.length > 1) {
                const { s } = calculateInstantaneousValues(collidedMobiles[0], time);
                events.push({ time, position: s, mobiles: collidedMobiles.map(m => m.nom) });
            }
        }
        return events;
    }, [mobiles]);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 pb-2 border-b-2 border-gray-200">Resultats numèrics</h2>
            
            {collisionEvents.map((event, i) => (
                <div key={i} className="bg-amber-50 p-4 rounded-lg shadow-md border-l-4 border-amber-400">
                    <div className="flex items-center mb-2">
                        <ZapIcon className="w-6 h-6 mr-3 text-amber-600" />
                        <h3 className="text-lg font-semibold text-amber-800">Punt de Trobada / Col·lisió</h3>
                    </div>
                    <p className="text-sm text-amber-700 font-medium">{event.mobiles.join(' i ')}</p>
                    <div className="mt-2 space-y-1 text-sm">
                        <div className="flex items-center"><ClockIcon className="w-4 h-4 mr-2 text-gray-500"/> Temps: <span className="ml-auto font-mono bg-amber-200 px-1.5 py-0.5 rounded">{event.time.toFixed(2)} s</span></div>
                        <div className="flex items-center"><TargetIcon className="w-4 h-4 mr-2 text-gray-500"/> Posició: <span className="ml-auto font-mono bg-amber-200 px-1.5 py-0.5 rounded">{event.position.toFixed(2)} m</span></div>
                    </div>
                </div>
            ))}

            {mobiles.map((mobile, index) => {
                const { s, v } = calculateInstantaneousValues(mobile, animationTime);
                const color = COLORS[index % COLORS.length];
                const isParabolic = mobile.tipus === MovementType.TirParabolic;

                return (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md border-l-4" style={{ borderColor: color }}>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold" style={{ color: color }}>{mobile.nom}</h3>
                            <p className="text-sm text-gray-500">{mobile.tipus}</p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg mb-4">
                             <h4 className="font-semibold text-gray-600 text-sm mb-2">Valors en temps real (t = {animationTime.toFixed(1)}s)</h4>
                             <div className="space-y-2 text-sm">
                                <div className="flex items-center">
                                    <TargetIcon className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>Posició: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded">{s.toFixed(2)} m</span></span>
                                </div>
                                 <div className="flex items-center">
                                    <GaugeIcon className="w-4 h-4 mr-2 text-gray-500" />
                                    <span>Velocitat: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded">{v.toFixed(2)} m/s</span></span>
                                </div>
                             </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-600 text-sm mb-2">Paràmetres inicials</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <ParameterItem 
                                    label={isParabolic ? "Posició inicial Y (s₀)" : "Posició inicial (s₀)"}
                                    value={mobile.s0.toString()} 
                                    unit="m" 
                                    isExplicit={!!mobile.s0_explicit}
                                    icon={<TargetIcon className="w-4 h-4 mr-2 text-gray-500" />}
                                    highlightColor={color}
                                />
                                 <ParameterItem 
                                    label={isParabolic ? "Velocitat inicial Y (v₀y)" : "Velocitat inicial (v₀)"}
                                    value={mobile.v0.toString()} 
                                    unit="m/s" 
                                    isExplicit={!!mobile.v0_explicit}
                                    icon={<GaugeIcon className="w-4 h-4 mr-2 text-gray-500" />}
                                    highlightColor={color}
                                />
                                {isParabolic && (
                                    <>
                                        <ParameterItem 
                                            label="Velocitat inicial X (v₀x)"
                                            value={(mobile.vx0 ?? 0).toString()} 
                                            unit="m/s" 
                                            isExplicit={!!mobile.vx0_explicit}
                                            icon={<GaugeIcon className="w-4 h-4 mr-2 text-gray-500" />}
                                            highlightColor={color}
                                        />
                                        <ParameterItem 
                                            label="Angle de llançament (θ)"
                                            value={(mobile.angle ?? 0).toFixed(2)} 
                                            unit="°" 
                                            isExplicit={!!mobile.angle_explicit}
                                            icon={<AngleIcon className="w-4 h-4 mr-2 text-gray-500" />}
                                            highlightColor={color}
                                        />
                                    </>
                                )}
                                <ParameterItem 
                                    label="Acceleració (a)" 
                                    value={mobile.a.toString()} 
                                    unit="m/s²" 
                                    isExplicit={!!mobile.a_explicit}
                                    icon={<RocketIcon className="w-4 h-4 mr-2 text-gray-500" />}
                                    highlightColor={color}
                                />
                                <ParameterItem 
                                    label="Durada (t)" 
                                    value={mobile.t.toString()} 
                                    unit="s" 
                                    isExplicit={!!mobile.t_explicit}
                                    icon={<ClockIcon className="w-4 h-4 mr-2 text-gray-500" />}
                                    highlightColor={color}
                                />
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-600 text-sm mb-2">Equacions del moviment</h4>
                             <div className="space-y-1 text-sm font-mono text-gray-800 bg-slate-100 p-2 rounded">
                                 <p>{getEquation(mobile, 's')}</p>
                                 <p>{getEquation(mobile, 'v')}</p>
                             </div>
                        </div>
                        <KeyPointsDisplay mobile={mobile} />
                    </div>
                );
            })}
        </div>
    );
};
