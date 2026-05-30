import type { Metadata } from 'next';
import './globals.css';
import SiteHeaderGate from '@/components/SiteHeaderGate';
import { organizationJsonLd, pageMetadata, seoDefaults, siteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({
    title: seoDefaults.title,
    description: seoDefaults.description,
  }),
  applicationName: 'Remishine Healthcare',
  category: 'Healthcare',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <SiteHeaderGate />
        {children}
      </body>
    </html>
  );
}
