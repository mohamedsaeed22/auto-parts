import { z } from "zod";

// File validation constants (reusing from userPricingSchema for consistency)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

// Common phone number validation pattern
const phonePattern = /^[0-9+\-\s()]+$/;

// Document image validation schema
const documentImageSchema = z
  .instanceof(File, { message: "validation.documentImage.required" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "validation.documentImage.fileSize"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "validation.documentImage.fileType"
  );

// Location schema for Google Maps data
const locationSchema = z.object({
  address: z.string().min(1, "validation.location.address"),
  city: z.string().min(1, "validation.location.city"),
  region: z.string().min(1, "validation.location.region"),
  country: z.string().min(1, "validation.location.country"),
  postalCode: z.string().optional(),
  lat: z.number().min(-90).max(90, "validation.location.lat"),
  lng: z.number().min(-180).max(180, "validation.location.lng"),
  placeId: z.string().optional(),
  formattedAddress: z.string().min(1, "validation.location.formattedAddress"),
});

// Login schema (phone number only) 
export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "validation.phone.required")
    .regex(phonePattern, "validation.phone.invalid"),
});

// Registration schema
export const registrationSchema = z.object({
  userType: z.enum(["workshop", "store"], {
    message: "validation.userType.required",
  }),

  shopName: z
    .string()
    .min(1, "validation.shopName.required")
    .min(2, "validation.shopName.minLength")
    .max(100, "validation.shopName.maxLength"),
  managerName: z
    .string()
    .min(1, "validation.managerName.required")
    .min(2, "validation.managerName.minLength")
    .max(100, "validation.managerName.maxLength"),
  email: z
    .string()
    .email("validation.email.invalid")
    .optional()
    .or(z.literal("")),
  taxCardNumber: z
    .string()
    .min(1, "validation.taxCardNumber.required")
    .regex(/^[0-9]+$/, "validation.taxCardNumber.invalid")
    .min(6, "validation.taxCardNumber.minLength")
    .max(20, "validation.taxCardNumber.maxLength"),
  phoneNumber: z
    .string()
    .min(1, "validation.phone.required")
    .regex(phonePattern, "validation.phone.invalid"),
  // Google Maps location data
  location: locationSchema,
  documentImage: documentImageSchema,
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "validation.otp.length")
    .max(6, "validation.otp.length")
    .regex(/^[0-9]{6}$/, "validation.otp.invalid"),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type LocationData = z.infer<typeof locationSchema>;

// Default values for forms
export const loginDefaultValues: Partial<LoginFormData> = {
  phoneNumber: "",
};

export const registrationDefaultValues: Partial<RegistrationFormData> = {
  userType: "workshop",
  shopName: "",
  managerName: "",
  email: "",
  taxCardNumber: "",
  phoneNumber: "",
  location: {
    address: "",
    city: "",
    region: "",
    country: "",
    postalCode: "",
    lat: 24.7136, // Default to Riyadh coordinates
    lng: 46.6753,
    placeId: "",
    formattedAddress: "",
  },
  documentImage: undefined,
};

export const otpDefaultValues: Partial<OtpFormData> = {
  otp: "",
};

// Validation utilities
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  return phonePattern.test(phoneNumber) && phoneNumber.length > 0;
};

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "validation.documentImage.fileSize" };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: "validation.documentImage.fileType" };
  }

  return { isValid: true };
};

// Helper function to check if file type is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

// Location validation utilities
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const isInSaudiArabia = (lat: number, lng: number): boolean => {
  // Approximate bounds for Saudi Arabia
  const saudiBounds = {
    north: 32.15,
    south: 16.35,
    east: 55.67,
    west: 34.5,
  };

  return (
    lat >= saudiBounds.south &&
    lat <= saudiBounds.north &&
    lng >= saudiBounds.west &&
    lng <= saudiBounds.east
  );
};
