import { useI18n as vueUseI18n } from 'vue-i18n'
import type { Locale } from '@/i18n'

export function useI18n() {
  const { t, locale } = vueUseI18n({
    useScope: 'global',
  })

  function toggleLocale() {
    const next = locale.value === 'zh' ? 'en' : 'zh'
    locale.value = next
    localStorage.setItem('locale', next)
  }

  function setLocale(lang: Locale) {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  return { locale, toggleLocale, setLocale, t }
}
