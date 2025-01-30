import { dir } from 'i18next';
import React from 'react';

import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadata({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  const { t } = await useTranslation(lng);

  return {
    title: t('titleMain'),
    description: t('descriptionMain'),
    keywords: [t('buyTech'), t('medTech')],
    creator: t('creator'),
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default function RootLayout({ children, params: { lng } }: { children: React.ReactNode; params: any }) {
  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
