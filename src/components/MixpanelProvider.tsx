'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { initMixpanel } from '@/lib/mixpanel'
import { identifyUser } from '@/lib/analytics'

export default function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    initMixpanel()
  }, [])

  useEffect(() => {
    if (session?.user) {
      identifyUser(session.user.id, {
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
        role: session.user.role,
      })
    }
  }, [session])

  return <>{children}</>
}
