
import React from 'react';
import { Question } from '../../data/questions';

interface MultipleChoiceQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  return (
    <div className="space-y-3" onKeyDown={onKeyPress}>
      {question.options?.map((option, index) => (
        <button
          key={index}
          onClick={() => !isAnswered && setUserAnswer(option)}
          disabled={isAnswered}
          className={`option-button ${
            userAnswer === option
              ? isAnswered
                ? userAnswer === question.correctAnswer
                  ? 'option-correct'
                  : 'option-incorrect'
                : 'border-blue-500 bg-blue-50'
              : 'option-default'
          } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="font-medium">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceQuestion;
