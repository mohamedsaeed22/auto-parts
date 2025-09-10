'use client';

import { Suspense } from 'react';
import { LazyLoad } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the Checkout component
const Checkout = LazyLoad(() => import('@/components/checkout/Checkout'));

export default function CheckoutPage() {
  return (
    <main>
      <Suspense fallback={<CheckoutSkeleton />}>
        <Checkout />
      </Suspense>
    </main>
  );
}

function CheckoutSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          {/* Header Skeleton */}
          <div className="p-6 border-b border-gray-200">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>

          {/* Steps Skeleton */}
          <div className="p-6">
            <div className="flex justify-between mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-12 w-full" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}