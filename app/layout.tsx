import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BoloBhai',
  description: 'Anonymous college-focused gossip/confession webapp',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-white to-brand-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  )
}


