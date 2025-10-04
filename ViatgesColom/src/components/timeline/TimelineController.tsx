import { Pause, Play } from "lucide-react";
import type { FC } from "react";
import { useMemo } from "react";

import type { Episode, Voyage } from "../../types";

interface TimelineControllerProps {
  voyage: Voyage;
  step: number;
  onStepChange: (nextStep: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const formatStepLabel = (episode: Episode | undefined, step: number): string => {
  if (!episode || step === 0) {
    return "Preparatius";
  }
  return `${step.toString().padStart(2, "0")}. ${episode.title}`;
};

export const TimelineController: FC<TimelineControllerProps> = ({ voyage, step, onStepChange, isPlaying, onTogglePlay }) => {
  const total = voyage.episodes.length;
  const activeEpisode = step > 0 ? voyage.episodes[Math.min(step - 1, total - 1)] : undefined;
  const label = formatStepLabel(activeEpisode, step);

  const milestones = useMemo(() => {
    return voyage.episodes.map((episode, index) => ({ order: index + 1, title: episode.title, date: episode.date }));
  }, [voyage.episodes]);

  return (
    <section className="timeline" aria-label="Línia de temps interactiva">
      <div className="timeline__header">
        <div>
          <span className="timeline__badge">{voyage.meta.shortTitle}</span>
          <h3>{label}</h3>
          {activeEpisode && <p>{activeEpisode.date} · {activeEpisode.place.modernName}</p>}
        </div>
        <button className="icon" onClick={onTogglePlay} aria-label={isPlaying ? "Aturar animació" : "Reproduir animació"}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      <div className="timeline__slider">
        <input
          type="range"
          min={0}
          max={total}
          value={step}
          onChange={(event) => onStepChange(Number(event.currentTarget.value))}
        />
        <div className="timeline__ticks" aria-hidden>
          {milestones.map((milestone) => (
            <span key={milestone.order} style={{ left: `${(milestone.order / total) * 100}%` }} />
          ))}
        </div>
      </div>

      <footer className="timeline__footer">
        <span>{step}/{total} episodis</span>
        <span>{voyage.years}</span>
      </footer>
    </section>
  );
};
