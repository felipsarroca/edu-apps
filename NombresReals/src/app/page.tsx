import Link from 'next/link'
import { ArrowRight, Boxes, Compass, Ruler } from 'lucide-react'

function HeroNumberLine() {
  const oX = 140
  const s = 210
  const y = 118
  const fractions = [
    { label: '1/2', v: 0.5 },
    { label: '3/4', v: 0.75 },
  ]
  const irrationals = [
    { label: '√2', v: Math.SQRT2 },
    { label: '√3', v: Math.sqrt(3) },
    { label: '√5', v: Math.sqrt(5) },
    { label: 'π', v: Math.PI },
  ]
  return (
    <svg
      viewBox="0 70 900 120"
      className="mx-auto h-auto w-full max-w-3xl"
      role="img"
      aria-label="Recta numèrica amb fraccions i nombres irracionals situats"
    >
      <title>Recta numèrica amb exemples</title>
      <line x1={50} y1={y} x2={850} y2={y} stroke="#44403c" strokeWidth={2.2} />
      <polygon points="864,118 848,111 848,125" fill="#44403c" />
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <line x1={oX + k * s} y1={y - 8} x2={oX + k * s} y2={y + 8} stroke="#44403c" strokeWidth={2} />
          <text x={oX + k * s} y={y + 30} textAnchor="middle" fontSize={16} fill="#57534e">
            {k}
          </text>
        </g>
      ))}
      {fractions.map((f) => (
        <g key={f.label}>
          <circle cx={oX + f.v * s} cy={y} r={6} fill="#d97706" />
          <text x={oX + f.v * s} y={y - 16} textAnchor="middle" fontSize={15} fontWeight={600} fill="#b45309">
            {f.label}
          </text>
        </g>
      ))}
      {irrationals.map((f) => (
        <g key={f.label}>
          <circle cx={oX + f.v * s} cy={y} r={6} fill="#059669" />
          <text x={oX + f.v * s} y={y + 48} textAnchor="middle" fontSize={15} fontWeight={600} fill="#047857">
            {f.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

const options = [
  {
    href: '/fraccions', title: 'Fraccions amb Tales',
    description: 'Divideix la unitat i situa fraccions pròpies, impròpies i negatives.',
    example: 'Com construïm 4/7?', icon: Ruler,
    colors: 'border-amber-200 bg-amber-50/80 text-amber-800',
  },
  {
    href: '/irracionals', title: 'Irracionals amb Pitàgores',
    description: 'Tria els catets, construeix la hipotenusa i trasllada-la a la recta.',
    example: 'Per què 2 i 1 donen √5?', icon: Compass,
    colors: 'border-emerald-200 bg-emerald-50/80 text-emerald-800',
  },
  {
    href: '/classifica', title: 'Classifica els nombres',
    description: 'Practica els conjunts ℕ, ℤ, ℚ i els irracionals en tres nivells.',
    example: 'On va cada nombre?', icon: Boxes,
    colors: 'border-sky-200 bg-sky-50/80 text-sky-800',
  },
]

export default function Home() {
  return (
    <>
      <section className="graph-paper border-b border-stone-200">
        <div className="mx-auto max-w-5xl px-4 pb-4 pt-8 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">Situa els nombres sobre la recta</h1>
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-stone-600">Cada nombre real té un punt exacte a la recta. Amb regle i compàs, el pots trobar.</p>
          <div className="mt-3"><HeroNumberLine /></div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-6" aria-label="Activitats">
        <ol className="grid gap-4 md:grid-cols-3">
          {options.map(({ href, title, description, example, icon: Icon, colors }, index) => (
            <li key={href}>
              <Link href={href} className={`group flex h-full flex-col rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${colors}`}>
                <span className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-sm font-bold">{index + 1}</span>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-stone-700">{description}</p>
                <span className="mt-4 flex items-center justify-between gap-2 text-sm font-semibold">{example} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
