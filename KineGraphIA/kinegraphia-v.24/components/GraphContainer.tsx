
import React, { useState, useRef, useMemo } from 'react';
import { Mobile, ChartData, KeyEvent } from '../types';
import { KinematicsChart } from './KinematicsChart';
import { AnimationCanvas } from './AnimationCanvas';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { COLORS } from '../constants';
import { calculateKeyEvents } from '../services/eventService';

declare const html2canvas: any;

interface GraphContainerProps {
    mobiles: Mobile[];
    chartData: ChartData;
    simulationTime: number;
    setSimulationTime: React.Dispatch<React.SetStateAction<number>>;
    animationTime: number;
    setAnimationTime: React.Dispatch<React.SetStateAction<number>>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const exportChartAsPNG = (element: HTMLElement | null, fileName: string) => {
    if (!element) {
        console.error("Element to export not found.");
        alert("No s'ha pogut exportar la gràfica.");
        return;
    }

    html2canvas(element, {
        scale: 2, 
        backgroundColor: '#ffffff',
    }).then((canvas: HTMLCanvasElement) => {
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = fileName;
        downloadLink.href = pngFile;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
};

export const GraphContainer: React.FC<GraphContainerProps> = ({ 
    mobiles, chartData, simulationTime, setSimulationTime, animationTime, setAnimationTime, isPlaying, setIsPlaying
}) => {
    const [activeView, setActiveView] = useState<'position' | 'velocity' | 'animation'>('position');
    const exportableContentRef = useRef<HTMLDivElement>(null);

    const keyEvents: KeyEvent[] = useMemo(() => {
        if (activeView === 'position') {
            return calculateKeyEvents(mobiles, chartData.positionData, 's');
        }
        return [];
    }, [mobiles, chartData, activeView]);

    const handleExport = () => {
        const title = activeView === 'position' ? 'posicio-temps' : activeView === 'velocity' ? 'velocitat-temps' : 'animacio';
        exportChartAsPNG(exportableContentRef.current, `KineGraphIA - ${title}.png`);
    };

    const handleTimeChange = (delta: number) => {
        setSimulationTime(prev => Math.max(1, prev + delta));
    };

    const activeChart = activeView === 'position' ? {
        title: "Gràfica Posició - Temps (s-t)",
        data: chartData.positionData,
        yAxisLabel: "Posició (m)",
        dataKey: 's' as 's',
    } : activeView === 'velocity' ? {
        title: "Gràfica Velocitat - Temps (v-t)",
        data: chartData.velocityData,
        yAxisLabel: "Velocitat (m/s)",
        dataKey: 'v' as 'v',
    } : null;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col space-y-4">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-center">
                    <button 
                        onClick={() => setActiveView('position')}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-300 ${activeView === 'position' ? 'bg-white text-[#0C7B93] shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Posició-temps
                    </button>
                    <button 
                        onClick={() => setActiveView('velocity')}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-300 ${activeView === 'velocity' ? 'bg-white text-[#0C7B93] shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Velocitat-temps
                    </button>
                    <button 
                        onClick={() => setActiveView('animation')}
                        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-300 ${activeView === 'animation' ? 'bg-white text-[#0C7B93] shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Animació
                    </button>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4 self-start sm:self-center">
                    <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-600 hidden sm:inline">Durada:</span>
                        <button onClick={() => handleTimeChange(-1)} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700" title="Redueix durada"><MinusIcon className="w-4 h-4" /></button>
                        <span className="text-sm font-semibold w-10 text-center">{simulationTime}s</span>
                        <button onClick={() => handleTimeChange(1)} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700" title="Augmenta durada"><PlusIcon className="w-4 h-4" /></button>
                    </div>
                     <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 bg-[#10B981] text-white text-sm font-bold py-1.5 px-3 rounded-lg hover:bg-[#059669] transition-colors duration-300"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Exporta PNG</span>
                    </button>
                </div>
            </div>

            <div ref={exportableContentRef} className="bg-white p-4">
                {/* Title and Legend */}
                 <div className="pb-2 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 text-center">{activeView === 'animation' ? 'Animació 2D del Moviment' : activeChart?.title}</h2>
                    <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-700">
                        {mobiles.map((mobile, index) => (
                            <div key={`legend-${index}`} className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span>{mobile.nom}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart/Animation Area */}
                <div className="flex-grow w-full h-[400px] sm:h-[450px]">
                    {activeView === 'animation' ? (
                         <AnimationCanvas 
                            mobiles={mobiles}
                            animationTime={animationTime}
                            simulationTime={simulationTime}
                         />
                    ) : (
                        activeChart && (
                            <KinematicsChart
                                data={activeChart.data}
                                mobiles={mobiles}
                                xAxisLabel="Temps (s)"
                                yAxisLabel={activeChart.yAxisLabel}
                                dataKey={activeChart.dataKey}
                                animationTime={animationTime}
                                keyEvents={keyEvents}
                                simulationTime={simulationTime}
                            />
                        )
                    )}
                </div>
            </div>

            {/* Animation Controls */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 bg-[#0C7B93] text-white rounded-full hover:bg-[#085a6e] transition-colors duration-300"
                >
                    {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                <input
                    type="range"
                    min="0"
                    max={simulationTime}
                    step="0.1"
                    value={animationTime}
                    onChange={(e) => setAnimationTime(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-[#0C7B93]"
                />
                <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md w-28 text-center">
                    {animationTime.toFixed(1)}s / {simulationTime.toFixed(1)}s
                </span>
            </div>
        </div>
    );
};