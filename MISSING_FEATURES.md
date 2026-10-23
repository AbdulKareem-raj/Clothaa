# Northline — Complete Feature Implementation Plan
> Updated with: NextAuth credentials, Cloudinary, Mixpanel, FAQ, Blog, Admin Dashboard, Role-based accounts

---

## CURRENT STATUS

| Feature | Status |
|---|---|
| Product listing / shop page | ✅ Done |
| Category filter + search + sort | ✅ Done |
| Product detail page | ✅ Done |
| Cart (localStorage) | ✅ Done |
| Newsletter API | ✅ Done |
| Contact form API | ✅ Done |
| Nodemailer email | ✅ Done |
| Mobile responsive | ✅ Done |

---

## ════════════════════════════════════════
## PART 1 — DATABASE SCHEMA (Prisma + PostgreSQL)
## ════════════════════════════════════════

### Install karo
```bash
npm install prisma @prisma/client bcryptjs
npm install -D @types/bcryptjs
npx prisma init
```

### .env mein add karo
```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
```

### prisma/schema.prisma — Complete Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ───────────────────────────────────────

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
}

enum PaymentMethod {
  COD
  STRIPE
  EASYPAISA
  JAZZCASH
}

enum CouponType {
  PERCENT
  FIXED
}

// ─── USER ────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  phone         String?
  passwordHash  String
  role          Role      @default(USER)
  avatarUrl     String?
  isActive      Boolean   @default(true)
  emailVerified Boolean   @default(false)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders        Order[]
  reviews       Review[]
  addresses     Address[]
  wishlist      Wishlist[]
  sessions      UserSession[]
  activities    UserActivity[]   // Mixpanel backup
}

// ─── USER SESSION ─────────────────────────────────

model UserSession {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

// ─── USER ACTIVITY (Mixpanel backup) ─────────────

model UserActivity {
  id        String   @id @default(cuid())
  event     String   // "product_viewed", "add_to_cart", etc.
  data      Json     // Event properties
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  sessionId String?
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())
}

// ─── CATEGORY ────────────────────────────────────

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  imageUrl    String?
  sortOrder   Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  products    Product[]
}

// ─── PRODUCT ─────────────────────────────────────

model Product {
  id                String   @id @default(cuid())
  sku               String   @unique
  name              String
  slug              String   @unique
  description       String
  priceCents        Int
  comparePriceCents Int?
  images            String[] // Cloudinary URLs
  videos            String[] // Cloudinary video URLs
  badge             String?
  sizes             String[]
  stock             Int      @default(0)
  isActive          Boolean  @default(true)
  isFeatured        Boolean  @default(false)
  metaTitle         String?
  metaDesc          String?
  weight            Float?
  views             Int      @default(0)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])

  orderItems  OrderItem[]
  reviews     Review[]
  wishlist    Wishlist[]
}

// ─── ADDRESS ─────────────────────────────────────

model Address {
  id         String   @id @default(cuid())
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  state      String?
  postalCode String
  country    String   @default("PK")
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())

  userId     String?
  user       User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  orders     Order[]
}

// ─── ORDER ───────────────────────────────────────

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentMethod   PaymentMethod @default(COD)
  stripePaymentId String?
  subtotalCents   Int
  shippingCents   Int           @default(0)
  discountCents   Int           @default(0)
  totalCents      Int
  notes           String?
  trackingNumber  String?
  guestEmail      String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  userId          String?
  user            User?         @relation(fields: [userId], references: [id], onDelete: SetNull)
  addressId       String
  address         Address       @relation(fields: [addressId], references: [id])
  couponId        String?
  coupon          Coupon?       @relation(fields: [couponId], references: [id])
  items           OrderItem[]
}

// ─── ORDER ITEM ───────────────────────────────────

