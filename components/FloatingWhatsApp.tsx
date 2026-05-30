import { siteSettings } from '@/lib/siteData';
import WhatsAppIcon from './WhatsAppIcon';

export default function FloatingWhatsApp() {
  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      <a
        href={siteSettings.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        aria-label="Contact Remishine Healthcare on WhatsApp"
        title="Contact us on WhatsApp"
      >
        <WhatsAppIcon className="h-8 w-8" />
      </a>
    </div>
  );
}
