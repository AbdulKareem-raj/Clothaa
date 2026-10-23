import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default function NewProductPage() {
  return (
    <div>
      <h1>New product</h1>
      <ProductForm mode="create" />
    </div>
  )
}
