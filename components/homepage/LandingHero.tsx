import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";

export function LandingHero(): JSX.Element {
  return (
    <section className="border-x border-border bg-surface">
      <div className="landing-pastel flex min-h-[368px] flex-col items-center justify-center border-b border-border px-6 py-16 text-center md:py-20">
        <h1 className="max-w-[720px] text-[42px] font-bold leading-[1.05] text-text-slate sm:text-[54px]">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>
        <p className="mt-6 max-w-[560px] text-sm font-medium leading-6 text-text-secondary">
          Stop applying blind. JobPilot finds the jobs, researches the companies, and
          gives you everything you need to stand out.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
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
      </div>

      <div className="flex justify-center bg-surface-tertiary px-6 py-12 sm:px-14 md:py-14">
        <Image
          src="/images/dashboard-demo.png"
          alt="JobPilot dashboard preview"
          width={4788}
          height={2416}
          priority
          className="landing-preview-shadow w-full max-w-[1002px]"
        />
      </div>
    </section>
  );
}
