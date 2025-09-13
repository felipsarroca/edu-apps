
import React from 'react';
import { Clock, Star, AlertCircle, Trophy } from 'lucide-react';
import { GameState } from '../types/game';

interface GameHeaderProps {
  gameState: GameState;
  totalQuestions: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState, totalQuestions }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((gameState.currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Joc de les Cooperatives
        </h1>
        <div className="flex items-center gap-4 text-sm md:text-base">
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-700">
              {formatTime(gameState.timeElapsed)}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
            <Star className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-700">
              {gameState.score} punts
            </span>
          </div>
          <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="font-semibold text-red-700">
              {gameState.mistakes} errors
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Pregunta {gameState.currentQuestionIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}% completat</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
