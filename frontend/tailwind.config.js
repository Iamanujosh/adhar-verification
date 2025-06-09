/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
        extend: {
          keyframes: {
            fadeOut: {
              '0%': { opacity: '1' }, // Fully visible
              '100%': { opacity: '0' } // Fully invisible
            },
            wiggle: {
              '0%': { transform: 'translate(-20px,0px)' },
              '50%': { transform: 'translate(50px,0px)'},
              '100%': { transform: 'translate(-20px,0px)'},
              
            },
            ziggle: {
              '0%': { transform: 'translate(20px,0px)' },
              '50%': { transform: 'translate(-50px,0px)'},
              '100%': { transform: 'translate(20px,0px)'},
            }
          },
          animation: {
            fadeOut: 'fadeOut 5s forwards',
            wiggle: 'wiggle 10s ease-in-out infinite',
            ziggle: 'ziggle 10s ease-in-out infinite', // Adjust duration as needed
          },
        },
      },
  plugins: [],
}

