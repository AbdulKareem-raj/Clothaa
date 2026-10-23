export const FREE_SHIPPING_THRESHOLD_CENTS = 15000 // $150
export const FLAT_SHIPPING_CENTS = 999 // $9.99

export function calcShippingCents(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS
}

export function generateOrderNumber(): string {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `NL-${y}${m}${d}-${rand}`
}
