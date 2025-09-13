
import React from 'react';
import { Question } from '../../data/questions';
import { Check, X } from 'lucide-react';

interface TrueFalseQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  const options = [
    { value: 'Vertader', icon: Check, color: 'green' },
    { value: 'Fals', icon: X, color: 'red' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" onKeyDown={onKeyPress}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = userAnswer === option.value;
        const isCorrect = isAnswered && userAnswer === question.correctAnswer;
        const isIncorrect = isAnswered && userAnswer !== question.correctAnswer && isSelected;
        
        return (
          <button
            key={option.value}
            onClick={() => !isAnswered && setUserAnswer(option.value)}
            disabled={isAnswered}
            className={`
              relative overflow-hidden flex flex-col items-center justify-center gap-4 py-8 px-6 rounded-2xl border-3 transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none
              ${isSelected
                ? isAnswered
                  ? isCorrect
                    ? 'bg-green-100 border-green-500 text-green-800 shadow-green-200 shadow-lg'
                    : 'bg-red-100 border-red-500 text-red-800 shadow-red-200 shadow-lg'
                  : 'bg-blue-100 border-blue-500 text-blue-800 shadow-blue-200 shadow-lg'
                : isAnswered
                  ? 'bg-gray-50 border-gray-200 text-gray-400'
                  : `bg-white border-${option.color}-200 text-${option.color}-700 hover:bg-${option.color}-50 hover:border-${option.color}-400 shadow-md hover:shadow-lg`
              } 
              ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Background pattern */}
            <div className={`absolute inset-0 opacity-5 ${
              option.color === 'green' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            
            {/* Icon */}
            <div className={`
              p-3 rounded-full border-2 transition-all duration-300
              ${isSelected
                ? isAnswered
                  ? isCorrect
                    ? 'bg-green-500 border-green-600 text-white'
                    : 'bg-red-500 border-red-600 text-white'
                  : 'bg-blue-500 border-blue-600 text-white'
                : `border-${option.color}-300 ${option.color === 'green' ? 'text-green-600' : 'text-red-600'}`
              }
            `}>
              <Icon className="w-8 h-8" strokeWidth={3} />
            </div>
            
            {/* Text */}
            <span className="font-bold text-xl tracking-wide">
              {option.value}
            </span>
            
            {/* Selection indicator */}
            {isSelected && (
              <div className={`
                absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center
                ${isAnswered
                  ? isCorrect
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : 'bg-blue-500'
                }
              `}>
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TrueFalseQuestion;
