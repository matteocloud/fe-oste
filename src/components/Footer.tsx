import { useEffect } from "react";
import LogoCB from "./LogoCB";
import { CONTACT_DETAILS } from "../constants";

const Footer = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const existingScript = document.getElementById("iubenda-script");
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.iubenda.com/iubenda.js";
    script.id = "iubenda-script";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-200" aria-labelledby="footer-title">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="flex h-15 w-15 items-center justify-center rounded-full bg-white/90">
                <LogoCB className="h-14 w-14" />
              </span>
              <div>
                <h2 id="footer-title" className="text-lg font-semibold text-white">
                  Osteopata Chiara Benini
                </h2>
                <p className="text-sm text-slate-400">
                  Un approccio dolce e naturale per favorire l&apos;equilibrio posturale e funzionale.
                </p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-slate-400">
              {CONTACT_DETAILS.locations.map((location) => (
                <p key={location.address}>{location.address}</p>
              ))}
              <p>P.IVA 04102040120</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                {CONTACT_DETAILS.phone}
              </a>
              <a
                href={`mailto:${CONTACT_DETAILS.email}`}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                {CONTACT_DETAILS.email}
              </a>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">
                Naviga
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-400">
                <li>
                  <a className="transition hover:text-white" href="#services">
                    Servizi
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-white" href="#about">
                    Chi sono
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-white" href="#contact">
                    Contatti
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Osteopata Chiara Benini · Tutti i diritti riservati.</p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.iubenda.com/privacy-policy/93759785"
              className="transition hover:text-white iubenda-white iubenda-noiframe iubenda-embed"
              title="Privacy Policy"
            >
              Privacy Policy
            </a>
            <a
              href="https://www.iubenda.com/privacy-policy/93759785/cookie-policy"
              className="transition hover:text-white iubenda-white iubenda-noiframe iubenda-embed"
              title="Cookie Policy"
            >
              Cookie Policy
            </a>
            <a className="transition hover:text-white" href="#contact">
              Prenota una visita
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
