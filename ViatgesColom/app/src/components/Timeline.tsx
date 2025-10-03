import { LuPause, LuPlay } from 'react-icons/lu'

import type { Episode } from '../types'

export interface TimelineProps {
  episodes: Episode[]
  activeIndex: number
  isPlaying: boolean
  onChange: (value: number) => void
  onTogglePlay: () => void
}

export const Timeline = ({ episodes, activeIndex, isPlaying, onChange, onTogglePlay }: TimelineProps) => {
  if (!episodes.length) {
    return null
  }

  const maxRange = Math.max(episodes.length - 1, 0)
  const denominator = Math.max(maxRange, 1)
  const currentEpisode = episodes[activeIndex]

  return (
    <section className="timeline">
      <header className="timeline__header">
        <div>
          <p className="timeline__tag">Línia de temps</p>
          <h2>{currentEpisode?.titol ?? 'Sense episodis'}</h2>
          <p className="timeline__meta">
            {currentEpisode?.data} · {currentEpisode?.lloc.nom_modern}
          </p>
        </div>
        <button type="button" className="timeline__play" onClick={onTogglePlay}>
          {isPlaying ? <LuPause /> : <LuPlay />}
          <span>{isPlaying ? 'Pausa l\'animació' : 'Reprodueix el viatge'}</span>
        </button>
      </header>
      <div className="timeline__slider">
        <input
          type="range"
          min={0}
          max={maxRange}
          value={activeIndex}
          onChange={(event) => onChange(Number(event.target.value))}
          step={1}
        />
        <div className="timeline__ticks">
          {episodes.map((episode, index) => (
            <span key={episode.ordre} className="timeline__tick" style={{ left: `${(index / denominator) * 100}%` }} />
          ))}
        </div>
      </div>
      <ol className="timeline__episodis">
        {episodes.map((episode, index) => {
          const isPast = index <= activeIndex
          const isCurrent = index === activeIndex
          return (
            <li
              key={episode.ordre}
              className={`timeline__episodi${isCurrent ? ' timeline__episodi--current' : isPast ? ' timeline__episodi--past' : ''}`}
            >
              <span className="timeline__ordre">{episode.ordre.toString().padStart(2, '0')}</span>
              <div>
                <p className="timeline__episodi-titol">{episode.titol}</p>
                <p className="timeline__episodi-data">{episode.data}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
