import React from 'react';
import { Mobile, MovementPhase, MovementType, Problem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { RefreshCwIcon } from './icons/RefreshCwIcon';
import { ProblemSelector } from './ProblemSelector';
import { COLORS } from '../constants';

// This component correctly handles user input for numbers.
const KinematicInput: React.FC<{
    label: string;
    unit: string;
    value: number | undefined;
    onChange: (val: number | undefined) => void;
    hasError?: boolean;
    disabled?: boolean;
    isBold?: boolean; 
}> = ({ label, unit, value, onChange, hasError = false, disabled = false, isBold = false }) => {
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        const formattedValue = value !== undefined && isFinite(value) ? value.toFixed(2).replace(/\.00$/, '') : '';
        // Only update if the new formatted value is different from the current input
        // and the input is not currently focused. This avoids cursor jumps during editing.
        if (document.activeElement?.ariaLabel !== label) {
             setInputValue(formattedValue);
        }
    }, [value, label]);
    
    const handleBlur = () => {
        const num = parseFloat(inputValue);
        const isNumValid = !isNaN(num) && isFinite(num);
        const isValueDef = value !== undefined && value !== null && isFinite(value);

        if (inputValue.trim() === '' || !isNumValid) {
            // If input is empty/invalid, clear the value if it exists
            if (isValueDef) {
                onChange(undefined);
            }
        } else { // Input is a valid number
            // If there was no value before, or the new number is different
            if (!isValueDef || Math.abs(num - value) > 1e-9) {
                onChange(num);
            } else {
                // If numeric value is the same but formatting differs, reset to formatted value.
                const formattedValue = num.toFixed(2).replace(/\.00$/, '');
                if (inputValue !== formattedValue) {
                    setInputValue(formattedValue);
                }
            }
        }
    };

    let inputClass = "text-gray-800 bg-white";
    if (disabled) inputClass = "text-gray-500 bg-gray-100 cursor-not-allowed font-medium";
    if (hasError) inputClass += " ring-2 ring-red-500 border-transparent";
    if (isBold && !disabled) inputClass += " font-bold";

    return (
        <div className="flex-1 min-w-[100px]">
            <label className="block text-[11px] font-medium text-gray-500">{label}</label>
            <div className="relative mt-0.5">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                    className={`w-full p-1.5 border rounded-md text-sm ${inputClass} border-gray-300 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 pr-9`}
                    aria-label={label}
                    disabled={disabled}
                />
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <span className="text-gray-400 text-xs">{unit}</span>
                </div>
            </div>
        </div>
    );
};


const mapInheritedStateToPhaseInputs = (
    inheritedState: { t: number; x: number; y: number; vx: number; vy: number; },
    newType: MovementType
): Partial<MovementPhase> => {
    const initialValues: Partial<MovementPhase> = { t_i: inheritedState.t };

    switch (newType) {
        case MovementType.MRU:
        case MovementType.MRUA:
            initialValues.s_i = inheritedState.x;
            initialValues.v_i = inheritedState.vx;
            break;
        case MovementType.MovimentVertical:
            initialValues.s_i = inheritedState.y;
            initialValues.v_i = inheritedState.vy;
            break;
        case MovementType.TirParabolic:
            // This is not allowed for subsequent phases, but handle it defensively
            initialValues.s_i = inheritedState.y; // height
            initialValues.s_i_x = inheritedState.x; // x-pos
            initialValues.v_i = inheritedState.vy; // v_y
            initialValues.v_x = inheritedState.vx; // v_x
            break;
    }
    return initialValues;
};


