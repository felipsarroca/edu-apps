'use client'

import { useState, type DragEvent, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Shuffle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  NUMEROS,
  type Conjunt,
  type Nivell,
  type Numero,
} from './numeros-db'

/* ---------- Estil de cada conjunt ---------- */

const ESTIL: Record<
  Conjunt,
  { border: string; bg: string; text: string; ring: string; nom: string; lletra: string }
> = {
  I: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-50/60',
    text: 'text-emerald-800',
    ring: 'ring-emerald-300',
    nom: 'Irracionals',
    lletra: '',
  },
  Q: {
    border: 'border-sky-400',
    bg: 'bg-sky-50/40',
    text: 'text-sky-800',
    ring: 'ring-sky-300',
    nom: 'Racionals',
    lletra: 'ℚ',
  },
  Z: {
    border: 'border-violet-400',
    bg: 'bg-violet-50/50',
    text: 'text-violet-800',
    ring: 'ring-violet-300',
    nom: 'Enters',
    lletra: 'ℤ',
  },
  N: {
    border: 'border-amber-400',
    bg: 'bg-amber-50/70',
    text: 'text-amber-900',
    ring: 'ring-amber-300',
    nom: 'Naturals',
    lletra: 'ℕ',
  },
}

const NIVELLS: { n: Nivell; nom: string }[] = [
  { n: 1, nom: 'Fàcil' },
  { n: 2, nom: 'Mitjà' },
  { n: 3, nom: 'Difícil' },
]

const ORDRE: Conjunt[] = ['N', 'Z', 'Q']

/** Pista sense revelar la resposta: compara el conjunt triat amb el correcte. */
function pista(correcte: Conjunt, triat: Conjunt): string {
  if (correcte === 'I') return 'Es pot escriure com a fracció d’enters? Si no es pot, no és racional.'
  if (triat === 'I') return 'Sí que es pot escriure com a fracció d’enters. Calcula’l o simplifica’l.'
  if (ORDRE.indexOf(triat) > ORDRE.indexOf(correcte))
    return 'Hi pertany, però no és el conjunt més específic. Prova un conjunt més petit.'
  if (correcte === 'Z') return 'És negatiu, i els naturals són positius.'
  return 'No és un nombre enter: calcula’l i mira si té part decimal.'
}

function barreja<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ---------- Component ---------- */

