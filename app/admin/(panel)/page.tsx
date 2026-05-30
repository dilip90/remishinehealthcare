'use client';

import Link from 'next/link';
import { collection, getCountFromServer } from 'firebase/firestore';
import { BarChart3, Boxes, Tags } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';

type DashboardStats = {
  products: number;
  categories: number;
  enquiries: number;
};

const emptyStats: DashboardStats = {
  products: 0,
  categories: 3,
  enquiries: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoading(true);

      try {
        const [productsCount, enquiriesCount] = await Promise.all([
          getCountFromServer(collection(db, 'products')),
          getCountFromServer(collection(db, 'enquiries')),
        ]);

        if (!isMounted) {
          return;
        }

        setStats({
          products: productsCount.data().count,
          categories: 3,
          enquiries: enquiriesCount.data().count,
        });
      } catch {
        if (isMounted) {
          setStats(emptyStats);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Boxes, href: '/admin/products' },
    { label: 'Categories', value: stats.categories, icon: Tags, href: '/admin/products' },
    { label: 'Enquiries', value: stats.enquiries, icon: BarChart3, href: '/admin/enquiries' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Overview</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">
                    {isLoading ? '-' : card.value}
                  </p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">CMS Status</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Product catalog and enquiry management are connected with Firestore. The CMS is
          structured to support future reporting, lead tracking, product performance insights,
          admin activity history, and advanced content controls as the platform grows.
        </p>
      </section>
    </div>
  );
}
