'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: '▣', label: 'Dashboard' },
  { href: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { href: '/admin/products', icon: '🧥', label: 'Products' },
  { href: '/admin/categories', icon: '🗂', label: 'Categories' },
  { href: '/admin/orders', icon: '📦', label: 'Orders' },
  { href: '/admin/users', icon: '👤', label: 'Users' },
  { href: '/admin/reviews', icon: '★', label: 'Reviews' },
  { href: '/admin/blog', icon: '✍', label: 'Blog' },
  { href: '/admin/faqs', icon: '❓', label: 'FAQs' },
  { href: '/admin/coupons', icon: '🏷', label: 'Coupons' },
  { href: '/admin/messages', icon: '✉', label: 'Messages' },
]

export default function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="admin-nav">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + '/')
        return (
          <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
            <span aria-hidden>{item.icon}</span>
            <span className="lbl">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
