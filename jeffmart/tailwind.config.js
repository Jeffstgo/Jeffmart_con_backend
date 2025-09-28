/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#36e07b",  
        dark:    "#0d1117",  // fondo global un poco más profundo estilo mock
        navbar:  "#0f1b2a",  // barra superior (azul petróleo oscuro)
        card:    "#11181c",  // tarjetas (más claro que el fondo)
        muted:   "#1f2429",  // superficies secundarias / inputs
        border:  "#333333",
        text: {
          DEFAULT: "#ffffff",
          muted:   "#9ca3af",
        },
      },
      fontFamily: {
        sans: ["Spline Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
