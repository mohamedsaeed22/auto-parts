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

// Required file schema
const requiredFileSchema = z
  .instanceof(File, { message: "الصورة مطلوبة" })
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "حجم الملف يجب أن يكون أقل من 5 ميجابايت"
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "نوع الملف يجب أن يكون JPG, PNG، أو GIF"
  );

// Base schema for common fields
const baseSchema = z.object({
  userType: z.enum(["workshop", "store"], {
    message: "يجب اختيار نوع المستخدم",
  }),
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
});

// Workshop-specific schema (images REQUIRED)
const workshopSchema = baseSchema.extend({
  userType: z.literal("workshop"),
  userCode: z
    .string()
    .min(1, "كود الورشة مطلوب")
    .min(3, "كود الورشة يجب أن يكون أكثر من 3 أحرف")
    .max(20, "كود الورشة طويل جداً"),
  chassisNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return val.length >= 5;
    }, "رقم الهيكل يجب أن يكون أكثر من 5 أحرف"),
  partImage: requiredFileSchema,
  requestImage: requiredFileSchema,
  formImage: requiredFileSchema,
});

// Store-specific schema (images OPTIONAL)
const storeSchema = baseSchema.extend({
  userType: z.literal("store"),
  userCode: z.string().optional(),
  chassisNumber: z.string().optional(),
  partImage: optionalFileSchema,
  requestImage: optionalFileSchema,
  formImage: optionalFileSchema,
});

// Main schema using discriminated union
export const userPricingSchema = z.discriminatedUnion("userType", [
  workshopSchema,
  storeSchema,
]);

// Type inference
export type UserPricingFormData = z.infer<typeof userPricingSchema>;

// Helper type for saved form data
export type SavedFormData = UserPricingFormData & {
  id: string;
  partImagePreview: string | null;
  requestImagePreview: string | null;
  formImagePreview: string | null;
  submittedAt: Date;
};

// Default values
export const defaultValues: Partial<UserPricingFormData> = {
  userType: "workshop",
  userCode: "",
  partName: "",
  quantity: "",
  chassisNumber: "",
  partImage: undefined,
  requestImage: undefined,
  formImage: undefined,
};
