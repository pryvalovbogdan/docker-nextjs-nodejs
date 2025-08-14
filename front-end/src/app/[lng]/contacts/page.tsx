import { connection } from 'next/server';

import { ContactView } from '@/views';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  return generateMetadataGeneral(lng);
}

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  await connection();

  return (
    <ContactView
      lng={lng}
      googleKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND || ''}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE || ''}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL || ''}
      origin={process.env.NEXT_PUBLIC_DOMAIN_URL}
    />
  );
}
