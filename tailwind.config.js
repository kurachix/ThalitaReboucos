/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sun-yellow': {
          DEFAULT: 'var(--color-sun-yellow)',
          light: 'var(--color-sun-yellow-light)',
          dark: 'var(--color-sun-yellow-dark)',
        },
        'pop-pink': {
          DEFAULT: 'var(--color-pop-pink)',
          light: 'var(--color-pop-pink-light)',
          dark: 'var(--color-pop-pink-dark)',
        },
        'sea-blue': {
          DEFAULT: 'var(--color-sea-blue)',
          light: 'var(--color-sea-blue-light)',
          dark: 'var(--color-sea-blue-dark)',
        },
        tangerine: {
          DEFAULT: 'var(--color-tangerine)',
          light: 'var(--color-tangerine-light)',
        },
        mint: {
          DEFAULT: 'var(--color-mint-green)',
          light: 'var(--color-mint-green-light)',
        },
        paper: {
          DEFAULT: 'var(--color-paper)',
          lines: 'var(--color-paper-lines)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        handwriting: ['var(--font-handwriting)'],
      },
      boxShadow: {
        scrapbook: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        polaroid: '0 14px 28px -4px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
        sticker: '0 6px 16px rgba(0, 0, 0, 0.1), 0 0 0 3px #FFFFFF',
        postit: '2px 8px 16px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        scrapbook: '1.25rem',
      },
    },
  },
  plugins: [],
}
