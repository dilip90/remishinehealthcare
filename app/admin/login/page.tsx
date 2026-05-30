'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthProvider';

function AdminLoginForm() {
  const router = useRouter();
  const { user, isAdmin, isLoading, error, login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      router.replace('/admin');
    }
  }, [isAdmin, isLoading, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login(email.trim(), password);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Remishine CMS</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your authorized Firebase admin account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 focus-within:border-primary">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-950 outline-none"
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 focus-within:border-primary">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-950 outline-none"
                autoComplete="current-password"
                required
              />
            </span>
          </label>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <AdminLoginForm />
    </AdminAuthProvider>
  );
}
