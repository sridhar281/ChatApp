import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import daisyui from 'daisyui';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    daisyui
  ],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "light", "dark", "cupcake", "retro", "synthwave", "cyberpunk", "valentine",
      "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy",
      "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business",
      "acid", "lemonade", "night", "coffee", "winter"
    ],
  },
});