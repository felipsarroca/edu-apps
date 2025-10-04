import type { FC } from "react";
import { Fragment, useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

import type { CoordinateTuple, Episode, Voyage, VoyageId } from "../../types";

interface ColumbusMapProps {
  voyages: Voyage[];
  selectedVoyages: VoyageId[];
  activeVoyage: VoyageId;
  timelineSteps: Record<VoyageId, number>;
  onEpisodeSelect?: (voyageId: VoyageId, episodeOrder: number) => void;
}

const DEFAULT_CENTER: CoordinateTuple = [22.0, -40.0];

const collectCoordinatesUpToStep = (episodes: Episode[], step: number): CoordinateTuple[] => {
  const coords: CoordinateTuple[] = [];
  episodes.forEach((episode, index) => {
    if (index < step && episode.place.coordinates) {
      coords.push(episode.place.coordinates);
    }
  });
  return coords;
};

const collectAllCoordinates = (episodes: Episode[]): CoordinateTuple[] => {
  const coords: CoordinateTuple[] = [];
  episodes.forEach((episode) => {
    if (episode.place.coordinates) {
      coords.push(episode.place.coordinates);
    }
  });
  return coords;
};

const computeBounds = (coordinateSets: CoordinateTuple[][]): LatLngBoundsExpression | null => {
  const flat = coordinateSets.flat();
  if (!flat.length) {
    return null;
  }
  let minLat = flat[0][0];
  let maxLat = flat[0][0];
  let minLng = flat[0][1];
  let maxLng = flat[0][1];

  flat.forEach(([lat, lng]) => {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
};

const FitToBounds: FC<{ bounds: LatLngBoundsExpression | null }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [bounds, map]);

  return null;
};

const FocusCurrentEpisode: FC<{ episode?: Episode }> = ({ episode }) => {
  const map = useMap();
  useEffect(() => {
    if (episode?.place.coordinates) {
      map.flyTo(episode.place.coordinates, map.getZoom(), { duration: 1.2 });
    }
  }, [episode, map]);
  return null;
};

export const ColumbusMap: FC<ColumbusMapProps> = ({
  voyages,
  selectedVoyages,
  activeVoyage,
  timelineSteps,
  onEpisodeSelect,
}) => {
  const voyagesToRender = useMemo(
    () => voyages.filter((voyage) => selectedVoyages.includes(voyage.id)),
    [voyages, selectedVoyages],
  );

  const bounds = useMemo(() => {
    if (!voyagesToRender.length) {
      return null;
    }
    const coordSets = voyagesToRender.map((voyage) => collectAllCoordinates(voyage.episodes));
    return computeBounds(coordSets);
  }, [voyagesToRender]);

  const activeVoyageData = voyagesToRender.find((voyage) => voyage.id === activeVoyage);
  const activeStep = activeVoyageData ? timelineSteps[activeVoyageData.id] ?? 0 : 0;
  const activeCurrentEpisode =
    activeVoyageData && activeStep > 0
      ? activeVoyageData.episodes[Math.min(activeStep - 1, activeVoyageData.episodes.length - 1)]
      : undefined;

  return (
    <MapContainer center={DEFAULT_CENTER} zoom={3} className="columbus-map" minZoom={2} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitToBounds bounds={bounds} />
      <FocusCurrentEpisode episode={activeCurrentEpisode} />

      {voyagesToRender.map((voyage) => {
        const totalEpisodes = voyage.episodes.length;
        const requestedStep = timelineSteps[voyage.id] ?? totalEpisodes;
        const isActive = voyage.id === activeVoyage;
        const inCompare = selectedVoyages.length > 1;
        const step = inCompare && !isActive ? totalEpisodes : requestedStep;
        const showSolidRoute = isActive || !inCompare;

        const routeCoordinates = collectCoordinatesUpToStep(voyage.episodes, step);
        const fullCoordinates = collectAllCoordinates(voyage.episodes);

        const theme = voyage.meta.theme;
        const lineColor = isActive ? theme.primary : theme.secondary;
        const opacity = isActive ? 0.95 : 0.55;

        return (
          <Fragment key={voyage.id}>
            {showSolidRoute && routeCoordinates.length >= 2 && (
              <Polyline
                positions={routeCoordinates}
                pathOptions={{ color: lineColor, weight: isActive ? 5 : 3, opacity }}
              />
            )}

            {!showSolidRoute && fullCoordinates.length >= 2 && (
              <Polyline
                positions={fullCoordinates}
                pathOptions={{ color: theme.secondary, weight: 2, opacity: 0.35, dashArray: "4 6" }}
              />
            )}

            {voyage.episodes.map((episode, index) => {
              const coords = episode.place.coordinates;
              if (!coords) {
                return null;
              }
              const isVisible = index < step;
              const isCurrent = isActive && index === step - 1;
              const baseRadius = isActive ? 8 : 6;
              const radius = isCurrent ? baseRadius + 4 : baseRadius;
              const fillOpacity = isCurrent ? 1 : isVisible ? 0.85 : 0.2;

              return (
                <CircleMarker
                  key={`${voyage.id}-episode-${episode.order}`}
                  center={coords}
                  radius={radius}
                  pathOptions={{
                    color: theme.dark,
                    weight: isCurrent ? 3 : 1,
                    fillColor: theme.primary,
                    fillOpacity,
                  }}
                  eventHandlers={{
                    click: () => {
                      if (onEpisodeSelect) {
                        onEpisodeSelect(voyage.id, index + 1);
                      }
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -radius]} opacity={0.9} sticky>
                    <div className="map-tooltip">
                      <strong>{episode.title}</strong>
                      <span>{episode.date}</span>
                      <span>{episode.place.modernName}</span>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </Fragment>
        );
      })}
    </MapContainer>
  );
};
