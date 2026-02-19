import React, { useEffect, useMemo, useState } from "react";
import Reveal from "./Reveal";
import { onlyDigits } from "../lib/utils";
import { track } from "../lib/track";

type Area =
  | "Malad West"
  | "Malad East"
  | "Kandivali West"
  | "Kandivali East"
  | "Borivali West"
  | "Borivali East";

type Bhk = "1" | "2";
type Furnishing = "F" | "S" | "U";
type MoveIn = "Immediate" | "7" | "15" | "30+";
type Profile = "Family" | "Bachelor" | "Company";

type LeadPayload = {
  name: string;
  phone: string; // 10 digits
  area: Area;
  budgetRange: string; // e.g. "40-60k"
  bhk: Bhk;
  furnishing: Furnishing;
  moveIn: MoveIn;
  profile: Profile;
  notes?: string;
  source: "landing";
  createdAtIso: string;
  // optional marketing attribution
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
};

type ApiOk = { leadId?: string; id?: string; message?: string };
type ApiErr = { message?: string };

function envApiUrl() {
  const url = import.meta.env.VITE_LEAD_API_URL as string | undefined;
  return (url ?? "").trim();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toBudgetRange(minK: number, maxK: number) {
  const a = Math.round(minK / 5) * 5;
  const b = Math.round(maxK / 5) * 5;
  return `${a}-${b}k`;
}

function fmtINR(k: number) {
  return `₹${k}k`;
}

export default function LeadForm({
  onPhoneChange,
}: {
  onPhoneChange?: (phone10: string) => void;
}) {
  // Stepper (2-step keeps it fast but feels premium)
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState<Area>("Malad West");

  // Budget slider (min/max in 'k')
  const [budgetMinK, setBudgetMinK] = useState(40);
  const [budgetMaxK, setBudgetMaxK] = useState(60);

  // Step 2
  const [bhk, setBhk] = useState<Bhk>("1");
  const [furnishing, setFurnishing] = useState<Furnishing>("S");
  const [moveIn, setMoveIn] = useState<MoveIn>("Immediate");
  const [profile, setProfile] = useState<Profile>("Family");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successLeadId, setSuccessLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const phone10 = useMemo(() => onlyDigits(phone).slice(0, 10), [phone]);

  useEffect(() => {
    onPhoneChange?.(phone10);
  }, [phone10, onPhoneChange]);

  const utm = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    const obj = {
      source: sp.get("utm_source") ?? undefined,
      medium: sp.get("utm_medium") ?? undefined,
      campaign: sp.get("utm_campaign") ?? undefined,
      term: sp.get("utm_term") ?? undefined,
      content: sp.get("utm_content") ?? undefined,
    };
    const any = Object.values(obj).some(Boolean);
    return any ? obj : undefined;
  }, []);

  const budgetRange = useMemo(() => toBudgetRange(budgetMinK, budgetMaxK), [budgetMinK, budgetMaxK]);

  const canGoNext = useMemo(() => {
    return name.trim().length >= 2 && phone10.length === 10;
  }, [name, phone10]);

  const validateAll = (): string | null => {
    if (name.trim().length < 2) return "Please enter your name.";
    if (phone10.length !== 10) return "WhatsApp number must be exactly 10 digits.";
    if (!area) return "Please select an area.";
    if (!bhk) return "Please select BHK.";
    if (!furnishing) return "Please select furnishing.";
    if (!moveIn) return "Please select move-in timeline.";
    if (!profile) return "Please select profile.";
    if (budgetMinK >= budgetMaxK) return "Budget range looks incorrect.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessLeadId(null);

    const apiUrl = envApiUrl();
    if (!apiUrl) {
      setErrorMsg("Missing API URL. Set VITE_LEAD_API_URL in .env and restart the dev server.");
      return;
    }

    const validation = validateAll();
    if (validation) {
      setErrorMsg(validation);
      track("lead_error_validation", { message: validation });
      return;
    }

    const payload: LeadPayload = {
      name: name.trim(),
      phone: phone10,
      area,
      budgetRange,
      bhk,
      furnishing,
      moveIn,
      profile,
      notes: notes.trim() ? notes.trim() : undefined,
      source: "landing",
      createdAtIso: new Date().toISOString(),
      utm,
    };

    try {
      setSubmitting(true);
      track("lead_submit_attempt", { area, budgetRange, bhk, profile });

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: ApiOk | ApiErr | null = null;

      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text } as ApiErr;
      }

      if (!res.ok) {
        const msg = (data as ApiErr)?.message || `Request failed (${res.status}).`;
        setErrorMsg(msg);
        track("lead_submit_failed", { status: res.status, message: msg });
        return;
      }

      const leadId = (data as ApiOk)?.leadId || (data as ApiOk)?.id || undefined;
      setSuccessLeadId(leadId ?? "Generated");
      track("lead_submit_success", { leadId: leadId ?? "Generated" });
    } catch (err: any) {
      const msg = err?.message || "Network error. Please try again.";
      setErrorMsg(msg);
      track("lead_submit_failed", { status: "network", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const onBudgetMin = (v: number) => {
    const next = clamp(v, 10, budgetMaxK - 5);
    setBudgetMinK(next);
  };
  const onBudgetMax = (v: number) => {
    const next = clamp(v, budgetMinK + 5, 200);
    setBudgetMaxK(next);
  };

  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">Find Your Next Home</h2>
              <p className="mt-2 text-slate-600 max-w-lg">
                Tell us your preferences — we’ll send a verified shortlist on WhatsApp and help schedule visits.
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-900">What you get</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li className="flex gap-2"><span className="text-emerald-600">✓</span> Shortlist within 30–90 minutes</li>
                  <li className="flex gap-2"><span className="text-emerald-600">✓</span> Verified photos & key details</li>
                  <li className="flex gap-2"><span className="text-emerald-600">✓</span> Visit coordination with minimum back‑and‑forth</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-slate-950">Request a shortlist</div>
                  <div className="text-sm text-slate-600">Step {step} of 2</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={["h-2 w-10 rounded-full", step === 1 ? "bg-emerald-500" : "bg-slate-200"].join(" ")} />
                  <div className={["h-2 w-10 rounded-full", step === 2 ? "bg-emerald-500" : "bg-slate-200"].join(" ")} />
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-5 space-y-4">
                {step === 1 ? (
                  <>
                    <Field label="Full Name *">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </Field>

                    <Field label="WhatsApp Number *">
                      <input
                        value={phone}
                        onChange={(e) => {
                          const digits = onlyDigits(e.target.value).slice(0, 10);
                          setPhone(digits);
                        }}
                        inputMode="numeric"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        placeholder="10-digit number"
                        autoComplete="tel"
                      />
                      <div className="mt-1 text-xs text-slate-500">We’ll send the shortlist here.</div>
                    </Field>

                    <Field label="Area Preference *">
                      <select
                        value={area}
                        onChange={(e) => setArea(e.target.value as Area)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                      >
                        <option>Malad West</option>
                        <option>Malad East</option>
                        <option>Kandivali West</option>
                        <option>Kandivali East</option>
                        <option>Borivali West</option>
                        <option>Borivali East</option>
                      </select>
                    </Field>

                    <Field label="Budget Range *">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-900">{fmtINR(budgetMinK)} – {fmtINR(budgetMaxK)}</div>
                          <div className="text-xs text-slate-600">{budgetRange}</div>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Min</span><span>{fmtINR(budgetMinK)}</span>
                            </div>
                            <input
                              type="range"
                              min={10}
                              max={195}
                              step={5}
                              value={budgetMinK}
                              onChange={(e) => onBudgetMin(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Max</span><span>{fmtINR(budgetMaxK)}</span>
                            </div>
                            <input
                              type="range"
                              min={15}
                              max={200}
                              step={5}
                              value={budgetMaxK}
                              onChange={(e) => onBudgetMax(Number(e.target.value))}
                              className="w-full"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {[
                              [40, 60],
                              [60, 90],
                              [25, 40],
                              [90, 120],
                            ].map(([a, b]) => (
                              <button
                                key={`${a}-${b}`}
                                type="button"
                                onClick={() => {
                                  setBudgetMinK(a);
                                  setBudgetMaxK(b);
                                  track("budget_preset", { preset: `${a}-${b}` });
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                              >
                                {fmtINR(a)}–{fmtINR(b)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Field>

                    <div className="pt-2 flex gap-3">
                      <a
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
                        href={whatsAppLink(phone10)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => track("whatsapp_click_form", { phone10: phone10 ? "entered" : "none" })}
                      >
                        WhatsApp us
                      </a>

                      <button
                        type="button"
                        disabled={!canGoNext}
                        onClick={() => {
                          setErrorMsg(null);
                          if (!canGoNext) return;
                          setStep(2);
                          track("lead_step_next", { step: 2 });
                        }}
                        className={[
                          "inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow",
                          "hover:shadow-lg transition",
                          !canGoNext ? "opacity-60 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="BHK *">
                        <select
                          value={bhk}
                          onChange={(e) => setBhk(e.target.value as Bhk)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        >
                          <option value="1">1 BHK</option>
                          <option value="2">2 BHK</option>
                        </select>
                      </Field>

                      <Field label="Furnishing *">
                        <select
                          value={furnishing}
                          onChange={(e) => setFurnishing(e.target.value as Furnishing)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        >
                          <option value="F">Furnished</option>
                          <option value="S">Semi‑Furnished</option>
                          <option value="U">Unfurnished</option>
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Move In *">
                        <select
                          value={moveIn}
                          onChange={(e) => setMoveIn(e.target.value as MoveIn)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        >
                          <option value="Immediate">Immediate</option>
                          <option value="7">7 days</option>
                          <option value="15">15 days</option>
                          <option value="30+">30+ days</option>
                        </select>
                      </Field>

                      <Field label="Profile *">
                        <select
                          value={profile}
                          onChange={(e) => setProfile(e.target.value as Profile)}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        >
                          <option value="Family">Family</option>
                          <option value="Bachelor">Bachelor</option>
                          <option value="Company">Company</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Additional Notes (Optional)">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-emerald-200"
                        placeholder="Society preference, floor, pets, parking, etc."
                      />
                    </Field>

                    {errorMsg ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMsg}
                      </div>
                    ) : null}

                    {successLeadId ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        <div className="font-semibold">Request submitted ✅</div>
                        <div className="mt-1">Lead ID: <span className="font-mono">{successLeadId}</span></div>
                      </div>
                    ) : null}

                    <div className="pt-1 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className={[
                          "inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow",
                          "hover:shadow-lg transition",
                          submitting ? "opacity-70 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        {submitting ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>

                    <div className="pt-1">
                      <a
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white shadow hover:shadow-lg transition"
                        href={whatsAppLink(phone10)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => track("whatsapp_click_after", { phone10: phone10 ? "entered" : "none" })}
                      >
                        Chat on WhatsApp
                      </a>
                      <div className="mt-2 text-xs text-slate-500 text-center">
                        By submitting, you agree we may contact you on WhatsApp.
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-semibold text-slate-900">{label}</div>
      {children}
    </label>
  );
}

function whatsAppLink(phone10: string) {
  const businessNumber = "919999999999"; // TODO: replace with real business number
  const to = phone10?.length === 10 ? `91${phone10}` : businessNumber;
  const text = encodeURIComponent("Hi! I want to find a rental home in Malad/Kandivali/Borivali. Please share verified options.");
  return `https://wa.me/${to}?text=${text}`;
}