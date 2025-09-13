
import React, { useState, useEffect } from 'react';
import { Question } from '../data/questions';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import TrueFalseQuestion from './questions/TrueFalseQuestion';
import MatchingQuestion from './questions/MatchingQuestion';
import FillBlankQuestion from './questions/FillBlankQuestion';
import OrderingQuestion from './questions/OrderingQuestion';
import { Lightbulb, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onSubmitAnswer: (answer: string) => boolean;
  onNextQuestion: () => void;
  onResetQuestion: () => void;
  onShowHint: () => void;
  showHints: boolean;
  hintIndex: number;
  canProceed: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSubmitAnswer,
  onNextQuestion,
  onResetQuestion,
  onShowHint,
  showHints,
  hintIndex,
  canProceed
}) => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
  }, [question.id]);

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const correct = onSubmitAnswer(userAnswer);
    setIsAnswered(true);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleTryAgain = () => {
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
    onResetQuestion();
  };

  const handleMatchingReset = () => {
    // For matching questions, we also need to clear the user answer
    setUserAnswer('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isAnswered) {
        handleSubmitAnswer();
      } else if (!isCorrect) {
        handleTryAgain();
      }
    }
  };

  const renderQuestion = () => {
    const commonProps = {
      userAnswer,
      setUserAnswer,
      isAnswered,
      onKeyPress: handleKeyPress
    };

    switch (question.type) {
      case 'multiple':
        return <MultipleChoiceQuestion question={question} {...commonProps} />;
      case 'trueFalse':
        return <TrueFalseQuestion question={question} {...commonProps} />;
      case 'match':
        return <MatchingQuestion question={question} {...commonProps} onReset={handleMatchingReset} />;
      case 'fillBlank':
        return <FillBlankQuestion question={question} {...commonProps} />;
      case 'order':
        return <OrderingQuestion question={question} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="question-card animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {question.sa}
        </span>
        <button
          onClick={onShowHint}
          disabled={hintIndex >= question.hints.length}
          className="flex items-center gap-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lightbulb className="w-4 h-4" />
          Pista ({hintIndex}/{question.hints.length})
        </button>
      </div>

      {/* Only show question text for non-fillBlank questions */}
      {question.type !== 'fillBlank' && (
        <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h2>
      )}

      {renderQuestion()}

      {showHints && hintIndex > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 animate-bounce-in">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Pista {hintIndex}:</h4>
              <p className="text-yellow-700">{question.hints[hintIndex - 1]}</p>
            </div>
          </div>
        </div>
      )}

      {showFeedback && (
        <div className={`mt-6 p-4 rounded-lg animate-bounce-in ${
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h4 className={`font-semibold mb-1 ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? '¡Correcte!' : 'Incorrecte'}
              </h4>
              <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                {isCorrect ? question.feedback : 
                  question.type === 'match' 
                    ? 'Les connexions no són correctes. Prova de nou revisant les definicions.' 
                    : 'Prova-ho de nou amb l\'ajuda de les pistes.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Respondre
          </button>
        ) : !isCorrect ? (
          <button
            onClick={handleTryAgain}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Tornar a provar
          </button>
        ) : canProceed ? (
          <button
            onClick={onNextQuestion}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Següent pregunta
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg text-center">
            Joc completat!
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