model OrderItem {
  id           String  @id @default(cuid())
  qty          Int
  priceCents   Int
  size         String
  productName  String  // Snapshot
  productImage String  // Snapshot
  productId    String
  product      Product @relation(fields: [productId], references: [id])
  orderId      String
  order        Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

// ─── REVIEW ──────────────────────────────────────

model Review {
  id         String   @id @default(cuid())
  rating     Int
  title      String?
  body       String
  isVerified Boolean  @default(false)
  isApproved Boolean  @default(false)
  createdAt  DateTime @default(now())

  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([userId, productId])
}

// ─── COUPON ───────────────────────────────────────

model Coupon {
  id            String     @id @default(cuid())
  code          String     @unique
  type          CouponType
  value         Int
  minOrderCents Int?
  maxUses       Int?
  usedCount     Int        @default(0)
  expiresAt     DateTime?
  isActive      Boolean    @default(true)
  createdAt     DateTime   @default(now())
  orders        Order[]
}

// ─── WISHLIST ─────────────────────────────────────

model Wishlist {
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@id([userId, productId])
}

// ─── BLOG POST ────────────────────────────────────

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   // HTML ya Markdown
  coverImage  String?  // Cloudinary URL
  isPublished Boolean  @default(false)
  publishedAt DateTime?
  metaTitle   String?
  metaDesc    String?
  tags        String[]
  views       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ─── FAQ ─────────────────────────────────────────

model FAQ {
  id        String   @id @default(cuid())
  question  String
  answer    String
  category  String   @default("General") // "Shipping", "Returns", "Products"
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
}

// ─── NEWSLETTER ───────────────────────────────────

model NewsletterSubscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  isActive  Boolean  @default(true)
  source    String?
  createdAt DateTime @default(now())
}

// ─── CONTACT MESSAGE ──────────────────────────────

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

```bash
# Migrate karo
npx prisma migrate dev --name init
npx prisma generate
```

---

## ════════════════════════════════════════
## PART 2 — AUTHENTICATION (NextAuth v5 — Credentials Only)
## ════════════════════════════════════════

### Install
```bash
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs
```

### .env
```env
NEXTAUTH_SECRET="openssl rand -base64 32 se generate karo"
NEXTAUTH_URL="http://localhost:3000"
```

### File Structure
```
src/
├── auth.ts                          ← NextAuth config (root level)
├── middleware.ts                    ← Route protection
└── app/
    ├── api/auth/[...nextauth]/
    │   └── route.ts
    ├── (auth)/
    │   ├── login/page.tsx
    │   └── signup/page.tsx
    └── (admin)/
        ├── layout.tsx               ← Admin guard
        └── dashboard/page.tsx
```

### src/auth.ts — NextAuth Config

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.isActive) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        if (!valid) return null

        // Last login update
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          role:  user.role,  // "USER" | "ADMIN"
        }
      },
    }),
  ],

  callbacks: {
    // Role ko JWT mein save karo
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = (user as any).role
      }
      return token
    },
    // JWT se session mein lao
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  session: { strategy: 'jwt' },
})
```

### TypeScript types extend karo

```typescript
// src/types/next-auth.d.ts
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id:   string
      role: 'USER' | 'ADMIN'
    } & DefaultSession['user']
  }
}
```

### src/app/api/auth/[...nextauth]/route.ts

```typescript
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

### src/middleware.ts — Route Protection

```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Admin routes — sirf ADMIN access kar sakta hai
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  // Protected user routes — login zaroori hai
  if (pathname.startsWith('/orders') || pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/account/:path*'],
}
```

### Signup API

```typescript
// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { name, email, password } = await request.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be 8+ characters' }, { status: 400 })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'USER' },
    select: { id: true, email: true, name: true },
  })

  return NextResponse.json({ success: true, user }, { status: 201 })
}
```

### Admin banana ka tarika

```typescript
// Terminal mein ya seed script se:
// src/scripts/createAdmin.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const hash = await bcrypt.hash('StrongPassword123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@northline.com' },
    update: {},
    create: {
      name:         'Admin',
      email:        'admin@northline.com',
      passwordHash: hash,
      role:         'ADMIN',
    },
  })
  console.log('Admin created!')
}
main()
```

```bash
npx ts-node src/scripts/createAdmin.ts
```

### Session use kaise karein

```typescript
// Server Component mein
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  if (!session) return <p>Please login</p>
  return <p>Welcome {session.user.name} — Role: {session.user.role}</p>
}

// Client Component mein
'use client'
import { useSession } from 'next-auth/react'

export default function UserMenu() {
  const { data: session } = useSession()
  return session ? <p>{session.user.name}</p> : <a href="/login">Login</a>
}
```

---

## ════════════════════════════════════════
## PART 3 — CLOUDINARY (Images + Videos)
## ════════════════════════════════════════

### Install
```bash
npm install cloudinary next-cloudinary
```

