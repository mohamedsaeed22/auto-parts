'use client';

import { Suspense } from 'react';
import { LazyLoad } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';

// Lazy load the ProductDetail component
const ProductDetail = LazyLoad(() => import('@/components/product/ProductDetail'));

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  return (
    <main>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail productId={productId} />
      </Suspense>
    </main>
  );
}

function ProductDetailSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image Skeleton */}
            <div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-md" />
                ))}
              </div>
            </div>

            {/* Product Info Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Product Details Tabs Skeleton */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            <div className="py-6 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}