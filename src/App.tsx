import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LeadDraftProvider, useLeadDraft } from "./state/leadDraft";
import HomePage from "./pages/HomePage";
import AreaLandingPage from "./pages/AreaLandingPage";
import Seo from "./seo/Seo";
import { localBusinessSchema, websiteSchema } from "./seo/schema";
import { track } from "./lib/track";
import { getAbVariant } from "./lib/ab";
import { parsePrefillFromUrl } from "./lib/urlPrefill";



function QueryPrefill() {
  const loc = useLocation();
  const { setDraft } = useLeadDraft();

  useEffect(() => {
    // Apply URL query params (ads/deep links) into shared draft state
    const { patch, autoScroll } = parsePrefillFromUrl(window.location.href);

    if (Object.keys(patch).length > 0) {
      setDraft({ ...patch, _prefillTs: Date.now() });
    }

    if (autoScroll) {
      // defer to allow DOM render
      setTimeout(() => {
        const el = document.getElementById("lead");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [loc.pathname, loc.search, setDraft]);

  return null;
}

function GlobalPageView() {
  const loc = useLocation();
  useEffect(() => {
    // Track SPA navigation
    const variant = getAbVariant();
    track("page_view", { path: loc.pathname + loc.search, abVariant: variant });
  }, [loc.pathname, loc.search]);
  return null;
}

export default function App() {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://example.com";
  const homeJsonLd = [websiteSchema(baseUrl), localBusinessSchema(baseUrl)];

  return (
    <HelmetProvider>
      <LeadDraftProvider>
        <BrowserRouter>
          <GlobalPageView />
          <QueryPrefill />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Seo
                    title="Mumbai Rentals | Malad, Kandivali, Borivali"
                    description="Find verified rental homes in Malad, Kandivali, and Borivali. Share your budget and preferences to get a WhatsApp shortlist and schedule visits fast."
                    canonicalPath="/"
                    ogImagePath="/og-mumbai.png"
                    jsonLd={homeJsonLd}
                  />
                  <HomePage />
                </>
              }
            />
            <Route
              path="/malad"
              element={
                <AreaLandingPage
                  slug="malad"
                  defaultArea="Malad West"
                  title="Homes for Rent in Malad"
                  description="Verified rentals in Malad East/West. Share budget and preferences to get a curated WhatsApp shortlist and schedule visits."
                />
              }
            />
            <Route
              path="/kandivali"
              element={
                <AreaLandingPage
                  slug="kandivali"
                  defaultArea="Kandivali West"
                  title="Homes for Rent in Kandivali"
                  description="Verified rentals in Kandivali East/West. Get a WhatsApp shortlist, transparent details, and faster visit scheduling."
                />
              }
            />
            <Route
              path="/borivali"
              element={
                <AreaLandingPage
                  slug="borivali"
                  defaultArea="Borivali West"
                  title="Homes for Rent in Borivali"
                  description="Verified rentals in Borivali East/West. Share your budget and move-in date to receive a curated shortlist on WhatsApp."
                />
              }
            />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LeadDraftProvider>
    </HelmetProvider>
  );
}