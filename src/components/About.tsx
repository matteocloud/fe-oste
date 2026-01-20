import { CheckCircle2 } from "lucide-react";
import Section from "./Section";
import { getAssetUrl } from "../utils/assets";


const biographyText = `
Mi chiamo Chiara Benini.

Ho frequentato il corso quinquennale di Osteopatia conseguendo il Bachelor in Osteopathic Science e il Master in Osteopathic Medicine presso l’Accademia Italiana di Medicina Osteopatica (AIMO) di Saronno, la quale collabora con la Health Sciences University di Londra. Tale collaborazione permette di avere titoli riconosciuti a livello internazionale.
Durante questo percorso ho svolto più di 1000 ore di tirocinio clinico con pazienti dall’età neonatale all’età adulta. Ho avuto la possibilità di supportare, grazie ai trattamenti, gli atleti di nuoto durante il “trofeo Master Rari Nantes - Saronno”.
Inoltre ho eseguito un corso di formazione breve riguardante la “Clinica gnatologica e osteopatia”.
Da febbraio 2025 ho intrapreso una specializzazione nell’ambito neonatale-pediatrico.
Da ottobre 2025 ho intrapreso una ulteriore specializzazione in craniodonzia.
In aggiunta ho intrapreso il ruolo di assistente e tutor in formazione presso l’Accademia Italiana di Medicina Osteopatica (AIMO) supportando gli studenti durante le lezioni e la loro pratica clinica.
Parallelamente sono un’insegnante di nuoto e nuoto sincronizzato, questo mi permette di apprezzare anche la combinazione tra lo sport e l’osteopatia.

Credo in un approccio globale, fondato sull’ascolto, sul dialogo e sulla collaborazione tra professionisti. Ogni trattamento è personalizzato, frutto di un’attenta valutazione posturale e di un percorso di follow-up mirato a mantenere nel tempo i risultati raggiunti.
`.trim();

const About = () => {
  return (
    <Section
      id="about"
      eyebrow="Chi sono"
      title="Osteopata"
      // description="Mi chiamo Chiara Benini e accompagno le persone in un percorso di benessere quotidiano. Ascolto, empatia e tecnica osteopatica si uniscono per creare trattamenti su misura che rispettano i tempi e le esigenze di ogni paziente."
    >
      <div className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        <div className="relative hidden md:block">
          <div className="absolute inset-0 -left-6 -top-6 rounded-3xl bg-brand-primary/10" />
          <div className="relative overflow-hidden rounded-3xl border border-brand-primary/20 bg-white shadow-soft">
            <img
              src={getAssetUrl("images/doctor-paceholder-v4.jpg")}
              alt="Ritratto professionale di Chiara Benini, osteopata"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
        <div className="space-y-6">
          <p className="text-lg text-slate-600 whitespace-pre-line">
            {biographyText}
          </p>
        </div>
      </div>
    </Section>
  );
};

export default About;
