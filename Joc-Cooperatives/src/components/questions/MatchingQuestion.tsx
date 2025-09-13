
import React, { useState, useEffect } from 'react';
import { Question } from '../../data/questions';
import { ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';

interface MatchingQuestionProps {
  question: Question;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  isAnswered: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onReset?: () => void;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  isAnswered,
  onKeyPress,
  onReset
}) => {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string>('');

  const correctMatches = question.correctAnswer as { [key: string]: string };
  const leftOptions = question.options || [];
  const rightOptions = Object.values(correctMatches);

  // Reset matches when question is reset
  useEffect(() => {
    if (!isAnswered && userAnswer === '') {
      setMatches({});
      setSelectedLeft('');
    }
  }, [isAnswered, userAnswer]);

  const handleLeftClick = (option: string) => {
    if (isAnswered) return;
    setSelectedLeft(selectedLeft === option ? '' : option);
  };

  const handleRightClick = (option: string) => {
    if (isAnswered || !selectedLeft) return;
    
    const newMatches = { ...matches, [selectedLeft]: option };
    setMatches(newMatches);
    setUserAnswer(JSON.stringify(newMatches));
    setSelectedLeft('');
  };

  const handleRemoveMatch = (leftOption: string) => {
    if (isAnswered) return;
    
    const newMatches = { ...matches };
    delete newMatches[leftOption];
    setMatches(newMatches);
    setUserAnswer(JSON.stringify(newMatches));
  };

  const handleResetMatches = () => {
    if (isAnswered) return;
    
    setMatches({});
    setSelectedLeft('');
    setUserAnswer('');
    if (onReset) {
      onReset();
    }
  };

  const getMatchStatus = (leftOption: string, rightOption: string) => {
    if (!isAnswered) return '';
    
    const userMatches = matches;
    const isUserMatch = userMatches[leftOption] === rightOption;
    const isCorrectMatch = correctMatches[leftOption] === rightOption;
    
    if (isUserMatch && isCorrectMatch) return 'correct';
    if (isUserMatch && !isCorrectMatch) return 'incorrect';
    return '';
  };

  const isComplete = Object.keys(matches).length === leftOptions.length;

  return (
    <div className="space-y-6" onKeyDown={onKeyPress}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 font-medium mb-2">
          Com funciona:
        </p>
        <ol className="text-blue-600 text-sm space-y-1">
          <li>1. Fes clic en un concepte de l'esquerra (es marcarà en blau)</li>
          <li>2. Després fes clic en la seva definició de la dreta</li>
          <li>3. La connexió es crearà automàticament</li>
          <li>4. Pots eliminar connexions fent clic a la "X" vermella</li>
        </ol>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Connexions: {Object.keys(matches).length}/{leftOptions.length}
          </span>
          {isComplete && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
        
        {Object.keys(matches).length > 0 && !isAnswered && (
          <button
            onClick={handleResetMatches}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar tot
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column - Concepts */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 mb-3 text-center bg-gray-100 py-2 rounded-lg">
            Conceptes
          </h4>
          {leftOptions.map((option, index) => {
            const isMatched = matches[option];
            const isSelected = selectedLeft === option;
            
            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleLeftClick(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 shadow-sm ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                      : isMatched
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer hover:transform hover:scale-102'}`}
                >
                  <span className="font-medium">{option}</span>
                  {isMatched && (
                    <div className="text-xs text-green-600 mt-1">
                      Connectat amb: {isMatched}
                    </div>
                  )}
                </button>
                
                {isMatched && !isAnswered && (
                  <button
                    onClick={() => handleRemoveMatch(option)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
                    title="Eliminar connexió"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrow column */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="flex flex-col items-center space-y-2">
            <ArrowRight className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-500 text-center">
              Connecta conceptes amb definicions
            </span>
          </div>
        </div>

        {/* Right column - Definitions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 mb-3 text-center bg-gray-100 py-2 rounded-lg">
            Definicions
          </h4>
          {rightOptions.map((option, index) => {
            const matchedWith = Object.keys(matches).find(key => matches[key] === option);
            const status = matchedWith ? getMatchStatus(matchedWith, option) : '';
            const isAvailable = !matchedWith && selectedLeft;
            
            return (
              <button
                key={index}
                onClick={() => handleRightClick(option)}
                disabled={isAnswered || !selectedLeft || !!matchedWith}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 shadow-sm ${
                  status === 'correct'
                    ? 'border-green-500 bg-green-100'
                    : status === 'incorrect'
                      ? 'border-red-500 bg-red-100'
                      : matchedWith
                        ? 'border-blue-400 bg-blue-50'
                        : isAvailable
                          ? 'border-yellow-400 bg-yellow-50 hover:border-yellow-500 hover:shadow-md cursor-pointer hover:transform hover:scale-102'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
                } ${isAvailable ? 'animate-pulse' : ''}`}
              >
                <span className={matchedWith ? 'font-medium' : ''}>{option}</span>
                {matchedWith && (
                  <div className="text-xs text-blue-600 mt-1">
                    Connectat amb: {matchedWith}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {Object.keys(matches).length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <h5 className="font-semibold mb-3 text-gray-700">Les teves connexions:</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(matches).map(([concept, definition]) => {
              const status = isAnswered ? getMatchStatus(concept, definition) : '';
              return (
                <div key={concept} className={`flex items-center gap-2 text-sm p-2 rounded ${
                  status === 'correct' 
                    ? 'bg-green-100 border border-green-300' 
                    : status === 'incorrect'
                      ? 'bg-red-100 border border-red-300'
                      : 'bg-white border border-gray-200'
                }`}>
                  <span className="font-medium text-blue-700">{concept}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700">{definition}</span>
                  {status === 'correct' && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  {status === 'incorrect' && <span className="text-red-500 font-bold flex-shrink-0">✗</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingQuestion;
