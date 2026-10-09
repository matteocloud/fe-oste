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

test("chi sono con il percorso di formazione", () => {
  assert.match(html, /id="chi-sono"/);
  for (const text of [
    "Mi chiamo Chiara Benini",
    "Health Sciences University di Londra",
    "1000 ore di tirocinio",
    "in ogni fase della vita",
    "neonatale-pediatrico",
    "Osteopatia in ambito Ortodontico",
    "Tutor Osteopata",
    "nuoto artistico"
  ]) {
    assert.ok(pageText.includes(text), text);
  }
});

test("FAQ con 4 domande a fisarmonica", () => {
  assert.match(html, /id="faq"/);
  assert.equal([...html.matchAll(/<details\b/g)].length, 4);
  assert.ok(pageText.includes("Serve la prescrizione medica?"));
});
