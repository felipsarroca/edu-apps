import Link from 'next/link'
import { MainNav } from './main-nav'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-66px)] flex-col bg-white lg:h-[calc(100dvh-66px)]">
      <header className="sticky top-0 z-50 shrink-0 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-2 px-4 py-1.5">
          <Link href="/" className="group flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            <img src={`${basePath}/favicon2.svg`} width="44" height="44" alt="" className="h-10 w-10 object-contain transition-transform group-hover:-rotate-6 sm:h-11 sm:w-11" />
            <span className="flex flex-col leading-none">
              <span className="bg-gradient-to-r from-amber-600 via-emerald-600 to-sky-600 bg-clip-text font-[family-name:var(--font-fraunces)] text-2xl font-extrabold tracking-tight text-transparent sm:text-[1.9rem]">
                La recta numèrica
              </span>
              <svg viewBox="0 0 200 8" preserveAspectRatio="none" className="mt-1 h-2 w-full" aria-hidden="true">
                <line x1="0" y1="4" x2="200" y2="4" stroke="#a8a29e" strokeWidth="1.2" />
                {[0, 40, 80, 120, 160, 199].map((x) => (
                  <line key={x} x1={x} y1="0.5" x2={x} y2="7.5" stroke="#78716c" strokeWidth="1.2" />
                ))}
                <circle cx="57" cy="4" r="2.6" fill="#d97706" />
                <circle cx="96" cy="4" r="2.6" fill="#059669" />
                <circle cx="148" cy="4" r="2.6" fill="#0284c7" />
              </svg>
            </span>
          </Link>
          <MainNav />
        </div>
      </header>
      <main id="contingut" className="flex min-h-0 flex-1 flex-col lg:overflow-y-auto">{children}</main>
      <footer className="felip-app-footer">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener noreferrer" aria-label="Llicència Creative Commons BY-NC-SA 4.0" className="felip-license-image-link">
          <img src={`${basePath}/CC_BY-NC-SA.png`} width="78" height="27" alt="Creative Commons BY-NC-SA" className="felip-license-image" />
        </a>
        <div className="felip-footer-text">
          <p>Aplicació creada per <a href="https://ja.cat/felipsarroca" target="_blank" rel="noopener noreferrer">Felip Sarroca</a> amb assistència de la IA</p>
          <p>Obra sota llicència <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a></p>
        </div>
      </footer>
    </div>
  )
}
