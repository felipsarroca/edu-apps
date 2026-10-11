'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, HelpCircle, Minus, Plus, Sigma, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepJourney } from './step-journey'
import { useElementSize } from '@/hooks/use-element-size'

/* ---------- Geometria de la construcció ---------- */

const MIN_ANGLE = (38 * Math.PI) / 180 // límits de l'angle de la recta obliqua
const MAX_ANGLE = (64 * Math.PI) / 180
const MAX_STEP = 5

const fmt = (v: number, d = 4) => v.toFixed(d).replace('.', ',')
const fmtInt = (k: number) => String(k).replace('-', '−')
const fmtSigned = (v: number) =>
  Number.isInteger(v)
    ? String(v).replace('-', '−')
    : (v < 0 ? '−' : '') + fmt(Math.abs(v))

function stepText(step: number, num: number, den: number, sign: number): string {
  const s = sign < 0 ? '−' : ''
  const N = Math.max(num, den)
  switch (step) {
    case 0:
      if (num === 0) return `Volem situar 0/${den} = 0 sobre la recta.`
      return `Volem situar ${s}${num}/${den}: dividirem la unitat en ${den} parts iguals i en comptarem ${num}${sign < 0 ? ' cap a l’esquerra' : ''}.`
    case 1:
      return sign > 0
        ? "Traça una recta obliqua des del 0, amb qualsevol angle."
        : "Traça una recta obliqua des del 0 cap a l'esquerra, el costat dels negatius."
    case 2:
      return `Amb la mateixa obertura de compàs, marca ${N} segments iguals: A₁…A${N}.${
        num > den ? ` Com que ${num} > ${den}, cal passar d'A${den}.` : ''
      }`
    case 3:
      return `Uneix A${den} (el denominador) amb el ${s}1. Aquest segment fixa la direcció de totes les paral·leles.`
    case 4: {
      const extra =
        sign < 0
          ? ' Són els mateixos trossos, en mirall.'
          : num > den
            ? " Més enllà de l'1, el patró es repeteix."
            : ''
      return `Tales: rectes paral·leles tallen segments proporcionals. Si a l'obliqua són iguals, a la recta també: ${den} parts iguals.${extra}`
    }
    case 5: {
      if (num === 0) return `La paral·lela pel primer punt seria l'origen: 0/${den} = 0.`
      if (num % den === 0)
        return `${s}${num}/${den} = ${s}${num / den} exactes: és la marca ${s}${num / den}.`
      const whole = Math.floor(num / den)
      const rem = num - whole * den
      if (num > den && sign > 0)
        return `La paral·lela per A${num} talla més enllà de l'1: ${num}/${den} = ${whole} + ${rem}/${den} ≈ ${fmt(num / den)}.`
      if (num > den)
        return `La paral·lela per A${num} talla més enllà del −1: −${num}/${den} ≈ −${fmt(num / den)}, l'oposat de ${num}/${den}.`
      if (sign < 0)
        return `La paral·lela per A${num} talla a l'esquerra: −${num}/${den} ≈ −${fmt(num / den)}. És l'oposat de ${num}/${den}!`
      return `La paral·lela per A${num} marca el punt ${num}/${den} ≈ ${fmt(num / den)}. Ja hi és!`
    }
    default:
      return ''
  }
}

/* ---------- Component ---------- */

