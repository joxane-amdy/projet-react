/** @type {import('tailwindcss').Config} */
// Configuration de Tailwind CSS
export default {
  // Tailwind analyse ces fichiers pour générer les classes CSS nécessaires
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Police de caractères personnalisée
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
