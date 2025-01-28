import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ua';
    resources: {
      translation: typeof import('@i18n/locales/en/translation.json');
    };
  }
}
