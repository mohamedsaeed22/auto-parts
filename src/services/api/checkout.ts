import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance as axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";

export interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressResponse {
  data: Address[];
}

export interface CreateAddressData {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  is_default?: boolean;
}

export interface CheckoutData {
  address_id: number;
  payment_method: "cash" | "card";
}

const getAddresses = async () => {
  const { data } = await axios.get<AddressResponse>("/api/addresses");
  return data;
};

const createAddress = async (addressData: CreateAddressData) => {
  const { data } = await axios.post<Address>("/api/addresses", addressData);
  return data;
};

const updateAddress = async ({
  id,
  ...addressData
}: CreateAddressData & { id: number }) => {
  const { data } = await axios.put<Address>(
    `/api/addresses/${id}`,
    addressData
  );
  return data;
};

const deleteAddress = async (id: number) => {
  await axios.delete(`/api/addresses/${id}`);
};

const checkout = async (checkoutData: CheckoutData) => {
  const { data } = await axios.post("/api/checkout", checkoutData);
  return data;
};

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccess("Address added successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to add address"
      );
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccess("Address updated successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to update address"
      );
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showSuccess("Address deleted successfully");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete address"
      );
    },
  });
}

export function useCheckout() {
  const router = useRouter();

  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      showSuccess("Order placed successfully");
      router.push("/orders");
    },
    onError: (error: unknown) => {
      showError(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to place order"
      );
    },
  });
}
