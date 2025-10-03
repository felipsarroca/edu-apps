import { LuAlertTriangle, LuAudioLines, LuSparkles, LuTrophy } from 'react-icons/lu'
import { TbTargetArrow } from 'react-icons/tb'
import { GiSailboat } from 'react-icons/gi'

import type { Episode, Voyage } from '../types'

interface InfoPanelProps {
  voyage: Voyage | null
  voyages: Voyage[]
  activeEpisode?: Episode
}

const badgePalette = ['#0ea5e9', '#f97316', '#8b5cf6', '#22c55e']

export const InfoPanel = ({ voyage, voyages, activeEpisode }: InfoPanelProps) => {
  if (!voyage) {
    return (
      <aside className="info info--comparison">
        <header>
          <p className="info__tag">Comparativa ràpida</p>
          <h2>Quatre viatges, un imperi en transformació</h2>
          <p className="info__intro">
            Observa com evoluciona l&apos;objectiu de Colom a cada expedició. Usa el mapa per veure com s&apos;obren noves
            rutes i territoris.
          </p>
        </header>
        <div className="info__matrix">
          {voyages.map((item, index) => (
            <article key={item.id} className="info__matrix-card">
              <header style={{ borderColor: item.color }}>
                <span className="info__matrix-badge" style={{ backgroundColor: badgePalette[index % badgePalette.length] }} />
                <div>
                  <h3>{item.titol}</h3>
                  <p>{item.anys}</p>
                </div>
              </header>
              <dl>
                <div>
                  <dt>Finalitat</dt>
                  <dd>{item.finalitat}</dd>
                </div>
                <div>
                  <dt>Resultat destacat</dt>
                  <dd>{item.resultats[0]}</dd>
                </div>
                <div>
                  <dt>Problema clau</dt>
                  <dd>{item.problemes_generals[0]}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </aside>
    )
  }

  const curiositats = activeEpisode?.curiositats ?? []

  return (
    <aside className="info">
      <header>
        <p className="info__tag">Dades essencials</p>
        <h2>{voyage.titol}</h2>
        <p className="info__intro">{voyage.finalitat}</p>
      </header>

      <section className="info__section">
        <h3>
          <TbTargetArrow /> Objectiu del viatge
        </h3>
        <p>{voyage.finalitat}</p>
      </section>

      <section className="info__section">
        <h3>
          <GiSailboat /> Vaixells i destinacions
        </h3>
        <ul className="info__ships">
          {voyage.vaixells.map((ship) => (
            <li key={ship.nom}>
              <span>{ship.nom}</span>
              <small>{ship.tipus}</small>
              <p>{ship.desti}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="info__section info__section--stack">
        <div>
          <h3>
            <LuAlertTriangle /> Problemes recurrents
          </h3>
          <ul className="info__chips info__chips--warning">
            {voyage.problemes_generals.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>
            <LuTrophy /> Resultats
          </h3>
          <ul className="info__chips info__chips--success">
            {voyage.resultats.map((resultat) => (
              <li key={resultat}>{resultat}</li>
            ))}
          </ul>
        </div>
      </section>

      {activeEpisode ? (
        <section className="info__section">
          <h3>
            <LuSparkles /> Episodi actual: {activeEpisode.titol}
          </h3>
          <p className="info__episode-meta">
            {activeEpisode.data} · {activeEpisode.lloc.nom_modern} ({activeEpisode.lloc.nom_antic})
          </p>
          <p>{activeEpisode.descripcio}</p>
          {curiositats.length ? (
            <ul className="info__curiositats">
              {curiositats.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {activeEpisode.problemes?.length ? (
            <div className="info__episode-alertes">
              <h4>Conflictes en aquest punt</h4>
              <ul>
                {activeEpisode.problemes.map((problema) => (
                  <li key={problema}>{problema}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {activeEpisode.resolucio ? <p className="info__episode-resolucio">Resolució: {activeEpisode.resolucio}</p> : null}
          <button type="button" className="info__audio">
            <LuAudioLines /> Escolta la narració (properament)
          </button>
        </section>
      ) : null}
    </aside>
  )
}
