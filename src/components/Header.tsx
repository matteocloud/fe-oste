import { useEffect, useState } from "react";
import { Menu, PhoneCall, X } from "lucide-react";
import LogoCB from "./LogoCB";
import { CONTACT_DETAILS } from "../constants";
import { handleBookVisit } from "../utils/booking";
import { cn } from "../utils/cn";

const NAV_LINKS = [
  { label: "Servizi", href: "#services" },
  { label: "Chi sono", href: "#about" },
  { label: "Contatti", href: "#contact" }
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    document.body.style.overflow = isMobileNavOpen ? "hidden" : "";
  }, [isMobileNavOpen]);

  const handleNavClick = (href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      setIsMobileNavOpen(false);
      return;
    }

    const headerElement = document.querySelector<HTMLElement>("header");
    const headerHeight = headerElement?.offsetHeight ?? 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(targetPosition, 0), behavior: "smooth" });
    setIsMobileNavOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-colors",
        "backdrop-blur-md",
        isScrolled ? "bg-surface/95 border-outline shadow-sm" : "bg-surface/70"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-10">
        <a
          href="#hero"
          className="flex items-center gap-3 text-left"
          aria-label="Torna all'inizio"
        >
          <LogoCB className="h-24 w-24" />
          <span className="hidden text-base font-semibold uppercase tracking-[0.25em] text-slate-700 sm:block">
            Osteopata Chiara Benini
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex"
          aria-label="Navigazione principale"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className="transition-colors hover:text-brand-primary focus-visible:text-brand-primary"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            className="hidden items-center gap-2 rounded-full border border-transparent bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-soft transition hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow"
            href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            Chiama
          </a>
          <button
            type="button"
            onClick={handleBookVisit}
            className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            Prenota
          </button>
          <button
            type="button"
            className="rounded-full border border-outline p-2 text-slate-600 transition hover:text-brand-primary md:hidden"
            onClick={() => setIsMobileNavOpen((prev) => !prev)}
            aria-expanded={isMobileNavOpen}
            aria-label="Apri o chiudi navigazione"
          >
            {isMobileNavOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileNavOpen ? (
        <div className="md:hidden">
          <nav
            className="space-y-4 border-t border-outline bg-surface px-6 py-6 text-base font-medium text-slate-700 text-center"
            aria-label="Navigazione mobile"
          >
            {NAV_LINKS.map((link, index) => (
              <div
                key={link.href}
                className={cn(
                  "pb-4",
                  index < NAV_LINKS.length - 1 ? "border-b border-outline/60" : "border-none pb-0"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="inline-flex w-full justify-center py-2 transition-colors hover:text-brand-primary"
                >
                  {link.label}
                </button>
              </div>
            ))}
            <a
              className="block w-full rounded-full border border-brand-primary px-4 py-2 text-center font-semibold text-brand-primary transition hover:bg-brand-primary/10"
              href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
            >
              Chiama lo studio
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
