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
  .instanceof(File, { message: "صورة السجل التجاري مطلوبة" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "حجم الملف يجب أن يكون أقل من 5 ميجابايت"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "نوع الملف يجب أن يكون JPG, PNG، أو GIF"
  );

// Location schema for Google Maps data
const locationSchema = z.object({
  address: z.string().min(1, "العنوان مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  region: z.string().min(1, "المنطقة مطلوبة"),
  country: z.string().min(1, "البلد مطلوب"),
  postalCode: z.string().optional(),
  lat: z.number().min(-90).max(90, "خط العرض غير صحيح"),
  lng: z.number().min(-180).max(180, "خط الطول غير صحيح"),
  placeId: z.string().optional(),
  formattedAddress: z.string().min(1, "العنوان المنسق مطلوب"),
});

// Login schema (phone number only)
export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(phonePattern, "يرجى إدخال رقم هاتف صحيح"),
});

// Registration schema
export const registrationSchema = z.object({
  userType: z.enum(["workshop", "store"]),
  shopName: z
    .string()
    .min(1, "اسم المحل أو الورشة مطلوب")
    .min(2, "اسم المحل أو الورشة يجب أن يكون على الأقل حرفين")
    .max(100, "اسم المحل أو الورشة طويل جداً"),
  managerName: z
    .string()
    .min(1, "اسم المدير المسؤول مطلوب")
    .min(2, "اسم المدير المسؤول يجب أن يكون على الأقل حرفين")
    .max(100, "اسم المدير المسؤول طويل جداً"),
  email: z
    .string()
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .optional()
    .or(z.literal("")),
  taxCardNumber: z
    .string()
    .min(1, "رقم البطاقة الضريبية مطلوب")
    .regex(/^[0-9]+$/, "رقم البطاقة الضريبية يجب أن يحتوي على أرقام فقط")
    .min(6, "رقم البطاقة الضريبية يجب أن يكون على الأقل 6 أرقام")
    .max(20, "رقم البطاقة الضريبية طويل جداً"),
  phoneNumber: z
    .string()
    .min(1, "رقم الجوال مطلوب")
    .regex(phonePattern, "يرجى إدخال رقم هاتف صحيح"),
  // Google Maps location data
  location: locationSchema,
  documentImage: documentImageSchema,
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "يجب إدخال 6 أرقام")
    .max(6, "يجب إدخال 6 أرقام")
    .regex(/^[0-9]{6}$/, "يجب إدخال 6 أرقام فقط"),
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
    return { isValid: false, error: "حجم الملف يجب أن يكون أقل من 5 ميجابايت" };
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: "نوع الملف يجب أن يكون JPG, PNG، أو GIF" };
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
