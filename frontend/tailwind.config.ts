import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// ThorTheHost design tokens.
// Palette named after the Norse cosmology it draws from:
//   void      - the black sky Asgard's lightning splits open
//   slate/steel - forged metal surfaces
//   mist      - fog-grey text for secondary content
//   bifrost   - the ice-blue rainbow bridge (secondary accent)
//   lightning - the electric gold bolt itself (primary accent)
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        void: {
          DEFAULT: "#080B14",
          soft: "#0D1220",
        },
        slate: {
          DEFAULT: "#121a2c",
          elevated: "#182238",
        },
        steel: "#26314a",
        mist: {
          DEFAULT: "#8e9ab3",
          bright: "#c2cbdd",
        },
        foreground: "#e9edf6",
        bifrost: {
          DEFAULT: "#5ac8e8",
          dim: "#3a8fa8",
        },
        lightning: {
          DEFAULT: "#f5b027",
          hot: "#ffd873",
          dim: "#b9820f",
        },
        danger: "#f0554a",
        success: "#3ecf8e",
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "forge-radial":
          "radial-gradient(circle at 50% 0%, rgba(245,176,39,0.14), transparent 60%)",
        "bolt-fade":
          "linear-gradient(180deg, rgba(245,176,39,0.9) 0%, rgba(245,176,39,0) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(245,176,39,0.45)",
        "glow-sm": "0 0 20px -6px rgba(245,176,39,0.35)",
      },
      keyframes: {
        strike: {
          "0%": { opacity: "0", transform: "scaleY(0.3)" },
          "12%": { opacity: "1", transform: "scaleY(1)" },
          "18%": { opacity: "0.2" },
          "24%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        "rune-fade": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        strike: "strike 0.9s ease-out forwards",
        flicker: "flicker 3.5s ease-in-out infinite",
        "rune-fade": "rune-fade 0.5s ease-out forwards",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
