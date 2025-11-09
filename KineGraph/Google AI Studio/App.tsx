
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DataInputPanel } from './components/DataInputPanel';
import { ResultsDisplay } from './components/ResultsDisplay';
import { GraphContainer } from './components/GraphContainer';
import { SolutionDisplay } from './components/SolutionDisplay';
import { HelpModal } from './components/HelpModal';
import { calculateMovementData, calculateStopTimes } from './services/physicsService';
import { Mobile, ChartData, MovementType, Problem } from './types';
import { solveSinglePhaseInMobiles, resetPhaseInMobiles } from './services/kinematicsSolver';

const App: React.FC = () => {
    const [mobiles, setMobiles] = useState<Mobile[]>([
        { nom: 'Mòbil A', phases: [{ tipus: MovementType.MRU, isSolved: false }] }
    ]);
    
    const [simulationTime, setSimulationTime] = useState<number>(10);
    const [animationTime, setAnimationTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [solution, setSolution] = useState<string | null>(null);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

    const resetAnimation = () => {
        setAnimationTime(0);
        setIsPlaying(false);
    };

    const calculateTotalDuration = (mobiles: Mobile[]): number => {
        if (!mobiles || mobiles.length === 0) return 10;
        const maxTime = Math.max(...mobiles.flatMap(m => m.phases).map(p => p.t_f ?? 0));
        return maxTime > 0 ? Math.max(maxTime * 1.1, 10) : 10;
    };
    
    const mobilesWithStops = useMemo(() => calculateStopTimes(mobiles), [mobiles]);
    
    const chartData: ChartData | null = useMemo(() => {
        if (!mobilesWithStops || mobilesWithStops.length === 0) return null;
        return calculateMovementData(mobilesWithStops, simulationTime, 0.1);
    }, [mobilesWithStops, simulationTime]);

    useEffect(() => {
        let intervalId: number;
        if (isPlaying) {
            intervalId = window.setInterval(() => {
                setAnimationTime(prevTime => {
                    const nextTime = prevTime + 0.1;
                    if (nextTime >= simulationTime) {
                        setIsPlaying(false);
                        return simulationTime;
                    }
                    return nextTime;
                });
            }, 100);
        }
        return () => window.clearInterval(intervalId);
    }, [isPlaying, simulationTime]);
    
    const handleMobilesChange = (newMobiles: Mobile[]) => {
        setMobiles(newMobiles);
        setSolution(null);
        resetAnimation();
    }

    const handleCalculatePhase = (mobileIndex: number, phaseIndex: number) => {
        const solvedMobiles = solveSinglePhaseInMobiles(mobiles, mobileIndex, phaseIndex);
        setMobiles(solvedMobiles);
        setSolution(null);
        const newSimTime = calculateTotalDuration(solvedMobiles);
        if (Math.abs(newSimTime - simulationTime) > 0.1 && isFinite(newSimTime)) {
            setSimulationTime(newSimTime);
        }
        resetAnimation();
    };

    const handleResetPhase = (mobileIndex: number, phaseIndex: number) => {
        const resetMobiles = resetPhaseInMobiles(mobiles, mobileIndex, phaseIndex);
        setMobiles(resetMobiles);
        setSolution(null);
        resetAnimation();
    };

    const handleLoadProblem = (problem: Problem) => {
        const problemMobiles = JSON.parse(JSON.stringify(problem.mobiles));
        setMobiles(problemMobiles);
        setSimulationTime(problem.recommendedTime);
        setSolution(problem.solution);
        resetAnimation();
    };
    
    const handleResetConfiguration = () => {
        setMobiles([
            { nom: 'Mòbil A', phases: [{ tipus: MovementType.MRU, isSolved: false }] }
        ]);
        setSimulationTime(10);
        setSolution(null);
        resetAnimation();
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] text-gray-800 flex flex-col">
            {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} />}
            <Header onShowHelp={() => setIsHelpModalOpen(true)} />
            <main className="container mx-auto p-4 md:p-8 space-y-8 flex-grow">
                <div className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <DataInputPanel
                        mobiles={mobiles}
                        setMobiles={handleMobilesChange}
                        onCalculatePhase={handleCalculatePhase}
                        onResetPhase={handleResetPhase}
                        onLoadProblem={handleLoadProblem}
                        onResetConfiguration={handleResetConfiguration}
                    />
                </div>
                
                {mobilesWithStops && chartData && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-12 lg:col-span-4 xl:col-span-3">
                                <ResultsDisplay 
                                    mobiles={mobilesWithStops} 
                                    animationTime={animationTime} 
                                />
                            </div>
                            <div className="md:col-span-12 lg:col-span-8 xl:col-span-9">
                                <GraphContainer
                                    mobiles={mobilesWithStops}
                                    chartData={chartData}
                                    simulationTime={simulationTime}
                                    setSimulationTime={setSimulationTime}
                                    animationTime={animationTime}
                                    setAnimationTime={setAnimationTime}
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {solution && (
                     <SolutionDisplay solution={solution} />
                )}
            </main>
             <footer className="bg-white border-t border-gray-200 py-4">
                <div className="container mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/CC_BY-NC-SA.svg/200px-CC_BY-NC-SA.svg.png" 
                            alt="Llicència Creative Commons BY-NC-SA 4.0" 
                            className="h-8 w-auto" 
                        />
                    </a>
                    <div className="text-center sm:text-left text-xs text-gray-600">
                        <p>
                            Aplicació creada per <a href="https://ja.cat/edu-apps" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0C7B93] hover:underline">Felip Sarroca</a>.
                        </p>
                        <p>
                            Obra sota llicència <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0C7B93] hover:underline">CC BY-NC-SA 4.0</a>.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;
