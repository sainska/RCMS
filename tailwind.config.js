/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#013220',
          DEFAULT: '#006400',
          light: '#90ee90',
          accent: '#00a859',
          alt: '#014d26',
          alt2: '#015230',
          alt3: '#008f4c',
          alt4: '#005f3c',
          alt5: '#228B22',
        },
        white: '#ffffff',
        black: '#000000',
        // CSS variables from index.css
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        construction: {
          DEFAULT: 'hsl(var(--construction-green))',
          green: 'hsl(var(--construction-green))',
          success: 'hsl(var(--construction-success))',
          warning: 'hsl(var(--construction-warning))',
          danger: 'hsl(var(--construction-danger))',
        },
      },
    },
  },
  plugins: [],
};
