'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { trackLogout } from '@/lib/analytics'

const ITEMS = [
  { href: '/account', label: 'Profile' },
  { href: '/account/orders', label: 'My orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
]

export default function AccountNav() {
  const pathname = usePathname()
  return (
    <nav className="account-nav">
      {ITEMS.map((item) => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
            {item.label}
          </Link>
        )
      })}
      <button
        onClick={() => { trackLogout(); signOut({ callbackUrl: '/' }) }}
        style={{ display: 'block', padding: '10px 14px', fontSize: 13, color: '#b3261e', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        Sign out
      </button>
    </nav>
  )
}
