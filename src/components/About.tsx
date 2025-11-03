import { CheckCircle2 } from "lucide-react";
import Section from "./Section";

const credentials = [
  "Laurea in Osteopatia con specializzazione in ambito pediatrico",
  "Aggiornamenti costanti su tecniche manuali dolci e approccio funzionale",
  "Percorsi personalizzati per neonati, adulti, sportivi e donne in gravidanza",
  "Collaborazioni con professionisti sanitari per un lavoro sinergico"
];

const About = () => {
  return (
    <Section
      id="about"
      eyebrow="Chi sono"
      title="Un approccio dolce e naturale per riequilibrare il corpo"
      description="Mi chiamo Chiara Benini e accompagno le persone in un percorso di benessere quotidiano. Ascolto, empatia e tecnica osteopatica si uniscono per creare trattamenti su misura che rispettano i tempi e le esigenze di ogni paziente."
    >
      <div className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        <div className="relative">
          <div className="absolute inset-0 -left-6 -top-6 rounded-3xl bg-brand-primary/10" />
          <div className="relative overflow-hidden rounded-3xl border border-brand-primary/20 bg-white shadow-soft">
            <img
              src="/images/doctor-paceholder-v3.jpg"
              alt="Ritratto professionale di Chiara Benini, osteopata"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-slate-600">
            Credo in un approccio integrato che valorizzi il dialogo con il paziente
            e la collaborazione con altre figure sanitarie. Ogni trattamento nasce
            da un ascolto accurato, una valutazione posturale completa e un piano di
            follow-up per consolidare i risultati.
          </p>
          <ul className="grid gap-4 text-sm text-slate-600">
            {credentials.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-1 h-5 w-5 flex-shrink-0 text-brand-accent"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default About;
