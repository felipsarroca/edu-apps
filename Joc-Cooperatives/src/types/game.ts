
export interface GameState {
  currentQuestionIndex: number;
  score: number;
  timeElapsed: number;
  totalTime: number;
  mistakes: number;
  isComplete: boolean;
  showHints: boolean;
  hintIndex: number;
  userAnswers: (string | null)[];
}

export interface QuestionResult {
  questionId: number;
  correct: boolean;
  timeSpent: number;
  hintsUsed: number;
}
