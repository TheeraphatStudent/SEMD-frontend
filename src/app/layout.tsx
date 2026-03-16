import type { Metadata } from 'next'
import { Kanit, Krub, Mali,  } from 'next/font/google'
import './globals.css'
import { ToastContainer } from '@/components/ui'
import { AuthProvider } from '@/components/providers/AuthProvider'

const kanit = Kanit({ 
  subsets: ['thai'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-kanit',
})

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
    <html lang="th" className={`${kanit.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
