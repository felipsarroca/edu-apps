import React, { useState } from 'react';
import type { MathFunction, Theme, AnalysisResult } from '../types';
import { THEMES, COLORS } from '../constants';
import { MathExpression } from './MathExpression';
import { analyzeExpression, analyzeSystem } from '../services/mathService';


interface SidePanelProps {
  isOpen: boolean;
  functions: MathFunction[];
  onEdit: (func: MathFunction) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onUpdateColor: (id: number, color: string) => void;
  theme: Theme;
}

const ColorPicker: React.FC<{
  selectedColor: string;
  onSelect: (color: string) => void;
  themeClasses: typeof THEMES[Theme];
}> = ({ selectedColor, onSelect, themeClasses }) => {
  return (
    <div className={`flex flex-wrap gap-2 p-2 rounded-md ${themeClasses.buttonBg} border ${themeClasses.border}`}>
      {COLORS.map(color => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${selectedColor === color ? `ring-2 ring-offset-2 ${themeClasses.bg} ring-blue-500` : ''}`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};

const AnalysisPanel: React.FC<{
    func: MathFunction,
    themeClasses: typeof THEMES[Theme]
}> = ({ func, themeClasses }) => {
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        if (func.type === 'system') {
            setAnalysisResults([analyzeSystem(func.expressions)]);
        } else {
            setAnalysisResults(func.expressions.map(analyzeExpression));
        }
        setIsLoading(false);
    }, [func]);

    if (isLoading) return <p className="p-3">Analitzant...</p>;

    if (func.type === 'system') {
        const result = analysisResults[0];
        if (!result) return null;

        const renderSolution = () => {
            switch (result.systemSolutionStatus) {
                case 'INFINITE_SOLUTIONS':
                    return <p>El sistema té infinites solucions (les funcions són equivalents).</p>;
                case 'NO_SOLUTION':
                    return <p>El sistema no té cap solució (les funcions són paral·leles).</p>;
                case 'LIMITED_SOLUTIONS':
                default:
                    if (result.intersectionPoints && result.intersectionPoints.length > 0) {
                        return (
                            <ul className="space-y-1">
                                {result.intersectionPoints.map((p, i) => (
                                    <li key={i} className={`font-mono p-2 rounded ${themeClasses.bg}`}>
                                        {`x = ${p.x.toFixed(2)}, y = ${p.y.toFixed(2)}`}
                                    </li>
                                ))}
                            </ul>
                        );
                    }
                    return <p>{result.domainNotes.length > 0 ? result.domainNotes[0] : "No s'han trobat solucions a la zona analitzada."}</p>;
            }
        };

        return (
            <div className={`mt-2 p-3 rounded-md text-sm ${themeClasses.buttonBg} border ${themeClasses.border}`}>
                <strong className={`block mb-2 ${themeClasses.secondaryText}`}>Solució del sistema:</strong>
                {renderSolution()}
            </div>
        );
    }

    return (
        <div className={`mt-2 p-3 rounded-md text-sm ${themeClasses.buttonBg} border ${themeClasses.border}`}>
            {analysisResults.map((result, index) => (
                <div key={index} className={index > 0 ? "mt-2 pt-2 border-t " + themeClasses.border : ""}>
                    {func.expressions.length > 1 && <p className="font-bold">Anàlisi per: <MathExpression expression={func.expressions[index]} /></p>}
                    
                    <strong className={themeClasses.secondaryText}>Domini:</strong>
                    {func.domainRestriction ? (
                        <p className={`font-mono p-2 rounded text-base ${themeClasses.bg}`}>{func.domainRestriction}</p>
                    ) : result.domainNotes.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {result.domainNotes.map((note, i) => <li key={i}>{note}</li>)}
                        </ul>
                    ) : (
                        <p>Tots els reals (ℝ)</p>
                    )}

                    {func.domainRestriction && result.domainNotes.length > 0 && (
                        <>
                            <strong className={`mt-2 inline-block text-xs ${themeClasses.secondaryText}`}>Notes addicionals:</strong>
                            <ul className="list-disc list-inside text-xs">
                                {result.domainNotes.map((note, i) => <li key={i}>{note}</li>)}
                            </ul>
                        </>
                    )}


                    <strong className={`mt-2 inline-block ${themeClasses.secondaryText}`}>Tall Eix Y:</strong>
                    <p>{typeof result.yIntercept === 'number' ? result.yIntercept.toFixed(2) : (result.yIntercept ?? "N/A")}</p>

                    <strong className={`mt-2 inline-block ${themeClasses.secondaryText}`}>Arrels (Talls Eix X):</strong>
                     {result.xIntercepts && result.xIntercepts.length > 0 ? (
                        <p>{result.xIntercepts.map(r => r.toFixed(2)).join(', ')}</p>
                    ) : (
                        <p>No s'han trobat arrels a la zona visible.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

const FunctionItem: React.FC<{
  func: MathFunction;
  onEdit: (func: MathFunction) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
  onUpdateColor: (id: number, color: string) => void;
  themeClasses: typeof THEMES[Theme];
}> = ({ func, onEdit, onDelete, onToggleVisibility, onUpdateColor, themeClasses }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onUpdateColor(func.id, color);
    setIsColorPickerOpen(false);
  };
  
  const isSystem = func.type === 'system';

  return (
    <div className={`p-3 rounded-lg border ${themeClasses.border} ${themeClasses.buttonBg} transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => onToggleVisibility(func.id)}
              className="flex-shrink-0"
              aria-label={func.isVisible ? 'Hide function' : 'Show function'}
            >
              <i className={`fa-solid text-xl ${func.isVisible ? 'fa-eye text-green-500' : 'fa-eye-slash text-slate-400'}`}></i>
            </button>
             <button
              onClick={() => setIsAnalysisOpen(!isAnalysisOpen)}
              className="flex-shrink-0"
              aria-label="Show analysis"
            >
              <i className={`fa-solid fa-circle-info text-xl ${isAnalysisOpen ? `text-blue-500` : themeClasses.secondaryText}`}></i>
            </button>
          </div>
          <div className="truncate text-lg flex items-center">
            {isSystem && <span className="text-4xl font-thin mr-2">{'{'}</span>}
            <div className="flex flex-col">
              {func.expressions.map((expr, index) => (
                  <MathExpression key={index} expression={expr} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <div className="relative">
                <button
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  className="w-6 h-6 rounded-full border-2"
                  style={{ backgroundColor: func.color, borderColor: func.color }}
                  aria-label="Change color"
                />
            </div>
            <button onClick={() => onEdit(func)} className={`p-2 w-8 h-8 rounded ${themeClasses.buttonHover}`} aria-label="Edit function"><i className="fa-solid fa-pencil"></i></button>
            <button onClick={() => onDelete(func.id)} className={`p-2 w-8 h-8 rounded text-red-500 hover:bg-red-500 hover:text-white`} aria-label="Delete function"><i className="fa-solid fa-trash"></i></button>
        </div>
      </div>
      {isColorPickerOpen && (
          <div className="mt-3">
            <ColorPicker selectedColor={func.color} onSelect={handleColorSelect} themeClasses={themeClasses} />
          </div>
      )}
       {isAnalysisOpen && <AnalysisPanel func={func} themeClasses={themeClasses} />}
    </div>
  );
};


export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  functions,
  onEdit,
  onDelete,
  onToggleVisibility,
  onUpdateColor,
  theme
}) => {
  const themeClasses = THEMES[theme];

  return (
    <aside
      className={`absolute md:relative top-0 right-0 h-full w-full max-w-sm transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${themeClasses.sidePanelBg} border-l ${themeClasses.border}`}
    >
      <div className="p-4 h-full flex flex-col">
        <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-4`} style={{ borderColor: themeClasses.accent }}>
          Funcions i sistemes
        </h2>
        <div className="flex-grow flex flex-col">
            {functions.length === 0 ? (
              <div className={`flex-1 flex flex-col items-center justify-center text-center p-4 rounded-lg border-2 border-dashed ${themeClasses.border} ${themeClasses.secondaryText}`}>
                <i className="fa-solid fa-square-root-variable text-4xl mb-3"></i>
                <p className="font-semibold">No hi ha funcions</p>
                <p className="text-sm">Fes clic a 'Afegir' per començar a graficar.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 -mr-2">
                {functions.map(func => (
                  <FunctionItem
                    key={func.id}
                    func={func}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleVisibility={onToggleVisibility}
                    onUpdateColor={onUpdateColor}
                    themeClasses={themeClasses}
                  />
                ))}
              </div>
            )}
            <div className={`flex-shrink-0 mt-4 pt-4 border-t ${themeClasses.border} flex items-center gap-3 text-xs`}>
                <a 
                   href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   aria-label="Creative Commons License"
                   className="flex-shrink-0"
                 >
                    <img 
                      src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" 
                      alt="Llicència Creative Commons"
                      className="h-8 opacity-80"
                    />
                 </a>
                <div className="flex flex-col">
                  <p className={`${themeClasses.secondaryText}`}>Aplicació creada per Felip Sarroca amb l'assistència de la IA.</p>
                  <a 
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${themeClasses.secondaryText} hover:underline`}
                  >
                    Obra sota llicència CC BY-NC-SA 4.0
                  </a>
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};