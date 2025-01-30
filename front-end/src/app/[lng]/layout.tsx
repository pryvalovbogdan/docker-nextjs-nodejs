import { dir } from 'i18next';
import React from 'react';

import { useTranslation } from '@i18n/config';
import { fallbackLng, languages } from '@i18n/settings';

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

export async function generateMetadata({ params }: { params: { lng: string } }) {
  let { lng } = params;

  if (!languages.includes(lng)) lng = fallbackLng;

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
  const resolvedParams = await params;
  const { lng } = resolvedParams;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
