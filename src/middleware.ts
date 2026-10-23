import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/auth.config'

// Edge-safe NextAuth instance (no Prisma) just for route protection.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Admin area — ADMIN role required
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
    }
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  // User account area — login required
  if (pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}
