import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./src/**/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "hud-bg": "oklch(0.28 0.052 260)",
        "hud-border": "oklch(0.47 0.112 260)",
        "canvas-backdrop": "oklch(0.19 0.064 250)",
        "glow-blue": "oklch(0.65 0.15 255)",
        "glow-teal": "oklch(0.72 0.11 200)",
        "glow-gold": "oklch(0.78 0.17 90)",
      },
      backgroundImage: {
        "parallax-sky": "linear-gradient(180deg, oklch(0.91 0.05 240) 0%, oklch(0.58 0.08 250) 45%, oklch(0.23 0.08 250) 100%)",
        "parallax-hills": "linear-gradient(180deg, oklch(0.39 0.12 150) 0%, oklch(0.26 0.05 180) 100%)",
        "parallax-foreground": "radial-gradient(circle at 50% 0%, oklch(0.72 0.18 110) 0%, transparent 60%), linear-gradient(180deg, oklch(0.12 0.06 200) 0%, oklch(0.09 0.04 200) 100%)",
      },
      boxShadow: {
        hud: "0 12px 30px oklch(0.2 0.05 250 / 0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
