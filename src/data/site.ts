export type ServiceIcon =
  | "bone"
  | "smile"
  | "brain"
  | "stethoscope"
  | "heart"
  | "baby"
  | "dumbbell"
  | "posture";

export type Service = { title: string; icon: ServiceIcon; points: string[] };

export type Location = {
  id: string;
  name: string;
  street: string;
  area?: string;
  postalCode: string;
  locality: string;
  mapsUrl: string;
};

export type TrainingStep = { when: string; text: string };

export type FaqItem = { question: string; answer: string };

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const SITE = {
  url: "https://chiarabeniniosteopata.it/",
  title: "Chiara Benini | Osteopata a Varese",
  description:
    "Chiara Benini, osteopata a Varese: adulti, neonati e bambini, gravidanza e sport. Ricevo a Panorama Salute e allo Studio Synergy Fisio.",
  motto: "Dalla nascita, verso un futuro in salute.",
  tagline: "Un approccio dolce e naturale per favorire l'equilibrio posturale e funzionale.",
  ogImage: "https://chiarabeniniosteopata.it/og-image.jpg"
};

export const CONTACT = {
  phone: "+39 351 552 5149",
  email: "chiarabenini.osteopata@gmail.com",
  whatsappMessage: "Ciao! Vorrei prenotare una visita. Sono [Nome]."
};

export const NAV_LINKS = [
  { label: "Trattamenti", href: "#trattamenti" },
  { label: "Chi sono", href: "#chi-sono" },
  { label: "Domande", href: "#faq" },
  { label: "Contatti", href: "#contatti" }
];

export const AUDIENCES = ["Adulti", "Neonati e bambini", "Gravidanza", "Sportivi"];

export const LOCATIONS: Location[] = [
  {
    id: "panorama-salute",
    name: "Panorama Salute",
    street: "Via Belmonte, 169",
    postalCode: "21100",
    locality: "Varese",
    mapsUrl: mapsSearch("Via Belmonte 169, 21100 Varese VA")
  },
  {
    id: "synergy-fisio",
    name: "Studio Synergy Fisio",
    street: "Via Vespucci, 19",
    area: "Calcinate del Pesce",
    postalCode: "21100",
    locality: "Varese",
    mapsUrl: mapsSearch("Via Vespucci 19, Calcinate del Pesce, 21100 Varese VA")
  }
];

export const formatAddress = (loc: Location) =>
  `${loc.street}${loc.area ? `, ${loc.area}` : ""} · ${loc.postalCode} ${loc.locality} (VA)`;

export const HOURS = [
  { days: "Lunedì – Venerdì", time: "09:00 – 13:00 · 14:00 – 19:00" },
  { days: "Sabato", time: "09:00 – 13:00" }
];

export const SERVICES: Service[] = [
  {
    title: "Dolori muscolo-scheletrici",
    icon: "bone",
    points: [
      "Lombalgia, cervicalgia e dorsalgia",
      "Tensioni muscolari ricorrenti",
      "Dolori articolari (spalla, ginocchio, anca, polso, caviglia)",
      "Rigidità o limitazioni di movimento dopo traumi o interventi"
    ]
  },
  {
    title: "Disturbi temporo-mandibolari (ATM)",
    icon: "smile",
    points: ["Dolore o click alla mandibola", "Bruxismo"]
  },
  {
    title: "Cefalee e disturbi correlati",
    icon: "brain",
    points: ["Cefalee muscolo-tensive ed emicranie di origine cervicale"]
  },
  {
    title: "Disturbi viscerali",
    icon: "stethoscope",
    points: [
      "Reflusso gastroesofageo, stipsi",
      "Tensioni diaframmatiche o toraciche che influenzano la respirazione",
      "Disagi legati al ciclo mestruale"
    ]
  },
  {
    title: "Gravidanza e post-parto",
    icon: "heart",
    points: [
      "Dolori lombari, pelvici o pubici durante la gravidanza",
      "Preparazione del corpo al parto",
      "Recupero post-parto: postura, cicatrici, diastasi addominale"
    ]
  },
  {
    title: "Ambito pediatrico",
    icon: "baby",
    points: [
      "Rigurgiti, coliche, stipsi",
      "Difficoltà nella suzione",
      "Preferenza di rotazione del capo da un lato, torcicollo miogeno, plagiocefalia",
      "Supporto alla crescita",
      "Disturbi legati a tensioni post-parto"
    ]
  },
  {
    title: "Ambito sportivo",
    icon: "dumbbell",
    points: [
      "Recupero da traumi o sovraccarichi (tendiniti, stiramenti, contratture)",
      "Ottimizzazione della performance e prevenzione degli infortuni",
      "Miglioramento della mobilità articolare e del gesto atletico",
      "Gestione del dolore muscolare o articolare legato all'attività sportiva"
    ]
  },
  {
    title: "Controllo posturale",
    icon: "posture",
    points: ["Prevenzione e mantenimento di un buon equilibrio corporeo"]
  }
];

export const ABOUT = {
  intro:
    "Credo in un approccio globale, fondato sull'ascolto, sul dialogo e sulla collaborazione tra professionisti.",
  closing:
    "Ogni trattamento è personalizzato, frutto di un'attenta valutazione posturale e di un percorso di follow-up mirato a mantenere nel tempo i risultati raggiunti."
};

export const TRAINING: TrainingStep[] = [
  {
    when: "Formazione",
    text: "Bachelor in Osteopathic Science e Master in Osteopathic Medicine presso l'Accademia Italiana di Medicina Osteopatica (AIMO) di Saronno, in collaborazione con la Health Sciences University di Londra: titoli riconosciuti a livello internazionale."
  },
  {
    when: "Tirocinio",
    text: "Oltre 1000 ore di tirocinio clinico con pazienti dall'età neonatale all'età adulta, compreso il supporto agli atleti del Trofeo Master Rari Nantes – Saronno."
  },
  { when: "Corso", text: "Formazione breve in Clinica gnatologica e osteopatia." },
  { when: "Da febbraio 2025", text: "Specializzazione in ambito neonatale-pediatrico." },
  { when: "Da ottobre 2025", text: "Specializzazione in craniodonzia." },
  {
    when: "AIMO",
    text: "Assistente e tutor in formazione, a supporto degli studenti durante le lezioni e la pratica clinica."
  },
  {
    when: "Sport",
    text: "Insegnante di nuoto e nuoto sincronizzato: un punto d'incontro tra sport e osteopatia."
  }
];

// Bozze da far confermare a Chiara prima della pubblicazione.
export const FAQ: FaqItem[] = [
  {
    question: "Serve la prescrizione medica?",
    answer:
      "No, per una visita osteopatica non serve la prescrizione del medico. Se hai esami, referti o indicazioni del tuo medico, portali con te: mi aiutano a inquadrare meglio la situazione."
  },
  {
    question: "Quanto dura una seduta?",
    answer:
      "La prima visita dura circa un'ora e comprende colloquio, valutazione e trattamento. Le sedute successive sono un po' più brevi."
  },
  {
    question: "Cosa devo portare alla prima visita?",
    answer:
      "Eventuali esami, referti o radiografie recenti e un abbigliamento comodo. Per neonati e bambini è utile il libretto pediatrico."
  },
  {
    question: "Tratti anche neonati e bambini?",
    answer:
      "Sì. Mi occupo di osteopatia neonatale e pediatrica, ambito in cui mi sto specializzando dal 2025: rigurgiti, coliche, difficoltà nella suzione, plagiocefalia e supporto alla crescita."
  }
];
