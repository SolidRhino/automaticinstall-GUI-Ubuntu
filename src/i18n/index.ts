/**
 * i18n system with React Context support
 */

import { translations, availableLanguages, type Language, type LanguageInfo } from './translations';
import { storage } from '../utils/storage';

class I18n {
  private currentLanguage: Language = 'en';

  constructor() {
    this.init();
  }

  /**
   * Initialize i18n with saved or browser language
   */
  init(): void {
    const savedLang = storage.get<Language>('language');
    if (savedLang && translations[savedLang]) {
      this.currentLanguage = savedLang;
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }
  }

  /**
   * Get translation for a key
   */
  t(key: string): string {
    return translations[this.currentLanguage][key] || translations.en[key] || key;
  }

  /**
   * Set language
   */
  setLanguage(lang: Language): boolean {
    if (translations[lang]) {
      this.currentLanguage = lang;
      storage.set('language', lang);
      return true;
    }
    return false;
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): LanguageInfo[] {
    return availableLanguages;
  }
}

export const i18n = new I18n();
export default i18n;
export type { Language, LanguageInfo };
