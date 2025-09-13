
import React from 'react';
import { Trophy, Clock, Star, AlertCircle, RotateCcw } from 'lucide-react';
import { GameState } from '../types/game';

interface FinalScreenProps {
  gameState: GameState;
  onRestart: () => void;
}

const FinalScreen: React.FC<FinalScreenProps> = ({ gameState, onRestart }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (gameState.mistakes === 0) return "Perfecte! Has respost totes les preguntes sense errors!";
    if (gameState.mistakes <= 3) return "Excel·lent! Molt pocs errors!";
    if (gameState.mistakes <= 6) return "Molt bé! Has completat el joc amb èxit!";
    return "Enhorabona! Has completat totes les preguntes!";
  };

  const getPerformanceIcon = () => {
    if (gameState.mistakes === 0) return <Trophy className="w-24 h-24 text-yellow-500" />;
    if (gameState.mistakes <= 3) return <Star className="w-24 h-24 text-blue-500" />;
    return <Trophy className="w-24 h-24 text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="question-card text-center animate-bounce-in">
          {/* Header with icon and congratulations */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              {getPerformanceIcon()}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              ¡Felicitats!
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Has completat totes les 19 preguntes!
            </h2>
            <p className="text-xl text-green-600 font-semibold mb-6">
              {getPerformanceMessage()}
            </p>
          </div>

          {/* Main stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-800">Puntuació</h3>
              </div>
              <p className="text-4xl font-black text-blue-600 mb-2">{gameState.score}</p>
              <p className="text-blue-700 font-medium">punts totals</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8 border border-yellow-200 shadow-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-yellow-800">Temps</h3>
              </div>
              <p className="text-4xl font-black text-yellow-600 mb-2">
                {formatTime(gameState.timeElapsed)}
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

          {/* Summary message */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-200 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Resum del Joc</h3>
            <p className="text-gray-700">
              Has demostrat els teus coneixements sobre Economia Social i Solidària completant 
              totes les preguntes sobre cooperatives, gestió d'equips i economia social.
            </p>
          </div>

          {/* Large, prominent restart button */}
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-4 text-xl"
          >
            <RotateCcw className="w-8 h-8" />
            Torna a Jugar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalScreen;
