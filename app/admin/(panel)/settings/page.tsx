export default function AdminSettingsPage() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-secondary">CMS Phase 2</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-950">Site Settings</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Site settings will manage company name, phone, WhatsApp, email, GSTIN,
        address, map query, and social links from Firestore.
      </p>
    </section>
  );
}
