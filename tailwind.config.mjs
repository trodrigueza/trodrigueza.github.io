module.exports = {
  content: ["./src/**/*.{astro,md,mdx,html,js,ts,jsx,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [require("@tailwindcss/typography")],
};
