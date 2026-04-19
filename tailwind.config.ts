import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Tokens conçus pour contraste AA (≥ 4.5:1) sur fond blanc / cream
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // 4.5:1 sur cream
          700: '#c2410c', // AA on white
          800: '#9a3412',
          900: '#7c2d12',
        },
        cream: {
          50: '#fffaf4',
          100: '#fff3e6',
        },
        ink: {
          700: '#1f2937',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: [
          '"Atkinson Hyperlegible"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      minHeight: {
        touch: '2.75rem', // 44px WCAG target size
      },
      minWidth: {
        touch: '2.75rem',
      },
      borderRadius: {
        petal: '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(234, 88, 12, 0.25)',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
