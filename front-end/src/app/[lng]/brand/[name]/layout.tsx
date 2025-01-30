import { dir } from 'i18next';
import React from 'react';

import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
