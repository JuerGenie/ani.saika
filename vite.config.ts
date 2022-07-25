import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import unocss from "unocss/vite";
import { resolve } from "node:path";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unocss()],
  build: {
    rollupOptions: {
      input: {
        server: resolve(__dirname, "./server.html"),
        client: resolve(__dirname, "./client.html"),
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
});
