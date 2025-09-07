"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Star } from "lucide-react";
import {
  Review,
  useCreateReview,
  useUpdateReview,
} from "@/services/api/reviews";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters")
    .max(1000, "Comment must be less than 1000 characters"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  productId?: number;
  review?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  productId,
  review,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const { t } = useTranslation("reviews");
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  useEffect(() => {
    if (review) {
      form.reset({
        rating: review.rating,
        comment: review.comment,
      });
    }
  }, [form, review]);

  const onSubmit = async (values: ReviewFormValues) => {
    if (review) {
      await updateReviewMutation.mutateAsync({
        id: review.id,
        data: values,
      });
    } else if (productId) {
      await createReviewMutation.mutateAsync({
        product_id: productId,
        ...values,
      });
    }
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("rating")}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        (field.onChange as (value: number) => void)(rating)
                      }
                    >
                      <Star
                        className={`h-6 w-6 ${
                          (field.value as number) >= rating
                            ? "fill-primary text-primary"
                            : "fill-none text-muted-foreground"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("comment")}</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={5}
                  placeholder={t("commentPlaceholder")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={
              createReviewMutation.isPending || updateReviewMutation.isPending
            }
          >
            {(createReviewMutation.isPending ||
              updateReviewMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {review ? t("updateReview") : t("submitReview")}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={
                createReviewMutation.isPending || updateReviewMutation.isPending
              }
            >
              {t("cancel")}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
