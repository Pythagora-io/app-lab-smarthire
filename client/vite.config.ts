import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
            // Try ports in sequence
            for (let port = 3001; port < 3010; port++) {
              options.target = `http://localhost:${port}`;
            }
          });
        }
      }
    },
    allowedHosts: [
      'localhost',
      '.deployments.pythagora.ai'
    ],
  },
})