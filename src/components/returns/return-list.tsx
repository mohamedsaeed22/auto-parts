"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useReturns,
  ReturnItem as ReturnItemType,
} from "@/services/api/returns";
import { ReturnItem } from "./return-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { Pagination } from "@/components/pagination";

export function ReturnList() {
  const { t } = useTranslation("returns");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useReturns(page);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[280px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={t("error.title")}
        description={
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || t("error.description")
        }
      />
    );
  }

  if (!data?.data.length) {
    return (
      <EmptyState
        title={t("empty.title")}
        description={t("empty.description")}
        action={
          <Button asChild>
            <Link href="/orders">{t("empty.action")}</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.data.map((item: ReturnItemType) => (
          <ReturnItem key={item.id} item={item} />
        ))}
      </div>
      {data.meta.last_page > 1 && (
        <Pagination
          currentPage={data.meta.current_page}
          totalPages={data.meta.last_page}
          onPageChange={setPage}
          className="justify-center"
        />
      )}
    </div>
  );
}
