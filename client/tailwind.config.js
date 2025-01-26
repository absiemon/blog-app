/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary':'#5A698F',
        'secondary': '#161D2F',
        'tertiary': '#FC4747'
      },
      colors:{
        primary: '#5A698F',
        secondary:'#FC4747'
      },
    },
    screens: {
      'xs': '100px',

      'sm': '599px',
      // => @media (min-width: 576px) { ... }
      
      'bdsm':'700px',

      'md': '960px',
      // => @media (min-width: 960px) { ... }

      'bdmd': '1240px',
      // => @media (min-width: 1440px) { ... }

      'lg': '1440px',
      // => @media (min-width: 1440px) { ... }

      'xl': '1536px',
      // => @media (min-width: 1440px) { ... }
    },
  },
  plugins: [],
}

