/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        primary: {
          dark: "#0a0a0a",
          light: "#ffffff"
        },
        secondary: {
          dark: "#d1d1d1",
          light: "#4a5568"
        },
        tertiary: {
          dark: "#1a1a1a",
          light: "#f7fafc"
        },
        background: {
          dark: "#000000",
          light: "#ffffff"
        },
        surface: {
          dark: "#1a1a1a",
          light: "#f8f9fa"
        },
        border: {
          dark: "#2d3748",
          light: "#e2e8f0"
        },
        text: {
          primary: {
            dark: "#ffffff",
            light: "#1a202c"
          },
          secondary: {
            dark: "#a0aec0",
            light: "#4a5568"
          }
        },
        // Body color classes for the template
        'body-color': '#637381',
        'body-color-dark': '#9ca3af',
      },
      animation: {
        'gradient': 'gradient 6s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}