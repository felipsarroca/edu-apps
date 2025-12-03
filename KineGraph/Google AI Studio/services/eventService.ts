
import { Mobile, ChartDataPoint, KeyEvent, MovementType } from '../types';

export const calculateKeyEvents = (mobiles: Mobile[], data: ChartDataPoint[], dataKey: 's' | 'v'): KeyEvent[] => {
    const events: KeyEvent[] = [];
    const mobileKeys = mobiles.map(m => `${dataKey}_${m.nom.replace(/ /g, '_')}`);

    // 1. Detect Phase Changes
    mobiles.forEach((mobile, mobileIndex) => {
        if (mobile.phases && mobile.phases.length > 1) {
            // FIX: Property 't0' does not exist on type 'Mobile'. Use t_i from the first phase.
            let cumulativeTime = mobile.phases[0]?.t_i || 0;
            for (let i = 0; i < mobile.phases.length - 1; i++) {
                const phase = mobile.phases[i];
                if (phase.t === undefined) continue; // Prevent NaN if duration is not calculated
                cumulativeTime += phase.t;
                
                // Find the data point at or just after the phase change
                const dataPoint = data.find(d => d.time >= cumulativeTime);
                if (dataPoint) {
                    const value = dataPoint[mobileKeys[mobileIndex]];
                    if (value !== undefined) {
                        events.push({
                            time: cumulativeTime,
                            value: value,
                            description: `Canvi de fase per a ${mobile.nom}`,
                            mobileKey: mobileKeys[mobileIndex],
                        });
                    }
                }
            }
        }
    });

    // 2. Detect Intersections (Meetings)
    if (mobiles.length > 1 && dataKey === 's') {
        for (let i = 0; i < mobiles.length; i++) {
            for (let j = i + 1; j < mobiles.length; j++) {
                const keyA = mobileKeys[i];
                const keyB = mobileKeys[j];

                for (let k = 1; k < data.length; k++) {
                    const prevDiff = data[k - 1][keyA] - data[k - 1][keyB];
                    const currentDiff = data[k][keyA] - data[k][keyB];

                    // If the sign changes, they have crossed
                    if (Math.sign(prevDiff) !== Math.sign(currentDiff)) {
                        const t1 = data[k-1].time;
                        const t2 = data[k].time;
                        const v1a = data[k-1][keyA];
                        const v2a = data[k][keyA];
                        const v1b = data[k-1][keyB];
                        const v2b = data[k][keyB];
                        
                        // Linear interpolation to find a more precise intersection point
                        const intersectionTime = t1 - prevDiff * (t2 - t1) / (currentDiff - prevDiff);
                        const intersectionValue = v1a + (v2a - v1a) * (intersectionTime - t1) / (t2 - t1);


                        if (intersectionTime > 0 && intersectionTime < data[data.length-1].time) {
                             events.push({
                                time: intersectionTime,
                                value: intersectionValue,
                                description: `Trobada entre ${mobiles[i].nom} i ${mobiles[j].nom}`,
                                mobileKey: keyA, // Arbitrarily attach to the first mobile of the pair
                            });
                        }
                    }
                }
            }
        }
    }

    return events.sort((a, b) => a.time - b.time);
};