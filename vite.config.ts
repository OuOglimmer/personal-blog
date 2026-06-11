import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist/client',
  },
  ssr: {
    optimizeDeps: {
      include: ['vue', 'vue-router', '@supabase/supabase-js'],
    },
    noExternal: ['@supabase/supabase-js'],
  },
})
