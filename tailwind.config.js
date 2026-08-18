/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0F14",
          surface: "#131922",
          border: "#1F2733",
        },
        text: {
          primary: "#F5F7FA",
          secondary: "#8B95A5",
          muted: "#5B6474",
        },
        gain: "#00D982",
        loss: "#FF5C5C",
        cta: {
          DEFAULT: "#F0B429",
          hover: "#F5C452",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
