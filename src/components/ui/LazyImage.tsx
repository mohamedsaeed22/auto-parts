'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallback?: React.ReactNode;
  showLoadingIndicator?: boolean;
  loadingClassName?: string;
}

/**
 * LazyImage component that provides better loading experience for images
 * with blur-up effect and loading indicators
 */
export function LazyImage({
  src,
  alt,
  className,
  fallback,
  showLoadingIndicator = true,
  loadingClassName,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [src]);

  const defaultFallback = (
    <div className={cn(
      'flex items-center justify-center w-full h-full bg-gray-100',
      loadingClassName
    )}>
      {showLoadingIndicator && (
        <Loader2 className="h-6 w-6 animate-spin text-logo-gold" />
      )}
    </div>
  );

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className={cn('relative', className)}>
      {isLoading && (fallback || defaultFallback)}
      
      {!error && (
        <Image
          src={src}
          alt={alt}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {error && (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}