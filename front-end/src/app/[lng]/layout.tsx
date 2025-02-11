import { dir } from 'i18next';
import React from 'react';

import { Provider } from '@/shared/ui/provider';

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
      <Provider>
        <body>{children}</body>
      </Provider>
    </html>
  );
}
