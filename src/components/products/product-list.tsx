"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  Product,
  ProductsResponse,
  useProducts,
} from "@/services/api/products";
import { ProductCard } from "@/components/ui/product-card";
import { Grid } from "@/components/ui/grid";
import { Loader2 } from "lucide-react";

interface ProductListProps {
  filters?: {
    category_id?: number;
    brand_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: "price_asc" | "price_desc" | "newest" | "rating";
  };
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function ProductList({
  filters = {},
  onAddToCart,
  className,
}: ProductListProps) {
  const { ref, inView } = useInView();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useProducts(filters);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const products =
    data?.pages.flatMap((page: ProductsResponse) => page.data) ?? [];

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No products found
      </div>
    );
  }

  return (
    <div className={className}>
      <Grid cols={4} responsive={true} gap={4}>
        {products.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </Grid>
      <div ref={ref} className="mt-8 flex items-center justify-center py-4">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
      </div>
    </div>
  );
}
