import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Dashboard',
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="user-layout">
      {children}
    </div>
  )
}
