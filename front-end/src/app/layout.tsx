import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='uk'>
      <body>{children}</body>
    </html>
  );
}
