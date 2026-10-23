import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/data/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')?.toLowerCase()

  let products = PRODUCTS

  if (category && category !== 'All') {
    products = products.filter((p) => p.category === category)
  }

  if (q) {
    products = products.filter((p) =>
      (p.name + ' ' + p.category).toLowerCase().includes(q)
    )
  }

  return NextResponse.json(products)
}
