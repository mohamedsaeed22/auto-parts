import { z } from "zod";

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Avatar validation schema
const avatarSchema = z
  .instanceof(File, { message: "validation.avatar.required" })
  .optional()
  .refine(
    (file) => !file || file.size <= MAX_FILE_SIZE,
    "validation.avatar.fileSize"
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    "validation.avatar.fileType"
  );

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "validation.name.required")
    .min(2, "validation.name.minLength")
    .max(100, "validation.name.maxLength"),

  email: z
    .string()
    .email("validation.email.invalid")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .min(1, "validation.phone.required")
    .min(10, "validation.phone.length")
    .max(14, "validation.phone.length")
    .regex(/^(\+966|00966|966|0)?[5][0-9]{8}$/, "validation.phone.invalid")
    .refine((val) => {
      // More specific Saudi phone validation
      const cleanPhone = val.replace(/^(\+966|00966|966)/, "0");
      return /^0[5][0-9]{8}$/.test(cleanPhone);
    }, "validation.phone.invalid"),

  manager_name: z
    .string()
    .min(1, "validation.managerName.required")
    .min(2, "validation.managerName.minLength")
    .max(100, "validation.managerName.maxLength"),

  address: z
    .string()
    .min(1, "validation.address.required")
    .min(5, "validation.address.minLength")
    .max(200, "validation.address.maxLength"),

  city: z
    .string()
    .min(1, "validation.city.required")
    .min(2, "validation.city.minLength")
    .max(50, "validation.city.maxLength"),

  state: z
    .string()
    .min(1, "validation.state.required")
    .min(2, "validation.state.minLength")
    .max(50, "validation.state.maxLength"),

  zip: z
    .string()
    .min(1, "validation.zip.required")
    .min(3, "validation.zip.minLength")
    .max(10, "validation.zip.maxLength"),

  tax_number: z.string().optional(),

  latitude: z.string().optional(),

  longitude: z.string().optional(),

  avatar: avatarSchema,
});

// Type exports
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Default values for forms
export const profileUpdateDefaultValues: Partial<ProfileUpdateFormData> = {
  name: "",
  email: "",
  phone: "",
  manager_name: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  tax_number: "",
  latitude: "",
  longitude: "",
  avatar: undefined,
};

// Validation utilities
export const validateAvatarFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "validation.avatar.fileSize" };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: "validation.avatar.fileType" };
  }

  return { isValid: true };
};

// Helper function to check if file type is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};
