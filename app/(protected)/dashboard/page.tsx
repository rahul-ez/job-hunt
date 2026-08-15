'use client'

import { useAuth } from '@/lib/auth'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-text-slate mb-4">Please sign in to continue</p>
          <Link href="/login" className="text-accent hover:text-accent-dark font-medium">
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1128px] mx-auto px-6 py-12">
        <div className="bg-surface border border-border rounded-lg p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-text-slate mb-2">Dashboard</h1>
              <p className="text-sm font-medium text-text-secondary">Welcome, {user.email}</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="px-4 h-9 rounded-sm bg-overlay text-xs font-medium text-accent-foreground hover:bg-overlay-dark transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-surface-secondary border border-border-light rounded-md">
              <p className="text-sm font-medium text-text-dark">Feature 02 Auth</p>
              <p className="text-xs font-medium text-text-muted mt-1">
                ✓ Google OAuth working
              </p>
              <p className="text-xs font-medium text-text-muted">
                ✓ GitHub OAuth working
              </p>
              <p className="text-xs font-medium text-text-muted">
                ✓ Session management working
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
