import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js app directory
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Next.js pages directory (optional if using app)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Components
    "./styles/**/*.{css}", // Tailwind CSS files
  ],
  theme: {
    extend: {
      colors: {
        'willow-brook': {
        '50': '#f6f8f5',
        '100': '#e9f1e7',
        '200': '#d9e5d6',
        '300': '#b2c9ac',
        '400': '#87a97f',
        '500': '#658b5c',
        '600': '#507049',
        '700': '#405a3b',
        '800': '#364932',
        '900': '#2d3c2b',
        '950': '#151f14',
    },
    
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
