'use client';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import {
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { firebaseCollections, type EnquiryDocument } from '@/lib/firebaseCollections';

type EnquiryRow = Omit<EnquiryDocument, 'createdAt'> & {
  id: string;
  createdAt?: Timestamp;
};

const rowsPerPage = 10;

function formatDate(value?: Timestamp) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value.toDate());
}

function statusClass(status: EnquiryRow['status']) {
  if (status === 'closed') {
    return 'bg-slate-100 text-slate-600';
  }

  if (status === 'contacted') {
    return 'bg-primary-soft text-primary';
  }

  return 'bg-secondary-soft text-secondary-dark';
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [queryText, setQueryText] = useState('');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError('');

    const enquiriesQuery = query(
      firebaseCollections.enquiries,
      orderBy('createdAt', sortDirection),
    );

    const unsubscribe = onSnapshot(
      enquiriesQuery,
      (snapshot) => {
        setEnquiries(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as EnquiryRow)));
        setIsLoading(false);
      },
      () => {
        setError('Unable to load enquiries. Please verify Firestore rules and indexes.');
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [sortDirection]);

  const filteredEnquiries = useMemo(() => {
    const normalized = queryText.trim().toLowerCase();

    if (!normalized) {
      return enquiries;
    }

    return enquiries.filter((enquiry) =>
      [enquiry.name, enquiry.phone, enquiry.email, enquiry.message, enquiry.status]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [enquiries, queryText]);

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const startRow = filteredEnquiries.length ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = Math.min(currentPage * rowsPerPage, filteredEnquiries.length);
  const paginatedIds = paginatedEnquiries.map((enquiry) => enquiry.id);
  const isPageSelected =
    paginatedIds.length > 0 && paginatedIds.every((id) => selectedIds.includes(id));

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [queryText, sortDirection]);

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  }

  function togglePageSelected() {
    setSelectedIds((current) => {
      if (isPageSelected) {
        return current.filter((id) => !paginatedIds.includes(id));
      }

      return Array.from(new Set([...current, ...paginatedIds]));
    });
  }

  async function updateStatus(enquiry: EnquiryRow, status: EnquiryRow['status']) {
    try {
      await updateDoc(doc(firebaseCollections.enquiries, enquiry.id), { status });
    } catch {
      setError('Unable to update enquiry status. Please verify admin permissions.');
    }
  }

  async function deleteSelected() {
    if (!selectedIds.length) {
      return;
    }

    const confirmed = window.confirm(`Delete ${selectedIds.length} selected enquiry records?`);

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await Promise.all(
        selectedIds.map((id) => deleteDoc(doc(firebaseCollections.enquiries, id))),
      );
      setSelectedIds([]);
    } catch {
      setError('Unable to delete selected enquiries. Please verify admin permissions.');
    } finally {
      setIsDeleting(false);
    }
  }

  function exportCsv() {
    const exportRows = filteredEnquiries.map((enquiry) => ({
      Name: enquiry.name,
      Phone: enquiry.phone,
      Email: enquiry.email || '',
      Message: enquiry.message,
      Status: enquiry.status,
      Date: formatDate(enquiry.createdAt),
    }));

    const headers = ['Name', 'Phone', 'Email', 'Message', 'Status', 'Date'];
    const csv = [
      headers.join(','),
      ...exportRows.map((row) =>
        headers
          .map((header) => {
            const value = row[header as keyof typeof row];
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'remishine-enquiries.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Lead inbox</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Enquiries</h1>
          <p className="mt-2 text-sm text-slate-600">
            View customer enquiries, sort by date, and track follow-up status.
          </p>
        </div>
        <label className="flex min-h-11 w-full max-w-sm items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-primary">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={queryText}
            onChange={(event) => setQueryText(event.target.value)}
            placeholder="Search enquiries"
            className="w-full bg-transparent text-sm text-slate-950 outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm font-semibold text-slate-600">
          {selectedIds.length ? `${selectedIds.length} selected` : `${filteredEnquiries.length} enquiries`}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filteredEnquiries.length}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Export CSV / Excel
          </button>
          <button
            type="button"
            onClick={deleteSelected}
            disabled={!selectedIds.length || isDeleting}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isPageSelected}
                    onChange={togglePageSelected}
                    aria-label="Select all enquiries on this page"
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-primary"
                  >
                    Date {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
                    <ChevronsUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="align-top">
                    <td className="px-4 py-4">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-3">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="max-w-md space-y-2">
                        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : paginatedEnquiries.length ? (
                paginatedEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="align-top">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(enquiry.id)}
                        onChange={() => toggleSelected(enquiry.id)}
                        aria-label={`Select enquiry from ${enquiry.name}`}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-950">{enquiry.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-2 text-slate-600">
                        <a href={`tel:${enquiry.phone}`} className="flex items-center gap-2 hover:text-primary">
                          <Phone className="h-4 w-4" />
                          {enquiry.phone}
                        </a>
                        {enquiry.email ? (
                          <a href={`mailto:${enquiry.email}`} className="flex items-center gap-2 hover:text-primary">
                            <Mail className="h-4 w-4" />
                            {enquiry.email}
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 text-slate-400">
                            <Mail className="h-4 w-4" />
                            No email
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex max-w-md gap-2 text-slate-600">
                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                        <p className="line-clamp-4 whitespace-pre-line leading-6">{enquiry.message}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={enquiry.status}
                        onChange={(event) => updateStatus(enquiry, event.target.value as EnquiryRow['status'])}
                        className={`rounded-full border-0 px-3 py-1 text-xs font-bold outline-none ${statusClass(enquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                      {formatDate(enquiry.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-semibold text-slate-500">
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-500">
            Showing {startRow}-{endRow} of {filteredEnquiries.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-24 text-center text-sm font-bold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
