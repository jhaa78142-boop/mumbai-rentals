import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import AreaShowcase from "../components/AreaShowcase";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import LeadForm from "../components/LeadForm";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import WhatsAppFab from "../components/WhatsAppFab";
import SmartCtaBar from "../components/SmartCtaBar";
import LeadResume from "../components/LeadResume";
import ChatbotWidget from "../components/ChatbotWidget";
import WaveDivider from "../components/WaveDivider";

export default function HomePage() {
  const [phone10, setPhone10] = useState<string>("");

  return (
<div className="relative min-h-screen bg-slate-950 text-slate-950">
        {/* premium background */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/18 blur-3xl blob" />
          <div className="absolute top-[40vh] -left-32 h-[460px] w-[460px] rounded-full bg-sky-500/14 blur-3xl blob blob-delay" />
          <div className="absolute bottom-[-120px] right-[-120px] h-[520px] w-[520px] rounded-full bg-fuchsia-500/10 blur-3xl blob blob-delay2" />
          <div className="absolute inset-0 bg-noise opacity-[0.10]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]" />
        </div>

        <ScrollProgress />
        <Navbar />

        {/* offset for fixed navbar */}
        <div className="pt-24 sm:pt-28">
          <section id="top">
            <Hero />
            <TrustStrip />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="areas">
            <AreaShowcase />
          </section>

          <WaveDivider flip className="-mt-10" />

          <section id="how">
            <HowItWorks />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="testimonials">
            <Testimonials />
          </section>

          <WaveDivider flip className="-mt-10" />

          <section id="lead">
            <LeadForm onPhoneChange={setPhone10} />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="faq">
            <FAQ />
          </section>

          <Footer />
        </div>

        <LeadResume />
        <ChatbotWidget phone10={phone10} />
        <WhatsAppFab phone10={phone10} />
        <SmartCtaBar phone10={phone10} />
      </div>
  );
}
