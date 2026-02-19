import React, { useEffect, useMemo, useState } from "react";
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
import { useLeadDraft, Area } from "../state/leadDraft";
import Seo from "../seo/Seo";
import { localBusinessSchema, serviceSchema, websiteSchema } from "../seo/schema";

type Props = {
  slug: "malad" | "kandivali" | "borivali";
  defaultArea: Area;
  title: string;
  description: string;
};

export default function AreaLandingPage({ slug, defaultArea, title, description }: Props) {
  const [phone10, setPhone10] = useState<string>("");
  const { setDraft } = useLeadDraft();

  useEffect(() => {
    // Preselect area for higher ad relevance
    setDraft({ area: defaultArea });
  }, [defaultArea, setDraft]);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://example.com";
  const jsonLd = useMemo(() => {
    return [
      websiteSchema(baseUrl),
      localBusinessSchema(baseUrl),
      serviceSchema(baseUrl, slug, title.replace("Homes for Rent in ", "")),
    ];
  }, [baseUrl, slug, title]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Seo
        title={title}
        description={description}
        canonicalPath={`/${slug}`}
        ogImagePath={"/og-mumbai.png"}
        jsonLd={jsonLd}
      />

      <ScrollProgress />

      <div className="relative">
        <Navbar />

        <main>
          <section id="top">
            <Hero
              forcedHeadline={title}
              forcedSubhead={description}
              forcedAreaLabel={defaultArea}
            />
          </section>

          <section className="-mt-8">
            <TrustStrip />
          </section>

          <WaveDivider />

          <section id="areas">
            <AreaShowcase />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="how">
            <HowItWorks />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="testimonials">
            <Testimonials />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="lead">
            <LeadForm onPhoneChange={setPhone10} />
          </section>

          <WaveDivider className="-mt-10" />

          <section id="faq">
            <FAQ />
          </section>

          <Footer />
        </main>

        <LeadResume />
        <ChatbotWidget phone10={phone10} />
        <WhatsAppFab phone10={phone10} />
        <SmartCtaBar phone10={phone10} />
      </div>
    </div>
  );
}
