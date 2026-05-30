'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { onSnapshot, orderBy, query as firestoreQuery, where } from 'firebase/firestore';
import { firebaseCollections, type ProductDocument } from '@/lib/firebaseCollections';
import { products as staticProducts, therapeuticSegments } from '@/lib/siteData';

const allCategory = 'All';
type CmsProduct = ProductDocument & { id: string };

export default function ProductCatalog() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(allCategory);
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productsQuery = firestoreQuery(
      firebaseCollections.products,
      where('isActive', '==', true),
      orderBy('sortOrder', 'asc')
    );

    return onSnapshot(
      productsQuery,
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

  const products = useMemo(() => {
    if (!cmsProducts?.length) {
      return staticProducts.map((product) => ({
        ...product,
        href: `/products/${product.id}`,
        actionLabel: 'View product',
        imageUrl: '',
      }));
    }

    return cmsProducts.map((product) => ({
      id: product.slug,
      href: `/products/details?id=${encodeURIComponent(product.slug)}`,
      actionLabel: 'View product',
      name: product.name,
      category: product.categoryName,
      composition: product.composition,
      strength: product.strength,
      packSize: product.packSize,
      description: product.description,
      featured: product.isFeatured,
      imageUrl: product.imageUrl || '',
    }));
  }, [cmsProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === allCategory || product.category === activeCategory;

      const searchableText = [
        product.name,
        product.category,
        product.composition,
        product.strength,
        product.description,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [activeCategory, products, query]);

  return (
    <>
      <section className="border-b border-slate-100 bg-white py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <label className="flex min-h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-500 shadow-sm focus-within:border-primary">
            <Search className="h-5 w-5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product, composition, or focus"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <div className="flex flex-wrap gap-2">
            {[allCategory, ...therapeuticSegments.map((segment) => segment.title)].map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-primary hover:text-primary'
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">
              {isLoading ? 'Loading products...' : `Showing ${filteredProducts.length} of ${products.length} products`}
            </p>
            {(query || activeCategory !== allCategory) ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveCategory(allCategory);
                }}
                className="text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Reset filters
              </button>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="h-28 w-full animate-pulse rounded-lg bg-slate-100" />
                  <div className="mt-5 h-4 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-6 w-44 animate-pulse rounded bg-slate-100" />
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                  </div>
                  <div className="mt-6 h-4 w-28 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={product.href}
                  className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-primary-soft text-2xl font-bold text-primary">
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
                  <h2 className="mt-2 text-xl font-bold text-slate-950">{product.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-primary-dark">
                    {product.actionLabel}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <h2 className="text-xl font-bold text-slate-950">No products found</h2>
              <p className="mt-2 text-sm text-slate-600">
                Try a different search term or therapeutic focus.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
