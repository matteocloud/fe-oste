import type { BrandPalette } from "../types";

const fallbackPalette: BrandPalette = {
  primary: "#abc19fff",
  accent: "#6E7457",
  muted: "#AEB198",
  surface: "#FFFFFF",
  ink: "#1F2A37",
  outline: "rgba(31, 42, 55, 0.1)"
};

let resolvedPalette: BrandPalette = fallbackPalette;

export const getBrandColors = (): BrandPalette => resolvedPalette;

export const initializeBrandPalette = async (): Promise<BrandPalette> => {
  resolvedPalette = fallbackPalette;
  applyPalette(resolvedPalette);
  return resolvedPalette;
};

const applyPalette = (palette: BrandPalette) => {
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", palette.primary);
  root.style.setProperty("--brand-accent", palette.accent);
  root.style.setProperty("--brand-muted", palette.muted);
  root.style.setProperty("--surface-color", palette.surface);
  root.style.setProperty("--ink-color", palette.ink);
  root.style.setProperty("--outline-color", palette.outline);
};

export { fallbackPalette };
