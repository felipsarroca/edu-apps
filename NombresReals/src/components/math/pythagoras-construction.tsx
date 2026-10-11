'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StepJourney } from './step-journey'
import { useElementSize } from '@/hooks/use-element-size'

/* ---------- Constants ---------- */

// Colors: blau = catet sobre la recta, ambre = catet perpendicular, verd = nova arrel
const C_BASE = '#0284c7'
const C_BASE_FOSC = '#0369a1'
const C_PERP = '#d97706'
const C_PERP_FOSC = '#b45309'
const C_HIP = '#059669'
const C_HIP_FOSC = '#065f46'

const TARGETS = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20]

const fmt = (v: number, d = 3) => v.toFixed(d).replace('.', ',')
const isSquare = (v: number) => Number.isInteger(Math.sqrt(v))
/** Longitud d'un segment de mida √q: «3» si q = 9, «√2» si q = 2 */
const root = (q: number) => (isSquare(q) ? String(Math.sqrt(q)) : `√${q}`)
/** Quadrat d'aquesta longitud: «3²» o «(√2)²» */
const squared = (q: number) => (isSquare(q) ? `${Math.sqrt(q)}²` : `(√${q})²`)
const plural = (k: number, one: string, many: string) => (k === 1 ? one : many)

type Mode = 'directe' | 'esglaons'

/** Triangle rectangle: catet de longitud √baseSq sobre la recta i catet perpendicular enter m. */
type Tri = { baseSq: number; m: number; result: number }

type Option = { m: number; r: number; previous: number }

/** Triangle de catets √r i m. Si tots dos són enters, el més llarg va sobre la recta. */
function makeTri(r: number, m: number): Tri {
  if (isSquare(r) && Math.sqrt(r) < m) return { baseSq: m * m, m: Math.sqrt(r), result: r + m * m }
  return { baseSq: r, m, result: r + m * m }
}

const plans = new Map<number, Tri[]>()

/** Cadena més curta de triangles que deixa √v sobre la recta (buida si √v és enter). */
function plan(v: number): Tri[] {
  if (isSquare(v)) return []
  const cached = plans.get(v)
  if (cached) return cached
  let best: Tri[] | null = null
  for (let m = Math.floor(Math.sqrt(v - 1)); m >= 1; m--) {
    const r = v - m * m
    const candidate = [...plan(r), makeTri(r, m)]
    if (!best || candidate.length < best.length) best = candidate
  }
  plans.set(v, best!)
  return best!
}

/** Totes les maneres d'escriure n = m² + r, del quadrat més gran al més petit. */
function decompositions(n: number): Option[] {
  const list: Option[] = []
  for (let m = Math.floor(Math.sqrt(n - 1)); m >= 1; m--) {
    const r = n - m * m
    list.push({ m, r, previous: plan(r).length })
  }
  return list
}

const STAIRS: Tri[] = [1, 2, 3, 4, 5].map((k) => ({ baseSq: k, m: 1, result: k + 1 }))

/* ---------- Textos dels passos ---------- */

function directStepText(step: number, n: number, aux: Tri[], main: Tri): string {
  const A = aux.length
  if (step === 0) {
    return `Volem √${n}. Com que ${n} = ${squared(main.baseSq)} + ${main.m}², farem un triangle rectangle de catets ${root(main.baseSq)} i ${main.m}${
      A ? `. Abans, però, cal construir √${main.baseSq}.` : '.'
    }`
  }
  if (step <= A) {
    const t = aux[step - 1]
    return `Construïm √${t.result}: catets ${root(t.baseSq)} i ${t.m}, perquè ${squared(t.baseSq)} + ${t.m}² = ${t.baseSq} + ${t.m * t.m} = ${t.result}. L'arc porta √${t.result} a la recta.`
  }
  switch (step - A) {
    case 1:
      return isSquare(main.baseSq)
        ? `Primer catet: ${root(main.baseSq)} unitats sobre la recta, a partir del 0.`
        : `Primer catet: el segment de 0 a √${main.baseSq}, que ja tenim sobre la recta.`
    case 2:
      return `A l'extrem, aixeca una perpendicular de ${main.m}: és el catet enter i es mesura directament.`
    case 3:
      return `Uneix el 0 amb l'extrem. Per Pitàgores, c² = ${squared(main.baseSq)} + ${main.m}² = ${main.baseSq} + ${main.m * main.m} = ${n}; per tant, c = √${n}.`
    default:
      return `Compàs al 0 amb obertura c fins a la recta: √${n} ≈ ${fmt(Math.sqrt(n))}. El punt és exacte, tot i que les xifres decimals són infinites i no periòdiques.`
  }
}

