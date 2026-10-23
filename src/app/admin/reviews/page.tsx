import { prisma } from '@/lib/prisma'
import ReviewActions from '@/components/admin/ReviewActions'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ isApproved: 'asc' }, { createdAt: 'desc' }],
    include: { user: { select: { name: true, email: true } }, product: { select: { name: true } } },
  })

  return (
    <div>
      <h1>Reviews</h1>
      {reviews.length === 0 ? (
        <div className="admin-card"><p style={{ color: 'var(--muted)', fontSize: 14 }}>No reviews yet.</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Product</th><th>Rating</th><th>Review</th><th>By</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td style={{ fontWeight: 'bold' }}>{r.product.name}</td>
                <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                <td style={{ maxWidth: 280 }}>
                  {r.title && <strong>{r.title}<br /></strong>}
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{r.body}</span>
                </td>
                <td>{r.user.name || r.user.email}</td>
                <td>
                  <span className="badge-pill" style={{ background: r.isApproved ? '#e6f4ea' : '#fff3cd', color: r.isApproved ? '#1e7e34' : '#8a6d1f' }}>
                    {r.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td><ReviewActions id={r.id} isApproved={r.isApproved} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
