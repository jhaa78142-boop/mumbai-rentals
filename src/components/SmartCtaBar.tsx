import React, { useEffect, useMemo, useState } from "react";
import { track } from "../lib/track";

const BUSINESS_WA = "917498369191";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function waLink(phone10?: string) {
  const p = (phone10 || "").replace(/\D/g, "");
  const to = p.length === 10 ? `91${p}` : BUSINESS_WA;
  const msg = encodeURIComponent("Hi! I’m looking for a rental in Malad/Kandivali/Borivali. Please share available options.");
  return `https://wa.me/${to}?text=${msg}`;
}

export default function SmartCtaBar({ phone10 }: { phone10?: string }) {
  const [atTop, setAtTop] = useState(true);
  const [nearLead, setNearLead] = useState(false);

  useEffect(() => {
    const onScroll = () => setAtTop((window.scrollY || 0) < 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lead = document.getElementById("lead");
    if (!lead) return;
    const obs = new IntersectionObserver(
      (entries) => setNearLead(entries.some((e) => e.isIntersecting)),
      { threshold: 0.2 }
    );
    obs.observe(lead);
    return () => obs.disconnect();
  }, []);

  const primary = useMemo(() => {
    if (nearLead) return { label: "Submit preferences", action: () => scrollToId("lead") };
    if (atTop) return { label: "Get WhatsApp shortlist", action: () => scrollToId("lead") };
    return { label: "Check availability", action: () => scrollToId("areas") };
  }, [atTop, nearLead]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="pointer-events-auto mx-auto max-w-[980px] px-4 pb-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0f14]/90 p-3 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.9)] backdrop-blur">
          <button
            onClick={() => {
              track("smart_cta_primary_click", { label: primary.label });
              primary.action();
            }}
            className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black active:scale-[0.99]"
          >
            {primary.label}
          </button>

          <a
            href={waLink(phone10)}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("smart_cta_whatsapp_click", { hasPhone: Boolean(phone10) })}
            className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(37,211,102,0.8)] active:scale-[0.99]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
