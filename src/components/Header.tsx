'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from './CartProvider'
import { CATEGORY_LIST, SUBCATEGORIES } from '@/data/products'

export default function Header() {
  const { count } = useCart()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)      // mobile menu
  const [shopOpen, setShopOpen] = useState(false) // Shop dropdown

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function close() { setOpen(false); setShopOpen(false) }

  return (
    <>
      <div className="announcement">NEW SEASON, NEW LAYERS · FREE SHIPPING OVER $150</div>
      <header>
        <Link className="logo" href="/" onClick={close}>
          <Image src="/logo.svg" alt="Northline logo" width={125} height={40} priority />
        </Link>

        <button
          id="menuToggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>

        <nav id="nav" className={open ? 'open' : ''}>
          <Link href="/" onClick={close}>Home</Link>

          {/* Shop dropdown — categories with their sub-categories */}
          <div className={`nav-dropdown${shopOpen ? ' open' : ''}`}>
            <button
              type="button"
              className="nav-dropbtn"
              aria-expanded={shopOpen}
              onClick={() => setShopOpen((v) => !v)}
            >
              Shop <span className="caret">▾</span>
            </button>

            <div className="mega-menu">
              {CATEGORY_LIST.map((cat) => (
                <div className="mega-col" key={cat}>
                  <Link
                    className="mega-col-title"
                    href={`/shop?category=${encodeURIComponent(cat)}`}
                    onClick={close}
                  >
                    {cat}
                  </Link>
                  {SUBCATEGORIES[cat].map((sub) => (
                    <Link
                      key={sub}
                      className="mega-sub"
                      href={`/shop?category=${encodeURIComponent(cat)}&sub=${encodeURIComponent(sub)}`}
                      onClick={close}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <Link href="/shop" onClick={close}>Shop all</Link>
          <Link href="/about" onClick={close}>Our story</Link>
          <Link href="/blog" onClick={close}>Journal</Link>
          <Link href="/faq" onClick={close}>FAQ</Link>
          <Link href="/contact" onClick={close}>Contact</Link>
          {session?.user?.role === 'ADMIN' && <Link href="/admin/dashboard" onClick={close}>Admin</Link>}
          <Link href={session ? '/account' : '/login'} onClick={close}>
            {session ? 'Account' : 'Sign in'}
          </Link>
        </nav>

        <Link className="bag" href="/cart" onClick={close}>
          Bag <b id="cartCount">{count}</b>
        </Link>
      </header>
    </>
  )
}
