import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";

export function LandingFooter(): JSX.Element {
  return (
    <footer className="border-x border-border bg-surface">
      <div className="landing-divider h-16 border-b border-border" />
      <div className="flex flex-col gap-8 px-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" aria-label="JobPilot home" className="flex items-center">
          <Image
            src="/logo.png"
            alt="JobPilot"
            width={496}
            height={168}
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-8">
          <Link href="/dashboard" className="text-sm font-medium text-text-dark hover:text-accent">
            Dashboard
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-text-dark hover:text-accent">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm font-medium text-text-dark hover:text-accent">
            Terms &amp; Condition
          </Link>
        </nav>
      </div>
    </footer>
  );
}
