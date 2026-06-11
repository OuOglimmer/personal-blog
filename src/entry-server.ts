import { createApp } from 'vue'
import App from './App.vue'
import { createAppRouter } from './router'
import { createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import { i18n } from './i18n'

export async function render(url: string) {
  const app = createApp(App)
  const router = createAppRouter(createMemoryHistory())
  app.use(router)
  app.use(i18n)

  await router.push(url)
  await router.isReady()

  const matched = router.currentRoute.value
  let ssrData: Record<string, any> = {}
  if (matched.meta?.asyncData) {
    ssrData = await (matched.meta.asyncData as () => Promise<Record<string, any>>)()
  }

  app.provide('ssrData', ssrData)

  const html = await renderToString(app)

  return { html, ssrData }
}
