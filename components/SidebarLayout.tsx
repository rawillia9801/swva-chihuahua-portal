import Link from 'next/link'
import { ReactNode } from 'react'

const tabs = [
  { name: 'My Puppy', href: '/dashboard' },
  { name: 'Docs', href: '/docs' },
  { name: 'Payments', href: '/payments' },
  { name: 'Message', href: '/message' },
  { name: 'Transportation', href: '/transportation' },
  { name: 'Available Puppies', href: '/puppies' },
]

export default function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 space-y-4">
        <h2 className="text-xl font-bold">SWVA Chihuahua</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className="block hover:text-pink-600"
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  )
}
