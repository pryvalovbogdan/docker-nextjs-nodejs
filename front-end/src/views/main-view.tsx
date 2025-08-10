import { ICategoryResponse } from '@/entities/category/model/types';
import { IProductResponse } from '@/entities/product/model/types';
import LastAddedProducts from '@/entities/product/ui/last-added-products';
import { BrandsCarousel, Catalog, GalleryImages, Layout, WhyUs } from '@/widgets';
import { ContactButton, ContactForm } from '@features/contact';

const MainView = ({
  lng,
  products,
  categories,
  category,
  lastAddedProducts,
  subcategory,
  totalPages,
}: {
  lng: string;
  products: IProductResponse[];
  categories: ICategoryResponse[];
  category?: string;
  lastAddedProducts: IProductResponse[];
  subcategory?: string;
  totalPages?: number;
}) => {
  return (
    <Layout
      lng={lng}
      officePhoneSecond={process.env.NEXT_PUBLIC_OFFICE_PHONE_SECOND!}
      officePhone={process.env.NEXT_PUBLIC_OFFICE_PHONE!}
      officeEmail={process.env.NEXT_PUBLIC_OFFICE_EMAIL!}
      categories={categories}
    >
      <GalleryImages lng={lng} />
      <Catalog
        lng={lng}
        products={{ data: products, totalPages }}
        categories={categories}
        category={category}
        subcategory={subcategory}
      />
      <BrandsCarousel lng={lng} />
      <LastAddedProducts products={lastAddedProducts} lng={lng} />
      <WhyUs lng={lng} withHeading />
      <ContactForm lng={lng} withMargin />
      <ContactButton lng={lng} />
    </Layout>
  );
};

export default MainView;
