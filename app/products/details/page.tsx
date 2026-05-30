'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { limit, onSnapshot, query, where } from 'firebase/firestore';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { firebaseCollections, type ProductDocument } from '@/lib/firebaseCollections';
import { siteSettings } from '@/lib/siteData';

type ProductRow = ProductDocument & { id: string };

function getProductId() {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.search).get('id') || '';
}

export default function ProductDetailsPage() {
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = getProductId();
    setProductId(id);

    if (!id) {
      setIsLoading(false);
      return;
    }

    const productQuery = query(
      firebaseCollections.products,
      where('slug', '==', id),
      limit(1)
    );

    return onSnapshot(
      productQuery,
      (snapshot) => {
        const firstProduct = snapshot.docs[0];
        const productData = firstProduct ? { id: firstProduct.id, ...firstProduct.data() } : null;
        setProduct(productData?.isActive ? productData : null);
        setIsLoading(false);
      },
      () => {
        setProduct(null);
        setIsLoading(false);
      }
    );
  }, []);

  const whatsappProductHref = useMemo(() => {
    const name = product?.name || productId || 'product';
    return `${siteSettings.whatsappHref}?text=${encodeURIComponent(`Enquiry about ${name}`)}`;
  }, [product, productId]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <section className="bg-slate-50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        </section>

        <section className="py-14 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="rounded-lg border border-slate-200 bg-primary-soft p-8">
              <div className="aspect-square max-h-[420px] animate-pulse rounded-lg bg-white" />
            </div>
            <div>
              <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 h-12 w-72 max-w-full animate-pulse rounded bg-slate-100" />
              <div className="mt-6 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-5 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-3">
                <div className="h-11 w-36 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 w-28 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <FloatingWhatsApp />
      </main>
    );
  }

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
            <div className="flex aspect-square max-h-[420px] items-center justify-center overflow-hidden rounded-lg bg-white text-6xl font-bold text-primary shadow-sm">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-4" />
              ) : (
                product.name.slice(0, 2).toUpperCase()
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {product.categoryName}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-base leading-7 text-slate-600">{product.description}</p>

            <div className="mt-8 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Composition</p>
                <p className="mt-2 font-semibold text-slate-950">{product.composition || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Strength</p>
                <p className="mt-2 font-semibold text-slate-950">{product.strength || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pack Size</p>
                <p className="mt-2 font-semibold text-slate-950">{product.packSize || '-'}</p>
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
