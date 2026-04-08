/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:            '#fcf9f8',
        charcoal:      '#323232',
        muted:         '#7a7a7a',
        primary:       '#605f5f',
        'primary-dark':'#545353',
        surface:       '#ffffff',
        'surface-2':   '#f5f2f0',
      },
      fontFamily: {
        sans:    ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
