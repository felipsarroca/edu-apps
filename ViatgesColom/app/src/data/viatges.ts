import data1 from './1viatge.json'
import data2 from './2viatge.json'
import data3 from './3viatge.json'
import data4 from './4viatge.json'

import type { RawVoyage, Voyage, VoyageId } from '../types'

const COLOR_MAP: Record<VoyageId, string> = {
  viatge1: '#0ea5e9',
  viatge2: '#f97316',
  viatge3: '#8b5cf6',
  viatge4: '#22c55e',
}

const rawVoyages: Array<{ id: VoyageId; data: RawVoyage }> = [
  { id: 'viatge1', data: data1 as RawVoyage },
  { id: 'viatge2', data: data2 as RawVoyage },
  { id: 'viatge3', data: data3 as RawVoyage },
  { id: 'viatge4', data: data4 as RawVoyage },
]

export const VOYAGES: Voyage[] = rawVoyages.map(({ id, data }) => ({
  id,
  color: COLOR_MAP[id],
  ...data.viatge,
  episodis: [...data.viatge.episodis].sort((a, b) => a.ordre - b.ordre),
}))

export const ALL_EPISODES = VOYAGES.flatMap((voyage) =>
  voyage.episodis.map((episode) => ({
    ...episode,
    voyageId: voyage.id,
    color: voyage.color,
    titolViatge: voyage.titol,
    anysViatge: voyage.anys,
  })),
).sort((a, b) => a.ordre - b.ordre)

export const VOYAGE_OPTIONS = VOYAGES.map((voyage) => ({
  id: voyage.id,
  label: voyage.titol,
  anys: voyage.anys,
  color: voyage.color,
  finalitat: voyage.finalitat,
}))
