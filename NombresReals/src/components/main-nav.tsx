'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { href: '/fraccions', label: 'Fraccions · Tales', active: 'bg-amber-100 text-amber-900' },
  { href: '/irracionals', label: 'Irracionals · Pitàgores', active: 'bg-emerald-100 text-emerald-900' },
  { href: '/classifica', label: 'Classifica', active: 'bg-sky-100 text-sky-900' },
]

export function MainNav() {
  const pathname = usePathname()
  return (
    <nav className="flex w-full flex-wrap gap-1 text-xs sm:w-auto sm:text-sm" aria-label="Navegació principal">
      {navigation.map((item) => {
        const current = pathname?.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? 'page' : undefined}
            className={`rounded-md px-2.5 py-1.5 font-medium focus-visible:outline-2 focus-visible:outline-emerald-600 ${current ? item.active : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
