// vite.config.ts
import path from "path";
import react from "file:///I:/gpt/gpts/v1/pythagora-core/workspace/smarthire/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///I:/gpt/gpts/v1/pythagora-core/workspace/smarthire/client/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "i:\\gpt\\gpts\\v1\\pythagora-core\\workspace\\smarthire\\client";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err);
            for (let port = 3001; port < 3010; port++) {
              options.target = `http://localhost:${port}`;
            }
          });
        }
      }
    },
    allowedHosts: [
      "localhost",
      ".deployments.pythagora.ai"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJpOlxcXFxncHRcXFxcZ3B0c1xcXFx2MVxcXFxweXRoYWdvcmEtY29yZVxcXFx3b3Jrc3BhY2VcXFxcc21hcnRoaXJlXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiaTpcXFxcZ3B0XFxcXGdwdHNcXFxcdjFcXFxccHl0aGFnb3JhLWNvcmVcXFxcd29ya3NwYWNlXFxcXHNtYXJ0aGlyZVxcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2k6L2dwdC9ncHRzL3YxL3B5dGhhZ29yYS1jb3JlL3dvcmtzcGFjZS9zbWFydGhpcmUvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCJcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICAnL2FwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgcHJveHkub24oJ2Vycm9yJywgKGVyciwgcmVxLCByZXMpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb3h5IGVycm9yOicsIGVycik7XHJcbiAgICAgICAgICAgIC8vIFRyeSBwb3J0cyBpbiBzZXF1ZW5jZVxyXG4gICAgICAgICAgICBmb3IgKGxldCBwb3J0ID0gMzAwMTsgcG9ydCA8IDMwMTA7IHBvcnQrKykge1xyXG4gICAgICAgICAgICAgIG9wdGlvbnMudGFyZ2V0ID0gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGFsbG93ZWRIb3N0czogW1xyXG4gICAgICAnbG9jYWxob3N0JyxcclxuICAgICAgJy5kZXBsb3ltZW50cy5weXRoYWdvcmEuYWknXHJcbiAgICBdLFxyXG4gIH0sXHJcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwVyxPQUFPLFVBQVU7QUFDM1gsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBRjdCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxXQUFXLENBQUMsT0FBTyxZQUFZO0FBQzdCLGdCQUFNLEdBQUcsU0FBUyxDQUFDLEtBQUssS0FBSyxRQUFRO0FBQ25DLG9CQUFRLElBQUksZ0JBQWdCLEdBQUc7QUFFL0IscUJBQVMsT0FBTyxNQUFNLE9BQU8sTUFBTSxRQUFRO0FBQ3pDLHNCQUFRLFNBQVMsb0JBQW9CLElBQUk7QUFBQSxZQUMzQztBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