### .env
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="aapka-cloud-name"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="secret-key"
```

### Free account: cloudinary.com → 25GB free storage

### File Structure
```
src/
├── lib/cloudinary.ts           ← Server-side config
└── components/
    ├── CloudinaryUpload.tsx    ← Image upload widget
    └── CloudinaryVideo.tsx     ← Video player
```

### src/lib/cloudinary.ts

```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

export default cloudinary
```

### Upload API Route

```typescript
// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { auth } from '@/auth'

export async function POST(request: Request) {
  // Sirf ADMIN upload kar sakta hai
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const type = formData.get('type') as string // 'image' | 'video'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<any>((resolve, reject) => {
    const folder = type === 'video' ? 'northline/videos' : 'northline/products'
    
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: type === 'video' ? 'video' : 'image',
        // Image optimization — auto format aur quality
        ...(type !== 'video' && {
          transformation: [
            { width: 900, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        }),
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })

  return NextResponse.json({
    url:       result.secure_url,
    publicId:  result.public_id,
    width:     result.width,
    height:    result.height,
    format:    result.format,
  })
}
```

### Image Upload Component (Admin ke liye)

```typescript
// src/components/CloudinaryUpload.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Props {
  onUpload: (url: string) => void
  type?: 'image' | 'video'
  label?: string
}

