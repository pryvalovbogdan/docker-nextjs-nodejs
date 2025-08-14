'use client';

import Script from 'next/script';

type MinimalProduct = { id: number | string; slug?: string };

function buildItemListJsonLd(opts: {
  products: MinimalProduct[];
  lng: string;
  origin?: string;
  page?: number;
  pageSize?: number;
}) {
  const { products, lng, origin, page = 1, pageSize = products.length || 1 } = opts;

  const startIndex = (page - 1) * pageSize;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: startIndex + i + 1,
      url: `${origin}/${lng}/product/${p.slug ?? p.id}`,
    })),
  };
}

type Props = {
  lng: string;
  products: MinimalProduct[];
  origin?: string;
  page?: number;
  pageSize?: number;
  scriptId?: string;
};

export default function ItemListJsonLd({ lng, products, origin, page, pageSize, scriptId = 'ld-itemlist' }: Props) {
  if (!products?.length) return null;

  const json = buildItemListJsonLd({ products, lng, origin, page, pageSize });

  return (
    <Script
      id={scriptId}
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
