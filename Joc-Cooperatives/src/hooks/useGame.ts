
import { useState, useEffect, useCallback } from 'react';
import { Question } from '../data/questions';
import { QuestionResult } from '../types/game';
import { useGameState } from './gameState';
import { useGameLogic } from './gameLogic';
import { shuffleQuestions } from './questionUtils';

export const useGame = () => {
  const { gameState, updateGameState, resetGameState } = useGameState();
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const {
    submitAnswer,
    nextQuestion,
    completeGame,
    resetQuestion,
    showHint
  } = useGameLogic(
    gameState,
    updateGameState,
    shuffledQuestions,
    questionStartTime,
    setQuestionStartTime,
    setQuestionResults
  );

  // Shuffle questions on game start
  useEffect(() => {
    const shuffled = shuffleQuestions();
    setShuffledQuestions(shuffled);
    setQuestionStartTime(Date.now());
  }, []);

  // Timer - counting upwards
  useEffect(() => {
    if (gameState.timeElapsed < gameState.totalTime && !gameState.isComplete) {
      const timer = setTimeout(() => {
        updateGameState({ timeElapsed: gameState.timeElapsed + 1 });
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeElapsed >= gameState.totalTime) {
      updateGameState({ isComplete: true });
    }
  }, [gameState.timeElapsed, gameState.isComplete, gameState.totalTime, updateGameState]);

  const getCurrentQuestion = () => shuffledQuestions[gameState.currentQuestionIndex];

  const resetGame = useCallback(() => {
    const shuffled = shuffleQuestions();
    setShuffledQuestions(shuffled);
    resetGameState();
    setQuestionResults([]);
    setQuestionStartTime(Date.now());
  }, [resetGameState]);

  return {
    gameState,
    shuffledQuestions,
    questionResults,
    getCurrentQuestion,
    submitAnswer,
    nextQuestion,
    resetQuestion,
    showHint,
    resetGame,
    completeGame
  };
};
