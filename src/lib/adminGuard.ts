import { NextResponse } from 'next/server'
import { auth } from '@/auth'

// For API routes: returns the session, or a 401 response to return early.
export async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return { session: null, deny: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { session, deny: null as null }
}
