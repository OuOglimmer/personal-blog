import { ref } from 'vue'

const homeScrollProgress = ref(0)

export function useHomeScroll() {
  function setHomeScrollProgress(v: number) {
    homeScrollProgress.value = v
  }
  return { homeScrollProgress, setHomeScrollProgress }
}
