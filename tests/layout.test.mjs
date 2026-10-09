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

test("solo il link alla privacy policy nel footer", () => {
  assert.ok(html.includes('href="https://www.iubenda.com/privacy-policy/93759785"'));
  assert.ok(!html.includes("cookie-policy"));
});

test("barra contatti fissa su mobile", () => {
  assert.match(html, /data-mobile-contact-bar/);
});

test("firma LoopZero nel footer", () => {
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)[0];
  assert.match(footer, /<a href="https:\/\/loopzero\.it"[^>]*>[\s\S]*?Sito realizzato da[\s\S]*?<img[^>]*alt="LoopZero"/);
});
