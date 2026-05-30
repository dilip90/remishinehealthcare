import { Metadata } from 'next';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ProductCatalog from '@/components/ProductCatalog';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Pharmaceutical Product Portfolio - Remishine Healthcare',
  description:
    'Browse Remishine Healthcare products across bone health, osteoporosis care, rheumatology, pain management, and specialty pharmaceutical support.',
  path: '/products',
  keywords: ['pharmaceutical product portfolio', 'osteoporosis care', 'specialty medicines'],
});

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Product portfolio
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-5xl">Our Products</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            A focused specialty healthcare portfolio across bone health, rheumatology,
            and pain management.
          </p>
        </div>
      </section>

      <ProductCatalog />

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
