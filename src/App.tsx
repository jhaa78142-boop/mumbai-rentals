import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import AreaShowcase from "./components/AreaShowcase";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import LeadForm from "./components/LeadForm";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import WhatsAppFab from "./components/WhatsAppFab";
import WaveDivider from "./components/WaveDivider";

export default function App() {
  const [phone10, setPhone10] = useState("");

  return (
    <div className="min-h-screen bg-white">
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

      <WhatsAppFab phone10={phone10} />
    </div>
  );
}