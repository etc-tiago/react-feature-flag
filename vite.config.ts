import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // Dev config
    return {
      plugins: [react()],
      root: path.resolve(__dirname, 'dev'),
      build: {
        outDir: path.resolve(__dirname, 'dist'),
      },
    };
  }
  // Build config
  return {
    plugins: [react(), dts()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'media-recorder',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      }
    }
  };
});