export default function CloudinaryUpload({ onUpload, type = 'image', label }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Size check — image 5MB, video 50MB
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File too large. Max ${type === 'video' ? '50MB' : '5MB'}`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const res  = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setPreview(data.url)
      onUpload(data.url)
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, marginBottom: 6 }}>
        {label || (type === 'video' ? 'Upload Video' : 'Upload Image')}
      </label>
      <input
        type="file"
        accept={type === 'video' ? 'video/*' : 'image/*'}
        onChange={handleChange}
        disabled={uploading}
      />
      {uploading && <p style={{ fontSize: 12 }}>Uploading…</p>}
      {preview && type === 'image' && (
        <Image src={preview} alt="Preview" width={200} height={200}
          style={{ objectFit: 'cover', marginTop: 8 }} />
      )}
      {preview && type === 'video' && (
        <video src={preview} controls width={300} style={{ marginTop: 8 }} />
      )}
    </div>
  )
}
```

### Product mein multiple images upload

```typescript
// Admin product form mein:
const [images, setImages] = useState<string[]>([])

<CloudinaryUpload
  onUpload={(url) => setImages(prev => [...prev, url])}
  label="Product Image add karo"
/>

// Display:
{images.map((url, i) => (
  <Image key={i} src={url} alt={`Product ${i+1}`} width={100} height={100} />
))}
```

---

## ════════════════════════════════════════
## PART 4 — MIXPANEL (User Activity Tracking)
## ════════════════════════════════════════

### Install
```bash
npm install mixpanel-browser
npm install -D @types/mixpanel-browser
```

### .env
```env
NEXT_PUBLIC_MIXPANEL_TOKEN="your-project-token"
```

### Free account: mixpanel.com → unlimited events free (1 year retention)

### File Structure
```
src/
└── lib/
    ├── mixpanel.ts         ← Mixpanel init
    └── analytics.ts        ← Track functions
```

### src/lib/mixpanel.ts

```typescript
import mixpanel from 'mixpanel-browser'

let initialized = false

export function initMixpanel() {
  if (initialized || typeof window === 'undefined') return
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
    debug:            process.env.NODE_ENV === 'development',
    track_pageview:   true,
    persistence:      'localStorage',
  })
  initialized = true
}

export { mixpanel }
```

### src/lib/analytics.ts — Sare Ecommerce Events

```typescript
import { initMixpanel, mixpanel } from './mixpanel'

// ─── User Events ─────────────────────────────────

export function identifyUser(userId: string, props: {
  email?: string
  name?: string
  role?: string
  createdAt?: string
}) {
  initMixpanel()
  mixpanel.identify(userId)
  mixpanel.people.set({
    $email:      props.email,
    $name:       props.name,
    role:        props.role,
    $created:    props.createdAt,
    last_seen:   new Date().toISOString(),
  })
}

export function trackSignup(method: 'email') {
  initMixpanel()
  mixpanel.track('User Signed Up', { method })
}

export function trackLogin(method: 'email') {
  initMixpanel()
  mixpanel.track('User Logged In', { method })
}

export function trackLogout() {
  initMixpanel()
  mixpanel.track('User Logged Out')
  mixpanel.reset() // Session clear karo
}

// ─── Product Events ───────────────────────────────

export function trackProductViewed(product: {
  id: string; name: string; category: string; price: number
}) {
  initMixpanel()
  mixpanel.track('Product Viewed', {
    product_id:       product.id,
    product_name:     product.name,
    product_category: product.category,
    price:            product.price / 100,
    currency:         'USD',
  })
}

export function trackAddToCart(product: {
  id: string; name: string; price: number; size: string; qty: number
}) {
  initMixpanel()
  mixpanel.track('Add to Cart', {
    product_id:   product.id,
    product_name: product.name,
    price:        product.price / 100,
    size:         product.size,
    quantity:     product.qty,
  })
}

export function trackRemoveFromCart(productId: string) {
  initMixpanel()
  mixpanel.track('Remove from Cart', { product_id: productId })
}

export function trackWishlistAdd(productId: string, productName: string) {
  initMixpanel()
  mixpanel.track('Add to Wishlist', { product_id: productId, product_name: productName })
}

// ─── Checkout Events ──────────────────────────────

export function trackCheckoutStarted(cartValue: number, itemCount: number) {
  initMixpanel()
  mixpanel.track('Checkout Started', {
    cart_value:  cartValue / 100,
    item_count:  itemCount,
    currency:    'USD',
  })
}

export function trackPaymentMethodSelected(method: string) {
  initMixpanel()
  mixpanel.track('Payment Method Selected', { method })
}

export function trackOrderCompleted(order: {
  orderNumber: string
  total:       number
  itemCount:   number
  payMethod:   string
}) {
  initMixpanel()
  mixpanel.track('Order Completed', {
    order_number: order.orderNumber,
    total:        order.total / 100,
    item_count:   order.itemCount,
    pay_method:   order.payMethod,
    currency:     'USD',
  })
  // Revenue tracking
  mixpanel.people.track_charge(order.total / 100)
}

export function trackOrderCancelled(orderNumber: string, reason?: string) {
  initMixpanel()
  mixpanel.track('Order Cancelled', { order_number: orderNumber, reason })
}

// ─── Search & Filter Events ───────────────────────

export function trackSearch(query: string, resultCount: number) {
  initMixpanel()
  mixpanel.track('Search Performed', { query, result_count: resultCount })
}

export function trackCategoryFilter(category: string) {
  initMixpanel()
  mixpanel.track('Category Filtered', { category })
}

// ─── Content Events ───────────────────────────────

export function trackBlogPostViewed(slug: string, title: string) {
  initMixpanel()
  mixpanel.track('Blog Post Viewed', { slug, title })
}

export function trackFAQExpanded(question: string) {
  initMixpanel()
  mixpanel.track('FAQ Expanded', { question })
}

export function trackNewsletterSignup() {
  initMixpanel()
  mixpanel.track('Newsletter Signup')
}

export function trackContactFormSubmit() {
  initMixpanel()
  mixpanel.track('Contact Form Submitted')
}
```

### Mixpanel Provider — Layout mein add karo

```typescript
// src/components/MixpanelProvider.tsx
'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { identifyUser, initMixpanel } from '@/lib/analytics'

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    initMixpanel()
  }, [])

  // Logged-in user ko identify karo
  useEffect(() => {
    if (session?.user) {
      identifyUser(session.user.id, {
        email: session.user.email ?? undefined,
        name:  session.user.name ?? undefined,
        role:  session.user.role,
      })
    }
  }, [session])

  return <>{children}</>
}
```

```typescript
// src/app/layout.tsx mein add karo:
import MixpanelProvider from '@/components/MixpanelProvider'

// <body> ke andar:
<SessionProvider>
  <MixpanelProvider>
    {/* rest of app */}
  </MixpanelProvider>
</SessionProvider>
```

### Product page mein use karo

```typescript
// src/app/shop/[id]/page.tsx
'use client'
import { useEffect } from 'react'
import { trackProductViewed } from '@/lib/analytics'

export default function ProductPage({ product }) {
  useEffect(() => {
    trackProductViewed({
      id:       product.id,
      name:     product.name,
      category: product.category,
      price:    product.priceCents,
    })
  }, [product.id])
  // ...
}
```

---

## ════════════════════════════════════════
## PART 5 — FAQ PAGE
## ════════════════════════════════════════

### File Structure
```
src/app/faq/
├── page.tsx              ← FAQ page (SSG)
src/app/api/faqs/
└── route.ts              ← CRUD (admin ke liye)
src/components/
└── FaqAccordion.tsx      ← Accordion component
```

### src/app/faq/page.tsx

```typescript
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'FAQ | Northline',
  description: 'Frequently asked questions about shipping, returns and our jackets.',
}

// Categories
const FAQ_CATEGORIES = ['General', 'Shipping', 'Returns', 'Products', 'Payment']

export default async function FaqPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  })

  // Categories ke mutabik group karo
  const grouped = FAQ_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = faqs.filter((f) => f.category === cat)
    return acc
  }, {} as Record<string, typeof faqs>)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type':          'Question',
      name:             f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    f.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero">
        <p className="eyebrow">HELP CENTER</p>
        <h1>Frequently Asked Questions</h1>
        <p>Sab common sawaalon ke jawab yahan hain.</p>
      </section>

      <main className="wrap prose" style={{ paddingTop: 50, paddingBottom: 80 }}>
        {FAQ_CATEGORIES.map((cat) =>
          grouped[cat]?.length ? (
            <div key={cat}>
              <h2>{cat}</h2>
              <FaqAccordion faqs={grouped[cat]} />
            </div>
          ) : null
        )}
      </main>
    </>
  )
}
```

### src/components/FaqAccordion.tsx

```typescript
'use client'
import { useState } from 'react'
import { trackFAQExpanded } from '@/lib/analytics'

interface FAQ { id: string; question: string; answer: string }

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<string | null>(null)

  function toggle(id: string, question: string) {
    if (open !== id) trackFAQExpanded(question)
    setOpen(open === id ? null : id)
  }

  return (
    <div style={{ borderTop: '1px solid var(--line)' }}>
      {faqs.map((faq) => (
        <div key={faq.id} style={{ borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => toggle(faq.id, faq.question)}
            style={{
              width: '100%', textAlign: 'left', padding: '16px 0',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between',
              fontSize: 14, fontWeight: 'bold',
            }}
          >
            {faq.question}
            <span>{open === faq.id ? '−' : '+'}</span>
          </button>
          {open === faq.id && (
            <p style={{ fontSize: 13, color: 'var(--muted)', paddingBottom: 16, margin: 0 }}>
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
```

### FAQ Admin API

```typescript
// src/app/api/faqs/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(faqs)
}

export async function POST(request: Request) {
  const session = await auth()
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await request.json()
  const faq = await prisma.fAQ.create({ data })
  return NextResponse.json(faq, { status: 201 })
}
```

---

## ════════════════════════════════════════
## PART 6 — BLOG
## ════════════════════════════════════════

### File Structure
```
src/app/blog/
├── page.tsx              ← Blog listing
└── [slug]/page.tsx       ← Single post
src/app/api/blog/
├── route.ts              ← Create post (admin)
└── [slug]/route.ts       ← Get/update/delete
```

### src/app/blog/page.tsx

```typescript
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Northline',
  description: 'Style guides, jacket care tips and brand stories.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">THE NORTHLINE JOURNAL</p>
        <h1>Stories & Style</h1>
        <p>Tips, guides and jacket stories.</p>
      </section>

      <main className="wrap section">
        <div className="products">
          {posts.map((post) => (
            <article key={post.id} className="card">
              {post.coverImage && (
                <Link className="card-image" href={`/blog/${post.slug}`}>
                  <Image src={post.coverImage} alt={post.title}
                    fill style={{ objectFit: 'cover' }} />
                </Link>
              )}
              <div className="product-category">
                {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </div>
              <h3>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  )
}
```

### src/app/blog/[slug]/page.tsx

```typescript
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  return {
    title:       post?.metaTitle || `${post?.title} | Northline`,
    description: post?.metaDesc  || post?.excerpt,
    openGraph:   { images: post?.coverImage ? [{ url: post.coverImage }] : [] },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, isPublished: true },
  })
  if (!post) notFound()

  // Increment views
  await prisma.blogPost.update({
    where: { id: post.id },
    data:  { views: { increment: 1 } },
  })

  // JSON-LD Article schema
  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'Article',
    headline:          post.title,
    description:       post.excerpt,
    image:             post.coverImage,
    datePublished:     post.publishedAt,
    dateModified:      post.updatedAt,
    author: {
      '@type': 'Organization',
      name:    'Northline',
    },
    publisher: {
      '@type': 'Organization',
      name:    'Northline',
      logo: {
        '@type': 'ImageObject',
        url:     'https://yourdomain.com/logo.svg',
      },
    },
  }

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="page-hero">
        <p className="eyebrow">
          {new Date(post.publishedAt!).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
        <h1 style={{ maxWidth: 700, margin: '8px auto' }}>{post.title}</h1>
      </section>

      <main className="wrap prose">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
    </>
  )
}
```

---

## ════════════════════════════════════════
## PART 7 — ADMIN DASHBOARD (Complete)
## ════════════════════════════════════════

### File Structure
```
src/app/(admin)/
├── layout.tsx                    ← Auth guard + sidebar
├── dashboard/page.tsx            ← Stats overview
├── products/
│   ├── page.tsx                  ← Product list + search
│   ├── new/page.tsx              ← Add product (Cloudinary upload)
│   └── [id]/edit/page.tsx        ← Edit product
├── orders/
│   ├── page.tsx                  ← All orders + filter by status
│   └── [id]/page.tsx             ← Order detail + status update
├── users/
│   ├── page.tsx                  ← All users list
│   └── [id]/page.tsx             ← User detail + activity
├── blog/
│   ├── page.tsx                  ← Blog posts list
│   ├── new/page.tsx              ← Write new post
│   └── [id]/edit/page.tsx        ← Edit post
├── faqs/
│   └── page.tsx                  ← FAQ manager
├── coupons/
│   └── page.tsx                  ← Coupon codes
├── reviews/
│   └── page.tsx                  ← Approve/reject reviews
└── messages/
    └── page.tsx                  ← Contact messages
```

### Admin Layout

```typescript
// src/app/(admin)/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin/dashboard',  label: '📊 Dashboard'  },
  { href: '/admin/products',   label: '🧥 Products'   },
  { href: '/admin/orders',     label: '📦 Orders'     },
  { href: '/admin/users',      label: '👤 Users'      },
  { href: '/admin/blog',       label: '✍️  Blog'       },
  { href: '/admin/faqs',       label: '❓ FAQs'        },
  { href: '/admin/coupons',    label: '🏷️  Coupons'    },
  { href: '/admin/reviews',    label: '⭐ Reviews'    },
  { href: '/admin/messages',   label: '✉️  Messages'   },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#151817', color: 'white',
        padding: '24px 0', position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #2a2e2b' }}>
          <p style={{ color: '#c6a66c', fontSize: 12, fontWeight: 'bold', letterSpacing: '.1em' }}>
            NORTHLINE ADMIN
          </p>
          <p style={{ color: '#aaa', fontSize: 11, margin: 0 }}>{session.user.name}</p>
        </div>
        <nav style={{ marginTop: 12 }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} style={{
              display: 'block', padding: '10px 20px',
              color: '#c2c5c0', fontSize: 13,
              textDecoration: 'none',
            }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '20px', marginTop: 'auto', borderTop: '1px solid #2a2e2b' }}>
          <Link href="/" style={{ color: '#aaa', fontSize: 12 }}>← View site</Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px', background: '#f7f6f2', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
```

### Dashboard Stats

```typescript
// src/app/(admin)/dashboard/page.tsx
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const [
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
    lowStock,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      where:   { paymentStatus: 'PAID' },
      _sum:    { totalCents: true },
    }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where:   { stock: { lt: 5 }, isActive: true },
      select:  { name: true, stock: true },
    }),
  ])

  const stats = [
    { label: 'Total Orders',   value: totalOrders },
    { label: 'Pending Orders', value: pendingOrders },
    { label: 'Revenue',        value: `$${((totalRevenue._sum.totalCents || 0) / 100).toFixed(2)}` },
    { label: 'Customers',      value: totalUsers },
    { label: 'Active Products',value: totalProducts },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia', fontWeight: 'normal' }}>Dashboard</h1>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16, marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: 'white', padding: '20px', borderBottom: '3px solid #c6a66c',
          }}>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 6px', letterSpacing: '.08em' }}>
              {s.label.toUpperCase()}
            </p>
            <p style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Low stock warning */}
      {lowStock.length > 0 && (
        <div style={{ background: '#fff3cd', padding: '16px 20px', marginBottom: 24 }}>
          <strong>⚠️ Low Stock:</strong>
          {lowStock.map((p) => (
            <span key={p.name} style={{ marginLeft: 12, fontSize: 13 }}>
              {p.name} ({p.stock} left)
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Orders Admin API

```typescript
// src/app/api/admin/orders/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { sendShippingUpdate } from '@/lib/email'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status, trackingNumber } = await req.json()

  const order = await prisma.order.update({
    where: { id: params.id },
    data:  { status, ...(trackingNumber && { trackingNumber }) },
    include: { user: true },
  })

  // Status shipped hone pe email bhejo
  if (status === 'SHIPPED' && trackingNumber) {
    const email = order.user?.email || order.guestEmail
    if (email) {
      await sendShippingUpdate({
        toEmail:        email,
        toName:         order.user?.name || 'Customer',
        orderNumber:    order.orderNumber,
        trackingNumber,
      })
    }
  }

  return NextResponse.json(order)
}
```

---

## ════════════════════════════════════════
## PART 8 — USER ACCOUNT PAGES
## ════════════════════════════════════════

### File Structure
```
src/app/(account)/
├── layout.tsx          ← Auth guard
├── account/page.tsx    ← Profile settings
├── orders/
│   ├── page.tsx        ← Order history
│   └── [id]/page.tsx   ← Order detail
└── wishlist/page.tsx   ← Saved items
```

```typescript
// src/app/(account)/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login?redirect=/account')
  return <>{children}</>
}
```

---

## ════════════════════════════════════════
## PART 9 — .ENV COMPLETE LIST
## ════════════════════════════════════════

```env
# .env.local

# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"

# Email (Nodemailer + Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="xxxx-xxxx-xxxx-xxxx"
EMAIL_FROM="Northline <your-gmail@gmail.com>"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789"
CLOUDINARY_API_SECRET="your-secret"

# Mixpanel
NEXT_PUBLIC_MIXPANEL_TOKEN="your-project-token"

# Stripe (baad mein)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ════════════════════════════════════════
## PART 10 — PACKAGES INSTALL ORDER
## ════════════════════════════════════════

```bash
# Week 1 — Database + Auth
npm install prisma @prisma/client
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs

# Week 2 — Cloudinary
npm install cloudinary next-cloudinary

# Week 3 — Mixpanel
npm install mixpanel-browser
npm install -D @types/mixpanel-browser

# Week 4 — Forms + Validation
npm install zod react-hook-form @hookform/resolvers

# Week 5 — Stripe
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# Week 6 — Extras
npm install date-fns sharp
```

---

## ════════════════════════════════════════
## PART 11 — IMPLEMENTATION ORDER (12 Weeks)
## ════════════════════════════════════════

```
Week 1:  Prisma setup + Neon DB + products DB mein move
Week 2:  NextAuth — Signup/Login/Logout + Admin/User roles
Week 3:  Cloudinary — Product image/video upload (Admin)
Week 4:  Admin Dashboard — Products + Orders management
Week 5:  Checkout page + COD order placement
Week 6:  Stripe payment integration
Week 7:  Email notifications (order confirm + shipping)
Week 8:  FAQ page (DB se + JSON-LD)
Week 9:  Blog (write + publish + SEO)
Week 10: Mixpanel tracking (events wiring)
Week 11: User account pages (orders, wishlist, profile)
Week 12: Reviews + Coupons + Final polish
```

---

*Sources:*
- [Auth.js v5 Complete Guide](https://dev.to/huangyongshan46a11y/authjs-v5-with-nextjs-16-the-complete-authentication-guide-2026-2lg)
- [NextAuth Credentials + Roles](https://javascript.plainenglish.io/authentication-and-next-js-with-next-auth-credentials-roles-082c7783c869)
- [Cloudinary Next.js Sample Projects](https://cloudinary.com/documentation/nextjs_sample_projects)
- [Cloudinary Upload Docs](https://cloudinary.com/documentation/javascript1_image_and_video_upload)
- [Mixpanel Next.js Integration](https://www.rudderstack.com/integration/mixpanel/integrate-your-next-js-site-with-mixpanel/)
- [Google Structured Data Guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Structured Data for Ecommerce](https://www.ecorn.agency/blog/structured-data-for-ecommerce)
- [Prisma + Next.js Guide](https://www.prisma.io/blog/vibe-coding-with-prisma-mcp-and-nextjs)
