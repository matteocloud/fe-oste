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