export function ClassificacioSection() {
  const [nivell, setNivell] = useState<Nivell>(1)
  const [pool, setPool] = useState<Numero[]>(() => NUMEROS.filter((x) => x.n === 1))
  const [placed, setPlaced] = useState<string[]>([])
  const [errs, setErrs] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [sobre, setSobre] = useState<Conjunt | null>(null)
  const [flash, setFlash] = useState<Conjunt | null>(null)
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string; clau: number } | null>(
    null
  )

  const pendents = pool.filter((p) => !placed.includes(p.v))
  const complets = pool.length > 0 && pendents.length === 0
  const aLaPrimera = placed.filter((v) => !errs.includes(v)).length
  const comptador = (c: Conjunt) => pool.filter((p) => p.c === c).length

  const reinicia = (n: Nivell = nivell) => {
    setNivell(n)
    setPool(barreja(NUMEROS.filter((x) => x.n === n)))
    setPlaced([])
    setErrs([])
    setSelected(null)
    setSobre(null)
    setFeedback(null)
  }

  const coloca = (v: string, zona: Conjunt) => {
    const num = pool.find((p) => p.v === v)
    if (!num || placed.includes(v)) return
    if (num.c === zona) {
      setPlaced((ps) => [...ps, v])
      setFeedback({ ok: true, text: `Correcte! ${num.v}: ${num.e}`, clau: Date.now() })
    } else {
      const segonError = errs.includes(v)
      setErrs((ps) => (ps.includes(v) ? ps : [...ps, v]))
      setFeedback({
        ok: false,
        text: segonError
          ? `${num.v} no va a ${ESTIL[zona].nom.toLowerCase()}. ${num.e}`
          : `${num.v}: no. ${pista(num.c, zona)}`,
        clau: Date.now(),
      })
      setFlash(zona)
      setTimeout(() => setFlash(null), 700)
    }
    setSelected(null)
  }

  const propsDeZona = (c: Conjunt) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setSobre(c)
    },
    onDragLeave: () => setSobre((s) => (s === c ? null : s)),
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setSobre(null)
      const v = e.dataTransfer.getData('text/plain')
      if (v) coloca(v, c)
    },
    onClick: (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (selected) coloca(selected, c)
    },
  })

  const capsaleraZona = (c: Conjunt) => {
    const st = ESTIL[c]
    return (
      <div className="mb-1.5 flex items-baseline gap-1.5">
        {st.lletra && (
          <span className={`text-xl font-black leading-none ${st.text}`}>{st.lletra}</span>
        )}
        <span className={`text-sm font-bold ${st.text}`}>
          {st.nom}
          {c === 'I' && <span className="ml-1 text-xs font-medium opacity-70">(ℝ − ℚ)</span>}
          {c === 'N' && <span className="ml-1 text-xs font-medium opacity-70">{'{1, 2, 3, …}'}</span>}
        </span>
        <span className="ml-auto rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-stone-600 tabular-nums">
          {placed.filter((v) => pool.find((p) => p.v === v)?.c === c).length}/{comptador(c)}
        </span>
      </div>
    )
  }

  const chipsZona = (c: Conjunt) => (
    <div className="flex flex-wrap content-start gap-1 overflow-y-auto">
      {placed
        .filter((v) => pool.find((p) => p.v === v)?.c === c)
        .map((v) => {
          const num = pool.find((p) => p.v === v)!
          return (
            <button
              key={v}
              type="button"
              title={num.e}
              onClick={(e) => {
                e.stopPropagation()
                setFeedback({ ok: true, text: `${v}: ${num.e}`, clau: Date.now() })
              }}
              className={`rounded-md border border-current/25 bg-white/90 px-1.5 py-0.5 text-xs font-bold tabular-nums ${ESTIL[c].text} transition-colors hover:bg-white`}
            >
              {v}
            </button>
          )
        })}
    </div>
  )

  const classeZona = (c: Conjunt, extra = '') => {
    const st = ESTIL[c]
    return `cursor-pointer rounded-xl border-2 p-2.5 transition-all ${extra} ${
      flash === c ? 'border-rose-400 bg-rose-50' : `${st.border} ${st.bg}`
    } ${sobre === c ? `ring-4 ${st.ring}` : ''} ${selected ? 'hover:brightness-[0.98]' : ''}`
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Columna esquerra: nivell, banc i retroacció */}
      <div className="flex flex-col gap-3 lg:col-span-5 lg:min-h-0 lg:overflow-y-auto">
        <div className="flex items-center gap-1.5">
          {NIVELLS.map(({ n, nom }) => (
            <button
              key={n}
              type="button"
              onClick={() => reinicia(n)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold transition-colors ${
                nivell === n
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-300 bg-white text-stone-600 hover:border-stone-500 hover:bg-stone-50'
              }`}
            >
              {nom}
            </button>
          ))}
          <Button variant="outline" size="icon" onClick={() => reinicia()} aria-label="Barreja i torna a començar" title="Barreja">
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-stone-700">Arrossega o clica cada nombre</span>
            <span className="text-xs font-semibold text-stone-500">ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ</span>
          </div>
          <div className="flex max-h-56 min-h-12 flex-wrap content-start gap-1.5 overflow-y-auto pr-1">
            {pendents.map((num) => (
              <div
                key={num.v}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', num.v)
                  e.dataTransfer.effectAllowed = 'move'
                }}
                onClick={() => setSelected((s) => (s === num.v ? null : num.v))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected((s) => (s === num.v ? null : num.v))
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={selected === num.v}
                aria-label={`Nombre ${num.v}, sense classificar`}
                className={`cursor-grab select-none rounded-lg border px-2.5 py-1 text-sm font-bold tabular-nums transition-all active:cursor-grabbing ${
                  selected === num.v
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : errs.includes(num.v)
                      ? 'border-rose-300 bg-rose-50 text-rose-800 hover:border-rose-400'
                      : 'border-stone-300 bg-white text-stone-700 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                {num.v}
              </div>
            ))}
            {complets && (
              <div className="w-full rounded-lg bg-emerald-50 px-3 py-2 text-center">
                <p className="text-sm font-bold text-emerald-900">Nivell completat!</p>
                <p className="text-xs text-emerald-700">
                  {aLaPrimera} de {pool.length} a la primera.{' '}
                  {nivell < 3 ? (
                    <button type="button" onClick={() => reinicia((nivell + 1) as Nivell)} className="font-semibold underline">
                      Passa al nivell següent
                    </button>
                  ) : (
                    <button type="button" onClick={() => reinicia()} className="font-semibold underline">
                      Una altra ronda
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-stone-600">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${pool.length ? (placed.length / pool.length) * 100 : 0}%` }}
              />
            </div>
            <span className="font-semibold tabular-nums">{placed.length}/{pool.length}</span>
            <span title="Encerts a la primera" className="tabular-nums">· <Check className="inline h-3 w-3" aria-hidden="true" /> {aLaPrimera}</span>
          </div>
        </div>

        <div className="min-h-16" aria-live="polite">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback.clau}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium ${
                  feedback.ok
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-rose-200 bg-rose-50 text-rose-900'
                }`}
              >
                {feedback.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <X className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>{feedback.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Columna dreta: diagrama de conjunts */}
      <div className="relative mt-2 flex flex-col rounded-2xl border-2 border-stone-800 bg-white p-3 pt-4 lg:col-span-7 lg:min-h-0">
        <span className="absolute -top-3.5 left-4 bg-white px-2 text-lg font-black text-stone-900">ℝ · Reals</span>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:min-h-0">
          <div
            {...propsDeZona('I')}
            role="button"
            aria-label="Zona per als nombres irracionals"
            className={classeZona('I', 'flex min-h-28 flex-col sm:w-[34%]')}
          >
            {capsaleraZona('I')}
            <div className="min-h-10 flex-1 overflow-y-auto">{chipsZona('I')}</div>
          </div>

          <div {...propsDeZona('Q')} role="button" aria-label="Zona per als nombres racionals" className={`flex min-w-0 flex-1 flex-col ${classeZona('Q')}`}>
            {capsaleraZona('Q')}
            <div className="min-h-10 flex-1 overflow-y-auto">{chipsZona('Q')}</div>
            <div {...propsDeZona('Z')} role="button" aria-label="Zona per als nombres enters" className={`mt-2.5 flex flex-[2] flex-col ${classeZona('Z')}`}>
              {capsaleraZona('Z')}
              <div className="min-h-10 flex-1 overflow-y-auto">{chipsZona('Z')}</div>
              <div {...propsDeZona('N')} role="button" aria-label="Zona per als nombres naturals" className={`mt-2.5 flex min-h-24 flex-1 flex-col ${classeZona('N')}`}>
                {capsaleraZona('N')}
                <div className="min-h-10 flex-1 overflow-y-auto">{chipsZona('N')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
