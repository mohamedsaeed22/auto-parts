import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange,
      className,
      showInfo = true,
      showFirstLast = true,
      maxVisiblePages = 5,
      size = "md",
      variant = "outline",
    },
    ref
  ) => {
    const getVisiblePages = () => {
      const pages: (number | string)[] = [];
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (totalPages <= maxVisiblePages) {
        // Show all pages if total is less than max visible
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Calculate start and end of visible pages
        let start = Math.max(1, currentPage - halfVisible);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (end - start + 1 < maxVisiblePages) {
          start = Math.max(1, end - maxVisiblePages + 1);
        }

        // Add first page and ellipsis if needed
        if (start > 1) {
          pages.push(1);
          if (start > 2) {
            pages.push("...");
          }
        }

        // Add visible pages
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }

        // Add last page and ellipsis if needed
        if (end < totalPages) {
          if (end < totalPages - 1) {
            pages.push("...");
          }
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "h-8 px-2 text-xs";
        case "lg":
          return "h-12 px-4 text-base";
        default:
          return "h-10 px-3 text-sm";
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "ghost":
          return "hover:bg-gray-100 hover:text-gray-900";
        case "default":
          return "bg-primary text-primary-foreground hover:bg-primary/90";
        default:
          return "border border-gray-300 hover:bg-gray-50 hover:text-gray-900";
      }
    };

    const visiblePages = getVisiblePages();
    const startItem = totalItems
      ? (currentPage - 1) * (itemsPerPage || 10) + 1
      : 0;
    const endItem = totalItems
      ? Math.min(currentPage * (itemsPerPage || 10), totalItems)
      : 0;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-4",
          className
        )}
      >
        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          {/* First Page Button */}
          {showFirstLast && currentPage > 1 && (
            <Button
              variant={variant}
              size={size}
              onClick={() => onPageChange(1)}
              className={cn(getSizeClasses(), getVariantClasses())}
              aria-label="Go to first page"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
          )}

          {/* Previous Button */}
          <Button
            variant={variant}
            size={size}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={cn(getSizeClasses(), getVariantClasses())}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <div className="flex items-center justify-center px-2">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <Button
                  variant={page === currentPage ? "default" : variant}
                  size={size}
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    getSizeClasses(),
                    page === currentPage
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : getVariantClasses()
                  )}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}

          {/* Next Button */}
          <Button
            variant={variant}
            size={size}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={cn(getSizeClasses(), getVariantClasses())}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page Button */}
          {showFirstLast && currentPage < totalPages && (
            <Button
              variant={variant}
              size={size}
              onClick={() => onPageChange(totalPages)}
              className={cn(getSizeClasses(), getVariantClasses())}
              aria-label="Go to last page"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
