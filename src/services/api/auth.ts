import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { storage, AuthData } from "@/lib/storage";
import { showError, showSuccess } from "@/lib/toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Types
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  errors: string[];
  data: T;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  phone: string;
  type: "shop" | "workshop";
  points: number;
  manager_name: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  tax_number: string;
  latitude: string;
  longitude: string;
  avatar?: string;
  commercial_register?: string;
  is_registration_complete: boolean;
}

export interface LoginWithPhoneRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface GoogleLoginRequest {
  google_id: string;
}

export interface CompleteRegistrationRequest {
  name: string;
  email?: string;
  type: "shop" | "workshop";
  manager_name: string;
  address: string;
  city: string;
  zip: string;
  state: string;
  tax_number: string;
  latitude: string;
  longitude: string;
  commercial_register?: File;
  avatar?: File;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  manager_name?: string;
  address?: string;
  city?: string;
  zip?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
  avatar?: File;
}

export interface UpdatePasswordRequest {
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  phone: string;
  commercial_register?: File;
  avatar?: File;
}

export interface ChangeLanguageRequest {
  locale: string;
}

// API Helper Functions
const getHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = storage.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Auth API Functions
export const sendOtp = async (
  data: LoginWithPhoneRequest
): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/auth/send-otp`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: data.phone }),
  });
  return handleResponse(response);
};

export const verifyOtp = async (
  data: VerifyOtpRequest
): Promise<ApiResponse<AuthResponse>> => {
  const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const googleLogin = async (
  data: GoogleLoginRequest
): Promise<ApiResponse<AuthResponse>> => {
  const formData = new FormData();
  formData.append("google_id", data.google_id);

  const response = await fetch(`${BASE_URL}/auth/google-login`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });
  return handleResponse(response);
};

export const completeRegistration = async (
  data: FormData | CompleteRegistrationRequest
): Promise<ApiResponse<AuthResponse>> => {
  let formData: FormData;
  
  if (!(data instanceof FormData)) {
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
  } else {
    formData = data;
  }

  // Get existing headers but remove Content-Type to let browser set it with boundary
  const headers = getHeaders();
  delete headers['Content-Type'];

  const response = await fetch(`${BASE_URL}/auth/complete-registration`, {
    method: "POST",
    headers,
    body: formData,
  });
  return handleResponse(response);
};

// Custom Hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  const sendOtpMutation = useMutation<
    ApiResponse,
    Error,
    LoginWithPhoneRequest
  >({
    mutationFn: sendOtp,
    onError: (error) => {
      showError(error.message);
    },
  });

  const verifyOtpMutation = useMutation<
    ApiResponse<AuthResponse>,
    Error,
    VerifyOtpRequest
  >({
    mutationFn: verifyOtp,
    onSuccess: (response) => {
      storage.setAuth({
        token: response.data.token,
        user: response.data.user as AuthData["user"], // Type conversion needed due to nullable fields
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess("Login successful");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const googleLoginMutation = useMutation<
    ApiResponse<AuthResponse>,
    Error,
    GoogleLoginRequest
  >({
    mutationFn: googleLogin,
    onSuccess: (response) => {
      storage.setAuth({
        token: response.data.token,
        user: response.data.user as AuthData["user"], // Type conversion needed due to nullable fields
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess("Login successful");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const completeRegistrationMutation = useMutation<
    ApiResponse<AuthResponse>,
    Error,
    CompleteRegistrationRequest
  >({
    mutationFn: completeRegistration,
    onSuccess: (response) => {
      storage.setAuth({
        token: response.data.token,
        user: response.data.user as AuthData["user"], // Type conversion needed due to nullable fields
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      showSuccess("Registration completed successfully");
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const useProfile = () => {
    return useQuery<ApiResponse<User>, Error>({
      queryKey: ["profile"],
      queryFn: async () => {
        const response = await fetch(`${BASE_URL}/auth/profile`, {
          headers: getHeaders(),
        });
        return handleResponse(response);
      },
      enabled: !!storage.getToken(),
    });
  };

  return {
    sendOtpMutation,
    verifyOtpMutation,
    googleLoginMutation,
    completeRegistrationMutation,
    useProfile,
  };
};
