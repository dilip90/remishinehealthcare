import { Metadata } from 'next';
import { Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { pageMetadata } from '@/lib/seo';
import { siteSettings } from '@/lib/siteData';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy - Remishine Healthcare',
  description:
    'Read the Remishine Healthcare privacy policy covering website enquiries, contact details, and business communication data handling.',
  path: '/privacy-policy',
});

const sections = [
  {
    title: 'Information We Collect',
    body: 'We may collect basic contact information such as name, phone number, email address, company details, location, product interest, and enquiry message when you contact us through this website, WhatsApp, phone, email, or enquiry forms.',
  },
  {
    title: 'How We Use Information',
    body: 'Information shared with us is used to respond to enquiries, provide product or business information, coordinate trade communication, improve website experience, and maintain business records where required.',
  },
  {
    title: 'Information Sharing',
    body: 'We do not sell personal information. Information may be shared only with authorized team members, service providers, or business partners when needed to respond to your enquiry or comply with applicable legal and regulatory requirements.',
  },
  {
    title: 'Data Security',
    body: 'We take reasonable administrative and technical measures to protect information shared with us. However, no online transmission or storage system can be guaranteed to be fully secure.',
  },
  {
    title: 'Cookies and Website Data',
    body: 'This website may use basic technical data such as browser type, device information, and pages visited to understand site performance and improve user experience.',
  },
  {
    title: 'Your Choices',
    body: 'You may request correction, update, or deletion of your contact information by reaching out to us using the contact details provided on this page.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Legal Information
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Remishine Healthcare respects the privacy of visitors, healthcare professionals,
            trade partners, and business contacts who interact with our website and enquiry channels.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-950">Our privacy commitment</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              We use submitted information only for legitimate business communication,
              enquiry handling, and compliance needs.
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
            {sections.map((section) => (
              <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
              </article>
            ))}

            <article className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-slate-950">Policy Updates</h2>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                This policy may be updated from time to time to reflect operational, legal,
                or website changes. The latest version published on this page will apply.
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
