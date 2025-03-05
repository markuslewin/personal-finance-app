import { type Config } from "tailwindcss";
import { screens } from "./src/app/_screens";

const rem = (px: number) => {
  return `${px / 16}rem`;
};

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    screens,
    colors: {
      // Beige
      "beige-500": "hsl(23 6% 57%)",
      "beige-100": "hsl(30 36% 96%)",
      // Grey
      "grey-900": "hsl(252 7% 13%)",
      "grey-500": "hsl(0 0% 41%)",
      "grey-300": "hsl(0 0% 70%)",
      "grey-100": "hsl(0 0% 95%)",
      // Secondary
      green: "hsl(177 52% 32%)",
      yellow: "hsl(28 73% 81%)",
      cyan: "hsl(190 52% 68%)",
      navy: "hsl(248 8% 41%)",
      red: "hsl(7 58% 50%)",
      purple: "hsl(259 30% 56%)",
      // Other
      "purple-1": "hsl(288 29% 62%)",
      turquoise: "hsl(180 16% 42%)",
      brown: "hsl(21 30% 44%)",
      magenta: "hsl(332 30% 44%)",
      blue: "hsl(205 48% 47%)",
      "navy-grey": "hsl(214 11% 63%)",
      "army-green": "hsl(83 20% 47%)",
      gold: "hsl(47 50% 59%)",
      orange: "hsl(18 47% 52%)",
      // White
      white: "hsl(0 0% 100%)",
    },
    fontFamily: {
      "public-sans": ["var(--font-public-sans)"],
    },
    fontSize: {
      "preset-1": [
        rem(32),
        { fontWeight: 700, lineHeight: "1.2", letterSpacing: "0rem" },
      ],
      "preset-2": [
        rem(20),
        { fontWeight: 700, lineHeight: "1.2", letterSpacing: "0rem" },
      ],
      "preset-3": [
        rem(16),
        { fontWeight: 700, lineHeight: "1.5", letterSpacing: "0rem" },
      ],
      "preset-4": [
        rem(14),
        { fontWeight: 400, lineHeight: "1.5", letterSpacing: "0rem" },
      ],
      "preset-4-bold": [
        rem(14),
        { fontWeight: 700, lineHeight: "1.5", letterSpacing: "0rem" },
      ],
      "preset-5": [
        rem(12),
        { fontWeight: 400, lineHeight: "1.5", letterSpacing: "0rem" },
      ],
      "preset-5-bold": [
        rem(12),
        { fontWeight: 700, lineHeight: "1.5", letterSpacing: "0rem" },
      ],
    },
    spacing: {
      0: "0rem",
      50: "0.25rem",
      100: "0.5rem",
      150: "0.75rem",
      200: "1rem",
      250: "1.25rem",
      300: "1.5rem",
      400: "2rem",
      500: "2.5rem",
    },
  },
} satisfies Config;
