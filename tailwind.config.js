/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Add your custom font family here
      },
      colors: {
        primary: {
          DEFAULT: '#01b23b', // Base primary color (you can change this hex value)
          light: '#14db56',  // Lighter shade for hover states or other variations
          dark: '#037429',   // Darker shade for deeper variations
        },
        secondary: {
          DEFAULT: '#f59e0b', // Base secondary color
          light: '#fbbf24',  // Lighter shade for secondary
          dark: '#d97706',   // Darker shade for secondary
        },
      },
    },
  },
  plugins: [],
}
