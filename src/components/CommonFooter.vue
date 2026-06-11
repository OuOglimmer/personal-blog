<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
const { t } = useI18n()
</script>

<template>
  <footer class="glass-footer">
    <p>© 2026 CommonHF. {{ t('footer.rights') }}</p>
    <p>{{ t('footer.built') }}</p>
  </footer>
</template>

<style scoped lang="scss">
.glass-footer {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  text-align: center;

  p {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    margin: 4px 0;
    line-height: 1.5;
  }
}
</style>
