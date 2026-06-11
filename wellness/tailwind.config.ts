import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        // brand pillars
        cyan: "hsl(var(--cyan))",
        indigo: "hsl(var(--indigo))",
        coral: "hsl(var(--coral))",
        heal: "hsl(var(--heal))",
        warn: "hsl(var(--warn))",
      },
      fontFamily: {
        display: ["Baloo 2", "Rubik", "Heebo", "system-ui", "sans-serif"],
        sans: ["Rubik", "Heebo", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "var(--r-lg)",
        lg: "var(--r-md)",
        md: "var(--r-sm)",
        sm: "calc(var(--r-sm) - 6px)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        bob: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(6px)" } },
        "pulse-ring": { "0%": { opacity: "0.9", transform: "scale(0.9)" }, "70%": { opacity: "0", transform: "scale(1.6)" }, "100%": { opacity: "0" } },
      },
      animation: {
        "fade-in": "fade-in .4s ease-out",
        "slide-up": "slide-up .5s cubic-bezier(.2,.7,.2,1) both",
        bob: "bob 2.4s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
