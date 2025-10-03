export interface LocationInfo {
  nom_modern: string
  nom_antic: string
  coordenades: [number, number] | null
}

export interface Episode {
  ordre: number
  titol: string
  lloc: LocationInfo
  data: string
  descripcio: string
  curiositats: string[]
  problemes?: string[]
  resolucio?: string
}

export interface ShipInfo {
  nom: string
  tipus: string
  desti: string
}

export interface RawVoyage {
  viatge: {
    titol: string
    anys: string
    finalitat: string
    vaixells: ShipInfo[]
    episodis: Episode[]
    problemes_generals: string[]
    resultats: string[]
  }
}

export interface Voyage extends RawVoyage['viatge'] {
  id: VoyageId
  color: string
}

export type VoyageId = 'viatge1' | 'viatge2' | 'viatge3' | 'viatge4'
