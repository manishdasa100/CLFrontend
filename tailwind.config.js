const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        'stroke-gray':'#B5B5B5',
        'text-gray':'#aaaaaa',
        'primary-green':'#00E89B'
      },
      keyframes:{
        reverseSpin:{
          'to':{transform:'rotate(-360deg)'}
        }
      },
      animation:{
        reverseSpin: 'reverseSpin 1s linear infinite' 
      }
    },
  },
  plugins: [nextui()],
}

