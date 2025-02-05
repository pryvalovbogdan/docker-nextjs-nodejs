import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';

export function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadata(
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
    title: t(metaConfig?.titleKey || 'titleMain'),
    description: t(metaConfig?.descriptionKey || 'descriptionMain'),
    keywords: metaConfig?.keywordsKeys?.map(t) || [t('buyTech'), t('medTech')],
    creator: t(metaConfig?.creatorKey || 'creator'),
    icons: {
      icon: metaConfig?.iconPath || '/favicon.ico',
    },
  };
}
