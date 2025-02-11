import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';
import { TranslationKeys } from '@i18n/types/i18next';

export function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadataGeneral(
  lng: string,
  metaConfig?: {
    titleKey?: string;
    descriptionKey?: string;
    keywordsKeys?: string[];
    creatorKey?: string;
    iconPath?: string;
  },
) {
  if (!languages.includes(lng)) lng = fallbackLng;

  const { t } = await useTranslation(lng);

  return {
    title: t((metaConfig?.titleKey as TranslationKeys) || 'titleMain'),
    description: t((metaConfig?.descriptionKey as TranslationKeys) || 'descriptionMain'),
    keywords: metaConfig?.keywordsKeys
      ? metaConfig.keywordsKeys.map(key => t(key as TranslationKeys))
      : [t('buyTech'), t('medTech')],
    creator: t((metaConfig?.creatorKey as TranslationKeys) || 'creator'),
    icons: {
      icon: metaConfig?.iconPath || '/favicon.ico',
    },
  };
}
