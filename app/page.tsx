import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Package, ShieldCheck, Truck, Users } from 'lucide-react';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import HeroSlider from '@/components/HeroSlider';
import { pageMetadata } from '@/lib/seo';
import { siteSettings, therapeuticSegments } from '@/lib/siteData';

export const metadata: Metadata = pageMetadata({
  title: 'Remishine Healthcare - Specialty Pharmaceutical Products',
  description:
    'Explore Remishine Healthcare, a pharmaceutical marketer, wholesaler, and distributor for bone health, rheumatology, pain management, and specialty healthcare products.',
});

const strengths = [
  {
    title: 'Specialty Portfolio',
    description: 'Focused products for bone health, rheumatology, and pain management.',
    icon: Package,
  },
  {
    title: 'Reliable Distribution',
    description: 'Responsive supply support for pharmacies, doctors, and trade partners.',
    icon: Truck,
  },
  {
    title: 'Quality Focus',
    description: 'Carefully curated pharmaceutical products for professional healthcare needs.',
    icon: ShieldCheck,
  },
  {
    title: 'Partner Support',
    description: 'Fast product information, enquiry handling, and WhatsApp-first communication.',
    icon: Users,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <HeroSlider />

      <section className="border-b border-slate-100 bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Pharmaceutical marketer, wholesaler, and distributor
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Specialty healthcare products for focused clinical care.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Remishine Healthcare delivers a focused portfolio across bone health,
              rheumatology, and pain management with dependable product support for
              healthcare professionals and trade partners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
              >
                View Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={siteSettings.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-secondary hover:text-secondary"
              >
                WhatsApp Enquiry
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              ['3', 'Therapeutic segments'],
              ['7+', 'Portfolio products'],
              ['24h', 'Quick response'],
              ['B2B', 'Trade support'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <p className="text-3xl font-bold text-primary">{value}</p>
                <p className="mt-2 text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Therapeutic focus
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Built around specialty care areas</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {therapeuticSegments.map((segment) => (
              <div key={segment.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-primary">{segment.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                Featured products
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">Product portfolio</h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark">
              Explore all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <FeaturedProducts />
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Why choose Remishine
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Professional support for healthcare trade</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              We keep the experience simple: clear product information, quick responses,
              and a focused portfolio that is easy to understand and discuss.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {strengths.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <item.icon className="h-6 w-6 text-secondary" />
                <h3 className="mt-4 font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-lg bg-primary p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-secondary-soft">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Fast product enquiries</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Need product details or trade support?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-soft">
                Connect with Remishine Healthcare for portfolio information, pricing enquiries,
                and distribution partnership discussions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteSettings.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary-soft"
              >
                WhatsApp Now
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
