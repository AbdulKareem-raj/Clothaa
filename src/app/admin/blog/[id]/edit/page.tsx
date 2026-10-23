import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogForm from '@/components/admin/BlogForm'

export const dynamic = 'force-dynamic'

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } })
  if (!post) notFound()

  return (
    <div>
      <h1>Edit post</h1>
      <BlogForm
        mode="edit"
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? '',
          category: post.category,
          readTime: post.readTime,
          tags: post.tags,
          isPublished: post.isPublished,
        }}
      />
    </div>
  )
}
