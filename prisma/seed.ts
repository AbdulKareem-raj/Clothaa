import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../src/data/products'
import { BLOG_POSTS } from '../src/data/blogPosts'

const prisma = new PrismaClient()

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

const FAQS = [
  { question: 'How long does delivery take?', answer: 'Standard delivery: 3–7 business days. Express: 1–2 business days. International: 7–14 business days.', category: 'Shipping', sortOrder: 1 },
  { question: 'Do you offer free shipping?', answer: 'Yes — free standard shipping on all orders over $150. Orders under $150 incur a flat $9.99 fee.', category: 'Shipping', sortOrder: 2 },
  { question: 'What is your return policy?', answer: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached.', category: 'Returns', sortOrder: 1 },
  { question: 'How do I start a return?', answer: 'Email hello@example.com with your order number. We will send you a prepaid return label within 24 hours.', category: 'Returns', sortOrder: 2 },
  { question: 'How do I find my size?', answer: 'Each product page has a size guide. When in doubt, size up — our jackets are designed for a relaxed fit.', category: 'Products', sortOrder: 1 },
  { question: 'What payment methods do you accept?', answer: 'All major cards, Apple Pay, Google Pay, and Cash on Delivery (COD) in eligible areas.', category: 'Payment', sortOrder: 1 },
  { question: 'How do I track my order?', answer: 'Once your order ships you receive an email with a tracking number. You can also view status in your account.', category: 'Orders', sortOrder: 1 },
]

async function main() {
  console.log('🌱 Seeding database…')

  // ── Categories ──
  const categoryNames = Array.from(new Set(PRODUCTS.map((p) => p.category)))
  const categoryByName = new Map<string, string>()
  for (const name of categoryNames) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) },
    })
    categoryByName.set(name, cat.id)
  }
  console.log(`   Categories: ${categoryNames.length}`)

  // ── Products (keep the storefront id as the DB id) ──
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i]
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        priceCents: Math.round(p.price * 100),
        comparePriceCents: p.oldPrice ? Math.round(p.oldPrice * 100) : null,
        images: [p.image],
        badge: p.badge ?? null,
        sizes: p.sizes,
        description: p.description,
        categoryId: categoryByName.get(p.category)!,
      },
      create: {
        id: p.id,
        sku: p.id,
        name: p.name,
        slug: slugify(p.name) + '-' + p.id.toLowerCase(),
        description: p.description,
        priceCents: Math.round(p.price * 100),
        comparePriceCents: p.oldPrice ? Math.round(p.oldPrice * 100) : null,
        images: [p.image],
        videos: [],
        badge: p.badge ?? null,
        sizes: p.sizes,
        stock: 25,
        isActive: true,
        isFeatured: i < 4,
        categoryId: categoryByName.get(p.category)!,
      },
    })
  }
  console.log(`   Products: ${PRODUCTS.length}`)

  // ── Blog posts ──
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        readTime: post.readTime,
        tags: post.tags,
        isPublished: true,
        publishedAt: new Date(post.publishedAt),
      },
    })
  }
  console.log(`   Blog posts: ${BLOG_POSTS.length}`)

  // ── FAQs ──
  const existingFaqs = await prisma.fAQ.count()
  if (existingFaqs === 0) {
    await prisma.fAQ.createMany({ data: FAQS })
    console.log(`   FAQs: ${FAQS.length}`)
  } else {
    console.log('   FAQs: skipped (already present)')
  }

  console.log('✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
