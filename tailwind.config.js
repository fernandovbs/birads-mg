/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        birads: {
          0: '#6b7280',
          1: '#16a34a',
          2: '#2563eb',
          3: '#d97706',
          '4a': '#f97316',
          '4b': '#ea580c',
          '4c': '#dc2626',
          5: '#991b1b',
          6: '#7f1d1d',
        }
      }
    },
  },
  plugins: [],
}
