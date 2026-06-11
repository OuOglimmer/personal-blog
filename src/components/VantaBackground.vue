<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  opacity?: number
  blur?: number
}>(), {
  opacity: 1,
  blur: 0,
})

const containerRef = ref<HTMLDivElement>()
const isReady = ref(false)

let vantaEffect: { destroy: () => void } | null = null

function initVanta() {
  if (!containerRef.value) return
  if (typeof window.VANTA === 'undefined') {
    console.warn('Vanta.js not loaded yet, retrying...')
    setTimeout(initVanta, 500)
    return
  }
  try {
    vantaEffect = window.VANTA.WAVES({
      el: containerRef.value,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: 0x5588,
      shininess: 30,
      waveHeight: 15,
      waveSpeed: 1,
      zoom: 1,
    })
    isReady.value = true
  } catch (e) {
    console.error('Failed to initialize Vanta WAVES:', e)
  }
}

onMounted(() => {
  nextTick(() => initVanta())
})

onUnmounted(() => {
  vantaEffect?.destroy()
  vantaEffect = null
})
</script>

<template>
  <div ref="containerRef" class="vanta-bg" :style="{ opacity, filter: blur > 0 ? `blur(${blur}px)` : undefined }" />
</template>

<style scoped>
.vanta-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}
</style>
