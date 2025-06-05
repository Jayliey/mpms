module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // or wherever your files are
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
