'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';

interface ProductFiltersProps {
  initialFilters?: {
    category_id?: number;
    brand_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
  };
  categories: Array<{ id: number; name: string }>;
  brands: Array<{ id: number; name: string }>;
  priceRange: { min: number; max: number };
  onFiltersChange: (filters: ProductFiltersProps['initialFilters']) => void;
}

export function ProductFilters({
  initialFilters = {},
  categories,
  brands,
  priceRange,
  onFiltersChange,
}: ProductFiltersProps) {
  const { t } = useTranslation('products');
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [priceValues, setPriceValues] = useState([
    filters.min_price ?? priceRange.min,
    filters.max_price ?? priceRange.max,
  ]);

  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    onFiltersChange(debouncedFilters);
  }, [debouncedFilters, onFiltersChange]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      category_id: value ? Number(value) : undefined,
    }));
  };

  const handleBrandChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      brand_id: value ? Number(value) : undefined,
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort_by: value }));
  };

  const handlePriceChange = (values: number[]) => {
    setPriceValues(values);
    setFilters((prev) => ({
      ...prev,
      min_price: values[0],
      max_price: values[1],
    }));
  };

  const handleReset = () => {
    setFilters({});
    setPriceValues([priceRange.min, priceRange.max]);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder={t('filters.searchPlaceholder')}
          value={filters.search ?? ''}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <Select value={filters.sort_by} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('filters.sortBy')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t('filters.sortOptions.newest')}</SelectItem>
          <SelectItem value="price_asc">{t('filters.sortOptions.priceAsc')}</SelectItem>
          <SelectItem value="price_desc">{t('filters.sortOptions.priceDesc')}</SelectItem>
          <SelectItem value="rating">{t('filters.sortOptions.rating')}</SelectItem>
        </SelectContent>
      </Select>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t('filters.title')}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-6">
            <div className="space-y-2">
              <Label>{t('filters.category')}</Label>
              <Select
                value={filters.category_id?.toString()}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('filters.brand')}</Label>
              <Select
                value={filters.brand_id?.toString()}
                onValueChange={handleBrandChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.allBrands')} />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem
                      key={brand.id}
                      value={brand.id.toString()}
                    >
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label>{t('filters.priceRange')}</Label>
              <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={1}
                value={priceValues}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between text-sm">
                <span>
                  {t('currency', { value: priceValues[0] })}
                </span>
                <span>
                  {t('currency', { value: priceValues[1] })}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleReset}
            >
              {t('filters.reset')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}