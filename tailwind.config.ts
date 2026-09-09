import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mediterranean: {
          DEFAULT: "#1E6FB8",
          50: "#F0F7FC",
          100: "#E0EFF9",
          200: "#BBDDF3",
          300: "#7CC6F5",
          400: "#3D9DE5",
          500: "#1E6FB8",
          600: "#175793",
          700: "#124372",
          800: "#0D3052",
          900: "#081F35",
        },
        "light-blue": "#7CC6F5",
        violet: {
          DEFAULT: "#7A5AF8",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          500: "#7A5AF8",
          600: "#633BF5",
          700: "#4F26E6",
        },
        rose: {
          DEFAULT: "#E96BA8",
          50: "#FDF2F7",
          100: "#FCE7F1",
          200: "#FBCFE4",
          500: "#E96BA8",
          600: "#DF418F",
          700: "#C42475",
        },
        offwhite: "#F8FAFC",
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F1F5F9",
          hover: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-elevated": "0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset",
        card: "0 2px 12px 0 rgba(30, 111, 184, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        "card-hover": "0 16px 32px -6px rgba(30, 111, 184, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px -2px rgba(30, 111, 184, 0.25)",
        "glow-lg": "0 0 30px -4px rgba(30, 111, 184, 0.35)",
        "glow-violet": "0 0 25px -3px rgba(122, 90, 248, 0.3)",
      },
      backgroundImage: {
        "stage-gradient": "linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E6FB8 100%)",
        "stage-dark": "linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1E293B 100%)",
        "mediterranean-gradient": "linear-gradient(135deg, #1E6FB8 0%, #175793 100%)",
        "violet-gradient": "linear-gradient(135deg, #7A5AF8 0%, #4F26E6 100%)",
        "rose-gradient": "linear-gradient(135deg, #E96BA8 0%, #C42475 100%)",
        "glass-light": "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
