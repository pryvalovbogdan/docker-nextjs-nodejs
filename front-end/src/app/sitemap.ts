import { MetadataRoute } from 'next';

import { fetchWrapper } from '@/shared/api/client';

type Product = {
  id: number;
  title: string;
  images?: { url: string }[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
  const domain = process.env.DOMAIN_URL || process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://medix.com.ua';

  const staticRoutes = ['', 'brand', 'contacts', 'about'].map(path => ({
    url: `${domain}/uk/${path}${baseUrl}`,
    lastModified: new Date().toISOString(),
    priority: 1,
    changeFrequency: 'monthly',
  })) as MetadataRoute.Sitemap;

  try {
    console.log('baseUrl', baseUrl, domain);

    const [categories, products] = await Promise.all([
      fetchWrapper<{ data: any }>(`${baseUrl}/api/categories`),
      fetchWrapper<{ data: Product[] }>(`${baseUrl}/api/products`),
    ]);

    console.log('categories', categories, products);

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

    console.log('categoryRoutes', categoryRoutes);

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (e) {
    console.error('Error generating sitemap:', e);

    staticRoutes.push({
      url: `Error generating sitemap:`,
      lastModified: new Date().toISOString(),
      priority: 1,
      changeFrequency: 'monthly',
    });

    return [...staticRoutes];
  }
}
