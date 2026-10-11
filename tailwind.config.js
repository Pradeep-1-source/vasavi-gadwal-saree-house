/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FBF4F5',
          100: '#F6E5E8',
          200: '#ECCFD4',
          300: '#DCAEB6',
          400: '#BF6878',
          500: '#9C2E42',
          600: '#801A2D',
          700: '#6B1425',
          800: '#58101E',
          900: '#420B16',
          950: '#28050C',
        },
        gold: {
          50: '#FCF9F0',
          100: '#F7F1DC',
          200: '#EDE0B5',
          300: '#DFCB89',
          400: '#D4AF37', // Pure Gold
          500: '#C5A059', // Rich Antique Gold
          600: '#AA863F',
          700: '#8B6A2D',
          800: '#6C5020',
          900: '#4C3714',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FDFBF7',
          200: '#F9F5EC',
          300: '#F3EDE0',
          400: '#EAE1CE',
          500: '#DED1BA',
        },
        charcoal: {
          800: '#2A2423',
          900: '#1D1817',
          950: '#130F0E',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 8px -1px rgba(197, 160, 89, 0.18)',
        'gold-md': '0 6px 20px -2px rgba(197, 160, 89, 0.25)',
        'gold-lg': '0 12px 30px -4px rgba(197, 160, 89, 0.35)',
        'maroon-lg': '0 14px 34px -4px rgba(88, 16, 30, 0.35)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F7F1DC 0%, #D4AF37 50%, #8B6A2D 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #801A2D 0%, #58101E 50%, #28050C 100%)',
        'silk-radial': 'radial-gradient(ellipse at top, #6B1425 0%, #420B16 60%, #1D060B 100%)',
      }
    },
  },
  plugins: [],
}
