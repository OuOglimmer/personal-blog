import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/view/home.vue'),
    meta: {
      asyncData: async () => {
        const { getAllContent } = await import('@/api/content')
        const { getWelcomeWords } = await import('@/api/home')
        const [content, words] = await Promise.all([
          getAllContent().catch(() => []),
          getWelcomeWords().catch(() => null),
        ])
        return {
          items: content,
          welcomeSubtitle: words?.words || 'Welcome to glimmer Blog',
        }
      },
    },
  },
  {
    path: '/tips',
    name: 'tips',
    component: () => import('@/view/tips.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/view/about.vue'),
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('@/view/project.vue'),
  },
  {
    path: '/more',
    name: 'more',
    component: () => import('@/view/more.vue'),
    meta: {
      asyncData: async () => {
        const { supabase } = await import('@/lib/supabase')
        const { data } = await supabase
          .from('pages')
          .select('*')
          .eq('page_id', 'more')
          .single()
        return { page: data || null }
      },
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/view/login.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/view/admin.vue'),
  },
]
