import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Parse's browser build imports Node's "events"; use the npm polyfill
    alias: { events: 'events/events.js' },
  },
})
