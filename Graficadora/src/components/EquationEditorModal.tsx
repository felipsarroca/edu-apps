import React, { useState, useEffect, useRef } from 'react';
import { MathKeyboard } from './MathKeyboard';
import { MathExpression } from './MathExpression';
import type { MathFunction, FunctionType, Theme } from '../types';
import { THEMES } from '../constants';

interface EquationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (func: Omit<MathFunction, 'id' | 'color' | 'isVisible'>) => void;
  existingFunction: MathFunction | null;
  theme: Theme;
}

type EditorMode = 'single' | 'system';
type ActiveField = 'expression' | 'domain';

export const EquationEditorModal: React.FC<EquationEditorModalProps> = ({ isOpen, onClose, onSave, existingFunction, theme }) => {
  const [expressions, setExpressions] = useState<string[]>(['y = ']);
  const [type, setType] = useState<FunctionType>('equation');
  const [domainRestriction, setDomainRestriction] = useState('');
  const [mode, setMode] = useState<EditorMode>('single');
  const [focusedInput, setFocusedInput] = useState(0);
  const [activeField, setActiveField] = useState<ActiveField>('expression');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const domainInputRef = useRef<HTMLInputElement | null>(null);
  const themeClasses = THEMES[theme];

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      if (existingFunction) {
        setExpressions(existingFunction.expressions);
        setType(existingFunction.type);
        setDomainRestriction(existingFunction.domainRestriction || '');
        setMode(existingFunction.expressions.length > 1 || existingFunction.type === 'system' ? 'system' : 'single');
      } else {
        setExpressions(['y = ']);
        setType('equation');
        setDomainRestriction('');
        setMode('single');
      }
      setFocusedInput(0);
      setActiveField('expression');
    } else {
      setIsAnimating(false);
    }
  }, [existingFunction, isOpen]);
  
  const handleClose = () => {
      setIsAnimating(false);
      setTimeout(onClose, 200); // Wait for animation
  }

  const handleSave = () => {
    const validExpressions = expressions.map(e => e.trim()).filter(e => e);
    if (validExpressions.length > 0) {
      const finalType = mode === 'system' ? 'system' : type;
      onSave({ 
        expressions: validExpressions, 
        type: finalType,
        domainRestriction: type === 'equation' ? domainRestriction.trim() : undefined,
      });
    }
  };
  
  const handleExpressionChange = (index: number, value: string) => {
    const newExpressions = [...expressions];
    newExpressions[index] = value;
    setExpressions(newExpressions);
  };

  const addExpression = () => {
    setExpressions([...expressions, 'y = ']);
    setTimeout(() => {
       const newIndex = expressions.length;
       inputRefs.current[newIndex]?.focus();
       setFocusedInput(newIndex);
       setActiveField('expression');
    }, 0)
  };
  
  const removeExpression = (index: number) => {
    if (expressions.length > 1) {
      const newExpressions = expressions.filter((_, i) => i !== index);
      setExpressions(newExpressions);
      const newFocusIndex = Math.max(0, index - 1);
      setFocusedInput(newFocusIndex);
      setActiveField('expression');
      inputRefs.current[newFocusIndex]?.focus();
    }
  };

  const handleKeyPress = (value: string, keyType: 'insert' | 'function' | 'backspace') => {
    let input: HTMLInputElement | null;
    let currentText: string;
    let textUpdater: (newText: string) => void;

    if (activeField === 'domain') {
      input = domainInputRef.current;
      currentText = domainRestriction;
      textUpdater = setDomainRestriction;
    } else {
      input = inputRefs.current[focusedInput];
      currentText = expressions[focusedInput];
      textUpdater = (newValue: string) => handleExpressionChange(focusedInput, newValue);
    }

    if (!input) return;

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    let newText = '';
    let newCursorPos = 0;

    switch (keyType) {
      case 'backspace':
        if (start > 0 && start === end) {
          newText = currentText.substring(0, start - 1) + currentText.substring(end);
          newCursorPos = start - 1;
        } else {
          newText = currentText.substring(0, start) + currentText.substring(end);
          newCursorPos = start;
        }
        break;
      case 'function':
        const functionCall = `${value}()`;
        newText = currentText.substring(0, start) + functionCall + currentText.substring(end);
        newCursorPos = start + value.length + 1;
        break;
      case 'insert':
      default:
        newText = currentText.substring(0, start) + value + currentText.substring(end);
        newCursorPos = start + value.length;
        break;
    }

    textUpdater(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`rounded-lg shadow-2xl w-full max-w-2xl ${themeClasses.panelBg} border ${themeClasses.border} transition-all duration-200 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">{existingFunction ? 'Editar' : 'Afegir'}</h3>
            <button onClick={handleClose} className={`p-2 rounded-full -mr-2 -mt-2 ${themeClasses.buttonHover}`}>
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          <div className="space-y-4">
            <div className={`w-full p-4 text-2xl rounded-md border ${themeClasses.border} ${themeClasses.buttonBg} min-h-[60px] flex items-center justify-center`}>
              <div className="flex items-center">
                 {mode === 'system' && <span className="text-4xl font-thin mr-2">{'{'}</span>}
                 <div className="flex flex-col">
                    {(mode === 'single' ? [expressions[0]] : expressions).map((expr, index) => (
                      <MathExpression key={index} expression={expr} />
                    ))}
                 </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mode" value="single" checked={mode === 'single'} onChange={() => setMode('single')} className="form-radio" style={{accentColor: THEMES[theme].accent}}/>
                    Funció
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="mode" value="system" checked={mode === 'system'} onChange={() => setMode('system')} className="form-radio" style={{accentColor: THEMES[theme].accent}}/>
                    Sistema
                </label>
            </div>

            <div className="space-y-2">
              {(mode === 'single' ? [expressions[0]] : expressions).map((expr, index) => (
                <div key={mode === 'single' ? 0 : index} className="flex items-center gap-2">
                  <input
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    value={expr}
                    onChange={(e) => handleExpressionChange(index, e.target.value)}
                    onFocus={() => { setFocusedInput(index); setActiveField('expression'); }}
                    placeholder={`Equació ${index + 1}`}
                    className={`w-full p-3 text-lg font-mono rounded-md border ${themeClasses.border} ${themeClasses.buttonBg} focus:outline-none focus:ring-2`}
                    style={{'--tw-ring-color': THEMES[theme].accent } as React.CSSProperties}
                  />
                  {mode === 'system' && (
                     <button 
                        onClick={() => removeExpression(index)} 
                        className="p-2 rounded text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent"
                        disabled={expressions.length <= 1}
                     >
                       <i className="fa-solid fa-trash"></i>
                     </button>
                  )}
                </div>
              ))}
              
              {mode === 'single' && type === 'equation' && (
                <div className="flex items-center gap-2 pt-2">
                  <label htmlFor="domain-restriction" className={`text-sm ${themeClasses.secondaryText}`}>
                    Domini restringit (opcional):
                  </label>
                  <input
                    id="domain-restriction"
                    ref={domainInputRef}
                    type="text"
                    value={domainRestriction}
                    onChange={(e) => setDomainRestriction(e.target.value)}
                    onFocus={() => setActiveField('domain')}
                    placeholder="ex: -2 < x < 5"
                    className={`w-full p-2 text-base font-mono rounded-md border ${themeClasses.border} ${themeClasses.buttonBg} focus:outline-none focus:ring-2`}
                    style={{'--tw-ring-color': THEMES[theme].accent } as React.CSSProperties}
                  />
                </div>
              )}
            </div>

            {mode === 'system' && (
              <button onClick={addExpression} className={`w-full p-2 rounded-md border-dashed border-2 ${themeClasses.border} ${themeClasses.buttonHover}`}>
                <i className="fa-solid fa-plus mr-2"></i> Afegir equació
              </button>
            )}
            
            {mode === 'single' && (
               <div className="flex gap-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="radio" name="type" value="equation" checked={type === 'equation'} onChange={() => setType('equation')} className="form-radio" style={{accentColor: THEMES[theme].accent}}/>
                   Equació
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="radio" name="type" value="inequality" checked={type === 'inequality'} onChange={() => setType('inequality')} className="form-radio" style={{accentColor: THEMES[theme].accent}}/>
                   Inequació
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input type="radio" name="type" value="interval" checked={type === 'interval'} onChange={() => setType('interval')} className="form-radio" style={{accentColor: THEMES[theme].accent}}/>
                   Interval
                 </label>
               </div>
            )}
            
            <MathKeyboard onKeyPress={handleKeyPress} theme={theme} />
          </div>

        </div>
        <div className={`px-6 py-4 border-t ${themeClasses.border} flex justify-end`}>
            <button
              onClick={handleSave}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${themeClasses.accentButtonClasses}`}
            >
              {existingFunction ? 'Desar canvis' : 'Afegir a la gràfica'}
            </button>
        </div>
      </div>
    </div>
  );
};