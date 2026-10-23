'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ActivityTracker from '@/components/ActivityTracker'

export default function StoreChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = pathname?.startsWith('/admin')

  if (hideChrome) return <>{children}</>

  return (
    <>
      <ActivityTracker />
      <Header />
      {children}
      <Footer />
    </>
  )
}
