import Layout from '@widgets/layout/layout';
import ImageSendForm from '@features/product/add-product/ImageSendForm';
import BrandsSection from '@/views/BrandSection';
import ContactSection from '@/views/ContactSections';
import { fallbackLng, languages } from '@i18n/settings';

export default async function Page({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params;

  if (!languages.includes(lng)) lng = fallbackLng;

  return (
    <Layout>
      <BrandsSection lng={lng} />
      <ContactSection lng={lng} />
      <ImageSendForm />
    </Layout>
  );
}
