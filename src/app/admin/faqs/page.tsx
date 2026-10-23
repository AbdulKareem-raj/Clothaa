import { prisma } from '@/lib/prisma'
import FaqManager from '@/components/admin/FaqManager'

export const dynamic = 'force-dynamic'

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany({ orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }] })
  return (
    <div>
      <h1>FAQs</h1>
      <FaqManager initial={faqs} />
    </div>
  )
}
