import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import { siteSettings } from '@/lib/siteData';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-bold">REMISHINE Healthcare</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Pharmaceutical marketer, wholesaler, and distributor with a specialty portfolio across bone health, rheumatology, and pain management.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            GSTIN: <span className="font-medium text-slate-200">{siteSettings.gstin}</span>
          </p>
        </div>
        <div>
          <p className="font-semibold">Company</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link href="/about" className="hover:text-white">About Us</Link>
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <div className="mt-3 grid gap-3 text-sm text-slate-300">
            <a href={siteSettings.phoneHref} className="flex items-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" />
              {siteSettings.phone}
            </a>
            <a href={siteSettings.emailHref} className="flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              {siteSettings.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-sm text-slate-400">
        Copyright 2026 Remishine Healthcare. All rights reserved. GSTIN: {siteSettings.gstin}
      </div>
    </footer>
  );
}
