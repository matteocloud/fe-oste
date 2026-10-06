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

test("nessun banner cookie né script iubenda", () => {
  assert.doesNotMatch(html, /embeds\.iubenda\.com|cdn\.iubenda\.com/);
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
