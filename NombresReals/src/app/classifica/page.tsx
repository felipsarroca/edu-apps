import { Boxes } from 'lucide-react'
import { PageTitle } from '@/components/page-title'
import { ClassificacioSection } from '@/components/math/classificacio-section'

export default function ClassificaPage() {
  return (
    <section className="mx-auto flex w-full max-w-[1800px] min-h-0 flex-1 flex-col px-4 py-3">
      <PageTitle icon={Boxes} tone="sky">Classifica els nombres reals</PageTitle>
      <ClassificacioSection />
    </section>
  )
}
