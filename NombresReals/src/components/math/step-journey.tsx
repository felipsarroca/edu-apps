import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

type StepJourneyProps = {
  labels: string[]
  current: number
  onChange: (step: number) => void
  tone: 'amber' | 'emerald'
  text: React.ReactNode
}

const TONES = {
  amber: {
    active: 'border-amber-600 bg-amber-600 text-white',
    done: 'border-amber-300 bg-amber-50 text-amber-900',
    next: 'bg-amber-600 hover:bg-amber-700',
    panel: 'border-amber-200 bg-amber-50/70',
  },
  emerald: {
    active: 'border-emerald-600 bg-emerald-600 text-white',
    done: 'border-emerald-300 bg-emerald-50 text-emerald-900',
    next: 'bg-emerald-600 hover:bg-emerald-700',
    panel: 'border-emerald-200 bg-emerald-50/70',
  },
}

/** Barra de passos: navegació, etapes i explicació del pas actual en un sol bloc. */
export function StepJourney({ labels, current, onChange, tone, text }: StepJourneyProps) {
  const t = TONES[tone]
  const last = labels.length - 1
  const iconBtn =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900'

  return (
    <div className={`overflow-hidden rounded-xl border ${t.panel}`}>
      <div className="flex items-center gap-1.5 border-b border-stone-200 bg-white p-1.5" role="group" aria-label="Passos de la construcció">
        <button type="button" className={iconBtn} onClick={() => onChange(0)} aria-label="Reinicia">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button type="button" className={iconBtn} onClick={() => onChange(current - 1)} disabled={current === 0} aria-label="Pas anterior">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="grid flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))` }}>
          {labels.map((label, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(index)}
              aria-label={`Pas ${index}: ${label}`}
              aria-current={index === current ? 'step' : undefined}
              className={`flex min-h-9 flex-col items-center justify-center rounded-lg border px-0.5 text-center font-medium leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${index === current ? t.active : index < current ? t.done : 'border-stone-200 bg-stone-50 text-stone-500 hover:border-stone-400'}`}
            >
              <span className="text-xs font-bold sm:text-[10px] sm:opacity-80" title={label}>{index}</span>
              <span className="hidden text-[11px] sm:line-clamp-1">{label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange(current >= last ? 0 : current + 1)}
          className={`flex h-9 shrink-0 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${t.next}`}
        >
          {current >= last ? 'De nou' : 'Següent'}
          {current >= last ? <RotateCcw className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
      <p className="min-h-[2.75rem] px-3.5 py-2 text-sm leading-snug text-stone-800" aria-live="polite">
        {text}
      </p>
    </div>
  )
}
