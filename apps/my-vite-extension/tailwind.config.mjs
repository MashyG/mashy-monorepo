/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'x-',
  corePlugins: {
    preflight: false,
  },
  purge: ['./src/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [],
} 