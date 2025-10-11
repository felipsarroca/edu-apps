import React from 'react';
import type { Theme } from '../types';
import { THEMES } from '../constants';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, theme }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const themeClasses = THEMES[theme];

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div 
        className={`rounded-lg shadow-2xl w-full max-w-2xl ${themeClasses.panelBg} border ${themeClasses.border} transition-all duration-200 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 border-b ${themeClasses.border} flex justify-between items-center flex-shrink-0`}>
          <h2 className="text-xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-rocket text-blue-500"></i>
            Benvingut/da a la Graficadora+
          </h2>
          <button onClick={handleClose} className={`p-2 rounded-full -mr-2 -mt-2 ${themeClasses.buttonHover}`}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
            <p className={themeClasses.secondaryText}>Aquesta eina et permet visualitzar funcions matemàtiques, inequacions i sistemes de manera interactiva.</p>

            <div>
                <h3 className="font-bold text-lg mb-2">Com començar</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Afegir una funció:</strong> Fes clic al botó <span className="font-mono p-1 rounded bg-blue-500 text-white text-xs">+ Afegir</span> per obrir l'editor.</li>
                    <li><strong>Tipus:</strong> Pots graficar <code className={`${themeClasses.buttonBg} p-1 rounded`}>equacions</code> (ex: <code className="font-mono">y = x^2</code>), <code className={`${themeClasses.buttonBg} p-1 rounded`}>inequacions</code> (ex: <code className="font-mono">y &gt; sin(x)</code>), <code className={`${themeClasses.buttonBg} p-1 rounded`}>intervals</code> (ex: <code className="font-mono">-2 &lt; x &lt; 2</code>) o <code className={`${themeClasses.buttonBg} p-1 rounded`}>sistemes</code> d'equacions.</li>
                     <li><strong>Domini restringit:</strong> Per a les equacions, pots limitar el domini on es dibuixa la funció (ex: <code className="font-mono">0 &lt; x &lt; 5</code> o <code className="font-mono">x &gt; 1</code>).</li>
                    <li><strong>Teclat virtual:</strong> Utilitza el teclat a l'editor per introduir expressions complexes fàcilment.</li>
                </ul>
            </div>

             <div>
                <h3 className="font-bold text-lg mb-2">Interactuar amb la gràfica</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Moure (Pan):</strong> Fes clic i arrossega per desplaçar-te per la gràfica.</li>
                    <li><strong>Zoom:</strong> Fes servir la roda del ratolí o pessiga a la pantalla tàctil per apropar o allunyar.</li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-2">Gestionar les funcions</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Panell lateral:</strong> Totes les teves funcions apareixen al panell de la dreta. Pots obrir-lo o tancar-lo amb el botó <i className="fa-solid fa-bars"></i>.</li>
                    <li><strong>Visibilitat:</strong> Fes clic a la icona de l'ull (<i className="fa-solid fa-eye text-green-500"></i>) per mostrar o amagar una funció.</li>
                    <li><strong>Editar i Eliminar:</strong> Utilitza les icones del llapis (<i className="fa-solid fa-pencil"></i>) i la paperera (<i className="fa-solid fa-trash text-red-500"></i>).</li>
                    <li><strong>Color:</strong> Fes clic al cercle de color per personalitzar-lo.</li>
                    <li><strong>Anàlisi:</strong> Fes clic a la icona d'informació (<i className="fa-solid fa-circle-info text-blue-500"></i>) per veure'n el domini, arrels, solucions del sistema i més.</li>
                </ul>
            </div>

            <div>
                <h3 className="font-bold text-lg mb-2">Eines Addicionals</h3>
                 <ul className="list-disc list-inside space-y-1">
                    <li><strong>Canviar Tema:</strong> Personalitza l'aparença visual amb el botó de temes (<i className="fa-solid fa-sun"></i> / <i className="fa-solid fa-moon"></i>).</li>
                    <li><strong>Descarregar Imatge:</strong> Fes clic al botó del disquet (<i className="fa-solid fa-floppy-disk"></i>) per descarregar la gràfica actual com una imatge PNG d'alta qualitat, ideal per a documents i presentacions.</li>
                 </ul>
            </div>
        </div>
        <div className={`p-4 border-t ${themeClasses.border} flex justify-end flex-shrink-0`}>
            <button onClick={handleClose} className={`px-5 py-2 rounded-lg font-semibold transition-colors ${themeClasses.accentButtonClasses}`}>
              Entesos!
            </button>
        </div>
      </div>
    </div>
  );
};