import { z } from "zod";

// File validation schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

// Optional file schema (validates when provided)
const optionalFileSchema = z
  .instanceof(File)
  .optional()
  .refine((file) => {
    if (!file) return true;
    return file.size <= MAX_FILE_SIZE;
  }, "حجم الملف يجب أن يكون أقل من 5 ميجابايت")
  .refine((file) => {
    if (!file) return true;
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, "نوع الملف يجب أن يكون JPG, PNG, أو GIF");

// Shop-specific schema (only part name and quantity required)
export const shopPricingSchema = z.object({
  userType: z.literal("shop"),
  partName: z
    .string()
    .min(1, "اسم القطعة مطلوب")
    .min(2, "اسم القطعة يجب أن يكون أكثر من حرف واحد")
    .max(100, "اسم القطعة طويل جداً"),
  quantity: z
    .string()
    .min(1, "الكمية مطلوبة")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    }, "الكمية يجب أن تكون رقم موجب"),
  // Optional fields for shop (not shown in UI but kept for compatibility)
  userCode: z.string().optional(),
  chassisNumber: z.string().optional(),
  partImage: optionalFileSchema,
  requestImage: optionalFileSchema,
  formImage: optionalFileSchema,
});

// Type inference
export type ShopPricingFormData = z.infer<typeof shopPricingSchema>;

// Default values for shop form
export const shopDefaultValues: ShopPricingFormData = {
  userType: "shop",
  partName: "",
  quantity: "",
  userCode: "",
  chassisNumber: "",
  partImage: undefined,
  requestImage: undefined,
  formImage: undefined,
};