export function ThalesConstruction() {
  const [den, setDen] = useState(7)
  const [num, setNum] = useState(4)
  const [sign, setSign] = useState(1)
  const [step, setStep] = useState(0)
  const [pred, setPred] = useState<number | null>(null)

  const restart = () => {
    setStep(0)
    setPred(null)
  }

  const maxNum = 2 * den // valor màxim |fracció| = 2

  const changeDen = (d: number) => {
    const clamped = Math.min(9, Math.max(2, d))
    setDen(clamped)
    setNum((n) => Math.min(n, 2 * clamped))
    restart()
  }

  const applyFraction = (n: number, d: number) => {
    setDen(d)
    setNum(Math.abs(n))
    setSign(n < 0 ? -1 : 1)
    restart()
  }

  const goTo = (s: number) => {
    setStep(Math.min(MAX_STEP, Math.max(0, s)))
  }

  /* Geometria adaptada a l'espai disponible: 1 unitat de l'SVG = 1 píxel */
  const N = Math.max(num, den) // marques necessàries a la recta obliqua
  const [figRef, { w: W, h: H }] = useElementSize<HTMLDivElement>()
  const padTop = 22
  const padBottom = 58

  // Només es mostra el costat de la recta on cau la fracció: així la unitat és tan gran com es pot
  const reach = Math.max(1, Math.ceil(num / den)) + 0.3
  const lo = sign > 0 ? -0.45 : -reach
  const hi = sign > 0 ? reach : 0.45
  const UNIT = Math.max(40, (W - 24) / (hi - lo))
  const O = { x: 12 - lo * UNIT, y: H - padBottom }

  // L'obliqua s'allarga fins a tocar el sostre o el lateral de la figura
  const availH = Math.max(60, O.y - padTop)
  const room = Math.max(60, sign > 0 ? W - 16 - O.x : O.x - 16)
  const THETA = Math.min(MAX_ANGLE, Math.max(MIN_ANGLE, Math.atan2(availH, room)))
  const rayLen = Math.min(availH / Math.sin(THETA), room / Math.cos(THETA))
  const U = rayLen / (N + 0.5)

  const dir = { x: sign * Math.cos(THETA), y: -Math.sin(THETA) }
  const ANG = sign > 0 ? THETA : Math.PI - THETA // angle matemàtic del raig

  const ptA = (i: number) => ({ x: O.x + i * U * dir.x, y: O.y + i * U * dir.y })
  const An = ptA(den)
  const P1 = { x: O.x + sign * UNIT, y: O.y } // punt ±1 de la recta
  const dvec = { x: P1.x - An.x, y: O.y - An.y } // direcció de les paral·leles
  const xAt = (i: number) => {
    const p = ptA(i)
    const t = (O.y - p.y) / dvec.y
    return { x: p.x + t * dvec.x, y: O.y }
  }
  const rayEnd = { x: O.x + rayLen * dir.x, y: O.y + rayLen * dir.y }
  const arcSpan = Math.min(0.34, 24 / U) // arc de compàs curt, encara que la unitat sigui gran
  const labelSize = Math.min(16, Math.max(11, U * 0.42))
  const fracSize = Math.min(15, Math.max(10, (UNIT / den) * 0.3))
  const target = num === 0 ? { x: O.x, y: O.y } : xAt(num)
  // L'etiqueta del resultat va al costat contrari de la paral·lela vermella
  const sideOut = num > 0 && num !== den && ptA(num).x > target.x ? -1 : 1
  const sDisp = sign < 0 && num > 0 ? '−' : ''
  const value = (sign * num) / den
  const predOk =
    pred !== null && (Math.floor(value) === pred || (Number.isInteger(value) && value === pred + 1))

  const ticks = Array.from({ length: Math.floor(hi) - Math.ceil(lo) + 1 }, (_, i) => Math.ceil(lo) + i)
  const chips = [
    { n: 1, d: 2 },
    { n: 3, d: 4 },
    { n: 4, d: 7 },
    { n: 5, d: 8 },
    { n: 3, d: 2 },
    { n: 11, d: 7 },
    { n: -4, d: 7 },
    { n: -3, d: 2 },
  ]

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Columna Esquerra: Controls i Orientacions pedagògiques */}
      <div className="flex flex-col gap-3 lg:col-span-4 lg:min-h-0 lg:overflow-y-auto 2xl:col-span-3">
        {/* Targeta de controls de la fracció */}
        <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            {/* Fracció gran */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-start leading-none" aria-hidden="true">
                {sign < 0 && num > 0 && (
                  <span className="mr-0.5 text-2xl font-bold text-amber-700">−</span>
                )}
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold leading-none text-amber-700">{num}</span>
                  <span className="my-0.5 h-0.5 w-8 rounded bg-stone-700" />
                  <span className="text-2xl font-bold leading-none text-amber-700">{den}</span>
                </div>
              </div>
              <span className="text-xs font-medium text-stone-600">
                {step >= MAX_STEP ? `≈ ${fmtSigned(value)}` : '≈ ?'}
              </span>
            </div>

            {/* Stepper del signe */}
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[11px] font-medium text-stone-500">Signe</span>
              <div className="flex overflow-hidden rounded-md border border-stone-300">
                <button
                  type="button"
                  onClick={() => { setSign(1); restart() }}
                  aria-label="Signe positiu"
                  className={`px-2.5 py-0.5 text-sm font-bold transition-colors ${
                    sign > 0
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-stone-500 hover:bg-amber-50'
                  }`}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => { setSign(-1); restart() }}
                  aria-label="Signe negatiu"
                  className={`border-l border-stone-300 px-2.5 py-0.5 text-sm font-bold transition-colors ${
                    sign < 0
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-stone-500 hover:bg-rose-50'
                  }`}
                >
                  −
                </button>
              </div>
            </div>
          </div>

          {/* Steppers de denominador i numerador */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col items-center rounded-lg border border-stone-200 bg-stone-50 p-2">
              <span className="mb-1 text-[11px] font-medium text-stone-500">Denominador</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => changeDen(den - 1)}
                  disabled={den <= 2}
                  aria-label="Disminueix el denominador"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center text-base font-bold tabular-nums">{den}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => changeDen(den + 1)}
                  disabled={den >= 9}
                  aria-label="Augmenta el denominador"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center rounded-lg border border-stone-200 bg-stone-50 p-2">
              <span className="mb-1 text-[11px] font-medium text-stone-500">Numerador</span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => { setNum((n) => Math.max(0, n - 1)); restart() }}
                  disabled={num <= 0}
                  aria-label="Disminueix el numerador"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-5 text-center text-base font-bold tabular-nums">{num}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => { setNum((n) => Math.min(maxNum, n + 1)); restart() }}
                  disabled={num >= maxNum}
                  aria-label="Augmenta el numerador"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Xips d'exemples */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {chips.map(({ n, d }) => (
              <button
                key={`${n}-${d}`}
                type="button"
                onClick={() => applyFraction(n, d)}
                className={`rounded-md border px-2 py-0.5 text-xs transition-colors ${
                  num === Math.abs(n) && den === d && sign === (n < 0 ? -1 : 1)
                    ? 'border-amber-600 bg-amber-600 font-medium text-white'
                    : 'border-stone-300 bg-white text-stone-600 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                {n < 0 ? '−' : ''}
                {Math.abs(n)}/{d}
              </button>
            ))}
          </div>
        </div>

        {/* Predicció abans de construir */}
        <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-stone-800">
            <HelpCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
            Prediu: entre quins enters cau?
          </h2>
          <div className="grid grid-cols-4 gap-1">
            {[-2, -1, 0, 1].map((k) => {
              const chosen = pred === k
              const reveal = chosen && step >= MAX_STEP
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPred(k)}
                  aria-pressed={chosen}
                  className={`rounded-md border px-1 py-1 text-xs font-semibold tabular-nums transition-colors ${
                    reveal
                      ? predOk ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-rose-500 bg-rose-500 text-white'
                      : chosen ? 'border-stone-800 bg-stone-800 text-white' : 'border-stone-300 bg-white text-stone-600 hover:border-amber-400 hover:bg-amber-50'
                  }`}
                >
                  {fmtInt(k)} i {fmtInt(k + 1)}
                </button>
              )
            })}
          </div>
          <p className="mt-2 flex min-h-5 items-center gap-1 text-xs text-stone-600">
            {pred === null ? (
              'Tria-ho abans de començar.'
            ) : step < MAX_STEP ? (
              'Comprova-ho al final de la construcció.'
            ) : predOk ? (
              <><Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> Ben pensat!</>
            ) : (
              <><X className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" /> Mira on ha caigut i compara-ho amb el valor decimal.</>
            )}
          </p>
        </div>

        {/* La idea clau */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
          <h2 className="mb-1 flex items-center gap-1.5 text-sm font-bold text-amber-900">
            <Sigma className="h-4 w-4" aria-hidden="true" />
            La idea clau
          </h2>
          <p className="text-sm leading-snug text-stone-700">
            El <strong>denominador</strong> diu en quantes parts iguals dividim la unitat; el <strong>numerador</strong>, quantes parts comptem des del 0.
          </p>
          {num > den && num % den !== 0 && (
            <p className="mt-1.5 rounded-md bg-white/80 px-2 py-1 text-sm font-semibold text-amber-900">
              {sDisp}{num}/{den} = {sign < 0 ? `−(${Math.floor(num / den)} + ${num % den}/${den})` : `${Math.floor(num / den)} + ${num % den}/${den}`}
            </p>
          )}
        </div>
      </div>

      {/* Columna dreta: passos i construcció */}
      <div className="flex flex-col gap-2.5 lg:col-span-8 lg:min-h-0 2xl:col-span-9">
        <StepJourney
          labels={['Objectiu', 'Obliqua', 'Marques iguals', sign < 0 ? 'Uneix amb −1' : 'Uneix amb 1', 'Paral·leles', 'Resultat']}
          current={step}
          onChange={goTo}
          tone="amber"
          text={stepText(step, num, den, sign)}
        />

        {/* Construcció interactiva: ocupa tot l'espai que queda */}
        <div ref={figRef} className="relative h-[62vh] min-h-[300px] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm lg:h-auto lg:flex-1">
          {W > 0 && (
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0"
            role="img"
            aria-label={`Construcció de la fracció ${sDisp}${num} entre ${den} sobre la recta numèrica amb el teorema de Tales`}
          >
            <title>{`Representació de ${sDisp}${num}/${den} amb el teorema de Tales`}</title>

            {/* paper quadriculat adaptatiu */}
            <defs>
              <pattern id="thales-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#f5f5f4" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#thales-grid)" />

            {/* Recta numèrica (sempre visible, fletxes als dos costats) */}
            <line x1={22} y1={O.y} x2={W - 22} y2={O.y} stroke="#44403c" strokeWidth={2.4} />
            <polygon points={`${W - 6},${O.y} ${W - 22},${O.y - 7} ${W - 22},${O.y + 7}`} fill="#44403c" />
            <polygon points={`6,${O.y} 22,${O.y - 7} 22,${O.y + 7}`} fill="#44403c" />
            {ticks.map((k) => {
              const x = O.x + k * UNIT
              return (
                <g key={`tick${k}`}>
                  <line x1={x} y1={O.y - 8} x2={x} y2={O.y + 8} stroke="#44403c" strokeWidth={2} />
                  <text x={x} y={O.y + 27} textAnchor="middle" fontSize={17} fill="#57534e">
                    {k < 0 ? `−${-k}` : k}
                  </text>
                </g>
              )
            })}

            {/* Pas 1: recta obliqua */}
            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <motion.line
                  x1={O.x}
                  y1={O.y}
                  x2={rayEnd.x}
                  y2={rayEnd.y}
                  stroke="#d97706"
                  strokeWidth={2.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7 }}
                />
              </motion.g>
            )}

            {/* Pas 2: marques del compàs (amb etiquetes exteriors A1..AN) */}
            {step >= 2 &&
              Array.from({ length: N }, (_, k) => k + 1).map((i) => {
                const prev = ptA(i - 1)
                const p = ptA(i)
                return (
                  <motion.g
                    key={`mark${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.3 }}
                  >
                    <path
                      d={`M ${(prev.x + U * Math.cos(ANG + arcSpan)).toFixed(2)} ${(prev.y - U * Math.sin(ANG + arcSpan)).toFixed(2)} A ${U} ${U} 0 0 1 ${(prev.x + U * Math.cos(ANG - arcSpan)).toFixed(2)} ${(prev.y - U * Math.sin(ANG - arcSpan)).toFixed(2)}`}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth={1.6}
                    />
                    <circle cx={p.x} cy={p.y} r={4} fill="#b45309" />
                    <text
                      x={p.x - sign * 12}
                      y={p.y + 5}
                      textAnchor={sign > 0 ? 'end' : 'start'}
                      fontSize={labelSize}
                      fill="#92400e"
                    >
                      A
                      <tspan dy={3} fontSize={labelSize * 0.75}>
                        {i}
                      </tspan>
                    </text>
                  </motion.g>
                )
              })}

            {/* Pas 3: recta auxiliar */}
            {step >= 3 && (
              <motion.line
                x1={An.x}
                y1={An.y}
                x2={P1.x}
                y2={P1.y}
                stroke="#78716c"
                strokeWidth={1.6}
                strokeDasharray="7 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7 }}
              />
            )}

            {/* Pas 4: paral·leles + subdivisions */}
            {step >= 4 &&
              Array.from({ length: N }, (_, k) => k + 1)
                .filter((i) => i !== den) // la paral·lela per A_den ja és la recta auxiliar
                .map((i) => {
                  const p = ptA(i)
                  const x = xAt(i)
                  return (
                    <motion.g
                      key={`par${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.35 }}
                    >
                      <line
                        x1={p.x}
                        y1={p.y}
                        x2={x.x}
                        y2={x.y}
                        stroke="#a8a29e"
                        strokeWidth={1.3}
                        strokeDasharray="4 3"
                      />
                      {i % den !== 0 && (
                        <circle cx={x.x} cy={O.y} r={3.5} fill="#d97706" />
                      )}
                      {i < den && !(step >= MAX_STEP && i === num) && (
                        <text
                          x={x.x}
                          y={O.y - 11}
                          textAnchor="middle"
                          fontSize={fracSize}
                          fill="#b45309"
                        >
                          {sDisp}
                          {i}/{den}
                        </text>
                      )}
                    </motion.g>
                  )
                })}

            {/* Pas 5: punt destacat */}
            {step >= 5 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {num > 0 && num !== den && (
                  <line
                    x1={ptA(num).x}
                    y1={ptA(num).y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#e11d48"
                    strokeWidth={2.6}
                  />
                )}
                <motion.circle
                  cx={target.x}
                  cy={O.y}
                  r={12}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth={2}
                  animate={{ opacity: [0.75, 0.08, 0.75] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
                <circle cx={target.x} cy={O.y} r={5} fill="#e11d48" />
                <text
                  x={target.x + sideOut * 12}
                  y={O.y - 16}
                  textAnchor={sideOut > 0 ? 'start' : 'end'}
                  fontSize={22}
                  fontWeight={700}
                  fill="#be123c"
                >
                  {sDisp}
                  {num}/{den}
                </text>
                <text x={target.x} y={O.y + 48} textAnchor="middle" fontSize={14} fill="#78716c">
                  ≈ {fmtSigned((sign * num) / den)}
                </text>
              </motion.g>
            )}
          </svg>
          )}
        </div>
      </div>
    </div>
  )
}
