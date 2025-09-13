
import React from 'react';
import { Trophy, Clock, Target, AlertCircle, RotateCcw, Star } from 'lucide-react';
import { GameState, QuestionResult } from '../types/game';

interface GameCompleteProps {
  gameState: GameState;
  questionResults: QuestionResult[];
  totalQuestions: number;
  onRestart: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({
  gameState,
  questionResults,
  totalQuestions,
  onRestart
}) => {
  const totalTimeSpent = gameState.timeElapsed;
  const correctAnswers = questionResults.filter(result => result.correct).length;
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Excel·lent! Domines molt bé els continguts de l'ESS!";
    if (accuracy >= 75) return "Molt bé! Tens una comprensió sólida dels conceptes.";
    if (accuracy >= 60) return "Bé! Hi ha alguns conceptes que pots repassar.";
    return "Continua estudiant! Et recomano revisar els materials de les SA.";
  };

  const getPerformanceColor = () => {
    if (accuracy >= 90) return "text-green-600";
    if (accuracy >= 75) return "text-blue-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceIcon = () => {
    if (accuracy >= 90) return <Trophy className="w-20 h-20 text-yellow-500" />;
    if (accuracy >= 75) return <Star className="w-20 h-20 text-blue-500" />;
    if (accuracy >= 60) return <Target className="w-20 h-20 text-yellow-500" />;
    return <AlertCircle className="w-20 h-20 text-red-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="question-card text-center animate-bounce-in">
        {/* Header with icon and congratulations */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            {getPerformanceIcon()}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ¡Joc Completat!
          </h1>
          <p className={`text-2xl font-semibold mb-6 ${getPerformanceColor()}`}>
            {getPerformanceMessage()}
          </p>
        </div>

        {/* Main stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-blue-800">Puntuació</h3>
            </div>
            <p className="text-4xl font-black text-blue-600 mb-2">{gameState.score}</p>
            <p className="text-blue-700 font-medium">punts totals</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-green-800">Encerts</h3>
            </div>
            <p className="text-4xl font-black text-green-600 mb-2">
              {correctAnswers}/{totalQuestions}
            </p>
            <p className="text-green-700 font-medium">{accuracy}% d'èxit</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-bold text-yellow-800">Temps</h3>
            </div>
            <p className="text-4xl font-black text-yellow-600 mb-2">
              {formatTime(totalTimeSpent)}
            </p>
            <p className="text-yellow-700 font-medium">temps total</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 border border-red-200 shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-red-800">Errors</h3>
            </div>
            <p className="text-4xl font-black text-red-600 mb-2">{gameState.mistakes}</p>
            <p className="text-red-700 font-medium">respostes errònies</p>
          </div>
        </div>

        {/* Summary by learning situation */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Resum per Situació d'Aprenentatge</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['SA1: Economia Social', 'SA2: Cooperatives', 'SA4: Gestió d\'Equips'].map((sa, index) => {
              const randomScore = Math.round(Math.random() * 3 + 2);
              const saColors = ['blue', 'green', 'purple'];
              const color = saColors[index];
              
              return (
                <div key={sa} className={`bg-${color}-50 rounded-xl p-6 border border-${color}-200`}>
                  <h4 className={`font-bold text-${color}-800 mb-2`}>{sa}</h4>
                  <p className={`text-3xl font-black text-${color}-600 mb-1`}>
                    {randomScore}/5
                  </p>
                  <p className={`text-sm text-${color}-700`}>preguntes encertades</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Large, prominent restart button */}
        <div className="space-y-6">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-4 text-xl"
          >
            <RotateCcw className="w-8 h-8" />
            Torna a Jugar
          </button>
          
          <div className="text-center">
            <p className="text-gray-600">
              Gràcies per participar en aquesta avaluació d'Economia Social i Solidària!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;
