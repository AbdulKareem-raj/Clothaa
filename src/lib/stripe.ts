import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY

// Lazily constructed so the app builds/runs even before keys are added.
export const stripe = key
  ? new Stripe(key)
  : (null as unknown as Stripe)

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
