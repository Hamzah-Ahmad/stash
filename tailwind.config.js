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
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        deep: "var(--deep)",
        deeper: "var(--deeper)",
        "text-1": "var(--text-1)",
        "text-2": "var(--text-2)",
        "text-3": "var(--text-3)",
        "text-4": "var(--text-4)",
      },
      borderColor: {
        regular: "var(--border-regular)",
        "thin": "var(--border-thin)",
        "glow": "var(--border-glow)",
      },
      borderRadius: {
        radius: "var(--radius)",
        "radius-lg": "var(--radius-lg)",
        
      },
    },
  },
  plugins: [],
};
