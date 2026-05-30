'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { firebaseCollections, type ProductDocument } from '@/lib/firebaseCollections';
import { products as staticProducts } from '@/lib/siteData';

type CmsProduct = ProductDocument & { id: string };

export default function FeaturedProducts() {
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const featuredProductsQuery = query(
      firebaseCollections.products,
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );

    return onSnapshot(
      featuredProductsQuery,
      (snapshot) => {
        setCmsProducts(
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );
        setIsLoading(false);
      },
      () => {
        setCmsProducts([]);
        setIsLoading(false);
      }
    );
  }, []);

  const featuredProducts = useMemo(() => {
    if (!cmsProducts?.length) {
      return staticProducts.filter((product) => product.featured).slice(0, 6).map((product) => ({
        id: product.id,
        href: `/products/${product.id}`,
        actionLabel: 'View details',
        name: product.name,
        category: product.category,
        description: product.description,
        imageUrl: '',
      }));
    }

    return cmsProducts.filter((product) => product.isFeatured).slice(0, 6).map((product) => ({
      id: product.slug,
      href: `/products/details?id=${encodeURIComponent(product.slug)}`,
      actionLabel: 'View details',
      name: product.name,
      category: product.categoryName,
      description: product.description,
      imageUrl: product.imageUrl || '',
    }));
  }, [cmsProducts]);

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-28 w-full animate-pulse rounded-lg bg-slate-100" />
              <div className="mt-5 h-4 w-28 animate-pulse rounded bg-slate-100" />
              <div className="mt-3 h-6 w-40 animate-pulse rounded bg-slate-100" />
              <div className="mt-4 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="mt-6 h-4 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          ))
        : null}
      {!isLoading && featuredProducts.map((product) => (
        <Link
          key={product.id}
          href={product.href}
          className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
        >
          <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-primary-soft text-xl font-bold text-primary">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              product.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <p className="mt-5 text-sm font-semibold text-secondary">{product.category}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-950">{product.name}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-primary-dark">
            {product.actionLabel}
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}
