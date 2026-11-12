import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: true,
    allowedHosts: true,
    cors: true
  },
  preview: {
    host: true,
    allowedHosts: true,
    cors: true,
    port: 4173
  }
});
