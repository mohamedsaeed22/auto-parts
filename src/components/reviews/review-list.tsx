"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Star } from "lucide-react";
import { useReviews, Review } from "@/services/api/reviews";
import { Button } from "@/components/ui/button";
import { ReviewItem } from "./review-item";
import { ReviewForm } from "./review-form";

interface ReviewListProps {
  productId: number;
  userId?: number;
}

export function ReviewList({ productId, userId }: ReviewListProps) {
  const { t } = useTranslation("reviews");
  const [page, setPage] = useState(1);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const {
    data: reviewsResponse,
    isLoading,
    isError,
  } = useReviews(productId, page);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">
          {t("errors.loadingFailed")}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {reviewsResponse?.meta.average_rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index <
                    Math.round(reviewsResponse?.meta.average_rating || 0)
                      ? "fill-current"
                      : "fill-none text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviewsResponse?.meta.total} {t("reviews")})
            </span>
          </div>
          <div className="space-y-1">
            {Object.entries(reviewsResponse?.meta.rating_counts || {})
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([rating, count]) => (
                <div
                  key={rating}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="flex w-20 items-center gap-1">
                    <span>{rating}</span>
                    <Star className="h-4 w-4 fill-current text-primary" />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${
                          ((count as number) /
                            (reviewsResponse?.meta.total || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right">{count as number}</span>
                </div>
              ))}
          </div>
        </div>
        <Button
          className="shrink-0"
          onClick={() => setIsWritingReview(true)}
          disabled={isWritingReview}
        >
          {t("writeReview")}
        </Button>
      </div>
      {isWritingReview && (
        <div className="rounded-lg border p-4">
          <ReviewForm
            productId={productId}
            onSuccess={() => setIsWritingReview(false)}
            onCancel={() => setIsWritingReview(false)}
          />
        </div>
      )}
      {!reviewsResponse?.data.length ? (
        <p className="text-center text-muted-foreground">{t("noReviews")}</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {reviewsResponse.data.map((review: Review) => (
            <ReviewItem
              key={review.id}
              review={review}
              isOwner={userId === review.user_id}
            />
          ))}
        </div>
      )}
      {(reviewsResponse?.meta.last_page || 0) > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            {t("previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("page", {
              current: page,
              total: reviewsResponse?.meta.last_page || 1,
            })}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === (reviewsResponse?.meta.last_page || 1)}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}
