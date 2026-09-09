/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#f7f4ef',
          dark: '#ebe6dc',
          ink: '#1c1917',
        },
        moss: {
          50: '#f3f6f3',
          100: '#e3ebe3',
          200: '#c5d6c6',
          300: '#9bb89e',
          400: '#6f9473',
          500: '#4f7754',
          600: '#3c5e41',
          700: '#314c35',
          800: '#293e2c',
          900: '#223425',
        },
        clay: {
          400: '#c4a484',
          500: '#a67c52',
          600: '#8b6340',
        },
        sea: {
          600: '#2f5d6e',
          700: '#254a58',
          800: '#1e3c47',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px rgba(28, 25, 23, 0.06)',
      },
    },
  },
  plugins: [],
};
