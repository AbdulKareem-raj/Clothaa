'use client'

const SESSION_KEY = 'northline-sid'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let sid = localStorage.getItem(SESSION_KEY)
    if (!sid) {
      sid =
        (crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`
      localStorage.setItem(SESSION_KEY, sid)
    }
    return sid
  } catch {
    return 'anon'
  }
}

// Fire-and-forget activity log to our own backend (independent of Mixpanel).
export function logActivity(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const payload = JSON.stringify({ event, data, sessionId: getSessionId() })
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    /* no-op */
  }
}
