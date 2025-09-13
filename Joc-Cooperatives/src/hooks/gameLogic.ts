
import { useCallback } from 'react';
import { Question, questions } from '../data/questions';
import { GameState, QuestionResult } from '../types/game';
import { validateAnswer, calculatePoints } from './questionUtils';

export const useGameLogic = (
  gameState: GameState,
  updateGameState: (updates: Partial<GameState>) => void,
  shuffledQuestions: Question[],
  questionStartTime: number,
  setQuestionStartTime: (time: number) => void,
  setQuestionResults: React.Dispatch<React.SetStateAction<QuestionResult[]>>
) => {
  const submitAnswer = useCallback((answer: string) => {
    const currentQuestion = shuffledQuestions[gameState.currentQuestionIndex];
    if (!currentQuestion) return false;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = validateAnswer(currentQuestion, answer);
    const points = calculatePoints(isCorrect, gameState.hintIndex, timeSpent);

    console.log('Answer submitted, isCorrect:', isCorrect);
    console.log('Current question index:', gameState.currentQuestionIndex);
    console.log('Total questions:', shuffledQuestions.length);

    // Update game state
    updateGameState({
      score: gameState.score + points,
      mistakes: isCorrect ? gameState.mistakes : gameState.mistakes + 1,
      userAnswers: gameState.userAnswers.map((ans, idx) => 
        idx === gameState.currentQuestionIndex ? answer : ans
      )
    });

    // Record result only if correct
    if (isCorrect) {
      setQuestionResults(prev => [...prev, {
        questionId: currentQuestion.id,
        correct: isCorrect,
        timeSpent,
        hintsUsed: gameState.hintIndex
      }]);

      // Check if this was the last question after submitting correct answer
      const isLastQuestion = gameState.currentQuestionIndex >= shuffledQuestions.length - 1;
      console.log('After correct answer - is last question?', isLastQuestion);
      console.log('Current index after answer:', gameState.currentQuestionIndex);
      console.log('Total questions:', shuffledQuestions.length);
      
      if (isLastQuestion) {
        console.log('This was the last question with correct answer - completing game!');
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          updateGameState({ isComplete: true });
        }, 100);
      }
    }

    return isCorrect;
  }, [gameState, shuffledQuestions, questionStartTime, updateGameState, setQuestionResults]);

  const nextQuestion = useCallback(() => {
    const isLastQuestion = gameState.currentQuestionIndex >= shuffledQuestions.length - 1;
    
    console.log('Next question called, isLastQuestion:', isLastQuestion);
    console.log('Current index:', gameState.currentQuestionIndex, 'Total questions:', shuffledQuestions.length);
    
    if (isLastQuestion) {
      console.log('This is the last question, completing game...');
      updateGameState({ isComplete: true });
    } else {
      console.log('Moving to next question...');
      updateGameState({
        currentQuestionIndex: gameState.currentQuestionIndex + 1,
        showHints: false,
        hintIndex: 0
      });
      setQuestionStartTime(Date.now());
    }
  }, [gameState.currentQuestionIndex, shuffledQuestions.length, updateGameState, setQuestionStartTime]);

  const completeGame = useCallback(() => {
    console.log('Complete game function called - setting isComplete to true');
    updateGameState({ isComplete: true });
  }, [updateGameState]);

  const resetQuestion = useCallback(() => {
    updateGameState({
      showHints: false,
      hintIndex: 0
    });
    setQuestionStartTime(Date.now());
  }, [updateGameState, setQuestionStartTime]);

  const showHint = useCallback(() => {
    const currentQuestion = shuffledQuestions[gameState.currentQuestionIndex];
    if (currentQuestion && gameState.hintIndex < currentQuestion.hints.length) {
      updateGameState({
        showHints: true,
        hintIndex: gameState.hintIndex + 1
      });
    }
  }, [gameState.hintIndex, gameState.currentQuestionIndex, shuffledQuestions, updateGameState]);

  return {
    submitAnswer,
    nextQuestion,
    completeGame,
    resetQuestion,
    showHint
  };
};
