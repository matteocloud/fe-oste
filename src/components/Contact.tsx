import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall
} from "lucide-react";
import Section from "./Section";
import { CONTACT_DETAILS } from "../constants";
import { buildWhatsAppLink } from "../utils/booking";

const Contact = () => {
  const whatsappLink = buildWhatsAppLink({
    phoneNumber: CONTACT_DETAILS.whatsappNumber
  });

  return (
    <Section
      id="contact"
      eyebrow="Prenota una visita"
      title="Contattami per informazioni o per fissare il tuo prossimo appuntamento"
      description="Ricevo a Varese in Via Leonardo Da Vinci, 3 e a Calcinate del Pesce in Via Vespucci, 19. Puoi contattarmi telefonicamente, via WhatsApp oppure via email: ti risponderò appena possibile."
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <div className="space-y-8 text-center lg:text-left lg:pr-10">
          <div className="grid gap-6 text-sm text-slate-700 max-w-xl mx-auto lg:mx-0 w-full">
            <ContactField
              icon={PhoneCall}
              label="Telefono"
              value={CONTACT_DETAILS.phone}
              href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
            />
            <ContactField
              icon={MessageCircle}
              label="WhatsApp"
              value="Scrivimi un messaggio"
              href={whatsappLink}
            />
            <ContactField
              icon={Mail}
              label="Email"
              value={CONTACT_DETAILS.email}
              href={`mailto:${CONTACT_DETAILS.email}`}
            />
            {CONTACT_DETAILS.locations.map((location) => (
              <ContactField
                key={location.address}
                icon={MapPin}
                label={location.label}
                value={location.address}
                href={location.mapsUrl}
              />
            ))}
            <ContactField
              icon={Clock}
              label="Orari"
              value={
                <div className="space-y-2">
                  {CONTACT_DETAILS.hours.map((slot) => (
                    <div key={slot.label} className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700">
                        {slot.label}
                      </p>
                      <p className="text-sm text-slate-600">
                        {slot.value}
                      </p>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start max-w-xl mx-auto lg:mx-0">
            {CONTACT_DETAILS.locations.map((location) => (
              <a
                key={location.address}
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 px-5 py-2 text-sm font-semibold text-brand-primary transition hover:-translate-y-0.5 hover:border-brand-primary"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {location.shortLabel ?? location.label}
              </a>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto w-full">
          {CONTACT_DETAILS.locations.map((location) => (
            <div
              key={`${location.address}-map`}
              className="overflow-hidden rounded-3xl border border-brand-primary/20 bg-white shadow-soft"
            >
              <iframe
                title={`Indicazioni per ${location.label}`}
                src={location.embedUrl}
                loading="lazy"
                className="h-64 w-full border-0"
                allowFullScreen
              />
              <div className="space-y-1 border-t border-brand-primary/10 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-700">{location.label}</p>
                <p>{location.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

type ContactFieldProps = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  href?: string;
};

const ContactField = ({ icon: Icon, label, value, href }: ContactFieldProps) => {
  const content = (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-primary/10 bg-white px-4 py-3 text-center shadow-sm transition hover:border-brand-primary/30 hover:shadow md:flex-row md:items-center md:text-left">
      <div className="rounded-full bg-brand-primary/10 p-2 text-brand-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="space-y-1 text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted md:text-left">
          {label}
        </p>
        <div className="text-sm font-medium text-slate-700 md:text-left">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default Contact;
