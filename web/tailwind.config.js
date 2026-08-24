/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./pages/**/*.vue",
    "./components/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#191817",
        surface: "#FDFDFD",
        muted: "#6e6a64",
        border: "#CDD4DC",
        accent: "#2563EB",
        paper: "#F3F1EC",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
