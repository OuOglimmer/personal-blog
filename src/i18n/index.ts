import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

export type Locale = 'zh' | 'en'

const saved = (localStorage.getItem('locale') as Locale) || 'zh'

export const i18n = createI18n({
  legacy: false,
  locale: saved,
  fallbackLocale: 'en',
  messages: { zh, en },
  missingWarn: false,
  fallbackWarn: false,
})
