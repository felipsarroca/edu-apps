import type { LatLngTuple } from "leaflet";

export type VoyageId = "viatge1" | "viatge2" | "viatge3" | "viatge4";

export type CoordinateTuple = LatLngTuple;

export type IconKey = "ship" | "fort" | "map" | "storm" | "compass";
export type IllustrationKey = "atlantic" | "la-isabela" | "orinoco" | "jamaica";

export interface RawVoyagePayload {
  viatge: {
    titol: string;
    anys: string;
    finalitat: string;
    vaixells: RawShip[];
    episodis: RawEpisode[];
    problemes_generals: string[];
    resultats: string[];
  };
}

export interface RawShip {
  nom: string;
  tipus: string;
  ["dest\u00ed"]: string;
}

export interface RawEpisode {
  ordre: number;
  titol: string;
  data: string;
  descripcio: string;
  curiositats: string[];
  problemes?: string[];
  resolucio?: string;
  lloc: {
    nom_modern: string;
    nom_antic: string;
    coordenades: CoordinateTuple | null;
  };
}

export interface Ship {
  name: string;
  type: string;
  fate: string;
}

export interface Episode {
  order: number;
  title: string;
  date: string;
  description: string;
  curiosities: string[];
  issues?: string[];
  resolution?: string;
  place: {
    modernName: string;
    historicName: string;
    coordinates: CoordinateTuple | null;
  };
}

export interface VoyageMeta {
  shortTitle: string;
  summary: string;
  tagline: string;
  theme: {
    primary: string;
    secondary: string;
    gradient: string;
    dark: string;
  };
  icon: IconKey;
  illustration: IllustrationKey;
}

export interface Voyage {
  id: VoyageId;
  order: number;
  title: string;
  years: string;
  goal: string;
  ships: Ship[];
  episodes: Episode[];
  generalIssues: string[];
  results: string[];
  meta: VoyageMeta;
}

export interface VoyageBundle {
  voyages: Voyage[];
}

export type QuizMode = "intro" | "question" | "finished";
