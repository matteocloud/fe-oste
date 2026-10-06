# Redesign Astro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ricostruire il sito vetrina di Chiara Benini come pagina singola statica in Astro, con nuova grafica, contenuti leggibili da Google e senza lo Studio Curas.

**Architecture:** Astro genera `dist/index.html` già completo di testo. Tutti i contenuti stanno in `src/data/site.ts`; ogni sezione è un componente `.astro` in `src/components/`; `src/layouts/Base.astro` gestisce `<head>` (SEO, font, iubenda, JSON-LD). Le verifiche sono test `node:test` che leggono l'output di build.

**Tech Stack:** Astro 7, Tailwind CSS 4 (`@tailwindcss/vite`), `@lucide/astro`, Astro Fonts API (Fontsource, self-hosted in build), `sharp` (immagini social), `node:test`.

Spec: `docs/superpowers/specs/2026-10-06-redesign-astro-design.md`

## Global Constraints

- Node ≥ 22.12 (requisito di Astro 7); CI su Node 22.
- Una sola pagina; ancore: `#inizio`, `#trattamenti`, `#chi-sono`, `#faq`, `#contatti`.
- Sedi attive: solo Panorama Salute (Via Belmonte, 169) e Studio Synergy Fisio (Via Vespucci, 19, Calcinate del Pesce). Nessun riferimento a Curas / Via Leonardo Da Vinci.
- `<title>` esatto: `Chiara Benini | Osteopata a Varese`. Un solo H1, testo esatto: `Chiara Benini, Osteopata a Varese`.
- Dominio `https://chiarabeniniosteopata.it/`; `public/CNAME` invariato.
- Colori: petrolio `#275360`, salvia `#abc19f`, salvia scuro `#6E7457`, sfondo `#fbfaf7`, testo `#1f2a37`.
- Font: Cormorant Garamond (titoli), Figtree (testo), via Astro Fonts API; nessuna richiesta a Google Fonts.
- Nessuna mappa incorporata (`<iframe>`).
- Iubenda: widget `https://embeds.iubenda.com/widgets/9aa397b6-9715-436e-8dad-43316562ee44.js` in `<head>`, `https://cdn.iubenda.com/iubenda.js` nel footer, link policy `https://www.iubenda.com/privacy-policy/93759785` e `/cookie-policy`.
- Nessun push su `main`: si lavora sul branch `redesign-astro`.

## File Structure

```
astro.config.mjs                 config Astro: site, Tailwind, font
tsconfig.json                    preset Astro strict
package.json                     script dev/build/test/images
src/data/site.ts                 TUTTI i contenuti (sedi, contatti, servizi, formazione, FAQ, SEO)
src/lib/links.ts                 telHref(), whatsappHref()
src/lib/jsonld.ts                buildJsonLd() → oggetto schema.org
src/styles/global.css            Tailwind + token colori/font + classi base (btn, eyebrow, container-page)
src/layouts/Base.astro           <html>/<head>: meta, OG, font, iubenda, JSON-LD
src/components/SectionHeading.astro  eyebrow + h2 + intro
src/components/Header.astro      header fisso + menu mobile (unico script)
src/components/Hero.astro
src/components/Services.astro
src/components/About.astro
src/components/Faq.astro
src/components/Contact.astro
src/components/Footer.astro
src/components/MobileContactBar.astro
src/pages/index.astro            compone la pagina
src/assets/                      foto e logo (ottimizzati da Astro)
scripts/make-images.mjs          genera public/og-image.jpg e public/apple-touch-icon.png
tests/helpers.mjs                lettura di dist/ e utilità
tests/*.test.mjs                 verifiche sull'output di build
.github/workflows/deploy.yml     Node 22, npm ci, npm test, deploy dist/
```

---

### Task 1: Scaffold Astro, layout base e test harness

**Files:**
- Delete: `index.html`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.node.json`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/types.ts`, `src/vite-env.d.ts`, `src/constants.ts`, `src/pages/Home.tsx`, `src/components/*.tsx`, `src/utils/*.ts`, `src/lib/extractPalette.ts`, `src/lib/palette.ts`
- Create: `astro.config.mjs`, `src/data/site.ts`, `src/lib/links.ts`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro`, `tests/helpers.mjs`, `tests/head.test.mjs`
- Modify: `package.json`, `tsconfig.json`, `.gitignore`

**Interfaces:**
- Produces: `SITE`, `CONTACT`, `NAV_LINKS`, `AUDIENCES`, `LOCATIONS`, `formatAddress(loc)`, `HOURS`, `SERVICES`, `ABOUT`, `TRAINING`, `FAQ` e i tipi `ServiceIcon`, `Location` da `src/data/site.ts`; `telHref(): string`, `whatsappHref(): string` da `src/lib/links.ts`; layout `Base.astro` con `<slot />`; helper di test `DIST`, `html`, `pageText`, `textOf`, `listFiles`, `jsonLd`.

- [ ] **Step 1: Sostituire le dipendenze**

```bash
rm -rf dist node_modules
npm uninstall react react-dom lucide-react @types/node @types/react @types/react-dom @vitejs/plugin-react autoprefixer gh-pages postcss tailwindcss typescript vite
npm install astro @lucide/astro
npm install -D tailwindcss @tailwindcss/vite sharp
```

Poi in `package.json` sostituire i blocchi `version`/`scripts` e aggiungere `engines` (lasciare intatti `dependencies`/`devDependencies` scritti da npm):

```json
  "version": "1.0.0",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "astro build && node --test \"tests/*.test.mjs\"",
    "images": "node scripts/make-images.mjs"
  },
