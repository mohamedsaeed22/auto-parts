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
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
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

      if (page <= leftOffset) {
        // Near the start
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (page >= totalPages - rightOffset) {
        // Near the end
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // Middle
        startPage = page - leftOffset;
        endPage = page + rightOffset;
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant={page === 1 ? "default" : "outline"}
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
          variant={page === i ? "default" : "outline"}
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
          variant={page === totalPages ? "default" : "outline"}
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
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
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
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
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
