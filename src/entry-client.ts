import { createApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import { i18n } from './i18n'
import './style.css'

const app = createApp(App)

const ssrData = (window as any).__SSR_DATA__ || {}
app.provide('ssrData', ssrData)

app.use(i18n)

const router = createAppRouter()
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
