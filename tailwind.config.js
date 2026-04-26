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
      fontFamily:{
        comme: ['Comme', 'sans-serif'],
        geist:['Geist', 'sans-serif'],
      },
      colors:{
        'stroke-gray':'#555555',
        'text-gray':'#AAAAAA',
        'text-gray-dark':'#787878',
        'primary-green':'#00E89B',
        'primary-blue': '#006FEE',
        'ivory-blue': '#2F3E5C',
        'app-background-color': '#05080E'
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

