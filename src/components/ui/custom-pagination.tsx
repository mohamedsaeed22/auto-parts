"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { useQueryState, parseAsInteger } from "nuqs";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

export function CustomPagination({
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const { i18n } = useTranslation("");
  const isRTL = i18n.language === "ar";
  const [page, setPage] = useQueryState("page", parseAsInteger);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = page || 1; // Use 1 as display default when page is null

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setPage(newPage);

    // Scroll to top of the page when pagination changes
    // Try to find the brand features section first (for brand pages), then products section, otherwise scroll to top of page
    const brandFeaturesSection = document.querySelector(
      "[data-brand-features]"
    );
    const productsSection =
      document.querySelector("[data-products-section]") ||
      document.querySelector(".py-16.bg-gray-50") ||
      document.querySelector("section");

    if (brandFeaturesSection) {
      // For brand pages, scroll to brand features section
      brandFeaturesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (productsSection) {
      // For other pages, scroll to products section
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Fallback to top of page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = Math.min(5, totalPages); // Don't show more buttons than pages

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxVisiblePages) {
      // Calculate the middle range
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = maxVisiblePages - leftOffset - 1;

      if (currentPage <= leftOffset) {
        // Near the start
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - rightOffset) {
        // Near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Middle
        startPage = currentPage - leftOffset;
        endPage = currentPage + rightOffset;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? "default" : "outline"}
          className="h-8 w-8"
          onClick={() => handlePageChange(1)}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="px-2">
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          className="h-8 w-8"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          className="h-8 w-8"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        {isRTL ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <div
        className={`flex items-center gap-1 ${
          isRTL ? "space-x-reverse " : " "
        }`}
      >
        {renderPageNumbers()}
      </div>
      <Button
        variant="outline"
        className="h-8 w-8 p-0"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        {isRTL ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
