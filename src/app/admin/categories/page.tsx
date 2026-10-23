import { prisma } from '@/lib/prisma'
import CategoryManager from '@/components/admin/CategoryManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  const serialized = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productCount: c._count.products,
  }))

  return (
    <div>
      <h1>Categories</h1>
      <CategoryManager initial={serialized} />
    </div>
  )
}
