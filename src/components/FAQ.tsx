import React, { useMemo, useState } from "react";
import Reveal from "./Reveal";

type Item = { q: string; a: string };

export default function FAQ() {
  const items = useMemo<Item[]>(
    () => [
      { q: "What areas do you cover?", a: "We currently cover Malad (East/West), Kandivali (East/West), and Borivali (East/West)." },
      { q: "Is there a brokerage fee?", a: "This depends on the specific listing. We always show charges transparently before you confirm a visit." },
      { q: "How quickly can I arrange a visit?", a: "Usually within 24–48 hours, depending on availability. Immediate visits can be arranged for select homes." },
      { q: "Do you assist with the rental agreement?", a: "Yes. We help coordinate the agreement, verification, and move-in checklist so it’s smooth end-to-end." },
    ],
    []
  );

  return (
    <section className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_80%_0%,rgba(0,0,0,0.05),transparent_55%)]" />
      <div className="relative mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Quick answers before you request a callback.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {items.map((it, idx) => (
            <Reveal key={idx} delayMs={idx * 90}>
              <Accordion item={it} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Accordion({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-zinc-900">{item.q}</span>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
          <svg
            viewBox="0 0 24 24"
            className={"h-4 w-4 transition " + (open ? "rotate-180" : "")}
            fill="none"
          >
            <path d="M6.5 9.5 12 15l5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div
        className={
          "grid transition-[grid-template-rows] duration-300 ease-out " +
          (open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
        }
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600">{item.a}</div>
        </div>
      </div>
    </div>
  );
}
