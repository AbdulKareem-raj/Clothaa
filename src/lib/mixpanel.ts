import mixpanel from 'mixpanel-browser'

let initialized = false

export function initMixpanel() {
  if (initialized || typeof window === 'undefined') return
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token) return // No token yet — tracking is a safe no-op.

  mixpanel.init(token, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  })
  initialized = true
}

export function isMixpanelReady() {
  return initialized
}

export { mixpanel }
