import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import heroImg from "../assets/hero-mumbai.png";
import { useLeadDraft, Area, Bhk } from "../state/leadDraft";
import { track } from "../lib/track";
import { getAbVariant } from "../lib/ab";

type HeroProps = {
  forcedHeadline?: string;
  forcedSubhead?: string;
  forcedAreaLabel?: string;
};

function scrollToLead() {
  const el = document.getElementById("lead");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function fmtINR(k: number) {
  return `₹${k}k`;
}

export default function Hero(props: HeroProps) {
  const abVariant = getAbVariant();
  const headlineNode = props.forcedHeadline ? (
    <>{props.forcedHeadline}</>
  ) : abVariant === "A" ? (
    <>
      Get a WhatsApp shortlist in{" "}
      <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        30 minutes
      </span>
    </>
  ) : (
    <>
      Verified rentals in{" "}
      <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
        Malad • Kandivali • Borivali
      </span>
    </>
  );

  const subheadText =
    props.forcedSubhead ??
    (abVariant === "A"
      ? "Share your budget + move-in date. We’ll WhatsApp a verified shortlist quickly."
      : "Tell us your requirements once — we shortlist and schedule visits end-to-end.");
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { draft, setDraft } = useLeadDraft();
  const areaLabel = props.forcedAreaLabel ?? draft.area;

  useEffect(() => {
    track("hero_view", { abVariant });

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setScrolled(y > 8);
        if (bgRef.current) {
          // Parallax: slow background movement
          bgRef.current.style.transform = `translate3d(0, ${Math.min(y * 0.18, 90)}px, 0)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const area = (draft.area ?? "Malad West") as Area;
  const bhk = (draft.bhk ?? "1") as Bhk;
  const budgetMinK = typeof draft.budgetMinK === "number" ? draft.budgetMinK : 40;
  const budgetMaxK = typeof draft.budgetMaxK === "number" ? draft.budgetMaxK : 60;

  return (
    <header className="relative w-full overflow-hidden bg-black">
      {/* Premium top glow */}
      <div
        className={`pointer-events-none absolute left-0 right-0 top-0 z-20 h-16 bg-gradient-to-b from-black/70 to-transparent transition-opacity ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Background */}
      <div className="absolute inset-0">
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          <img
            src={heroImg}
            alt="Mumbai skyline"
            className="h-[110%] w-full object-cover opacity-70"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(255,255,255,0.14),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-14 pt-20 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                Western Suburbs • Malad • Kandivali • Borivali
              </span>
            </Reveal>

            <Reveal delayMs={50}>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
                {headlineNode}
</h1>
            </Reveal>

            <Reveal delayMs={100}>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/75">
                {abVariant === "A"
                ? "Tell us your budget & preferences — we’ll share verified options on WhatsApp and schedule visits."
                : "Share your preferences and get a curated shortlist with visits arranged by local experts."}
              </p>
            </Reveal>

            <Reveal delayMs={150}>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    track("hero_primary_click");
                    scrollToLead();
                  }}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_60px_-28px_rgba(255,255,255,0.65)] active:scale-[0.99]"
                >
                  Get shortlist
                </button>
                <a
                  href="#faq"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/10"
                >
                  How it works
                </a>
              </div>
            </Reveal>

            <Reveal delayMs={200}>
              <div className="mt-7 grid max-w-xl grid-cols-3 gap-3 text-xs text-white/70">
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <div className="text-white/90 font-semibold">Same-day visits</div>
                  <div className="mt-1">If inventory matches</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <div className="text-white/90 font-semibold">Verified listings</div>
                  <div className="mt-1">No spam or bait</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                  <div className="text-white/90 font-semibold">Transparent</div>
                  <div className="mt-1">Clear terms upfront</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Hero Mini Form */}
          <div className="lg:justify-self-end">
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-[#0b0f14]/85 p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">Instant preference check</div>
                    <div className="mt-1 text-xs text-white/65">
                      Set area + budget + BHK. We’ll prefill your form below.
                    </div>
                  </div>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/70">
                    20 sec
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <div className="mb-2 text-xs font-semibold text-white/75">Preferred area</div>
                    <select
                      value={area}
                      onChange={(e) => setDraft({ area: e.target.value as Area })}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-white/20"
                    >
                      <option>Malad West</option>
                      <option>Malad East</option>
                      <option>Kandivali West</option>
                      <option>Kandivali East</option>
                      <option>Borivali West</option>
                      <option>Borivali East</option>
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <div className="text-xs font-semibold text-white/75">BHK</div>
                      <div className="mt-2 flex gap-2">
                        {(["1", "2"] as Bhk[]).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setDraft({ bhk: v })}
                            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                              bhk === v ? "bg-white text-black" : "bg-white/5 text-white/85 hover:bg-white/10"
                            }`}
                          >
                            {v} BHK
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <div className="text-xs font-semibold text-white/75">Budget range</div>
                      <div className="mt-2 text-sm font-semibold text-white">
                        {fmtINR(budgetMinK)} – {fmtINR(budgetMaxK)}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input
                          type="range"
                          min={20}
                          max={150}
                          step={5}
                          value={budgetMinK}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setDraft({ budgetMinK: v > budgetMaxK ? budgetMaxK : v });
                          }}
                          className="w-full"
                        />
                        <input
                          type="range"
                          min={20}
                          max={150}
                          step={5}
                          value={budgetMaxK}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setDraft({ budgetMaxK: v < budgetMinK ? budgetMinK : v });
                          }}
                          className="w-full"
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          { a: 30, b: 45, label: "30–45k" },
                          { a: 40, b: 60, label: "40–60k" },
                          { a: 60, b: 90, label: "60–90k" },
                          { a: 90, b: 120, label: "90–120k" },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => setDraft({ budgetMinK: p.a, budgetMaxK: p.b })}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      track("hero_miniform_continue", { area, bhk, budgetMinK, budgetMaxK });
                      scrollToLead();
                    }}
                    className="w-full rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_-28px_rgba(37,211,102,0.9)] active:scale-[0.99]"
                  >
                    Continue to form
                  </button>

                  <div className="text-center text-[11px] text-white/55">
                    You can change details later — this just pre-fills.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </header>
  );
}