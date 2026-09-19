import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the built site works under any GitHub Pages
  // project path (username.github.io/repo-name/) without editing this
  // file when the repo name changes.
  base: "./",
  plugins: [react()],
})
