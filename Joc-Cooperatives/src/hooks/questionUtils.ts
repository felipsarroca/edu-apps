
import { Question, questions } from '../data/questions';

export const shuffleQuestions = (): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.map(question => {
    if (question.options && question.type !== 'order') {
      return {
        ...question,
        options: [...question.options].sort(() => Math.random() - 0.5)
      };
    }
    return question;
  });
};

export const validateAnswer = (question: Question, answer: string): boolean => {
  switch (question.type) {
    case 'multiple':
    case 'trueFalse':
    case 'fillBlank':
      return answer.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim();
    
    case 'order':
      const correctOrder = question.correctAnswer as string[];
      const userOrder = answer.split(',');
      return JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    
    case 'match':
      try {
        const userMatches = JSON.parse(answer);
        const correctMatches = question.correctAnswer;
        
        console.log('User matches:', userMatches);
        console.log('Correct matches:', correctMatches);
        
        const userKeys = Object.keys(userMatches).sort();
        const correctKeys = Object.keys(correctMatches).sort();
        
        if (userKeys.length !== correctKeys.length) {
          return false;
        }
        
        const isCorrect = userKeys.every(key => {
          const userValue = userMatches[key];
          const correctValue = correctMatches[key];
          return userValue === correctValue;
        });
        
        console.log('Match validation result:', isCorrect);
        return isCorrect;
      } catch (error) {
        console.error('Error parsing user matches:', error);
        return false;
      }
    
    default:
      return false;
  }
};

export const calculatePoints = (isCorrect: boolean, hintIndex: number, timeSpent: number): number => {
  if (isCorrect) {
    return Math.max(100 - (hintIndex * 25) - (timeSpent * 2), 10);
  } else {
    return -50;
  }
};
