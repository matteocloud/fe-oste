import { MessageCircle, PhoneCall } from "lucide-react";
import { CONTACT_DETAILS } from "../constants";
import { buildWhatsAppLink } from "../utils/booking";

const StickyActions = () => {
  const whatsappLink = buildWhatsAppLink({
    phoneNumber: CONTACT_DETAILS.whatsappNumber
  });

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 md:right-8">
      <a
        aria-label="Chiama lo studio"
        href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
        className="group inline-flex items-center justify-center rounded-full bg-white p-3 text-brand-primary shadow-soft transition hover:-translate-y-1 hover:bg-brand-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        <PhoneCall className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Chiama lo studio</span>
      </a>
      <a
        aria-label="Scrivi via WhatsApp"
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center justify-center rounded-full bg-brand-primary p-3 text-white shadow-soft transition hover:-translate-y-1 hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Scrivi via WhatsApp</span>
      </a>
    </div>
  );
};

export default StickyActions;
