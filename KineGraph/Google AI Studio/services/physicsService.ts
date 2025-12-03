import { Mobile, MovementType, ChartData, ChartDataPoint, MovementPhase } from '../types';

const isDef = (v: any): v is number => v !== undefined && v !== null && isFinite(v);
const TOLERANCE = 1e-6;

const getActivePhaseForTime = (mobile: Mobile, t: number): MovementPhase | null => {
    // Find the correct phase for the given time `t`
    for (const phase of mobile.phases) {
        if (phase.isSolved && t >= phase.t_i! && t < phase.t_f!) {
            return phase;
        }
    }
    // Handle the exact end time of the last phase
    const lastPhase = mobile.phases[mobile.phases.length - 1];
    if (lastPhase?.isSolved && t === lastPhase.t_f!) {
        return lastPhase;
    }
    return null;
}

const calculate1DInstantaneousState = (phase: MovementPhase, t: number): { s: number, v: number } => {
    const timeInPhase = t - phase.t_i!;
    const { s_i = 0, v_i = 0, a = 0 } = phase;
    const s = s_i + v_i * timeInPhase + 0.5 * a * timeInPhase * timeInPhase;
    const v = v_i + a * timeInPhase;
    return { s, v };
}

export const get2DInstantaneousPosition = (mobile: Mobile, t: number): { x: number, y: number } => {
    const effectiveTime = (mobile.stopTime !== undefined && t > mobile.stopTime) ? mobile.stopTime : t;

    const firstPhase = mobile.phases?.[0];
    if (!firstPhase || effectiveTime < (firstPhase.t_i ?? 0)) {
        const s0 = firstPhase?.s_i ?? 0;
        const s0x = firstPhase?.s_i_x ?? 0;
        const isVertical = firstPhase?.tipus === MovementType.MovimentVertical || firstPhase?.tipus === MovementType.TirParabolic;
        return isVertical ? { x: s0x, y: s0 } : { x: s0, y: 0 };
    }
    
    let activePhase = getActivePhaseForTime(mobile, effectiveTime);
    
    // Extrapolate if time is beyond the last phase (but before stop time)
    if (!activePhase) {
        const lastPhase = mobile.phases[mobile.phases.length - 1];
        if (lastPhase?.isSolved && effectiveTime > lastPhase.t_f!) {
            const timeAfter = effectiveTime - lastPhase.t_f!;
            const y = lastPhase.s_f! + lastPhase.v_f! * timeAfter; // Extrapolate Y as 1D motion
            const x = (lastPhase.s_f_x ?? lastPhase.s_f!) + (lastPhase.v_x ?? lastPhase.v_f!) * timeAfter; // Extrapolate X
            const isVertical = lastPhase.tipus === MovementType.MovimentVertical;
            const isParabolic = lastPhase.tipus === MovementType.TirParabolic;
            if (isParabolic) return { x, y };
            if (isVertical) return { x: 0, y };
            return { x, y: 0 };
        }
        return { x: NaN, y: NaN };
    }
    
    if (activePhase.tipus === MovementType.TirParabolic) {
        const timeInPhase = effectiveTime - activePhase.t_i!;
        const yState = calculate1DInstantaneousState(activePhase, effectiveTime);
        const x = (activePhase.s_i_x ?? 0) + (activePhase.v_x ?? 0) * timeInPhase;
        return { x, y: yState.s };
    }
    
    const { s } = calculate1DInstantaneousState(activePhase, effectiveTime);
    if (activePhase.tipus === MovementType.MovimentVertical) {
        return { x: 0, y: s };
    }
    
    return { x: s, y: 0 };
}


export const getInstantaneousKinematics = (mobile: Mobile, t: number): { v: number, a: number } => {
    const effectiveTime = (mobile.stopTime !== undefined && t > mobile.stopTime) ? mobile.stopTime : t;

    let activePhase = getActivePhaseForTime(mobile, effectiveTime);
    if (!activePhase) {
        const lastPhase = mobile.phases[mobile.phases.length - 1];
        if (lastPhase?.isSolved && effectiveTime > lastPhase.t_f!) {
            activePhase = lastPhase;
        } else {
            return { v: 0, a: 0 };
        }
    }
    
    const timeInPhase = effectiveTime - activePhase.t_i!;
    const { v_i = 0, a = 0 } = activePhase;
    const vy = v_i + a * timeInPhase;

    if (activePhase.tipus === MovementType.TirParabolic) {
        const vx = activePhase.v_x ?? 0;
        const v_magnitude = Math.sqrt(vx * vx + vy * vy);
        return { v: v_magnitude, a: activePhase.a ?? 0 };
    }
    
    return { v: vy, a: activePhase.a ?? 0 };
};


