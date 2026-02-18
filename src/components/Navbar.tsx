import React, { useEffect, useMemo, useState } from "react";

type NavItem = { id: string; label: string };

const NAV: NavItem[] = [
  { id: "top", label: "Home" },
  { id: "areas", label: "Areas" },
  { id: "how", label: "How it Works" },
  { id: "lead", label: "Find a Home" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState<string>("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const ids = NAV.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    // Scroll spy: observe section visibility.
    const obs = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        root: null,
        threshold: [0.15, 0.25, 0.35, 0.5],
        rootMargin: "-30% 0px -55% 0px",
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const onNav = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={[
          "mx-auto max-w-6xl px-4 sm:px-6",
          "transition-all duration-300",
          scrolled ? "pt-3" : "pt-5",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center justify-between",
            "rounded-2xl border border-white/10",
            "bg-slate-950/70 backdrop-blur-xl",
            "shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
            "px-4 sm:px-5 py-3",
            scrolled ? "ring-1 ring-white/5" : "",
          ].join(" ")}
        >
          <a href="#top" onClick={onNav("top")} className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
              MR
            </span>
            <span className="text-white font-semibold tracking-tight">MumbaiRentals</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = n.id === activeId;
              return (
                <a
                  key={n.id}
                  href={"#" + n.id}
                  onClick={onNav(n.id)}
                  className={[
                    "px-3 py-2 rounded-xl text-sm",
                    "transition-colors",
                    active ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5",
                  ].join(" ")}
                >
                  {n.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#lead"
              onClick={onNav("lead")}
              className="inline-flex items-center justify-center rounded-xl bg-white text-slate-950 px-4 py-2 text-sm font-semibold shadow hover:shadow-lg transition"
            >
              Get Shortlist
            </a>
          </div>
        </div>

        {/* Mobile quick nav */}
        <div className="md:hidden mt-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {NAV.map((n) => {
              const active = n.id === activeId;
              return (
                <a
                  key={n.id}
                  href={"#" + n.id}
                  onClick={onNav(n.id)}
                  className={[
                    "shrink-0 px-3 py-2 rounded-xl text-xs",
                    "border border-white/10",
                    "bg-slate-950/50 backdrop-blur",
                    active ? "text-white" : "text-white/70",
                  ].join(" ")}
                >
                  {n.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}