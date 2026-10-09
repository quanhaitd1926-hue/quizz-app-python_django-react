/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:       "#07070F",
          card:     "#0D0D1C",
          input:    "#12121F",
          border:   "#1A1A2E",
          borderHi: "#2A2A4A",
          text:     "#EDEDFA",
          muted:    "#6060A0",
          blue:     "#4F6EF7",
          blueDim:  "#1A2560",
          lime:     "#B8FF2E",
          limeDim:  "#2E4200",
          red:      "#FF3B4E",
          redDim:   "#3D0A12",
          purple:   "#9B5DE5",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body:    ["'Outfit'", "sans-serif"],
        mono:    ["'DM Mono'", "monospace"],
      },
      animation: {
        "fade-up":  "fadeUp 0.4s ease both",
        "fade-in":  "fadeIn 0.25s ease both",
        "spin-slow":"spin 0.7s linear infinite",
        "pulse-glow":"pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        pulseGlow: {
          "0%,100%": { filter: "drop-shadow(0 0 4px rgba(184,255,46,0.3))" },
          "50%":     { filter: "drop-shadow(0 0 14px rgba(184,255,46,0.7))" },
        },
      },
      backdropBlur: { xs: "4px" },
      boxShadow: {
        blue:  "0 0 24px rgba(79,110,247,0.3)",
        lime:  "0 0 24px rgba(184,255,46,0.25)",
        card:  "0 8px 40px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};