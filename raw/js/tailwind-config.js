/* Tailwind Play CDN configuration — shared across all pages */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        avocado: {
          DEFAULT: "#8DC63F", // brand lime green
          dark: "#6FA52E",
          light: "#A8D65C",
        },
        ink: {
          DEFAULT: "#0D0F0C", // near-black background
          soft: "#1A1D18",
          muted: "#6B6F66",
        },
        cream: "#F6F5F0",
      },
      fontFamily: {
        // Mulish — free, Europa-style geometric sans for headings
        heading: ['Mulish', '"Century Gothic"', 'Futura', 'system-ui', 'sans-serif'],
        body: ['"Libre Franklin"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightish: "-0.02em",
      },
      maxWidth: {
        content: "1536px",
      },
    },
  },
};
