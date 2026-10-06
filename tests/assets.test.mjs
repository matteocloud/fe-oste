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