export const calculateMovementData = (mobiles: Mobile[], duration: number, step: number): ChartData => {
    const positionData: ChartDataPoint[] = [];
    const velocityData: ChartDataPoint[] = [];

    // Create a unique, sorted list of time points to evaluate.
    // This ensures we have a point exactly at the stop time for a clean graph end.
    const timePoints = new Set<number>();
    for (let t = 0; t <= duration; t += step) {
        timePoints.add(parseFloat(t.toFixed(2)));
    }
    mobiles.forEach(m => {
        if (m.stopTime !== undefined && m.stopTime <= duration) {
            timePoints.add(parseFloat(m.stopTime.toFixed(2)));
        }
    });

    const sortedTimePoints = Array.from(timePoints).sort((a, b) => a - b);

    for (const t of sortedTimePoints) {
        if (t > duration) continue;

        const currentTime = t;
        const posPoint: ChartDataPoint = { time: currentTime };
        const velPoint: ChartDataPoint = { time: currentTime };

        mobiles.forEach(mobile => {
            const key = `${mobile.nom.replace(/ /g, '_')}`;
            
            // If the mobile has a stop time and we are past it, stop drawing by providing null.
            if (mobile.stopTime !== undefined && currentTime > mobile.stopTime) {
                posPoint[`s_${key}`] = null;
                velPoint[`v_${key}`] = null;
                return; // Continue to next mobile
            }

            const hasVerticalMotion = mobile.phases.some(
                p => p.tipus === MovementType.MovimentVertical || p.tipus === MovementType.TirParabolic
            );
            
            const { x, y } = get2DInstantaneousPosition(mobile, currentTime);
            const positionValue = hasVerticalMotion ? y : x;
            
            const { v } = getInstantaneousKinematics(mobile, currentTime);

            posPoint[`s_${key}`] = isNaN(positionValue) ? null : parseFloat(positionValue.toFixed(2));
            velPoint[`v_${key}`] = isNaN(v) ? null : parseFloat(v.toFixed(2));
        });
        
        positionData.push(posPoint);
        velocityData.push(velPoint);
    }
    
    return { positionData, velocityData };
};

export const calculateInstantaneousValues = (mobile: Mobile, t: number): {s: number, v: number} => {
    const { y } = get2DInstantaneousPosition(mobile, t);
    const { v } = getInstantaneousKinematics(mobile, t);
    return { s: y, v };
};

export const calculateAnimationData = (mobiles: Mobile[], duration: number, step: number) => {
    const trajectories: { [key: string]: { x: number, y: number }[] } = {};
    mobiles.forEach(m => {
        trajectories[m.nom] = [];
    });

    for (let t = 0; t <= duration; t += step) {
        mobiles.forEach(mobile => {
            const pos = get2DInstantaneousPosition(mobile, t);
            if (!isNaN(pos.x) && !isNaN(pos.y)) {
                 trajectories[mobile.nom].push(pos);
            }
        });
    }
    return trajectories;
};

const solveQuadratic = (a: number, b: number, c: number): number | null => {
    if (Math.abs(a) < 1e-9) {
        if (Math.abs(b) < 1e-9) return null;
        const t = -c / b;
        return t >= 1e-6 ? t : null;
    }
    const d = b * b - 4 * a * c;
    if (d < 0) return null;
    const t1 = (-b + Math.sqrt(d)) / (2 * a);
    const t2 = (-b - Math.sqrt(d)) / (2 * a);
    const solutions = [t1, t2].filter(t => t >= 1e-6);
    return solutions.length > 0 ? Math.min(...solutions) : null;
};

export const calculateStopTimes = (mobiles: Mobile[]): Mobile[] => {
    return mobiles.map(mobile => {
        let earliestStopTime: number | undefined = undefined;

        for (const phase of mobile.phases) {
            if (!phase.isSolved) continue;

            const isVerticalOrParabolic = phase.tipus === MovementType.MovimentVertical || phase.tipus === MovementType.TirParabolic;

            if (isVerticalOrParabolic) {
                // Condition 1: The phase is explicitly defined to end at or below ground.
                if (isDef(phase.s_f) && phase.s_f <= TOLERANCE) {
                    if (earliestStopTime === undefined || phase.t_f! < earliestStopTime) {
                        earliestStopTime = phase.t_f;
                    }
                }

                // Condition 2: The trajectory hits the ground (y=0) during this phase.
                // This is relevant if the object starts above ground.
                if (isDef(phase.s_i) && phase.s_i > TOLERANCE) {
                    // We need to solve for t in: 0 = s_i + v_i*t + 0.5*a*t^2
                    const timeToHitGroundInPhase = solveQuadratic(0.5 * phase.a!, phase.v_i!, phase.s_i!);
                    
                    if (timeToHitGroundInPhase !== null && timeToHitGroundInPhase <= phase.t! + TOLERANCE) {
                        const absoluteHitTime = phase.t_i! + timeToHitGroundInPhase;
                        if (earliestStopTime === undefined || absoluteHitTime < earliestStopTime) {
                            earliestStopTime = absoluteHitTime;
                        }
                    }
                }
            }
        }
        
        return { ...mobile, stopTime: earliestStopTime };
    });
};