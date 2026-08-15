import type { JSX } from "react";
import Image from "next/image";

export function LandingTestimonial(): JSX.Element {
  return (
    <section className="border-x border-b border-border bg-surface px-6 py-20 text-center">
      <p className="text-xs font-semibold uppercase leading-4 text-accent">Success Stories</p>
      <blockquote className="mx-auto mt-6 max-w-[760px] text-[26px] font-semibold leading-[1.35] text-text-darker">
        &quot;I used to spend my evenings copy-pasting resumes. Now I open my dashboard
        to see interviews waiting. It feels like cheating. Had 3 offers on the table
        simultaneously.&quot;
      </blockquote>
      <div className="mt-7 flex items-center justify-center gap-3">
        <Image
          src="/images/user-icon.png"
          alt="Tom Wilson"
          width={192}
          height={192}
          className="h-10 w-10 rounded-md"
        />
        <div className="text-left">
          <p className="text-xs font-semibold leading-4 text-text-primary">Tom Wilson</p>
          <p className="text-xs font-normal leading-4 text-text-muted">Junior Developer</p>
        </div>
      </div>
    </section>
  );
}
