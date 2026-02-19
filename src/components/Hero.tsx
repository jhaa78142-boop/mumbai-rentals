import React, { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import heroImg from "../assets/hero-mumbai.png";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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

  return (
    <header className="relative w-full overflow-hidden bg-black">
      {/* Top mini-nav */}
      <div
        className={`pointer-events-none absolute left-0 right-0 top-0 z-20 h-16 bg-gradient-to-b from-black/55 to-transparent transition-opacity ${
          scrolled ? "opacity-100" : "opacity-70"
        }`}
        aria-hidden="true"
      />

      {/* Background (parallax layer) */}
      <div className="absolute inset-0">
        <div
          ref={bgRef}
          className="absolute -inset-10 bg-cover bg-center opacity-95"
          style={{ backgroundImage: `url(${heroImg})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_50%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-10 pt-16">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center text-white">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs text-white/90 ring-1 ring-white/20 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified rentals in Borivali • Kandivali • Malad
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Premium Rental Homes
              <span className="block text-white/90">in Mumbai</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
              Tell us your area, budget and move-in timeline. We’ll match you with the best
              options — fast, transparent, and hassle-free.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#lead" className="btn-primary">
                Find My Home
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/15"
              >
                How it works
              </a>
            </div>
          </div>
        </Reveal>

        {/* Floating cards */}
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {["Borivali", "Kandivali", "Malad"].map((name, idx) => (
            <Reveal key={name} delayMs={180 + idx * 120}>
              <div className="rounded-3xl bg-white/10 p-4 text-white ring-1 ring-white/15 backdrop-blur">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="mt-0.5 text-xs text-white/80">Premium buildings</div>
                  </div>
                  <div className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-white/85 ring-1 ring-white/15">
                    24–72h match
                  </div>
                </div>
                <div className="mt-3 h-px w-full bg-white/10" />
                <div className="mt-3 text-xs text-white/80">
                  Shortlist • Schedule visit • Move-in assistance
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </header>
  );
}
