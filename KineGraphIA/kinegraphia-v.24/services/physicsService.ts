import { Mobile, MovementType, ChartData, ChartDataPoint, KeyPoints } from '../types';
import { G } from '../constants';

// --- CORE CALCULATION FUNCTIONS (MODIFIED TO HANDLE stopTime) ---

const calculateSingleMobileState = (mobile: Mobile, t: number): { s: number, v: number } => {
    const effectiveTime = mobile.stopTime !== undefined ? Math.min(t, mobile.stopTime) : t;
    
    let s = 0;
    let v = 0;
    
    // Handle phased MRUA: calculate state at end of phase 1
    const phase1_end_s = mobile.s0 + mobile.v0 * mobile.t + 0.5 * mobile.a * mobile.t * mobile.t;
    const phase1_end_v = mobile.v0 + mobile.a * mobile.t;
    
    // Determine which phase we are in
    if (mobile.tipus === MovementType.MRUA && mobile.t_explicit && effectiveTime > mobile.t) { // Phase 2
        s = phase1_end_s + phase1_end_v * (effectiveTime - mobile.t);
        v = phase1_end_v;
    } else { // Phase 1 (or single-phase movements)
        const acceleration = [MovementType.CaigudaLliure, MovementType.TirVertical, MovementType.TirParabolic].includes(mobile.tipus) ? -G : mobile.a;
        s = mobile.s0 + mobile.v0 * effectiveTime + 0.5 * acceleration * effectiveTime * effectiveTime;
        v = mobile.v0 + acceleration * effectiveTime;
    }
    
    // If time is past the stop time, velocity becomes zero
    if (mobile.stopTime !== undefined && t >= mobile.stopTime) {
        v = 0;
    }
    
    return { s, v };
};


const calculate2DPosition = (mobile: Mobile, t: number): { x: number, y: number } => {
    const effectiveTime = mobile.stopTime !== undefined ? Math.min(t, mobile.stopTime) : t;
    const { s } = calculateSingleMobileState(mobile, effectiveTime);
    
    let x = 0;
    let y = 0;

    switch (mobile.tipus) {
        case MovementType.MRU:
        case MovementType.MRUA:
            x = s;
            break;
        case MovementType.CaigudaLliure:
        case MovementType.TirVertical:
            y = s;
            break;
        case MovementType.TirParabolic:
            x = (mobile.vx0 ?? 0) * effectiveTime;
            y = s;
            break;
    }
    return { x, y };
};

export const getInstantaneousKinematics = (mobile: Mobile, t: number, ignoreStop: boolean = false): { v: number, a: number } => {
    if (!ignoreStop && mobile.stopTime !== undefined && t >= mobile.stopTime) {
        return { v: 0, a: 0 };
    }

    let vx = 0, vy = 0;
    
    if (mobile.tipus === MovementType.MRUA && mobile.t_explicit && t > mobile.t) { // Phase 2
        vx = mobile.v0 + mobile.a * mobile.t;
    } else { // Phase 1 or single-phase movements
        switch (mobile.tipus) {
            case MovementType.MRU:
                vx = mobile.v0;
                break;
            case MovementType.MRUA:
                vx = mobile.v0 + mobile.a * t;
                break;
            case MovementType.TirVertical:
            case MovementType.CaigudaLliure:
                vy = mobile.v0 + (-G) * t;
                break;
            case MovementType.TirParabolic:
                vy = mobile.v0 + (-G) * t;
                vx = mobile.vx0 ?? 0;
                break;
        }
    }

    const v_mag = Math.sqrt(vx * vx + vy * vy);
    
    let a_display = 0;
    if ([MovementType.CaigudaLliure, MovementType.TirVertical, MovementType.TirParabolic].includes(mobile.tipus)) {
        a_display = -G;
    } else if (mobile.tipus === MovementType.MRUA) {
        if (mobile.t_explicit && t > mobile.t) {
            a_display = 0; // In phase 2, acceleration is 0
        } else {
            a_display = mobile.a;
        }
    }
    
    return { v: v_mag, a: a_display };
};


// --- EXPORTED DATA GENERATION FUNCTIONS ---

export const calculateMovementData = (mobiles: Mobile[], duration: number, step: number): ChartData => {
    const positionData: ChartDataPoint[] = [];
    const velocityData: ChartDataPoint[] = [];

    for (let t = 0; t <= duration; t += step) {
        const currentTime = parseFloat(t.toFixed(2));
        const posPoint: ChartDataPoint = { time: currentTime };
        const velPoint: ChartDataPoint = { time: currentTime };

        mobiles.forEach(mobile => {
            const key = `${mobile.nom.replace(/ /g, '_')}`;
            const { s, v } = calculateSingleMobileState(mobile, currentTime);
            posPoint[`s_${key}`] = parseFloat(s.toFixed(2));
            velPoint[`v_${key}`] = parseFloat(v.toFixed(2));
        });

        positionData.push(posPoint);
        velocityData.push(velPoint);
    }
    
    return { positionData, velocityData };
};

