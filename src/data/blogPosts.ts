export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  readTime: number
  publishedAt: string
  tags: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-style-a-leather-jacket',
    title: 'How to Style a Leather Jacket — 5 Outfits for Every Occasion',
    excerpt: 'From weekend brunch to after-work drinks, a leather jacket works harder than any other piece in your wardrobe. Here\'s how to make the most of it.',
    category: 'Style Guide',
    readTime: 5,
    publishedAt: '2026-10-15',
    tags: ['leather jacket', 'style guide', 'outfits'],
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85',
    content: `
      <p>A great leather jacket is one of the few wardrobe investments that genuinely pays off. The right one works with jeans, dresses, tailored trousers and just about everything in between.</p>

      <h2>1. The Classic Combination: Leather + White Tee + Jeans</h2>
      <p>This is the combination that never fails. A fitted white tee, straight-leg jeans and a black leather jacket. Clean, effortless and polished enough for most casual settings. Finish with white trainers or clean leather boots.</p>

      <h2>2. Smart-Casual: Over a Blazer Layer</h2>
      <p>For a more elevated look, wear your leather jacket over a relaxed blazer. The key is proportion — if the jacket is fitted, the blazer should be slightly oversized. This layering approach works especially well in transitional weather.</p>

      <h2>3. Weekend Casual: With an Oversized Hoodie</h2>
      <p>The leather jacket is the perfect foil for a thick hoodie. The structured silhouette of the jacket balances the relaxed shape of the hoodie beneath. Keep the palette simple — navy, grey or black for the hoodie.</p>

      <h2>4. Feminine Balance: Over a Midi Dress</h2>
      <p>Pairing a structured leather jacket with a flowing midi dress creates an interesting contrast. The tougher texture of the jacket plays off the softness of the dress. This works particularly well with floral or linen fabrics.</p>

      <h2>5. Monochrome: All-Black Everything</h2>
      <p>When in doubt, go monochrome. An all-black outfit with a leather jacket as the top layer is understated and endlessly versatile. Add interest through texture — leather, cotton, wool — rather than colour.</p>

      <h2>Care tip</h2>
      <p>Leather ages beautifully when treated well. After each season, apply a leather conditioner to keep the material supple. Store on a wide, padded hanger — never folded.</p>
    `,
  },
  {
    slug: 'varsity-jacket-guide',
    title: 'The Varsity Jacket: A Complete Style Guide',
    excerpt: 'Originally worn on American college campuses, the varsity jacket has become a global wardrobe staple. Here\'s everything you need to know.',
    category: 'Style Guide',
    readTime: 4,
    publishedAt: '2026-10-08',
    tags: ['varsity jacket', 'style guide', 'streetwear'],
    coverImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
    content: `
      <p>The varsity jacket — also known as the letterman jacket — has a history stretching back to 1860s Harvard. It started as a baseball uniform, became a symbol of athletic achievement and eventually landed in mainstream fashion.</p>

      <h2>What makes a good varsity jacket?</h2>
      <p>The classic construction is a wool body with leather sleeves. The ribbed cuffs, collar and hem are typically made from a contrasting knit. Look for clean contrast stitching and solid snap buttons — they're reliable indicators of quality construction.</p>

      <h2>How to wear it</h2>
      <p>The varsity jacket works best when the rest of your outfit is kept simple. A plain tee, relaxed trousers and clean trainers let the jacket be the focal point. It also layers well over a crewneck sweatshirt on colder days.</p>

      <h2>Sizing</h2>
      <p>Varsity jackets are traditionally worn with some room. If you're between sizes, size up. The fit should be relaxed across the shoulders with enough space to layer underneath, but not so large that the sleeves hang past your wrists.</p>
    `,
  },
  {
    slug: 'jacket-care-guide',
    title: 'How to Care for Your Jacket — A Season-by-Season Guide',
    excerpt: 'The difference between a jacket that lasts two years and one that lasts twenty comes down to care. Here\'s what to do each season.',
    category: 'Care & Maintenance',
    readTime: 6,
    publishedAt: '2026-09-30',
    tags: ['jacket care', 'leather care', 'maintenance'],
    coverImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
    content: `
      <p>A well-made jacket is an investment. How you care for it determines how long it stays looking good.</p>

      <h2>Leather Jackets</h2>
      <p><strong>After each wear:</strong> Let it air out on a wide hanger. Never fold or compress a leather jacket during storage.</p>
      <p><strong>For light marks:</strong> Wipe with a barely damp cloth and let it dry at room temperature. Never use heat to dry leather.</p>
      <p><strong>Every 3–6 months:</strong> Apply a small amount of leather conditioner. This prevents the leather from drying out and cracking. Work in circular motions and buff off any excess.</p>
      <p><strong>End of season:</strong> Store in a breathable garment bag — not plastic. A cotton pillowcase works well. Keep in a cool, dry place away from direct sunlight.</p>

      <h2>Varsity & Bomber Jackets</h2>
      <p><strong>Machine washing:</strong> Cold water, gentle cycle. Turn inside out to protect the outer fabric and any embellishments.</p>
      <p><strong>Drying:</strong> Always hang dry. A dryer can shrink the body, stretch the ribbing, or damage any leather detailing.</p>
      <p><strong>Ironing:</strong> Most varsity jackets should not be ironed directly. If you need to remove creases, use a steamer at a safe distance.</p>

      <h2>General rules</h2>
      <ul>
        <li>Always check the care label first — it's there for a reason</li>
        <li>Deal with stains immediately — the longer they sit, the harder they are to remove</li>
        <li>Never store a damp jacket</li>
        <li>Hang, don't fold</li>
      </ul>
    `,
  },
  {
    slug: 'bomber-jacket-history',
    title: 'The Bomber Jacket: From Military Gear to Fashion Icon',
    excerpt: 'It started as practical military equipment in World War I. Today it\'s one of the most worn jacket styles in the world. Here\'s the full story.',
    category: 'Brand & Culture',
    readTime: 5,
    publishedAt: '2026-09-22',
    tags: ['bomber jacket', 'history', 'fashion history'],
    coverImage: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=900&q=85',
    content: `
      <p>The bomber jacket — officially known as the flight jacket — was developed in the early 20th century to keep military pilots warm in open cockpits at altitude.</p>

      <h2>Military origins</h2>
      <p>The first flight jackets were made from horsehide leather in the 1910s. As aircraft became more sophisticated and altitudes increased, the need for insulated flying gear grew. The U.S. Army Air Corps developed the A-2 jacket in 1931 — a design so functional that it's still replicated today.</p>

      <h2>Post-war into pop culture</h2>
      <p>After World War II, bomber jackets became symbols of counterculture. Worn by greasers in the 1950s, punk musicians in the 1970s, and hip-hop artists in the 1990s, the jacket absorbed cultural meaning with each decade.</p>

      <h2>The modern bomber</h2>
      <p>Today's bomber jackets range from military-faithful reproductions to fashion-forward interpretations in satin, nylon and technical fabrics. The silhouette — ribbed cuffs and hem, zippered front, relaxed body — has remained largely unchanged for over a century.</p>

      <h2>How to wear it now</h2>
      <p>The bomber works because it has no pretensions. It's casual without being sloppy. Wear it with trousers and loafers for a smart-casual look, or with joggers and trainers on weekends. The key is keeping the fit right — slim enough to look intentional, relaxed enough to move freely.</p>
    `,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}
