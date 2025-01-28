import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof import('../i18n/locales/en/translation.json');
      common: typeof import('../i18n/locales/en/translation.json');
    };
  }
}
