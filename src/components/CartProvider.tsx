'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface CartItem {
  id: string
  size: string
  qty: number
}

interface CartContextValue {
  cart: CartItem[]
  count: number
  addItem: (id: string, size?: string) => void
  removeItem: (id: string, size: string) => void
  changeQty: (id: string, size: string, delta: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'northline-cart'

function readStorage(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    setCart(readStorage())
  }, [])

  const persist = useCallback((next: CartItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setCart(next)
  }, [])

  const addItem = useCallback((id: string, size = 'M') => {
    setCart((prev) => {
      const next = [...prev]
      const existing = next.find((i) => i.id === id && i.size === size)
      if (existing) existing.qty++
      else next.push({ id, size, qty: 1 })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeItem = useCallback((id: string, size: string) => {
    setCart((prev) => {
      const next = prev.filter((i) => !(i.id === id && i.size === size))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const changeQty = useCallback((id: string, size: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((i) => (i.id === id && i.size === size ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearCart = useCallback(() => persist([]), [persist])

  const count = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, count, addItem, removeItem, changeQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
