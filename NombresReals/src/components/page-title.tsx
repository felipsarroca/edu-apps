import type { LucideIcon } from 'lucide-react'

const TONES = {
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
}

export function PageTitle({ icon: Icon, tone, children, aside }: {
  icon: LucideIcon
  tone: keyof typeof TONES
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="mb-2.5 flex shrink-0 flex-wrap items-center justify-between gap-2">
      <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-stone-900">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone]}`}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        {children}
      </h1>
      {aside}
    </div>
  )
}
