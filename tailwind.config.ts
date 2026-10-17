// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "neutral-50": "#fafafa",
        "neutral-100": "#f5f5f5",
        "neutral-200": "#e5e5e5",
        "neutral-300": "#d4d4d4",
        "neutral-400": "#a3a3a3",
        "neutral-500": "#717171",
        "neutral-600": "#525252",
        "neutral-700": "#404040",
        "neutral-800": "#262626",
        "neutral-900": "#171717"
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
      backdropBlur: { xs: "2px" },
      backgroundImage: { "glass": "linear-gradient(125deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" }
    }
  },
  plugins: []
} satisfies Config;
