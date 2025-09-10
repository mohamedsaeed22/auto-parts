'use client';

import { Suspense, lazy, ComponentType, LazyExoticComponent } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * LazyLoad component for wrapping components that should be lazy loaded
 * @param children - The component to lazy load
 * @param fallback - Optional custom fallback component
 */
export function LazyLoad({ children, fallback }: LazyLoadProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center w-full h-full min-h-[100px]">
      <Loader2 className="h-6 w-6 animate-spin text-logo-gold" />
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}

/**
 * Helper function to create a lazy loaded component
 * @param importFn - Function that imports the component
 * @returns Lazy loaded component
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
  return lazy(importFn);
}