import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import en from './en'
import zh from './zh'
import settings from '@/settings'

type SupportedLocale = 'zh' | 'en'

const messages = {
  en,
  zh,
}

function getDefaultLocale(): SupportedLocale {
  // Prefer the language configured by the project.
  const configuredLanguage = settings.defaultLanguage

  if (configuredLanguage === 'zh' || configuredLanguage === 'en') {
    return configuredLanguage
  }

  // Runtime override, replacing the old Vue.env.language behavior.
  if (typeof window !== 'undefined') {
    const runtimeLanguage = window.__APP_LANGUAGE__

    if (runtimeLanguage === 'zh' || runtimeLanguage === 'en') {
      return runtimeLanguage
    }
  }

  // Use browser language.
  if (typeof navigator !== 'undefined') {
    return navigator.language.toLowerCase().includes('zh')
        ? 'zh'
        : 'en'
  }

  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages,
})

export function setupI18n(app: App): void {
  app.use(i18n)
}

export default i18n