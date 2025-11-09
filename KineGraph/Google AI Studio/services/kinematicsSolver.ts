import { Mobile, MovementPhase, MovementType } from '../types';
import { G } from '../constants';

const isDef = (v: any): v is number => v !== undefined && v !== null && isFinite(v);
const TOLERANCE = 1e-6;

// Solves a single phase based on the provided explicit data
const solvePhase = (phase: MovementPhase, isFirstPhase: boolean, prevPhase?: MovementPhase | null): MovementPhase => {
    let p = { ...phase };
    p.error = undefined;
    p.errorFields = [];

    // 1. Link to previous phase
    if (prevPhase && prevPhase.isSolved) {
        if (!isDef(p.t_i)) p.t_i = prevPhase.t_f;
        if (!isDef(p.s_i)) p.s_i = prevPhase.s_f;
        if (!isDef(p.v_i)) p.v_i = prevPhase.v_f;
        if (p.tipus === MovementType.TirParabolic && prevPhase.tipus === MovementType.TirParabolic) {
             if (!isDef(p.s_i_x)) p.s_i_x = prevPhase.s_f_x;
             if (!isDef(p.v_x)) p.v_x = prevPhase.v_x;
        }
    }
    
    // 2. Apply "zero" defaults for the first phase if values are not explicit
    if (isFirstPhase) {
        if (!p.t_i_explicit && !isDef(p.t_i)) p.t_i = 0;
        if (!p.s_i_explicit && !isDef(p.s_i)) p.s_i = 0;
        if (p.tipus === MovementType.TirParabolic && !p.s_i_x_explicit && !isDef(p.s_i_x)) p.s_i_x = 0;
        
        const hasMotionInfo = isDef(p.s_f) || isDef(p.delta_s) || isDef(p.v_f) || (isDef(p.a) && Math.abs(p.a) > TOLERANCE) || isDef(p.t);
        if (!p.v_i_explicit && !isDef(p.v_i) && !hasMotionInfo) {
            p.v_i = 0;
        }
    }

    // 3. Set movement type constraints and intelligent defaults
    if (p.tipus === MovementType.MRU) p.a = 0;
    if (p.tipus === MovementType.MovimentVertical || p.tipus === MovementType.TirParabolic) {
        p.a = G;
        // Intelligent default: If final height is not specified for a throw, assume it ends on the ground.
        // This is a very common scenario for calculating time of flight.
        if (!p.s_f_explicit && !isDef(p.s_f) && isDef(p.s_i) && isDef(p.v_i)) {
            p.s_f = 0;
        }
    }

    // 4. Iterative kinematic solver
    for (let iter = 0; iter < 15; iter++) {
        let changed = false;

        const setValue = (field: keyof MovementPhase, value: number) => {
            const oldValue = p[field];
            // Set value if it's not defined, or if it has changed significantly
            if (isDef(value) && (!isDef(oldValue) || Math.abs((oldValue as number) - value) > TOLERANCE)) {
                (p as any)[field] = value;
                changed = true;
            }
        };
        
        // --- Core Variable Derivations ---
        if (isDef(p.t_f) && isDef(p.t_i)) setValue('t', p.t_f - p.t_i);
        if (isDef(p.t) && isDef(p.t_i)) setValue('t_f', p.t_i + p.t);
        if (isDef(p.t) && isDef(p.t_f)) setValue('t_i', p.t_f - p.t);
        
        if (isDef(p.s_f) && isDef(p.s_i)) setValue('delta_s', p.s_f - p.s_i);
        if (isDef(p.delta_s) && isDef(p.s_i)) setValue('s_f', p.s_i + p.delta_s);
        if (isDef(p.delta_s) && isDef(p.s_f)) setValue('s_i', p.s_f - p.delta_s);

        if (p.tipus === MovementType.TirParabolic) {
             if (isDef(p.v_total_i) && isDef(p.angle_i)) {
                const angleRad = p.angle_i! * Math.PI / 180;
                setValue('v_i', p.v_total_i! * Math.sin(angleRad));
                setValue('v_x', p.v_total_i! * Math.cos(angleRad));
            } else if (isDef(p.v_i) && isDef(p.v_x)) {
                setValue('v_total_i', Math.sqrt(p.v_i! * p.v_i! + p.v_x! * p.v_x!));
                if(Math.abs(p.v_x!) > TOLERANCE || Math.abs(p.v_i!) > TOLERANCE) {
                    setValue('angle_i', Math.atan2(p.v_i!, p.v_x!) * 180 / Math.PI);
                }
            }
            if (isDef(p.s_f_x) && isDef(p.s_i_x)) setValue('delta_s_x', p.s_f_x - p.s_i_x);
            if (isDef(p.delta_s_x) && isDef(p.s_i_x)) setValue('s_f_x', p.s_i_x + p.delta_s_x);
            
            if (isDef(p.delta_s_x) && isDef(p.t) && Math.abs(p.t) > TOLERANCE) setValue('v_x', p.delta_s_x / p.t);
            if (isDef(p.v_x) && isDef(p.t)) setValue('delta_s_x', p.v_x * p.t);
        }

        if (p.tipus === MovementType.MRU) {
            if (isDef(p.delta_s) && isDef(p.t) && Math.abs(p.t) > TOLERANCE) setValue('v_i', p.delta_s / p.t);
            if (isDef(p.v_i) && isDef(p.t)) setValue('delta_s', p.v_i * p.t);
            if (isDef(p.v_i) && isDef(p.delta_s) && Math.abs(p.v_i) > TOLERANCE) setValue('t', p.delta_s / p.v_i);
            if (isDef(p.v_i)) setValue('v_f', p.v_i);
        } else { // MRUA and Vertical
             // Eq 1: v_f = v_i + a * t
            if (isDef(p.v_i) && isDef(p.a) && isDef(p.t)) setValue('v_f', p.v_i + p.a * p.t);
            if (isDef(p.v_f) && isDef(p.a) && isDef(p.t)) setValue('v_i', p.v_f - p.a * p.t);
            if (isDef(p.v_f) && isDef(p.v_i) && isDef(p.a) && Math.abs(p.a) > TOLERANCE) setValue('t', (p.v_f - p.v_i) / p.a);
            if (isDef(p.v_f) && isDef(p.v_i) && isDef(p.t) && Math.abs(p.t) > TOLERANCE) setValue('a', (p.v_f - p.v_i) / p.t);

            // Eq 2: delta_s = v_i*t + 0.5*a*t^2
            if (isDef(p.v_i) && isDef(p.t) && isDef(p.a)) setValue('delta_s', p.v_i * p.t + 0.5 * p.a * p.t * p.t);
            if (isDef(p.delta_s) && isDef(p.t) && isDef(p.a) && Math.abs(p.t) > TOLERANCE) setValue('v_i', (p.delta_s - 0.5 * p.a * p.t * p.t) / p.t);
            if (isDef(p.delta_s) && isDef(p.v_i) && isDef(p.t) && Math.abs(0.5 * p.t * p.t) > TOLERANCE) setValue('a', (p.delta_s - p.v_i * p.t) / (0.5 * p.t * p.t));
            if (isDef(p.delta_s) && isDef(p.v_i) && isDef(p.a)) { // Solve for t (quadratic)
                const A = 0.5 * p.a;
                const B = p.v_i;
                const C = -p.delta_s;

                if (Math.abs(A) < TOLERANCE) { // Linear case (MRU)
                    if (Math.abs(B) > TOLERANCE) {
                        const t = -C / B;
                        if (t >= -TOLERANCE) setValue('t', Math.max(0, t));
                    }
                } else { // Quadratic case
                    const discriminant = B * B - 4 * A * C;
                    if (discriminant >= -TOLERANCE) {
                        const d_sqrt = Math.sqrt(Math.max(0, discriminant));
                        const t1 = (-B + d_sqrt) / (2 * A);
                        const t2 = (-B - d_sqrt) / (2 * A);
                        
                        const positiveSolutions = [t1, t2].filter(t => t >= -TOLERANCE);
                        if (positiveSolutions.length > 0) {
                            // Take the smallest positive solution
                            setValue('t', Math.max(0, Math.min(...positiveSolutions)));
                        }
                    }
                }
            }
            
            // Eq 3: v_f^2 = v_i^2 + 2*a*delta_s
            if (isDef(p.v_i) && isDef(p.a) && isDef(p.delta_s)) {
                const v_f_sq = p.v_i!*p.v_i! + 2*p.a!*p.delta_s!;
                if (v_f_sq >= -TOLERANCE) {
                    // Try to determine direction, but this might be corrected later if t is found
                    const estimated_vf_from_t = isDef(p.t) ? p.v_i + p.a * p.t : null;
                    const direction = estimated_vf_from_t ? Math.sign(estimated_vf_from_t) : (p.a! > 0 ? 1 : (p.v_i! < 0 ? -1 : 1));
                    setValue('v_f', Math.sqrt(Math.max(0, v_f_sq)) * (direction !== 0 ? direction : 1) );
                }
            }
             if (isDef(p.v_f) && isDef(p.v_i) && isDef(p.a) && Math.abs(p.a) > TOLERANCE) {
                setValue('delta_s', (p.v_f*p.v_f - p.v_i*p.v_i) / (2*p.a));
            }
            if(isDef(p.v_f) && isDef(p.v_i) && isDef(p.delta_s) && Math.abs(2*p.delta_s) > TOLERANCE) setValue('a', (p.v_f*p.v_f - p.v_i*p.v_i) / (2*p.delta_s));
           
            // Eq 4: delta_s = (v_i + v_f)/2 * t
            if (isDef(p.v_i) && isDef(p.v_f) && isDef(p.t)) setValue('delta_s', (p.v_i + p.v_f) / 2 * p.t);
            if (isDef(p.delta_s) && isDef(p.v_f) && isDef(p.t) && Math.abs(p.t) > TOLERANCE) setValue('v_i', (2 * p.delta_s / p.t) - p.v_f);
            if (isDef(p.delta_s) && isDef(p.v_i) && isDef(p.t) && Math.abs(p.t) > TOLERANCE) setValue('v_f', (2 * p.delta_s / p.t) - p.v_i);
            if(isDef(p.delta_s) && isDef(p.v_i) && isDef(p.v_f) && Math.abs(p.v_i+p.v_f) > TOLERANCE) setValue('t', 2*p.delta_s / (p.v_i + p.v_f));
        }
        
        if (!changed) break; 
    }
    
    // 5. Final check for solved state
    const fieldsToCheck: (keyof MovementPhase)[] = ['t_i', 't_f', 't', 's_i', 's_f', 'delta_s', 'v_i'];
    if (p.tipus !== MovementType.MRU) fieldsToCheck.push('v_f', 'a');
    if (p.tipus === MovementType.TirParabolic) fieldsToCheck.push('s_i_x', 's_f_x', 'delta_s_x', 'v_x', 'v_total_i', 'angle_i');
    
    const unsolvedFields = fieldsToCheck.filter(f => !isDef(p[f as keyof MovementPhase]));
    
    if (unsolvedFields.length > 0) {
        p.isSolved = false;
        // Do not set error message here, it will be set by the caller if calculation fails.
        return p;
    }

    // 6. Final validation for consistency
    const explicitFields: string[] = Object.keys(p).filter(k => k.endsWith('_explicit') && p[k as keyof MovementPhase]).map(k => k.replace('_explicit', ''));

    const checks = [
        { eq: () => p.v_f! - (p.v_i! + p.a! * p.t!), fields: ['v_f', 'v_i', 'a', 't'] },
        { eq: () => p.delta_s! - (p.v_i! * p.t! + 0.5 * p.a! * p.t! * p.t!), fields: ['delta_s', 'v_i', 'a', 't'] },
        { eq: () => p.v_f!*p.v_f! - (p.v_i!*p.v_i! + 2*p.a!*p.delta_s!), fields: ['v_f', 'v_i', 'a', 'delta_s'] }
    ];
    
    if (p.tipus !== MovementType.MRU) {
        for (const check of checks) {
            if (Math.abs(check.eq()) > TOLERANCE * 100) { // Higher tolerance for validation
                const conflictingExplicitFields = check.fields.filter(f => explicitFields.includes(f));
                if (conflictingExplicitFields.length >= (p.tipus === MovementType.MRUA ? 3 : 2)) { 
                     p.error = "Dades inconsistents.";
                     p.errorFields = conflictingExplicitFields;
                     p.isSolved = false;
                     return p;
                }
            }
        }
    }

    p.isSolved = true;
    return p;
};

