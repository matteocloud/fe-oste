import {
  Activity,
  Baby,
  Dumbbell,
  Headphones,
  HeartPulse,
  StretchHorizontal
} from "lucide-react";
import Section from "./Section";
import type { ServiceItem } from "../types";

const services: ServiceItem[] = [
  {
    title: "Dolori cervicali",
    description:
      "Tecniche mirate per ridurre tensioni muscolari e migliorare la mobilità del tratto cervicale.",
    icon: Headphones,
    href: "#contact"
  },
  {
    title: "Lombalgia e sciatalgia",
    description:
      "Approccio globale per alleviare il dolore lombare, sciatico e favorire il recupero funzionale.",
    icon: Activity,
    href: "#contact"
  },
  {
    title: "Cefalee e posture",
    description:
      "Valutazione posturale completa per comprendere e trattare cefalee legate a squilibri muscolo-scheletrici.",
    icon: StretchHorizontal,
    href: "#contact"
  },
  {
    title: "Dolori articolari",
    description:
      "Trattamenti manuali per spalle, anche, ginocchia e altre articolazioni con focus su funzionalità e prevenzione.",
    icon: HeartPulse,
    href: "#contact"
  },
  {
    title: "Sport e performance",
    description:
      "Supporto a chi pratica sport per prevenire infortuni, ottimizzare la performance e velocizzare il recupero.",
    icon: Dumbbell,
    href: "#contact"
  },
  {
    title: "Gravidanza e post-partum",
    description:
      "Percorsi delicati per il benessere della mamma, dalla gestazione al recupero post parto.",
    icon: Baby,
    href: "#contact"
  }
];

const Services = () => {
  return (
    <Section
      id="services"
      eyebrow="Cosa tratto"
      title="Trattamenti personalizzati per esigenze specifiche"
      description="Ogni sessione parte da un ascolto attento e da una valutazione approfondita. L'obiettivo è liberare il movimento, alleviare il dolore e dare indicazioni chiare per mantenere i risultati nel tempo."
      background="muted"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.title}
            className="group flex h-full flex-col justify-between rounded-3xl border border-brand-primary/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg"
          >
            <div className="space-y-4">
              <div className="inline-flex rounded-full bg-brand-primary/10 p-3 text-brand-primary">
                <service.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600">{service.description}</p>
            </div>
            <a
              href={service.href}
              className="mt-6 inline-flex items-center text-sm font-semibold text-brand-primary transition group-hover:translate-x-1"
            >
              Scopri di più
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default Services;
