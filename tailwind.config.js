/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Assistant', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#050505',
          900: '#0b0b0d',
          800: '#131316',
          700: '#1e1e22',
          600: '#2c2c31',
        },
      },
    },
  },
  plugins: [],
}
