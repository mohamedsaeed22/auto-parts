'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  Star,
  ThumbsUp,
  Flag,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import {
  Review,
  useMarkAsHelpful,
  useReportAbuse,
  useDeleteReview,
} from '@/services/api/reviews';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ReviewForm } from './review-form';

interface ReviewItemProps {
  review: Review;
  isOwner?: boolean;
  className?: string;
}

export function ReviewItem({ review, isOwner, className }: ReviewItemProps) {
  const { t, i18n } = useTranslation('reviews');
  const [isEditing, setIsEditing] = useState(false);
  const markAsHelpfulMutation = useMarkAsHelpful();
  const reportAbuseMutation = useReportAbuse();
  const deleteReviewMutation = useDeleteReview();

  const handleMarkAsHelpful = async () => {
    await markAsHelpfulMutation.mutateAsync(review.id);
  };

  const handleReportAbuse = async () => {
    if (window.confirm(t('confirmReport'))) {
      await reportAbuseMutation.mutateAsync(review.id);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteReviewMutation.mutateAsync(review.id);
    }
  };

  if (isEditing) {
    return (
      <div className={cn('space-y-4 p-4', className)}>
        <ReviewForm
          review={review}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4 p-4', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={review.user.avatar || undefined} />
            <AvatarFallback>
              {review.user.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.user.name}</span>
              {review.is_verified_purchase && (
                <span className="text-xs text-green-600">
                  {t('verifiedPurchase')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${index < review.rating ? 'fill-current' : 'fill-none text-muted-foreground'}`}
                />
              ))}
            </div>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(review.created_at), {
            addSuffix: true,
            locale: i18n.language === 'ar' ? ar : enUS,
          })}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2"
            onClick={handleMarkAsHelpful}
            disabled={
              review.is_helpful ||
              markAsHelpfulMutation.isPending ||
              reportAbuseMutation.isPending
            }
          >
            <ThumbsUp
              className={cn(
                'h-4 w-4',
                review.is_helpful && 'fill-primary text-primary'
              )}
            />
            <span
              className={cn(
                'text-sm',
                review.is_helpful && 'text-primary'
              )}
            >
              {t('helpful')} ({review.helpful_count})
            </span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2"
            onClick={handleReportAbuse}
            disabled={
              markAsHelpfulMutation.isPending || reportAbuseMutation.isPending
            }
          >
            <Flag className="h-4 w-4" />
            <span className="text-sm">{t('reportAbuse')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}