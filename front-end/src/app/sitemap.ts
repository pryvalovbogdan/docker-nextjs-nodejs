import { MetadataRoute } from 'next';
import { connection } from 'next/server';

import { ICategoryResponse } from '@/entities/category/model/types';
import { fetchWrapper } from '@/shared/api/client';

type Product = {
  id: number;
  title: string;
  images?: { url: string }[];
};

function ensureNoTrailingSlash(u?: string) {
  return (u || '').replace(/\/+$/, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const domain = ensureNoTrailingSlash(process.env.NEXT_PUBLIC_DOMAIN_URL);

  if (!domain) {
    console.error('Missing NEXT_PUBLIC_DOMAIN_URL environment variable. Sitemap generation aborted.');
  }

  const staticRoutes = ['', 'brand', 'contacts', 'about'].map(path => ({
    url: `${domain}/uk/${path}`,
    lastModified: new Date().toISOString(),
    priority: 1,
    changeFrequency: 'monthly',
  })) as MetadataRoute.Sitemap;

  try {
    const [categories, products] = await Promise.all([
      fetchWrapper<{ data: ICategoryResponse[] }>(`${domain}/api/subcategories`),
      fetchWrapper<{ data: Product[] }>(`${domain}/api/products`),
    ]);

    const categoriesRoutes = categories.data.flatMap((c: ICategoryResponse) => ({
      url: `${domain}/uk/categories/${encodeURIComponent(String(c.path))}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })) as MetadataRoute.Sitemap;

    const categoryRoutes = categories.data.flatMap((c: ICategoryResponse) => ({
      url: `${domain}/uk/category/${encodeURIComponent(String(c.path))}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })) as MetadataRoute.Sitemap;

    const productRoutes = products.data.map((product: { id: number }) => ({
      url: `${domain}/uk/product/${product.id}`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
      changeFrequency: 'weekly' as const,
    })) as MetadataRoute.Sitemap;

    const subCategoryRoutes = categories.data.flatMap((c: ICategoryResponse) => {
      if (!c?.path) return [];

      const base = `${domain}/uk/categories/${encodeURIComponent(String(c.path))}`;

      return (c.subCategories || [])
        .filter(s => !!s?.path)
        .map(s => ({
          url: `${base}/sub-category/${encodeURIComponent(String(s.path))}`,
          lastModified: new Date().toISOString(),
          priority: 0.7,
          changeFrequency: 'monthly' as const,
        }));
    }) as MetadataRoute.Sitemap;

    return [...staticRoutes, ...categoriesRoutes, ...subCategoryRoutes, ...categoryRoutes, ...productRoutes];
  } catch (e) {
    console.error('Error generating sitemap:', e);

    staticRoutes.push({
      url: `Error generating sitemap: ${e} + ${process.env.NEXT_PUBLIC_DOMAIN_URL} +`,
      lastModified: new Date().toISOString(),
      priority: 1,
      changeFrequency: 'monthly',
    });

    return [...staticRoutes];
  }
}
