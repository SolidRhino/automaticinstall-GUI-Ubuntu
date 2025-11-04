/**
 * Internationalization translations
 * Multi-language support for the Ubuntu Autoinstall Configuration Builder
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'nl';

export interface Translations {
  [key: string]: string;
}

export interface LanguageInfo {
  code: Language;
  name: string;
  flag: string;
}

// Import translations from the original i18n.js temporarily
// This will be refactored to proper TypeScript in Phase 3
export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'Ubuntu Autoinstall Configuration Builder',
    appSubtitle: 'Create and customize your Ubuntu autoinstall.yaml configuration',
    // More translations will be added from original file
  },
  es: {},
  fr: {},
  de: {},
  nl: {}
};

export const availableLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];
