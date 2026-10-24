import type { NextAuthConfig } from 'next-auth'

// Edge-safe config — NO Prisma / Node-only imports here.
// Used by middleware and extended in auth.ts with the Credentials provider.
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role?: 'USER' | 'ADMIN' }).role ?? 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'ADMIN'
      }
      return session
    },
  },
} satisfies NextAuthConfig
