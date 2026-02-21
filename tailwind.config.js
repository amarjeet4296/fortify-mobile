/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        dark: {
          bg: "#0F0F0F",
          card: "#1A1A1A",
          border: "#2A2A2A",
          muted: "#3A3A3A",
        },
        accent: {
          green: "#22C55E",
          red: "#EF4444",
          orange: "#F97316",
          yellow: "#EAB308",
          blue: "#3B82F6",
          purple: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["Inter-Regular"],
        medium: ["Inter-Medium"],
        semibold: ["Inter-SemiBold"],
        bold: ["Inter-Bold"],
      },
    },
  },
  plugins: [],
};
