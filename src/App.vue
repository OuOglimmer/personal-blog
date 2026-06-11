<script setup lang="ts">
import { computed } from 'vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonFooter from '@/components/CommonFooter.vue'
import VantaBackground from '@/components/VantaBackground.vue'
import { useHomeScroll } from '@/composables/useScrollState'

const { homeScrollProgress } = useHomeScroll()

const vantaOpacity = computed(() => Math.max(1 - homeScrollProgress.value * 1.5, 0))
const vantaBlur = computed(() => homeScrollProgress.value * 12)
</script>

<template>
  <VantaBackground :opacity="vantaOpacity" :blur="vantaBlur" />
  <CommonHeader />
  <main>
    <router-view />
  </main>
  <CommonFooter />
</template>

<style>
html, body, #app {
  width: 100%;
  min-height: 100vh;
}
#app {
  position: relative;
}
</style>
