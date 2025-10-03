import { clsx } from 'clsx'
import { memo } from 'react'

import { VOYAGE_OPTIONS } from '../data/viatges'
import type { VoyageId } from '../types'

const ALL_OPTION = {
  id: 'all' as const,
  label: 'Tots els viatges',
  anys: '1492-1504',
  finalitat: 'Observa la progressió completa de les expedicions de Colom.',
  color: '#facc15',
}

export interface VoyageSelectorProps {
  selectedId: VoyageId | 'all'
  onSelect: (id: VoyageId | 'all') => void
}

const VoyageSelectorComponent = ({ selectedId, onSelect }: VoyageSelectorProps) => {
  const options = [...VOYAGE_OPTIONS, ALL_OPTION]

  return (
    <section className="selector">
      <header className="selector__header">
        <div>
          <p className="selector__tag">Escull el viatge</p>
          <h2>De la glòria al naufragi</h2>
        </div>
        <p className="selector__hint">
          Tria un viatge per descobrir la ruta, els protagonistes i els seus conflictes. La vista «Tots els viatges»
          superposa les rutes per comparar-les.
        </p>
      </header>
      <div className="selector__grid">
        {options.map((option) => {
          const isSelected = option.id === selectedId
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option.id)}
              className={clsx('selector__card', isSelected && 'selector__card--active')}
              style={{
                borderColor: option.color,
                background: `radial-gradient(circle at top, ${option.color}26, transparent 70%)`,
              }}
            >
              <div className="selector__badge" style={{ backgroundColor: option.color }} />
              <div className="selector__card-body">
                <h3>{option.label}</h3>
                <p className="selector__years">{option.anys}</p>
                <p className="selector__summary">{option.finalitat}</p>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export const VoyageSelector = memo(VoyageSelectorComponent)
