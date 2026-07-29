import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* Palette Artefacts Music — inspiration Apple, interface lumineuse */
      colors: {
        mediterranean: "#1E6FB8",
        "light-blue": "#7CC6F5",
        violet: "#7A5AF8",
        rose: "#E96BA8",
        offwhite: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(30, 111, 184, 0.08)",
        "card-hover": "0 8px 32px rgba(30, 111, 184, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
