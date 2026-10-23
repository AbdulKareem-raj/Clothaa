'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { logActivity } from '@/lib/activity'

// Logs a page_view on every route change (guests + logged-in users).
export default function ActivityTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    logActivity('page_view', { path: pathname })
  }, [pathname])

  return null
}
