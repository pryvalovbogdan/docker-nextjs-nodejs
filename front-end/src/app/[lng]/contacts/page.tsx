import { connection } from 'next/server';

import ContactView from '@/views/contact-view';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  return generateMetadataGeneral(lng);
}

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  await connection();

  console.log(
    'GOOGLE_MAPS_API_KEY server',
    process.env,
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    process.env.GOOGLE_MAPS_API_KEY,
  );

  return (
    <ContactView
      lng={lng}
      googleKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || ''}
    />
  );
}
