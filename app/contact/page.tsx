import { Metadata } from 'next';
import { BadgeCheck, Mail, MapPin, Phone } from 'lucide-react';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import EnquiryForm from '@/components/EnquiryForm';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { pageMetadata } from '@/lib/seo';
import { siteSettings } from '@/lib/siteData';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Remishine Healthcare - Product Enquiries & Trade Support',
  description:
    'Contact Remishine Healthcare for product enquiries, pricing information, availability, wholesale, and pharmaceutical distribution support.',
  path: '/contact',
  keywords: ['contact Remishine Healthcare', 'product enquiry', 'pharmaceutical distribution support'],
});

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteSettings.mapQuery)}&output=embed`;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Contact Remishine Healthcare
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-5xl">Product enquiries and support</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Reach out for product details, pricing discussions, availability, or distribution partnerships.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-4">
            <a
              href={siteSettings.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-secondary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">WhatsApp</span>
                <span className="font-semibold text-slate-950">{siteSettings.phone}</span>
              </span>
            </a>

            <a
              href={siteSettings.phoneHref}
              className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-primary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Phone className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">Phone</span>
                <span className="font-semibold text-slate-950">{siteSettings.phone}</span>
              </span>
            </a>

            <a
              href={siteSettings.emailHref}
              className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-secondary"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
                <Mail className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">Email</span>
                <span className="font-semibold text-slate-950">{siteSettings.email}</span>
              </span>
            </a>

            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary-soft text-secondary-dark">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">GSTIN</span>
                <span className="font-semibold text-slate-950">{siteSettings.gstin}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-slate-500">Map</span>
                <span className="font-semibold text-slate-950">Remishine Healthcare</span>
              </span>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </section>

      <section className="pb-14 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <iframe
              title="Remishine Healthcare location map"
              src={mapSrc}
              className="h-[360px] w-full border-0 sm:h-[440px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
