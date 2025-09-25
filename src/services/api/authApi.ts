import { api } from "./baseApi";
import type {
  ApiResponse,
  LoginWithPhoneRequest,
  VerifyOtpRequest,
  GoogleLoginRequest,
  CompleteRegistrationRequest,
  UpdateProfileRequest,
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  ChangeLanguageRequest,
  AuthResponse,
  User,
} from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Login with Phone - Send OTP
    sendOtp: builder.mutation<ApiResponse, LoginWithPhoneRequest>({
      query: (data) => {
        return {
          url: "/auth/send-otp",
          method: "POST",
          body: JSON.stringify({ phone: data.phone }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    // Verify OTP
    verifyOtp: builder.mutation<ApiResponse<AuthResponse>, VerifyOtpRequest>({
      query: (data) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: JSON.stringify({
            phone: data.phone,
            code: data.code,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Auth", "Profile"],
    }),

    // Google Login
    googleLogin: builder.mutation<
      ApiResponse<AuthResponse>,
      GoogleLoginRequest
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("google_id", data.google_id);

        return {
          url: "/auth/google-login",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Auth", "Profile"],
    }),

    // Complete Registration
    completeRegistration: builder.mutation<
      ApiResponse<AuthResponse>,
      CompleteRegistrationRequest
    >({
      query: (data) => {
        console.log("=== API SERVICE DEBUG ===");
        console.log("Data received in API service:", data);
        console.log("Data type:", typeof data);
        console.log("Data keys:", Object.keys(data));
        console.log("Data values:", Object.values(data));

        // Create FormData for file uploads
        const formData = new FormData();

        console.log("Appending form fields:");
        console.log("- name:", data.name, typeof data.name);
        formData.append("name", data.name);

        console.log("- email:", data.email, typeof data.email);
        if (data.email) formData.append("email", data.email);

        console.log("- type:", data.type, typeof data.type);
        formData.append("type", data.type);

        console.log(
          "- manager_name:",
          data.manager_name,
          typeof data.manager_name
        );
        formData.append("manager_name", data.manager_name);

        console.log("- address:", data.address, typeof data.address);
        formData.append("address", data.address);

        console.log("- city:", data.city, typeof data.city);
        formData.append("city", data.city);

        console.log("- zip:", data.zip, typeof data.zip);
        formData.append("zip", data.zip);

        console.log("- state:", data.state, typeof data.state);
        formData.append("state", data.state);

        console.log("- tax_number:", data.tax_number, typeof data.tax_number);
        formData.append("tax_number", data.tax_number);

        console.log("- latitude:", data.latitude, typeof data.latitude);
        formData.append("latitude", data.latitude);

        console.log("- longitude:", data.longitude, typeof data.longitude);
        formData.append("longitude", data.longitude);

        console.log(
          "- commercial_register:",
          data.commercial_register,
          typeof data.commercial_register
        );
        if (data.commercial_register) {
          formData.append("commercial_register", data.commercial_register);
        }

        console.log("- avatar:", data.avatar, typeof data.avatar);
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        // Debug: Log the FormData contents
        console.log("FormData contents:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: "/auth/complete-registration",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Auth", "Profile"],
    }),

    // Get Profile
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),

    // Update Profile
    updateProfile: builder.mutation<ApiResponse<User>, UpdateProfileRequest>({
      query: (data) => {
        const formData = new FormData();

        if (data.name) formData.append("name", data.name);
        if (data.email) formData.append("email", data.email);
        if (data.phone) formData.append("phone", data.phone);
        if (data.manager_name)
          formData.append("manager_name", data.manager_name);
        if (data.address) formData.append("address", data.address);
        if (data.city) formData.append("city", data.city);
        if (data.zip) formData.append("zip", data.zip);
        if (data.state) formData.append("state", data.state);
        if (data.tax_number) formData.append("tax_number", data.tax_number);
        if (data.latitude) formData.append("latitude", data.latitude);
        if (data.longitude) formData.append("longitude", data.longitude);

        if (data.commercial_register) {
          formData.append("commercial_register", data.commercial_register);
        }
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        return {
          url: "/auth/update-profile",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Update Password
    updatePassword: builder.mutation<ApiResponse, UpdatePasswordRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        return {
          url: "/auth/update-password",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Forgot Password
    forgotPassword: builder.mutation<ApiResponse, ForgotPasswordRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("phone", data.phone);

        if (data.commercial_register) {
          formData.append("commercial_register", data.commercial_register);
        }
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        return {
          url: "/auth/forgot-password",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Verify Reset Password OTP
    verifyResetPasswordOtp: builder.mutation<
      ApiResponse<{ token: string }>,
      VerifyOtpRequest & { commercial_register?: File; avatar?: File }
    >({
      query: (data) => {
        const formData = new FormData();
        formData.append("phone", data.phone);
        formData.append("code", data.code);

        if (data.commercial_register) {
          formData.append("commercial_register", data.commercial_register);
        }
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        return {
          url: "/auth/verify-reset-password-otp",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Change Language
    changeLanguage: builder.mutation<ApiResponse, ChangeLanguageRequest>({
      query: (data) => {
        const formData = new FormData();
        formData.append("locale", data.locale);

        return {
          url: "/auth/change-language",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Profile"],
    }),

    // Logout
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGoogleLoginMutation,
  useCompleteRegistrationMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useVerifyResetPasswordOtpMutation,
  useChangeLanguageMutation,
  useLogoutMutation,
} = authApi;
