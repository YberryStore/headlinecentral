/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      maxWidth: {
        'page': '1600px',
        '7xl': '1600px',
        '8xl': '1600px',
      },
      colors: {
        yberry: {
          100: '#feeee6',
          200: '#fcdccc',
          300: '#facbb4',
          400: '#f8b99a',
          500: '#f7a881',
          600: '#f59767',
          700: '#f4864e',
          800: '#f17435',
          900: '#f0631c',
          1000: '#ee5102',
        },
        brand: {
          dark: '#121212',
          muted: '#666666',
          surface: '#FBFBFB',
          border: '#EAEAEA'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'desktop-heading': ['40px', { lineHeight: '1.2', fontWeight: '500' }],
        'mobile-heading': ['32px', { lineHeight: '1.25', fontWeight: '500' }],
        'subheading': ['24px', { lineHeight: '1.3', fontWeight: '400' }],
        'body-base': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

