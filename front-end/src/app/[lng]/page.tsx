import BrandsSection from '@/views/BrandSection';
import ContactSection from '@/views/ContactSections';
import ImageSendForm from '@features/product/add-product/ImageSendForm';
import { fallbackLng, languages } from '@i18n/settings';
import Layout from '@widgets/layout/layout';

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  return (
    <Layout lng={lng}>
      <BrandsSection lng={lng} />
      <ContactSection lng={lng} />
      <ImageSendForm />
    </Layout>
  );
}