const PhaseInputs: React.FC<{
    phase: MovementPhase;
    phaseIndex: number;
    onPhaseChange: (phaseIndex: number, field: keyof MovementPhase, value: any) => void;
}> = ({ phase, phaseIndex, onPhaseChange }) => {
    
    const isSolved = phase.isSolved;
    const [parabolicInputMode, setParabolicInputMode] = React.useState<'vector' | 'components'>('vector');

    const handleChange = (field: keyof MovementPhase, value: any) => {
        onPhaseChange(phaseIndex, field, value);
    };

    const hasError = (field: keyof MovementPhase) => phase.errorFields?.includes(field as string) ?? false;
    const isBold = (field: keyof MovementPhase) => (phase as any)[`${field as string}_explicit`] === true;

    // Common props for inputs whose initial values depend on the previous phase
    const commonProps = {
        s_i: { disabled: isSolved || phaseIndex > 0 },
        v_i: { disabled: isSolved || phaseIndex > 0 },
        t_i: { disabled: isSolved || phaseIndex > 0 },
        s_i_x: { disabled: isSolved || phaseIndex > 0 },
    };

    const renderMRUInputs = () => (
        <div className="space-y-3">
            <div>
                <p className="font-bold text-sm text-gray-700">Velocitat (constant)</p>
                <div className="flex flex-wrap gap-2">
                    <KinematicInput label="Velocitat" unit="m/s" value={phase.v_i} onChange={v => handleChange('v_i', v)} isBold={isBold('v_i')} hasError={hasError('v_i')} disabled={isSolved || phaseIndex > 0} />
                </div>
            </div>
            <div>
                 <p className="font-bold text-sm text-gray-700">Posició</p>
                 <div className="flex flex-wrap gap-2">
                    <KinematicInput label="s inicial" unit="m" value={phase.s_i} onChange={v => handleChange('s_i', v)} isBold={isBold('s_i')} hasError={hasError('s_i')} {...commonProps.s_i} />
                    <KinematicInput label="s final" unit="m" value={phase.s_f} onChange={v => handleChange('s_f', v)} isBold={isBold('s_f')} hasError={hasError('s_f')} disabled={isSolved} />
                    <KinematicInput label="Δs" unit="m" value={phase.delta_s} onChange={v => handleChange('delta_s', v)} isBold={isBold('delta_s')} hasError={hasError('delta_s')} disabled={isSolved} />
                 </div>
            </div>
            <div>
                 <p className="font-bold text-sm text-gray-700">Temps</p>
                 <div className="flex flex-wrap gap-2">
                    <KinematicInput label="t inicial" unit="s" value={phase.t_i} onChange={v => handleChange('t_i', v)} isBold={isBold('t_i')} hasError={hasError('t_i')} {...commonProps.t_i} />
                    <KinematicInput label="t final" unit="s" value={phase.t_f} onChange={v => handleChange('t_f', v)} isBold={isBold('t_f')} hasError={hasError('t_f')} disabled={isSolved} />
                    <KinematicInput label="Durada" unit="s" value={phase.t} onChange={v => handleChange('t', v)} isBold={isBold('t')} hasError={hasError('t')} disabled={isSolved} />
                 </div>
            </div>
        </div>
    );

    const renderMRUAInputs = (isVertical = false) => (
         <div className="space-y-3">
            <div>
                 <p className="font-bold text-sm text-gray-700">Velocitat i Acceleració</p>
                 <div className="flex flex-wrap gap-2">
                    <KinematicInput label="v inicial" unit="m/s" value={phase.v_i} onChange={v => handleChange('v_i', v)} isBold={isBold('v_i')} hasError={hasError('v_i')} {...commonProps.v_i} />
                    <KinematicInput label="v final" unit="m/s" value={phase.v_f} onChange={v => handleChange('v_f', v)} isBold={isBold('v_f')} hasError={hasError('v_f')} disabled={isSolved} />
                    <KinematicInput label="Acceleració" unit="m/s²" value={phase.a} onChange={v => handleChange('a', v)} isBold={isBold('a')} hasError={hasError('a')} disabled={isSolved || isVertical} />
                 </div>
            </div>
            <div>
                 <p className="font-bold text-sm text-gray-700">{isVertical ? "Posició / Altura" : "Posició"}</p>
                 <div className="flex flex-wrap gap-2">
                    <KinematicInput label={isVertical ? "h inicial" : "s inicial"} unit="m" value={phase.s_i} onChange={v => handleChange('s_i', v)} isBold={isBold('s_i')} hasError={hasError('s_i')} {...commonProps.s_i} />
                    <KinematicInput label={isVertical ? "h final" : "s final"} unit="m" value={phase.s_f} onChange={v => handleChange('s_f', v)} isBold={isBold('s_f')} hasError={hasError('s_f')} disabled={isSolved} />
                    <KinematicInput label={isVertical ? "Δh" : "Δs"} unit="m" value={phase.delta_s} onChange={v => handleChange('delta_s', v)} isBold={isBold('delta_s')} hasError={hasError('delta_s')} disabled={isSolved} />
                 </div>
            </div>
             <div>
                 <p className="font-bold text-sm text-gray-700">Temps</p>
                 <div className="flex flex-wrap gap-2">
                    <KinematicInput label="t inicial" unit="s" value={phase.t_i} onChange={v => handleChange('t_i', v)} isBold={isBold('t_i')} hasError={hasError('t_i')} {...commonProps.t_i} />
                    <KinematicInput label="t final" unit="s" value={phase.t_f} onChange={v => handleChange('t_f', v)} isBold={isBold('t_f')} hasError={hasError('t_f')} disabled={isSolved} />
                    <KinematicInput label="Durada" unit="s" value={phase.t} onChange={v => handleChange('t', v)} isBold={isBold('t')} hasError={hasError('t')} disabled={isSolved} />
                 </div>
            </div>
        </div>
    );
    
    const renderParabolicInputs = () => (
        <div className="space-y-3">
             {phaseIndex === 0 && (
                <div className="bg-sky-50 p-2 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                         <h4 className="text-sm font-semibold text-sky-800">Paràmetres de Llançament</h4>
                         <div className="flex bg-sky-100 p-0.5 rounded-md text-xs">
                            <button onClick={() => setParabolicInputMode('vector')} className={`px-2 py-0.5 rounded ${parabolicInputMode === 'vector' ? 'bg-white shadow-sm' : ''}`}>Vector</button>
                            <button onClick={() => setParabolicInputMode('components')} className={`px-2 py-0.5 rounded ${parabolicInputMode === 'components' ? 'bg-white shadow-sm' : ''}`}>Components</button>
                         </div>
                    </div>
                    {parabolicInputMode === 'vector' ? (
                        <div className="flex flex-wrap gap-2">
                            <KinematicInput label="v₀ (total)" unit="m/s" value={phase.v_total_i} onChange={v => handleChange('v_total_i', v)} isBold={isBold('v_total_i')} hasError={hasError('v_total_i')} disabled={isSolved} />
                            <KinematicInput label="Angle (θ)" unit="°" value={phase.angle_i} onChange={v => handleChange('angle_i', v)} isBold={isBold('angle_i')} hasError={hasError('angle_i')} disabled={isSolved} />
                        </div>
                    ) : (
                         <div className="flex flex-wrap gap-2">
                            <KinematicInput label="v₀ₓ" unit="m/s" value={phase.v_x} onChange={v => handleChange('v_x', v)} isBold={isBold('v_x')} hasError={hasError('v_x')} disabled={isSolved} />
                            <KinematicInput label="v₀ᵧ" unit="m/s" value={phase.v_i} onChange={v => handleChange('v_i', v)} isBold={isBold('v_i')} hasError={hasError('v_i')} disabled={isSolved} />
                        </div>
                    )}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                    <p className="font-bold text-sm text-blue-700">Eix Y (Vertical)</p>
                    <KinematicInput label="h inicial" unit="m" value={phase.s_i} onChange={v => handleChange('s_i', v)} isBold={isBold('s_i')} hasError={hasError('s_i')} {...commonProps.s_i} />
                    <KinematicInput label="h final" unit="m" value={phase.s_f} onChange={v => handleChange('s_f', v)} isBold={isBold('s_f')} hasError={hasError('s_f')} disabled={isSolved} />
                    <KinematicInput label="Δh" unit="m" value={phase.delta_s} onChange={v => handleChange('delta_s', v)} isBold={isBold('delta_s')} hasError={hasError('delta_s')} disabled={isSolved} />
                    <KinematicInput label="vᵧ final" unit="m/s" value={phase.v_f} onChange={v => handleChange('v_f', v)} isBold={isBold('v_f')} hasError={hasError('v_f')} disabled={isSolved} />
                    <KinematicInput label="aᵧ" unit="m/s²" value={phase.a} onChange={() => {}} disabled />
                </div>
                <div className="space-y-2">
                    <p className="font-bold text-sm text-red-700">Eix X (Horitzontal)</p>
                    <KinematicInput label="x inicial" unit="m" value={phase.s_i_x} onChange={v => handleChange('s_i_x', v)} isBold={isBold('s_i_x')} hasError={hasError('s_i_x')} {...commonProps.s_i_x} />
                    <KinematicInput label="x final" unit="m" value={phase.s_f_x} onChange={v => handleChange('s_f_x', v)} isBold={isBold('s_f_x')} hasError={hasError('s_f_x')} disabled={isSolved} />
                    <KinematicInput label="Δx" unit="m" value={phase.delta_s_x} onChange={v => handleChange('delta_s_x', v)} isBold={isBold('delta_s_x')} hasError={hasError('delta_s_x')} disabled={isSolved} />
                </div>
            </div>
             <div>
                <p className="font-bold text-sm text-gray-700">Temps</p>
                <div className="flex flex-wrap gap-2">
                    <KinematicInput label="t inicial" unit="s" value={phase.t_i} onChange={v => handleChange('t_i', v)} isBold={isBold('t_i')} hasError={hasError('t_i')} {...commonProps.t_i} />
                    <KinematicInput label="t final" unit="s" value={phase.t_f} onChange={v => handleChange('t_f', v)} isBold={isBold('t_f')} hasError={hasError('t_f')} disabled={isSolved} />
                    <KinematicInput label="Durada" unit="s" value={phase.t} onChange={v => handleChange('t', v)} isBold={isBold('t')} hasError={hasError('t')} disabled={isSolved} />
                </div>
            </div>
        </div>
    );

    switch (phase.tipus) {
        case MovementType.MRU:
            return renderMRUInputs();
        case MovementType.MRUA:
            return renderMRUAInputs(false);
        case MovementType.MovimentVertical:
            return renderMRUAInputs(true);
        case MovementType.TirParabolic:
            return renderParabolicInputs();
        default:
            return <p>Selecciona un tipus de moviment.</p>;
    }
}

interface DataInputPanelProps {
    mobiles: Mobile[];
    setMobiles: (mobiles: Mobile[]) => void;
    onCalculatePhase: (mobileIndex: number, phaseIndex: number) => void;
    onResetPhase: (mobileIndex: number, phaseIndex: number) => void;
    onLoadProblem: (problem: Problem) => void;
    onResetConfiguration: () => void;
}

export const DataInputPanel: React.FC<DataInputPanelProps> = ({ mobiles, setMobiles, onCalculatePhase, onResetPhase, onLoadProblem, onResetConfiguration }) => {

    const handlePhaseChange = (mobileIndex: number, phaseIndex: number, field: keyof MovementPhase, value: any) => {
        const newMobiles = JSON.parse(JSON.stringify(mobiles));
        const phase = newMobiles[mobileIndex].phases[phaseIndex];
        
        // When user starts editing a solved or errored phase, reset it first
        if (phase.isSolved || phase.error) {
             onResetPhase(mobileIndex, phaseIndex);
             // Use setTimeout to apply the new value after the reset state has been processed.
            setTimeout(() => {
                setMobiles(currentMobiles => {
                    const freshMobiles = JSON.parse(JSON.stringify(currentMobiles));
                    const newPhase = freshMobiles[mobileIndex].phases[phaseIndex];
                    if (value === undefined) {
                        delete (newPhase as any)[field];
                        (newPhase as any)[`${field as string}_explicit`] = false;
                    } else {
                        (newPhase as any)[field] = value;
                        (newPhase as any)[`${field as string}_explicit`] = true;
                    }
                    return freshMobiles;
                });
            }, 0);
            return;
        }

        const newPhase = newMobiles[mobileIndex].phases[phaseIndex];
        if (value === undefined) {
            delete (newPhase as any)[field];
            (newPhase as any)[`${field as string}_explicit`] = false;
        } else {
            (newPhase as any)[field] = value;
            (newPhase as any)[`${field as string}_explicit`] = true;
        }
        setMobiles(newMobiles);
    };

    const addPhase = (mobileIndex: number) => {
        const mobile = mobiles[mobileIndex];
        if (mobile.phases.length >= 4 || !mobile.phases[mobile.phases.length - 1].isSolved) return;
    
        const lastPhase = mobile.phases[mobile.phases.length - 1];
        const newMobiles = JSON.parse(JSON.stringify(mobiles));
    
        // 1. Calculate the full 2D final state from the last phase
        const finalState = {
            t: lastPhase.t_f!,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
        };
    
        if (lastPhase.tipus === MovementType.TirParabolic) {
            finalState.x = lastPhase.s_f_x!;
            finalState.y = lastPhase.s_f!;
            finalState.vx = lastPhase.v_x!;
            finalState.vy = lastPhase.v_f!;
        } else if (lastPhase.tipus === MovementType.MovimentVertical) {
            finalState.x = 0;
            finalState.y = lastPhase.s_f!;
            finalState.vx = 0;
            finalState.vy = lastPhase.v_f!;
        } else { // MRU or MRUA (horizontal)
            finalState.x = lastPhase.s_f!;
            finalState.y = 0;
            finalState.vx = lastPhase.v_f!;
            finalState.vy = 0;
        }
        
        const defaultNewType = MovementType.MRU;
        const newPhase: MovementPhase = {
            tipus: defaultNewType,
            isSolved: false,
            inheritedInitialState: finalState,
        };
        
        const initialInputs = mapInheritedStateToPhaseInputs(finalState, defaultNewType);
        Object.assign(newPhase, initialInputs);
    
        newMobiles[mobileIndex].phases.push(newPhase);
        setMobiles(newMobiles);
    };

    const removePhase = (mobileIndex: number, phaseIndex: number) => {
        if(mobiles[mobileIndex].phases.length <= 1) return;
        const newMobiles = JSON.parse(JSON.stringify(mobiles));
        newMobiles[mobileIndex].phases.splice(phaseIndex, 1);
        setMobiles(newMobiles);
    };

    const addMobile = () => {
        if (mobiles.length >= 3) return;
        const mobileNames = ['Mòbil A', 'Mòbil B', 'Mòbil C'];
        const newName = mobileNames[mobiles.length];
        setMobiles([...mobiles, { nom: newName, phases: [{ tipus: MovementType.MRU, isSolved: false }] }]);
    };
    
    const removeMobile = (mobileIndex: number) => {
        if (mobiles.length <= 1) return;
        const newMobiles = mobiles.filter((_, index) => index !== mobileIndex);
        setMobiles(newMobiles);
    };

    const mobileColor = (index: number) => COLORS[index % COLORS.length];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Manual Configuration */}
            <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                        Configuració manual
                    </h2>
                    <button
                        onClick={onResetConfiguration}
                        className="text-sm text-red-600 font-semibold flex items-center space-x-1 hover:text-red-800 transition-colors"
                        title="Esborra tots els mòbils i comença de nou"
                    >
                        <RefreshCwIcon className="w-4 h-4" />
                        <span>Reiniciar configuració</span>
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {mobiles.map((mobile, mobileIndex) => (
                            <div 
                                key={mobileIndex} 
                                className={`bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-4 ${mobiles.length === 3 && mobileIndex === 2 ? 'md:col-span-2' : ''}`}
                                style={{borderTop: `4px solid ${mobileColor(mobileIndex)}`}}>
                               <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        value={mobile.nom}
                                        onChange={(e) => {
                                            const newMobiles = JSON.parse(JSON.stringify(mobiles));
                                            newMobiles[mobileIndex].nom = e.target.value;
                                            setMobiles(newMobiles);
                                        }}
                                        className="text-lg font-bold bg-transparent w-full border-b-2 border-gray-200 focus:border-sky-500 focus:outline-none pb-1"
                                        style={{ color: mobileColor(mobileIndex) }}
                                    />
                                    <button onClick={() => removeMobile(mobileIndex)} disabled={mobiles.length <= 1} className="ml-2 p-1 text-red-500 rounded-full hover:bg-red-100 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                               </div>
                                                            
                                <div className="space-y-3">
                                    {mobile.phases.map((phase, phaseIndex) => {
                                        const borderClass = phase.error
                                            ? 'border-red-400 bg-red-50'
                                            : phase.isSolved
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-200';
                                        
                                        const isPreviousPhaseUnsolved = phaseIndex > 0 && !mobile.phases[phaseIndex - 1].isSolved;

                                        return (
                                        <div key={phaseIndex} className={`p-3 bg-white border-2 rounded-md space-y-3 transition-colors ${borderClass}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 max-w-[180px]">
                                                    <label className="block text-xs font-medium text-gray-500">Tipus de moviment</label>
                                                    <select 
                                                        value={phase.tipus} 
                                                        onChange={(e) => {
                                                            const newType = e.target.value as MovementType;
                                                            setMobiles(currentMobiles => {
                                                                const newMobiles = JSON.parse(JSON.stringify(currentMobiles));
                                                                const oldPhase = newMobiles[mobileIndex].phases[phaseIndex];
                                                                
                                                                let newPhase: MovementPhase = {
                                                                    tipus: newType,
                                                                    isSolved: false,
                                                                };
                                                    
                                                                // If it's a phase that follows another, it MUST have an inherited state.
                                                                // We recalculate its initial inputs based on that state.
                                                                if (oldPhase.inheritedInitialState) {
                                                                    newPhase.inheritedInitialState = oldPhase.inheritedInitialState;
                                                                    const initialInputs = mapInheritedStateToPhaseInputs(oldPhase.inheritedInitialState, newType);
                                                                    Object.assign(newPhase, initialInputs);
                                                                } else {
                                                                    // Otherwise (it's the first phase), just preserve user-set explicit initial conditions.
                                                                    if (oldPhase.t_i_explicit) {
                                                                        newPhase.t_i = oldPhase.t_i;
                                                                        newPhase.t_i_explicit = true;
                                                                    }
                                                                    if (oldPhase.s_i_explicit) {
                                                                        newPhase.s_i = oldPhase.s_i;
                                                                        newPhase.s_i_explicit = true;
                                                                    }
                                                                    if (oldPhase.s_i_x_explicit) { // Important for parabolic
                                                                        newPhase.s_i_x = oldPhase.s_i_x;
                                                                        newPhase.s_i_x_explicit = true;
                                                                    }
                                                                }
                                                    
                                                                newMobiles[mobileIndex].phases[phaseIndex] = newPhase;
                                                    
                                                                // Reset all subsequent phases as they depend on the one that just changed.
                                                                for (let i = phaseIndex + 1; i < newMobiles[mobileIndex].phases.length; i++) {
                                                                    const nextPhaseType = newMobiles[mobileIndex].phases[i].tipus;
                                                                    newMobiles[mobileIndex].phases[i] = { tipus: nextPhaseType, isSolved: false };
                                                                }
                                                    
                                                                return newMobiles;
                                                            });
                                                        }}
                                                        disabled={phase.isSolved}
                                                        className="w-full mt-0.5 p-1.5 border border-gray-300 rounded-md text-sm bg-white disabled:bg-gray-100"
                                                    >
                                                        {Object.values(MovementType).filter(t => t !== MovementType.TirParabolic || phaseIndex === 0).map(type => 
                                                            <option key={type} value={type}>{type}</option>
                                                        )}
                                                    </select>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-600">Fase {phaseIndex + 1}</p>
                                                    <button onClick={() => removePhase(mobileIndex, phaseIndex)} disabled={mobile.phases.length <= 1} className="p-1 text-red-500 rounded-full hover:bg-red-100 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                                                        <TrashIcon className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <PhaseInputs 
                                                phase={phase}
                                                phaseIndex={phaseIndex}
                                                onPhaseChange={(idx, field, val) => handlePhaseChange(mobileIndex, idx, field, val)}
                                            />
                                            
                                            <div className="pt-2 border-t border-gray-200">
                                                {!phase.isSolved ? (
                                                    <>
                                                        <p className="text-xs text-gray-500 mb-2">Introdueix les dades de què disposes.</p>
                                                        <button 
                                                            onClick={() => onCalculatePhase(mobileIndex, phaseIndex)} 
                                                            disabled={isPreviousPhaseUnsolved}
                                                            title={isPreviousPhaseUnsolved ? "Has de resoldre la fase anterior primer." : "Calcula els valors desconeguts"}
                                                            className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-sky-400 disabled:cursor-not-allowed"
                                                        >
                                                            Calcular
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button onClick={() => onResetPhase(mobileIndex, phaseIndex)} className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center space-x-2">
                                                        <RefreshCwIcon className="w-4 h-4" />
                                                        <span>Reiniciar Fase</span>
                                                    </button>
                                                )}
                                                {phase.error && <p className="text-sm text-red-600 font-semibold mt-2 text-center">{phase.error}</p>}
                                            </div>
                                        </div>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => addPhase(mobileIndex)}
                                    disabled={mobile.phases.length >= 4 || !mobile.phases[mobile.phases.length - 1].isSolved}
                                    title={
                                        !mobile.phases[mobile.phases.length - 1].isSolved
                                        ? "Calcula la darrera fase per afegir-ne una de nova."
                                        : mobile.phases.length >= 4
                                        ? "Màxim de 4 fases assolit."
                                        : "Afegeix una nova fase"
                                    }
                                    className="text-sm text-sky-600 font-semibold flex items-center space-x-1 hover:text-sky-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    <span>Afegeix Fase</span>
                                </button>
                            </div>
                        ))}
                    </div>
                     <button
                        onClick={addMobile}
                        disabled={mobiles.length >= 3}
                        className="text-sm text-green-600 font-semibold flex items-center space-x-1 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span>Afegeix Mòbil</span>
                    </button>
                </div>
            </div>

            {/* Right Side: Problem Finder */}
            <div className="lg:col-span-4">
                <ProblemSelector onLoadProblem={onLoadProblem} />
            </div>
        </div>
    );
};