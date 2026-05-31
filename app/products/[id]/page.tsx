import { Metadata } from 'next';
import { products } from '@/lib/siteData';
import ProductDetailClient from './ProductDetailClient';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findProduct(value: string) {
  return products.find(
    (item) => item.id === value || createSlug(item.name) === value
  );
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = findProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} - Remishine Healthcare`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  const params = products.flatMap((product) => {
    const slug = createSlug(product.name);

    return slug && slug !== product.id
      ? [{ id: product.id }, { id: slug }]
      : [{ id: product.id }];
  });

  return Array.from(new Map(params.map((param) => [param.id, param])).values());
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = findProduct(params.id) ?? null;

  return <ProductDetailClient product={product} slug={params.id} />;
}
