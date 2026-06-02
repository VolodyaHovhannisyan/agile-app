/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/shared-ui',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@trello-pro/shared-ui',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
  test: {
    name: '@trello-pro/shared-ui',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));


/**
 import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: './apps/web',

    base: env.VITE_BASE_URL || '/',

    plugins: [react(), mode === 'analyze' && visualizer({ open: true })].filter(
      Boolean,
    ),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@ui': path.resolve(__dirname, '../../packages/ui'),
      },
      dedupe: ['react', 'react-dom'],
      extensions: ['.ts', '.tsx', '.js'],
    },

    server: {
      port: 5173,
      strictPort: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      hmr: {
        overlay: true,
      },
    },

    preview: {
      port: 4173,
    },

    define: {
      __APP_VERSION__: JSON.stringify('1.0.0'),
    },

    css: {
      modules: {
        scopeBehaviour: 'local',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@ui'],
    },

    build: {
      outDir: 'dist',
      sourcemap: true,
      minify: 'esbuild',
      target: 'esnext',

      rollupOptions: {
        output: {
          manualChunks: (moduleId, meta) => {
            if (moduleId.includes('node_modules')) {
              return 'vendor';
            }
            return null;
          },
        },
      },

      chunkSizeWarningLimit: 1000,
    },

    esbuild: {
      jsxInject: `import React from 'react'`,
    },

    assetsInclude: ,

    logLevel: 'info',

    clearScreen: true,
  };
});

 */