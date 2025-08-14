import Script from 'next/script';
import React from 'react';

const GlobalStructuredData = ({
  origin,
  officePhone,
  officePhoneSecond,
  officeEmail,
}: {
  origin?: string;
  officePhone?: string;
  officePhoneSecond?: string;
  officeEmail?: string;
}) => {
  const ORIGIN = origin || '';
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: `${ORIGIN}/uk`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${ORIGIN}/uk/find/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: `${ORIGIN}/uk`,
    name: 'Медичне обладнання - Medix',
    email: officeEmail,
    logo: {
      '@type': 'ImageObject',
      url: `${ORIGIN}/logo.png`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вул. Тополева, 3',
      addressLocality: 'Київ',
      addressCountry: 'UA',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: officePhone,
        contactType: 'customer service',
        areaServed: 'UA',
        availableLanguage: ['uk', 'ru'],
      },
      {
        '@type': 'ContactPoint',
        telephone: officePhoneSecond,
        contactType: 'customer service',
        areaServed: 'UA',
        availableLanguage: ['uk', 'ru'],
      },
    ],
    sameAs: ['https://www.instagram.com/medix_._/', 'https://www.facebook.com/profile.php?id=61573713938332'],
  };

  const store = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Медичне обладнання - Medix',
    image: `${ORIGIN}/logo.png`,
    url: `${ORIGIN}/uk`,
    telephone: officePhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'вул. Тополева, 3',
      addressLocality: 'Київ',
      addressCountry: 'Україна',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '00:00',
        closes: '23:59',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  };

  return (
    <Script
      id='ld-website-organization-store'
      type='application/ld+json'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([website, organization, store]),
      }}
    />
  );
};

export default GlobalStructuredData;