export const calculateInstantaneousValues = (mobile: Mobile, t: number): {s: number, v: number} => {
    return calculateSingleMobileState(mobile, t);
};

export const calculateAnimationData = (mobiles: Mobile[], duration: number, step: number) => {
    const trajectories: { [key: string]: { x: number, y: number }[] } = {};
    mobiles.forEach(m => {
        trajectories[m.nom] = [];
    });

    for (let t = 0; t <= duration; t += step) {
        mobiles.forEach(mobile => {
            const pos = calculate2DPosition(mobile, t);
            trajectories[mobile.nom].push(pos);
        });
    }
    return trajectories;
};

export const get2DInstantaneousPosition = (mobile: Mobile, t: number): { x: number, y: number } => {
    return calculate2DPosition(mobile, t);
}

// --- NEW COLLISION/STOP LOGIC ---

const solveQuadratic = (a: number, b: number, c: number): number | null => {
    if (Math.abs(a) < 1e-9) {
        if (Math.abs(b) < 1e-9) return null;
        const t = -c / b;
        return t > 1e-6 ? t : null;
    }
    const d = b * b - 4 * a * c;
    if (d < 0) return null;
    const t1 = (-b + Math.sqrt(d)) / (2 * a);
    const t2 = (-b - Math.sqrt(d)) / (2 * a);
    const solutions = [t1, t2].filter(t => t > 1e-6);
    return solutions.length > 0 ? Math.min(...solutions) : null;
};

const calculateCollisionTime = (m1: Mobile, m2: Mobile): number | null => {
    const horizontalTypes = [MovementType.MRU, MovementType.MRUA];
    if (!horizontalTypes.includes(m1.tipus) || !horizontalTypes.includes(m2.tipus)) {
        return null;
    }

    if (m1.v0 * m2.v0 >= 0 && m1.s0 < m2.s0 && m1.a <= m2.a) { // Not moving towards each other and no chance of catching up
        return null;
    }

    const A = 0.5 * (m1.a - m2.a);
    const B = m1.v0 - m2.v0;
    const C = m1.s0 - m2.s0;
    return solveQuadratic(A, B, C);
};

export const calculateStopTimes = (mobiles: Mobile[]): Mobile[] => {
    const mobilesWithStops = mobiles.map(m => ({ ...m }));

    mobilesWithStops.forEach(mobile => {
        const verticalTypes = [MovementType.CaigudaLliure, MovementType.TirVertical, MovementType.TirParabolic];
        if (verticalTypes.includes(mobile.tipus) && mobile.s0 >= 0) {
             const t_impact = solveQuadratic(0.5 * -G, mobile.v0, mobile.s0);
             if (t_impact !== null) mobile.stopTime = t_impact;
        }
    });

    for (let i = 0; i < mobilesWithStops.length; i++) {
        for (let j = i + 1; j < mobilesWithStops.length; j++) {
            const m1 = mobilesWithStops[i];
            const m2 = mobilesWithStops[j];
            const collisionTime = calculateCollisionTime(m1, m2);
            if (collisionTime !== null) {
                m1.stopTime = Math.min(m1.stopTime ?? Infinity, collisionTime);
                m2.stopTime = Math.min(m2.stopTime ?? Infinity, collisionTime);
            }
        }
    }
    
    mobilesWithStops.forEach(m => {
        if (m.stopTime === Infinity) delete m.stopTime;
    });

    return mobilesWithStops;
};

export const calculateKeyMovementPoints = (mobile: Mobile): KeyPoints => {
    const points: KeyPoints = {};
    const verticalMotionTypes = [MovementType.TirVertical, MovementType.TirParabolic, MovementType.CaigudaLliure];

    if (verticalMotionTypes.includes(mobile.tipus)) {
        const acceleration = -G;
        
        // Apex is only relevant if thrown upwards
        if (mobile.v0 > 0) {
            const apexTime = -mobile.v0 / acceleration;
            if (!mobile.stopTime || apexTime < mobile.stopTime) {
                 points.apexTime = apexTime;
                 points.maxHeight = mobile.s0 + mobile.v0 * apexTime + 0.5 * acceleration * apexTime * apexTime;
            }
        }

        if (mobile.stopTime) {
            points.impactTime = mobile.stopTime;
            points.impactVelocity = mobile.v0 + acceleration * mobile.stopTime;
        }
    }
    return points;
};
