# Redesign sito Chiara Benini Osteopata (Astro, pagina singola)

Data: 2026-10-06 · Branch: `redesign-astro`

## Obiettivi

1. Rimuovere lo Studio Curas (Chiara non ci lavora più). Sedi attive: **Panorama Salute** (Via Belmonte 169, 21100 Varese) e **Studio Synergy Fisio** (Via Vespucci 19, Calcinate del Pesce, 21100 Varese).
2. Far leggere a Google tutto il contenuto: oggi l'HTML servito è vuoto (React lato client).
3. Posizionarsi primi per "Chiara Benini osteopata" e migliorare la presenza su "osteopata Varese". Il solo "Chiara Benini" è conteso con la velista olimpica Chiara Benini Floriani: non è un obiettivo di breve periodo.
4. Vetrina più curata e più veloce, che porti al contatto (WhatsApp / telefono).

## Vincoli

- **Sito semplice**: una sola pagina, niente sottopagine, niente testi o foto in eccesso (richiesta esplicita).
- Stesso dominio `chiarabeniniosteopata.it`, stesso hosting GitHub Pages (branch `gh-pages` tramite workflow su push a `main`).
- Contenuti esistenti (servizi, biografia, contatti, orari) riusati; testi nuovi solo per le FAQ.
- Banner cookie e link privacy/cookie iubenda mantenuti.
- Nessuna pubblicazione su `main` senza ok esplicito dell'utente.

## Approccio

