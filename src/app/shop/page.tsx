'use client'

import { useState, useMemo, useEffect } from 'react'
import { PRODUCTS, CATEGORY_LIST, SUBCATEGORIES } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const CATEGORIES = ['All', ...CATEGORY_LIST]

function ShopContent() {
  const searchParams = useSearchParams()

  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [subcategory, setSubcategory] = useState(searchParams.get('sub') || 'All')

  useEffect(() => {
    setCategory(searchParams.get('category') || 'All')
    setSubcategory(searchParams.get('sub') || 'All')
  }, [searchParams])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')

  // Sub-category filter row shown only for categories that have them.
  const subcategories =
    category in SUBCATEGORIES
      ? ['All', ...SUBCATEGORIES[category as keyof typeof SUBCATEGORIES]]
      : undefined

  const products = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (subcategory === 'All' || p.subcategory === subcategory) &&
        (p.name + ' ' + p.category).toLowerCase().includes(search.toLowerCase())
    )
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [category, subcategory, search, sort])

  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">THE FULL COLLECTION</p>
        <h1>Shop jackets</h1>
        <p>Find your next favourite layer.</p>
      </section>

      <main className="wrap shop">
        <div className="controls">
          <div id="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter${category === cat ? ' active' : ''}`}
                onClick={() => {
                  setCategory(cat)
                  setSubcategory('All')
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          {subcategories && (
            <div id="subfilters">
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  className={`filter subfilter${subcategory === sub ? ' active' : ''}`}
                  onClick={() => setSubcategory(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
          <input
            type="search"
            placeholder="Search jackets..."
            aria-label="Search jackets"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price low to high</option>
            <option value="high">Price high to low</option>
          </select>
        </div>

        <div className="products">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="empty">No jackets found. Try another search.</p>
          )}
        </div>
      </main>
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading…</div>}>
      <ShopContent />
    </Suspense>
  )
}
