import { initMixpanel, isMixpanelReady, mixpanel } from './mixpanel'

// Safe wrapper — if Mixpanel token isn't configured, tracking is a no-op.
function track(event: string, props?: Record<string, unknown>) {
  initMixpanel()
  if (!isMixpanelReady()) return
  try {
    mixpanel.track(event, props)
  } catch {
    /* swallow analytics errors */
  }
}

// ─── User ─────────────────────────────────────────

export function identifyUser(
  userId: string,
  props: { email?: string; name?: string; role?: string; createdAt?: string }
) {
  initMixpanel()
  if (!isMixpanelReady()) return
  try {
    mixpanel.identify(userId)
    mixpanel.people.set({
      $email: props.email,
      $name: props.name,
      role: props.role,
      $created: props.createdAt,
      last_seen: new Date().toISOString(),
    })
  } catch {
    /* no-op */
  }
}

export function trackSignup(method: 'email' = 'email') {
  track('User Signed Up', { method })
}

export function trackLogin(method: 'email' = 'email') {
  track('User Logged In', { method })
}

export function trackLogout() {
  initMixpanel()
  if (!isMixpanelReady()) return
  try {
    mixpanel.track('User Logged Out')
    mixpanel.reset()
  } catch {
    /* no-op */
  }
}

// ─── Product ──────────────────────────────────────

export function trackProductViewed(product: {
  id: string
  name: string
  category: string
  price: number
}) {
  track('Product Viewed', {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    price: product.price,
    currency: 'USD',
  })
}

export function trackAddToCart(product: {
  id: string
  name: string
  price: number
  size: string
  qty: number
}) {
  track('Add to Cart', {
    product_id: product.id,
    product_name: product.name,
    price: product.price,
    size: product.size,
    quantity: product.qty,
  })
}

export function trackRemoveFromCart(productId: string) {
  track('Remove from Cart', { product_id: productId })
}

export function trackWishlistAdd(productId: string, productName: string) {
  track('Add to Wishlist', { product_id: productId, product_name: productName })
}

// ─── Checkout ─────────────────────────────────────

export function trackCheckoutStarted(cartValue: number, itemCount: number) {
  track('Checkout Started', { cart_value: cartValue, item_count: itemCount, currency: 'USD' })
}

export function trackPaymentMethodSelected(method: string) {
  track('Payment Method Selected', { method })
}

export function trackOrderCompleted(order: {
  orderNumber: string
  total: number
  itemCount: number
  payMethod: string
}) {
  track('Order Completed', {
    order_number: order.orderNumber,
    total: order.total,
    item_count: order.itemCount,
    pay_method: order.payMethod,
    currency: 'USD',
  })
  if (isMixpanelReady()) {
    try {
      mixpanel.people.track_charge(order.total)
    } catch {
      /* no-op */
    }
  }
}

export function trackOrderCancelled(orderNumber: string, reason?: string) {
  track('Order Cancelled', { order_number: orderNumber, reason })
}

// ─── Search & filter ──────────────────────────────

export function trackSearch(query: string, resultCount: number) {
  track('Search Performed', { query, result_count: resultCount })
}

export function trackCategoryFilter(category: string) {
  track('Category Filtered', { category })
}

// ─── Content ──────────────────────────────────────

export function trackBlogPostViewed(slug: string, title: string) {
  track('Blog Post Viewed', { slug, title })
}

export function trackFAQExpanded(question: string) {
  track('FAQ Expanded', { question })
}

export function trackNewsletterSignup() {
  track('Newsletter Signup')
}

export function trackContactFormSubmit() {
  track('Contact Form Submitted')
}
