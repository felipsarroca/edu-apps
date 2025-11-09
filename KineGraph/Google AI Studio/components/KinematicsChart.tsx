
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { Mobile, ChartDataPoint, KeyEvent } from '../types';
import { COLORS } from '../constants';

interface KinematicsChartProps {
    data: ChartDataPoint[];
    mobiles: Mobile[];
    xAxisLabel: string;
    yAxisLabel: string;
    dataKey: 's' | 'v';
    animationTime: number;
    keyEvents: KeyEvent[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-2 border border-gray-300 rounded shadow-lg">
                <p className="font-bold">{`Temps: ${label.toFixed(1)}s`}</p>
                {payload.map((pld: any, index: number) => (
                    <div key={index} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value.toFixed(2)}`}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const EventTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white p-2 rounded shadow-lg text-sm">
                <p>{payload[0].payload.description}</p>
            </div>
        );
    }
    return null;
}

export const KinematicsChart: React.FC<KinematicsChartProps> = ({ data, mobiles, xAxisLabel, yAxisLabel, dataKey, animationTime, keyEvents }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" type="number" domain={['dataMin', 'dataMax']} allowDataOverflow label={{ value: xAxisLabel, position: 'insideBottom', offset: -15 }} />
                <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                
                {mobiles.map((mobile, index) => (
                    <Line
                        key={mobile.nom}
                        type="monotone"
                        dataKey={`${dataKey}_${mobile.nom.replace(/ /g, '_')}`}
                        name={mobile.nom}
                        stroke={COLORS[index % COLORS.length]}
                        strokeWidth={5}
                        dot={false}
                    />
                ))}
                
                {animationTime > 0 && (
                     <ReferenceLine 
                        x={animationTime} 
                        stroke="#E36414" 
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        label={{ value: `t=${animationTime.toFixed(1)}s`, position: 'insideTopRight', fill: '#E36414' }}
                    />
                )}

                {keyEvents.map((event, index) => (
                    <ReferenceDot
                        key={index}
                        x={event.time}
                        y={event.value}
                        r={6}
                        fill="white"
                        stroke={COLORS[mobiles.findIndex(m => m.nom.replace(/ /g, '_') === event.mobileKey.split('_')[1]) % COLORS.length]}
                        strokeWidth={3}
                    >
                         <Tooltip content={<EventTooltip />} />
                    </ReferenceDot>
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};
