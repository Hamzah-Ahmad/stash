/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--dark)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        light: "var(--light)",
      },
    },
  },
  plugins: [],
};
