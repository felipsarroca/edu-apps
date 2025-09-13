
import React, { useState } from 'react';
import { Question } from '../../data/questions';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

interface OrderingQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const OrderingQuestion: React.FC<OrderingQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress
}) => {
  const [orderedItems, setOrderedItems] = useState<string[]>(
    question.options ? [...question.options] : []
  );

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isAnswered) return;
    
    const newOrder = [...orderedItems];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    
    setOrderedItems(newOrder);
    setUserAnswer(newOrder.join(','));
  };

  const getItemStatus = (item: string, index: number) => {
    if (!isAnswered) return '';
    
    const correctOrder = question.correctAnswer as string[];
    const isCorrectPosition = correctOrder[index] === item;
    
    return isCorrectPosition ? 'correct' : 'incorrect';
  };

  return (
    <div className="space-y-4" onKeyDown={onKeyPress}>
      <p className="text-gray-600 mb-4">
        Ordena els passos en la seqüència correcta utilitzant les fletxes:
      </p>
      
      <div className="space-y-3">
        {orderedItems.map((item, index) => {
          const status = getItemStatus(item, index);
          
          return (
            <div
              key={item}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                status === 'correct'
                  ? 'border-green-500 bg-green-100'
                  : status === 'incorrect'
                    ? 'border-red-500 bg-red-100'
                    : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-1 text-gray-400">
                <GripVertical className="w-4 h-4" />
                <span className="font-semibold min-w-8 text-center">
                  {index + 1}.
                </span>
              </div>
              
              <div className="flex-1 text-left">
                {item}
              </div>
              
              {!isAnswered && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === orderedItems.length - 1}
                    className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderingQuestion;
