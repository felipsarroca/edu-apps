
import React from 'react';
import { Question } from '../../data/questions';

interface FillBlankQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  // Split the question text at various blank placeholders
  let parts: string[] = [];
  let splitFound = false;
  
  // Try different placeholder formats
  const placeholders = ['_________', '________', '_______', '______', '_____'];
  
  for (const placeholder of placeholders) {
    if (question.question.includes(placeholder)) {
      parts = question.question.split(placeholder);
      splitFound = true;
      break;
    }
  }
  
  // If no placeholder found, just show the question with an input at the end
  if (!splitFound) {
    parts = [question.question + ' '];
  }

  return (
    <div className="space-y-6" onKeyDown={onKeyPress}>
      <div className="text-xl leading-relaxed bg-blue-50 p-8 rounded-lg border border-blue-200">
        <div className="flex flex-wrap items-center gap-1">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span className="text-gray-800">{part}</span>
              {(index < parts.length - 1 || !splitFound) && (
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => !isAnswered && setUserAnswer(e.target.value)}
                  disabled={isAnswered}
                  className={`mx-1 px-3 py-2 border-2 rounded-lg min-w-40 text-center font-semibold ${
                    isAnswered
                      ? userAnswer.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim()
                        ? 'border-green-500 bg-green-100 text-green-800'
                        : 'border-red-500 bg-red-100 text-red-800'
                      : 'border-blue-400 bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
                  }`}
                  placeholder="Escriu aquí..."
                  autoFocus
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p>💡 <strong>Consell:</strong> Escriu la paraula que millor completi la frase en l'espai indicat.</p>
      </div>
    </div>
  );
};

export default FillBlankQuestion;
