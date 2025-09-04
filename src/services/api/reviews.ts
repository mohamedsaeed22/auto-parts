import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { showError, showSuccess } from '@/lib/toast';

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  helpful_count: number;
  is_verified_purchase: boolean;
  is_helpful: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    average_rating: number;
    rating_counts: Record<number, number>;
  };
}

export interface CreateReviewData {
  product_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

const reviewsKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsKeys.all, 'list'] as const,
  list: (productId: number, page: number) =>
    [...reviewsKeys.lists(), { productId, page }] as const,
  userReviews: () => [...reviewsKeys.all, 'user'] as const,
};

const getReviews = async ({
  productId,
  page = 1,
}: {
  productId: number;
  page?: number;
}) => {
  const { data } = await axios.get<ReviewsResponse>(
    `/api/products/${productId}/reviews`,
    { params: { page } }
  );
  return data;
};

const getUserReviews = async ({ page = 1 }: { page?: number }) => {
  const { data } = await axios.get<ReviewsResponse>('/api/user/reviews', {
    params: { page },
  });
  return data;
};

const createReview = async (data: CreateReviewData) => {
  const response = await axios.post<ReviewsResponse>(
    `/api/products/${data.product_id}/reviews`,
    data
  );
  return response.data;
};

const updateReview = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateReviewData;
}) => {
  const response = await axios.put<ReviewsResponse>(`/api/reviews/${id}`, data);
  return response.data;
};

const deleteReview = async (id: number) => {
  const response = await axios.delete<ReviewsResponse>(`/api/reviews/${id}`);
  return response.data;
};

const markAsHelpful = async (id: number) => {
  const response = await axios.post<ReviewsResponse>(
    `/api/reviews/${id}/helpful`
  );
  return response.data;
};

const reportAbuse = async (id: number) => {
  const response = await axios.post<ReviewsResponse>(
    `/api/reviews/${id}/report`
  );
  return response.data;
};

export function useReviews(productId: number, page = 1) {
  return useQuery({
    queryKey: reviewsKeys.list(productId, page),
    queryFn: () => getReviews({ productId, page }),
  });
}

export function useUserReviews(page = 1) {
  return useQuery({
    queryKey: [...reviewsKeys.userReviews(), { page }],
    queryFn: () => getUserReviews({ page }),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        reviewsKeys.list(variables.product_id, 1),
        data
      );
      showSuccess('Review submitted successfully');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to submit review');
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
      showSuccess('Review updated successfully');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to update review');
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
      showSuccess('Review deleted successfully');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to delete review');
    },
  });
}

export function useMarkAsHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsHelpful,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.all });
      showSuccess('Review marked as helpful');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message || 'Failed to mark review as helpful'
      );
    },
  });
}

export function useReportAbuse() {
  return useMutation({
    mutationFn: reportAbuse,
    onSuccess: () => {
      showSuccess('Review reported successfully');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to report review');
    },
  });
}