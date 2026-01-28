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
    },
  },
  plugins: [],
};
