import { prisma } from '@/lib/prisma'
import CouponManager from '@/components/admin/CouponManager'

export const dynamic = 'force-dynamic'

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  const serialized = coupons.map((c) => ({
    ...c,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
  }))
  return (
    <div>
      <h1>Coupons</h1>
      <CouponManager initial={serialized} />
    </div>
  )
}
