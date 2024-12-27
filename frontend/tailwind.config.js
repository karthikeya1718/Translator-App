/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Modern and clean
        serif: ["Playfair Display", "serif"], // Elegant and fancy
        cursive: ["Pacifico", "cursive"], // Decorative and playful
      },
    },
  },
  plugins: [],
};
