import { MetadataRoute } from 'next';
import { connection } from 'next/server';

import { ICategoryResponse } from '@/entities/category/model/types';
import { fetchWrapper } from '@/shared/api/client';

type Product = {
  id: number;
  title: string;
  images?: { url: string }[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const domain = process.env.NEXT_PUBLIC_DOMAIN_URL;

  const staticRoutes = ['', 'brand', 'contacts', 'about'].map(path => ({
    url: `${domain}/uk/${path}`,
    lastModified: new Date().toISOString(),
    priority: 1,
    changeFrequency: 'monthly',
  })) as MetadataRoute.Sitemap;

  try {
    const [categories, products] = await Promise.all([
      fetchWrapper<{ data: ICategoryResponse[] }>(`${baseUrl}/api/subcategories`),
      fetchWrapper<{ data: Product[] }>(`${baseUrl}/api/products`),
    ]);

    const categoriesRoutes = categories.data.flatMap((c: ICategoryResponse) => ({
      url: `${domain}/uk/categories/${encodeURIComponent(String(c.path))}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'monthly',
    }));

    const categoryRoutes = categories.data.flatMap((c: ICategoryResponse) => ({
      url: `${domain}/uk/category/${encodeURIComponent(String(c.path))}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'monthly',
    }));

    const productRoutes = products.data.map((product: { id: number }) => ({
      url: `${domain}/uk/product/${product.id}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'weekly',
    }));

    const subCategoryRoutes = categories.data.flatMap((c: ICategoryResponse) => {
      if (!c?.path) return [];

      const base = `${domain}/uk/categories/${encodeURIComponent(String(c.path))}`;

      return (c.subCategories || [])
        .filter(s => !!s?.path)
        .map(s => ({
          url: `${base}/sub-category/${encodeURIComponent(String(s.path))}`,
          lastModified: new Date().toISOString(),
          priority: 0.7,
          changeFrequency: 'monthly',
        }));
    });

    return [...staticRoutes, ...categoriesRoutes, ...subCategoryRoutes, ...categoryRoutes, ...productRoutes];
  } catch (e) {
    console.error('Error generating sitemap:', e);

    staticRoutes.push({
      url: `Error generating sitemap: ${e}`,
      lastModified: new Date().toISOString(),
      priority: 1,
      changeFrequency: 'monthly',
    });

    return [...staticRoutes];
  }
}
