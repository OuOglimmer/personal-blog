import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const loading = ref(true)

export function useAuth() {
  async function init() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    loading.value = false
  }

  let subscription: { unsubscribe: () => void } | null = null

  onMounted(() => {
    init()
    subscription = supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    }).data.subscription
  })

  onUnmounted(() => {
    subscription?.unsubscribe()
  })

  return { user, loading }
}
