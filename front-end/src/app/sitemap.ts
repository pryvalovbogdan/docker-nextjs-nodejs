import { MetadataRoute } from 'next';

import { fetchWrapper } from '@/shared/api/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BACKEND_URL;
  const domain = process.env.DOMAIN_URL;

  const [categories, products] = await Promise.all([
    fetchWrapper(`${baseUrl}/api/categories`),
    fetchWrapper(`${baseUrl}/api/products`),
  ]);

  const staticRoutes = ['', 'brand', 'contacts', 'about'].map(path => ({
    url: `${domain}/uk/${path}`,
    lastModified: new Date().toISOString(),
    priority: 1,
    changeFrequency: 'monthly',
  }));

  const categoryRoutes = categories.data
    .filter((name: string | null): name is string => Boolean(name))
    .map((category: string) => ({
      url: `${domain}/uk/category/${encodeURIComponent(category)}`,
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

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
