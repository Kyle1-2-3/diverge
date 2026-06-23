import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // `base: './'` keeps asset paths relative so the build works when published
  // to a GitHub Pages sub-path (e.g. username.github.io/diverge) or on Vercel.
  base: './',
  plugins: [react(), tailwindcss()],
})
