import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

const isServer = typeof window === 'undefined'

const memoryStorage: Storage = {
  getItem() { return null },
  setItem() {},
  removeItem() {},
  clear() {},
  get length() { return 0 },
  key() { return null },
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: isServer ? memoryStorage : undefined,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: !isServer,
  },
})
