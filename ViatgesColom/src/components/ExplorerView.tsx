import { ChevronLeft, Layers3, ToggleLeft, ToggleRight } from "lucide-react";
import type { FC } from "react";
import { useMemo } from "react";

import { AudioButton } from "./AudioButton";
import { CuriositiesSection } from "./CuriositiesSection";
import { ColumbusMap } from "./map/ColumbusMap";
import { QuizSection } from "./quiz/QuizSection";
import { TimelineController } from "./timeline/TimelineController";
import { getIcon } from "./IconFactory";
import type { Voyage, VoyageId } from "../types";

interface ExplorerViewProps {
  voyages: Voyage[];
  selectedVoyages: VoyageId[];
  activeVoyage: VoyageId;
  compareMode: boolean;
  onToggleCompareMode: (enabled: boolean) => void;
  onBack: () => void;
  onSelectVoyage: (voyageId: VoyageId) => void;
  onToggleVoyageSelection: (voyageId: VoyageId) => void;
  timelineSteps: Record<VoyageId, number>;
  onTimelineChange: (voyageId: VoyageId, step: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const VoyageChip: FC<{
  voyage: Voyage;
  isActive: boolean;
  isSelected: boolean;
  compareMode: boolean;
  onSelect: () => void;
  onToggleSelection: () => void;
}> = ({ voyage, isActive, isSelected, compareMode, onSelect, onToggleSelection }) => {
  const Icon = getIcon(voyage.meta.icon);
  return (
    <div className={`voyage-chip ${isSelected ? "is-selected" : ""} ${isActive ? "is-active" : ""}`.trim()}>
      <button onClick={onSelect} className="voyage-chip__main" aria-pressed={isActive}>
        <Icon size={18} />
        <span>{voyage.meta.shortTitle}</span>
      </button>
      {compareMode && (
        <button
          className="voyage-chip__toggle"
          onClick={onToggleSelection}
          aria-pressed={isSelected}
          aria-label={isSelected ? "Treure del mapa" : "Mostrar al mapa"}
        >
          {isSelected ? "−" : "+"}
        </button>
      )}
    </div>
  );
};

export const ExplorerView: FC<ExplorerViewProps> = ({
  voyages,
  selectedVoyages,
  activeVoyage,
  compareMode,
  onToggleCompareMode,
  onBack,
  onSelectVoyage,
  onToggleVoyageSelection,
  timelineSteps,
  onTimelineChange,
  isPlaying,
  onTogglePlay,
}) => {
  const active = voyages.find((voyage) => voyage.id === activeVoyage) ?? voyages[0];
  const activeStep = timelineSteps[active.id] ?? 0;
  const currentEpisode =
    activeStep > 0 ? active.episodes[Math.min(activeStep - 1, active.episodes.length - 1)] : undefined;

  const curiosities = useMemo(() => {
    const seen = new Set<string>();
    const items: { text: string; source: string }[] = [];
    active.episodes.forEach((episode) => {
      episode.curiosities.forEach((text) => {
        const key = text.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          items.push({ text, source: episode.title });
        }
      });
    });
    return items.slice(0, 4);
  }, [active]);

  const indigenousVoices = useMemo(() => {
    const keywords = ["indígen", "taí", "carib", "veragua"];
    const results: { title: string; snippet: string }[] = [];
    active.episodes.forEach((episode) => {
      const pool = [episode.description, ...(episode.issues ?? []), ...episode.curiosities];
      const match = pool.find((text) => keywords.some((keyword) => text.toLowerCase().includes(keyword)));
      if (match) {
        results.push({ title: episode.title, snippet: match });
      }
    });
    return results.slice(0, 3);
  }, [active]);

  const comparisonHighlights = useMemo(() => {
    if (!compareMode) {
      return [] as Array<{
        id: VoyageId;
        shortTitle: string;
        years: string;
        goal: string;
        highlight: string;
        issue: string;
        result: string;
        color: string;
      }>;
    }
    return selectedVoyages
      .map((id) => voyages.find((voyage) => voyage.id === id))
      .filter((voyage): voyage is Voyage => Boolean(voyage))
      .map((voyage) => ({
        id: voyage.id,
        shortTitle: voyage.meta.shortTitle,
        years: voyage.years,
        goal: voyage.goal,
        highlight: voyage.meta.tagline,
        issue: voyage.generalIssues[0] ?? "",
        result: voyage.results[0] ?? "",
        color: voyage.meta.theme.primary,
      }));
  }, [compareMode, selectedVoyages, voyages]);

  return (
    <div className="explorer" role="main">
      <header className="explorer__header">
        <button className="ghost" onClick={onBack}>
          <ChevronLeft size={18} />
          Tornar a l&apos;inici
        </button>
        <div className="explorer__chips" role="tablist">
          {voyages.map((voyage) => (
            <VoyageChip
              key={voyage.id}
              voyage={voyage}
              isActive={voyage.id === activeVoyage}
              isSelected={selectedVoyages.includes(voyage.id)}
              compareMode={compareMode}
              onSelect={() => onSelectVoyage(voyage.id)}
              onToggleSelection={() => onToggleVoyageSelection(voyage.id)}
            />
          ))}
        </div>
        <div className="explorer__compare">
          <Layers3 size={18} />
          <span>Mode comparatiu</span>
          <button
            className="icon"
            onClick={() => onToggleCompareMode(!compareMode)}
            aria-pressed={compareMode}
            aria-label="Alternar mode comparatiu"
          >
            {compareMode ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
          </button>
        </div>
      </header>

      <div className="explorer__layout">
        <div className="explorer__map">
          <ColumbusMap
            voyages={voyages}
            selectedVoyages={compareMode ? selectedVoyages : [activeVoyage]}
            activeVoyage={activeVoyage}
            timelineSteps={timelineSteps}
            onEpisodeSelect={(voyageId, nextStep) => {
              onSelectVoyage(voyageId);
              onTimelineChange(voyageId, nextStep);
            }}
          />
          <TimelineController
            voyage={active}
            step={activeStep}
            onStepChange={(value) => onTimelineChange(active.id, value)}
            isPlaying={isPlaying}
            onTogglePlay={onTogglePlay}
          />
          {compareMode && comparisonHighlights.length > 1 && (
            <section className="comparison" aria-label="Comparativa ràpida">
              <h3>Comparativa ràpida</h3>
              <div className="comparison__grid">
                {comparisonHighlights.map((item) => (
                  <article key={item.id} style={{ borderColor: item.color }}>
                    <header>
                      <span style={{ background: item.color }} />
                      <strong>{item.shortTitle}</strong>
                      <span>{item.years}</span>
                    </header>
                    <p>{item.highlight}</p>
                    <ul>
                      <li><span>Objectiu</span>{item.goal}</li>
                      <li><span>Conflicte clau</span>{item.issue}</li>
                      <li><span>Resultat</span>{item.result}</li>
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="explorer__panel">
          <header>
            <span className="panel__tag">{active.meta.shortTitle}</span>
            <h2>{active.title}</h2>
            <p className="panel__tagline">{active.meta.tagline}</p>
          </header>

          <dl className="panel__facts">
            <div>
              <dt>Objectiu</dt>
              <dd>{active.goal}</dd>
            </div>
            <div>
              <dt>Vaixells</dt>
              <dd>
                {active.ships.map((ship) => (
                  <span key={ship.name}>{ship.name} · {ship.type} · {ship.fate}</span>
                ))}
              </dd>
            </div>
          </dl>

          <section className="panel__lists">
            <div>
              <h3>Problemes generals</h3>
              <ul>
                {active.generalIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Resultats</h3>
              <ul>
                {active.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="panel__episode">
            <h3>Episodi actual</h3>
            {currentEpisode ? (
              <>
                <div className="panel__episode-header">
                  <div>
                    <h4>{currentEpisode.title}</h4>
                    <span>{currentEpisode.date} · {currentEpisode.place.modernName}</span>
                  </div>
                  <AudioButton text={`${currentEpisode.title}. ${currentEpisode.description}`} compact />
                </div>
                <p>{currentEpisode.description}</p>
                {currentEpisode.curiosities.length > 0 && (
                  <ul className="panel__episode-curiosities">
                    {currentEpisode.curiosities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p>Fes avançar la línia de temps per descobrir el viatge.</p>
            )}
          </section>

          <CuriositiesSection items={curiosities} />

          {indigenousVoices.length > 0 && (
            <section className="panel__voices">
              <h3>Veu indígena</h3>
              <ul>
                {indigenousVoices.map((voice) => (
                  <li key={voice.title}>
                    <strong>{voice.title}</strong>
                    <span>{voice.snippet}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <QuizSection voyageId={active.id} voyageTitle={active.meta.shortTitle} />

          <section className="panel__debate">
            <h3>Per debatre a classe</h3>
            <p>Colom, heroi o tirà? Contrasta fonts i construeix un argument.</p>
            <a
              className="primary ghost"
              href="https://www.sapiens.cat/identitats/historia-moderna/colom-heroi-o-vila_15267.html"
              target="_blank"
              rel="noreferrer"
            >
              Obrir lectura suggerida
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
};
