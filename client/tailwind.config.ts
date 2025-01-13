import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        expand: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        },
      },
      animation: {
        expand: 'expand 0.2s ease-out forwards',
      },
      transitionTimingFunction: {
        'bounce-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      perspective: {
        '1000': '1000px'
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        surface: {
          dark: 'rgba(24, 24, 24, 0.9)',
          light: 'rgba(40, 40, 40, 0.9)',
        },
      },
      boxShadow: {
        'spotify': '0 8px 24px rgb(0 0 0 / 50%)',
        'spotify-hover': '0 8px 32px rgb(0 0 0 / 70%)',
      },
      backdropBlur: {
        'less': '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}

export default config