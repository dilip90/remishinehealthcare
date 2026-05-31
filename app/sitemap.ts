import type { MetadataRoute } from 'next';
import { products } from '@/lib/siteData';

const siteUrl = 'https://remishinehealthcare.com';

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date().toISOString();
  const staticRoutes = ['/', '/about', '/products', '/contact', '/privacy-policy', '/disclaimer'];
  const productRoutes = products.map(
    (product) => `/products/details?id=${encodeURIComponent(createSlug(product.name))}`
  );

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: route === '/' ? `${siteUrl}/` : `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/products' ? 0.9 : 0.7,
  }));
}
