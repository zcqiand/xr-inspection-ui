import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        // 根据API文档，后端接口路径本身就包含 /api，因此移除 rewrite 规则
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // 将 @ 别名指向 src 目录
    },
  },
})
