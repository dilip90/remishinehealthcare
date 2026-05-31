import {
  collection,
  doc,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from 'firebase/firestore';
import { db } from './firebase';

export type ProductDocument = {
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  composition: string;
  strength: string;
  packSize: string;
  mrp?: string;
  description: string;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CategoryDocument = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
};

export type HeroBannerDocument = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  altText: string;
  isActive: boolean;
  sortOrder: number;
};

export type EnquiryDocument = {
  name: string;
  phone: string;
  email?: string;
  message: string;
  productId?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt?: Date;
};

export type MailDocument = {
  to: string[];
  cc?: string[];
  replyTo?: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
  createdAt?: Date;
};

export type SiteSettingsDocument = {
  companyName: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  gstin: string;
  address?: string;
  mapQuery?: string;
};

export const collectionNames = {
  products: 'products',
  categories: 'categories',
  heroBanners: 'heroBanners',
  enquiries: 'enquiries',
  mail: 'mail',
  users: 'users',
  siteSettings: 'siteSettings',
} as const;

function createConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: WithFieldValue<T>) => data as WithFieldValue<DocumentData>,
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) =>
      snapshot.data(options) as T,
  };
}

export function typedCollection<T>(path: string): CollectionReference<T> {
  return collection(db, path).withConverter(createConverter<T>());
}

export function typedDoc<T>(path: string, id: string): DocumentReference<T> {
  return doc(db, path, id).withConverter(createConverter<T>());
}

export const firebaseCollections = {
  products: typedCollection<ProductDocument>(collectionNames.products),
  categories: typedCollection<CategoryDocument>(collectionNames.categories),
  heroBanners: typedCollection<HeroBannerDocument>(collectionNames.heroBanners),
  enquiries: typedCollection<EnquiryDocument>(collectionNames.enquiries),
  mail: typedCollection<MailDocument>(collectionNames.mail),
  siteSettings: typedCollection<SiteSettingsDocument>(collectionNames.siteSettings),
};
