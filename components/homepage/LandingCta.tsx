import type { JSX } from "react";
import Link from "next/link";

export function LandingCta(): JSX.Element {
  return (
    <section className="landing-pastel border-x border-b border-border px-6 py-20 text-center">
      <h2 className="mx-auto max-w-[700px] text-[38px] font-bold leading-[1.08] text-text-slate sm:text-[48px]">
        Your next job search can feel a lot less overwhelming
      </h2>
      <p className="mx-auto mt-6 max-w-[610px] text-sm font-medium leading-6 text-text-secondary">
        Set up your profile, upload your resume, and start finding matches in minutes.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex h-10 min-w-[140px] items-center justify-center rounded-md bg-overlay px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-overlay-dark"
        >
          Get Started &gt;
        </Link>
        <Link
          href="/find-jobs"
          className="inline-flex h-10 min-w-[176px] items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
        >
          Find Your First Match
        </Link>
      </div>
    </section>
  );
}
