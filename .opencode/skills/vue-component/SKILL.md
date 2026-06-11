---
name: vue-component
description: Use when creating or editing Vue 3 SFC components in this project. Covers <script setup>, TypeScript props/emits, composables pattern, router integration, and project conventions.
---

# Vue Component Skill

Use this skill when writing or modifying `.vue` files in `src/`.

## Project Tech Stack

- Vue 3 + Composition API (`<script setup lang="ts">`)
- TypeScript strict
- Vite 8 + vue-router 5
- SCSS with `<style scoped lang="scss">`

## Component Structure

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// imports from @/api/* for API calls
// imports from @/composables/* for shared logic
// imports from @/lib/* for utilities

// Props with full TypeScript:
interface Props {
  foo: string
  bar?: number
}
const props = withDefaults(defineProps<Props>(), { bar: 0 })

// Inject SSR data:
const ssrData = inject<Record<string, any>>('ssrData', {})

// Reactive state
const data = ref(ssrData.foo || [])

// Computed
const filtered = computed(() => data.value.filter(...))

// Lifecycle - always use onMounted for client-side fallback
onMounted(() => {
  if (!ssrData.foo) fetchData()
})

onUnmounted(() => {
  // cleanup listeners, subscriptions, timers
})
</script>

<template>
  <!-- Vue template with glass-card / page-layout class -->
  <div class="page">
    <div class="page-center">
      <div class="glass-card">
        <h1>Title</h1>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/glass' as *;
// Use glass mixins from @/styles/glass.scss
</style>
```

## Key Conventions

### File Naming
- Views: `src/view/<name>.vue` (kebab-case)
- Components: `src/components/<Name>.vue` (PascalCase)
- Composables: `src/composables/use<Name>.ts`
- API modules: `src/api/<name>.ts`
- Lib utilities: `src/lib/<name>.ts`

### Data Flow
- Route meta `asyncData` → SSR data → `inject('ssrData')` → component
- Client-side fallback in `onMounted` when `ssrData` is empty
- Use `@/api/*` modules for all Supabase calls, not raw supabase in components
- Auth state via `useAuth()` composable, not direct supabase calls

### Template Patterns
- `v-if/v-else` for loading states (never show blank screens)
- `<Transition name="page-fade">` for page transitions
- `will-change: transform, opacity` for scroll-driven animations
- Always add `-webkit-` prefix for `backdrop-filter` properties

### Responsive
- Base: mobile-first, breakpoint at `@media (max-width: 640px)`
- Grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- Single column on mobile: `grid-template-columns: 1fr`

### Router
- `useRoute()` for current route info
- `<router-link>` for navigation links
- Import paths use `@/view/` alias
