
import { useState } from 'react';
import { GameState } from '../types/game';
import { questions } from '../data/questions';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    timeElapsed: 0,
    totalTime: 30 * 60, // 30 minutes
    mistakes: 0,
    isComplete: false,
    showHints: false,
    hintIndex: 0,
    userAnswers: new Array(questions.length).fill(null)
  });

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGameState = () => {
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      timeElapsed: 0,
      totalTime: 30 * 60,
      mistakes: 0,
      isComplete: false,
      showHints: false,
      hintIndex: 0,
      userAnswers: new Array(questions.length).fill(null)
    });
  };

  return {
    gameState,
    setGameState,
    updateGameState,
    resetGameState
  };
};
