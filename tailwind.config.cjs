/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './index.tsx',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        zinc: {
          750: '#27272a',
          850: '#202023',
          900: '#18181b',
          950: '#09090b',
        },
        accent: {
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
};
