import type { BrandPalette } from "../types";

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error(`[palette] Impossibile caricare l'immagine ${src}`));
    image.src = src;
  });

const getAverageColor = (image: HTMLImageElement): [number, number, number] => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("[palette] Impossibile creare il contesto canvas.");
  }

  const width = 120;
  const ratio = image.width / image.height || 1;
  canvas.width = width;
  canvas.height = Math.round(width / ratio);

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  const step = 10;

  for (let i = 0; i < data.length; i += 4 * step) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count += 1;
  }

  return [Math.round(r / count), Math.round(g / count), Math.round(b / count)];
};

const rgbToHex = ([r, g, b]: [number, number, number]): string =>
  `#${[r, g, b]
    .map((value) => Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();

const hexToHsl = (hex: string): [number, number, number] => {
  let sanitized = hex.replace("#", "");

  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(sanitized.substring(0, 2), 16) / 255;
  const g = parseInt(sanitized.substring(2, 4), 16) / 255;
  const b = parseInt(sanitized.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToHex = ([h, s, l]: [number, number, number]): string => {
  const sat = s / 100;
  const light = l / 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) =>
    Math.round(255 * (light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

  return `#${[f(0), f(8), f(4)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
};

const adjustLightness = (hex: string, amount: number): string => {
  const [h, s, l] = hexToHsl(hex);
  const nextLightness = Math.max(0, Math.min(100, l + amount));
  return hslToHex([h, s, Math.round(nextLightness)]);
};

export const extractPalette = async (
  imagePaths: string[],
  fallback: BrandPalette
): Promise<BrandPalette> => {
  if (typeof window === "undefined" || !("HTMLCanvasElement" in window)) {
    return fallback;
  }

  if (!imagePaths.length) {
    return fallback;
  }

  const images = await Promise.all(
    imagePaths.map(async (path) => {
      try {
        return await loadImage(path);
      } catch (error) {
        console.info(
          `[palette] Immagine non trovata (${path}). Aggiungila in /public/brand/ per personalizzare i colori.`,
          error
        );
        return null;
      }
    })
  );

  const validImages = images.filter(
    (image): image is HTMLImageElement => Boolean(image && image.width && image.height)
  );

  if (!validImages.length) {
    console.info(
      "[palette] Nessuna immagine disponibile. Usa la palette di fallback e carica i file brand-card-1.jpg e brand-card-2.jpg per personalizzare i colori."
    );
    return fallback;
  }

  const averages = validImages.map(getAverageColor).map(rgbToHex);
  const primary = averages[0] ?? fallback.primary;
  const accentCandidate = averages[1] ?? adjustLightness(primary, 15);
  const mutedCandidate = averages[2] ?? adjustLightness(primary, 35);

  return {
    primary,
    accent: accentCandidate,
    muted: mutedCandidate,
    surface: adjustLightness(primary, 60),
    ink: fallback.ink,
    outline: fallback.outline
  };
};
