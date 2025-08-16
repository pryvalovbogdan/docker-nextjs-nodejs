import { ICategoryResponse } from '@/entities/category/model/types';
import SubCategoryGrid from '@/entities/category/ui/SubCategoryGrid';
import { IProductResponse } from '@/entities/product/model/types';
import { ItemListJsonLd } from '@/shared/ui';
import { Catalog, Layout, WhyUs } from '@/widgets';
import { ContactButton } from '@features/contact';

const CategoriesView = ({
  lng,
  products,
  categories,
  category,
  subcategory,
  totalPages,
}: {
  lng: string;
  products: IProductResponse[];
  categories: ICategoryResponse[];
  category?: string;
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
      origin={process.env.NEXT_PUBLIC_DOMAIN_URL}
    >
      <SubCategoryGrid
        categories={categories}
        category={category}
        subcategory={subcategory}
        lng={lng}
        products={products}
      />
      <ItemListJsonLd
        lng={lng}
        products={products.map(p => ({ id: p.id }))}
        origin={process.env.NEXT_PUBLIC_DOMAIN_URL}
      />

      <div>
        {!!categories.length && (
          <Catalog
            lng={lng}
            products={{ data: products, totalPages }}
            categories={categories}
            category={category}
            subcategory={subcategory}
          />
        )}
      </div>

      <WhyUs lng={lng} withHeading />
      <ContactButton lng={lng} />
    </Layout>
  );
};

export default CategoriesView;
