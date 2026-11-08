import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '');
  const service = env.MCP_PROXY_ORIGIN || 'https://open-design-mcp-liard.vercel.app';
  return {
    root,
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    plugins: [tailwindcss()],
    build: { outDir: 'dist', emptyOutDir: true },
    server: { proxy: { '/api': { target: service, changeOrigin: true }, '/registry': { target: service, changeOrigin: true } } },
  };
});
