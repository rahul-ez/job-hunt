import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/profile", label: "Profile" },
];

export function LandingNavbar(): JSX.Element {
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

        <nav aria-label="Primary navigation" className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-dark transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="inline-flex h-9 items-center justify-center rounded-sm bg-overlay px-4 text-xs font-medium text-accent-foreground transition-colors hover:bg-overlay-dark"
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}
