import { useEffect, useMemo, useState } from "react";

import { ExplorerView } from "./components/ExplorerView";
import { FooterBar } from "./components/FooterBar";
import { LandingView } from "./components/LandingView";
import { useVoyagesData } from "./hooks/useVoyagesData";
import type { Voyage, VoyageId } from "./types";

const clampStep = (value: number, max: number) => Math.min(Math.max(0, value), max);

const buildInitialSteps = (voyages: Voyage[]) =>
  voyages.reduce<Record<VoyageId, number>>((acc, voyage) => {
    acc[voyage.id] = 1;
    return acc;
  }, {} as Record<VoyageId, number>);

const ensureSelectionIncludes = (selection: VoyageId[], id: VoyageId): VoyageId[] =>
  selection.includes(id) ? selection : [id, ...selection];

const removeFromSelection = (selection: VoyageId[], id: VoyageId, fallback: VoyageId): VoyageId[] => {
  const filtered = selection.filter((item) => item !== id);
  if (!filtered.length) {
    return [fallback];
  }
  return filtered;
};

const App = () => {
  const { voyages, loading, errorMessage } = useVoyagesData();
  const [view, setView] = useState<"landing" | "explore">("landing");
  const [activeVoyage, setActiveVoyage] = useState<VoyageId | null>(null);
  const [selectedVoyages, setSelectedVoyages] = useState<VoyageId[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<Record<VoyageId, number>>({} as Record<VoyageId, number>);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (voyages.length && !activeVoyage) {
      setActiveVoyage(voyages[0].id);
      setSelectedVoyages([voyages[0].id]);
      setTimelineSteps(buildInitialSteps(voyages));
    }
  }, [voyages, activeVoyage]);

  const activeVoyageData = useMemo(
    () => voyages.find((voyage) => voyage.id === activeVoyage) ?? voyages[0],
    [voyages, activeVoyage],
  );

  useEffect(() => {
    if (!activeVoyage) {
      return;
    }
    setSelectedVoyages((prev) => ensureSelectionIncludes(prev, activeVoyage));
  }, [activeVoyage]);

  useEffect(() => {
    if (!isPlaying || !activeVoyageData) {
      return;
    }
    const totalEpisodes = activeVoyageData.episodes.length;
    const tick = window.setInterval(() => {
      setTimelineSteps((prev) => {
        const current = prev[activeVoyageData.id] ?? 0;
        const next = clampStep(current + 1, totalEpisodes);
        if (next === current) {
          window.clearInterval(tick);
          setIsPlaying(false);
          return prev;
        }
        return { ...prev, [activeVoyageData.id]: next };
      });
    }, 1800);

    return () => window.clearInterval(tick);
  }, [isPlaying, activeVoyageData]);

  useEffect(() => {
    if (!compareMode && activeVoyage) {
      setSelectedVoyages([activeVoyage]);
    }
  }, [compareMode, activeVoyage]);

  const handleStartSingle = (voyageId: VoyageId) => {
    setView("explore");
    setCompareMode(false);
    setActiveVoyage(voyageId);
    setSelectedVoyages([voyageId]);
  };

  const handleStartCompare = () => {
    setView("explore");
    setCompareMode(true);
    setSelectedVoyages(voyages.map((voyage) => voyage.id));
    if (activeVoyage) {
      setActiveVoyage(activeVoyage);
    } else if (voyages.length) {
      setActiveVoyage(voyages[0].id);
    }
  };

  const handleToggleCompareMode = (enabled: boolean) => {
    setCompareMode(enabled);
    if (enabled) {
      setSelectedVoyages((prev) => ensureSelectionIncludes(prev, activeVoyageData.id));
    } else {
      setSelectedVoyages([activeVoyageData.id]);
    }
  };

  const handleSelectVoyage = (voyageId: VoyageId) => {
    setActiveVoyage(voyageId);
    setSelectedVoyages((prev) => ensureSelectionIncludes(prev, voyageId));
  };

  const handleToggleVoyageSelection = (voyageId: VoyageId) => {
    if (!compareMode) {
      return;
    }
    setSelectedVoyages((prev) =>
      prev.includes(voyageId)
        ? removeFromSelection(prev, voyageId, activeVoyageData.id)
        : ensureSelectionIncludes(prev, voyageId),
    );
  };

  const handleTimelineChange = (voyageId: VoyageId, step: number) => {
    const voyage = voyages.find((item) => item.id === voyageId);
    if (!voyage) {
      return;
    }
    setTimelineSteps((prev) => ({
      ...prev,
      [voyageId]: clampStep(step, voyage.episodes.length),
    }));
  };

  const handleTogglePlay = () => {
    if (!activeVoyageData) {
      return;
    }
    const currentStep = timelineSteps[activeVoyageData.id] ?? 0;
    if (currentStep >= activeVoyageData.episodes.length) {
      setTimelineSteps((prev) => ({ ...prev, [activeVoyageData.id]: 0 }));
    }
    setIsPlaying((prev) => !prev);
  };

  if (loading || !activeVoyageData) {
    return (
      <div className="app-shell">
        <div className="loading">
          <div className="loading__spinner" />
          <p>Carregant dades dels viatges...</p>
        </div>
        <FooterBar />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="app-shell">
        <div className="error">
          <p>S&apos;ha produït un error: {errorMessage}</p>
        </div>
        <FooterBar />
      </div>
    );
  }

  const mainView =
    view === "landing" ? (
      <LandingView voyages={voyages} onStartSingle={handleStartSingle} onStartCompare={handleStartCompare} />
    ) : (
      <ExplorerView
        voyages={voyages}
        selectedVoyages={compareMode ? selectedVoyages : [activeVoyageData.id]}
        activeVoyage={activeVoyageData.id}
        compareMode={compareMode}
        onToggleCompareMode={handleToggleCompareMode}
        onBack={() => setView("landing")}
        onSelectVoyage={handleSelectVoyage}
        onToggleVoyageSelection={handleToggleVoyageSelection}
        timelineSteps={timelineSteps}
        onTimelineChange={handleTimelineChange}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
      />
    );

  return (
    <div className="app-shell">
      {mainView}
      <FooterBar />
    </div>
  );
};

export default App;

