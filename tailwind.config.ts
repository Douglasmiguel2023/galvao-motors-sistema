import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#091F5C",
        royal: "#334DAF",
        skyblue: "#7096D1",
        ice: "#D0E4FE",
        pale: "#E8F2FE",
        snow: "#F9FBFF",
        bright: "#3D94DD",
        lightblue: "#8EC7F2",
      },
    },
  },
  plugins: [],
} satisfies Config;
