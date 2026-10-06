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
