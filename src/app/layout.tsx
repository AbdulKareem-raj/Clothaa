import type { Metadata } from 'next'
import './globals.css'
import AuthSessionProvider from '@/components/AuthSessionProvider'
import MixpanelProvider from '@/components/MixpanelProvider'
import { CartProvider } from '@/components/CartProvider'
import { ToastProvider } from '@/components/Toast'
import StoreChrome from '@/components/StoreChrome'

export const metadata: Metadata = {
  title: 'Northline | Jackets for Every Chapter',
  description: 'Explore jackets for every day.',
  icons: { icon: '/logo.svg' },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>
          <MixpanelProvider>
            <CartProvider>
              <ToastProvider>
                <StoreChrome>{children}</StoreChrome>
              </ToastProvider>
            </CartProvider>
          </MixpanelProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
