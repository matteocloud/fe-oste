
import { WHATSAPP_MESSAGE } from "../constants";

export const buildWhatsAppLink = ({
  phoneNumber,
  message = WHATSAPP_MESSAGE
}: {
  phoneNumber: string;
  message?: string;
}): string => {
  const digits = phoneNumber.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
};

export const handleBookVisit = () => {
  if (typeof window === "undefined") {
    return;
  }

  const contact = document.getElementById("contact");
  if (contact) {
    const headerElement = document.querySelector<HTMLElement>("header");
    const headerHeight = headerElement?.offsetHeight ?? 0;
    const targetPosition = contact.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(targetPosition, 0), behavior: "smooth" });
  }
};
