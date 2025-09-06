import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { showError, showSuccess } from "@/lib/toast";

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: File;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const profileKeys = {
  all: ["profile"] as const,
  profile: () => [...profileKeys.all, "me"] as const,
};

const getProfile = async () => {
  const { data } = await axios.get<Profile>("/api/profile");
  return data;
};

const updateProfile = async (data: UpdateProfileData) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.phone) formData.append("phone", data.phone);
  if (data.avatar) formData.append("avatar", data.avatar);

  const response = await axios.post<Profile>("/api/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const updatePassword = async (data: UpdatePasswordData) => {
  const response = await axios.put("/api/profile/password", data);
  return response.data;
};

const deleteAvatar = async () => {
  const response = await axios.delete("/api/profile/avatar");
  return response.data;
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.profile(), data);
      showSuccess("Profile updated successfully");
    },
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to update profile");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      showSuccess("Password updated successfully");
    },
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to update password");
    },
  });
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.profile(), data);
      showSuccess("Avatar deleted successfully");
    },
    onError: (error: unknown) => {
      showError(error?.response?.data?.message || "Failed to delete avatar");
    },
  });
}
