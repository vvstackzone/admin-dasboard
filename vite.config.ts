import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  // json-server rewrites db.json on every save; don't let Vite react to it.
  server: { watch: { ignored: ['**/db.json'] } },
})
