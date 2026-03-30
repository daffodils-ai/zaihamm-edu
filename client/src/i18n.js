import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import hi from './locales/hi.json'

const messages = {
  en,
  hi
}

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'en', // Default language
  fallbackLocale: 'en',
  messages
})

export default i18n