'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAuthActions } from '@insforge/sdk/ssr'

export async function initiateOAuth(provider: 'google' | 'github'): Promise<{ error?: string }> {
  let redirectUrl: string

  try {
    const cookieStore = await cookies()
    const auth = createAuthActions({ cookies: cookieStore })
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo: new URL('/api/auth/callback', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString(),
      skipBrowserRedirect: true
    })

    if (error || !data?.url || !data?.codeVerifier) {
      const errorMessage = error?.message ?? 'Failed to initialize OAuth. Please try again.'
      console.error('OAuth init error:', errorMessage)
      return { error: 'oauth_init_failed' }
    }

    cookieStore.set('insforge_code_verifier', data.codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600
    })

    redirectUrl = data.url
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during authentication'
    console.error('OAuth initiation error:', message)
    return { error: 'oauth_init_failed' }
  }

  // redirect() must be called outside try/catch — it throws NEXT_REDIRECT internally
  // and catch would swallow it, preventing the browser from navigating to the OAuth provider
  redirect(redirectUrl)
}

export async function signOut() {
  try {
    const auth = createAuthActions({ cookies: await cookies() })
    await auth.signOut()
  } catch (err) {
    console.error('Sign out error:', err instanceof Error ? err.message : 'Unknown error')
  }
  redirect('/login')
}
