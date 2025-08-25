import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: "#ECEEFF",
        primary: "#fafaff1a",
        accent: "#6A6A6A",
        textPrimary: "#242565",
        textSecondary: "#8570AD",
        btnPrimaryStart: "#4157FE",
        btnPrimaryEnd: "#7B8BFF",
        btnSecondaryStart: "#FE4141",
        btnSecondaryEnd: "#FF847B",
      },
    },
  },
  plugins: [],
} satisfies Config;
