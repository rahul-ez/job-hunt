'use client'

import { initiateOAuth } from '@/app/actions/auth'
import { trackEvent } from '@/lib/posthog-client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function LoginContent() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    trackEvent('login_page_viewed')
  }, [])

  const handleOAuthClick = async (provider: 'google' | 'github') => {
    try {
      trackEvent('login_started', { provider })
      setError(null)
      setIsLoading(true)
      const result = await initiateOAuth(provider)

      if (result?.error) {
        trackEvent('login_failed', { provider, error: result.error })
        setError(result.error)
      }
      // If no error, redirect will happen automatically via redirect() in Server Action
    } catch (err) {
      console.error('OAuth error:', err)
      trackEvent('login_failed', {
        provider,
        error: 'oauth_init_failed',
      })
      setError('oauth_init_failed')
    } finally {
      setIsLoading(false)
    }
  }

  const displayError = error || urlError

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-12 text-center">
          <div className="text-2xl font-bold text-text-slate">JobPilot</div>
          <p className="text-sm font-medium text-text-secondary mt-2">
            AI-powered job search and profile management
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-lg px-8 py-10 shadow-sm">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold leading-tight text-text-slate mb-3">
              Sign in to your account
            </h1>
            <p className="text-sm font-medium text-text-secondary">
              Use Google or GitHub to continue
            </p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="mb-6 p-3 bg-error-light border border-error rounded-md">
              <p className="text-sm font-medium text-error-foreground">
                {displayError === 'oauth_failed'
                  ? 'OAuth authentication failed. Please try again.'
                  : displayError === 'missing_verifier'
                    ? 'Session expired. Please try again.'
                    : displayError === 'exchange_failed'
                      ? 'Failed to exchange OAuth code. Please try again.'
                    : displayError === 'oauth_init_failed'
                      ? 'Failed to initialize OAuth. Please try again.'
                      : 'An error occurred. Please try again.'}
              </p>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google Button */}
            <button
              onClick={() => handleOAuthClick('google')}
              disabled={isLoading}
              className="w-full h-10 px-4 rounded-md border border-border-light bg-surface hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium text-sm text-text-dark"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
            </button>

            {/* GitHub Button */}
            <button
              onClick={() => handleOAuthClick('github')}
              disabled={isLoading}
              className="w-full h-10 px-4 rounded-md border border-border-light bg-surface hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium text-sm text-text-dark"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>{isLoading ? 'Signing in...' : 'Continue with GitHub'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border-light"></div>
            <span className="text-xs font-medium text-text-muted uppercase">or</span>
            <div className="flex-1 border-t border-border-light"></div>
          </div>

          {/* Footer Text */}
          <p className="text-xs font-medium text-text-muted text-center">
            By signing in, you agree to our{' '}
            <a href="#" className="text-accent hover:text-accent-dark transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-accent hover:text-accent-dark transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Demo Link */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
            Back to home
          </a>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginContent />
    </Suspense>
  )
}
