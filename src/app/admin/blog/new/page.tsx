import BlogForm from '@/components/admin/BlogForm'

export const dynamic = 'force-dynamic'

export default function NewBlogPage() {
  return (
    <div>
      <h1>New post</h1>
      <BlogForm mode="create" />
    </div>
  )
}
