import 'i18next';

import type common from '../i18n/locales/en/translation.json';

interface I18nNamespaces {
  common: typeof common;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}
