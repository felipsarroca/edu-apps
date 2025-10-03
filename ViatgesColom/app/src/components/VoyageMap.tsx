import { memo, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet'
import { latLngBounds, type LatLngBoundsExpression } from 'leaflet'

import type { Episode, Voyage } from '../types'

const MAP_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '360px',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 24px 48px -32px rgba(15, 23, 42, 0.6)',
}

const BoundsUpdater = ({ bounds }: { bounds: LatLngBoundsExpression }) => {
  const map = useMap()

  useEffect(() => {
    map.fitBounds(bounds, { padding: [40, 40], animate: true })
  }, [map, bounds])

  return null
}

export interface VoyageMapProps {
  voyages: Voyage[]
  primaryVoyage: Voyage | null
  activeEpisodeIndex: number
  showAll: boolean
}

const getEpisodeCoords = (episode: Episode) => episode.lloc.coordenades ?? undefined

const VoyageMapComponent = ({ voyages, primaryVoyage, activeEpisodeIndex, showAll }: VoyageMapProps) => {
  const bounds = useMemo(() => {
    const allCoords: [number, number][] = []
    voyages.forEach((voyage) => {
      voyage.episodis.forEach((episode) => {
        const coords = getEpisodeCoords(episode)
        if (coords) {
          allCoords.push(coords)
        }
      })
    })

    if (!allCoords.length) {
      return latLngBounds([
        [8, -90],
        [42, -10],
      ])
    }

    return latLngBounds(allCoords)
  }, [voyages])

  return (
    <div className="map-card">
      <header className="map-card__header">
        <div>
          <p className="map-card__tag">Mapa interactiu</p>
          <h2>{showAll ? 'Comparativa de rutes' : primaryVoyage?.titol ?? 'Exploració atlàntica'}</h2>
        </div>
        <p className="map-card__hint">
          Clica els punts per descobrir què va passar a cada indret. Les rutes s&apos;il·luminen a mesura que avances
          per la cronologia.
        </p>
      </header>
      <MapContainer
        key={primaryVoyage?.id ?? 'all'}
        bounds={bounds}
        zoomControl={false}
        scrollWheelZoom={false}
        style={MAP_STYLE}
        className="map-card__container"
      >
        <BoundsUpdater bounds={bounds} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> / <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {voyages.map((voyage) => {
          const route = voyage.episodis
            .map(getEpisodeCoords)
            .filter((coords): coords is [number, number] => Boolean(coords))

          if (!route.length) {
            return null
          }

          const isPrimary = primaryVoyage?.id === voyage.id
          const highlightUpto = isPrimary ? Math.min(activeEpisodeIndex, route.length - 1) : route.length - 1

          return (
            <div key={voyage.id}>
              <Polyline
                positions={route}
                pathOptions={{
                  color: voyage.color,
                  weight: 4,
                  opacity: showAll || !isPrimary ? 0.55 : 0.28,
                  dashArray: showAll && !isPrimary ? '6 10' : undefined,
                }}
              />
              {isPrimary && highlightUpto >= 1 ? (
                <Polyline
                  positions={route.slice(0, highlightUpto + 1)}
                  pathOptions={{ color: voyage.color, weight: 6, opacity: 0.85 }}
                />
              ) : null}
              {voyage.episodis.map((episode, index) => {
                const coords = getEpisodeCoords(episode)
                if (!coords) {
                  return null
                }

                const isPrimaryEpisode = isPrimary
                const isCurrent = isPrimaryEpisode && index === activeEpisodeIndex
                const isVisited = isPrimaryEpisode && index <= activeEpisodeIndex

                return (
                  <CircleMarker
                    key={`${voyage.id}-${episode.ordre}`}
                    center={coords}
                    radius={isCurrent ? 10 : isVisited ? 7 : 5}
                    pathOptions={{
                      color: voyage.color,
                      weight: isCurrent ? 4 : 2,
                    }}
                    fillOpacity={isVisited || showAll ? 0.9 : 0.4}
                  >
                    <Tooltip direction="top" offset={[0, -12]} opacity={0.9} permanent={isCurrent}>
                      <span className="map-card__tooltip">{episode.titol}</span>
                    </Tooltip>
                    <Popup>
                      <div className="map-card__popup">
                        <p className="map-card__popup-tag" style={{ color: voyage.color }}>
                          {voyage.titol}
                        </p>
                        <h3>{episode.titol}</h3>
                        <p className="map-card__popup-meta">
                          {episode.data} · {episode.lloc.nom_modern}
                        </p>
                        <p>{episode.descripcio}</p>
                        {episode.curiositats?.length ? (
                          <ul className="map-card__popup-curiositats">
                            {episode.curiositats.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                        {episode.problemes?.length ? (
                          <div className="map-card__popup-alertes">
                            <p>Alertes:</p>
                            <ul>
                              {episode.problemes.map((problema) => (
                                <li key={problema}>{problema}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {episode.resolucio ? <p className="map-card__popup-resolucio">Resolució: {episode.resolucio}</p> : null}
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </div>
          )
        })}
      </MapContainer>
    </div>
  )
}

export const VoyageMap = memo(VoyageMapComponent)
