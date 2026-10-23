'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

interface ToastContextValue {
  showToast: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setMessage(null), 2500)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <div className="toast">{message}</div>}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
