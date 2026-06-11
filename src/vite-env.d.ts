/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  VANTA?: {
    WAVES: (options: Record<string, any>) => { destroy: () => void }
  }
  THREE?: any
}