function stairsStepText(k: number): string {
  if (k === 0)
    return "Partim del segment 0–1. A cada pas, perpendicular d'1, hipotenusa i compàs fins a la recta."
  const t = STAIRS[k - 1]
  const res = t.result === 4 ? '√4 = 2, un racional' : `√${t.result} ≈ ${fmt(Math.sqrt(t.result))}`
  return `Catets ${root(t.baseSq)} i 1: ${squared(t.baseSq)} + 1² = ${t.result}, i la hipotenusa és ${res}.`
}

/* ---------- Component ---------- */

export function PythagorasConstruction() {
  const [mode, setMode] = useState<Mode>('directe')
  const [n, setN] = useState(5)
  const [chosenM, setChosenM] = useState<number | null>(null)
  const [step, setStep] = useState(0)
  const [figRef, { w: W, h: H }] = useElementSize<HTMLDivElement>()

  const options = decompositions(n)
  const best = options.reduce((acc, o) => (o.previous < acc.previous ? o : acc), options[0])
  const choice = options.find((o) => o.m === chosenM) ?? best
  const aux = plan(choice.r)
  const main = makeTri(choice.r, choice.m)

  const triangles = mode === 'directe' ? [...aux, main] : STAIRS
  const maxStep = mode === 'directe' ? aux.length + 4 : STAIRS.length

  const goTo = (s: number) => setStep(Math.min(maxStep, Math.max(0, s)))
  const changeMode = (m: string) => {
    setMode(m as Mode)
    setStep(0)
  }
  const pickN = (value: number) => {
    setN(value)
    setChosenM(null)
    setStep(0)
  }

  /* Escala: el dibuix ocupa tot l'espai disponible */
  const padTop = 30
  const padBottom = 62
  const spanX = Math.sqrt(triangles[triangles.length - 1].result)
  const spanY = Math.max(...triangles.map((t) => t.m))
  const padLeft = padBottom // el mateix marge a l'esquerra de l'eix vertical que sota la recta
  const s = Math.max(20, Math.min((W - padLeft - 12) / (spanX + 0.5), (H - padTop - padBottom) / spanY))
  const O = { x: padLeft, y: H - padBottom }
  const X = (u: number) => O.x + u * s
  const ticks = Array.from({ length: Math.max(0, Math.floor((W - 30 - O.x) / s)) + 1 }, (_, k) => k)
  const yTicks = Array.from({ length: Math.max(0, Math.floor((O.y - 30) / s)) }, (_, k) => k + 1)

  /* Quant es dibuixa de cada triangle segons el pas (0 = res, 4 = complet) */
  const stageOf = (index: number) => {
    if (mode === 'esglaons' || index < aux.length) return step >= index + 1 ? 4 : 0
    return Math.max(0, Math.min(4, step - aux.length))
  }
  const current = mode === 'esglaons' ? step - 1 : Math.min(step - 1, aux.length)

  const description = mode === 'directe' ? directStepText(step, n, aux, main) : stairsStepText(step)
  const labels =
    mode === 'directe'
      ? ['Objectiu', ...aux.map((t) => `√${t.result}`), `Catet ${root(main.baseSq)}`, `Catet ${main.m}`, 'Hipotenusa', `Arc → √${n}`]
      : ['Objectiu', '√2', '√3', '√4', '√5', '√6']

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Columna esquerra: tria i raonament */}
      <div className="flex flex-col gap-3 lg:col-span-4 lg:min-h-0 lg:overflow-y-auto">
        <Tabs value={mode} onValueChange={changeMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directe">Tria l’arrel</TabsTrigger>
            <TabsTrigger value="esglaons">Esglaons √2 → √6</TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === 'directe' ? (
          <>
            <div className="grid grid-cols-8 gap-1">
              {TARGETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => pickN(t)}
                  aria-pressed={n === t}
                  className={`rounded-md border py-1 text-sm font-semibold tabular-nums transition-colors ${
                    n === t
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-300 bg-white text-stone-600 hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  √{t}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <h2 className="text-sm font-bold text-emerald-900">Quins catets per a √{n}?</h2>
              <p className="mt-0.5 text-xs leading-snug text-stone-600">
                Cal partir {n} en dues parts, perquè c² = a² + b². Si una part és un quadrat perfecte, aquell catet és enter i es dibuixa directament.
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {options.map((o) => {
                  const selected = o.m === choice.m
                  return (
                    <button
                      key={o.m}
                      type="button"
                      onClick={() => {
                        setChosenM(o.m)
                        setStep(0)
                      }}
                      aria-pressed={selected}
                      className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-sm transition-colors ${
                        selected ? 'border-emerald-600 bg-white shadow-sm' : 'border-transparent bg-white/50 hover:bg-white'
                      }`}
                    >
                      <span className="font-semibold tabular-nums text-stone-800">
                        {n} = <span className="text-amber-700">{o.m * o.m}</span> + <span className="text-sky-700">{o.r}</span>
                      </span>
                      <span className="text-xs text-stone-500">→ catets {o.m} i {root(o.r)}</span>
                      <span
                        className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                          o.previous === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {o.previous === 0 ? 'directe' : `+${o.previous} ${plural(o.previous, 'triangle', 'triangles')}`}
                      </span>
                      {o === best && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-500" aria-label="Opció recomanada" />}
                    </button>
                  )
                })}
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-center text-xs font-bold text-stone-700">
                <AreaSquare area={main.baseSq} tone="blue" />
                <span className="text-lg" aria-hidden="true">+</span>
                <AreaSquare area={main.m * main.m} tone="amber" />
                <span className="text-lg" aria-hidden="true">=</span>
                <div className="rounded-lg border border-emerald-300 bg-white px-2.5 py-1.5 text-sm text-emerald-800">
                  {n}
                  <br />
                  <span className="text-xs font-medium">c = √{n}</span>
                </div>
              </div>

              <p className="mt-2 text-xs leading-snug text-stone-700">
                <WhyText n={n} choice={choice} best={best} />
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-sm leading-snug text-stone-700">
            <h2 className="mb-1 font-bold text-emerald-900">Per què els esglaons?</h2>
            <p>
              Cada hipotenusa ja és sobre la recta i fa de catet del triangle següent; l’altre catet sempre mesura 1. Així
              s’obtenen totes les arrels, una darrere l’altra.
            </p>
            <p className="mt-2 rounded-md bg-white/80 px-2 py-1 text-center font-semibold text-emerald-900">
              (√k)² + 1² = k + 1 → √(k + 1)
            </p>
          </div>
        )}
      </div>

      {/* Columna dreta: passos i construcció */}
      <div className="flex flex-col gap-2.5 lg:col-span-8 lg:min-h-0">
        <StepJourney labels={labels} current={step} onChange={goTo} tone="emerald" text={description} />

        <div className="flex h-[62vh] min-h-[300px] flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:h-auto lg:flex-1">
          <div ref={figRef} className="relative min-h-0 flex-1">
            {W > 0 && (
              <svg
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0"
                role="img"
                aria-label={mode === 'directe' ? `Construcció de √${n} amb el teorema de Pitàgores` : 'Construcció de √2 a √6 amb esglaons'}
              >
                <defs>
                  <pattern id="pyth-grid" width={s / 4} height={s / 4} patternUnits="userSpaceOnUse" x={O.x} y={O.y}>
                    <path d={`M ${s / 4} 0 L 0 0 0 ${s / 4}`} fill="none" stroke="#f1f0ee" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width={W} height={H} fill="url(#pyth-grid)" />

                {/* Eix vertical: mesura els catets perpendiculars */}
                <line x1={O.x} y1={O.y} x2={O.x} y2={20} stroke="#44403c" strokeWidth={2.4} />
                <polygon points={`${O.x},6 ${O.x - 7},22 ${O.x + 7},22`} fill="#44403c" />
                {yTicks.map((k) => (
                  <g key={`y${k}`}>
                    <line x1={O.x - 8} y1={O.y - k * s} x2={O.x + 8} y2={O.y - k * s} stroke="#44403c" strokeWidth={2} />
                    <text x={O.x - 13} y={O.y - k * s + 6} textAnchor="end" fontSize={17} fill="#57534e">
                      {k}
                    </text>
                  </g>
                ))}

                {/* Recta numèrica */}
                <line x1={O.x} y1={O.y} x2={W - 22} y2={O.y} stroke="#44403c" strokeWidth={2.4} />
                <polygon points={`${W - 6},${O.y} ${W - 22},${O.y - 7} ${W - 22},${O.y + 7}`} fill="#44403c" />
                {ticks.map((k) => (
                  <g key={k}>
                    <line x1={X(k)} y1={O.y - 8} x2={X(k)} y2={O.y + 8} stroke="#44403c" strokeWidth={2} />
                    <text x={X(k)} y={O.y + 27} textAnchor="middle" fontSize={17} fill="#57534e">
                      {k}
                    </text>
                  </g>
                ))}

                {triangles.map((t, index) => {
                  const stage = stageOf(index)
                  if (stage === 0) return null
                  return (
                    <TriangleView
                      key={`${mode}-${n}-${choice.m}-${index}`}
                      t={t}
                      stage={stage}
                      O={O}
                      s={s}
                      main={mode === 'directe' && index === triangles.length - 1}
                      faded={index < current}
                    />
                  )
                })}
              </svg>
            )}
          </div>

          {/* Llegenda de colors */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-stone-100 px-4 py-1.5 text-xs text-stone-600">
            <Llegenda color={C_BASE} text="catet sobre la recta" />
            <Llegenda color={C_PERP} text="catet perpendicular" />
            <Llegenda color={C_HIP} text="hipotenusa: la nova arrel" />
            {mode === 'directe' && aux.length > 0 && <span className="text-stone-400">Més clars: triangles previs</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Peces ---------- */

function WhyText({ n, choice, best }: { n: number; choice: Option; best: Option }) {
  const { m, r, previous } = choice
  if (previous === 0)
    return (
      <>
        {m * m} i {r} són quadrats perfectes: els catets {m} i {root(r)} són enters i n’hi ha prou amb <strong>un sol triangle</strong>.
      </>
    )
  if (choice === best)
    return (
      <>
        Triem <strong>{m * m} = {m}²</strong>: el catet {m} és enter i es mesura directament. El que queda, {r}, no és un quadrat
        perfecte, però √{r} es construeix amb {previous === 1 ? 'només un triangle previ' : `${previous} triangles previs`}. És el camí més curt
        fins a √{n}.
      </>
    )
  return (
    <>
      També funciona, però √{r} demana {previous} {plural(previous, 'triangle previ', 'triangles previs')}. Amb {best.m * best.m} = {best.m}² n’hi ha prou
      amb {best.previous === 0 ? 'un sol triangle' : `${best.previous} ${plural(best.previous, 'triangle previ', 'triangles previs')}`}.
    </>
  )
}

function TriangleView({
  t,
  stage,
  O,
  s,
  main,
  faded,
}: {
  t: Tri
  stage: number
  O: { x: number; y: number }
  s: number
  main: boolean
  faded: boolean
}) {
  const A = { x: O.x + Math.sqrt(t.baseSq) * s, y: O.y }
  const B = { x: A.x, y: O.y - t.m * s }
  const r = Math.sqrt(t.result) * s
  const end = { x: O.x + r, y: O.y }
  const corner = Math.min(14, s * 0.12)
  const h = t.m * s
  const tick = 0.22
  // Etiqueta de la hipotenusa: al mig, o més amunt si topa amb l'eix vertical
  const hypT = Math.min(0.92, Math.max(0.5, 120 / Math.max(1, B.x - O.x)))

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: faded ? 0.35 : 1 }} transition={{ duration: 0.35 }}>
      {stage >= 3 && !faded && <polygon points={`${O.x},${O.y} ${A.x},${A.y} ${B.x},${B.y}`} fill={C_HIP} opacity={0.06} />}

      {/* Catet sobre la recta */}
      <motion.line
        x1={O.x}
        y1={O.y}
        x2={A.x}
        y2={A.y}
        stroke={C_BASE}
        strokeWidth={5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {main && isSquare(t.baseSq) && (
        <text x={(O.x + A.x) / 2} y={O.y + 50} textAnchor="middle" fontSize={17} fontWeight={700} fill={C_BASE_FOSC}>
          {root(t.baseSq)}
        </text>
      )}

      {/* Catet perpendicular */}
      {stage >= 2 && (
        <g>
          <motion.line
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={C_PERP}
            strokeWidth={3.2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <path
            d={`M ${A.x + h * Math.cos(Math.PI / 2 + tick)} ${A.y - h * Math.sin(Math.PI / 2 + tick)} A ${h} ${h} 0 0 1 ${A.x + h * Math.cos(Math.PI / 2 - tick)} ${A.y - h * Math.sin(Math.PI / 2 - tick)}`}
            fill="none"
            stroke={C_PERP}
            strokeWidth={1.5}
          />
          <circle cx={B.x} cy={B.y} r={4.5} fill={C_PERP_FOSC} />
          {main && (
            <text x={A.x - 10} y={(A.y + B.y) / 2 + 6} textAnchor="end" fontSize={18} fontWeight={700} fill={C_PERP_FOSC}>
              {t.m}
            </text>
          )}
        </g>
      )}

      {/* Hipotenusa i angle recte */}
      {stage >= 3 && (
        <g>
          <path d={`M ${A.x - corner} ${A.y} L ${A.x - corner} ${A.y - corner} L ${A.x} ${A.y - corner}`} fill="none" stroke="#78716c" strokeWidth={1.5} />
          <motion.line
            x1={O.x}
            y1={O.y}
            x2={B.x}
            y2={B.y}
            stroke={C_HIP}
            strokeWidth={3.2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
          />
          {main && (
            <text x={O.x + hypT * (B.x - O.x) - 12} y={O.y - hypT * (O.y - B.y) - 10} textAnchor="end" fontSize={20} fontWeight={700} fill={C_HIP_FOSC}>
              c = √{t.result}
            </text>
          )}
        </g>
      )}

      {/* Arc fins a la recta */}
      {stage >= 4 && (
        <g>
          <motion.path
            d={`M ${B.x.toFixed(2)} ${B.y.toFixed(2)} A ${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`}
            fill="none"
            stroke={C_HIP}
            strokeWidth={2.4}
            strokeDasharray={main ? undefined : '6 4'}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9 }}
          />
          <circle cx={end.x} cy={O.y} r={main ? 6.5 : 5} fill={C_HIP} />
          {main ? (
            <>
              <motion.circle
                cx={end.x}
                cy={O.y}
                r={14}
                fill="none"
                stroke={C_HIP}
                strokeWidth={2}
                animate={{ opacity: [0.75, 0.08, 0.75] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <text x={end.x} y={O.y - 26} textAnchor="middle" fontSize={26} fontWeight={800} fill={C_HIP_FOSC}>
                √{t.result}
              </text>
              <text x={end.x} y={O.y + 50} textAnchor="middle" fontSize={15} fill="#78716c">
                ≈ {fmt(Math.sqrt(t.result))}
              </text>
            </>
          ) : (
            <text x={end.x + 7} y={O.y - 9} fontSize={16} fontWeight={700} fill={C_HIP_FOSC}>
              {root(t.result)}
            </text>
          )}
        </g>
      )}
    </motion.g>
  )
}

function Llegenda({ color, text }: { color: string; text: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-1 w-5 rounded-full" style={{ backgroundColor: color }} />
      {text}
    </span>
  )
}

/** Quadrat d'àrea donada: quadrícula d'unitats si és quadrat perfecte; si no, un quadrat de costat √àrea. */
function AreaSquare({ area, tone }: { area: number; tone: 'blue' | 'amber' }) {
  const side = Math.sqrt(area)
  const cell = 11
  const fill = tone === 'blue' ? 'bg-sky-500' : 'bg-amber-500'
  const frame = tone === 'blue' ? 'border-sky-500 bg-sky-200' : 'border-amber-500 bg-amber-200'
  return (
    <div className="flex flex-col items-center gap-1">
      {isSquare(area) ? (
        <div className={`grid gap-px rounded border p-0.5 ${frame}`} style={{ gridTemplateColumns: `repeat(${side}, ${cell}px)` }} aria-hidden="true">
          {Array.from({ length: area }, (_, i) => (
            <span key={i} className={fill} style={{ width: cell, height: cell }} />
          ))}
        </div>
      ) : (
        <div
          className={`flex items-center justify-center rounded border text-[11px] font-bold text-white ${
            tone === 'blue' ? 'border-sky-600 bg-sky-500' : 'border-amber-600 bg-amber-500'
          }`}
          style={{ width: side * (cell + 1) + 4, height: side * (cell + 1) + 4 }}
          aria-hidden="true"
        >
          {area}
        </div>
      )}
      <span>{isSquare(area) ? `${side}² = ${area}` : `(√${area})² = ${area}`}</span>
    </div>
  )
}
