import { CONTACT } from "../data/site";

export const telHref = (phone: string = CONTACT.phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsappHref = (phone: string = CONTACT.phone, message: string = CONTACT.whatsappMessage) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
