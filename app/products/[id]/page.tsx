import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { products, siteSettings } from '@/lib/siteData';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} - Remishine Healthcare`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <section className="py-20 text-center">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </section>
        <Footer />
        <FloatingWhatsApp />
      </main>
    );
  }

  const whatsappProductHref = `${siteSettings.whatsappHref}?text=${encodeURIComponent(
    `Enquiry about ${product.name}`
  )}`;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-primary-soft p-8">
            <div className="flex aspect-square max-h-[420px] items-center justify-center rounded-lg bg-white text-6xl font-bold text-primary shadow-sm">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-base leading-7 text-slate-600">{product.description}</p>

            <div className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Composition</p>
                <p className="mt-2 font-semibold text-slate-950">{product.composition}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strength</p>
                <p className="mt-2 font-semibold text-slate-950">{product.strength}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pack Size</p>
                <p className="mt-2 font-semibold text-slate-950">{product.packSize}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappProductHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary-dark"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Enquiry
              </a>
              <a
                href={siteSettings.phoneHref}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
