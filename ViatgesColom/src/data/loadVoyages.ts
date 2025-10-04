import type { Episode, RawEpisode, RawShip, RawVoyagePayload, Ship, Voyage } from "../types";
import { VOYAGE_DESCRIPTORS } from "./voyageConfig";

const normaliseText = (value: string) => value.replace(/\s+/g, " ").trim();

const transformShip = (raw: RawShip): Ship => ({
  name: normaliseText(raw.nom),
  type: normaliseText(raw.tipus),
  fate: normaliseText(raw["dest\u00ed"]),
});

const transformEpisode = (raw: RawEpisode): Episode => ({
  order: raw.ordre,
  title: normaliseText(raw.titol),
  date: normaliseText(raw.data),
  description: normaliseText(raw.descripcio),
  curiosities: raw.curiositats.map(normaliseText),
  issues: raw.problemes?.map(normaliseText),
  resolution: raw.resolucio ? normaliseText(raw.resolucio) : undefined,
  place: {
    modernName: normaliseText(raw.lloc.nom_modern),
    historicName: normaliseText(raw.lloc.nom_antic),
    coordinates: raw.lloc.coordenades,
  },
});

const buildVoyage = (payload: RawVoyagePayload, descriptorIndex: number): Voyage => {
  const descriptor = VOYAGE_DESCRIPTORS[descriptorIndex];
  const { titol, anys, finalitat, vaixells, episodis, problemes_generals, resultats } = payload.viatge;

  return {
    id: descriptor.id,
    order: descriptor.order,
    title: normaliseText(titol),
    years: normaliseText(anys),
    goal: normaliseText(finalitat),
    ships: vaixells.map(transformShip),
    episodes: episodis
      .map(transformEpisode)
      .sort((a, b) => a.order - b.order),
    generalIssues: problemes_generals.map(normaliseText),
    results: resultats.map(normaliseText),
    meta: descriptor.meta,
  };
};

const resolveDataUrl = (path: string) => new URL(path, import.meta.env.BASE_URL).toString();

export const loadVoyages = async (): Promise<Voyage[]> => {
  const voyages = await Promise.all(
    VOYAGE_DESCRIPTORS.map(async (descriptor, index) => {
      const resourceUrl = resolveDataUrl(descriptor.dataPath);
      const response = await fetch(resourceUrl);
      if (!response.ok) {
        throw new Error(`No s'ha pogut carregar el fitxer ${resourceUrl}`);
      }
      const payload = (await response.json()) as RawVoyagePayload;
      return buildVoyage(payload, index);
    }),
  );

  return voyages.sort((a, b) => a.order - b.order);
};
