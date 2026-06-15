import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#FEF9EE",
          100: "#FDEFD3",
          200: "#FBDFA7",
          300: "#F8C96B",
          400: "#F4AD35",
          500: "#C07820",
          600: "#A46318",
          700: "#874F13",
          800: "#6B3C0E",
          900: "#4E2C09",
        },
        accent: {
          50:  "#F9F4EC",
          100: "#F1E4CC",
          200: "#E3C99A",
          300: "#D4AE68",
          400: "#C59336",
          500: "#8B5E1A",
          600: "#754F16",
          700: "#5F4012",
          800: "#49310E",
          900: "#33220A",
        },
      },
    },
  },
  plugins: [],
};

export default config;
