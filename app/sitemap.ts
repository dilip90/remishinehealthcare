import type { MetadataRoute } from 'next';
import { products } from '@/lib/siteData';
import { siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/about', '/products', '/contact', '/privacy-policy', '/disclaimer'];
  const productRoutes = products.map((product) => `/products/${product.id}`);

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.7,
  }));
}
