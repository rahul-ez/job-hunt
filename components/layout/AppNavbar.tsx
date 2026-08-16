'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, User } from 'lucide-react'
import type { JSX } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/find-jobs', label: 'Find Jobs', icon: Search },
  { href: '/profile', label: 'Profile', icon: User },
]

export function AppNavbar(): JSX.Element {
  const pathname = usePathname()

  return (
    <header className="border-b border-border-light bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1128px] items-center justify-between px-6">
        <Link href="/" aria-label="JobPilot home" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={496}
            height={168}
            priority
            className="h-8 w-auto"
          />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-accent'
                    : 'text-text-dark hover:text-accent'
                }`}
              >
                <Icon size={15} strokeWidth={2} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
