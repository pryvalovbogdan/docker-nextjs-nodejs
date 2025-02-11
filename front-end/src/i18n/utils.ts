import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';

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
    title: t((metaConfig?.titleKey as any) || 'titleMain'),
    description: t((metaConfig?.descriptionKey as any) || 'descriptionMain'),
    keywords: metaConfig?.keywordsKeys
      ? metaConfig.keywordsKeys.map(key => t(key as any))
      : [t('buyTech'), t('medTech')],
    creator: t((metaConfig?.creatorKey as any) || 'creator'),
    icons: {
      icon: metaConfig?.iconPath || '/favicon.ico',
    },
  };
}
