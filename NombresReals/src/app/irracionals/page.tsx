import { Compass } from 'lucide-react'
import { PageTitle } from '@/components/page-title'
import { PythagorasConstruction } from '@/components/math/pythagoras-construction'

export default function IrracionalsPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1800px] min-h-0 flex-1 flex-col px-4 py-3">
      <PageTitle icon={Compass} tone="emerald">Irracionals amb el teorema de Pitàgores</PageTitle>
      <PythagorasConstruction />
    </section>
  )
}
