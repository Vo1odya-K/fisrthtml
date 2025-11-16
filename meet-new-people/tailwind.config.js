/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./second.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/vite')],
}

