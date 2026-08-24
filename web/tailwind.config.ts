import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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

export default config;
