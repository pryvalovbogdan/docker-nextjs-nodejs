import { MetadataRoute } from 'next';
import { connection } from 'next/server';

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/sitemap.xml`,
  };
}