export const solveSinglePhaseInMobiles = (unsolvedMobiles: Mobile[], mobileIndex: number, phaseIndex: number): Mobile[] => {
    const mobiles = JSON.parse(JSON.stringify(unsolvedMobiles));
    const mobile = mobiles[mobileIndex];
    if (!mobile) return mobiles;

    const prevPhase = phaseIndex > 0 ? mobile.phases[phaseIndex - 1] : null;
    
    const solvedPhase = solvePhase(mobile.phases[phaseIndex], phaseIndex === 0, prevPhase);
    
    // Check if the solver failed to solve.
    if (!solvedPhase.isSolved && !solvedPhase.error) {
        solvedPhase.error = "Dades insuficients.";
    }

    mobile.phases[phaseIndex] = solvedPhase;
    
    return mobiles;
};

export const resetPhaseInMobiles = (mobiles: Mobile[], mobileIndex: number, phaseIndex: number): Mobile[] => {
    const newMobiles = JSON.parse(JSON.stringify(mobiles));
    const phaseToReset = newMobiles[mobileIndex].phases[phaseIndex];
    
    // Create a new phase preserving only the type and EXPLICIT user inputs.
    const newPhase: MovementPhase = { tipus: phaseToReset.tipus, isSolved: false };

    // Also preserve the inherited state if it exists (for non-first phases)
    if (phaseToReset.inheritedInitialState) {
        newPhase.inheritedInitialState = phaseToReset.inheritedInitialState;
    }

    for (const key in phaseToReset) {
        if (key.endsWith('_explicit') && phaseToReset[key as keyof MovementPhase]) {
            const field = key.replace('_explicit', '');
            if (isDef(phaseToReset[field as keyof MovementPhase])) {
                 (newPhase as any)[field] = (phaseToReset as any)[field];
                 (newPhase as any)[key] = true;
            }
        }
    }
    newMobiles[mobileIndex].phases[phaseIndex] = newPhase;

    // Reset subsequent phases completely as they depend on this one.
    for (let i = phaseIndex + 1; i < newMobiles[mobileIndex].phases.length; i++) {
        const nextPhase = newMobiles[mobileIndex].phases[i];
        newMobiles[mobileIndex].phases[i] = { tipus: nextPhase.tipus, isSolved: false };
    }
    
    return newMobiles;
};