import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { routes } from './routes'

export function createAppRouter(history?: RouterHistory) {
  const router = createRouter({
    history: history || createWebHistory(),
    routes,
  })

  router.beforeEach(async (to) => {
    if (import.meta.env.SSR) return
    const authRequiredRoutes = ['/admin']
    if (authRequiredRoutes.includes(to.path)) {
      const { supabase } = await import('@/lib/supabase')
      const { data } = await supabase.auth.getSession()
      if (!data.session) return '/login'
    }
  })

  return router
}
