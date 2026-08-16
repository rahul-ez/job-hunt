'use client'

import type { JSX } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { trackEvent } from "@/lib/posthog-client";
import { LandingCta } from "@/components/homepage/LandingCta";
import { LandingFeatures } from "@/components/homepage/LandingFeatures";
import { LandingHero } from "@/components/homepage/LandingHero";
import { LandingTestimonial } from "@/components/homepage/LandingTestimonial";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function Home(): JSX.Element {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      trackEvent('homepage_redirect_to_dashboard', {
        userId: user.id,
      })
      router.push('/dashboard')
      return
    }

    if (!loading && !user) {
      trackEvent('homepage_viewed', {
        auth_state: 'logged_out',
      })
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar />
      <main className="mx-auto w-full max-w-[1128px]">
        <LandingHero />
        <LandingFeatures />
        <div className="landing-divider h-16 border-x border-b border-border" />
        <LandingTestimonial />
        <LandingCta />
      </main>
      <div className="mx-auto w-full max-w-[1128px]">
        <LandingFooter />
      </div>
    </div>
  );
}
