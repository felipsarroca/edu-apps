import { useEffect, useMemo, useState } from 'react'

import { VoyageSelector } from './components/VoyageSelector'
import { VoyageMap } from './components/VoyageMap'
import { Timeline } from './components/Timeline'
import { InfoPanel } from './components/InfoPanel'
import { VOYAGES } from './data/viatges'
import type { Voyage, VoyageId } from './types'

import './App.css'

const DEFAULT_VOYAGE: VoyageId = 'viatge1'

export default function App() {
  const [selectedId, setSelectedId] = useState<VoyageId | 'all'>(DEFAULT_VOYAGE)
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedVoyage: Voyage | null = useMemo(() => {
    if (selectedId === 'all') {
      return null
    }
    return VOYAGES.find((voyage) => voyage.id === selectedId) ?? null
  }, [selectedId])

  useEffect(() => {
    setActiveEpisodeIndex(0)
    setIsPlaying(false)
  }, [selectedId])

  useEffect(() => {
    if (!isPlaying || !selectedVoyage) {
      return
    }

    const maxIndex = selectedVoyage.episodis.length - 1
    if (maxIndex <= 0) {
      setIsPlaying(false)
      return
    }

    const timer = window.setInterval(() => {
      setActiveEpisodeIndex((current) => {
        if (current >= maxIndex) {
          window.clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, 2600)

    return () => window.clearInterval(timer)
  }, [isPlaying, selectedVoyage])

  const visibleVoyages = selectedId === 'all' ? VOYAGES : selectedVoyage ? [selectedVoyage] : []
  const activeEpisode = selectedVoyage?.episodis[activeEpisodeIndex]

  return (
    <div className="page">
      <main className="layout">
        <header className="hero">
          <p className="hero__pretitle">Projecte interdisciplinari · ESO</p>
          <h1>Els viatges de Colom: de la glòria al naufragi</h1>
          <p className="hero__lead">
            Explora les quatre expedicions de Cristòfor Colom amb un mapa interactiu, línia de temps gamificada i fitxes
            didàctiques pensades per a l&apos;aula. Dissenyat per treballar de manera competencial, visual i accessible.
          </p>
          <div className="hero__chips">
            <span>Història</span>
            <span>Competència digital</span>
            <span>Lectura crítica</span>
            <span>Gamificació</span>
          </div>
        </header>

        <VoyageSelector selectedId={selectedId} onSelect={setSelectedId} />

        <section className="layout__grid">
          <VoyageMap
            voyages={visibleVoyages}
            primaryVoyage={selectedVoyage}
            activeEpisodeIndex={activeEpisodeIndex}
            showAll={selectedId === 'all'}
          />
          <InfoPanel voyage={selectedVoyage} voyages={VOYAGES} activeEpisode={activeEpisode} />
        </section>

        {selectedVoyage ? (
          <Timeline
            episodes={selectedVoyage.episodis}
            activeIndex={activeEpisodeIndex}
            isPlaying={isPlaying}
            onChange={(value) => {
              setActiveEpisodeIndex(value)
              setIsPlaying(false)
            }}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
          />
        ) : (
          <section className="timeline timeline--placeholder">
            <h2>Selecciona un viatge per activar la línia de temps</h2>
            <p>
              A la vista comparativa tens totes les rutes superposades. Tria un viatge concret per animar el recorregut
              i accedir als detalls episodis a episodi.
            </p>
          </section>
        )}

        <section className="extras">
          <article>
            <h3>Curiositats per provocar debat</h3>
            <p>
              Cada episodi incorpora preguntes «Sabies que...?» per despertar la curiositat de l&apos;alumnat i connectar
              amb fonts històriques primàries.
            </p>
          </article>
          <article>
            <h3>Mini-quiz autoavaluatiu</h3>
            <p>
              Després de cada viatge podràs afegir un qüestionari breu (ex. Google Forms o Kahoot). Els resultats poden
              exportar-se a Classroom fàcilment.
            </p>
          </article>
          <article>
            <h3>Medalles digitals</h3>
            <p>
              En completar un viatge, l&apos;alumnat desbloqueja una medalla temàtica (Explorador del Nou Món, Guardianes de
              La Isabela...). Pots lliurar-les o publicar-les al Classroom.
            </p>
          </article>
        </section>
      </main>

      <footer className="footer">
        <p>Aplicació creada per Felip Sarroca amb l&apos;assistència de la IA</p>
        <div className="footer__license">
          <img src="/imatges/CC_BY-NC-SA.svg" alt="Llicència Creative Commons BY-NC-SA" />
          <small>
            Obra sota llicència{' '}
            <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noreferrer">
              CC BY-NC-SA 4.0
            </a>
          </small>
        </div>
      </footer>
    </div>
  )
}
