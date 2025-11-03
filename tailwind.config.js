/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          accent: "var(--brand-accent)",
          muted: "var(--brand-muted)"
        },
        surface: "var(--surface-color)",
        ink: "var(--ink-color)",
        outline: "var(--outline-color)"
      },
      fontFamily: {
        heading: ["Georgia", "'Times New Roman'", "serif"],
        body: ["'Segoe UI'", "Helvetica", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 45px -20px rgba(17, 24, 39, 0.35)"
      }
    }
  },
  plugins: []
};
