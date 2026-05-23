import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/birthday-celebration/', // 替换为你的 GitHub 仓库名
})
