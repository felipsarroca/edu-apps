import React from 'react';
import type { Theme } from '../types';
import { THEMES } from '../constants';

interface MathKeyboardProps {
  onKeyPress: (value: string, keyType: 'insert' | 'function' | 'backspace') => void;
  theme: Theme;
}

const KeyButton: React.FC<{
  config: { value: string; display: string | React.ReactNode; type: string; span?: number };
  onClick: () => void;
}> = ({ config, onClick }) => {
  const { display, type, span = 1 } = config;

  const colorClasses: Record<string, string> = {
    number: 'bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100',
    variable: 'bg-green-200 dark:bg-green-800 border-green-400 dark:border-green-900 hover:bg-green-300 dark:hover:bg-green-700 text-green-900 dark:text-green-100',
    function: 'bg-blue-200 dark:bg-blue-800 border-blue-400 dark:border-blue-900 hover:bg-blue-300 dark:hover:bg-blue-700 text-blue-900 dark:text-blue-100',
    operator: 'bg-orange-200 dark:bg-orange-800 border-orange-400 dark:border-orange-900 hover:bg-orange-300 dark:hover:bg-orange-700 text-orange-900 dark:text-orange-100',
    control: 'bg-red-200 dark:bg-red-700 border-red-400 dark:border-red-800 hover:bg-red-300 dark:hover:bg-red-600 text-red-900 dark:text-red-100',
  };

  const baseClasses = `
    w-full h-12 flex items-center justify-center 
    text-xl font-semibold rounded-lg 
    border-b-4 
    active:translate-y-px active:border-b-2 
    transition-all duration-100 ease-in-out
  `;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${colorClasses[type] || colorClasses.number} col-span-${span}`}
      style={{gridColumn: `span ${span}`}}
    >
      {display}
    </button>
  );
};


export const MathKeyboard: React.FC<MathKeyboardProps> = ({ onKeyPress, theme }) => {
  const themeClasses = THEMES[theme];

  const numberKeys = [
    { value: 'x', display: 'x', type: 'variable' }, { value: 'y', display: 'y', type: 'variable' }, { value: 'backspace', display: '⌫', type: 'control' },
    { value: '7', display: '7', type: 'number' }, { value: '8', display: '8', type: 'number' }, { value: '9', display: '9', type: 'number' },
    { value: '4', display: '4', type: 'number' }, { value: '5', display: '5', type: 'number' }, { value: '6', display: '6', type: 'number' },
    { value: '1', display: '1', type: 'number' }, { value: '2', display: '2', type: 'number' }, { value: '3', display: '3', type: 'number' },
    { value: '0', display: '0', type: 'number', span: 2 }, { value: '.', display: '.', type: 'number' },
  ];

  const functionKeys = [
    { value: 'sin', display: 'sin', type: 'function' }, { value: 'cos', display: 'cos', type: 'function' },
    { value: 'tan', display: 'tan', type: 'function' }, { value: 'log', display: 'log', type: 'function' },
    { value: 'sqrt', display: '√', type: 'function' }, { value: '^', display: <span className="lowercase">x<sup className="ml-0.5 text-base">y</sup></span>, type: 'operator' },
    { value: '(', display: '(', type: 'operator' }, { value: ')', display: ')', type: 'operator' },
    { value: 'PI', display: 'π', type: 'variable' }, { value: 'e', display: 'e', type: 'variable' },
  ];

  const operatorKeys = [
    { value: '/', display: '÷', type: 'operator' }, { value: '*', display: '×', type: 'operator' },
    { value: '-', display: '-', type: 'operator' }, { value: '+', display: '+', type: 'operator' },
    { value: '<', display: '<', type: 'operator' }, { value: '>', display: '>', type: 'operator' },
    { value: '<=', display: '≤', type: 'operator' }, { value: '>=', display: '≥', type: 'operator' },
    { value: '=', display: '=', type: 'control', span: 2 },
  ];

  const handleKeyPress = (keyConfig: { value: string; type: string }) => {
    let keyType: 'insert' | 'function' | 'backspace' = 'insert';
    if (keyConfig.type === 'function') {
      keyType = 'function';
    } else if (keyConfig.value === 'backspace') {
      keyType = 'backspace';
    }
    onKeyPress(keyConfig.value, keyType);
  };

  return (
    <div className={`flex flex-col md:flex-row w-full gap-2 p-2 rounded-lg border ${themeClasses.border} ${themeClasses.buttonBg}`}>
      {/* Numbers & Variables Section */}
      <div className="grid grid-cols-3 gap-2 w-full md:flex-1">
        {numberKeys.map((key) => (
          <KeyButton key={key.value + key.display} config={key} onClick={() => handleKeyPress(key)} />
        ))}
      </div>

      <div className="flex gap-2 w-full md:flex-1">
        {/* Functions Section */}
        <div className="grid grid-cols-2 gap-2 w-1/2">
            {functionKeys.map((key) => (
              <KeyButton key={key.value} config={key} onClick={() => handleKeyPress(key)} />
            ))}
        </div>
      
        {/* Operators Section */}
        <div className="grid grid-cols-2 gap-2 w-1/2">
            {operatorKeys.map((key) => (
              <KeyButton key={key.value} config={key} onClick={() => handleKeyPress(key)} />
            ))}
        </div>
       </div>
    </div>
  );
};