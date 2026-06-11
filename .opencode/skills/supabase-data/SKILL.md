---
name: supabase-data
description: Use when working with Supabase in this project — API calls, SSR asyncData, data fetching, auth, or the SSR hydration pattern.
---

# Supabase Data Skill

This skill covers Supabase integration patterns used in look-blog.

## Client Setup (`src/lib/supabase.ts`)

Import from one place only:
```ts
import { supabase } from '@/lib/supabase'
```

The client auto-detects SSR environment (server vs browser) and configures auth storage accordingly.

## API Layer (`src/api/`)

**All Supabase queries go in `src/api/<name>.ts`**, never write raw supabase calls in components.

```ts
// src/api/content.ts
import { supabase } from '@/lib/supabase'

export interface ContentItem {
  id: number
  title: string
  description: string
  url: string | null
  img: string | null
  type: string
  cover_color: string | null
}

export async function getAllContent(): Promise<ContentItem[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('id')

  if (error) {
    console.error('Failed to fetch content:', error)
    throw error
  }
  return data || []
}
```

### API Function Patterns
- Export typed interfaces alongside functions
- Return `Promise<Type[]>` or `Promise<Type | null>`
- Handle errors with `console.error` + throw
- Use `.select('*')` explicitly
- Chain `.order()`, `.eq()`, `.single()` as needed

## SSR Data Pattern

### Step 1: Route meta (`src/router/routes.ts`)

```ts
{
  path: '/page',
  name: 'page',
  component: () => import('@/view/page.vue'),
  meta: {
    asyncData: async () => {
      const { getData } = await import('@/api/something')
      const data = await getData().catch(() => [])
      return { items: data }
    },
  },
}
```

### Step 2: Component (`src/view/page.vue`)

```vue
<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { getData } from '@/api/something'

const ssrData = inject<Record<string, any>>('ssrData', {})
const items = ref(ssrData.items || [])

onMounted(() => {
  if (!ssrData.items) fetchData()
})

async function fetchData() {
  items.value = await getData()
}
</script>
```

**Rule**: Always check `if (!ssrData.xxx)` in `onMounted` to avoid duplicate fetches after SSR.

## Auth Pattern (`src/composables/useAuth.ts`)

```ts
import { useAuth } from '@/composables/useAuth'

const { user, loading } = useAuth()
```

- `user` is `Ref<User | null>` — check with `v-if="user"`
- `loading` is `Ref<boolean>` — for the initial auth check
- Auth state subscription auto-cleans up via `onUnmounted`
- Login/logout calls go through `@/api/auth.ts`

## Common Query Patterns

### List with filter
```ts
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('published', true)
  .order('created_at', { ascending: false })
```

### Single record
```ts
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('id', id)
  .single()
```

### Insert/Update
```ts
const { error } = await supabase.from('table').insert([{ ... }])
const { error } = await supabase.from('table').update({ ... }).eq('id', id)
```

## Error Handling

Always destructure `{ data, error }`:
```ts
const { data, error } = await supabase.from('table').select('*')
if (error) {
  console.error('Operation failed:', error)
  return [] // return sensible default
}
return data || []
```

## Database Tables (from supabase-migration.sql)

- `content` — id, title, description, url, img, type, cover_color
- `posts` — id, title, content, summary, tags, published, created_at
- `pages` — id, page_id, content
- `home` — id, words
- Auth: managed by Supabase Auth, accessed via `supabase.auth`
