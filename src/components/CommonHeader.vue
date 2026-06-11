<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/api/auth'
import { useI18n } from '@/composables/useI18n'
import type { User } from '@supabase/supabase-js'

const route = useRoute()
const user = ref<User | null>(null)
const { locale, toggleLocale, t } = useI18n()

const navItems = [
  { name: 'home', label: () => t('nav.home'), path: '/' },
  { name: 'tips', label: () => t('nav.tips'), path: '/tips' },
  { name: 'about', label: () => t('nav.about'), path: '/about' },
  { name: 'project', label: () => t('nav.project'), path: '/project' },
  { name: 'more', label: () => t('nav.more'), path: '/more' },
]

async function handleSignOut() {
  await signOut()
  user.value = null
}

let subscription: { unsubscribe: () => void } | null = null

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null

  subscription = supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  }).data.subscription
})

onUnmounted(() => {
  subscription?.unsubscribe()
})
</script>

<template>
  <header class="glass-header">
    <div class="header-inner">
      <router-link to="/" class="logo">
        <img src="/pig.svg" alt="logo" class="logo-icon" />
        <span class="logo-text">glimmer</span>
      </router-link>
      <nav class="nav">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
        >
          {{ item.label() }}
        </router-link>
      </nav>
      <div class="auth-area">
        <button class="lang-btn" @click="toggleLocale">
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
        <span v-if="user" class="user-email">{{ user.email }}</span>
        <router-link v-if="user" to="/admin" class="nav-link">{{ t('auth.admin') }}</router-link>
        <router-link v-if="!user" to="/login" class="nav-link">{{ t('auth.login') }}</router-link>
        <button v-else class="nav-link logout-btn" @click="handleSignOut">{{ t('auth.logout') }}</button>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.glass-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0 24px;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #fff;
  z-index: 2;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.logo-text {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.auth-area {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
}

.user-email {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.lang-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-family: inherit;
}

.nav-link {
  padding: 8px 18px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    color: #fff;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.15);
  }
}
</style>
