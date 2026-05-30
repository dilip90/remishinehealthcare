import { Metadata } from 'next';
import { AlertCircle, FileText, Mail, Phone } from 'lucide-react';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { pageMetadata } from '@/lib/seo';
import { siteSettings } from '@/lib/siteData';

export const metadata: Metadata = pageMetadata({
  title: 'Disclaimer - Remishine Healthcare',
  description:
    'Read the Remishine Healthcare website disclaimer for product portfolio information, professional communication, and healthcare-related content.',
  path: '/disclaimer',
});

const notices = [
  {
    title: 'General Information Only',
    body: 'The information on this website is provided for general business and product portfolio awareness. It should not be treated as medical advice, diagnosis, treatment guidance, or a substitute for consultation with a qualified healthcare professional.',
  },
  {
    title: 'Professional Use',
    body: 'Product information is intended for communication with healthcare professionals, pharmaceutical trade partners, distributors, and relevant business stakeholders. Product use must follow the advice of a registered medical practitioner and applicable prescribing information.',
  },
  {
    title: 'Product Availability',
    body: 'Product names, compositions, strengths, pack sizes, images, and availability may change without prior notice. Please contact Remishine Healthcare directly for current product and trade information.',
  },
  {
    title: 'Regulatory Compliance',
    body: 'All pharmaceutical products must be marketed, supplied, stored, and used in accordance with applicable laws, regulations, and professional guidelines. Nothing on this website should be interpreted as promotion beyond permitted usage.',
  },
  {
    title: 'External Links',
    body: 'This website may include links to third-party services such as maps, WhatsApp, email, or external resources. Remishine Healthcare is not responsible for the content, privacy practices, or availability of third-party platforms.',
  },
  {
    title: 'Limitation of Liability',
    body: 'While we aim to keep website information accurate and updated, Remishine Healthcare does not guarantee completeness or error-free content. Users should verify important product or business details before making decisions.',
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Legal Information
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-5xl">Disclaimer</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Please read this disclaimer carefully before using the Remishine Healthcare
            website or relying on any product-related information presented here.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-soft text-secondary">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">Important notice</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Website content is informational and business-oriented. Patients should
              always consult a qualified healthcare professional before using any medicine.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <a href={siteSettings.phoneHref} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" />
                {siteSettings.phone}
              </a>
              <a href={siteSettings.emailHref} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" />
                {siteSettings.email}
              </a>
            </div>
          </aside>

          <div className="space-y-4">
            {notices.map((notice) => (
              <article key={notice.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">{notice.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{notice.body}</p>
              </article>
            ))}

            <article className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-950">Contact for Clarification</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                For current product details, availability, or business communication,
                contact Remishine Healthcare directly through the official phone, WhatsApp,
                or email channels listed on this website.
              </p>
            </article>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
