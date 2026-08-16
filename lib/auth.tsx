'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { insforge } from '@/lib/insforge-client'
import posthog from 'posthog-js'

type User = {
  id: string
  email: string
  name?: string
} | null

interface AuthContextType {
  user: User
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function hydrateAuth() {
      const { data, error } = await insforge.auth.getCurrentUser()
      if (cancelled) return
      const sdkUser = error ? null : (data?.user ?? null)
      setUser(sdkUser)
      setLoading(false)
      if (sdkUser) {
        posthog.identify(sdkUser.id, {
          email: sdkUser.email,
          name: sdkUser.profile?.name,
        })
      }
    }

    void hydrateAuth()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
