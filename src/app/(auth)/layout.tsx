import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEMD — Authentication',
  description: 'Secure authentication for SEMD platform',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-body">
      {children}
    </div>
  )
}
