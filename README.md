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
