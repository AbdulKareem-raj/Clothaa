import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!product) notFound()

  return (
    <div>
      <h1>Edit product</h1>
      <ProductForm
        mode="edit"
        initial={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          description: product.description,
          price: product.priceCents / 100,
          comparePrice: product.comparePriceCents ? product.comparePriceCents / 100 : null,
          category: product.category.name,
          badge: product.badge ?? '',
          sizes: product.sizes,
          stock: product.stock,
          images: product.images,
          videos: product.videos,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        }}
      />
    </div>
  )
}
