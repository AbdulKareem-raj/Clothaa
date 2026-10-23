import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteBlogButton from '@/components/admin/DeleteBlogButton'

export const dynamic = 'force-dynamic'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Blog</h1>
        <Link href="/admin/blog/new" className="button dark" style={{ marginTop: 0 }}>+ New post</Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-card"><p style={{ color: 'var(--muted)', fontSize: 14 }}>No posts yet.</p></div>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th>Created</th><th></th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 'bold' }}>{p.title}</td>
                <td>{p.category}</td>
                <td>
                  <span className="badge-pill" style={{ background: p.isPublished ? '#e6f4ea' : '#fff3cd', color: p.isPublished ? '#1e7e34' : '#8a6d1f' }}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{p.views}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/blog/${p.id}/edit`} style={{ color: 'var(--gold)', fontWeight: 'bold', marginRight: 12 }}>Edit</Link>
                  <DeleteBlogButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
