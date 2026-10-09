import { CONTACT, LOCATIONS, SITE } from "../data/site";

export const buildJsonLd = () => {
  const businesses = LOCATIONS.map((loc) => ({
    "@type": "MedicalBusiness",
    "@id": `${SITE.url}#${loc.id}`,
    name: `Chiara Benini Osteopata – ${loc.name}`,
    url: SITE.url,
    image: SITE.ogImage,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    hasMap: loc.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.area ? `${loc.street}, ${loc.area}` : loc.street,
      addressLocality: loc.locality,
      postalCode: loc.postalCode,
      addressRegion: "VA",
      addressCountry: "IT"
    }
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        url: SITE.url,
        name: "Chiara Benini Osteopata",
        inLanguage: "it-IT"
      },
      {
        "@type": "Person",
        "@id": `${SITE.url}#chiara-benini`,
        name: "Chiara Benini",
        jobTitle: "Osteopata",
        url: SITE.url,
        image: SITE.ogImage,
        telephone: CONTACT.phone,
        email: CONTACT.email,
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Accademia Italiana di Medicina Osteopatica (AIMO)"
        },
        knowsAbout: [
          "Osteopatia",
          "Osteopatia pediatrica",
          "Osteopatia in gravidanza",
          "Osteopatia sportiva",
          "Disturbi temporo-mandibolari"
        ],
        worksFor: businesses.map((business) => ({ "@id": business["@id"] }))
      },
      ...businesses
    ]
  };
};
