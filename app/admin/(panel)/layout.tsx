import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
