import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Building2, HeartPulse, PackageCheck, Users } from 'lucide-react';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { pageMetadata } from '@/lib/seo';
import { siteSettings, therapeuticSegments } from '@/lib/siteData';

export const metadata: Metadata = pageMetadata({
  title: 'About Remishine Healthcare - Pharmaceutical Marketing & Distribution',
  description:
    'Learn about Remishine Healthcare, a pharmaceutical marketer, wholesaler, and distributor focused on specialty healthcare products and trade support.',
  path: '/about',
  keywords: ['about Remishine Healthcare', 'pharmaceutical trade support'],
});

const profile = [
  {
    title: 'Pharmaceutical Marketing',
    description: 'Clear product communication and trade support for specialty healthcare needs.',
    icon: Building2,
  },
  {
    title: 'Wholesale Supply',
    description: 'Reliable product availability for healthcare and pharmaceutical trade partners.',
    icon: PackageCheck,
  },
  {
    title: 'Distribution Support',
    description: 'Responsive coordination for enquiries, product details, and portfolio discussions.',
    icon: Users,
  },
  {
    title: 'Specialty Focus',
    description: 'Portfolio emphasis across bone health, rheumatology, and pain management.',
    icon: HeartPulse,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            About Remishine Healthcare
          </p>
          <h1 className="mt-2 max-w-4xl text-3xl font-bold leading-tight text-slate-950 sm:text-5xl">
            A focused pharmaceutical partner for specialty healthcare products.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Remishine Healthcare works as a pharmaceutical marketer, wholesaler, and
            distributor with a product-centric approach. Our goal is to support healthcare
            professionals and trade partners with focused products, quick communication,
            and dependable portfolio information.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {profile.map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-bold text-slate-950">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Therapeutic focus
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Portfolio built for clear positioning</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The portfolio is intentionally focused, making it easier for healthcare
              professionals and partners to understand Remishine's core therapeutic areas.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {therapeuticSegments.map((segment) => (
              <div key={segment.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-primary">{segment.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Connect with Remishine Healthcare</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              For product information, trade enquiries, or distribution conversations,
              contact the team directly through phone, email, or WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={siteSettings.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary-dark"
            >
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Contact Page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
