import { ArrowRight, MessageCircle } from "lucide-react";
import { CONTACT_DETAILS } from "../constants";
import { buildWhatsAppLink, handleBookVisit } from "../utils/booking";
import { getAssetUrl } from "../utils/assets";

const Hero = () => {
  const whatsappLink = buildWhatsAppLink({
    phoneNumber: CONTACT_DETAILS.whatsappNumber
  });

  const handleScrollToAbout = () => {
    const about = document.getElementById("about");
    if (about) {
      about.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      className="bg-surface"
      aria-labelledby="hero-title"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-24">
        <div className="flex-1 space-y-6">
          <blockquote className="text-xl italic text-slate-700">
            “Un approccio dolce e naturale per favorire l&apos;equilibrio posturale e funzionale.”
          </blockquote>
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-accent/40 bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-brand-accent">
            Dalla nascita, verso un futuro in salute.
          </p>
          <h1
            id="hero-title"
            className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Osteopatia per il tuo benessere quotidiano
          </h1>
          <p className="text-lg text-slate-600 sm:text-xl">
            Valutazioni personalizzate, trattamenti mirati e risultati
            misurabili. Supporto continuo per migliorare postura, mobilità e
            qualità della vita.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleBookVisit}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-primary/90"
            >
              Prenota una visita
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleScrollToAbout}
              className="inline-flex items-center justify-center rounded-full border border-brand-primary/30 px-6 py-3 text-base font-semibold text-brand-primary transition hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary/10"
            >
              Chi sono
            </button>
          </div>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 -translate-x-6 scale-105 rounded-[3rem] bg-brand-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-brand-primary/20 bg-white shadow-soft">
            <img
              src={getAssetUrl("images/doctor-paceholder-v4.jpg")}
              alt="Foto"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
