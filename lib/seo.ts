import type { Metadata } from 'next';
import { siteSettings } from './siteData';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://remishinehealthcare.com'
).replace(/\/$/, '');

export const seoDefaults = {
  siteName: 'Remishine Healthcare',
  title: 'Remishine Healthcare - Pharmaceutical Marketer, Wholesaler & Distributor',
  description:
    'Remishine Healthcare is a pharmaceutical marketer, wholesaler, and distributor focused on bone health, rheumatology, pain management, and specialty healthcare products.',
  keywords: [
    'Remishine Healthcare',
    'pharmaceutical marketer',
    'pharmaceutical wholesaler',
    'pharmaceutical distributor',
    'healthcare products',
    'bone health products',
    'rheumatology products',
    'pain management products',
    'Alendoz D3',
    'Remizorb',
    'HQ Shine',
    'Sulshine',
    'Remitrax',
    'Remicoxib',
  ],
};

export function pageMetadata({
  title,
  description,
  path = '/',
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    keywords: [...seoDefaults.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: seoDefaults.siteName,
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: '/icon.png',
          width: 512,
          height: 512,
          alt: seoDefaults.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/icon.png'],
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteSettings.companyName,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    email: siteSettings.email,
    telephone: siteSettings.phone,
    taxID: siteSettings.gstin,
    description: seoDefaults.description,
    sameAs: [siteSettings.whatsappHref],
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    knowsAbout: [
      'Pharmaceutical marketing',
      'Pharmaceutical wholesale',
      'Healthcare product distribution',
      'Bone health',
      'Rheumatology',
      'Pain management',
    ],
  };
}
