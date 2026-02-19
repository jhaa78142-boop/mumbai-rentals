import React from "react";
import { EyeIcon, KeyIcon, SearchIcon } from "./icons";
import Reveal from "./Reveal";

function Step({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] ring-1 ring-zinc-900/10">
        {icon}
      </div>
      <div className="mt-5 text-sm font-semibold text-zinc-900">
        {number}. {title}
      </div>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">{description}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how" className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(0,0,0,0.04),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How It Works</h2>
            <p className="mt-2 text-sm text-zinc-600">Three simple steps to your new home.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 sm:grid-cols-3">
          <Reveal delayMs={100}>
            <Step
              number="1"
              title="Search Your Area"
              description="Browse curated rental options in Malad, Kandivali, and Borivali."
              icon={<SearchIcon className="h-7 w-7" />}
            />
          </Reveal>
          <Reveal delayMs={220}>
            <Step
              number="2"
              title="Schedule a Visit"
              description="Book a site visit at your convenience with our verified partners."
              icon={<EyeIcon className="h-7 w-7" />}
            />
          </Reveal>
          <Reveal delayMs={340}>
            <Step
              number="3"
              title="Move In"
              description="Finalize paperwork and move in — we help coordinate the steps."
              icon={<KeyIcon className="h-7 w-7" />}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
