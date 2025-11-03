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
    contact.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
