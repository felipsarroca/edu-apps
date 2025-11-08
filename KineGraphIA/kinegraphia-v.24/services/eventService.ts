
import { Mobile, ChartDataPoint, KeyEvent, MovementType } from '../types';

export const calculateKeyEvents = (mobiles: Mobile[], data: ChartDataPoint[], dataKey: 's' | 'v'): KeyEvent[] => {
    const events: KeyEvent[] = [];
    const mobileKeys = mobiles.map(m => `${dataKey}_${m.nom.replace(/ /g, '_')}`);

    // 1. Detect Phase Changes
    mobiles.forEach((mobile, index) => {
        if (mobile.tipus === MovementType.MRUA && mobile.t_explicit) {
            const phaseChangeTime = mobile.t;
            const dataPoint = data.find(d => d.time >= phaseChangeTime);
            if (dataPoint) {
                const value = dataPoint[mobileKeys[index]];
                if (value !== undefined) {
                    events.push({
                        time: phaseChangeTime,
                        value: value,
                        description: `Canvi de moviment per a ${mobile.nom}`,
                        mobileKey: mobileKeys[index],
                    });
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
                        const intersectionTime = t1 + (t2 - t1) * (v1b - v1a) / ((v1a - v2a) - (v1b - v2b));
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

    return events;
};
