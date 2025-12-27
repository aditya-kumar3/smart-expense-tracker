// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        app: {
          bg: "#020617", // slate-950
          card: "#020617",
          border: "#1e293b",
          accent: "#0ea5e9",
          accentSoft: "#38bdf8",
          danger: "#fb7185",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0,0,0,0.75)",
      },
    },
  },
  plugins: [],
};
