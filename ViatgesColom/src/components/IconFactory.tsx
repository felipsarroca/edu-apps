import type { LucideIcon } from "lucide-react";
import { Anchor, Castle, Compass, Landmark, Map, Ship, Waves } from "lucide-react";
import type { IconKey } from "../types";

const iconRegistry: Record<IconKey, LucideIcon> = {
  ship: Ship,
  fort: Castle,
  map: Map,
  storm: Waves,
  compass: Compass,
};

export const getIcon = (key: IconKey): LucideIcon => iconRegistry[key] ?? Anchor;
export const getSecondaryIcon = (): LucideIcon => Landmark;
