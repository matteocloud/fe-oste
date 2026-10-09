import { test } from "node:test";
import assert from "node:assert/strict";
import { html, jsonLd, pageText } from "./helpers.mjs";

test("tre sedi con indirizzo e link alle indicazioni", () => {
  assert.match(html, /id="contatti"/);
  for (const text of ["Panorama Salute", "Via Belmonte, 169", "Studio Synergy Fisio", "Via Vespucci, 19, Calcinate del Pesce", "Studio Universo", "Via Leonardo Da Vinci, 10", "Gazzada Schianno"]) {
    assert.ok(pageText.includes(text), text);
  }
  const mapLinks = [...html.matchAll(/href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&(amp;)?query=/g)];
  assert.equal(mapLinks.length, 3);
});

test("email e orari", () => {
  assert.match(html, /href="mailto:chiarabenini\.osteopata@gmail\.com"/);
  assert.ok(pageText.includes("09:00 – 19:00"));
});

test("nessuna mappa incorporata", () => {
  assert.doesNotMatch(html, /<iframe/);
});

test("dati strutturati: persona e tre sedi", () => {
  const data = jsonLd();
  const graph = data["@graph"];
  const person = graph.find((node) => node["@type"] === "Person");
  assert.equal(person.name, "Chiara Benini");
  assert.equal(person.jobTitle, "Osteopata");
  const places = graph.filter((node) => node["@type"] === "MedicalBusiness");
  assert.deepEqual(
    places.map((place) => place.address.streetAddress),
    ["Via Belmonte, 169", "Via Vespucci, 19, Calcinate del Pesce", "Via Leonardo Da Vinci, 10"]
  );
  assert.equal(person.worksFor.length, 3);
  assert.doesNotMatch(JSON.stringify(data), /:""/);
});
