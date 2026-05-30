'use client';

import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import { Edit, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { firebaseCollections, type ProductDocument } from '@/lib/firebaseCollections';
import { products as siteProducts, therapeuticSegments } from '@/lib/siteData';

type ProductRow = Omit<ProductDocument, 'createdAt' | 'updatedAt'> & {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

type ProductFormState = {
  name: string;
  slug: string;
  categoryName: string;
  composition: string;
  strength: string;
  packSize: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: string;
};

const categoryOptions = therapeuticSegments.map((segment) => segment.title);

const emptyForm: ProductFormState = {
  name: '',
  slug: '',
  categoryName: categoryOptions[0] || '',
  composition: '',
  strength: '',
  packSize: '',
  description: '',
  imageUrl: '',
  isFeatured: false,
  isActive: true,
  sortOrder: '1',
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toForm(product: ProductRow): ProductFormState {
  return {
    name: product.name || '',
    slug: product.slug || '',
    categoryName: product.categoryName || categoryOptions[0] || '',
    composition: product.composition || '',
    strength: product.strength || '',
    packSize: product.packSize || '',
    description: product.description || '',
    imageUrl: product.imageUrl || '',
    isFeatured: Boolean(product.isFeatured),
    isActive: Boolean(product.isActive),
    sortOrder: String(Math.max(1, Math.round((product.sortOrder ?? 10) / 10))),
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [queryText, setQueryText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSiteProducts, setIsAddingSiteProducts] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const productsQuery = query(firebaseCollections.products, orderBy('sortOrder', 'asc'));
    const unsubscribe = onSnapshot(
      productsQuery,
      (snapshot) => {
        setProducts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ProductRow)));
        setIsLoading(false);
      },
      () => {
        setError('Unable to load products. Please check Firestore rules and indexes.');
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = queryText.trim().toLowerCase();

    if (!normalized) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.categoryName, product.composition, product.strength]
        .join(' ')
        .toLowerCase()
        .includes(normalized),
    );
  }, [products, queryText]);

  const nextDisplayOrder = useMemo(() => {
    if (!products.length) {
      return '1';
    }

    const highestOrder = Math.max(...products.map((product) => product.sortOrder || 0));
    return String(Math.max(1, Math.round(highestOrder / 10) + 1));
  }, [products]);

  function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm({ ...emptyForm, sortOrder: nextDisplayOrder });
    setEditingId('');
    setMessage('');
    setError('');
  }

  function editProduct(product: ProductRow) {
    setEditingId(product.id);
    setForm(toForm(product));
    setMessage('');
    setError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    const payload = {
      name: form.name.trim(),
      slug: (form.slug || createSlug(form.name)).trim(),
      categoryId: createSlug(form.categoryName),
      categoryName: form.categoryName,
      composition: form.composition.trim(),
      strength: form.strength.trim(),
      packSize: form.packSize.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      sortOrder: (Number(form.sortOrder) || 1) * 10,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(firebaseCollections.products, editingId), payload);
        setMessage('Product updated successfully.');
      } else {
        await addDoc(firebaseCollections.products, {
          ...payload,
          createdAt: serverTimestamp(),
        });
        setMessage('Product added successfully.');
      }

      resetForm();
    } catch {
      setError('Product could not be saved. Please verify admin permissions.');
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!editingId && form.sortOrder === emptyForm.sortOrder) {
      setForm((current) => ({ ...current, sortOrder: nextDisplayOrder }));
    }
  }, [editingId, form.sortOrder, nextDisplayOrder]);

  async function addSiteProducts() {
    setIsAddingSiteProducts(true);
    setMessage('');
    setError('');

    const existingSlugs = new Set(products.map((product) => product.slug));
    const productsToAdd = siteProducts.filter((product) => !existingSlugs.has(createSlug(product.name)));

    if (!productsToAdd.length) {
      setMessage('All site products are already added.');
      setIsAddingSiteProducts(false);
      return;
    }

    try {
      await Promise.all(
        productsToAdd.map((product, index) =>
          addDoc(firebaseCollections.products, {
            name: product.name,
            slug: createSlug(product.name),
            categoryId: createSlug(product.category),
            categoryName: product.category,
            composition: product.composition,
            strength: product.strength,
            packSize: product.packSize,
            description: product.description,
            imageUrl: '',
            isFeatured: product.featured,
            isActive: true,
            sortOrder: (products.length + index + 1) * 10,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }),
        ),
      );

      setMessage(`${productsToAdd.length} site products added successfully.`);
    } catch {
      setError('Site products could not be added. Please verify admin permissions.');
    } finally {
      setIsAddingSiteProducts(false);
    }
  }

  async function removeProduct(product: ProductRow) {
    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) {
      return;
    }

    setMessage('');
    setError('');

    try {
      await deleteDoc(doc(firebaseCollections.products, product.id));
      if (editingId === product.id) {
        resetForm();
      }
      setMessage('Product deleted successfully.');
    } catch {
      setError('Product could not be deleted. Please verify admin permissions.');
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Catalog CMS</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Products</h1>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
            {/* Keep addSiteProducts available for later bulk import; button hidden to avoid accidental duplicate imports. */}
            <label className="flex min-h-11 w-full max-w-sm items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-primary">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-sm text-slate-950 outline-none"
              />
            </label>
          </div>
        </div>

        {message ? (
          <div className="rounded-lg border border-secondary/20 bg-secondary-soft px-4 py-3 text-sm font-semibold text-secondary-dark">
            {message}
          </div>
        ) : null}

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
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  {/* Featured column hidden for now; data field is still supported. */}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 animate-pulse rounded-lg bg-slate-100" />
                          <div className="min-w-0 flex-1">
                            <div className="h-4 w-36 animate-pulse rounded bg-slate-100" />
                            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-100" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="ml-auto h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary-soft text-sm font-bold text-primary">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              product.name.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-950">{product.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{product.composition}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{product.categoryName}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            product.isActive
                              ? 'bg-secondary-soft text-secondary-dark'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => editProduct(product)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProduct(product)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-red-300 hover:text-red-600"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center font-semibold text-slate-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              {editingId ? 'Edit product' : 'Add product'}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              {editingId ? form.name || 'Selected product' : 'New product'}
            </h2>
          </div>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Product Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => {
                updateField('name', event.target.value);
                if (!editingId) {
                  updateField('slug', createSlug(event.target.value));
                }
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Slug</span>
            <input
              type="text"
              value={form.slug}
              onChange={(event) => updateField('slug', createSlug(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <select
              value={form.categoryName}
              onChange={(event) => updateField('categoryName', event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Composition</span>
              <input
                type="text"
                value={form.composition}
                onChange={(event) => updateField('composition', event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Strength</span>
              <input
                type="text"
                value={form.strength}
                onChange={(event) => updateField('strength', event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Pack Size</span>
            <input
              type="text"
              value={form.packSize}
              onChange={(event) => updateField('packSize', event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Image URL</span>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) => updateField('imageUrl', event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="https://..."
            />
          </label>

          {form.imageUrl ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Image Preview</p>
              <div className="mt-3 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-white">
                <img
                  src={form.imageUrl}
                  alt={form.name || 'Product preview'}
                  className="h-full w-full object-contain p-2"
                />
              </div>
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Display Order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) => updateField('sortOrder', event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>

            {/* Featured toggle hidden for now; isFeatured remains in the save payload. */}

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => updateField('isActive', event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-semibold text-slate-700">Active</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isSaving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </aside>
    </div>
  );
}
