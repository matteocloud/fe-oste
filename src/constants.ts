import type { ContactInfo } from "./types";

export const CONTACT_DETAILS: ContactInfo = {
  phone: "+39 351 552 5149",
  email: "chiarabenini.osteopata@gmail.com",
  whatsappNumber: "+39 351 552 5149",
  locations: [
    {
      label: "Studio Varese · Via Leonardo Da Vinci, 3",
      shortLabel: "Apri studio Varese",
      address: "Via Leonardo Da Vinci, 3, 21100 Varese (VA)",
      mapsUrl:
        "https://maps.google.com/?q=Via%20Leonardo%20Da%20Vinci%2C%203%2C%2021100%20Varese%20VA",
      embedUrl:
        "https://maps.google.com/maps?q=Via%20Leonardo%20Da%20Vinci%2C%203%2C%2021100%20Varese%20VA&output=embed"
    },
    {
      label: "Studio Calcinate del Pesce",
      shortLabel: "Apri studio Calcinate",
      address: "Via Vespucci, 19, Calcinate del Pesce, 21100 Varese (VA)",
      mapsUrl:
        "https://maps.google.com/?q=Via%20Vespucci%2C%2019%2C%20Calcinate%20del%20Pesce%2C%2021100%20Varese%20VA",
      embedUrl:
        "https://maps.google.com/maps?q=Via%20Vespucci%2C%2019%2C%20Calcinate%20del%20Pesce%2C%2021100%20Varese%20VA&output=embed"
    }
  ],
  hours: [
    {
      label: "Lunedì – Venerdì",
      value: "09:00 – 13:00 · 14:00 – 18:00"
    },
    {
      label: "Sabato",
      value: "09:00 – 13:00"
    }
  ]
};

export const WHATSAPP_MESSAGE =
  "Ciao! Vorrei prenotare una visita. Sono [Nome].";