Migrazione da Vite + React (rendering lato client) ad **Astro** (generazione statica). Scartati: prerender su Vite/React (plugin fragili, ~170 KB di JS restano) e soli ritocchi (non risolve l'HTML vuoto).

## Struttura della pagina

Ancore in italiano: `#trattamenti`, `#chi-sono`, `#faq`, `#contatti`.

1. **Header** fisso: logo CB + "Chiara Benini · Osteopata"; link alle sezioni; pulsante "Prenota" → `#contatti`. Su mobile menu a scomparsa (unico script interattivo, vanilla).
2. **Hero**: H1 "Chiara Benini, Osteopata a Varese"; sottotitolo "Dalla nascita, verso un futuro in salute."; riga "Adulti · Neonati e bambini · Gravidanza · Sportivi"; pulsanti **WhatsApp** (primario) e **Chiama**; foto `doctor-paceholder-v4.jpg`.
3. **Cosa tratto** (`#trattamenti`): le 8 aree attuali con gli stessi titoli e punti, in card compatte.
4. **Chi sono** (`#chi-sono`): foto `doctor-paceholder-v3.jpg` (visibile anche su mobile); breve presentazione (2–3 frasi dai testi attuali) + elenco "Formazione e percorso" a tappe:
   - Bachelor in Osteopathic Science e Master in Osteopathic Medicine, AIMO Saronno (in collaborazione con la Health Sciences University di Londra)
   - Oltre 1000 ore di tirocinio clinico, dall'età neonatale all'età adulta; trattamenti agli atleti al "Trofeo Master Rari Nantes – Saronno"
   - Corso "Clinica gnatologica e osteopatia"
   - Da febbraio 2025: specializzazione neonatale-pediatrica
   - Da ottobre 2025: specializzazione in craniodonzia
   - Assistente e tutor in formazione presso AIMO
   - Insegnante di nuoto e nuoto sincronizzato
   Chiusura con la frase sull'approccio globale (ascolto, dialogo, collaborazione, follow-up).
5. **Domande frequenti** (`#faq`): 4 voci a fisarmonica (`<details>`), chiuse di default. Risposte in bozza **da confermare con Chiara** prima della pubblicazione:
   - Serve la prescrizione medica?
   - Quanto dura una seduta?
   - Cosa devo portare alla prima visita?
   - Tratti anche neonati e bambini?
6. **Dove ricevo e contatti** (`#contatti`): due schede sede (nome, indirizzo, pulsante "Indicazioni" → Google Maps in nuova scheda); telefono, WhatsApp, email; orari attuali (Lun–Ven 09:00–13:00 · 14:00–19:00; Sab 09:00–13:00). **Nessuna mappa incorporata** (peso + cookie di terze parti).
7. **Footer**: nome, motto, navigazione, Privacy Policy e Cookie Policy (iubenda), copyright.
8. **Barra contatti mobile** (sotto `md`): fissa in basso, "Chiama" + "WhatsApp". Il contenuto della pagina ha padding inferiore per non esserne coperto.

## Stile

- Logo CB invariato (convertito in formato leggero).
- Colori: **petrolio del logo** (valore campionato dal file) come colore primario per titoli e pulsanti; verde salvia attuale (`#abc19f` / `#6E7457`) per sfondi e dettagli; sfondo bianco caldo; testo scuro. Contrasto testo/pulsanti conforme WCAG AA.
- Caratteri self-hosted (Fontsource, nessuna richiesta a Google Fonts): **Cormorant Garamond** per i titoli, **Figtree** per il testo.
- Molto spazio bianco, angoli morbidi, animazioni leggere che rispettano `prefers-reduced-motion`.
- Mobile-first; nessuno scroll orizzontale.

## Tecnica

- **Astro 7** (richiede Node ≥ 22.12) con **Tailwind CSS 4** tramite `@tailwindcss/vite`; integrazione `@astrojs/sitemap`.
- Componenti `.astro` in `src/components/`, dati (contatti, sedi, orari, servizi, FAQ) in `src/data/site.ts`: unico punto da modificare per i contenuti.
- Immagini in `src/assets/` servite con `<Picture>` di Astro (AVIF/WebP, `srcset`); foto hero con caricamento prioritario, le altre lazy.
- Icone: SVG inline (nessuna libreria runtime).
- `public/`: CNAME, robots.txt, favicon, immagine di anteprima social 1200×630 (`og-image.jpg`).
- Rimossi: React, lucide-react, Vite config, PostCSS/Tailwind 3 config, `src/lib/` (palette dinamica), `index.html` e componenti React.
- Workflow GitHub Actions: Node 22, `npm ci`, `npm run build`, pubblicazione di `dist/` invariata.

## SEO

- `<title>`: "Chiara Benini | Osteopata a Varese".
- Meta description con nome, professione, Varese e le due sedi; canonical; Open Graph / Twitter con `og-image.jpg`.
- Un solo H1 (nome + città); H2 per le sezioni con parole chiave naturali.
- JSON-LD in `@graph`: `Person` (Chiara Benini, jobTitle "Osteopata", alumniOf AIMO, `worksFor` le due sedi) e due `MedicalBusiness` (una per sede: nome, indirizzo, telefono, url, immagine). Nessun campo vuoto: `sameAs` aggiunto solo quando esisterà la scheda Google Business Profile.
- Sitemap generata in build; robots.txt punta a `sitemap-index.xml`.
- `alt` descrittivi su tutte le immagini.

## Fuori dal sito (checklist per l'utente, nessun codice)

- Creare la scheda Google Business Profile (dall'account Google di Chiara).
- In Search Console: inviare la nuova sitemap e richiedere l'indicizzazione della home.
- Profilo MioDottore (o simili) con link al sito.
- Chiedere a Panorama Salute, Synergy Fisio e AIMO un link al sito.

## Verifica

- `npm run build` senza errori.
- `dist/index.html` contiene nome, servizi, biografia, sedi e JSON-LD come testo (controllo con grep); nessuna occorrenza di "Curas".
- Controllo visivo su mobile (375px) e desktop nel browser; menu mobile e barra contatti funzionanti.
- Lighthouse (performance, accessibilità, SEO) in locale.

## Fuori ambito

Pagine aggiuntive, blog, prenotazione online, nuove foto, modifiche al dominio o all'hosting, creazione degli account esterni.
