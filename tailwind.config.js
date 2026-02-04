/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff69b4",
        "light-primary": "#ED985F",
        "snap-black": "#000000",
        "snap-white": "#fff",
      },
      fontWeight: {
        thin: "100",
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
      backdropBlur: {
        xs: "2px",
      },
    },

    animation: {
      float: "float 2s ease-in-out infinite",
    },
    keyframes: {
      float: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-6px)" },
      },
    },
  },
  plugins: [],
};
