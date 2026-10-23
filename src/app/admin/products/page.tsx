import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Products</h1>
        <Link href="/admin/products/new" className="button dark" style={{ marginTop: 0 }}>+ New product</Link>
      </div>

      {products.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>
            No products yet. Run <code>npm run db:seed</code> to import the starter catalog, or add one manually.
          </p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 'bold' }}>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.category.name}</td>
                <td>{money(p.priceCents)}</td>
                <td style={{ color: p.stock < 5 ? '#b3261e' : 'inherit' }}>{p.stock}</td>
                <td>
                  <span className="badge-pill" style={{ background: p.isActive ? '#e6f4ea' : '#f1f1f1', color: p.isActive ? '#1e7e34' : '#888' }}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/products/${p.id}/edit`} style={{ color: 'var(--gold)', fontWeight: 'bold', marginRight: 12 }}>Edit</Link>
                  <DeleteProductButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
