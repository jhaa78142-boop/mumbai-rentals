export function websiteSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mumbai Rentals",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Mumbai Rentals Service",
    url: baseUrl,
    areaServed: [
      "Malad East",
      "Malad West",
      "Kandivali East",
      "Kandivali West",
      "Borivali East",
      "Borivali West",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "MH",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-7498369191",
      contactType: "customer support",
      availableLanguage: ["en", "hi"],
    },
    sameAs: ["https://instagram.com/ayushjha.creates"],
  };
}

export function serviceSchema(baseUrl: string, areaSlug: string, areaName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Rental Homes in ${areaName}`,
    serviceType: "Residential rental assistance",
    provider: {
      "@type": "LocalBusiness",
      name: "Mumbai Rentals Service",
      url: baseUrl,
    },
    areaServed: areaName,
    url: `${baseUrl}/${areaSlug}`,
  };
}
