import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy/seoul': {
        target: 'http://openapi.seoul.go.kr:8088',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/seoul/, ''),
      },
      '/proxy/tour': {
        target: 'https://apis.data.go.kr/B551011/KorService2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy\/tour/, ''),
      },
    },
  },
})
