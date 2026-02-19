import React from "react";
import Reveal from "./Reveal";
import { ShieldCheck, Clock, BadgeCheck, MessageCircle } from "./icons";

const ITEMS = [
  { icon: ShieldCheck, title: "Verified listings", desc: "Quality checks before we share" },
  { icon: Clock, title: "Same‑day visits", desc: "Fast scheduling in Western suburbs" },
  { icon: BadgeCheck, title: "Transparent process", desc: "No confusing back‑and‑forth" },
  { icon: MessageCircle, title: "WhatsApp shortlist", desc: "Get options directly on chat" },
];

export default function TrustStrip() {
  return (
    <div className="relative -mt-14 sm:-mt-16">
      <Reveal>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 rounded-3xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            {ITEMS.map((it) => (
              <div key={it.title} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 sm:p-4">
                <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-300/20">
                  <it.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{it.title}</div>
                  <div className="text-white/70 text-xs leading-relaxed">{it.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}