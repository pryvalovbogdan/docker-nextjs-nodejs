import LoginView from '@/views/login-view';
import { generateMetadataGeneral, generateStaticParams } from '@i18n/utils';

export { generateStaticParams };

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  return generateMetadataGeneral(lng);
}

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params;

  return <LoginView lng={lng} />;
}
