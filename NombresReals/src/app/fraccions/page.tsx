import { Ruler } from 'lucide-react'
import { PageTitle } from '@/components/page-title'
import { ThalesConstruction } from '@/components/math/thales-construction'

export default function FraccionsPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1800px] min-h-0 flex-1 flex-col px-4 py-3">
      <PageTitle icon={Ruler} tone="amber">Fraccions amb el teorema de Tales</PageTitle>
      <ThalesConstruction />
    </section>
  )
}
