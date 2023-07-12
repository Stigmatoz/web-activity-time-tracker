import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import pkg from './package.json';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

const APPID_CHROME = 'hhfnghjdeddcfegfekjeihfmbjenlomm';

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
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
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'icons';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },

    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : false,
    minify: true,
  },
  define: {
    'process.env': process.env,
    __EXTENSION_MODE__: JSON.stringify(mode),
    __DEV__: mode === 'development',
    __PROD__: mode === 'production',
    __EXTENSION_VERSION__: JSON.stringify(pkg.version),
    __REAL_APP_ID__: APPID_CHROME,
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: path.resolve(__dirname, '..', 'src/assets/_locales/*'),
    }),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
      additionalInputs: ['src/block.html'],
    }),
  ],
  optimizeDeps: {
    include: ['vue', 'webextension-polyfill'],
  },
}));
