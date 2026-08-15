import type { JSX } from "react";
import Image from "next/image";

const managementFeatures = [
  {
    title: "Find jobs that actually fit",
    description:
      "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
    active: true,
  },
  {
    title: "Know the Company Before You Apply",
    description:
      "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
    active: false,
  },
  {
    title: "Keep track of every application",
    description:
      "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
    active: false,
  },
];

const confidenceFeatures = [
  {
    title: "Understand your match score",
    description:
      "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
    active: false,
  },
  {
    title: "AI-Powered Job Matching",
    description:
      "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
    active: true,
  },
  {
    title: "Focus on the right roles",
    description:
      "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
    active: false,
  },
];

export function LandingFeatures(): JSX.Element {
  return (
    <>
      <section className="grid border-x border-b border-border bg-surface md:grid-cols-2">
        <div className="landing-section-grid flex flex-col justify-center">
          <div className="px-8 py-12 sm:px-14 md:px-16">
            <h2 className="max-w-[370px] text-[35px] font-bold leading-[1.08] text-text-slate">
              Manage Your Job Search With Ease
            </h2>
          </div>
          <FeatureList items={managementFeatures} />
        </div>

        <div className="flex items-center justify-center bg-surface-muted px-6 py-12 sm:px-12">
          <Image
            src="/images/jobs-lists.png"
            alt="Job matches table preview"
            width={2364}
            height={1778}
            className="w-full max-w-[520px]"
          />
        </div>
      </section>

      <div className="landing-divider h-16 border-x border-b border-border" />

      <section className="grid border-x border-b border-border bg-surface md:grid-cols-2">
        <div className="flex items-center justify-center bg-surface-muted px-6 py-12 sm:px-12">
          <Image
            src="/images/agnet-log.png"
            alt="JobPilot agent log preview"
            width={2144}
            height={1656}
            className="w-full max-w-[470px]"
          />
        </div>

        <div className="landing-section-grid flex flex-col justify-center">
          <div className="px-8 py-12 sm:px-14 md:px-16">
            <h2 className="max-w-[410px] text-[35px] font-bold leading-[1.08] text-text-slate">
              Apply With More Confidence, Every Time
            </h2>
          </div>
          <FeatureList items={confidenceFeatures} />
        </div>
      </section>
    </>
  );
}

type FeatureItem = {
  title: string;
  description: string;
  active: boolean;
};

type FeatureListProps = {
  items: FeatureItem[];
};

function FeatureList({ items }: FeatureListProps): JSX.Element {
  return (
    <div className="border-t border-border">
      {items.map((item) => (
        <div
          key={item.title}
          className="relative border-b border-border px-8 py-8 last:border-b-0 sm:px-14 md:px-16"
        >
          {item.active ? (
            <div className="absolute left-0 top-0 h-full w-px bg-accent" aria-hidden="true" />
          ) : null}
          <h3 className="text-base font-semibold leading-6 text-text-dark">
            {item.title}
          </h3>
          <p className="mt-2 max-w-[430px] text-sm font-medium leading-6 text-text-secondary">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
