import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axios } from '@/lib/axios';
import { showError, showSuccess } from '@/lib/toast';

export interface ReturnItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    images: string[];
    price: number;
    discount_price: number | null;
  };
}

export interface ReturnsResponse {
  data: ReturnItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateReturnData {
  order_id: number;
  product_id: number;
  quantity: number;
  reason: string;
}

const returnsKeys = {
  all: ['returns'] as const,
  lists: () => [...returnsKeys.all, 'list'] as const,
  list: (page: number) => [...returnsKeys.lists(), { page }] as const,
};

const getReturns = async ({ page = 1 }: { page?: number }) => {
  const { data } = await axios.get<ReturnsResponse>('/api/returns', {
    params: { page },
  });
  return data;
};

const createReturn = async (data: CreateReturnData) => {
  const response = await axios.post<ReturnsResponse>('/api/returns', data);
  return response.data;
};

const cancelReturn = async (id: number) => {
  const response = await axios.delete<ReturnsResponse>(`/api/returns/${id}`);
  return response.data;
};

export function useReturns(page = 1) {
  return useQuery({
    queryKey: returnsKeys.list(page),
    queryFn: () => getReturns({ page }),
  });
}

export function useCreateReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturn,
    onSuccess: (data) => {
      queryClient.setQueryData(returnsKeys.list(1), data);
      showSuccess('Return request submitted successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message || 'Failed to submit return request'
      );
    },
  });
}

export function useCancelReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReturn,
    onSuccess: (data) => {
      queryClient.setQueryData(returnsKeys.list(1), data);
      showSuccess('Return request cancelled successfully');
    },
    onError: (error: any) => {
      showError(
        error?.response?.data?.message || 'Failed to cancel return request'
      );
    },
  });
}