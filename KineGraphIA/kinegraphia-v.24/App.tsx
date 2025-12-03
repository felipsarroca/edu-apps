
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { GraphContainer } from './components/GraphContainer';
import { SessionManager } from './components/SessionManager';
import { Examples } from './components/Examples';
import { SolutionDisplay } from './components/SolutionDisplay';
import { analyzeProblem } from './services/geminiService';
import { calculateMovementData, calculateStopTimes } from './services/physicsService';
import { Mobile, ChartData, Session, Example, MovementType } from './types';

const App: React.FC = () => {
    const [problemStatement, setProblemStatement] = useState<string>('');
    const [mobiles, setMobiles] = useState<Mobile[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    
    const [solution, setSolution] = useState<string | null>(null);

    const [simulationTime, setSimulationTime] = useState<number>(10);
    const [animationTime, setAnimationTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [cooldown, setCooldown] = useState<number>(0);

    useEffect(() => {
        try {
            const savedSessions = localStorage.getItem('kinegraphia_sessions');
            if (savedSessions) {
                setSessions(JSON.parse(savedSessions));
            }
        } catch (e) {
            console.error("Failed to load sessions from localStorage", e);
            setError("No s'han pogut carregar les sessions guardades.");
        }
    }, []);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => {
            setCooldown(cooldown - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const resetAnimation = () => {
        setAnimationTime(0);
        setIsPlaying(false);
    };

    const chartData: ChartData | null = useMemo(() => {
        if (!mobiles || mobiles.length === 0) return null;
        return calculateMovementData(mobiles, simulationTime, 0.1);
    }, [mobiles, simulationTime]);

    const stopTimes = useMemo(() => {
        if (!mobiles) return [];
        const times = new Set<number>();
        mobiles.forEach(m => {
            if (m.stopTime) times.add(parseFloat(m.stopTime.toPrecision(4)));

            const verticalMotionTypes = [MovementType.TirVertical, MovementType.TirParabolic];
            if (verticalMotionTypes.includes(m.tipus) && m.v0 > 0) {
                const g = -9.8;
                const apexTime = -m.v0 / g;
                if (apexTime > 0.1 && apexTime < (m.stopTime || simulationTime)) {
                    times.add(parseFloat(apexTime.toPrecision(4)));
                }
            }
            
            if (m.tipus === MovementType.MRUA && m.t_explicit && m.t > 0.1 && m.t < simulationTime) {
                times.add(parseFloat(m.t.toPrecision(4)));
            }
        });
        
        return Array.from(times).sort((a, b) => a - b);
    }, [mobiles, simulationTime]);

    useEffect(() => {
        let intervalId: number;
        if (isPlaying) {
            intervalId = window.setInterval(() => {
                setAnimationTime(prevTime => {
                    const nextTime = prevTime + 0.1;

                    const nextStopTime = stopTimes.find(t => t > prevTime + 0.01);
                    if (nextStopTime && nextTime >= nextStopTime) {
                        setIsPlaying(false);
                        return nextStopTime;
                    }

                    if (nextTime >= simulationTime) {
                        setIsPlaying(false);
                        return simulationTime;
                    }
                    return nextTime;
                });
            }, 100);
        }
        return () => window.clearInterval(intervalId);
    }, [isPlaying, simulationTime, stopTimes]);

    const handleAnalyze = async () => {
        if (!problemStatement.trim()) {
            setError('Si us plau, introdueix un enunciat del problema.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setMobiles(null);
        setSolution(null);
        resetAnimation();

        try {
            const result = await analyzeProblem(problemStatement);
            const mobilesWithStops = calculateStopTimes(result.mobils);
            setMobiles(mobilesWithStops);
            setSimulationTime(result.recommendedTime);
            setSolution(result.solution);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'No s\'ha pogut analitzar el problema.');
        } finally {
            setIsLoading(false);
            setCooldown(15);
        }
    };
    
    const handleLoadExample = (example: Example) => {
        const mobilesWithStops = calculateStopTimes(example.mobiles);
        setProblemStatement(example.statement);
        setMobiles(mobilesWithStops);
        setSimulationTime(example.recommendedTime || Math.max(...mobilesWithStops.map(m => m.t), 10));
        setSolution(example.solution);
        setError(null);
        resetAnimation();
    };

    const handleSaveSession = (name: string) => {
        if (!problemStatement || !mobiles) {
            setError("No hi ha dades per desar.");
            return;
        }
        const newSession: Session = { 
            name, 
            problemStatement, 
            mobiles,
            simulationTime,
            solution,
            timestamp: new Date().toISOString() 
        };
        const updatedSessions = [...sessions, newSession];
        setSessions(updatedSessions);
        localStorage.setItem('kinegraphia_sessions', JSON.stringify(updatedSessions));
    };

    const handleLoadSession = (session: Session) => {
        const mobilesWithStops = calculateStopTimes(session.mobiles);
        setProblemStatement(session.problemStatement);
        setMobiles(mobilesWithStops);
        setSimulationTime(session.simulationTime || Math.max(...mobilesWithStops.map(m => m.t), 10));
        setSolution(session.solution || null);
        setError(null);
        resetAnimation();
    };

    const handleDeleteSession = (timestamp: string) => {
        const updatedSessions = sessions.filter(s => s.timestamp !== timestamp);
        setSessions(updatedSessions);
        localStorage.setItem('kinegraphia_sessions', JSON.stringify(updatedSessions));
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] text-gray-800 flex flex-col">
            <Header />
            <main className="container mx-auto p-4 md:p-8 space-y-8 flex-grow">
                <div className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                             <InputArea
                                problemStatement={problemStatement}
                                setProblemStatement={setProblemStatement}
                                onAnalyze={handleAnalyze}
                                isLoading={isLoading}
                                cooldown={cooldown}
                            />
                        </div>
                        <div className="flex flex-col space-y-4">
                           <Examples onLoadExample={handleLoadExample} />
                           <SessionManager
                                sessions={sessions}
                                onSave={handleSaveSession}
                                onLoad={handleLoadSession}
                                onDelete={handleDeleteSession}
                            />
                        </div>
                    </div>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>}
                
                {isLoading && (
                     <div className="flex justify-center items-center bg-white p-6 rounded-lg shadow-md">
                        <svg className="animate-spin h-8 w-8 text-[#0C7B93]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="ml-4 text-lg font-semibold text-gray-600">
                            Analitzant amb la IA...
                        </p>
                    </div>
                )}

                {mobiles && chartData && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-12 lg:col-span-4 xl:col-span-3">
                                <ResultsDisplay 
                                    mobiles={mobiles} 
                                    animationTime={animationTime} 
                                />
                            </div>
                            <div className="md:col-span-12 lg:col-span-8 xl:col-span-9">
                                <GraphContainer
                                    mobiles={mobiles}
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
                        <SolutionDisplay 
                            explanation={solution}
                        />
                    </div>
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
                            Aplicació creada per <a href="https://ja.cat/edu-apps" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0C7B93] hover:underline">Felip Sarroca</a> amb l'assistència de la IA.
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
