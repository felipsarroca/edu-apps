import type { IllustrationKey, VoyageId, VoyageMeta } from "../types";

export interface VoyageDescriptor {
  id: VoyageId;
  order: number;
  dataPath: string;
  meta: VoyageMeta;
}

const descriptors: VoyageDescriptor[] = [
  {
    id: "viatge1",
    order: 1,
    dataPath: "/data/1viatge.json",
    meta: {
      shortTitle: "1r viatge",
      summary: "De Palos a Guanahaní per trobar la ruta cap a l'Àsia.",
      tagline: "El descobriment que altera els mapes medievals.",
      icon: "ship",
      illustration: "atlantic" as IllustrationKey,
      theme: {
        primary: "#d62839",
        secondary: "#fcbf49",
        gradient: "linear-gradient(135deg, #d62839 0%, #fcbf49 100%)",
        dark: "#941a2a",
      },
    },
  },
  {
    id: "viatge2",
    order: 2,
    dataPath: "/data/2viatge.json",
    meta: {
      shortTitle: "2n viatge",
      summary: "La colonització de La Isabela i el xoc amb els taínos.",
      tagline: "Del somni colonial a la tensió constant.",
      icon: "fort",
      illustration: "la-isabela" as IllustrationKey,
      theme: {
        primary: "#1d3557",
        secondary: "#a8dadc",
        gradient: "linear-gradient(135deg, #1d3557 0%, #457b9d 50%, #a8dadc 100%)",
        dark: "#10213b",
      },
    },
  },
  {
    id: "viatge3",
    order: 3,
    dataPath: "/data/3viatge.json",
    meta: {
      shortTitle: "3r viatge",
      summary: "L'arribada al continent sud-americà i la crisi a Hispaniola.",
      tagline: "La Terra de Gràcia revela un continent immens.",
      icon: "map",
      illustration: "orinoco" as IllustrationKey,
      theme: {
        primary: "#2a9d8f",
        secondary: "#e9c46a",
        gradient: "linear-gradient(135deg, #2a9d8f 0%, #e9c46a 100%)",
        dark: "#1d6f66",
      },
    },
  },
  {
    id: "viatge4",
    order: 4,
    dataPath: "/data/4viatge.json",
    meta: {
      shortTitle: "4t viatge",
      summary: "La recerca impossible del pas asiàtic i els naufragis a Jamaica.",
      tagline: "Una expedició d'obstinació, tempesta i supervivència.",
      icon: "storm",
      illustration: "jamaica" as IllustrationKey,
      theme: {
        primary: "#f4a261",
        secondary: "#e76f51",
        gradient: "linear-gradient(135deg, #f4a261 0%, #e76f51 100%)",
        dark: "#a34d27",
      },
    },
  },
];

export const VOYAGE_DESCRIPTORS = descriptors;

export const descriptorMap: Record<VoyageId, VoyageDescriptor> = descriptors.reduce(
  (acc, descriptor) => {
    acc[descriptor.id] = descriptor;
    return acc;
  },
  {} as Record<VoyageId, VoyageDescriptor>,
);
