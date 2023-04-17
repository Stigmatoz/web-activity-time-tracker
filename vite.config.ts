import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : false,
    minify: false,
  },
  define: {
    'process.env': process.env
  },
  plugins: [
    vue(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ["package.json", "manifest.json"],
    }),
  ],
  optimizeDeps: {
    include: ['vue', 'webextension-polyfill'],
  },
}));
