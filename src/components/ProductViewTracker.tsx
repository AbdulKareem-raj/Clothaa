'use client'

import { useEffect } from 'react'
import { trackProductViewed } from '@/lib/analytics'
import { logActivity } from '@/lib/activity'

export default function ProductViewTracker({
  id,
  name,
  category,
  price,
}: {
  id: string
  name: string
  category: string
  price: number
}) {
  useEffect(() => {
    trackProductViewed({ id, name, category, price })
    logActivity('product_viewed', { productId: id, name, category, price })
  }, [id, name, category, price])
  return null
}
