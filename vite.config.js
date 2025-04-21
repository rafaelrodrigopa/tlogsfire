export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v0': {
        target: 'https://firebasestorage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v0/, '')
      }
    }
  }
});