/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // <--- IMPORTANT: This tells Tailwind to style the shared components
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#050505',
        'brand-gray': '#0f1115',
        'brand-gold': '#d4af37',
        'brand-gold-muted': '#aa8c2c',
      }
    },
  },
  plugins: [],
}