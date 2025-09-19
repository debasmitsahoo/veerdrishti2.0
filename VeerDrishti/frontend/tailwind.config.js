/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'danger': '#dc2626',
        'warning': '#f59e0b',
        'success': '#10b981',
        'info': '#3b82f6',
      }
    },
  },
  plugins: [],
}
