import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastContainer } from '@/components/ui'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEMD - Security Email & Malicious URL Detection',
  description: 'ระบบตรวจจับ URL และอีเมลที่เป็นอันตราย',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
