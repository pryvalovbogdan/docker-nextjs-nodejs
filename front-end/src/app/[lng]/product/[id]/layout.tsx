import { dir } from 'i18next';
import React from 'react';

import { fallbackLng, languages } from '@i18n/settings';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  let { lng } = await params;

  if (languages.indexOf(lng) < 0) lng = fallbackLng;

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
