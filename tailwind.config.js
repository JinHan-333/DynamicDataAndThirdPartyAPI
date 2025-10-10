/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arsenal-sc': ['Arsenal SC', 'sans-serif'],
        'alegreya-sans-sc': ['Alegreya Sans SC', 'sans-serif'],
        'plus-jakarta-sans': ['Plus Jakarta Sans', 'sans-serif'],
        'antic-slab': ['Antic Slab', 'serif'],
      },
    },
  },
  plugins: [],
}