```

- [ ] **Step 2: Rimuovere i file Vite/React**

```bash
git rm -q index.html vite.config.ts tailwind.config.js postcss.config.js tsconfig.node.json \
  src/App.tsx src/main.tsx src/index.css src/types.ts src/vite-env.d.ts src/constants.ts \
  src/pages/Home.tsx src/components/*.tsx src/utils/*.ts src/lib/extractPalette.ts src/lib/palette.ts
```

- [ ] **Step 3: Scrivere i test del `<head>` (devono fallire)**

`tests/helpers.mjs`:

```js
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
export const html = readFileSync(join(DIST, "index.html"), "utf8");

export const textOf = (fragment) =>
  fragment
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export const pageText = textOf(
  html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ")
);

export const listFiles = (dir = DIST) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [full];
  });

export const jsonLd = () => {
  const match = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error("JSON-LD mancante");
  return JSON.parse(match[1]);
};
```

`tests/head.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { html, listFiles, textOf } from "./helpers.mjs";

test("title e meta description", () => {
  assert.match(html, /<title>Chiara Benini \| Osteopata a Varese<\/title>/);
  assert.match(html, /<meta name="description" content="Chiara Benini, osteopata a Varese[^"]*"/);
});

test("canonical e Open Graph con URL assoluti", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/chiarabeniniosteopata\.it\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/chiarabeniniosteopata\.it\/og-image\.jpg"/);
});

test("un solo h1 con nome e città", () => {
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(h1s.length, 1);
  assert.equal(textOf(h1s[0][1]), "Chiara Benini, Osteopata a Varese");
});

test("banner cookie iubenda nel head", () => {
  assert.ok(html.includes("https://embeds.iubenda.com/widgets/9aa397b6-9715-436e-8dad-43316562ee44.js"));
});

test("HTML statico, non una SPA vuota", () => {
  assert.ok(!html.includes('<div id="root"></div>'));
});

test("font self-hosted, nessuna richiesta a Google Fonts", () => {
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(html, /--font-cormorant/);
  assert.match(html, /--font-figtree/);
});

test("nessun riferimento allo Studio Curas in dist", () => {
  for (const file of listFiles().filter((f) => /\.(html|xml|txt|js|css)$/.test(f))) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /curas|leonardo da vinci/i, file);
  }
});
```

Run: `node --test "tests/*.test.mjs"`
Expected: FAIL (`ENOENT ... dist/index.html`).

- [ ] **Step 4: Config Astro, TypeScript e gitignore**

`astro.config.mjs`:

```js
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://chiarabeniniosteopata.it",
  vite: {
    plugins: [tailwindcss()]
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      weights: [500, 600],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"]
    },
    {
      provider: fontProviders.fontsource(),
      name: "Figtree",
      cssVariable: "--font-figtree",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"]
    }
  ]
});
```

`tsconfig.json` (sostituisce il file esistente):

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

In `.gitignore` aggiungere una riga:

```
.astro
```

- [ ] **Step 5: Dati del sito**

`src/data/site.ts`:

```ts
export type ServiceIcon =
  | "bone"
  | "smile"
  | "brain"
  | "stethoscope"
  | "heart"
  | "baby"
  | "dumbbell"
  | "posture";

export type Service = { title: string; icon: ServiceIcon; points: string[] };

export type Location = {
  id: string;
  name: string;
  street: string;
  area?: string;
  postalCode: string;
  locality: string;
  mapsUrl: string;
};

export type TrainingStep = { when: string; text: string };

export type FaqItem = { question: string; answer: string };

const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const SITE = {
  url: "https://chiarabeniniosteopata.it/",
  title: "Chiara Benini | Osteopata a Varese",
  description:
    "Chiara Benini, osteopata a Varese: adulti, neonati e bambini, gravidanza e sport. Ricevo a Panorama Salute e allo Studio Synergy Fisio.",
  motto: "Dalla nascita, verso un futuro in salute.",
  tagline: "Un approccio dolce e naturale per favorire l'equilibrio posturale e funzionale.",
  ogImage: "https://chiarabeniniosteopata.it/og-image.jpg"
};

export const CONTACT = {
  phone: "+39 351 552 5149",
  email: "chiarabenini.osteopata@gmail.com",
  whatsappMessage: "Ciao! Vorrei prenotare una visita. Sono [Nome]."
};

export const NAV_LINKS = [
  { label: "Trattamenti", href: "#trattamenti" },
  { label: "Chi sono", href: "#chi-sono" },
  { label: "Domande", href: "#faq" },
  { label: "Contatti", href: "#contatti" }
];

export const AUDIENCES = ["Adulti", "Neonati e bambini", "Gravidanza", "Sportivi"];

export const LOCATIONS: Location[] = [
  {
    id: "panorama-salute",
    name: "Panorama Salute",
    street: "Via Belmonte, 169",
    postalCode: "21100",
    locality: "Varese",
    mapsUrl: mapsSearch("Via Belmonte 169, 21100 Varese VA")
  },
  {
    id: "synergy-fisio",
    name: "Studio Synergy Fisio",
    street: "Via Vespucci, 19",
    area: "Calcinate del Pesce",
    postalCode: "21100",
    locality: "Varese",
    mapsUrl: mapsSearch("Via Vespucci 19, Calcinate del Pesce, 21100 Varese VA")
  }
];

export const formatAddress = (loc: Location) =>
  `${loc.street}${loc.area ? `, ${loc.area}` : ""} · ${loc.postalCode} ${loc.locality} (VA)`;

export const HOURS = [
  { days: "Lunedì – Venerdì", time: "09:00 – 13:00 · 14:00 – 19:00" },
  { days: "Sabato", time: "09:00 – 13:00" }
];

export const SERVICES: Service[] = [
  {
    title: "Dolori muscolo-scheletrici",
    icon: "bone",
    points: [
      "Lombalgia, cervicalgia e dorsalgia",
      "Tensioni muscolari ricorrenti",
      "Dolori articolari (spalla, ginocchio, anca, polso, caviglia)",
      "Rigidità o limitazioni di movimento dopo traumi o interventi"
    ]
  },
  {
    title: "Disturbi temporo-mandibolari (ATM)",
    icon: "smile",
    points: ["Dolore o click alla mandibola", "Bruxismo"]
  },
  {
    title: "Cefalee e disturbi correlati",
    icon: "brain",
    points: ["Cefalee muscolo-tensive ed emicranie di origine cervicale"]
  },
  {
    title: "Disturbi viscerali",
    icon: "stethoscope",
    points: [
      "Reflusso gastroesofageo, stipsi",
      "Tensioni diaframmatiche o toraciche che influenzano la respirazione",
      "Disagi legati al ciclo mestruale"
    ]
  },
  {
    title: "Gravidanza e post-parto",
    icon: "heart",
    points: [
      "Dolori lombari, pelvici o pubici durante la gravidanza",
      "Preparazione del corpo al parto",
      "Recupero post-parto: postura, cicatrici, diastasi addominale"
    ]
  },
  {
    title: "Ambito pediatrico",
    icon: "baby",
    points: [
      "Rigurgiti, coliche, stipsi",
      "Difficoltà nella suzione",
      "Preferenza di rotazione del capo da un lato, torcicollo miogeno, plagiocefalia",
      "Supporto alla crescita",
      "Disturbi legati a tensioni post-parto"
    ]
  },
  {
    title: "Ambito sportivo",
    icon: "dumbbell",
    points: [
      "Recupero da traumi o sovraccarichi (tendiniti, stiramenti, contratture)",
      "Ottimizzazione della performance e prevenzione degli infortuni",
      "Miglioramento della mobilità articolare e del gesto atletico",
      "Gestione del dolore muscolare o articolare legato all'attività sportiva"
    ]
  },
  {
    title: "Controllo posturale",
    icon: "posture",
    points: ["Prevenzione e mantenimento di un buon equilibrio corporeo"]
  }
];

export const ABOUT = {
  intro:
    "Credo in un approccio globale, fondato sull'ascolto, sul dialogo e sulla collaborazione tra professionisti.",
  closing:
    "Ogni trattamento è personalizzato, frutto di un'attenta valutazione posturale e di un percorso di follow-up mirato a mantenere nel tempo i risultati raggiunti."
};

export const TRAINING: TrainingStep[] = [
  {
    when: "Formazione",
    text: "Bachelor in Osteopathic Science e Master in Osteopathic Medicine presso l'Accademia Italiana di Medicina Osteopatica (AIMO) di Saronno, in collaborazione con la Health Sciences University di Londra: titoli riconosciuti a livello internazionale."
  },
  {
    when: "Tirocinio",
    text: "Oltre 1000 ore di tirocinio clinico con pazienti dall'età neonatale all'età adulta, compreso il supporto agli atleti del Trofeo Master Rari Nantes – Saronno."
  },
  { when: "Corso", text: "Formazione breve in Clinica gnatologica e osteopatia." },
  { when: "Da febbraio 2025", text: "Specializzazione in ambito neonatale-pediatrico." },
  { when: "Da ottobre 2025", text: "Specializzazione in craniodonzia." },
  {
    when: "AIMO",
    text: "Assistente e tutor in formazione, a supporto degli studenti durante le lezioni e la pratica clinica."
  },
  {
    when: "Sport",
    text: "Insegnante di nuoto e nuoto sincronizzato: un punto d'incontro tra sport e osteopatia."
  }
];

// Bozze da far confermare a Chiara prima della pubblicazione.
export const FAQ: FaqItem[] = [
  {
    question: "Serve la prescrizione medica?",
    answer:
      "No, per una visita osteopatica non serve la prescrizione del medico. Se hai esami, referti o indicazioni del tuo medico, portali con te: mi aiutano a inquadrare meglio la situazione."
  },
  {
    question: "Quanto dura una seduta?",
    answer:
      "La prima visita dura circa un'ora e comprende colloquio, valutazione e trattamento. Le sedute successive sono un po' più brevi."
  },
  {
    question: "Cosa devo portare alla prima visita?",
    answer:
      "Eventuali esami, referti o radiografie recenti e un abbigliamento comodo. Per neonati e bambini è utile il libretto pediatrico."
  },
  {
    question: "Tratti anche neonati e bambini?",
    answer:
      "Sì. Mi occupo di osteopatia neonatale e pediatrica, ambito in cui mi sto specializzando dal 2025: rigurgiti, coliche, difficoltà nella suzione, plagiocefalia e supporto alla crescita."
  }
];
```

`src/lib/links.ts`:

```ts
import { CONTACT } from "../data/site";

export const telHref = (phone: string = CONTACT.phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const whatsappHref = (phone: string = CONTACT.phone, message: string = CONTACT.whatsappMessage) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
```

- [ ] **Step 6: Stili globali**

`src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-petrol: #275360;
  --color-petrol-dark: #1c3e48;
  --color-petrol-soft: #e7eff1;
  --color-sage: #abc19f;
  --color-sage-deep: #6e7457;
  --color-sage-soft: #f1f4ec;
  --color-cream: #fbfaf7;
  --color-ink: #1f2a37;
  --color-muted: #52606d;
  --color-line: rgb(31 42 55 / 0.1);
  --shadow-soft: 0 24px 48px -28px rgb(31 42 55 / 0.35);
}

@theme inline {
  --font-heading: var(--font-cormorant);
  --font-sans: var(--font-figtree);
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5.5rem;
  }

  body {
    @apply bg-cream font-sans text-ink antialiased;
    line-height: 1.65;
  }

  h1,
  h2,
  h3 {
    @apply font-heading text-ink;
  }

  ::selection {
    background: var(--color-sage);
  }

  :focus-visible {
    outline: 3px solid var(--color-petrol);
    outline-offset: 3px;
  }
}

@layer components {
  .container-page {
    @apply mx-auto w-full max-w-6xl px-5 md:px-8;
  }

  .eyebrow {
    @apply text-xs font-semibold tracking-[0.22em] text-sage-deep uppercase;
  }

  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition duration-200;
  }

  .btn-primary {
    @apply bg-petrol text-white shadow-soft hover:bg-petrol-dark;
  }

  .btn-outline {
    @apply border border-petrol/30 text-petrol hover:border-petrol hover:bg-petrol-soft;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 7: Layout e pagina provvisoria**

`src/layouts/Base.astro`:

```astro
---
import { Font } from "astro:assets";
import "../styles/global.css";
import { SITE } from "../data/site";
---

<!doctype html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{SITE.title}</title>
    <meta name="description" content={SITE.description} />
    <link rel="canonical" href={SITE.url} />
    <meta name="robots" content="index,follow" />
    <meta name="author" content="Chiara Benini" />
    <meta name="theme-color" content="#275360" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="it_IT" />
    <meta property="og:site_name" content="Chiara Benini Osteopata" />
    <meta property="og:title" content={SITE.title} />
    <meta property="og:description" content={SITE.description} />
    <meta property="og:url" content={SITE.url} />
    <meta property="og:image" content={SITE.ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <Font cssVariable="--font-cormorant" preload={[{ weight: "600", style: "normal" }]} />
    <Font cssVariable="--font-figtree" preload={[{ weight: "400" }]} />
    <script
      is:inline
      src="https://embeds.iubenda.com/widgets/9aa397b6-9715-436e-8dad-43316562ee44.js"></script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/pages/index.astro` (provvisorio, l'H1 passa a `Hero.astro` nel Task 4):

```astro
---
import Base from "../layouts/Base.astro";
---

<Base>
  <main>
    <h1>Chiara Benini, Osteopata a Varese</h1>
  </main>
</Base>
```

- [ ] **Step 8: Eseguire build e test**

Run: `npm test`
Expected: build OK, tutti i 7 test di `head.test.mjs` PASS.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Migra il progetto da Vite/React ad Astro con layout SEO"
```

---

### Task 2: Immagini (foto, logo, anteprima social, icona)

**Files:**
- Move: `public/images/doctor-paceholder-v4.jpg` → `src/assets/chiara-benini-osteopata.jpg`; `public/images/doctor-paceholder-v3.jpg` → `src/assets/chiara-benini-ritratto.jpg`; `public/logo.png` → `src/assets/logo.png`
- Create: `scripts/make-images.mjs`, `public/og-image.jpg` (generato), `public/apple-touch-icon.png` (generato), `tests/assets.test.mjs`

**Interfaces:**
- Produces: `src/assets/chiara-benini-osteopata.jpg`, `src/assets/chiara-benini-ritratto.jpg`, `src/assets/logo.png` (usati da Header, Hero, About, Footer); `/og-image.jpg` e `/apple-touch-icon.png` (referenziati da `Base.astro`).

- [ ] **Step 1: Scrivere i test (devono fallire)**

`tests/assets.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { DIST, listFiles } from "./helpers.mjs";

test("immagine social 1200x630", async () => {
  const meta = await sharp(join(DIST, "og-image.jpg")).metadata();
  assert.equal(meta.width, 1200);
  assert.equal(meta.height, 630);
});

test("apple-touch-icon 180x180", async () => {
  const file = join(DIST, "apple-touch-icon.png");
  assert.ok(existsSync(file));
  const meta = await sharp(file).metadata();
  assert.equal(meta.width, 180);
});

test("nessuna immagine pesante in dist", () => {
  const heavy = listFiles().filter((f) => /\.(jpe?g|png|webp|avif)$/.test(f) && statSync(f).size > 400_000);
  assert.deepEqual(heavy, []);
});
```

Run: `npm test`
Expected: FAIL su `og-image.jpg` mancante e su `images/doctor-paceholder-v4.jpg` / `logo.png` troppo pesanti.

- [ ] **Step 2: Spostare le immagini sorgente**

```bash
mkdir -p src/assets
git mv public/images/doctor-paceholder-v4.jpg src/assets/chiara-benini-osteopata.jpg
git mv public/images/doctor-paceholder-v3.jpg src/assets/chiara-benini-ritratto.jpg
git mv public/logo.png src/assets/logo.png
```

- [ ] **Step 3: Script per immagine social e icona**

`scripts/make-images.mjs`:

```js
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const fromRoot = (path) => fileURLToPath(new URL(`../${path}`, import.meta.url));

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO_WIDTH = 520;
const LOGO_SIZE = 360;

const photo = await sharp(fromRoot("src/assets/chiara-benini-osteopata.jpg"))
  .rotate()
  .resize({ width: PHOTO_WIDTH, height: HEIGHT, fit: "cover", position: "top" })
  .toBuffer();

const logo = await sharp(fromRoot("src/assets/logo.png")).resize(LOGO_SIZE, LOGO_SIZE).toBuffer();

await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: "#fbfaf7" } })
  .composite([
    {
      input: logo,
      left: Math.round((WIDTH - PHOTO_WIDTH - LOGO_SIZE) / 2),
      top: Math.round((HEIGHT - LOGO_SIZE) / 2)
    },
    { input: photo, left: WIDTH - PHOTO_WIDTH, top: 0 }
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(fromRoot("public/og-image.jpg"));

await sharp(fromRoot("src/assets/logo.png"))
  .resize(180, 180)
  .flatten({ background: "#ffffff" })
  .png()
  .toFile(fromRoot("public/apple-touch-icon.png"));

console.log("Create public/og-image.jpg e public/apple-touch-icon.png");
```

Run: `npm run images`
Expected: `Create public/og-image.jpg e public/apple-touch-icon.png`. Aprire `public/og-image.jpg` e controllare che si vedano logo a sinistra e foto (viso incluso) a destra.

- [ ] **Step 4: Eseguire build e test**

Run: `npm test`
Expected: tutti i test PASS (head + assets).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Sposta foto e logo in src/assets e genera immagine social e icona"
```

---

### Task 3: Header, menu mobile, footer e barra contatti mobile

**Files:**
- Create: `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/MobileContactBar.astro`, `tests/layout.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `NAV_LINKS`, `SITE` da `src/data/site.ts`; `telHref()`, `whatsappHref()` da `src/lib/links.ts`; `src/assets/logo.png`.
- Produces: componenti `Header`, `Footer`, `MobileContactBar` senza props.

- [ ] **Step 1: Scrivere i test (devono fallire)**

`tests/layout.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { html } from "./helpers.mjs";

test("navigazione verso tutte le sezioni", () => {
  for (const id of ["trattamenti", "chi-sono", "faq", "contatti"]) {
    assert.match(html, new RegExp(`href="#${id}"`), id);
  }
});

test("link telefono e WhatsApp corretti", () => {
  assert.match(html, /href="tel:\+393515525149"/);
  assert.match(html, /href="https:\/\/wa\.me\/393515525149\?text=Ciao!%20Vorrei%20prenotare/);
});

test("menu mobile accessibile", () => {
  assert.match(html, /aria-controls="mobile-nav"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /id="mobile-nav"/);
});

test("privacy e cookie policy iubenda nel footer", () => {
  assert.ok(html.includes('href="https://www.iubenda.com/privacy-policy/93759785"'));
  assert.ok(html.includes('href="https://www.iubenda.com/privacy-policy/93759785/cookie-policy"'));
  assert.ok(html.includes("https://cdn.iubenda.com/iubenda.js"));
});

test("barra contatti fissa su mobile", () => {
  assert.match(html, /data-mobile-contact-bar/);
});
```

Run: `npm test`
Expected: FAIL nei 5 test di `layout.test.mjs`.

- [ ] **Step 2: Header con menu mobile**

`src/components/Header.astro`:

```astro
---
import { Image } from "astro:assets";
import { Menu, X } from "@lucide/astro";
import logo from "../assets/logo.png";
import { NAV_LINKS } from "../data/site";
---

<header class="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
  <div class="container-page flex h-18 items-center justify-between gap-4">
    <a href="#inizio" class="flex items-center gap-3" aria-label="Chiara Benini, osteopata: torna all'inizio">
      <Image src={logo} alt="" width={48} height={48} loading="eager" class="h-12 w-12" />
      <span class="leading-tight">
        <span class="block font-heading text-xl font-semibold text-ink">Chiara Benini</span>
        <span class="block text-[0.7rem] font-semibold tracking-[0.22em] text-sage-deep uppercase">Osteopata</span>
      </span>
    </a>

    <nav aria-label="Navigazione principale" class="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
      {NAV_LINKS.map((link) => <a href={link.href} class="transition-colors hover:text-petrol">{link.label}</a>)}
      <a href="#contatti" class="btn btn-primary px-5 py-2 text-sm">Prenota</a>
    </nav>

    <button
      type="button"
      class="rounded-full border border-line p-2 text-ink md:hidden"
      aria-controls="mobile-nav"
      aria-expanded="false"
      aria-label="Apri il menu"
      data-menu-toggle
    >
      <span data-icon-open><Menu class="h-6 w-6" /></span>
      <span data-icon-close class="hidden"><X class="h-6 w-6" /></span>
    </button>
  </div>

  <nav id="mobile-nav" aria-label="Navigazione mobile" class="hidden border-t border-line bg-cream md:hidden" data-menu>
    <ul class="container-page py-2 text-lg">
      {
        NAV_LINKS.map((link) => (
          <li class="border-b border-line last:border-0">
            <a href={link.href} class="block py-4" data-menu-link>
              {link.label}
            </a>
          </li>
        ))
      }
    </ul>
  </nav>
</header>

<script>
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-menu]");

  if (toggle && menu) {
    const setOpen = (open: boolean) => {
      menu.classList.toggle("hidden", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
      toggle.querySelector("[data-icon-open]")?.classList.toggle("hidden", open);
      toggle.querySelector("[data-icon-close]")?.classList.toggle("hidden", !open);
    };

    toggle.addEventListener("click", () => setOpen(menu.classList.contains("hidden")));
    menu.querySelectorAll("[data-menu-link]").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }
</script>
```

- [ ] **Step 3: Footer**

`src/components/Footer.astro`:

```astro
---
import { Image } from "astro:assets";
import logo from "../assets/logo.png";
import { NAV_LINKS, SITE } from "../data/site";

const year = new Date().getFullYear();
---

<footer class="bg-ink pt-14 pb-32 text-sm text-white/70 md:pb-14">
  <div class="container-page space-y-10">
    <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
      <div class="flex items-start gap-4">
        <span class="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-white">
          <Image src={logo} alt="" width={44} height={44} class="h-11 w-11" />
        </span>
        <div class="space-y-1">
          <p class="font-heading text-2xl font-semibold text-white">Chiara Benini</p>
          <p>Osteopata a Varese</p>
          <p class="max-w-xs pt-2">{SITE.tagline}</p>
        </div>
      </div>
      <nav aria-label="Navigazione nel footer">
        <ul class="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => <li><a href={link.href} class="hover:text-white">{link.label}</a></li>)}
        </ul>
      </nav>
    </div>

    <div class="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs sm:flex-row sm:justify-between">
      <p>© {year} Chiara Benini Osteopata · Tutti i diritti riservati.</p>
      <div class="flex gap-5">
        <a
          href="https://www.iubenda.com/privacy-policy/93759785"
          class="iubenda-white iubenda-noiframe iubenda-embed hover:text-white"
          title="Privacy Policy">Privacy Policy</a
        >
        <a
          href="https://www.iubenda.com/privacy-policy/93759785/cookie-policy"
          class="iubenda-white iubenda-noiframe iubenda-embed hover:text-white"
          title="Cookie Policy">Cookie Policy</a
        >
      </div>
    </div>
  </div>
  <script is:inline src="https://cdn.iubenda.com/iubenda.js" async></script>
</footer>
```

- [ ] **Step 4: Barra contatti mobile**

`src/components/MobileContactBar.astro`:

```astro
---
import { MessageCircle, Phone } from "@lucide/astro";
import { telHref, whatsappHref } from "../lib/links";
---

<div
  class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
  data-mobile-contact-bar
>
  <div class="grid grid-cols-2 gap-3">
    <a href={telHref()} class="btn btn-outline bg-white py-3"><Phone class="h-5 w-5" /> Chiama</a>
    <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" class="btn btn-primary py-3">
      <MessageCircle class="h-5 w-5" /> WhatsApp
    </a>
  </div>
</div>
```

- [ ] **Step 5: Montarli nella pagina**

`src/pages/index.astro`:

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import MobileContactBar from "../components/MobileContactBar.astro";
---

<Base>
  <Header />
  <main>
    <h1>Chiara Benini, Osteopata a Varese</h1>
  </main>
  <Footer />
  <MobileContactBar />
</Base>
```

- [ ] **Step 6: Eseguire build e test**

Run: `npm test`
Expected: tutti i test PASS. Se la build segnala un'icona inesistente in `@lucide/astro`, cercare il nome corretto con `ls node_modules/@lucide/astro/dist` e correggere l'import.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Aggiungi header con menu mobile, footer e barra contatti mobile"
```

---

### Task 4: Hero e sezione "Cosa tratto"

**Files:**
- Create: `src/components/SectionHeading.astro`, `src/components/Hero.astro`, `src/components/Services.astro`, `tests/sections.test.mjs`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `SITE`, `CONTACT`, `AUDIENCES`, `SERVICES`, `ServiceIcon` da `src/data/site.ts`; `telHref()`, `whatsappHref()`; `src/assets/chiara-benini-osteopata.jpg`.
- Produces: `SectionHeading` con props `{ id: string; eyebrow: string; title: string; intro?: string }` (usato da About, Faq, Contact).

- [ ] **Step 1: Scrivere i test (devono fallire)**

`tests/sections.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { html, pageText } from "./helpers.mjs";

test("hero con foto prioritaria in AVIF/WebP", () => {
  assert.match(html, /id="inizio"/);
  assert.match(html, /<picture>[\s\S]*?image\/avif[\s\S]*?fetchpriority="high"/);
});

test("le 8 aree di trattamento", () => {
  assert.match(html, /id="trattamenti"/);
  for (const title of [
    "Dolori muscolo-scheletrici",
    "Disturbi temporo-mandibolari (ATM)",
    "Cefalee e disturbi correlati",
    "Disturbi viscerali",
    "Gravidanza e post-parto",
    "Ambito pediatrico",
    "Ambito sportivo",
    "Controllo posturale"
  ]) {
    assert.ok(pageText.includes(title), title);
  }
});

test("tutte le immagini hanno alt", () => {
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(tag, /\salt(="|[\s>])/, tag);
  }
});
```

Run: `npm test`
Expected: FAIL su `id="inizio"`, `<picture>` e aree di trattamento.

- [ ] **Step 2: Intestazione di sezione riutilizzabile**

`src/components/SectionHeading.astro`:

```astro
---
interface Props {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
}

const { id, eyebrow, title, intro } = Astro.props;
---

<header class="max-w-2xl space-y-4">
  <p class="eyebrow">{eyebrow}</p>
  <h2 id={id} class="text-4xl leading-tight font-semibold sm:text-5xl">{title}</h2>
  {intro && <p class="text-lg text-muted">{intro}</p>}
</header>
```

- [ ] **Step 3: Hero**

`src/components/Hero.astro`:

```astro
---
import { Picture } from "astro:assets";
import { MessageCircle, Phone } from "@lucide/astro";
import heroPhoto from "../assets/chiara-benini-osteopata.jpg";
import { AUDIENCES, CONTACT, SITE } from "../data/site";
import { telHref, whatsappHref } from "../lib/links";
---

<section id="inizio" aria-labelledby="hero-title" class="relative overflow-hidden">
  <div
    aria-hidden="true"
    class="pointer-events-none absolute -top-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-sage/25 blur-3xl"
  >
  </div>
  <div class="container-page relative grid items-center gap-12 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-24">
    <div class="space-y-7">
      <p class="eyebrow">{SITE.motto}</p>
      <h1 id="hero-title" class="text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
        Chiara Benini, <span class="block text-petrol italic">Osteopata a Varese</span>
      </h1>
      <p class="max-w-xl text-lg text-muted">{SITE.tagline}</p>
      <ul class="flex flex-wrap gap-2" aria-label="A chi mi rivolgo">
        {
          AUDIENCES.map((audience) => (
            <li class="rounded-full border border-sage/60 bg-sage-soft px-4 py-1.5 text-sm font-medium text-sage-deep">
              {audience}
            </li>
          ))
        }
      </ul>
      <div class="flex flex-col gap-3 sm:flex-row">
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <MessageCircle class="h-5 w-5" /> Scrivimi su WhatsApp
        </a>
        <a href={telHref()} class="btn btn-outline"><Phone class="h-5 w-5" /> {CONTACT.phone}</a>
      </div>
    </div>

    <div class="relative mx-auto w-full max-w-md">
      <div aria-hidden="true" class="absolute -inset-3 translate-x-4 translate-y-4 rounded-[2.5rem] bg-sage/40"></div>
      <Picture
        src={heroPhoto}
        formats={["avif", "webp"]}
        width={960}
        widths={[360, 540, 720, 960]}
        sizes="(min-width: 768px) 28rem, 90vw"
        alt="Chiara Benini, osteopata a Varese, in divisa da studio"
        loading="eager"
        fetchpriority="high"
        class="relative aspect-[4/5] w-full rounded-[2rem] object-cover object-top shadow-soft"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 4: Cosa tratto**

`src/components/Services.astro`:

```astro
---
import { Baby, Bone, Brain, Dumbbell, HeartPulse, Smile, Stethoscope, StretchHorizontal } from "@lucide/astro";
import SectionHeading from "./SectionHeading.astro";
import { SERVICES, type ServiceIcon } from "../data/site";

const ICONS = {
  bone: Bone,
  smile: Smile,
  brain: Brain,
  stethoscope: Stethoscope,
  heart: HeartPulse,
  baby: Baby,
  dumbbell: Dumbbell,
  posture: StretchHorizontal
} satisfies Record<ServiceIcon, unknown>;
---

<section id="trattamenti" aria-labelledby="trattamenti-title" class="bg-white py-20 md:py-28">
  <div class="container-page space-y-14">
    <SectionHeading
      id="trattamenti-title"
      eyebrow="Cosa tratto"
      title="Trattamenti personalizzati per te e per il tuo bambino"
      intro="Ogni trattamento parte da un ascolto attento e da una valutazione personalizzata approfondita. L'obiettivo è favorire un buon equilibrio del corpo."
    />
    <ul class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {
        SERVICES.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <li class="flex flex-col gap-4 rounded-3xl border border-line bg-cream p-6 transition duration-200 hover:-translate-y-1 hover:shadow-soft">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-petrol-soft text-petrol">
                <Icon class="h-5 w-5" />
              </span>
              <h3 class="text-2xl leading-snug font-semibold">{service.title}</h3>
              <ul class="space-y-2 text-sm text-muted">
                {service.points.map((point) => (
                  <li class="flex gap-2">
                    <span aria-hidden="true" class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-sage" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })
      }
    </ul>
  </div>
</section>
```

- [ ] **Step 5: Montarli nella pagina (l'H1 provvisorio sparisce)**

`src/pages/index.astro`:

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import Services from "../components/Services.astro";
import Footer from "../components/Footer.astro";
import MobileContactBar from "../components/MobileContactBar.astro";
---

<Base>
  <Header />
  <main>
    <Hero />
    <Services />
  </main>
  <Footer />
  <MobileContactBar />
</Base>
```

- [ ] **Step 6: Eseguire build e test**

Run: `npm test`
Expected: tutti i test PASS (incluso "un solo h1" di `head.test.mjs`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Aggiungi hero e sezione trattamenti"
```

---

### Task 5: "Chi sono" e domande frequenti

**Files:**
- Create: `src/components/About.astro`, `src/components/Faq.astro`
- Modify: `tests/sections.test.mjs` (aggiunta in fondo), `src/pages/index.astro`

**Interfaces:**
- Consumes: `ABOUT`, `TRAINING`, `FAQ` da `src/data/site.ts`; `SectionHeading`; `src/assets/chiara-benini-ritratto.jpg`.

- [ ] **Step 1: Aggiungere i test (devono fallire)**

In fondo a `tests/sections.test.mjs`:

```js
test("chi sono con il percorso di formazione", () => {
  assert.match(html, /id="chi-sono"/);
  for (const text of [
    "Mi chiamo Chiara Benini",
    "Health Sciences University di Londra",
    "1000 ore di tirocinio",
    "neonatale-pediatrico",
    "craniodonzia",
    "nuoto sincronizzato"
  ]) {
    assert.ok(pageText.includes(text), text);
  }
});

test("FAQ con 4 domande a fisarmonica", () => {
  assert.match(html, /id="faq"/);
  assert.equal([...html.matchAll(/<details\b/g)].length, 4);
  assert.ok(pageText.includes("Serve la prescrizione medica?"));
});
```

Run: `npm test`
Expected: FAIL nei 2 nuovi test.

- [ ] **Step 2: Chi sono**

`src/components/About.astro`:

```astro
---
import { Picture } from "astro:assets";
import portrait from "../assets/chiara-benini-ritratto.jpg";
import SectionHeading from "./SectionHeading.astro";
import { ABOUT, TRAINING } from "../data/site";
---

<section id="chi-sono" aria-labelledby="chi-sono-title" class="py-20 md:py-28">
  <div class="container-page grid items-start gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
    <div class="relative mx-auto w-full max-w-sm md:sticky md:top-28">
      <div aria-hidden="true" class="absolute -inset-3 -translate-x-4 translate-y-4 rounded-[2.5rem] bg-petrol-soft"></div>
      <Picture
        src={portrait}
        formats={["avif", "webp"]}
        width={800}
        widths={[320, 480, 640, 800]}
        sizes="(min-width: 768px) 24rem, 85vw"
        alt="Ritratto di Chiara Benini, osteopata"
        class="relative aspect-[4/5] w-full rounded-[2rem] object-cover object-top shadow-soft"
      />
    </div>

    <div class="space-y-10">
      <SectionHeading id="chi-sono-title" eyebrow="Chi sono" title="Mi chiamo Chiara Benini" intro={ABOUT.intro} />

      <div>
        <h3 class="mb-6 text-2xl font-semibold">Formazione e percorso</h3>
        <ol class="space-y-6 border-l border-sage pl-6">
          {
            TRAINING.map((step) => (
              <li class="relative">
                <span
                  aria-hidden="true"
                  class="absolute top-1.5 -left-[1.95rem] h-3 w-3 rounded-full border-2 border-cream bg-petrol"
                />
                <p class="text-xs font-semibold tracking-[0.18em] text-sage-deep uppercase">{step.when}</p>
                <p class="mt-1 text-ink">{step.text}</p>
              </li>
            ))
          }
        </ol>
      </div>

      <blockquote class="rounded-3xl bg-sage-soft p-7 font-heading text-2xl leading-snug text-ink italic">
        {ABOUT.closing}
      </blockquote>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Domande frequenti**

`src/components/Faq.astro`:

```astro
---
import { ChevronDown } from "@lucide/astro";
import SectionHeading from "./SectionHeading.astro";
import { FAQ } from "../data/site";
---

<section id="faq" aria-labelledby="faq-title" class="bg-white py-20 md:py-28">
  <div class="container-page grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
    <SectionHeading id="faq-title" eyebrow="Domande frequenti" title="Prima della visita" />
    <div class="divide-y divide-line border-y border-line">
      {
        FAQ.map((item) => (
          <details class="group py-5">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown class="h-5 w-5 flex-none text-petrol transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <p class="mt-3 max-w-prose text-muted">{item.answer}</p>
          </details>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 4: Montarli nella pagina**

In `src/pages/index.astro` aggiungere gli import e le sezioni dopo `<Services />`:

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import Services from "../components/Services.astro";
import About from "../components/About.astro";
import Faq from "../components/Faq.astro";
import Footer from "../components/Footer.astro";
import MobileContactBar from "../components/MobileContactBar.astro";
---

<Base>
  <Header />
  <main>
    <Hero />
    <Services />
    <About />
    <Faq />
  </main>
  <Footer />
  <MobileContactBar />
</Base>
```

- [ ] **Step 5: Eseguire build e test**

Run: `npm test`
Expected: tutti i test PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Aggiungi sezioni chi sono e domande frequenti"
```

---

### Task 6: Contatti, sedi e dati strutturati

**Files:**
- Create: `src/components/Contact.astro`, `src/lib/jsonld.ts`, `tests/contact.test.mjs`
- Modify: `src/layouts/Base.astro`, `src/pages/index.astro`

**Interfaces:**
- Consumes: `CONTACT`, `HOURS`, `LOCATIONS`, `formatAddress`, `SITE`, `Location` da `src/data/site.ts`; `telHref()`, `whatsappHref()`; `SectionHeading`.
- Produces: `buildJsonLd(): Record<string, unknown>` da `src/lib/jsonld.ts`.

- [ ] **Step 1: Scrivere i test (devono fallire)**

`tests/contact.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { html, jsonLd, pageText } from "./helpers.mjs";

test("due sedi con indirizzo e link alle indicazioni", () => {
  assert.match(html, /id="contatti"/);
  for (const text of ["Panorama Salute", "Via Belmonte, 169", "Studio Synergy Fisio", "Via Vespucci, 19, Calcinate del Pesce"]) {
    assert.ok(pageText.includes(text), text);
  }
  const mapLinks = [...html.matchAll(/href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&(amp;)?query=/g)];
  assert.equal(mapLinks.length, 2);
});

test("email e orari", () => {
  assert.match(html, /href="mailto:chiarabenini\.osteopata@gmail\.com"/);
  assert.ok(pageText.includes("09:00 – 13:00 · 14:00 – 19:00"));
});

test("nessuna mappa incorporata", () => {
  assert.doesNotMatch(html, /<iframe/);
});

test("dati strutturati: persona e due sedi", () => {
  const data = jsonLd();
  const graph = data["@graph"];
  const person = graph.find((node) => node["@type"] === "Person");
  assert.equal(person.name, "Chiara Benini");
  assert.equal(person.jobTitle, "Osteopata");
  const places = graph.filter((node) => node["@type"] === "MedicalBusiness");
  assert.deepEqual(
    places.map((place) => place.address.streetAddress),
    ["Via Belmonte, 169", "Via Vespucci, 19, Calcinate del Pesce"]
  );
  assert.equal(person.worksFor.length, 2);
  assert.doesNotMatch(JSON.stringify(data), /:""/);
});
```

Run: `npm test`
Expected: FAIL nei 4 test (sezione e JSON-LD mancanti).

- [ ] **Step 2: Dati strutturati**

`src/lib/jsonld.ts`:

```ts
import { CONTACT, LOCATIONS, SITE } from "../data/site";

export const buildJsonLd = () => {
  const businesses = LOCATIONS.map((loc) => ({
    "@type": "MedicalBusiness",
    "@id": `${SITE.url}#${loc.id}`,
    name: `Chiara Benini Osteopata – ${loc.name}`,
    url: SITE.url,
    image: SITE.ogImage,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    hasMap: loc.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.area ? `${loc.street}, ${loc.area}` : loc.street,
      addressLocality: loc.locality,
      postalCode: loc.postalCode,
      addressRegion: "VA",
      addressCountry: "IT"
    }
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}#website`,
        url: SITE.url,
        name: "Chiara Benini Osteopata",
        inLanguage: "it-IT"
      },
      {
        "@type": "Person",
        "@id": `${SITE.url}#chiara-benini`,
        name: "Chiara Benini",
        jobTitle: "Osteopata",
        url: SITE.url,
        image: SITE.ogImage,
        telephone: CONTACT.phone,
        email: CONTACT.email,
        alumniOf: {
          "@type": "EducationalOrganization",
          name: "Accademia Italiana di Medicina Osteopatica (AIMO)"
        },
        knowsAbout: [
          "Osteopatia",
          "Osteopatia pediatrica",
          "Osteopatia in gravidanza",
          "Osteopatia sportiva",
          "Disturbi temporo-mandibolari"
        ],
        worksFor: businesses.map((business) => ({ "@id": business["@id"] }))
      },
      ...businesses
    ]
  };
};
```

In `src/layouts/Base.astro` aggiungere l'import nel frontmatter e lo script prima del widget iubenda:

```astro
---
import { Font } from "astro:assets";
import "../styles/global.css";
import { SITE } from "../data/site";
import { buildJsonLd } from "../lib/jsonld";

const jsonLd = JSON.stringify(buildJsonLd());
---
```

```astro
    <script is:inline type="application/ld+json" set:html={jsonLd} />
```

- [ ] **Step 3: Sezione contatti**

`src/components/Contact.astro`:

```astro
---
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "@lucide/astro";
import SectionHeading from "./SectionHeading.astro";
import { CONTACT, HOURS, LOCATIONS, formatAddress } from "../data/site";
import { telHref, whatsappHref } from "../lib/links";
---

<section id="contatti" aria-labelledby="contatti-title" class="py-20 md:py-28">
  <div class="container-page space-y-14">
    <SectionHeading
      id="contatti-title"
      eyebrow="Prenota una visita"
      title="Dove ricevo"
      intro="Contattami per informazioni o per fissare il tuo prossimo appuntamento. Ricevo a Varese, in due studi."
    />

    <div class="grid gap-6 lg:grid-cols-3">
      {
        LOCATIONS.map((loc) => (
          <article class="flex flex-col justify-between gap-8 rounded-3xl border border-line bg-white p-7 shadow-soft">
            <div class="space-y-3">
              <span class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-petrol-soft text-petrol">
                <MapPin class="h-5 w-5" />
              </span>
              <h3 class="text-3xl font-semibold">{loc.name}</h3>
              <p class="text-muted">{formatAddress(loc)}</p>
            </div>
            <a href={loc.mapsUrl} target="_blank" rel="noopener noreferrer" class="btn btn-outline self-start">
              <Navigation class="h-4 w-4" /> Indicazioni
            </a>
          </article>
        ))
      }

      <aside aria-label="Contatti e orari" class="flex flex-col gap-6 rounded-3xl bg-petrol p-7 text-white">
        <ul class="space-y-4">
          <li>
            <a href={telHref()} class="flex items-center gap-3 hover:underline">
              <Phone class="h-5 w-5 flex-none" />
              {CONTACT.phone}
            </a>
          </li>
          <li>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 hover:underline">
              <MessageCircle class="h-5 w-5 flex-none" /> Scrivimi su WhatsApp
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT.email}`} class="flex items-center gap-3 break-all hover:underline">
              <Mail class="h-5 w-5 flex-none" />
              {CONTACT.email}
            </a>
          </li>
        </ul>
        <div class="border-t border-white/20 pt-5">
          <p class="mb-3 flex items-center gap-3 font-semibold"><Clock class="h-5 w-5" /> Orari</p>
          <dl class="space-y-3 text-sm text-white/85">
            {
              HOURS.map((slot) => (
                <div>
                  <dt class="font-semibold text-white">{slot.days}</dt>
                  <dd>{slot.time}</dd>
                </div>
              ))
            }
          </dl>
        </div>
      </aside>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Montarla nella pagina**

`src/pages/index.astro` (versione finale):

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import Services from "../components/Services.astro";
import About from "../components/About.astro";
import Faq from "../components/Faq.astro";
import Contact from "../components/Contact.astro";
import Footer from "../components/Footer.astro";
import MobileContactBar from "../components/MobileContactBar.astro";
---

<Base>
  <Header />
  <main>
    <Hero />
    <Services />
    <About />
    <Faq />
    <Contact />
  </main>
  <Footer />
  <MobileContactBar />
</Base>
```

- [ ] **Step 5: Eseguire build e test**

Run: `npm test`
Expected: tutti i test PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Aggiungi sezione contatti con le due sedi e dati strutturati"
```

---

### Task 7: Deploy, sitemap e verifica finale

**Files:**
- Modify: `.github/workflows/deploy.yml`, `public/sitemap.xml`, `README.md`

- [ ] **Step 1: Workflow su Node 22 con test**

In `.github/workflows/deploy.yml` sostituire i passi Node/install/build con:

```yaml
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build and test
        run: npm test
```

(Il passo `peaceiris/actions-gh-pages@v4` con `publish_dir: ./dist` resta invariato.)

- [ ] **Step 2: Sitemap con data aggiornata**

`public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://chiarabeniniosteopata.it/</loc>
    <lastmod>2026-10-06</lastmod>
  </url>
</urlset>
```

- [ ] **Step 3: README**

`README.md`:

```markdown
# Sito vetrina — Chiara Benini Osteopata

Sito statico in [Astro](https://astro.build), pubblicato su GitHub Pages a ogni push su `main`.

- Contenuti (sedi, orari, servizi, formazione, FAQ): `src/data/site.ts`
- Sezioni della pagina: `src/components/`
- Foto: `src/assets/` (ottimizzate automaticamente in build)

## Comandi

- `npm run dev` — anteprima locale
- `npm test` — build + verifiche su `dist/`
- `npm run images` — rigenera `public/og-image.jpg` e `public/apple-touch-icon.png` dopo aver cambiato foto o logo

Richiede Node 22.12 o superiore.
```

- [ ] **Step 4: Verifica automatica completa**

Run: `npm test`
Expected: tutti i test PASS. Poi `du -sh dist` e `ls dist/_astro | head` per controllare il peso complessivo.

- [ ] **Step 5: Verifica visiva**

Run: `npm run preview` (porta 4321). Nel browser controllare a 375px e a 1280px: hero, card trattamenti, timeline formazione, apertura/chiusura FAQ, menu mobile (apre, chiude, chiude al tocco su un link), barra contatti che non copre il footer, pulsanti "Indicazioni", banner iubenda.

- [ ] **Step 6: Lighthouse (se disponibile)**

Run: `npx -y lighthouse http://localhost:4321 --only-categories=performance,accessibility,seo,best-practices --quiet --chrome-flags="--headless" --output=json --output-path=/tmp/lh.json` e leggere i punteggi. Se Chrome non è disponibile, annotarlo nel report finale.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Aggiorna deploy a Node 22, sitemap e README"
```
