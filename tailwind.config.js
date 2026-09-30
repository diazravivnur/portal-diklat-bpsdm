/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bpsdm: {
          blue: {
            DEFAULT: '#0F2C59',
            dark: '#081c3b',
            light: '#1e4887',
            50: '#f0f4f9',
            100: '#dde6f2',
            500: '#1b4d8f',
            900: '#0a1d3b',
          },
          gold: {
            DEFAULT: '#F59E0B',
            dark: '#D97706',
            light: '#FBBF24',
            50: '#fffbeb',
            100: '#fef3c7',
          }
        },
        jayaraya: {
          orange: '#FF6B00',
          yellow: '#FFB800',
        }
      },
    },
  },
  plugins: [],
};
