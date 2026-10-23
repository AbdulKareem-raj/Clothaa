import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import WishlistRemoveButton from '@/components/account/WishlistItem'

export const dynamic = 'force-dynamic'

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default async function WishlistPage() {
  const session = await auth()
  const items = await prisma.wishlist.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 'normal', fontSize: 22, marginTop: 0 }}>Wishlist</h2>

      {items.length === 0 ? (
        <div className="admin-card">
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Your wishlist is empty.</p>
          <Link href="/shop" className="button dark">Browse jackets ↗</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
          {items.map(({ product }) => (
            <div key={product.id}>
              <Link href={`/shop/${product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '4/5', background: '#eee', marginBottom: 10 }}>
                {product.images[0] && <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} />}
              </Link>
              <p style={{ fontSize: 13, fontWeight: 'bold', margin: '0 0 2px' }}>{product.name}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 6px' }}>{money(product.priceCents)}</p>
              <WishlistRemoveButton productId={product.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
