/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "bg-gradient-to-r",
    "from-gray-900",
    "via-purple-900",
    "to-gray-900",
    "border-purple-500/30",
  ],
};
