import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Graph, GraphRef } from './components/Graph';
import { SidePanel } from './components/SidePanel';
import { EquationEditorModal } from './components/EquationEditorModal';
import { Header } from './components/Header';
import { InfoModal } from './components/InfoModal';
import type { MathFunction, Theme, ViewConfig } from './types';
import { THEMES, COLORS } from './constants';

const App: React.FC = () => {
  const [functions, setFunctions] = useState<MathFunction[]>([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState<MathFunction | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    grid: true,
    labels: true,
    points: true,
  });
  const graphRef = useRef<GraphRef | null>(null);

  const handleAddFunction = (func: Omit<MathFunction, 'id' | 'color' | 'isVisible'>) => {
    const nextColor = COLORS[functions.length % COLORS.length];
    setFunctions(prev => [...prev, { ...func, id: Date.now(), color: nextColor, isVisible: true }]);
  };

  const handleUpdateFunction = (id: number, updatedFunc: Omit<MathFunction, 'id' | 'color' | 'isVisible'>) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, ...updatedFunc } : f));
  };
  
  const handleSaveFunction = (funcData: Omit<MathFunction, 'id' | 'color' | 'isVisible'>) => {
    if (editingFunction) {
      handleUpdateFunction(editingFunction.id, funcData);
    } else {
      handleAddFunction(funcData);
    }
    setIsModalOpen(false);
    setEditingFunction(null);
  };

  const openAddModal = () => {
    setEditingFunction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (func: MathFunction) => {
    setEditingFunction(func);
    setIsModalOpen(true);
  };

  const handleDeleteFunction = useCallback((id: number) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleToggleVisibility = useCallback((id: number) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, isVisible: !f.isVisible } : f));
  }, []);

  const handleUpdateColor = useCallback((id: number, color: string) => {
    setFunctions(prev => prev.map(f => f.id === id ? { ...f, color } : f));
  }, []);
  
  const handleDownloadGraph = () => {
    graphRef.current?.downloadImage();
  };

  const themeClasses = useMemo(() => THEMES[theme], [theme]);

  return (
    <div className={`flex h-screen font-sans ${themeClasses.bg} ${themeClasses.text}`}>
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          theme={theme}
          setTheme={setTheme}
          onAddClick={openAddModal}
          onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
          isSidePanelOpen={isSidePanelOpen}
          onInfoClick={() => setIsInfoModalOpen(true)}
          onDownloadClick={handleDownloadGraph}
        />
        <div className="flex-1 relative">
          <Graph ref={graphRef} functions={functions.filter(f => f.isVisible)} theme={theme} viewConfig={viewConfig} />
        </div>
      </main>
      
      <SidePanel 
        isOpen={isSidePanelOpen}
        functions={functions} 
        onEdit={openEditModal}
        onDelete={handleDeleteFunction}
        onToggleVisibility={handleToggleVisibility}
        onUpdateColor={handleUpdateColor}
        theme={theme}
      />
      
      {isModalOpen && (
        <EquationEditorModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingFunction(null);
          }}
          onSave={handleSaveFunction}
          existingFunction={editingFunction}
          theme={theme}
        />
      )}

      <InfoModal 
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        theme={theme}
      />
    </div>
  );
};

export default App;