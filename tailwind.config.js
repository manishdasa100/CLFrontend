/** @type {import('tailwindcss').Config} */
export default {
  // NextUI is gone: its Spinner was the last component in use and is now
  // .cl-spinner. Dropping the theme glob and plugin stops Tailwind generating
  // every utility NextUI's theme package references — that alone was ~237 kB of
  // the built stylesheet, for one spinner.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comme: ['Comme', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
      },
      // The legacy palette that used to live here was only referenced by
      // components deleted in this pass. Colour now comes from tokens.css.
    },
  },
  plugins: [],
}
