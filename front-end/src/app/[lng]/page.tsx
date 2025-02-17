import BrandsSection from '@/views/BrandSection';
import ContactForm from '@features/contact/send-request/contact-form';
import { fallbackLng, languages } from '@i18n/settings';
import Gallery from '@widgets/gallary/gallary';
import Layout from '@widgets/layout/layout';

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  return (
    <Layout lng={lng}>
      <Gallery lng={lng} />
      <BrandsSection lng={lng} />
      <ContactForm lng={lng} />
    </Layout>
  );
}
